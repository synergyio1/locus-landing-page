#!/usr/bin/env python3
"""Rasterise the Locus mark with ImageMagick primitives (alpha-preserving).
Usage: raster_mark.py <build_mark.py> <outdir>
Produces 1024px PNGs: icon-square.png (iOS full-bleed), icon-macos.png (824 squircle, transparent
margins), mark-cutout.png (transparent glyph, true cutout, DISC_FLAT), mark-cutout-sky.png (#6BA6F2),
mark-cutout-cobalt.png (#0047AB)."""
import runpy, subprocess, sys, os, tempfile

build, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
tmp = tempfile.mkdtemp()
sys.argv = [build, tmp]
g = runpy.run_path(build, run_name="geom")  # executes build_mark.py; SVG side-effects go to tmp

CX, CY, R, W = g["CX"], g["CY"], g["R"], g["W"]
CUT_D, BASE_Y = g["CUT_D"], g["BASE_Y"]
THREAD_D, THREAD_W, THREAD_COLOR = g["THREAD_D"], g["THREAD_W"], g["THREAD_COLOR"]
THREAD_ENABLED = g.get("THREAD_ENABLED", False)
TILE, TOP, BOT, FLAT = g["TILE"], g["DISC_TOP"], g["DISC_BOT"], g["DISC_FLAT"]
SZ = 1024

def run(cmd):
    subprocess.run(cmd, check=True)

def thread_draw(scale=1.0, off=(0, 0)):
    if not THREAD_ENABLED:
        return []
    return ["-fill", "none", "-stroke", THREAD_COLOR, "-strokewidth", f"{THREAD_W * scale:.2f}",
            "-draw", f"stroke-linecap round stroke-linejoin round translate {off[0]},{off[1]} scale {scale:.6f},{scale:.6f} path '{THREAD_D}'"]
def cut_draw(color):
    """-draw args for the carved path as ONE filled shape in `color`"""
    return ["-stroke", "none", "-fill", color, "-draw", f"path '{CUT_D}'"]

# gradient disc (top->bottom) masked to a circle, on transparent 1024 canvas
disc = f"{tmp}/disc.png"
run(["magick", "-size", f"{SZ}x{SZ}", f"gradient:{TOP}-{BOT}",
     "(", "-size", f"{SZ}x{SZ}", "xc:none", "-fill", "white",
     "-draw", f"circle {CX:.2f},{CY:.2f} {CX + R:.2f},{CY:.2f}", ")",
     "-compose", "CopyOpacity", "-composite", disc])
# NOTE: gradient spans the full canvas; disc occupies the middle ~63%, so the visible ramp is subtle by design.

# 1) iOS / Icon Composer full-bleed square
run(["magick", "-size", f"{SZ}x{SZ}", f"xc:{TILE}", disc, "-compose", "Over", "-composite",
     *cut_draw(TILE), *thread_draw(), f"{out}/icon-square.png"])

# 2) macOS: 824 squircle centred, transparent margins; glyph scaled 824/1024 about the centre
M, SIDE, RAD = 100, 824, 185
sc = SIDE / SZ
disc_m = f"{tmp}/disc_m.png"
run(["magick", disc, "-resize", f"{SIDE}x{SIDE}", "-background", "none", "-gravity", "center",
     "-extent", f"{SZ}x{SZ}", disc_m])
def cut_draw_scaled(color):
    return ["-stroke", "none", "-fill", color, "-draw", f"translate {M},{M} scale {sc:.6f},{sc:.6f} path '{CUT_D}'"]
run(["magick", "-size", f"{SZ}x{SZ}", "xc:none", "-fill", TILE, "-stroke", "none",
     "-draw", f"roundrectangle {M},{M} {M + SIDE - 1},{M + SIDE - 1} {RAD},{RAD}",
     disc_m, "-compose", "Over", "-composite",
     *cut_draw_scaled(TILE), *thread_draw(scale=sc, off=(M, M)), f"{out}/icon-macos.png"])

# 3) transparent glyph with TRUE cutout: solid disc minus the cut (DstOut)
for name, color in (("mark-cutout", FLAT), ("mark-cutout-sky", "#6BA6F2"), ("mark-cutout-cobalt", "#0047AB"), ("mark-cutout-black", "#000000"), ("mark-cutout-white", "#FFFFFF")):
    cutimg = f"{tmp}/cut.png"
    run(["magick", "-size", f"{SZ}x{SZ}", "xc:none",
         *cut_draw("white"), cutimg])
    run(["magick", "-size", f"{SZ}x{SZ}", "xc:none", "-fill", color, "-stroke", "none",
         "-draw", f"circle {CX:.2f},{CY:.2f} {CX + R:.2f},{CY:.2f}",
         cutimg, "-compose", "DstOut", "-composite", f"{out}/{name}.png"])

print("rasterised into", out, sorted(os.listdir(out)))
