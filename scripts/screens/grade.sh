#!/usr/bin/env bash
# Cool-grade Locus window captures before they go under public/app/screens.
#
# Why: the app's light theme is warm paper on purpose (Theme.swift, light
# palette: surface #F8F5F0, background #F0EDE5) while the site is a cool
# near-white (--bg #ECF1F8, --surface #F5F8FC). Side by side, the captures read
# as yellowed. Retaking them does not help — the tint is the app's own palette,
# not the capture — so we grade on import instead: a per-channel white-balance
# shift that maps the app's paper onto the site's surface. It is a plain
# multiply per channel, so alpha (the baked-in window shadow) and dimensions
# (2784×1824, pinned by app-showcase.test.ts) are untouched.
#
#   scripts/screens/grade.sh -o public/app/screens ~/Desktop/home.png ...
#   scripts/screens/grade.sh --neutral -o out/ capture.png   # kill the warmth only
#
# Presets (paper #F8F5F0 →):
#   cool     #F5F8FC — the site's --surface; the window looks native to the page
#   neutral  #F6F6F6 — no warmth, no blue; safer if the cool one feels tinted
#
# Remember next.config.ts: optimised variants are edge-cached for 31 days, so a
# replaced capture needs a NEW filename (home-v2.png → home-v3.png) and the
# matching `src` bump in src/content/app-showcase.ts.
set -euo pipefail

preset=cool
out=""
files=()
while (($#)); do
  case "$1" in
    --cool) preset=cool ;;
    --neutral) preset=neutral ;;
    -o|--out) out="$2"; shift ;;
    -h|--help) sed -n '2,22p' "$0"; exit 0 ;;
    -*) echo "unknown flag: $1" >&2; exit 2 ;;
    *) files+=("$1") ;;
  esac
  shift
done

if [[ -z "$out" || ${#files[@]} -eq 0 ]]; then
  echo "usage: $0 [--cool|--neutral] -o OUT_DIR capture.png..." >&2
  exit 2
fi
command -v magick >/dev/null || { echo "ImageMagick (magick) not found — brew install imagemagick" >&2; exit 1; }

case "$preset" in
  cool)    r=0.988; g=1.012; b=1.050 ;;
  neutral) r=0.992; g=1.004; b=1.025 ;;
esac

mkdir -p "$out"
for f in "${files[@]}"; do
  dest="$out/$(basename "$f")"
  magick "$f" \
    -channel R -evaluate multiply "$r" \
    -channel G -evaluate multiply "$g" \
    -channel B -evaluate multiply "$b" \
    +channel "$dest"
  paper=$(magick "$dest" -alpha off -format %c -depth 8 histogram:info:- | sort -rn | awk 'NR==1{c=$3} END{print c}')
  echo "$(basename "$f") → $dest  ($preset, dominant colour now $paper)"
done
