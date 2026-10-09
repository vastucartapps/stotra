/**
 * In-memory login throttle: per-client and global failure caps.
 *
 * The global cap is the backstop. Client keys come from request headers, which
 * a caller who reaches the origin directly can vary, so a per-client limit
 * alone could be sidestepped; the global limit cannot.
 * State lives in one process, which matches the single-container deployment.
 */

export interface ThrottleOptions {
  maxFailuresPerClient: number;
  maxFailuresGlobal: number;
  windowMs: number;
  now?: () => number;
}

interface Bucket {
  failures: number;
  windowStart: number;
}

export interface LoginThrottle {
  /** Seconds the caller must wait, or 0 when an attempt is allowed. */
  retryAfterSeconds(client: string): number;
  recordFailure(client: string): void;
  recordSuccess(client: string): void;
}

export function createLoginThrottle(options: ThrottleOptions): LoginThrottle {
  const now = options.now ?? Date.now;
  const clients = new Map<string, Bucket>();
  let global: Bucket = { failures: 0, windowStart: now() };

  const fresh = (bucket: Bucket): Bucket =>
    now() - bucket.windowStart >= options.windowMs ? { failures: 0, windowStart: now() } : bucket;

  const wait = (bucket: Bucket): number => Math.max(1, Math.ceil((bucket.windowStart + options.windowMs - now()) / 1000));

  return {
    retryAfterSeconds(client) {
      global = fresh(global);
      if (global.failures >= options.maxFailuresGlobal) return wait(global);
      const bucket = clients.get(client);
      if (!bucket) return 0;
      const current = fresh(bucket);
      clients.set(client, current);
      return current.failures >= options.maxFailuresPerClient ? wait(current) : 0;
    },
    recordFailure(client) {
      global = fresh(global);
      global.failures += 1;
      const current = fresh(clients.get(client) ?? { failures: 0, windowStart: now() });
      current.failures += 1;
      clients.set(client, current);
      if (clients.size > 5000) {
        for (const [key, bucket] of clients) if (now() - bucket.windowStart >= options.windowMs) clients.delete(key);
      }
    },
    recordSuccess(client) {
      clients.delete(client);
    },
  };
}
