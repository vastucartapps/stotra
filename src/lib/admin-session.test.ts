import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken, SESSION_TTL_SECONDS } from "./admin-session.ts";
import { createLoginThrottle } from "./login-throttle.ts";

const SECRET = "a".repeat(40);
const OTHER = "b".repeat(40);

test("a freshly issued token verifies", async () => {
  assert.equal(await verifySessionToken(await createSessionToken(SECRET), SECRET), true);
});

test("a token signed with another secret is rejected", async () => {
  assert.equal(await verifySessionToken(await createSessionToken(OTHER), SECRET), false);
});

test("the old forged-cookie shape is rejected", async () => {
  assert.equal(await verifySessionToken("a".repeat(40), SECRET), false);
  assert.equal(await verifySessionToken("v1.9999999999.aaaaaaaaaaaaaaaaaaaaaa." + "A".repeat(43), SECRET), false);
});

test("tampering with expiry, nonce or signature is rejected", async () => {
  const [v, exp, nonce, sig] = (await createSessionToken(SECRET)).split(".");
  assert.equal(await verifySessionToken([v, String(Number(exp) + 1), nonce, sig].join("."), SECRET), false);
  assert.equal(await verifySessionToken([v, exp, "A".repeat(22), sig].join("."), SECRET), false);
  assert.equal(await verifySessionToken([v, exp, nonce, "A".repeat(43)].join("."), SECRET), false);
});

test("expired tokens are rejected", async () => {
  const issued = Date.now();
  const token = await createSessionToken(SECRET, issued);
  assert.equal(await verifySessionToken(token, SECRET, issued + (SESSION_TTL_SECONDS - 5) * 1000), true);
  assert.equal(await verifySessionToken(token, SECRET, issued + (SESSION_TTL_SECONDS + 5) * 1000), false);
});

test("a token with an over-long lifetime is rejected", async () => {
  const farFuture = await createSessionToken(SECRET, Date.now() + 10 * 24 * 3600 * 1000);
  assert.equal(await verifySessionToken(farFuture, SECRET), false);
});

test("malformed input never throws", async () => {
  for (const bad of ["", ".", "v1", "v1.1.2.3.4", "v2.1.x.y", "v1.abc.x.y", "💥"]) {
    assert.equal(await verifySessionToken(bad, SECRET), false);
  }
});

test("throttle locks a client after repeated failures and releases after the window", () => {
  let t = 0;
  const throttle = createLoginThrottle({ maxFailuresPerClient: 3, maxFailuresGlobal: 100, windowMs: 1000, now: () => t });
  for (let i = 0; i < 3; i++) throttle.recordFailure("ip");
  assert.ok(throttle.retryAfterSeconds("ip") > 0);
  assert.equal(throttle.retryAfterSeconds("other"), 0);
  t = 1500;
  assert.equal(throttle.retryAfterSeconds("ip"), 0);
});

test("a success clears the client's failures", () => {
  const throttle = createLoginThrottle({ maxFailuresPerClient: 2, maxFailuresGlobal: 100, windowMs: 1000, now: () => 0 });
  throttle.recordFailure("ip");
  throttle.recordSuccess("ip");
  throttle.recordFailure("ip");
  assert.equal(throttle.retryAfterSeconds("ip"), 0);
});

test("the global cap blocks rotating client keys", () => {
  const throttle = createLoginThrottle({ maxFailuresPerClient: 5, maxFailuresGlobal: 4, windowMs: 1000, now: () => 0 });
  for (let i = 0; i < 4; i++) throttle.recordFailure(`ip-${i}`);
  assert.ok(throttle.retryAfterSeconds("brand-new-ip") > 0);
});
