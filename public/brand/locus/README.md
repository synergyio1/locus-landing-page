# Locus mark

The disc (the *locus*) with one tapered slot carved out of it — a hairline that swells into a
compounding curve as it leaves the circle. Navy tile `#08152A`, disc `#66A1F0 → #3474E0`.

- `build_mark.py` — source of truth (SVG masters + `locus-mark.ts` for the site). Re-run: `python3 build_mark.py .`
- `raster_mark.py` — alpha-correct PNGs via ImageMagick draw (Quick Look/MSVG can't do this). `python3 raster_mark.py build_mark.py out/`
- `locus-mark-path.svg` / `locus-mark-path-small.svg` — single-path web marks (currentColor); small = wider slot for ≤32px.
- `locus-icon-square.svg` / `locus-icon-1024.png` — full-bleed square (iOS, Icon Composer).
- `locus-icon-macos.svg` / `AppIcon_Locus.iconset` / `AppIcon_Locus.icns` — Apple macOS template (824 in 1024).
- The cyan "thread" variant is kept in the generator behind `THREAD=1` (off by default).
