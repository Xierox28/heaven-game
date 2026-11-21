import os
from PIL import Image, ImageDraw

def create_pixel_wardrobe_v5():
    hamster_path = "public/assets/breeds/winter_white.png"
    if not os.path.exists(hamster_path):
        hamster_path = "public/assets/heaven-hamster.png"
    
    hamster_base = Image.open(hamster_path).convert("RGBA")
    hamster_low = hamster_base.resize((256, 144), Image.Resampling.NEAREST)

    artifact_dir = "C:/Users/nongd/.gemini/antigravity/brain/03ac06db-5441-423c-a3b4-de00a8f7314d"
    out_dir = "public/assets/wardrobe"
    thumb_dir = "public/assets/wardrobe/thumbs"
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(thumb_dir, exist_ok=True)
    os.makedirs(artifact_dir, exist_ok=True)

    # Common body outer & inner points
    outer_pts = [
        (96, 54), (110, 44), (126, 42), (142, 44), (154, 54),
        (172, 60), (188, 76), (192, 92), (182, 104), (165, 107), (154, 106),
        (142, 108), (134, 111), (126, 113), (118, 111), (110, 108), (98, 106),
        (85, 104), (74, 94), (74, 80), (84, 66),
    ]

    inner_pts = [
        (112, 54), (126, 52), (140, 54),
        (148, 64), (150, 78), (148, 90), (142, 102), (134, 108),
        (126, 111),
        (118, 108), (110, 102), (102, 90), (100, 78), (104, 64),
    ]

    # ------------------------------------------------------------------
    # 1. HOODIE SPECIAL (Pastel Lavender Hoodie)
    # ------------------------------------------------------------------
    hoodie_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(hoodie_low)

    C_OUTLINE = (50, 30, 80, 255)       # Dark purple outline
    C_SHADOW  = (115, 80, 160, 255)     # Deep lavender shadow
    C_MAIN    = (175, 145, 225, 255)    # Pastel lavender main
    C_LIGHT   = (215, 195, 250, 255)    # Soft lilac highlight
    C_WHITE   = (250, 248, 255, 255)    # Drawstrings & trim
    C_GOLD    = (255, 210, 70, 255)     # Gold aglets & star

    d1.polygon(outer_pts, fill=C_MAIN, outline=C_OUTLINE)

    # Cute little bear ears on the hood!
    d1.polygon([(102, 45), (100, 35), (110, 37), (112, 45)], fill=C_MAIN, outline=C_OUTLINE)
    d1.point([(105, 39), (106, 39), (105, 40), (106, 40)], fill=C_SHADOW)
    d1.polygon([(140, 45), (142, 35), (152, 37), (150, 45)], fill=C_MAIN, outline=C_OUTLINE)
    d1.point([(145, 39), (146, 39), (145, 40), (146, 40)], fill=C_SHADOW)

    # Cut out face opening
    d1.polygon(inner_pts, fill=(0, 0, 0, 0))

    # Inner rim styling
    for i in range(len(inner_pts)):
        p1 = inner_pts[i]
        p2 = inner_pts[(i + 1) % len(inner_pts)]
        d1.line([p1, p2], fill=C_OUTLINE, width=1)
        d1.line([(p1[0], p1[1]-1), (p2[0], p2[1]-1)], fill=C_LIGHT, width=1)

    # Highlights along back
    d1.line([(120, 46), (145, 48), (170, 60), (185, 75)], fill=C_LIGHT, width=2)
    d1.line([(130, 47), (155, 52), (175, 68)], fill=C_WHITE, width=1)

    # Shadows along lower flank
    d1.line([(160, 104), (175, 102), (188, 92)], fill=C_SHADOW, width=2)
    d1.line([(76, 90), (85, 100), (95, 104)], fill=C_SHADOW, width=1)

    # Kangaroo pocket on right flank
    pocket = [(162, 74), (184, 78), (182, 88), (160, 84)]
    d1.polygon(pocket, fill=C_LIGHT, outline=C_OUTLINE)
    d1.line([(162, 74), (160, 84)], fill=C_SHADOW, width=1)
    d1.line([(184, 78), (182, 88)], fill=C_SHADOW, width=1)
    d1.point([(171, 80), (172, 80)], fill=C_GOLD)

    # White drawstrings under chin
    d1.line([(120, 112), (119, 120)], fill=C_WHITE, width=1)
    d1.point([(119, 121)], fill=C_GOLD)
    d1.line([(131, 112), (132, 120)], fill=C_WHITE, width=1)
    d1.point([(132, 121)], fill=C_GOLD)

    for i in range(len(outer_pts)):
        p1 = outer_pts[i]
        p2 = outer_pts[(i + 1) % len(outer_pts)]
        d1.line([p1, p2], fill=C_OUTLINE, width=1)

    hoodie_high = hoodie_low.resize((1024, 576), Image.Resampling.NEAREST)
    hoodie_high.save(os.path.join(out_dir, "hoodie_special.png"), "PNG")

    # ------------------------------------------------------------------
    # 2. CLOUD PAJAMAS (Pastel Sky Blue Onesie)
    # ------------------------------------------------------------------
    pajamas_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(pajamas_low)

    P_OUTLINE = (20, 50, 90, 255)       # Navy cyan
    P_SHADOW  = (70, 135, 195, 255)     # Deep sky blue
    P_MAIN    = (125, 195, 245, 255)    # Pastel sky blue
    P_LIGHT   = (185, 230, 255, 255)    # Cyan highlight
    P_WHITE   = (255, 255, 255, 255)    # Cloud white
    P_GOLD    = (255, 215, 70, 255)     # Star gold

    d2.polygon(outer_pts, fill=P_MAIN, outline=P_OUTLINE)

    # Cute sleep pom-pom on top of head
    d2.ellipse([122, 36, 130, 44], fill=P_WHITE, outline=P_OUTLINE)

    # Cut out face hole
    d2.polygon(inner_pts, fill=(0, 0, 0, 0))

    # Fluffy continuous white fleece trim around face opening
    for i in range(len(inner_pts)):
        p1 = inner_pts[i]
        p2 = inner_pts[(i + 1) % len(inner_pts)]
        d2.line([p1, p2], fill=P_WHITE, width=2)
    # Outer dark border for fleece trim
    for p in inner_pts:
        d2.point([(p[0], p[1])], fill=P_OUTLINE)

    # Cloud patterns on back & flank
    def draw_p_cloud(cx, cy):
        d2.ellipse([cx - 4, cy - 2, cx + 1, cy + 3], fill=P_WHITE)
        d2.ellipse([cx - 1, cy - 4, cx + 5, cy + 3], fill=P_WHITE)
        d2.ellipse([cx + 3, cy - 2, cx + 7, cy + 3], fill=P_WHITE)
        d2.rectangle([cx - 3, cy + 1, cx + 6, cy + 3], fill=P_WHITE)
        d2.point([(cx - 1, cy + 3), (cx + 3, cy + 3)], fill=P_SHADOW)

    draw_p_cloud(165, 62)
    draw_p_cloud(180, 80)
    draw_p_cloud(158, 92)

    d2.point([(155, 54), (175, 70), (186, 72)], fill=P_GOLD)
    d2.line([(120, 46), (145, 48), (170, 60), (185, 75)], fill=P_LIGHT, width=2)
    d2.line([(160, 104), (175, 102), (188, 92)], fill=P_SHADOW, width=2)
    d2.line([(76, 90), (85, 100), (95, 104)], fill=P_SHADOW, width=1)

    for i in range(len(outer_pts)):
        p1 = outer_pts[i]
        p2 = outer_pts[(i + 1) % len(outer_pts)]
        d2.line([p1, p2], fill=P_OUTLINE, width=1)

    pajamas_high = pajamas_low.resize((1024, 576), Image.Resampling.NEAREST)
    pajamas_high.save(os.path.join(out_dir, "cloud_pajamas.png"), "PNG")

    # ------------------------------------------------------------------
    # 3. CAPE HERO (Heroic Crimson Cape) - STRICTLY ON BACK & RIGHT
    # ------------------------------------------------------------------
    cape_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d3 = ImageDraw.Draw(cape_low)

    K_OUTLINE = (75, 10, 15, 255)       # Deep crimson outline
    K_SHADOW  = (150, 18, 25, 255)      # Shadow fold
    K_MAIN    = (225, 38, 48, 255)      # Hero red
    K_LIGHT   = (255, 90, 100, 255)     # Satin highlight
    K_GOLD    = (255, 215, 55, 255)     # Gold brooch
    K_GEM     = (175, 10, 20, 255)      # Ruby gem

    # Cape body on back & right rear:
    cape_body = [
        # Top of back behind head
        (130, 44), (150, 46), (175, 54),
        # Billowing right hem
        (198, 72), (206, 85), (200, 95), (208, 106),
        # Bottom rear hem
        (196, 114), (180, 114), (164, 110),
        # Leading edge along right flank (behind right cheek)
        (150, 92), (146, 75), (142, 60),
    ]

    d3.polygon(cape_body, fill=K_MAIN, outline=K_OUTLINE)

    # Billowing folds
    d3.line([(150, 52), (175, 58), (198, 72)], fill=K_LIGHT, width=2)
    d3.line([(155, 68), (180, 80), (202, 92)], fill=K_SHADOW, width=2)
    d3.line([(160, 88), (185, 102), (205, 105)], fill=K_SHADOW, width=2)

    for i in range(len(cape_body)):
        p1 = cape_body[i]
        p2 = cape_body[(i + 1) % len(cape_body)]
        d3.line([p1, p2], fill=K_OUTLINE, width=1)

    # Collar band connecting neck clasp to the cape
    # Band from brooch (124, 111) to cape leading edge (142, 105)
    d3.line([(124, 111), (134, 108), (144, 105)], fill=K_MAIN, width=3)
    d3.line([(124, 111), (134, 108), (144, 105)], fill=K_OUTLINE, width=1)

    # Left collar strap
    d3.line([(124, 111), (114, 108), (106, 104)], fill=K_MAIN, width=3)
    d3.line([(124, 111), (114, 108), (106, 104)], fill=K_OUTLINE, width=1)

    # Golden Brooch with Ruby Center under chin
    d3.ellipse([121, 108, 127, 114], fill=K_GOLD, outline=K_OUTLINE)
    d3.point([(124, 111)], fill=K_GEM)

    cape_high = cape_low.resize((1024, 576), Image.Resampling.NEAREST)
    cape_high.save(os.path.join(out_dir, "cape_hero.png"), "PNG")

    # ------------------------------------------------------------------
    # 4. CUTE BIB (Golden Star Baby Bib)
    # ------------------------------------------------------------------
    bib_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d4 = ImageDraw.Draw(bib_low)

    B_OUTLINE = (120, 85, 20, 255)
    B_MAIN    = (255, 245, 175, 255)
    B_SHADOW  = (235, 210, 120, 255)
    B_LIGHT   = (255, 255, 225, 255)
    B_GOLD    = (255, 195, 35, 255)
    B_RIBBON  = (255, 135, 155, 255)

    bib_pts = [
        (116, 109), (113, 114), (114, 119),
        (120, 123), (126, 124), (132, 123),
        (138, 119), (139, 114), (136, 109),
        (126, 111),
    ]

    d4.polygon(bib_pts, fill=B_MAIN, outline=B_OUTLINE)
    for sx in [117, 123, 129, 135]:
        d4.point([(sx, 123)], fill=B_SHADOW)
    d4.point([(126, 115), (125, 116), (126, 116), (127, 116), (126, 117)], fill=B_GOLD)
    d4.point([(126, 116)], fill=(255, 255, 255, 255))
    d4.point([(115, 108), (137, 108)], fill=B_RIBBON)

    bib_high = bib_low.resize((1024, 576), Image.Resampling.NEAREST)
    bib_high.save(os.path.join(out_dir, "cute_bib.png"), "PNG")

    # ------------------------------------------------------------------
    # 5. SHOP THUMBNAILS
    # ------------------------------------------------------------------
    def make_thumb(low_img, name, crop_box):
        cropped = low_img.crop(crop_box)
        cw, ch = cropped.size
        scale = min(96.0 / cw, 96.0 / ch)
        sw, sh = max(1, int(cw * scale)), max(1, int(ch * scale))
        scaled = cropped.resize((sw, sh), Image.Resampling.NEAREST)

        thumb = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        td = ImageDraw.Draw(thumb)
        td.ellipse([6, 6, 122, 122], fill=(255, 255, 255, 235), outline=(220, 215, 235, 255), width=2)
        thumb.paste(scaled, ((128 - sw) // 2, (128 - sh) // 2), scaled)
        thumb.save(os.path.join(thumb_dir, name), "PNG")

    make_thumb(hoodie_low, "hoodie_special.png", (72, 34, 194, 122))
    make_thumb(pajamas_low, "cloud_pajamas.png", (72, 34, 194, 122))
    make_thumb(cape_low, "cape_hero.png", (104, 42, 210, 116))
    make_thumb(bib_low, "cute_bib.png", (110, 106, 142, 126))

    # ------------------------------------------------------------------
    # 6. TEST COMPOSITES
    # ------------------------------------------------------------------
    for item_high, name in [(hoodie_high, "hoodie_special"), (pajamas_high, "cloud_pajamas"), (cape_high, "cape_hero"), (bib_high, "cute_bib")]:
        comp = hamster_base.copy()
        comp.alpha_composite(item_high)
        comp_path = os.path.join(artifact_dir, f"test_v5_{name}.png")
        comp.save(comp_path, "PNG")
        print(f"Saved: {comp_path}")

if __name__ == "__main__":
    create_pixel_wardrobe_v5()
