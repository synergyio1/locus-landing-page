#!/usr/bin/env python3
"""Locus mark generator — 'noise compounding into signal, carved into the circle'.

Geometry lives in a 1024x1024 coordinate space.
Outputs (into OUT):
  locus-mark.svg              glyph only, currentColor, TRUE transparent cutout (mask) — web/nav
  locus-mark-flat.svg         glyph only, opaque construction (disc + tile-coloured cut) — rasteriser-safe
  locus-icon-square.svg       full-bleed 1024 tile (iOS / Icon Composer source)
  locus-icon-macos.svg        1024 canvas, 824 squircle centred (Apple macOS template)
"""
import math, os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "."
os.makedirs(OUT, exist_ok=True)

# ---- palette -------------------------------------------------------------
TILE      = "#08152A"   # site --bg / navy ink
DISC_TOP  = "#66A1F0"   # --accent-text (sky)
DISC_BOT  = "#3474E0"   # mid cobalt (kept light enough to sit on navy)
DISC_FLAT = "#4A8BEB"   # single tone used for flat variants

# ---- geometry ------------------------------------------------------------
K = 1.08                                  # glyph scale about the tile centre (fills the tile like Apple icons)
CX, CY, R = 512.0, 512.0, 300.0 * K      # disc
BASE_Y    = CY + R - 0.35 * 2 * R        # flat baseline of the cut  (=602)
W         = float(os.environ.get("CUT_W", "62.0")) * K                          # cut width (stroke)
CAP       = W / 2

# tapered cut: starts thin near the disc's left rim and grows to full width W by the rim exit
X_START = 512 + (252.0 - 512) * K              # thin start (just inside the left rim)
X0      = 512 + (440.0 - 512) * K              # exponential anchor (where the curve leaves the "flat")
W0      = float(os.environ.get("CUT_W0", "6.0")) * K                              # start width
TAPER_P = 1.35                                 # >1 = stays thin longer, then swells (compounding)

# exponential J-curve: y = BASE_Y - a*(exp((x-X0)/s) - 1); passes through the
# disc edge at 45° upper-right and continues a little past the rim.
S = 95.0 * K
X_EXIT, Y_EXIT = CX + R / math.sqrt(2), CY - R / math.sqrt(2)
A = (BASE_Y - Y_EXIT) / (math.exp((X_EXIT - X0) / S) - 1)

def y_of(x):  return BASE_Y - A * (math.exp((x - X0) / S) - 1)
def dy_of(x): return -A / S * math.exp((x - X0) / S)

X_END = 512 + (762.0 - 512) * K
N = 160
xs = [X_START + (X_END - X_START) * i / N for i in range(N + 1)]
pts = [(x, y_of(x)) for x in xs]

# arc length to the rim exit -> width parameter
def arclen(upto):
    L, acc = 0.0, [0.0]
    for i in range(1, len(pts)):
        L += math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); acc.append(L)
    return acc
ACC = arclen(pts)
L_EXIT = next(ACC[i] for i in range(len(xs)) if xs[i] >= X_EXIT)
def width_at(i):
    t = min(1.0, ACC[i] / L_EXIT)
    return W0 + (W - W0) * (t ** TAPER_P)

# build the outline: left offsets forward, round cap, right offsets backward, round cap
left, right = [], []
for i, (x, y) in enumerate(pts):
    dx, dy = 1.0, dy_of(x); n = math.hypot(dx, dy); nx, ny = -dy / n, dx / n
    h = width_at(i) / 2
    left.append((x + nx * h, y + ny * h)); right.append((x - nx * h, y - ny * h))

def cap(center, r, from_pt, to_pt, steps=14):
    a0 = math.atan2(from_pt[1]-center[1], from_pt[0]-center[0])
    a1 = math.atan2(to_pt[1]-center[1], to_pt[0]-center[0])
    # sweep the short way that goes "outward" past the path end: choose direction by tangent
    da = a1 - a0
    while da <= -math.pi: da += 2*math.pi
    while da > math.pi: da -= 2*math.pi
    return [(center[0] + r*math.cos(a0 + da*k/steps), center[1] + r*math.sin(a0 + da*k/steps)) for k in range(1, steps)]

end_r, start_r = width_at(N)/2, width_at(0)/2
outline = left + cap(pts[-1], end_r, left[-1], right[-1]) + right[::-1] + cap(pts[0], start_r, right[0], left[0])
CUT_D = "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in outline) + " Z"

