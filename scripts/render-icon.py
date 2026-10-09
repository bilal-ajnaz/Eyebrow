"""Rasterise Eyebrow.icon (Icon Composer) into PNGs for the website.
Reads the glyph PNG + icon.json fills, renders at 4x supersampling."""
import json, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ICON_DIR = sys.argv[1]; OUT = sys.argv[2]
spec = json.load(open(f"{ICON_DIR}/icon.json"))
layer = spec["groups"][0]["layers"][0]
glyph_src = Image.open(f"{ICON_DIR}/Assets/{layer['image-name']}").convert("RGBA")

def p3_to_srgb(c):
    # display-p3 -> linear -> XYZ -> linear sRGB -> sRGB
    def lin(v): return v/12.92 if v <= 0.04045 else ((v+0.055)/1.055)**2.4
    def enc(v):
        v = max(0.0, min(1.0, v))
        return 12.92*v if v <= 0.0031308 else 1.055*v**(1/2.4)-0.055
    r,g,b = (lin(float(x)) for x in c.split(":")[1].split(",")[:3])
    X = 0.4865709*r + 0.2656677*g + 0.1982173*b
    Y = 0.2289746*r + 0.6917385*g + 0.0792869*b
    Z = 0.0000000*r + 0.0451134*g + 1.0439444*b
    rr =  3.2404542*X - 1.5371385*Y - 0.4985314*Z
    gg = -0.9692660*X + 1.8760108*Y + 0.0415560*Z
    bb =  0.0556434*X - 0.2040259*Y + 1.0572252*Z
    return tuple(int(round(enc(v)*255)) for v in (rr,gg,bb))

def vgrad(size, c0, c1, y0, y1):
    """Vertical linear gradient across the canvas, clamped outside [y0,y1]."""
    w, h = size
    col = Image.new("RGBA", (1, h))
    px = col.load()
    for y in range(h):
        t = (y/h - y0) / (y1 - y0); t = max(0.0, min(1.0, t))
        px[0, y] = tuple(int(round(a + (b-a)*t)) for a, b in zip(c0, c1)) + (255,)
    return col.resize((w, h))

def squircle_mask(size, radius_frac=0.2237):
    S = size * 4
    m = Image.new("L", (S, S), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, S-1, S-1], radius=int(S*radius_frac), fill=255)
    return m.resize((size, size), Image.LANCZOS)

def render(size, masked=True):
    S = size * 4  # supersample
    bg = spec["fill"]["linear-gradient"]; o = spec["fill"]["orientation"]
    img = vgrad((S, S), p3_to_srgb(bg[0]), p3_to_srgb(bg[1]), o["start"]["y"], o["stop"]["y"])

    # Glyph: 1000pt image centred on the 1024pt canvas at scale 1
    gs = int(S * glyph_src.width / 1024)
    glyph = glyph_src.resize((gs, gs), Image.LANCZOS)
    alpha = Image.new("L", (S, S), 0)
    alpha.paste(glyph.split()[3], ((S-gs)//2, (S-gs)//2))

    # Neutral shadow, opacity 0.5 (from the group's shadow setting)
    sh = spec["groups"][0]["shadow"]["opacity"]
    shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    shadow.putalpha(ImageChops.offset(alpha, 0, int(S*0.012)).filter(ImageFilter.GaussianBlur(S*0.018)))
    shadow = Image.eval(shadow, lambda v: v)  # no-op, keep type
    sa = shadow.split()[3].point(lambda v: int(v*sh*0.8))
    img.paste(Image.new("RGBA", (S, S), (10, 20, 40, 255)), (0, 0), sa)

    # Frosted-glass glyph: layer fill gradient, lifted toward white, over a
    # blurred copy of the background (translucency 0.5).
    fl = layer["fill-specializations"][0]["value"]["linear-gradient"]
    fo = layer["fill-specializations"][0]["value"]["orientation"]
    fill = vgrad((S, S), p3_to_srgb(fl[0]), p3_to_srgb(fl[1]), fo["start"]["y"], fo["stop"]["y"])
    frosted = Image.blend(img.filter(ImageFilter.GaussianBlur(S*0.03)), Image.new("RGBA", (S, S), (255,255,255,255)), 0.78)
    glass = Image.blend(frosted, fill, 0.22)
    # Soft top-light specular inside the glass
    spec_grad = vgrad((S, S), (255,255,255), (255,255,255), 0, 1)
    spec_a = Image.linear_gradient("L").rotate(180).resize((S, S)).point(lambda v: int(v*0.35))
    glass.paste(spec_grad, (0, 0), spec_a)
    img.paste(glass, (0, 0), alpha.point(lambda v: int(v*0.96)))

    # Subtle inner edge highlight on the glyph
    edge = ImageChops.subtract(alpha, ImageChops.offset(alpha, 0, int(S*0.006)))
    img.paste(Image.new("RGBA", (S, S), (255,255,255,255)), (0, 0), edge.point(lambda v: int(v*0.55)))

    out = img.resize((size, size), Image.LANCZOS)
    if masked:
        out.putalpha(squircle_mask(size))
    return out

render(1024).save(f"{OUT}/public/icon-1024.png", optimize=True)
render(256).save(f"{OUT}/public/icon-256.png", optimize=True)
render(512).save(f"{OUT}/app/icon.png", optimize=True)
render(180, masked=False).save(f"{OUT}/app/apple-icon.png", optimize=True)
print("ok")
