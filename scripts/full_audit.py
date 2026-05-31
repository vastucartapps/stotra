"""
Full browser audit: console messages, failed requests, slow resources,
performance timings, HTML size, mobile layout check.
"""

import json
import time
from playwright.sync_api import sync_playwright

URLS = [
    "https://stotra.vastucart.in/stotra/aditya-hridayam",
    "https://stotra.vastucart.in/deity/vishnu",
    "https://stotra.vastucart.in/",
    "https://stotra.vastucart.in/festival",
    "https://stotra.vastucart.in/today",
]

SLOW_THRESHOLD_MS = 3000

def audit_page(page, url, label):
    console_messages = []
    failed_requests = []
    slow_resources = []
    request_start_times = {}

    def on_console(msg):
        console_messages.append({
            "type": msg.type,
            "text": msg.text,
            "location": f"{msg.location.get('url','?')}:{msg.location.get('lineNumber','?')}"
        })

    def on_request(req):
        request_start_times[req.url] = time.time()

    def on_response(resp):
        req_url = resp.url
        status = resp.status
        start = request_start_times.get(req_url, None)
        elapsed_ms = (time.time() - start) * 1000 if start else None

        if status >= 400:
            failed_requests.append({
                "url": req_url,
                "status": status,
                "resource_type": resp.request.resource_type,
                "initiator": resp.request.headers.get("referer", "direct"),
            })

        if elapsed_ms and elapsed_ms > SLOW_THRESHOLD_MS:
            slow_resources.append({
                "url": req_url,
                "elapsed_ms": round(elapsed_ms),
                "status": status,
            })

    def on_request_failed(req):
        failed_requests.append({
            "url": req.url,
            "status": "FAILED/BLOCKED",
            "resource_type": req.resource_type,
            "failure": req.failure,
            "initiator": req.headers.get("referer", "direct"),
        })

    page.on("console", on_console)
    page.on("request", on_request)
    page.on("response", on_response)
    page.on("requestfailed", on_request_failed)

    try:
        page.goto(url, wait_until="networkidle", timeout=60000)
    except Exception as e:
        print(f"  [GOTO ERROR] {e}")

    # Wait a bit for any deferred JS
    page.wait_for_timeout(2000)

    # Performance timings via JS
    perf = page.evaluate("""() => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const paint = {};
        performance.getEntriesByType('paint').forEach(e => { paint[e.name] = e.startTime; });

        // LCP
        let lcp = null;
        try {
            const obs = new PerformanceObserver(() => {});
            const entries = performance.getEntriesByType('largest-contentful-paint');
            if (entries.length) lcp = entries[entries.length - 1].startTime;
        } catch(e) {}

        // CLS from layout-shift entries
        let cls = 0;
        try {
            performance.getEntriesByType('layout-shift').forEach(e => { cls += e.value; });
        } catch(e) {}

        return {
            domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
            load: nav.loadEventEnd - nav.startTime,
            firstPaint: paint['first-paint'],
            firstContentfulPaint: paint['first-contentful-paint'],
            lcp: lcp,
            cls: Math.round(cls * 10000) / 10000,
            transferSize: nav.transferSize,
            encodedBodySize: nav.encodedBodySize,
            decodedBodySize: nav.decodedBodySize,
        };
    }""")

    # Final rendered HTML size
    html_size = len(page.content())

    return {
        "label": label,
        "url": url,
        "console_messages": console_messages,
        "failed_requests": failed_requests,
        "slow_resources": slow_resources,
        "perf": perf,
        "html_size_bytes": html_size,
    }


def run_audit(viewport_width, viewport_height, viewport_label, urls):
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])
        context = browser.new_context(
            viewport={"width": viewport_width, "height": viewport_height},
            user_agent="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        )
        page = context.new_page()

        for url in urls:
            label = url.replace("https://stotra.vastucart.in", "") or "/"
            print(f"  Auditing [{viewport_label}] {label} ...")
            result = audit_page(page, url, label)
            results.append(result)

        browser.close()
    return results


def main():
    print("=== DESKTOP AUDIT (1920x1080) ===")
    desktop_results = run_audit(1920, 1080, "desktop", URLS)

    print("\n=== MOBILE AUDIT (375x812) ===")
    mobile_results = run_audit(375, 812, "mobile", URLS)

    output = {
        "desktop": desktop_results,
        "mobile": mobile_results,
    }

    out_path = "/mnt/c/Users/3060-5/Documents/VastuCart_Ecosys/Stotra/scripts/audit_results.json"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nResults written to {out_path}")


if __name__ == "__main__":
    main()