# ---- the "thread": a delicate sine riding the signal line, crossing back and forth ----
THREAD_ENABLED = os.environ.get("THREAD", "0") == "1"   # off for now (Luis, 2026-08-17)
THREAD_COLOR = "#8FD8FF"      # light cyan, inside the blue family
THREAD_W     = 6.5 * K        # hairline
THREAD_AMP0  = 22.0 * K       # amplitude at the start...
THREAD_AMP1  = 5.0 * K        # ...decaying to this by the rim (hugs the line as it compounds)
THREAD_PER   = 175.0 * K      # wavelength along the path
THREAD_DECAY = 0.9

def normal_at(i):
    dx, dy = 1.0, dy_of(xs[i]); n = math.hypot(dx, dy); return (-dy / n, dx / n)

thread_pts = []
for i in range(len(pts)):
    if ACC[i] > L_EXIT: break
    t = ACC[i] / L_EXIT
    amp = THREAD_AMP0 + (THREAD_AMP1 - THREAD_AMP0) * (t ** THREAD_DECAY)
    off = amp * math.sin(2 * math.pi * ACC[i] / THREAD_PER)
    nx, ny = normal_at(i)
    thread_pts.append((pts[i][0] + nx * off, pts[i][1] + ny * off))
THREAD_D = "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in thread_pts)

# ---- single-path mark: the disc with the slot as one closed outline (works without <mask>) ---
def _rim_cross(edge):
    """first index where the edge leaves the disc; returns (index_inside, point_on_rim)"""
    for i in range(1, len(edge)):
        if math.hypot(edge[i][0]-CX, edge[i][1]-CY) > R:
            a, b = edge[i-1], edge[i]
            # bisect the crossing
            lo, hi = 0.0, 1.0
            for _ in range(40):
                m = (lo+hi)/2; x = a[0]+(b[0]-a[0])*m; y = a[1]+(b[1]-a[1])*m
                if math.hypot(x-CX, y-CY) > R: hi = m
                else: lo = m
            m = (lo+hi)/2
            return i-1, (a[0]+(b[0]-a[0])*m, a[1]+(b[1]-a[1])*m)
    raise RuntimeError("cut never leaves the disc")

iA, PA = _rim_cross(left)
iB, PB = _rim_cross(right)
start_cap = cap(pts[0], start_r, left[0], right[0])           # from left[0] around the thin end to right[0]
outline1 = [PA] + left[iA::-1] + start_cap + right[:iB+1] + [PB]
# arc from PB back to PA around OUR centre, the long way (large-arc=1); pick sweep by angular span
aA = math.atan2(PA[1]-CY, PA[0]-CX); aB = math.atan2(PB[1]-CY, PB[0]-CX)
span_cw = (aA - aB) % (2*math.pi)                              # increasing angle = clockwise on screen
sweep = 1 if span_cw > math.pi else 0
MARK_D = ("M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in outline1)
          + f" A{R:.2f} {R:.2f} 0 1 {sweep} {PA[0]:.2f} {PA[1]:.2f} Z")
MARK_VIEWBOX = f"{CX-R-12:.0f} {CY-R-12:.0f} {2*R+24:.0f} {2*R+24:.0f}"   # tight box around the disc (+12px air)

def cut_shapes(color, thread=True):
    """the carved path as ONE filled shape in `color`, plus the cyan thread (icon tiles only)"""
    out = f'<path d="{CUT_D}" fill="{color}"/>'
    if thread and THREAD_ENABLED:
        out += (f'\n    <path d="{THREAD_D}" fill="none" stroke="{THREAD_COLOR}" stroke-width="{THREAD_W:.2f}" '
                f'stroke-linecap="round" stroke-linejoin="round"/>')
    return out

def cut_mask(mid):
    return f'''<mask id="{mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#fff"/>
    {cut_shapes("#000", thread=False)}
  </mask>'''

def grad(gid):
    return f'''<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{DISC_TOP}"/>
    <stop offset="1" stop-color="{DISC_BOT}"/>
  </linearGradient>'''

HEAD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'

# 1) glyph, currentColor, true cutout ------------------------------------------------
mark = f'''{HEAD}
  <!-- Locus mark: noise (holes) compounding into a signal curve, carved into the circle. -->
  <defs>{cut_mask("locus-cut")}</defs>
  <circle cx="{CX:g}" cy="{CY:g}" r="{R:.2f}" fill="currentColor" mask="url(#locus-cut)"/>
</svg>
'''
open(f"{OUT}/locus-mark.svg", "w").write(mark)

