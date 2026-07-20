from PIL import Image
import os

src = r"C:\Users\User\.cursor\projects\c-Users-User-Projects-choosify-admin-4-0\assets\c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_vecteezy_social-media-set-icons-facebook-instagram-youtube_7978628-111a108f-f47e-4b1b-a7de-b7e8643aa606.png"
out_dir = r"C:\Users\User\Projects\Choosify-Web\public\icons"
im = Image.open(src).convert("RGBA")
w, h = im.size

# Top rounded row — tight vertical band
top, bottom = 12, 88
band = im.crop((0, top, w, bottom))
bw, bh = band.size

# Detect non-black columns to locate icon centers (Instagram circle is black — skip glyph-only)
col_mass = []
for x in range(bw):
    mass = 0
    for y in range(bh):
        p = band.getpixel((x, y))
        # Prefer saturated brand colors, not near-white glyphs alone
        r, g, b, a = p
        if a < 20:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        if mx - mn > 25 or mx > 40:  # colored or non-black
            mass += mx + (mx - mn)
    col_mass.append(mass)

# Smooth and find peaks for 9 icons
window = 5
smooth = []
for i in range(bw):
    sl = col_mass[max(0, i - window) : i + window + 1]
    smooth.append(sum(sl) / len(sl))

# Known approximate centers from first pass + equal spacing
# Facebook center ~92.5, spacing ~105
centers = [int(92.5 + i * 105) for i in range(9)]
# Refine each center to local mass max within ±25
refined = []
for c in centers:
    lo, hi = max(0, c - 25), min(bw - 1, c + 25)
    best = c
    best_v = -1
    for x in range(lo, hi + 1):
        if smooth[x] > best_v:
            best_v = smooth[x]
            best = x
    refined.append(best)

print("centers", refined)

names = [
    "facebook",
    "instagram",
    "youtube",
    "google",
    "telegram",
    "pinterest",
    "twitter",
    "snapchat",
    "linkedin",
]

half = 40  # cell half-size — enough for circular icons
for name, cx in zip(names, refined):
    x0 = max(0, cx - half)
    x1 = min(bw, cx + half)
    icon = band.crop((x0, 0, x1, bh))
    # Square canvas on transparent so black Instagram circle stays visible on dark UIs via its own pixels;
    # keep black bg for consistency with circular marks in the sheet
    side = max(icon.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 255))
    ox = (side - icon.size[0]) // 2
    oy = (side - icon.size[1]) // 2
    canvas.paste(icon, (ox, oy), icon)
    canvas = canvas.resize((256, 256), Image.Resampling.LANCZOS)
    path = os.path.join(out_dir, f"{name}.png")
    canvas.save(path, "PNG")
    print("saved", name, "center", cx, "->", path)

print("done")
