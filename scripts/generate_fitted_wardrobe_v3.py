import os
import math
from PIL import Image, ImageDraw, ImageFilter

def build_wardrobe_v3():
    hamster_path = "public/assets/breeds/winter_white.png"
    if not os.path.exists(hamster_path):
        hamster_path = "public/assets/heaven-hamster.png"
    
    hamster_base = Image.open(hamster_path).convert("RGBA")
    W, H = hamster_base.size # 1024, 576

    out_dir = "public/assets/wardrobe"
    thumb_dir = "public/assets/wardrobe/thumbs"
    artifact_dir = "C:/Users/nongd/.gemini/antigravity/brain/03ac06db-5441-423c-a3b4-de00a8f7314d"
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(thumb_dir, exist_ok=True)
    os.makedirs(artifact_dir, exist_ok=True)

    # Helper: Check if point (x, y) is inside face oval
    # Center = (485, 360), radius_x = 100, radius_y = 75
    # Tilted slightly because left eye is (430, 347) and right eye is (547, 361)
    def in_face_hole(x, y):
        # Slightly rotated ellipse around (488, 362)
        cx, cy = 488, 365
        rx, ry = 102, 76
        dx = x - cx
        dy = y - cy
        # Rotate by -5 degrees
        rad = math.radians(-5)
        nx = dx * math.cos(rad) - dy * math.sin(rad)
        ny = dx * math.sin(rad) + dy * math.cos(rad)
        return (nx / rx)**2 + (ny / ry)**2 <= 1.0

    # -------------------------------------------------------------
    # 1. HOODIE SPECIAL (Pastel Lavender Hoodie)
    # -------------------------------------------------------------
    hoodie = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(hoodie)

    C_OUTLINE = (55, 30, 85, 255)       # Deep plum
    C_SHADOW  = (120, 85, 170, 255)     # Lavender shadow
    C_MAIN    = (170, 138, 225, 255)    # Pastel lavender
    C_LIGHT   = (205, 180, 248, 255)    # Soft highlight
    C_WHITE   = (248, 245, 255, 255)    # White cords & trim
    C_GOLD    = (255, 210, 80, 255)     # Gold aglets

    # Outer hoodie silhouette on body
    outer_poly = [
        # Top of hood crown
        (420, 145), (480, 132), (540, 135), (590, 150),
        # Right ear gap & right shoulder
        (610, 190), (660, 195), (715, 220), (765, 265),
        # Right rear rump
        (780, 320), (770, 375), (730, 420),
        # Right flank along paws
        (660, 430), (620, 435),
        # Under chin bottom hem
        (560, 455), (490, 460), (430, 455),
        # Left paw / left flank
        (370, 430), (320, 410), (280, 360),
        # Left upper body & left ear gap
        (285, 290), (320, 220), (370, 180),
    ]

    d.polygon(outer_poly, fill=C_MAIN, outline=C_OUTLINE)

    # Bear ears on top of hood
    # Left hood ear
    d.polygon([(390, 150), (380, 105), (425, 115), (430, 145)], fill=C_MAIN, outline=C_OUTLINE)
    d.polygon([(392, 140), (390, 115), (418, 122), (420, 140)], fill=C_SHADOW)
    # Right hood ear
    d.polygon([(545, 145), (555, 105), (600, 115), (595, 150)], fill=C_MAIN, outline=C_OUTLINE)
    d.polygon([(555, 140), (562, 115), (590, 122), (585, 140)], fill=C_SHADOW)

    # Highlights along the curved back
    d.line([(440, 145), (530, 145), (630, 175), (710, 215), (750, 260)], fill=C_LIGHT, width=7)
    d.line([(460, 150), (540, 152), (640, 185), (720, 230)], fill=C_WHITE, width=2)

    # Shadows along lower right flank
    d.line([(630, 425), (700, 415), (760, 370)], fill=C_SHADOW, width=6)
    d.line([(290, 370), (330, 405), (380, 425)], fill=C_SHADOW, width=5)

    # Cute back pouch/patch on right back (x: 640..740, y: 250..320) - completely off the face!
    patch = [(640, 260), (730, 280), (725, 330), (635, 310)]
    d.polygon(patch, fill=C_LIGHT, outline=C_OUTLINE)
    d.line([(640, 260), (635, 310)], fill=C_SHADOW, width=3)
    d.line([(730, 280), (725, 330)], fill=C_SHADOW, width=3)
    # Tiny gold star on back patch
    d.polygon([
        (680, 285), (683, 292), (691, 293), (685, 298), (687, 306),
        (680, 301), (673, 306), (675, 298), (669, 293), (677, 292)
    ], fill=C_GOLD, outline=C_OUTLINE)

    # CUT OUT FACE HOLE
    # Clear every pixel inside the face hole
    pix = hoodie.load()
    for y in range(H):
        for x in range(W):
            if in_face_hole(x, y):
                pix[x, y] = (0, 0, 0, 0)

    # Draw the plush hood opening rim (ribbed border around face hole)
    # We trace the perimeter of the face hole
    steps = 40
    rim_points = []
    cx, cy = 488, 365
    rx, ry = 102, 76
    rad = math.radians(-5)
    for i in range(steps):
        angle = 2 * math.pi * i / steps
        nx = rx * math.cos(angle)
        ny = ry * math.sin(angle)
        gx = cx + nx * math.cos(rad) - ny * math.sin(rad)
        gy = cy + nx * math.sin(rad) + ny * math.cos(rad)
        rim_points.append((gx, gy))

    # Draw thick cute ribbed rim around face opening
    for i in range(len(rim_points)):
        p1 = rim_points[i]
        p2 = rim_points[(i + 1) % len(rim_points)]
        d.line([p1, p2], fill=C_OUTLINE, width=4)
        # Inner soft line
        p1_in = (p1[0] + (cx - p1[0])*0.06, p1[1] + (cy - p1[1])*0.06)
        p2_in = (p2[0] + (cx - p2[0])*0.06, p2[1] + (cy - p2[1])*0.06)
        d.line([p1_in, p2_in], fill=C_LIGHT, width=2)

    # Cute white drawstrings dangling from hoodie collar under chin
    # Left drawstring
    d.line([(455, 442), (452, 468), (455, 478)], fill=C_WHITE, width=4)
    d.ellipse([450, 476, 460, 486], fill=C_GOLD, outline=C_OUTLINE, width=1)
    # Right drawstring
    d.line([(525, 444), (530, 470), (527, 480)], fill=C_WHITE, width=4)
    d.ellipse([522, 478, 532, 488], fill=C_GOLD, outline=C_OUTLINE, width=1)

    # Pixel art edge crisping
    for i in range(len(outer_poly)):
        p1 = outer_poly[i]
        p2 = outer_poly[(i + 1) % len(outer_poly)]
        d.line([p1, p2], fill=C_OUTLINE, width=3)

    hoodie.save(os.path.join(out_dir, "hoodie_special.png"), "PNG")
    print("Saved hoodie_special.png v3")

    # -------------------------------------------------------------
    # 2. CLOUD PAJAMAS (Pastel Sky Blue Onesie)
    # -------------------------------------------------------------
    pajamas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(pajamas)

    P_OUTLINE = (25, 60, 100, 255)      # Navy cyan outline
    P_SHADOW  = (75, 145, 200, 255)     # Deep sky blue shadow
    P_MAIN    = (120, 190, 245, 255)    # Pastel sky blue
    P_LIGHT   = (180, 225, 255, 255)    # Soft cyan highlight
    P_WHITE   = (255, 255, 255, 255)    # Cloud white
    P_GOLD    = (255, 215, 75, 255)     # Star gold

    d2.polygon(outer_poly, fill=P_MAIN, outline=P_OUTLINE)

    # Fluffy sleeping pom-pom on head crown
    d2.ellipse([485, 115, 520, 150], fill=P_WHITE, outline=P_OUTLINE, width=2)
    d2.arc([485, 115, 520, 150], 0, 180, fill=P_SHADOW, width=2)

    # Clouds printed across the back (safely on the back, far from face!)
    def draw_cloud(cx, cy, s=1.0):
        d2.ellipse([cx - 18*s, cy - 8*s, cx + 4*s, cy + 14*s], fill=P_WHITE)
        d2.ellipse([cx - 4*s, cy - 16*s, cx + 22*s, cy + 14*s], fill=P_WHITE)
        d2.ellipse([cx + 10*s, cy - 6*s, cx + 28*s, cy + 14*s], fill=P_WHITE)
        d2.rectangle([cx - 12*s, cy + 2*s, cx + 24*s, cy + 14*s], fill=P_WHITE)
        # soft shadow
        d2.arc([cx - 18*s, cy - 8*s, cx + 4*s, cy + 14*s], 140, 270, fill=P_SHADOW, width=2)
        d2.arc([cx - 4*s, cy - 16*s, cx + 22*s, cy + 14*s], 180, 360, fill=P_SHADOW, width=2)
        d2.arc([cx + 10*s, cy - 6*s, cx + 28*s, cy + 14*s], 270, 70, fill=P_SHADOW, width=2)

    draw_cloud(650, 220, s=1.1)
    draw_cloud(720, 300, s=0.95)
    draw_cloud(630, 360, s=0.85)

    def draw_star(sx, sy, sz=6):
        pts = [
            (sx, sy - sz), (sx + sz*0.3, sy - sz*0.3), (sx + sz, sy),
            (sx + sz*0.3, sy + sz*0.3), (sx, sy + sz),
            (sx - sz*0.3, sy + sz*0.3), (sx - sz, sy),
            (sx - sz*0.3, sy - sz*0.3)
        ]
        d2.polygon(pts, fill=P_GOLD, outline=P_OUTLINE)

    draw_star(610, 200, 6)
    draw_star(700, 240, 5)
    draw_star(750, 260, 6)
    draw_star(680, 350, 5)

    # Highlights & shadows
    d2.line([(440, 145), (530, 145), (630, 175), (710, 215), (750, 260)], fill=P_LIGHT, width=7)
    d2.line([(630, 425), (700, 415), (760, 370)], fill=P_SHADOW, width=6)
    d2.line([(290, 370), (330, 405), (380, 425)], fill=P_SHADOW, width=5)

    # CUT OUT FACE HOLE
    pix2 = pajamas.load()
    for y in range(H):
        for x in range(W):
            if in_face_hole(x, y):
                pix2[x, y] = (0, 0, 0, 0)

    # Scalloped cloud fleece trim around face opening
    for p in rim_points:
        d2.ellipse([p[0]-6, p[1]-6, p[0]+6, p[1]+6], fill=P_WHITE, outline=P_OUTLINE, width=1)

    # 3 Gold buttons along left side
    d2.ellipse([345, 320, 357, 332], fill=P_GOLD, outline=P_OUTLINE, width=2)
    d2.ellipse([355, 360, 367, 372], fill=P_GOLD, outline=P_OUTLINE, width=2)
    d2.ellipse([375, 400, 387, 412], fill=P_GOLD, outline=P_OUTLINE, width=2)

    for i in range(len(outer_poly)):
        p1 = outer_poly[i]
        p2 = outer_poly[(i + 1) % len(outer_poly)]
        d2.line([p1, p2], fill=P_OUTLINE, width=3)

    pajamas.save(os.path.join(out_dir, "cloud_pajamas.png"), "PNG")
    print("Saved cloud_pajamas.png v3")

    # -------------------------------------------------------------
    # 3. CAPE HERO (Heroic Crimson Superhero Cape)
    # -------------------------------------------------------------
    # Drapes over back & shoulder, leaving face 100% UNTOUCHED!
    cape = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d3 = ImageDraw.Draw(cape)

    K_OUTLINE = (85, 12, 18, 255)       # Deep crimson outline
    K_MAIN    = (225, 40, 50, 255)      # Hero red
    K_SHADOW  = (160, 22, 30, 255)      # Shadow fold
    K_LIGHT   = (255, 95, 105, 255)     # Highlight ridge
    K_GOLD    = (255, 215, 60, 255)     # Gold brooch
    K_GEM     = (175, 10, 25, 255)      # Ruby gem

    # Cape drapes across back from left neck collar to right rear billow
    # Notice: It does NOT cover the face at all!
    cape_poly = [
        # Brooch / Collar left
        (475, 440),
        # Up along left neck ridge (behind face)
        (405, 410), (360, 350), (345, 280), (370, 210),
        # Across top of back
        (430, 160), (510, 145), (610, 155), (690, 190),
        # Right billowing cape hem
        (760, 240), (810, 300), (790, 350), (815, 400),
        # Bottom rear hem
        (780, 440), (710, 445), (630, 445),
        # Back to collar right
        (560, 450), (520, 445),
    ]

    d3.polygon(cape_poly, fill=K_MAIN, outline=K_OUTLINE)

    # Dramatic flowing cape folds
    d3.line([(450, 175), (550, 165), (650, 195), (740, 250), (795, 310)], fill=K_LIGHT, width=8)
    d3.line([(460, 178), (560, 168), (660, 200)], fill=(255, 180, 190, 255), width=2)

    d3.line([(480, 240), (590, 230), (690, 260), (780, 360)], fill=K_SHADOW, width=7)
    d3.line([(490, 235), (600, 225), (700, 255)], fill=K_LIGHT, width=3)

    d3.line([(520, 320), (630, 320), (730, 350), (790, 420)], fill=K_SHADOW, width=8)

    # CLEAR ANY OVERLAP WITH FACE!
    pix3 = cape.load()
    for y in range(H):
        for x in range(W):
            if in_face_hole(x, y):
                pix3[x, y] = (0, 0, 0, 0)

    # Golden Brooch with ruby gem under chin
    bx, by = 495, 442
    d3.ellipse([bx - 14, by - 14, bx + 14, by + 14], fill=K_GOLD, outline=K_OUTLINE, width=2)
    d3.polygon([
        (bx, by - 10), (bx + 3, by - 3), (bx + 10, by),
        (bx + 3, by + 3), (bx, by + 10),
        (bx - 3, by + 3), (bx - 10, by),
        (bx - 3, by - 3)
    ], fill=K_GEM, outline=K_OUTLINE)
    d3.ellipse([bx - 3, by - 4, bx - 1, by - 2], fill=(255, 255, 255, 255))

    for i in range(len(cape_poly)):
        p1 = cape_poly[i]
        p2 = cape_poly[(i + 1) % len(cape_poly)]
        d3.line([p1, p2], fill=K_OUTLINE, width=3)

    cape.save(os.path.join(out_dir, "cape_hero.png"), "PNG")
    print("Saved cape_hero.png v3")

    # -------------------------------------------------------------
    # 4. CUTE BIB (Golden Star Baby Bib)
    # -------------------------------------------------------------
    bib = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d4 = ImageDraw.Draw(bib)

    B_OUTLINE = (130, 95, 25, 255)      # Warm outline
    B_MAIN    = (255, 245, 180, 255)    # Creamy buttercup
    B_SHADOW  = (240, 215, 125, 255)    # Warm shadow
    B_LIGHT   = (255, 255, 230, 255)    # Light cream
    B_GOLD    = (255, 195, 40, 255)     # Star gold
    B_RIBBON  = (255, 140, 160, 255)    # Pink ribbon

    bib_pts = [
        (450, 435), (440, 450), (445, 470),
        (470, 488), (500, 492), (530, 488),
        (555, 470), (560, 450), (550, 435),
        (515, 445), (485, 445),
    ]

    d4.polygon(bib_pts, fill=B_MAIN, outline=B_OUTLINE)

    for sx in [455, 475, 495, 515, 535]:
        d4.arc([sx - 10, 474, sx + 10, 494], 0, 180, fill=B_OUTLINE, width=2)
        d4.ellipse([sx - 2, 479, sx + 2, 483], fill=B_SHADOW)

    d4.line([(452, 448), (455, 468), (475, 482)], fill=B_LIGHT, width=3)

    # Golden star
    sx, sy, sz = 500, 465, 12
    star_pts = []
    for i in range(10):
        r = sz if i % 2 == 0 else sz * 0.45
        angle = i * math.pi / 5 - math.pi / 2
        star_pts.append((sx + r * math.cos(angle), sy + r * math.sin(angle)))
    d4.polygon(star_pts, fill=B_GOLD, outline=B_OUTLINE)
    d4.ellipse([sx - 3, sy - 5, sx, sy - 2], fill=(255, 255, 255, 255))

    d4.ellipse([444, 430, 456, 440], fill=B_RIBBON, outline=B_OUTLINE, width=1)
    d4.ellipse([544, 430, 556, 440], fill=B_RIBBON, outline=B_OUTLINE, width=1)

    for i in range(len(bib_pts)):
        p1 = bib_pts[i]
        p2 = bib_pts[(i + 1) % len(bib_pts)]
        d4.line([p1, p2], fill=B_OUTLINE, width=2)

    bib.save(os.path.join(out_dir, "cute_bib.png"), "PNG")
    print("Saved cute_bib.png v3")

    # -------------------------------------------------------------
    # 5. SHOP THUMBNAILS (128x128 soft framed icons)
    # -------------------------------------------------------------
    def make_thumb(src_img, name, crop_box):
        cropped = src_img.crop(crop_box)
        thumb = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        td = ImageDraw.Draw(thumb)
        td.ellipse([6, 6, 122, 122], fill=(255, 255, 255, 235), outline=(220, 215, 235, 255), width=2)
        cropped.thumbnail((98, 98), Image.Resampling.LANCZOS)
        cw, ch = cropped.size
        thumb.paste(cropped, ((128 - cw) // 2, (128 - ch) // 2), cropped)
        thumb.save(os.path.join(thumb_dir, name), "PNG")

    make_thumb(hoodie, "hoodie_special.png", (270, 100, 790, 470))
    make_thumb(pajamas, "cloud_pajamas.png", (270, 100, 790, 470))
    make_thumb(cape, "cape_hero.png", (340, 140, 820, 460))
    make_thumb(bib, "cute_bib.png", (435, 420, 565, 500))

    # -------------------------------------------------------------
    # 6. TEST COMPOSITES FOR IMMEDIATE VISUAL VERIFICATION
    # -------------------------------------------------------------
    for item, name in [(hoodie, "hoodie_special"), (pajamas, "cloud_pajamas"), (cape, "cape_hero"), (bib, "cute_bib")]:
        comp = hamster_base.copy()
        comp.alpha_composite(item)
        comp_path = os.path.join(artifact_dir, f"test_v3_{name}.png")
        comp.save(comp_path, "PNG")
        print(f"Saved: {comp_path}")

if __name__ == "__main__":
    build_wardrobe_v3()