# 1b) single-path glyph, currentColor, tight viewBox — the web/nav mark ---------------------
open(f"{OUT}/locus-mark-path.svg", "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MARK_VIEWBOX}" width="{2*R+24:.0f}" height="{2*R+24:.0f}">\n'
    f'  <!-- Locus mark: one closed path — the disc with the compounding-signal slot. -->\n'
    f'  <path d="{MARK_D}" fill="currentColor"/>\n</svg>\n')
# optical "small" cut for ≤32px use (wider slot: 80/12 instead of 62/6) — computed by re-running this file
SMALL_D = None
if os.environ.get("SMALL_PASS") is None:
    import subprocess, tempfile, re
    _t = tempfile.mkdtemp()
    subprocess.run([sys.executable, __file__, _t], check=True, capture_output=True,
                   env={**os.environ, "SMALL_PASS": "1", "CUT_W": "80", "CUT_W0": "12"})
    SMALL_D = re.search(r'LOCUS_MARK_PATH =\s*"(.*)"', open(f"{_t}/locus-mark.ts").read()).group(1)
    open(f"{OUT}/locus-mark-path-small.svg", "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MARK_VIEWBOX}" width="{2*R+24:.0f}" height="{2*R+24:.0f}">\n'
        f'  <!-- Locus mark, optical variant for small sizes (≤32px): wider slot. -->\n'
        f'  <path d="{SMALL_D}" fill="currentColor"/>\n</svg>\n')
open(f"{OUT}/locus-mark.ts", "w").write(
    "// Generated by public/brand/locus/build_mark.py — do not edit by hand.\n"
    "// The Locus mark as ONE closed SVG path (disc minus the compounding-signal slot), 1024-unit space.\n"
    f"export const LOCUS_MARK_VIEWBOX = \"{MARK_VIEWBOX}\"\n"
    f"/** Display cut (slot 62→6 units): use at > 32px. */\n"
    f"export const LOCUS_MARK_PATH =\n  \"{MARK_D}\"\n"
    + (f"/** Optical small cut (slot 80→12 units): use at ≤ 32px so the slot survives the raster. */\n"
       f"export const LOCUS_MARK_PATH_SMALL =\n  \"{SMALL_D}\"\n" if SMALL_D else ""))

# 2) glyph, opaque construction on transparent (rasteriser-safe; tile-coloured cut) --
mark_flat = f'''{HEAD}
  <circle cx="{CX:g}" cy="{CY:g}" r="{R:.2f}" fill="{DISC_FLAT}"/>
  {cut_shapes(TILE, thread=False)}
</svg>
'''
open(f"{OUT}/locus-mark-flat.svg", "w").write(mark_flat)

# 3) full-bleed square tile (iOS / Icon Composer) ------------------------------------
square = f'''{HEAD}
  <defs>{grad("locus-disc")}</defs>
  <rect width="1024" height="1024" fill="{TILE}"/>
  <circle cx="{CX:g}" cy="{CY:g}" r="{R:.2f}" fill="url(#locus-disc)"/>
  {cut_shapes(TILE)}
</svg>
'''
open(f"{OUT}/locus-icon-square.svg", "w").write(square)

# 4) macOS template: 824 squircle centred in 1024, radius ~22.5% -------------------
M, SIDE, RAD = 100, 824, 185
sc = SIDE / 1024
macos = f'''{HEAD}
  <defs>{grad("locus-disc-m")}</defs>
  <rect x="{M}" y="{M}" width="{SIDE}" height="{SIDE}" rx="{RAD}" ry="{RAD}" fill="{TILE}"/>
  <g transform="translate({M} {M}) scale({sc:.6f})">
    <circle cx="{CX:g}" cy="{CY:g}" r="{R:.2f}" fill="url(#locus-disc-m)"/>
    {cut_shapes(TILE)}
  </g>
</svg>
'''
open(f"{OUT}/locus-icon-macos.svg", "w").write(macos)

# 5) mono variants of the square tile (light tile / dark tile) for web favicons etc. --
mono_dark = f'''{HEAD}
  <rect width="1024" height="1024" fill="{TILE}"/>
  <circle cx="{CX:g}" cy="{CY:g}" r="{R:.2f}" fill="{DISC_FLAT}"/>
  {cut_shapes(TILE)}
</svg>
'''
open(f"{OUT}/locus-icon-square-flat.svg", "w").write(mono_dark)

print("curve a=%.3f s=%.1f exit=(%.1f,%.1f) base_y=%.1f" % (A, S, X_EXIT, Y_EXIT, BASE_Y))
print("wrote:", ", ".join(sorted(f for f in os.listdir(OUT) if f.endswith(".svg"))))
