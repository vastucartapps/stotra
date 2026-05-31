#!/usr/bin/env python3
"""Class V — Playwright Googlebot render audit.

Render each URL with Chromium + Googlebot smartphone UA, capture:
- total resources requested vs successfully loaded
- failed (4xx/5xx) resources
- blocked resources
- console errors
- uncaught JS exceptions (pageerror)
- rendered body text length

Output: JSON array, one row per URL.
Usage:
  python3 scripts/class-v-render-audit.py URLS_FILE OUTPUT_FILE [CONCURRENCY]
"""
import asyncio, json, sys, time
from playwright.async_api import async_playwright

GOOGLEBOT_UA = (
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile "
    "Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
)

async def audit_url(context, url, timeout_ms=20000):
    page = await context.new_page()
    requested = []   # list of {url, resourceType}
    finished = []    # list of {url, status, resourceType}
    failed = []      # list of {url, failureText, resourceType}
    console_errors = []
    page_errors = []

    page.on("request", lambda r: requested.append({"url": r.url, "type": r.resource_type}))
    page.on("response", lambda r: finished.append({"url": r.url, "status": r.status, "type": r.request.resource_type}))
    page.on("requestfailed", lambda r: failed.append({"url": r.url, "failure": (r.failure or "unknown"), "type": r.resource_type}))
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text}) if m.type == "error" else None)

    started = time.time()
    nav_status = None
    nav_error = None
    try:
        resp = await page.goto(url, wait_until="networkidle", timeout=timeout_ms)
        nav_status = resp.status if resp else None
    except Exception as e:
        nav_error = str(e)[:200]

    body_len = 0
    title = ""
    try:
        body_len = await page.evaluate("() => document.body ? document.body.innerText.length : 0")
        title = await page.evaluate("() => document.title")
    except Exception:
        pass
    elapsed = round(time.time() - started, 2)

    await page.close()

    n_req = len(requested)
    n_ok = sum(1 for f in finished if 200 <= f["status"] < 400)
    n_bad = sum(1 for f in finished if f["status"] >= 400)
    n_failed = len(failed)
    ratio = round(n_ok / max(n_req, 1), 3)

    return {
        "url": url,
        "nav_status": nav_status,
        "nav_error": nav_error,
        "title": title,
        "rendered_text_length": body_len,
        "resources_total": n_req,
        "resources_ok": n_ok,
        "resources_4xx_5xx": n_bad,
        "resources_failed": n_failed,
        "ok_ratio": ratio,
        "failed_samples": [f["url"] for f in failed[:5]],
        "bad_status_samples": [{"url": f["url"], "status": f["status"]} for f in finished if f["status"] >= 400][:5],
        "console_errors": [c["text"][:200] for c in console_errors][:10],
        "page_errors": [p[:300] for p in page_errors][:5],
        "elapsed_s": elapsed,
    }


async def worker(name, queue, context, results, log_every=10):
    while True:
        item = await queue.get()
        if item is None:
            queue.task_done()
            return
        idx, url = item
        try:
            r = await audit_url(context, url)
        except Exception as e:
            r = {"url": url, "nav_error": f"audit-exception: {str(e)[:200]}", "ok_ratio": 0.0}
        results[idx] = r
        if (idx + 1) % log_every == 0:
            done = sum(1 for x in results if x is not None)
            print(f"  [{name}] {done}/{len(results)} done", flush=True)
        queue.task_done()


async def main():
    urls_file = sys.argv[1]
    out_file = sys.argv[2]
    concurrency = int(sys.argv[3]) if len(sys.argv) > 3 else 6

    with open(urls_file) as f:
        urls = json.load(f)
    print(f"Auditing {len(urls)} URLs with concurrency={concurrency}", flush=True)
    results = [None] * len(urls)
    queue = asyncio.Queue()
    for i, u in enumerate(urls):
        queue.put_nowait((i, u))

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=GOOGLEBOT_UA,
            viewport={"width": 412, "height": 915},
            device_scale_factor=2.625,
            is_mobile=True,
            has_touch=True,
        )
        workers = [asyncio.create_task(worker(f"w{i}", queue, context, results)) for i in range(concurrency)]
        for _ in range(concurrency):
            queue.put_nowait(None)
        await queue.join()
        for w in workers:
            await w
        await context.close()
        await browser.close()

    with open(out_file, "w") as f:
        json.dump(results, f, indent=2)

    # Summary
    total = len(results)
    rendered_empty = sum(1 for r in results if r and r.get("rendered_text_length", 0) < 500)
    nav_fail = sum(1 for r in results if r and (r.get("nav_error") or (r.get("nav_status") or 500) >= 400))
    low_ratio = sum(1 for r in results if r and r.get("ok_ratio", 0) < 0.95)
    console_err = sum(1 for r in results if r and r.get("console_errors"))
    page_err = sum(1 for r in results if r and r.get("page_errors"))
    print(f"\n=== SUMMARY ({total} URLs) ===")
    print(f"  nav failures (4xx/5xx/error): {nav_fail}")
    print(f"  resource ok_ratio < 0.95:    {low_ratio}")
    print(f"  console errors present:       {console_err}")
    print(f"  page errors (JS exceptions):  {page_err}")
    print(f"  rendered body < 500 chars:    {rendered_empty}")
    print(f"  written: {out_file}")


if __name__ == "__main__":
    asyncio.run(main())
