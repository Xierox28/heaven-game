import os
import math
from PIL import Image, ImageDraw

def create_pixel_wardrobe():
    hamster_path = "public/assets/breeds/winter_white.png"
    if not os.path.exists(hamster_path):
        hamster_path = "public/assets/heaven-hamster.png"
    
    hamster_base = Image.open(hamster_path).convert("RGBA")
    # Low-res base for reference (256x144)
    hamster_low = hamster_base.resize((256, 144), Image.Resampling.NEAREST)

    artifact_dir = "C:/Users/nongd/.gemini/antigravity/brain/03ac06db-5441-423c-a3b4-de00a8f7314d"
    out_dir = "public/assets/wardrobe"
    thumb_dir = "public/assets/wardrobe/thumbs"
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(thumb_dir, exist_ok=True)
    os.makedirs(artifact_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # 1. HOODIE SPECIAL (Pastel Lavender Hoodie) at 256x144
    # ------------------------------------------------------------------
    hoodie_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(hoodie_low)

    C_OUTLINE = (50, 30, 80, 255)       # Dark purple outline
    C_SHADOW  = (115, 80, 160, 255)     # Deep lavender shadow
    C_MAIN    = (175, 145, 225, 255)    # Pastel lavender main
    C_LIGHT   = (215, 195, 250, 255)    # Soft lilac highlight
    C_WHITE   = (250, 248, 255, 255)    # Drawstrings
    C_GOLD    = (255, 210, 70, 255)     # Gold aglets & star

    # Back & Flanks (Does NOT cover the face!)
    # Head and face are: x: 95..145, y: 70..106
    # Hoodie covers back (y: 35..65, x: 95..180) and right rump (x: 155..192, y: 60..105) and left flank (x: 72..95, y: 70..105)
    # Plus collar ring around the neck (behind ears y: 48..60, and dipping below chin y: 108..114)

    # Body Polygon
    body_pts = [
        # Folded hood rim behind head
        (104, 48), (120, 44), (138, 46), (150, 52),
        # Right shoulder & back ridge
        (165, 54), (180, 65), (192, 80), (190, 95), (178, 105),
        # Lower right flank near paw
        (165, 107), (152, 105),
        # Collar dipping under chin (neckline)
        (138, 110), (126, 112), (114, 110),
        # Lower left flank near paw
        (95, 106), (82, 104), (72, 95), (72, 80), (82, 65),
        # Left neck
        (96, 54),
    ]

    d1.polygon(body_pts, fill=C_MAIN, outline=C_OUTLINE)

    # Folded Hood on Back of Neck (bunched soft hood collar)
    hood_bunch = [(98, 48), (110, 42), (126, 40), (142, 42), (154, 48), (145, 56), (126, 58), (106, 56)]
    d1.polygon(hood_bunch, fill=C_LIGHT, outline=C_OUTLINE)
    d1.line([(106, 56), (126, 58), (145, 56)], fill=C_SHADOW, width=1)

    # Highlights along the curved back
    d1.line([(120, 46), (145, 48), (170, 60), (185, 75)], fill=C_LIGHT, width=2)
    d1.line([(130, 47), (155, 52), (175, 68)], fill=C_WHITE, width=1)

    # Shadows along lower right flank
    d1.line([(160, 104), (175, 102), (188, 92)], fill=C_SHADOW, width=2)
    d1.line([(74, 92), (85, 102), (95, 104)], fill=C_SHADOW, width=1)

    # Kangaroo pocket on right flank (x: 162..184, y: 72..88)
    pocket = [(162, 73), (184, 78), (182, 88), (160, 84)]
    d1.polygon(pocket, fill=C_LIGHT, outline=C_OUTLINE)
    d1.line([(162, 73), (160, 84)], fill=C_SHADOW, width=1)
    d1.line([(184, 78), (182, 88)], fill=C_SHADOW, width=1)
    # Tiny golden star on pocket
    d1.point([(171, 79), (172, 79), (171, 80), (172, 80)], fill=C_GOLD)

    # Ribbed hem at rear
    for rx in range(172, 188, 3):
        d1.line([(rx, 98), (rx + 1, 104)], fill=C_SHADOW, width=1)

    # Neckline collar trim & drawstrings under chin
    d1.line([(114, 110), (126, 112), (138, 110)], fill=C_OUTLINE, width=2)
    d1.line([(115, 109), (126, 111), (137, 109)], fill=C_LIGHT, width=1)

    # Left drawstring
    d1.line([(118, 112), (117, 120)], fill=C_WHITE, width=1)
    d1.point([(117, 121)], fill=C_GOLD)
    # Right drawstring
    d1.line([(132, 112), (133, 120)], fill=C_WHITE, width=1)
    d1.point([(133, 121)], fill=C_GOLD)

    # CLEAR FACE AREA: ensure NO pixel ever touches face: x: 95..150, y: 58..108
    pix1 = hoodie_low.load()
    for y in range(58, 108):
        for x in range(96, 152):
            pix1[x, y] = (0, 0, 0, 0)

    # Upscale 4x with NEAREST to 1024x576 (TRUE PIXEL ART!)
    hoodie_high = hoodie_low.resize((1024, 576), Image.Resampling.NEAREST)
    hoodie_high.save(os.path.join(out_dir, "hoodie_special.png"), "PNG")

    # ------------------------------------------------------------------
    # 2. CLOUD PAJAMAS (Pastel Sky Blue Onesie) at 256x144
    # ------------------------------------------------------------------
    pajamas_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(pajamas_low)

    P_OUTLINE = (20, 50, 90, 255)       # Navy cyan
    P_SHADOW  = (70, 135, 195, 255)     # Deep sky blue
    P_MAIN    = (125, 195, 245, 255)    # Pastel sky blue
    P_LIGHT   = (185, 230, 255, 255)    # Cyan highlight
    P_WHITE   = (255, 255, 255, 255)    # Cloud white
    P_GOLD    = (255, 215, 70, 255)     # Star gold

    d2.polygon(body_pts, fill=P_MAIN, outline=P_OUTLINE)

    # Fluffy cloud collar along back of neck
    d2.polygon(hood_bunch, fill=P_WHITE, outline=P_OUTLINE)

    # Cloud patterns on back & flank
    def draw_p_cloud(cx, cy):
        # 3 dots + base
        d2.ellipse([cx - 4, cy - 2, cx + 1, cy + 3], fill=P_WHITE)
        d2.ellipse([cx - 1, cy - 4, cx + 5, cy + 3], fill=P_WHITE)
        d2.ellipse([cx + 3, cy - 2, cx + 7, cy + 3], fill=P_WHITE)
        d2.rectangle([cx - 3, cy + 1, cx + 6, cy + 3], fill=P_WHITE)
        d2.point([(cx - 1, cy + 3), (cx + 3, cy + 3)], fill=P_SHADOW)

    draw_p_cloud(165, 60)
    draw_p_cloud(180, 80)
    draw_p_cloud(158, 92)

    # Tiny golden stars
    d2.point([(155, 54), (175, 70), (186, 72)], fill=P_GOLD)

    # Highlights & shadows
    d2.line([(120, 46), (145, 48), (170, 60), (185, 75)], fill=P_LIGHT, width=2)
    d2.line([(160, 104), (175, 102), (188, 92)], fill=P_SHADOW, width=2)
    d2.line([(74, 92), (85, 102), (95, 104)], fill=P_SHADOW, width=1)

    # Fluffy white trim under chin
    d2.line([(114, 110), (126, 112), (138, 110)], fill=P_OUTLINE, width=2)
    for bx in [116, 122, 128, 134]:
        d2.ellipse([bx - 2, 109, bx + 2, 113], fill=P_WHITE, outline=P_OUTLINE)

    # CLEAR FACE AREA
    pix2 = pajamas_low.load()
    for y in range(58, 108):
        for x in range(96, 152):
            pix2[x, y] = (0, 0, 0, 0)

    pajamas_high = pajamas_low.resize((1024, 576), Image.Resampling.NEAREST)
    pajamas_high.save(os.path.join(out_dir, "cloud_pajamas.png"), "PNG")

    # ------------------------------------------------------------------
    # 3. CAPE HERO (Heroic Crimson Cape) at 256x144
    # ------------------------------------------------------------------
    cape_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d3 = ImageDraw.Draw(cape_low)

    K_OUTLINE = (75, 10, 15, 255)       # Deep crimson outline
    K_SHADOW  = (150, 18, 25, 255)      # Shadow fold
    K_MAIN    = (225, 38, 48, 255)      # Hero red
    K_LIGHT   = (255, 90, 100, 255)     # Satin highlight
    K_GOLD    = (255, 215, 55, 255)     # Gold brooch
    K_GEM     = (175, 10, 20, 255)      # Ruby gem

    cape_pts = [
        # Clasp at neck left
        (118, 111),
        # Collar band up behind left neck
        (98, 98), (92, 80), (96, 60), (112, 45),
        # Across top of back
        (135, 42), (160, 48), (182, 60),
        # Right rear billow & flutter
        (198, 75), (205, 88), (198, 95), (206, 106),
        # Bottom rear hem
        (195, 112), (180, 112), (165, 110),
        # Up to clasp right
        (135, 111),
    ]

    d3.polygon(cape_pts, fill=K_MAIN, outline=K_OUTLINE)

    # Billowing folds
    d3.line([(125, 46), (150, 48), (175, 58), (198, 75)], fill=K_LIGHT, width=2)
    d3.line([(135, 60), (160, 68), (185, 82), (202, 94)], fill=K_SHADOW, width=2)
    d3.line([(140, 80), (165, 88), (190, 104)], fill=K_SHADOW, width=2)

    # CLEAR FACE AREA completely!
    pix3 = cape_low.load()
    for y in range(55, 108):
        for x in range(96, 155):
            pix3[x, y] = (0, 0, 0, 0)

    # Golden Brooch with Ruby Center under chin (x: 124, y: 111)
    d3.ellipse([121, 108, 127, 114], fill=K_GOLD, outline=K_OUTLINE)
    d3.point([(124, 111)], fill=K_GEM)

    cape_high = cape_low.resize((1024, 576), Image.Resampling.NEAREST)
    cape_high.save(os.path.join(out_dir, "cape_hero.png"), "PNG")

    # ------------------------------------------------------------------
    # 4. CUTE BIB (Golden Star Baby Bib) at 256x144
    # ------------------------------------------------------------------
    bib_low = Image.new("RGBA", (256, 144), (0, 0, 0, 0))
    d4 = ImageDraw.Draw(bib_low)

    B_OUTLINE = (120, 85, 20, 255)      # Warm outline
    B_MAIN    = (255, 245, 175, 255)    # Buttercup yellow
    B_SHADOW  = (235, 210, 120, 255)    # Warm shadow
    B_LIGHT   = (255, 255, 225, 255)    # Cream highlight
    B_GOLD    = (255, 195, 35, 255)     # Star gold
    B_RIBBON  = (255, 135, 155, 255)    # Pink ribbon

    # Sits right below chin at (114..138, 108..122)
    bib_pts = [
        (116, 109), (113, 114), (114, 119),
        (120, 123), (126, 124), (132, 123),
        (138, 119), (139, 114), (136, 109),
        (126, 111),
    ]

    d4.polygon(bib_pts, fill=B_MAIN, outline=B_OUTLINE)
    # Scallops along bottom
    for sx in [117, 123, 129, 135]:
        d4.point([(sx, 123)], fill=B_SHADOW)

    # Gold star in center (126, 117)
    d4.point([(126, 115), (125, 116), (126, 116), (127, 116), (126, 117)], fill=B_GOLD)
    d4.point([(126, 116)], fill=(255, 255, 255, 255))

    # Ribbon ties
    d4.point([(115, 108), (137, 108)], fill=B_RIBBON)

    bib_high = bib_low.resize((1024, 576), Image.Resampling.NEAREST)
    bib_high.save(os.path.join(out_dir, "cute_bib.png"), "PNG")

    # ------------------------------------------------------------------
    # 5. SHOP THUMBNAILS (128x128 pixel framed icons)
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

    make_thumb(hoodie_low, "hoodie_special.png", (68, 38, 196, 124))
    make_thumb(pajamas_low, "cloud_pajamas.png", (68, 38, 196, 124))
    make_thumb(cape_low, "cape_hero.png", (88, 38, 210, 124))
    make_thumb(bib_low, "cute_bib.png", (110, 106, 142, 126))

    # ------------------------------------------------------------------
    # 6. TEST COMPOSITES
    # ------------------------------------------------------------------
    for item_high, name in [(hoodie_high, "hoodie_special"), (pajamas_high, "cloud_pajamas"), (cape_high, "cape_hero"), (bib_high, "cute_bib")]:
        comp = hamster_base.copy()
        comp.alpha_composite(item_high)
        comp_path = os.path.join(artifact_dir, f"test_pixel_{name}.png")
        comp.save(comp_path, "PNG")
        print(f"Saved: {comp_path}")

if __name__ == "__main__":
    create_pixel_wardrobe()
