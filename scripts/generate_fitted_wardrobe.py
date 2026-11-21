import os
import math
from PIL import Image, ImageDraw

CANVAS_W, CANVAS_H = 1024, 576
OUTPUT_DIR = r"c:\Users\nongd\OneDrive\Desktop\Vs\HaevenGame\public\assets\wardrobe"
THUMBS_DIR = os.path.join(OUTPUT_DIR, "thumbs")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(THUMBS_DIR, exist_ok=True)

# Helper to create a transparent 1024x576 image
def new_layer():
    return Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))

# Helper to save both full fitted overlay and 128x128 cropped thumbnail
def save_item(item_id, img):
    # 1. Save full overlay
    full_path = os.path.join(OUTPUT_DIR, f"{item_id}.png")
    img.save(full_path, "PNG")

    # 2. Save thumbnail
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
        # Pad to square
        w, h = cropped.size
        max_dim = max(w, h)
        padded = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
        padded.paste(cropped, ((max_dim - w) // 2, (max_dim - h) // 2))
        thumb = padded.resize((128, 128), Image.Resampling.LANCZOS)
        thumb.save(os.path.join(THUMBS_DIR, f"{item_id}.png"), "PNG")
    print(f"Generated {item_id}: bbox={bbox}")


# ==============================================================================
# 1. FROG HAT (หมวกกบเขียวตาโต สวมบนหัวระหว่างสองหู พอดีเป๊ะ)
# ==============================================================================
def draw_frog_hat():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (20, 80, 40, 255)
    C_MAIN = (74, 222, 128, 255)
    C_SHADOW = (34, 160, 80, 255)
    C_LIGHT = (167, 243, 175, 255)
    C_WHITE = (255, 255, 255, 255)
    C_BLACK = (20, 30, 20, 255)

    # Beanie Dome on head: X: 455..545, Y: 75..145
    # Beanie body
    draw.chord([455, 75, 545, 175], start=180, end=360, fill=C_MAIN, outline=C_OUTLINE, width=4)
    # Beanie lower brim
    draw.rounded_rectangle([450, 125, 550, 148], radius=8, fill=C_SHADOW, outline=C_OUTLINE, width=4)
    draw.line([456, 132, 544, 132], fill=C_LIGHT, width=3)

    # Texture stitches
    for x in range(470, 535, 12):
        draw.line([x, 95, x, 122], fill=C_SHADOW, width=2)
        draw.line([x + 1, 95, x + 1, 120], fill=C_LIGHT, width=1)

    # Frog Eye Left: center (475, 70), radius 18
    draw.ellipse([456, 52, 494, 90], fill=C_MAIN, outline=C_OUTLINE, width=4)
    draw.ellipse([463, 59, 487, 83], fill=C_WHITE, outline=C_OUTLINE, width=2)
    draw.ellipse([470, 65, 482, 77], fill=C_BLACK)
    draw.ellipse([472, 67, 476, 71], fill=C_WHITE) # sparkle

    # Frog Eye Right: center (525, 70), radius 18
    draw.ellipse([506, 52, 544, 90], fill=C_MAIN, outline=C_OUTLINE, width=4)
    draw.ellipse([513, 59, 537, 83], fill=C_WHITE, outline=C_OUTLINE, width=2)
    draw.ellipse([520, 65, 532, 77], fill=C_BLACK)
    draw.ellipse([522, 67, 526, 71], fill=C_WHITE)

    return img


# ==============================================================================
# 2. UNICORN HAT (หมวกยูนิคอร์นสายรุ้ง)
# ==============================================================================
def draw_unicorn_hat():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (180, 120, 20, 255)
    C_GOLD = (255, 215, 0, 255)
    C_PINK = (255, 180, 210, 255)
    C_PURPLE = (210, 160, 245, 255)
    C_CYAN = (160, 230, 245, 255)
    C_WHITE = (255, 255, 255, 255)

    # Horn polygon: Tip (500, 32), Base left (490, 128), Base right (512, 128)
    draw.polygon([(500, 32), (512, 128), (490, 128)], fill=C_GOLD, outline=C_OUTLINE)

    # Spiral stripes on horn
    draw.line([(492, 110), (510, 102)], fill=C_PINK, width=5)
    draw.line([(494, 88), (508, 80)], fill=C_PURPLE, width=4)
    draw.line([(496, 66), (506, 58)], fill=C_CYAN, width=3)
    draw.line([(498, 46), (504, 40)], fill=C_WHITE, width=2)

    # Flower headband at base
    def draw_flower(cx, cy, col):
        for ang in range(0, 360, 72):
            rad = math.radians(ang)
            px = cx + math.cos(rad) * 9
            py = cy + math.sin(rad) * 9
            draw.ellipse([px - 5, py - 5, px + 5, py + 5], fill=col)
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=C_GOLD)

    draw_flower(476, 134, C_PINK)
    draw_flower(501, 132, C_PURPLE)
    draw_flower(526, 134, C_CYAN)

    return img


# ==============================================================================
# 3. PARTY HAT (หมวกปาร์ตี้เอียงน่ารัก สวมบนหัวพอดีเป๊ะ)
# ==============================================================================
def draw_party_hat():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (50, 30, 70, 255)
    C_CYAN = (56, 189, 248, 255)
    C_MAGENTA = (244, 63, 94, 255)
    C_YELLOW = (251, 191, 36, 255)
    C_PURPLE = (168, 85, 247, 255)
    C_WHITE = (255, 255, 255, 255)

    # Base at head crown: X: 472..532, Y: 130..140
    # Tip at: X: 504, Y: 42
    # Cone body filled with colorful diagonal stripes
    tip = (504, 42)
    base_l = (472, 138)
    base_r = (532, 134)

    draw.polygon([tip, base_r, base_l], fill=C_YELLOW, outline=C_OUTLINE)

    # Mask stripes inside cone
    stripe_img = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(stripe_img)
    s_draw.polygon([tip, base_r, base_l], fill=(255, 255, 255, 255))

    pattern = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(pattern)
    colors = [C_MAGENTA, C_YELLOW, C_CYAN, C_PURPLE]
    for i in range(-50, 200, 16):
        p_draw.polygon([(400 + i, 20), (450 + i, 20), (520 + i, 160), (470 + i, 160)], fill=colors[(i // 16) % 4])

    pattern.putalpha(stripe_img.split()[3])
    img.alpha_composite(pattern)

    # Outline cone edges
    draw.line([tip, base_l], fill=C_OUTLINE, width=3)
    draw.line([tip, base_r], fill=C_OUTLINE, width=3)
    draw.line([base_l, base_r], fill=C_OUTLINE, width=4)

    # Scalloped bottom rim
    draw.rounded_rectangle([470, 132, 534, 142], radius=4, fill=C_WHITE, outline=C_OUTLINE, width=2)

    # Fluffy Pom-pom at tip (504, 38)
    draw.ellipse([492, 26, 516, 50], fill=C_YELLOW, outline=C_OUTLINE, width=3)
    draw.ellipse([497, 30, 506, 39], fill=C_WHITE)

    return img


# ==============================================================================
# 4. FLOWER CROWN (มงกุฎดอกไม้พาสเทล เหนือคิ้วและตา)
# ==============================================================================
def draw_flower_crown():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_STEM = (46, 125, 50, 255)
    C_LEAF = (102, 187, 106, 255)
    C_PETAL_PINK = (255, 182, 193, 255)
    C_PETAL_DARK = (240, 98, 146, 255)
    C_CORE = (255, 238, 88, 255)

    # Arching vine across forehead: X: 435..565, Y: 180..215
    points = []
    for x in range(435, 566, 4):
        # arc dipping gently in center
        t = (x - 500) / 65.0
        y = int(185 + (t ** 2) * 20)
        points.append((x, y))

    for i in range(len(points) - 1):
        draw.line([points[i], points[i + 1]], fill=C_STEM, width=5)

    # Leaves
    for lx, ly in [(445, 195), (470, 188), (495, 184), (525, 188), (550, 195)]:
        draw.ellipse([lx - 8, ly - 14, lx + 8, ly - 4], fill=C_LEAF)

    # Sakura blossoms
    def draw_blossom(cx, cy):
        for a in range(0, 360, 72):
            rad = math.radians(a)
            px = cx + math.cos(rad) * 11
            py = cy + math.sin(rad) * 11
            draw.ellipse([px - 6, py - 6, px + 6, py + 6], fill=C_PETAL_PINK, outline=C_PETAL_DARK, width=1)
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=C_CORE)

    draw_blossom(446, 198)
    draw_blossom(478, 188)
    draw_blossom(512, 186)
    draw_blossom(546, 196)

    return img


# ==============================================================================
# 5. SUNGLASSES (แว่นกันแดดสุดเท่ ตรงตาน้องพอดีเป๊ะ)
# ==============================================================================
def draw_sunglasses():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (15, 23, 42, 255)
    C_FRAME = (30, 41, 59, 255)
    C_LENS = (51, 65, 85, 255)
    C_WHITE = (255, 255, 255, 255)

    # Left eye center: (429, 347) -> lens box: [405, 332, 455, 368]
    draw.rounded_rectangle([404, 330, 456, 368], radius=6, fill=C_LENS, outline=C_OUTLINE, width=4)
    # Right eye center: (546, 362) -> lens box: [520, 345, 572, 381]
    draw.rounded_rectangle([520, 344, 572, 382], radius=6, fill=C_LENS, outline=C_OUTLINE, width=4)

    # Bridge between lenses: X: 456..520
    draw.line([(454, 345), (522, 356)], fill=C_FRAME, width=6)
    draw.line([(454, 345), (522, 356)], fill=C_OUTLINE, width=2)

    # Reflections / Glint on lenses
    draw.line([(412, 338), (426, 338)], fill=C_WHITE, width=3)
    draw.line([(414, 343), (420, 343)], fill=C_WHITE, width=2)

    draw.line([(528, 352), (542, 352)], fill=C_WHITE, width=3)
    draw.line([(530, 357), (536, 357)], fill=C_WHITE, width=2)

    return img


# ==============================================================================
# 6. STAR GLASSES (แว่นตาดาววิ้งค์ ตรงตาทั้งสองข้าง)
# ==============================================================================
def draw_star_glasses():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (180, 110, 0, 255)
    C_GOLD = (255, 215, 0, 255)
    C_LIGHT = (255, 245, 120, 255)
    C_WHITE = (255, 255, 255, 255)

    def draw_star(cx, cy, r_outer=24, r_inner=10):
        points = []
        for i in range(10):
            r = r_outer if i % 2 == 0 else r_inner
            ang = math.radians(i * 36 - 90)
            points.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
        draw.polygon(points, fill=C_GOLD, outline=C_OUTLINE)
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=C_WHITE)

    draw_star(429, 347)
    draw_star(546, 362)

    # Bridge
    draw.line([(448, 348), (528, 358)], fill=C_GOLD, width=5)
    draw.line([(448, 348), (528, 358)], fill=C_OUTLINE, width=2)

    return img


# ==============================================================================
# 7. RED BOW (โบว์แดงน่ารัก ผูกที่คอใต้คาง)
# ==============================================================================
def draw_red_bow():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (120, 15, 30, 255)
    C_DARK = (185, 25, 45, 255)
    C_MAIN = (235, 40, 65, 255)
    C_LIGHT = (255, 120, 140, 255)
    C_WHITE = (255, 210, 220, 255)

    # Center knot at: (485, 412)
    # Left loop: X: 450..480, Y: 395..425
    draw.ellipse([446, 396, 484, 426], fill=C_MAIN, outline=C_OUTLINE, width=3)
    draw.ellipse([456, 404, 474, 418], fill=C_DARK)
    draw.line([452, 403, 468, 403], fill=C_LIGHT, width=2)

    # Right loop: X: 490..524, Y: 398..428
    draw.ellipse([488, 398, 526, 428], fill=C_MAIN, outline=C_OUTLINE, width=3)
    draw.ellipse([498, 406, 516, 420], fill=C_DARK)
    draw.line([496, 405, 512, 405], fill=C_LIGHT, width=2)

    # Ribbon tails
    draw.polygon([(478, 415), (464, 436), (476, 434)], fill=C_MAIN, outline=C_OUTLINE)
    draw.polygon([(492, 416), (506, 438), (494, 436)], fill=C_MAIN, outline=C_OUTLINE)

    # Center Knot
    draw.rounded_rectangle([478, 404, 494, 422], radius=4, fill=C_MAIN, outline=C_OUTLINE, width=3)
    draw.point([484, 409], fill=C_WHITE)

    return img


# ==============================================================================
# 8. BELL COLLAR (กระดิ่งทองกุ๊งกิ๊ง ใต้คาง)
# ==============================================================================
def draw_bell_collar():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_COLLAR = (220, 38, 38, 255)
    C_OUTLINE = (120, 20, 20, 255)
    C_GOLD = (250, 204, 21, 255)
    C_GOLD_DARK = (180, 120, 10, 255)
    C_WHITE = (255, 255, 255, 255)
    C_SLIT = (60, 40, 10, 255)

    # Collar strap around neck: X: 450..525, Y: 398..408
    draw.line([(452, 400), (524, 405)], fill=C_COLLAR, width=8)
    draw.line([(452, 400), (524, 405)], fill=C_OUTLINE, width=2)

    # Golden bell: center (487, 418), radius 12
    draw.ellipse([475, 406, 499, 430], fill=C_GOLD, outline=C_GOLD_DARK, width=3)
    # Bell slit
    draw.line([(480, 420), (494, 420)], fill=C_SLIT, width=2)
    draw.ellipse([485, 421, 489, 425], fill=C_SLIT)
    # Shine
    draw.ellipse([480, 410, 484, 414], fill=C_WHITE)

    return img


# ==============================================================================
# 9. STAR BADGE (เข็มกลัดดาวประกาย ติดที่หน้าอก)
# ==============================================================================
def draw_star_badge():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (160, 105, 10, 255)
    C_GOLD = (245, 185, 20, 255)
    C_RIBBON = (59, 130, 246, 255)
    C_WHITE = (255, 255, 255, 255)

    cx, cy = 385, 380

    # Ribbon tails
    draw.polygon([(cx - 4, cy + 6), (cx - 10, cy + 24), (cx - 4, cy + 20)], fill=C_RIBBON)
    draw.polygon([(cx + 4, cy + 6), (cx + 10, cy + 24), (cx + 4, cy + 20)], fill=C_RIBBON)

    # Star badge
    pts = []
    for i in range(10):
        r = 16 if i % 2 == 0 else 7
        ang = math.radians(i * 36 - 90)
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(pts, fill=C_GOLD, outline=C_OUTLINE)
    draw.point([cx - 2, cy - 3], fill=C_WHITE)

    return img


# ==============================================================================
# 10. HERO CAPE (ผ้าคลุมฮีโร่สีแดง สะบัดพลิ้วไปด้านหลังลำตัวอย่างสง่างาม)
# ==============================================================================
def draw_hero_cape():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (120, 15, 30, 255)
    C_DEEP = (160, 20, 40, 255)
    C_MAIN = (225, 29, 72, 255)
    C_LIGHT = (251, 113, 133, 255)
    C_GOLD = (251, 191, 36, 255)

    # Cape starts at shoulder clasp (540, 340) and flows back to (640..740, 230..410)
    cape_poly = [
        (540, 335), # shoulder clasp
        (590, 260), # upper back flow
        (660, 225), # fluttering back top
        (730, 250), # cape tip
        (710, 350), # outer hem
        (670, 395), # lower hem
        (610, 405), # lower drape
        (555, 385), # shoulder return
    ]
    draw.polygon(cape_poly, fill=C_MAIN, outline=C_OUTLINE)

    # Realistic cloth folds
    draw.line([(550, 345), (690, 275)], fill=C_DEEP, width=5)
    draw.line([(552, 342), (692, 272)], fill=C_LIGHT, width=3)
    draw.line([(565, 365), (670, 375)], fill=C_DEEP, width=5)
    draw.line([(567, 362), (672, 372)], fill=C_LIGHT, width=3)

    # Gold shoulder brooch
    draw.ellipse([532, 332, 548, 348], fill=C_GOLD, outline=C_OUTLINE, width=2)
    draw.point([538, 338], fill=(255, 255, 255, 255))

    return img


# ==============================================================================
# 11. CLOUD PAJAMAS (ชุดนอนปุยเมฆ แนบพอดีตามสรีระหลังแฮมสเตอร์ ไม่บังหน้า/เท้า)
# ==============================================================================
def draw_cloud_pajamas():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (70, 110, 160, 255)
    C_SHADOW = (147, 197, 253, 255)
    C_MAIN = (191, 219, 254, 255)
    C_LIGHT = (239, 246, 255, 255)
    C_WHITE = (255, 255, 255, 255)
    C_RIB = (224, 242, 254, 255)
    C_BUTTON = (251, 191, 36, 255)

    # Hamster back fleece blanket/vest shape:
    # Arches over the fluffy back: X: 370..660, Y: 180..350
    # Leaves head, cheeks (340..590, 320..420), nose, paws (420..460) completely exposed!
    back_poly = [
        (470, 185), # Neck collar left
        (535, 185), # Neck collar right
        (580, 205), # Right shoulder
        (635, 245), # Flank upper right
        (655, 295), # Rear right
        (630, 340), # Rear lower
        (560, 355), # Mid lower back
        (470, 350), # Mid left
        (410, 335), # Lower left flank
        (375, 290), # Upper left flank
        (415, 225), # Left shoulder
    ]
    draw.polygon(back_poly, fill=C_MAIN, outline=C_OUTLINE)

    # Shading along back contours
    draw.line([(385, 290), (475, 345), (565, 350), (630, 335)], fill=C_SHADOW, width=8)

    # White ribbed collar at neck
    draw.line([(468, 185), (538, 185)], fill=C_RIB, width=8)
    draw.line([(468, 185), (538, 185)], fill=C_OUTLINE, width=2)

    # Cute White Fluffy Cloud Patterns on the back
    def draw_cloud(cx, cy, s=1.0):
        r1, r2, r3 = int(12 * s), int(16 * s), int(11 * s)
        draw.ellipse([cx - r1, cy - r1, cx + r1, cy + r1], fill=C_WHITE)
        draw.ellipse([cx + 12 * s - r2, cy - 4 - r2, cx + 12 * s + r2, cy - 4 + r2], fill=C_WHITE)
        draw.ellipse([cx + 25 * s - r3, cy - r3, cx + 25 * s + r3, cy + r3], fill=C_WHITE)
        draw.rounded_rectangle([cx - r1, cy, cx + int(25 * s) + r3, cy + int(10 * s)], radius=4, fill=C_WHITE)

    draw_cloud(445, 230, 0.9)
    draw_cloud(540, 245, 1.1)
    draw_cloud(480, 290, 1.0)

    # Small gold buttons along spine seam
    for bx, by in [(505, 210), (505, 255), (505, 305)]:
        draw.ellipse([bx - 3, by - 3, bx + 3, by + 3], fill=C_BUTTON, outline=C_OUTLINE, width=1)

    return img


# ==============================================================================
# 12. HOODIE SPECIAL (ชุดฮู้ดดี้สีม่วงพาสเทล แนบสรีระหลังน้องอย่างน่ารัก)
# ==============================================================================
def draw_hoodie_special():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (107, 33, 168, 255)
    C_SHADOW = (192, 132, 252, 255)
    C_MAIN = (233, 213, 255, 255)
    C_LIGHT = (250, 245, 255, 255)
    C_POCKET = (216, 180, 254, 255)
    C_WHITE = (255, 255, 255, 255)

    back_poly = [
        (470, 185), (535, 185), (580, 205), (635, 245), (655, 295),
        (630, 340), (560, 355), (470, 350), (410, 335), (375, 290), (415, 225),
    ]
    draw.polygon(back_poly, fill=C_MAIN, outline=C_OUTLINE)

    # Folded Hood resting behind neck: X: 470..535, Y: 165..190
    draw.ellipse([468, 162, 538, 196], fill=C_POCKET, outline=C_OUTLINE, width=3)
    draw.ellipse([476, 170, 530, 190], fill=C_MAIN)

    # Back kangaroo pouch pocket: X: 475..545, Y: 270..315
    draw.rounded_rectangle([475, 270, 545, 315], radius=8, fill=C_POCKET, outline=C_OUTLINE, width=2)
    draw.line([475, 280, 485, 305], fill=C_OUTLINE, width=2) # pocket side opening
    draw.line([545, 280, 535, 305], fill=C_OUTLINE, width=2)

    # White hoodie drawstring cords
    draw.line([(492, 190), (492, 225)], fill=C_WHITE, width=3)
    draw.line([(516, 190), (516, 225)], fill=C_WHITE, width=3)
    draw.ellipse([490, 223, 494, 227], fill=(251, 191, 36, 255))
    draw.ellipse([514, 223, 518, 227], fill=(251, 191, 36, 255))

    return img


# ==============================================================================
# 13. CUTE BIB (ผ้ากันเปื้อนลายดาว ผูกที่คอ สวมบนหน้าอกน่ารัก)
# ==============================================================================
def draw_cute_bib():
    img = new_layer()
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (180, 120, 20, 255)
    C_MAIN = (254, 240, 138, 255)
    C_LACE = (255, 255, 255, 255)
    C_STAR = (245, 158, 11, 255)

    # Bib body: X: 455..520, Y: 395..440
    draw.rounded_rectangle([455, 395, 520, 438], radius=12, fill=C_MAIN, outline=C_OUTLINE, width=2)

    # Scalloped white lace hem
    for x in range(458, 518, 10):
        draw.ellipse([x - 4, 432, x + 4, 440], fill=C_LACE, outline=C_OUTLINE, width=1)

    # Center Star
    cx, cy = 487, 416
    pts = []
    for i in range(10):
        r = 9 if i % 2 == 0 else 4
        ang = math.radians(i * 36 - 90)
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(pts, fill=C_STAR)

    return img


# ==============================================================================
# EXECUTE AND SAVE ALL ITEMS
# ==============================================================================
generators = {
    "frog_hat": draw_frog_hat,
    "unicorn_hat": draw_unicorn_hat,
    "party_hat": draw_party_hat,
    "flower_crown": draw_flower_crown,
    "sunglasses": draw_sunglasses,
    "star_glasses": draw_star_glasses,
    "red_bow": draw_red_bow,
    "bell_collar": draw_bell_collar,
    "star_badge": draw_star_badge,
    "cape_hero": draw_hero_cape,
    "cloud_pajamas": draw_cloud_pajamas,
    "hoodie_special": draw_hoodie_special,
    "cute_bib": draw_cute_bib,
}

for item_id, gen_fn in generators.items():
    layer = gen_fn()
    save_item(item_id, layer)

print("=== ALL FITTED WARDROBE LAYERS GENERATED SUCCESSFULLY ===")
