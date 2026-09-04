"""Rounded app icons for the README (assets/<slug>-icon.png).

GitHub strips CSS, so the rounding is baked in: each app's own 1024px icon
from its Xcode asset catalog is resized to 512px and masked to Apple's
squircle (a superellipse, n=5) with transparent corners, so it sits rounded
on either GitHub theme. Run from this repo's root with the sibling app
checkouts present:  python3 scripts/icons.py
"""
from PIL import Image, ImageDraw
import math, os

G = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = {
    "openintelligence": f"{G}/OpenIntelligence/OpenIntelligence/Resources/Assets/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png",
    "openmanual": f"{G}/OpenManual/apps/ios/OpenManual/Assets.xcassets/AppIcon.appiconset/OpenManual-AppIcon-1024.png",
    "openresponses": f"{G}/OpenResponses/OpenResponses/Resources/Assets/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png",
    "opencone": f"{G}/OpenCone/OpenCone/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png",
    "openassistant": f"{G}/OpenAssistant/OpenAssistant/Assets.xcassets/AppIcon.appiconset/AppIcon.png",
    "openclinic": f"{G}/OpenClinic/OpenClinic/Assets.xcassets/AppIcon.appiconset/app_icon_1024.png",
}
SIZE, SS = 512, 4


def squircle_mask(size, n=5.0):
    big = size * SS
    m = Image.new("L", (big, big), 0)
    d = ImageDraw.Draw(m)
    r = big / 2
    pts = []
    for i in range(1440):
        t = 2 * math.pi * i / 1440
        c, s = math.cos(t), math.sin(t)
        pts.append((r + r * (abs(c) ** (2 / n)) * (1 if c >= 0 else -1),
                    r + r * (abs(s) ** (2 / n)) * (1 if s >= 0 else -1)))
    d.polygon(pts, fill=255)
    return m.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    mask = squircle_mask(SIZE)
    out = os.path.join(os.path.dirname(__file__), "..", "assets")
    for slug, src in SRC.items():
        im = Image.open(src).convert("RGB").resize((SIZE, SIZE), Image.LANCZOS).convert("RGBA")
        im.putalpha(mask)
        path = os.path.join(out, f"{slug}-icon.png")
        im.save(path, optimize=True)
        print("wrote", path, os.path.getsize(path))
