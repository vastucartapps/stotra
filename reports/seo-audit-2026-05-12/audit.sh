#!/bin/bash
# Per-URL audit — captures everything needed for indexing-bug classification.
# Output: TSV row to stdout.
# Columns:
#   url, http, content_type, x_robots_tag,
#   canonical, hreflang_count, hreflang_x_default,
#   og_url, og_locale, og_type,
#   html_lang, robots_meta, title_len, h1_count,
#   jsonld_count, jsonld_types,
#   has_undefined_in_canonical, body_size, server

set -uo pipefail
url="$1"
ua="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

# fetch headers + body in one shot, separator: HEADERSPLIT
tmp=$(mktemp)
hdr=$(mktemp)
http=$(curl -sS -L --max-time 25 -A "$ua" -o "$tmp" -D "$hdr" -w "%{http_code}" "$url" 2>/dev/null)
[ -z "$http" ] && http="ERR"

content_type=$(awk 'BEGIN{IGNORECASE=1} /^content-type:/{sub(/^[^:]*: */,""); sub(/\r$/,""); print; exit}' "$hdr")
x_robots_tag=$(awk 'BEGIN{IGNORECASE=1} /^x-robots-tag:/{sub(/^[^:]*: */,""); sub(/\r$/,""); print; exit}' "$hdr")
server=$(awk 'BEGIN{IGNORECASE=1} /^server:/{sub(/^[^:]*: */,""); sub(/\r$/,""); print; exit}' "$hdr")
body_size=$(wc -c < "$tmp")

# Only parse HTML body when we got HTML
canonical=""
hreflang_count=0
hreflang_x_default="no"
og_url=""
og_locale=""
og_type=""
html_lang=""
robots_meta=""
title_len=0
h1_count=0
jsonld_count=0
jsonld_types=""
has_undef="no"

if echo "$content_type" | grep -qi "html"; then
  canonical=$(grep -oE '<link[^>]*rel=["'\'']canonical["'\''][^>]*>' "$tmp" | head -1 | grep -oE 'href=["'\''][^"'\'']*["'\'']' | head -1 | sed -E 's/href=["'\'']//; s/["'\'']$//')
  hreflang_count=$(grep -cE '<link[^>]*hreflang=' "$tmp" || true)
  if grep -qE 'hreflang=["'\'']x-default["'\'']' "$tmp"; then hreflang_x_default="yes"; fi
  og_url=$(grep -oE '<meta[^>]*property=["'\'']og:url["'\''][^>]*>' "$tmp" | head -1 | grep -oE 'content=["'\''][^"'\'']*["'\'']' | head -1 | sed -E 's/content=["'\'']//; s/["'\'']$//')
  og_locale=$(grep -oE '<meta[^>]*property=["'\'']og:locale["'\''][^>]*>' "$tmp" | head -1 | grep -oE 'content=["'\''][^"'\'']*["'\'']' | head -1 | sed -E 's/content=["'\'']//; s/["'\'']$//')
  og_type=$(grep -oE '<meta[^>]*property=["'\'']og:type["'\''][^>]*>' "$tmp" | head -1 | grep -oE 'content=["'\''][^"'\'']*["'\'']' | head -1 | sed -E 's/content=["'\'']//; s/["'\'']$//')
  html_lang=$(grep -oE '<html[^>]*lang=["'\''][^"'\'']*["'\'']' "$tmp" | head -1 | grep -oE 'lang=["'\''][^"'\'']*["'\'']' | sed -E 's/lang=["'\'']//; s/["'\'']$//')
  robots_meta=$(grep -oE '<meta[^>]*name=["'\'']robots["'\''][^>]*>' "$tmp" | head -1 | grep -oE 'content=["'\''][^"'\'']*["'\'']' | head -1 | sed -E 's/content=["'\'']//; s/["'\'']$//')
  title_text=$(awk 'BEGIN{IGNORECASE=1; RS="</title>"} NR==1{ sub(/.*<title[^>]*>/,""); print; exit }' "$tmp" | tr -d '\n\r')
  title_len=${#title_text}
  h1_count=$(grep -cE '<h1[ >]' "$tmp" || true)
  jsonld_count=$(grep -cE '<script[^>]*type=["'\'']application/ld\+json["'\'']' "$tmp" || true)
  # extract jsonld types (compact, comma-joined)
  jsonld_types=$(grep -oE '"@type"[[:space:]]*:[[:space:]]*"[^"]+"' "$tmp" | sed -E 's/.*"([^"]+)"$/\1/' | sort -u | paste -sd, -)
  if echo "$canonical" | grep -q "/undefined"; then has_undef="yes"; fi
  if echo "$canonical" | grep -q "//undefined"; then has_undef="yes"; fi
fi

rm -f "$tmp" "$hdr"

# tab-delimited, replace any tab/newline in fields with spaces
clean() { echo -n "$1" | tr '\t\n\r' '   '; }
printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
  "$(clean "$url")" \
  "$(clean "$http")" \
  "$(clean "$content_type")" \
  "$(clean "$x_robots_tag")" \
  "$(clean "$canonical")" \
  "$(clean "$hreflang_count")" \
  "$(clean "$hreflang_x_default")" \
  "$(clean "$og_url")" \
  "$(clean "$og_locale")" \
  "$(clean "$og_type")" \
  "$(clean "$html_lang")" \
  "$(clean "$robots_meta")" \
  "$(clean "$title_len")" \
  "$(clean "$h1_count")" \
  "$(clean "$jsonld_count")" \
  "$(clean "$jsonld_types")" \
  "$(clean "$has_undef")" \
  "$(clean "$body_size")" \
  "$(clean "$server")"
