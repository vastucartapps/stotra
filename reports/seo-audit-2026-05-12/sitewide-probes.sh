#!/bin/bash
# Verify site-wide bug classes A, B, Q via direct probes against production.

set -u
OUT="/tmp/sitewide-probes.txt"
{
echo "=== A. /_next/ blocked in robots.txt ==="
curl -sS https://stotra.vastucart.in/robots.txt
echo
echo
echo "=== B. AI/SEO bot 403 in middleware ==="
echo "Probing 8 bots with Googlebot as control. Expect all 200 (not 403)."
for ua in \
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)" \
  "Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)" \
  "Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)" \
  "Mozilla/5.0 (compatible; anthropic-ai)" \
  "Mozilla/5.0 (compatible; Claude-Web/1.0)" \
  "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" \
  "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://www.perplexity.ai/bot)" \
  "Mozilla/5.0 (compatible; CCBot/2.0; +https://commoncrawl.org/faq/)" \
  "Mozilla/5.0 (compatible; Applebot-Extended/1.0)" \
  "Mozilla/5.0 (compatible; Google-Extended/1.0)" \
  "Mozilla/5.0 (compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)" \
  "Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)"
do
  shortname=$(echo "$ua" | grep -oE '[A-Za-z][A-Za-z0-9_-]*[Bb]ot[A-Za-z0-9_-]*|[A-Za-z]+-?[Aa][Ii]|GPT[A-Za-z-]*|ChatGPT[A-Za-z-]*|Claude[A-Za-z-]*|Perplexity[A-Za-z-]*|CCBot|Applebot[A-Za-z-]*|Bytespider' | head -1)
  http=$(curl -sS -o /dev/null -A "$ua" -w "%{http_code}" --max-time 15 https://stotra.vastucart.in/stotra/hanuman-chalisa)
  echo "  $shortname → HTTP $http"
done

echo
echo "=== Q. Sitemap lastmod stability (fetch twice, compare) ==="
echo "Fetch 1:"
ts1=$(curl -sS https://stotra.vastucart.in/sitemap-stotras.xml | grep -oE '<lastmod>[^<]+</lastmod>' | head -1)
echo "  first lastmod: $ts1"
sleep 2
echo "Fetch 2:"
ts2=$(curl -sS https://stotra.vastucart.in/sitemap-stotras.xml | grep -oE '<lastmod>[^<]+</lastmod>' | head -1)
echo "  second lastmod: $ts2"
if [ "$ts1" = "$ts2" ]; then
  echo "  STATUS: stable (cached at edge)"
else
  echo "  STATUS: CHANGES PER REQUEST → bug Q confirmed"
fi
echo
echo "=== Sample 5 stotra lastmods (should reflect file updatedAt, not 'now') ==="
curl -sS https://stotra.vastucart.in/sitemap-stotras.xml | grep -oE '<loc>[^<]+</loc>|<lastmod>[^<]+</lastmod>' | paste - - | head -10
} | tee "$OUT"
echo
echo "Wrote: $OUT"
