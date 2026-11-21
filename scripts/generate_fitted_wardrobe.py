import os
import math
from PIL import Image, ImageDraw, ImageFilter

def create_fitted_wardrobe():
    hamster_path = "public/assets/breeds/winter_white.png"
    if not os.path.exists(hamster_path):
        hamster_path = "public/assets/heaven-hamster.png"
    
    hamster_base = Image.open(hamster_path).convert("RGBA")
    W, H = hamster_base.size # 1024, 576

    out_dir = "public/assets/wardrobe"
    thumb_dir = "public/assets/wardrobe/thumbs"
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(thumb_dir, exist_ok=True)
    artifact_dir = "C:/Users/nongd/.gemini/antigravity/brain/03ac06db-5441-423c-a3b4-de00a8f7314d"
    os.makedirs(artifact_dir, exist_ok=True)

    # -------------------------------------------------------------
    # 1. HOODIE SPECIAL (ชุดฮู้ดดี้พิเศษ Limited) - Pastel Lavender
    # -------------------------------------------------------------
    # Key coordinates on hamster:
    # Eyes: left (430, 347), right (547, 361)
    # Nose: (506, 410)
    # Head crown: (400..570, 160..230)
    # Ears: left (320..410, 160..270), right (590..680, 180..290)
    # Back: (350..770, 160..430)
    # Front paws: left (290..370, 420..460), right (600..660, 420..460)

    hoodie = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(hoodie)

    # Palette
    C_OUTLINE = (65, 35, 105, 255)      # Deep plum purple
    C_SHADOW  = (115, 80, 165, 255)     # Deep lavender shadow
    C_MAIN    = (165, 130, 220, 255)    # Pastel lavender
    C_LIGHT   = (195, 170, 240, 255)    # Soft lilac highlight
    C_WHITE   = (245, 240, 255, 255)    # Drawstrings & accents
    C_GOLD    = (255, 205, 75, 255)     # Aglet golden tips

    # 1a. Body of Hoodie (Back & Flanks)
    # Back curvature
    body_points = [
        (370, 250), # near left neck
        (340, 290), # left flank
        (335, 360), # left lower body
        (360, 410), # behind left paw
        (400, 430), # lower mid-left
        (440, 445), # under chin collar left
        (470, 455), # under chin center
        (540, 455), # under chin right
        (580, 440), # under chin collar right
        (620, 430), # near right paw
        (680, 425), # right lower flank
        (750, 400), # right rear flank
        (775, 340), # right rear curve
        (760, 270), # right upper rump
        (710, 200), # top right back
        (630, 160), # upper back ridge
        (550, 150), # top neck ridge
        (470, 160), # top left neck
        (420, 190), # behind left ear
    ]

    # Draw body base fill
    d.polygon(body_points, fill=C_MAIN, outline=C_OUTLINE)

    # 1b. Hood / Neck Opening (FACE HOLE CUTOUT)
    # The face hole must frame the eyes (430, 347) & (547, 361) and nose (506, 410)
    # We clear the face hole so the hamster's face is 100% visible!
    face_hole = [
        (410, 265), # upper left forehead
        (480, 255), # upper center forehead
        (545, 265), # upper right forehead
        (585, 305), # upper right cheek
        (600, 360), # right cheek
        (585, 410), # lower right cheek
        (545, 435), # under chin right
        (490, 440), # under chin center
        (435, 435), # under chin left
        (395, 400), # lower left cheek
        (385, 350), # left cheek
        (395, 300), # upper left cheek
    ]

    # Clear face hole
    d.polygon(face_hole, fill=(0, 0, 0, 0))

    # Hood Rim (Cozy ribbed trim framing the face hole)
    # Draw nice thick rim around face hole
    for i in range(len(face_hole)):
        p1 = face_hole[i]
        p2 = face_hole[(i + 1) % len(face_hole)]
        d.line([p1, p2], fill=C_OUTLINE, width=4)
        # Inner soft highlight
        # vector inwards slightly
        d.line([(p1[0], p1[1]+2), (p2[0], p2[1]+2)], fill=C_LIGHT, width=2)

    # 1c. Hood Crown (Top of hood over the head, arched behind ears)
    hood_crown = [
        (400, 170), (450, 145), (510, 140), (560, 150), (600, 180),
        (580, 220), (520, 210), (460, 210), (410, 220)
    ]
    d.polygon(hood_crown, fill=C_MAIN, outline=C_OUTLINE)

    # Cute little bear ears on the hood!
    # Left hood ear
    d.ellipse([370, 125, 420, 175], fill=C_MAIN, outline=C_OUTLINE, width=3)
    d.ellipse([382, 137, 408, 163], fill=C_SHADOW)
    # Right hood ear
    d.ellipse([540, 125, 590, 175], fill=C_MAIN, outline=C_OUTLINE, width=3)
    d.ellipse([552, 137, 578, 163], fill=C_SHADOW)

    # 1d. Hoodie Shading & Folds (Back & Rump)
    # Top highlight curve along back
    d.line([(480, 170), (580, 175), (670, 210), (730, 270)], fill=C_LIGHT, width=6)
    d.line([(500, 180), (600, 190), (690, 235)], fill=C_WHITE, width=2)

    # Bottom shadow folds along the lower body
    d.line([(360, 395), (420, 415), (460, 425)], fill=C_SHADOW, width=5)
    d.line([(620, 415), (690, 410), (745, 385)], fill=C_SHADOW, width=6)

    # Kangaroo Pocket on back/flank
    pocket = [(500, 310), (640, 310), (660, 365), (490, 365)]
    d.polygon(pocket, fill=C_LIGHT, outline=C_OUTLINE)
    # Pocket openings (slits on left and right)
    d.line([(500, 310), (490, 365)], fill=C_SHADOW, width=4)
    d.line([(640, 310), (660, 365)], fill=C_SHADOW, width=4)
    # Cute little star embroidery on pocket center
    d.polygon([(570, 330), (575, 342), (588, 343), (578, 350), (581, 362), (570, 355), (559, 362), (562, 350), (552, 343), (565, 342)], fill=C_GOLD, outline=C_OUTLINE)

    # Ribbed hem at rear
    for rx in range(690, 755, 6):
        d.line([(rx, 390), (rx + 2, 415)], fill=C_SHADOW, width=2)
    d.line([(680, 388), (755, 388)], fill=C_OUTLINE, width=2)

    # 1e. Drawstrings hanging from hoodie neck
    # Left string
    d.line([(455, 438), (452, 465), (455, 475)], fill=C_WHITE, width=4)
    d.ellipse([450, 472, 460, 482], fill=C_GOLD, outline=C_OUTLINE, width=1)
    # Right string
    d.line([(525, 440), (530, 468), (527, 478)], fill=C_WHITE, width=4)
    d.ellipse([522, 475, 532, 485], fill=C_GOLD, outline=C_OUTLINE, width=1)

    # Clean borders
    for i in range(len(body_points)):
        p1 = body_points[i]
        p2 = body_points[(i + 1) % len(body_points)]
        d.line([p1, p2], fill=C_OUTLINE, width=3)

    hoodie.save(os.path.join(out_dir, "hoodie_special.png"), "PNG")
    print("Saved hoodie_special.png")

    # -------------------------------------------------------------
    # 2. CLOUD PAJAMAS (ชุดนอนปุยเมฆแฟนซี) - Pastel Sky Blue + Clouds
    # -------------------------------------------------------------
    pajamas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(pajamas)

    P_OUTLINE = (35, 75, 120, 255)     # Deep navy cyan
    P_MAIN    = (125, 195, 245, 255)   # Pastel sky blue
    P_SHADOW  = (85, 155, 210, 255)    # Sky blue shadow
    P_LIGHT   = (175, 225, 255, 255)   # Ice blue highlight
    P_WHITE   = (255, 255, 255, 255)   # Cloud white
    P_GOLD    = (255, 220, 80, 255)    # Button / Star gold

    # Body fill (same snug body shape)
    d2.polygon(body_points, fill=P_MAIN, outline=P_OUTLINE)

    # Face cutout
    d2.polygon(face_hole, fill=(0, 0, 0, 0))

    # Fluffy Cloud Collar around face hole (scalloped fleece)
    for p in face_hole:
        d2.ellipse([p[0]-6, p[1]-6, p[0]+6, p[1]+6], fill=P_WHITE, outline=P_OUTLINE, width=1)

    # Clouds printed across the pajamas back
    def draw_cloud(cx, cy, scale=1.0):
        # 3 overlapping bubbles + flat bottom
        d2.ellipse([cx - 20*scale, cy - 10*scale, cx + 5*scale, cy + 15*scale], fill=P_WHITE)
        d2.ellipse([cx - 5*scale, cy - 18*scale, cx + 25*scale, cy + 15*scale], fill=P_WHITE)
        d2.ellipse([cx + 10*scale, cy - 8*scale, cx + 32*scale, cy + 15*scale], fill=P_WHITE)
        d2.rectangle([cx - 15*scale, cy + 2*scale, cx + 28*scale, cy + 16*scale], fill=P_WHITE)
        # soft shadow outline
        d2.arc([cx - 20*scale, cy - 10*scale, cx + 5*scale, cy + 15*scale], 140, 270, fill=P_SHADOW, width=2)
        d2.arc([cx - 5*scale, cy - 18*scale, cx + 25*scale, cy + 15*scale], 180, 360, fill=P_SHADOW, width=2)
        d2.arc([cx + 10*scale, cy - 8*scale, cx + 32*scale, cy + 15*scale], 270, 70, fill=P_SHADOW, width=2)

    # Scatter 3 fluffy clouds across back
    draw_cloud(620, 230, scale=1.1)
    draw_cloud(710, 310, scale=0.9)
    draw_cloud(520, 340, scale=0.85)

    # Tiny golden stars near clouds
    def draw_star(sx, sy, size=6):
        pts = [
            (sx, sy - size), (sx + size*0.3, sy - size*0.3), (sx + size, sy),
            (sx + size*0.3, sy + size*0.3), (sx, sy + size),
            (sx - size*0.3, sy + size*0.3), (sx - size, sy),
            (sx - size*0.3, sy - size*0.3)
        ]
        d2.polygon(pts, fill=P_GOLD, outline=P_OUTLINE)

    draw_star(590, 210, 6)
    draw_star(670, 260, 5)
    draw_star(740, 280, 6)
    draw_star(480, 360, 5)

    # Sleeping cap / fluffy hood pom-pom on top of head
    d2.polygon(hood_crown, fill=P_MAIN, outline=P_OUTLINE)
    d2.ellipse([490, 120, 525, 155], fill=P_WHITE, outline=P_OUTLINE, width=2)

    # Folds & highlights
    d2.line([(490, 175), (590, 180), (680, 215), (740, 275)], fill=P_LIGHT, width=5)
    d2.line([(360, 395), (420, 415), (460, 425)], fill=P_SHADOW, width=4)
    d2.line([(620, 415), (690, 410), (745, 385)], fill=P_SHADOW, width=5)

    # 3 Cute pearly yellow buttons down front/side
    d2.ellipse([440, 360, 452, 372], fill=P_GOLD, outline=P_OUTLINE, width=2)
    d2.ellipse([450, 395, 462, 407], fill=P_GOLD, outline=P_OUTLINE, width=2)
    d2.ellipse([465, 430, 477, 442], fill=P_GOLD, outline=P_OUTLINE, width=2)

    # Pajama cuff ribbing at rear
    for rx in range(690, 755, 6):
        d2.line([(rx, 390), (rx + 2, 415)], fill=P_SHADOW, width=2)
    d2.line([(680, 388), (755, 388)], fill=P_OUTLINE, width=2)

    # Outlines
    for i in range(len(body_points)):
        p1 = body_points[i]
        p2 = body_points[(i + 1) % len(body_points)]
        d2.line([p1, p2], fill=P_OUTLINE, width=3)

    pajamas.save(os.path.join(out_dir, "cloud_pajamas.png"), "PNG")
    print("Saved cloud_pajamas.png")

    # -------------------------------------------------------------
    # 3. CAPE HERO (ผ้าคลุมฮีโร่สีแดง) - Superhero Cape + Gold Medallion
    # -------------------------------------------------------------
    cape = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d3 = ImageDraw.Draw(cape)

    K_OUTLINE = (90, 15, 20, 255)       # Deep ruby outline
    K_MAIN    = (225, 45, 55, 255)      # Heroic crimson red
    K_SHADOW  = (165, 25, 35, 255)      # Crimson fold shadow
    K_LIGHT   = (255, 95, 105, 255)     # Satin red highlight
    K_GOLD    = (255, 215, 60, 255)     # Golden brooch
    K_GEM     = (180, 10, 30, 255)      # Ruby gem center

    # Cape drapes across back from left shoulder (x~380) to rear billowing edge (x~800)
    # The face, front paws, and head are 100% UNTOUCHED!
    cape_points = [
        (470, 420), # neck clasp left
        (430, 390), # left shoulder fold
        (410, 320), # left upper fold
        (460, 230), # upper back drape
        (540, 190), # high ridge of cape
        (640, 180), # high rear ridge
        (720, 210), # billowing top fold
        (800, 280), # billow peak 1
        (785, 330), # billow valley 1
        (810, 380), # billow peak 2
        (780, 430), # bottom rear corner
        (710, 430), # bottom edge
        (630, 435), # bottom edge mid
        (550, 440), # under right neck
        (515, 440), # neck clasp center
    ]

    d3.polygon(cape_points, fill=K_MAIN, outline=K_OUTLINE)

    # Dramatic flowing cape folds
    # Fold 1: High satin ridge
    d3.line([(520, 210), (620, 205), (710, 235), (780, 290)], fill=K_LIGHT, width=7)
    d3.line([(530, 212), (630, 207), (700, 230)], fill=(255, 180, 185, 255), width=2)

    # Fold 2: Center ripple fold
    d3.line([(480, 280), (580, 270), (690, 300), (795, 370)], fill=K_SHADOW, width=6)
    d3.line([(490, 275), (590, 265), (700, 295)], fill=K_LIGHT, width=3)

    # Fold 3: Lower billowing shadow fold
    d3.line([(510, 360), (620, 360), (720, 380), (775, 420)], fill=K_SHADOW, width=7)

    # Outer outline crisping
    for i in range(len(cape_points)):
        p1 = cape_points[i]
        p2 = cape_points[(i + 1) % len(cape_points)]
        d3.line([p1, p2], fill=K_OUTLINE, width=3)

    # Golden Heroic Brooch / Star Medallion at neck collar
    # Clasp position: (495, 435)
    bx, by = 495, 435
    d3.ellipse([bx - 16, by - 16, bx + 16, by + 16], fill=K_GOLD, outline=K_OUTLINE, width=2)
    d3.polygon([
        (bx, by - 12), (bx + 4, by - 4), (bx + 12, by),
        (bx + 4, by + 4), (bx, by + 12),
        (bx - 4, by + 4), (bx - 12, by),
        (bx - 4, by - 4)
    ], fill=K_GEM, outline=K_OUTLINE)
    # Golden star shine glint
    d3.ellipse([bx - 4, by - 4, bx - 1, by - 1], fill=(255, 255, 255, 255))

    cape.save(os.path.join(out_dir, "cape_hero.png"), "PNG")
    print("Saved cape_hero.png")

    # -------------------------------------------------------------
    # 4. CUTE BIB (ผ้ากันเปื้อนลายดาว) - Pastel Star Bib
    # -------------------------------------------------------------
    bib = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d4 = ImageDraw.Draw(bib)

    B_OUTLINE = (140, 105, 30, 255)     # Warm brown outline
    B_MAIN    = (255, 245, 185, 255)    # Creamy buttercup yellow
    B_SHADOW  = (240, 215, 130, 255)    # Warm gold shadow
    B_LIGHT   = (255, 255, 230, 255)    # Bright cream highlight
    B_GOLD    = (255, 195, 45, 255)     # Star gold
    B_RIBBON  = (255, 140, 160, 255)    # Pastel pink ribbon tie

    # Bib curves neatly below chin (y: 420..485, x: 430..570)
    bib_pts = [
        (450, 420), # left neck strap
        (440, 435), # left side
        (435, 460), # left bottom curve
        (460, 480), # scallop 1
        (495, 485), # center bottom point
        (535, 480), # scallop 2
        (560, 460), # right bottom curve
        (555, 435), # right side
        (545, 420), # right neck strap
        (515, 430), # top neck curve center
        (480, 430), # top neck curve left
    ]

    d4.polygon(bib_pts, fill=B_MAIN, outline=B_OUTLINE)

    # Scalloped lace border along bottom
    for sx in [445, 465, 485, 505, 525, 545]:
        d4.arc([sx - 10, 465, sx + 10, 485], 0, 180, fill=B_OUTLINE, width=2)
        d4.ellipse([sx - 2, 470, sx + 2, 474], fill=B_SHADOW)

    # Highlight border inside
    d4.line([(450, 435), (445, 455), (465, 473)], fill=B_LIGHT, width=3)
    d4.line([(485, 435), (515, 435)], fill=B_SHADOW, width=2)

    # Big Embroidered Golden Star in center of bib
    sx, sy, sz = 495, 455, 13
    star_pts = []
    for i in range(10):
        r = sz if i % 2 == 0 else sz * 0.45
        angle = i * math.pi / 5 - math.pi / 2
        star_pts.append((sx + r * math.cos(angle), sy + r * math.sin(angle)))
    d4.polygon(star_pts, fill=B_GOLD, outline=B_OUTLINE)
    # Star glint
    d4.ellipse([sx - 3, sy - 5, sx, sy - 2], fill=(255, 255, 255, 255))

    # Cute pink tie ribbon bow on collar
    d4.ellipse([442, 415, 454, 425], fill=B_RIBBON, outline=B_OUTLINE, width=1)
    d4.ellipse([540, 415, 552, 425], fill=B_RIBBON, outline=B_OUTLINE, width=1)

    # Outlines
    for i in range(len(bib_pts)):
        p1 = bib_pts[i]
        p2 = bib_pts[(i + 1) % len(bib_pts)]
        d4.line([p1, p2], fill=B_OUTLINE, width=2)

    bib.save(os.path.join(out_dir, "cute_bib.png"), "PNG")
    print("Saved cute_bib.png")

    # -------------------------------------------------------------
    # 5. GENERATE SHOP THUMBNAILS (128x128 icons for the shop list)
    # -------------------------------------------------------------
    def make_thumb(src_img, name, crop_box):
        cropped = src_img.crop(crop_box)
        # Create 128x128 soft circular framed icon
        thumb = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        td = ImageDraw.Draw(thumb)
        # Soft pastel circular backdrop
        td.ellipse([6, 6, 122, 122], fill=(255, 255, 255, 220), outline=(225, 220, 235, 255), width=2)
        # Fit cropped into 100x100
        cropped.thumbnail((100, 100), Image.Resampling.LANCZOS)
        cw, ch = cropped.size
        thumb.paste(cropped, ((128 - cw) // 2, (128 - ch) // 2), cropped)
        thumb.save(os.path.join(thumb_dir, name), "PNG")
        print(f"Saved thumb {name}")

    make_thumb(hoodie, "hoodie_special.png", (330, 120, 780, 470))
    make_thumb(pajamas, "cloud_pajamas.png", (330, 120, 780, 470))
    make_thumb(cape, "cape_hero.png", (410, 170, 815, 450))
    make_thumb(bib, "cute_bib.png", (425, 410, 565, 490))

    # -------------------------------------------------------------
    # 6. TEST COMPOSITES FOR VERIFICATION
    # -------------------------------------------------------------
    def test_composite(item_img, test_name):
        comp = hamster_base.copy()
        comp.alpha_composite(item_img)
        comp_path = os.path.join(artifact_dir, f"test_{test_name}.png")
        comp.save(comp_path, "PNG")
        print(f"Saved test composite: {comp_path}")

    test_composite(hoodie, "hoodie_special")
    test_composite(pajamas, "cloud_pajamas")
    test_composite(cape, "cape_hero")
    test_composite(bib, "cute_bib")

if __name__ == "__main__":
    create_fitted_wardrobe()
