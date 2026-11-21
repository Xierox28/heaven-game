import os
import math
from PIL import Image, ImageDraw

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_ASSETS = os.path.join(BASE_DIR, "public", "assets")

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def upscale_pixel_art(img, scale=4):
    w, h = img.size
    return img.resize((w * scale, h * scale), Image.Resampling.NEAREST)

# ==============================================================================
# 1. 💎 DIAMOND (128x128 Pixel Art Gem)
# ==============================================================================
def create_diamond():
    # 32x32 canvas
    img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Palette
    C_OUTLINE = (12, 45, 72, 255)
    C_DARK = (24, 115, 170, 255)
    C_MID = (46, 175, 225, 255)
    C_LIGHT = (115, 222, 255, 255)
    C_WHITE = (235, 250, 255, 255)

    # Octagonal Gem shape
    # Top flat: x=10..21, y=6
    # Upper facets: (10,6) to (5,13), (21,6) to (26,13)
    # Lower facets: (5,13) to (16,27), (26,13) to (16,27)
    
    # Fill background polygon
    draw.polygon([(10, 6), (21, 6), (27, 13), (16, 27), (4, 13)], fill=C_MID, outline=C_OUTLINE)

    # Shading facets
    # Center table
    draw.polygon([(11, 7), (20, 7), (22, 12), (9, 12)], fill=C_LIGHT)
    # Top-left facet
    draw.polygon([(10, 6), (11, 7), (9, 12), (5, 13)], fill=C_WHITE)
    # Top-right facet
    draw.polygon([(20, 7), (21, 6), (26, 13), (22, 12)], fill=C_MID)
    # Lower left facet
    draw.polygon([(5, 13), (9, 12), (16, 26)], fill=C_LIGHT)
    # Lower middle facet
    draw.polygon([(9, 12), (22, 12), (16, 26)], fill=C_MID)
    # Lower right facet
    draw.polygon([(22, 12), (26, 13), (16, 26)], fill=C_DARK)

    # Sparkle points
    draw.point((12, 8), fill=C_WHITE)
    draw.point((13, 8), fill=C_WHITE)
    draw.point((12, 9), fill=C_WHITE)
    draw.point((25, 14), fill=C_WHITE)

    # External glint
    draw.point((4, 8), fill=(180, 240, 255, 220))
    draw.point((3, 7), fill=(255, 255, 255, 255))
    draw.point((2, 7), fill=(180, 240, 255, 200))
    draw.point((3, 6), fill=(180, 240, 255, 200))
    draw.point((3, 8), fill=(180, 240, 255, 200))

    out_dir = os.path.join(PUBLIC_ASSETS, "icons")
    ensure_dir(out_dir)
    upscale_pixel_art(img, 4).save(os.path.join(out_dir, "diamond.png"))
    print("Created diamond.png")

# ==============================================================================
# 2. 🪽 ANIMATED WINGS (Pixel Art for Hamster Back)
# Standard Hamster Canvas is 120x100.
# We create 120x100 pixel art templates that align perfectly behind the hamster!
# ==============================================================================
def create_angel_wings():
    # 60x50 native canvas (will upscale 2x to 120x100)
    img = Image.new("RGBA", (60, 50), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (80, 70, 90, 240)
    C_SHADOW = (180, 195, 220, 255)
    C_FEATHER = (235, 242, 255, 255)
    C_HIGHLIGHT = (255, 255, 255, 255)
    C_GOLD = (245, 190, 45, 255)

    # Left wing (curves out from x=24 down to x=6, up to y=10)
    left_wing = [
        (25, 28), (20, 24), (14, 18), (8, 12), (4, 15),
        (5, 22), (9, 27), (6, 32), (10, 36), (15, 38),
        (20, 37), (25, 33)
    ]
    draw.polygon(left_wing, fill=C_FEATHER, outline=C_OUTLINE)
    draw.polygon([(14, 18), (8, 12), (5, 15), (7, 21), (12, 20)], fill=C_HIGHLIGHT)
    draw.polygon([(6, 32), (10, 36), (15, 38), (12, 33)], fill=C_SHADOW)
    draw.line([(18, 22), (8, 16)], fill=C_OUTLINE, width=1)
    draw.line([(20, 27), (10, 29)], fill=C_OUTLINE, width=1)
    draw.line([(22, 32), (14, 35)], fill=C_OUTLINE, width=1)

    # Right wing (symmetric)
    right_wing = [
        (60 - x, y) for (x, y) in left_wing
    ]
    draw.polygon(right_wing, fill=C_FEATHER, outline=C_OUTLINE)
    draw.polygon([(60 - 14, 18), (60 - 8, 12), (60 - 5, 15), (60 - 7, 21), (60 - 12, 20)], fill=C_HIGHLIGHT)
    draw.polygon([(60 - 6, 32), (60 - 10, 36), (60 - 15, 38), (60 - 12, 33)], fill=C_SHADOW)
    draw.line([(60 - 18, 22), (60 - 8, 16)], fill=C_OUTLINE, width=1)
    draw.line([(60 - 20, 27), (60 - 10, 29)], fill=C_OUTLINE, width=1)
    draw.line([(60 - 22, 32), (60 - 14, 35)], fill=C_OUTLINE, width=1)

    # Golden holy feathers at joint
    draw.rectangle([25, 27, 27, 29], fill=C_GOLD)
    draw.rectangle([33, 27, 35, 29], fill=C_GOLD)

    out_dir = os.path.join(PUBLIC_ASSETS, "wardrobe")
    ensure_dir(out_dir)
    upscale_pixel_art(img, 2).save(os.path.join(out_dir, "wings_angel.png"))
    print("Created wings_angel.png")

def create_devil_wings():
    img = Image.new("RGBA", (60, 50), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (40, 10, 45, 255)
    C_DARK = (85, 20, 95, 255)
    C_MID = (150, 40, 130, 255)
    C_LIGHT = (210, 75, 160, 255)
    C_BONE = (240, 140, 190, 255)

    # Left Bat Wing
    # Upper bone: (25, 30) -> (16, 20) -> (7, 10) -> sharp hook (5, 9)
    # Wing web: (7, 10) -> (3, 20) -> (8, 22) -> (6, 31) -> (14, 31) -> (13, 38) -> (25, 33)
    left_bone = [(25, 30), (17, 22), (8, 12), (5, 10), (7, 14), (16, 24), (25, 32)]
    draw.polygon(left_bone, fill=C_BONE, outline=C_OUTLINE)

    left_web = [(17, 23), (8, 13), (4, 21), (9, 23), (6, 32), (14, 31), (13, 39), (24, 33)]
    draw.polygon(left_web, fill=C_MID, outline=C_OUTLINE)
    draw.line([(17, 23), (9, 23)], fill=C_DARK, width=1)
    draw.line([(17, 23), (14, 31)], fill=C_DARK, width=1)
    # Highlight
    draw.line([(9, 14), (6, 20)], fill=C_LIGHT, width=1)

    # Right Bat Wing
    right_bone = [(60 - x, y) for (x, y) in left_bone]
    draw.polygon(right_bone, fill=C_BONE, outline=C_OUTLINE)

    right_web = [(60 - x, y) for (x, y) in left_web]
    draw.polygon(right_web, fill=C_MID, outline=C_OUTLINE)
    draw.line([(60 - 17, 23), (60 - 9, 23)], fill=C_DARK, width=1)
    draw.line([(60 - 17, 23), (60 - 14, 31)], fill=C_DARK, width=1)
    draw.line([(60 - 9, 14), (60 - 6, 20)], fill=C_LIGHT, width=1)

    out_dir = os.path.join(PUBLIC_ASSETS, "wardrobe")
    upscale_pixel_art(img, 2).save(os.path.join(out_dir, "wings_devil.png"))
    print("Created wings_devil.png")

def create_fairy_wings():
    img = Image.new("RGBA", (60, 50), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (70, 160, 180, 220)
    C_AQUA = (140, 235, 230, 180)
    C_PINK = (255, 175, 220, 180)
    C_WHITE = (255, 255, 255, 240)

    # Translucent rounded fairy wings
    # Upper left
    draw.ellipse([5, 8, 25, 28], fill=C_AQUA, outline=C_OUTLINE)
    draw.ellipse([8, 11, 22, 25], fill=C_PINK)
    draw.line([(10, 15), (20, 22)], fill=C_WHITE, width=1)
    # Lower left
    draw.ellipse([8, 22, 24, 38], fill=C_AQUA, outline=C_OUTLINE)
    draw.ellipse([11, 25, 21, 35], fill=C_PINK)

    # Upper right
    draw.ellipse([60 - 25, 8, 60 - 5, 28], fill=C_AQUA, outline=C_OUTLINE)
    draw.ellipse([60 - 22, 11, 60 - 8, 25], fill=C_PINK)
    draw.line([(60 - 10, 15), (60 - 20, 22)], fill=C_WHITE, width=1)
    # Lower right
    draw.ellipse([60 - 24, 22, 60 - 8, 38], fill=C_AQUA, outline=C_OUTLINE)
    draw.ellipse([60 - 21, 25, 60 - 11, 35], fill=C_PINK)

    # Magic sparkles
    draw.point((4, 7), fill=C_WHITE)
    draw.point((56, 7), fill=C_WHITE)
    draw.point((12, 6), fill=C_WHITE)
    draw.point((48, 6), fill=C_WHITE)
    draw.point((6, 39), fill=C_WHITE)
    draw.point((54, 39), fill=C_WHITE)

    out_dir = os.path.join(PUBLIC_ASSETS, "wardrobe")
    upscale_pixel_art(img, 2).save(os.path.join(out_dir, "wings_fairy.png"))
    print("Created wings_fairy.png")

def create_golden_wings():
    img = Image.new("RGBA", (60, 50), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (140, 70, 0, 255)
    C_DEEP = (220, 120, 15, 255)
    C_GOLD = (255, 195, 30, 255)
    C_LIGHT = (255, 240, 120, 255)
    C_WHITE = (255, 255, 230, 255)

    left_wing = [
        (25, 28), (18, 22), (11, 15), (4, 8), (2, 13),
        (5, 20), (1, 25), (7, 30), (3, 35), (10, 38),
        (16, 38), (22, 34)
    ]
    draw.polygon(left_wing, fill=C_GOLD, outline=C_OUTLINE)
    draw.polygon([(11, 15), (4, 8), (2, 13), (6, 18)], fill=C_WHITE)
    draw.polygon([(1, 25), (7, 30), (3, 35), (10, 38), (8, 33)], fill=C_DEEP)
    draw.line([(18, 22), (6, 17)], fill=C_LIGHT, width=1)
    draw.line([(19, 27), (6, 26)], fill=C_LIGHT, width=1)

    right_wing = [(60 - x, y) for (x, y) in left_wing]
    draw.polygon(right_wing, fill=C_GOLD, outline=C_OUTLINE)
    draw.polygon([(60 - 11, 15), (60 - 4, 8), (60 - 2, 13), (60 - 6, 18)], fill=C_WHITE)
    draw.polygon([(60 - 1, 25), (60 - 7, 30), (60 - 3, 35), (60 - 10, 38), (60 - 8, 33)], fill=C_DEEP)
    draw.line([(60 - 18, 22), (60 - 6, 17)], fill=C_LIGHT, width=1)
    draw.line([(60 - 19, 27), (60 - 6, 26)], fill=C_LIGHT, width=1)

    out_dir = os.path.join(PUBLIC_ASSETS, "wardrobe")
    upscale_pixel_art(img, 2).save(os.path.join(out_dir, "wings_golden.png"))
    print("Created wings_golden.png")

# ==============================================================================
# 3. 🪜 CAGE 2-STORY PROPS (Ladder & Balcony)
# ==============================================================================
def create_cage_ladder():
    # 24x64 pixel art ladder
    img = Image.new("RGBA", (24, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (75, 40, 20, 255)
    C_WOOD_DARK = (130, 80, 40, 255)
    C_WOOD_MID = (180, 120, 65, 255)
    C_WOOD_LIGHT = (220, 160, 95, 255)

    # Left rail
    draw.rectangle([3, 0, 6, 63], fill=C_WOOD_MID, outline=C_OUTLINE)
    draw.line([(4, 1), (4, 62)], fill=C_WOOD_LIGHT)
    draw.line([(6, 1), (6, 62)], fill=C_WOOD_DARK)

    # Right rail
    draw.rectangle([17, 0, 20, 63], fill=C_WOOD_MID, outline=C_OUTLINE)
    draw.line([(18, 1), (18, 62)], fill=C_WOOD_LIGHT)
    draw.line([(20, 1), (20, 62)], fill=C_WOOD_DARK)

    # Rungs (steps)
    for y in range(8, 60, 9):
        draw.rectangle([6, y, 17, y + 3], fill=C_WOOD_LIGHT, outline=C_OUTLINE)
        draw.line([(7, y + 1), (16, y + 1)], fill=(245, 200, 140, 255))
        draw.line([(7, y + 3), (16, y + 3)], fill=C_WOOD_DARK)

    out_dir = os.path.join(PUBLIC_ASSETS, "cage")
    ensure_dir(out_dir)
    upscale_pixel_art(img, 2).save(os.path.join(out_dir, "cage_ladder.png"))
    print("Created cage_ladder.png")

def create_cage_balcony():
    # 120x30 pixel art balcony railing & platform
    img = Image.new("RGBA", (120, 30), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (75, 40, 20, 255)
    C_FLOOR_LIGHT = (230, 180, 120, 255)
    C_FLOOR_MID = (190, 135, 75, 255)
    C_FLOOR_DARK = (140, 90, 45, 255)
    C_POST_LIGHT = (245, 215, 160, 255)

    # Floor deck (bottom 8 pixels)
    draw.rectangle([0, 22, 119, 29], fill=C_FLOOR_MID, outline=C_OUTLINE)
    draw.line([(1, 23), (118, 23)], fill=C_FLOOR_LIGHT)
    draw.line([(1, 28), (118, 28)], fill=C_FLOOR_DARK)

    # Top rail
    draw.rectangle([0, 4, 119, 8], fill=C_FLOOR_LIGHT, outline=C_OUTLINE)
    draw.line([(1, 5), (118, 5)], fill=(255, 240, 200, 255))
    draw.line([(1, 7), (118, 7)], fill=C_FLOOR_MID)

    # Balusters (fence posts)
    for x in range(6, 116, 12):
        draw.rectangle([x, 8, x + 3, 22], fill=C_POST_LIGHT, outline=C_OUTLINE)
        draw.point((x + 1, 9), fill=(255, 255, 255, 255))
        # Heart carving in middle post
        if x == 54:
            draw.rectangle([x - 1, 11, x + 4, 16], fill=(240, 130, 150, 255), outline=C_OUTLINE)

    out_dir = os.path.join(PUBLIC_ASSETS, "cage")
    ensure_dir(out_dir)
    upscale_pixel_art(img, 2).save(os.path.join(out_dir, "cage_balcony.png"))
    print("Created cage_balcony.png")

# ==============================================================================
# 4. 🌻 FLYING SEED (Interactive Trick Prop)
# ==============================================================================
def create_flying_seed():
    img = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    C_OUTLINE = (60, 40, 10, 255)
    C_BLACK = (50, 45, 40, 255)
    C_WHITE = (240, 240, 235, 255)
    C_GOLD = (255, 215, 0, 255)

    # Teardrop seed angled at 45 deg
    draw.polygon([(12, 4), (18, 9), (16, 16), (10, 17), (7, 11)], fill=C_BLACK, outline=C_OUTLINE)
    draw.line([(12, 6), (9, 13)], fill=C_WHITE, width=1)
    draw.line([(14, 8), (12, 14)], fill=C_WHITE, width=1)

    # Sparkle stars around
    draw.point((4, 5), fill=C_GOLD)
    draw.point((5, 4), fill=C_GOLD)
    draw.point((19, 18), fill=C_GOLD)
    draw.point((20, 19), fill=C_GOLD)

    out_dir = os.path.join(PUBLIC_ASSETS, "props")
    ensure_dir(out_dir)
    upscale_pixel_art(img, 3).save(os.path.join(out_dir, "flying_seed.png"))
    print("Created flying_seed.png")

# ==============================================================================
# 5. 👤 PROFILE AVATAR ICONS (32x32 Pixel Art upscaled to 128x128)
# ==============================================================================
def create_avatars():
    out_dir = os.path.join(PUBLIC_ASSETS, "avatars")
    ensure_dir(out_dir)

    # 1. Classic Hamster
    img1 = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(img1)
    d1.ellipse([2, 2, 29, 29], fill=(255, 245, 225, 255), outline=(220, 160, 90, 255))
    # Ears
    d1.ellipse([5, 5, 11, 11], fill=(220, 140, 100, 255), outline=(140, 80, 40, 255))
    d1.ellipse([20, 5, 26, 11], fill=(220, 140, 100, 255), outline=(140, 80, 40, 255))
    # Face
    d1.ellipse([6, 9, 25, 27], fill=(255, 255, 255, 255))
    # Eyes
    d1.rectangle([10, 15, 12, 17], fill=(30, 25, 20, 255))
    d1.rectangle([19, 15, 21, 17], fill=(30, 25, 20, 255))
    d1.point((10, 15), fill=(255, 255, 255, 255))
    d1.point((19, 15), fill=(255, 255, 255, 255))
    # Nose & mouth
    d1.rectangle([15, 19, 16, 20], fill=(255, 140, 160, 255))
    # Cheeks
    d1.rectangle([7, 18, 9, 19], fill=(255, 180, 190, 255))
    d1.rectangle([22, 18, 24, 19], fill=(255, 180, 190, 255))
    upscale_pixel_art(img1, 4).save(os.path.join(out_dir, "avatar_hamster_classic.png"))

    # 2. Cool Hamster (Sunglasses)
    img2 = img1.copy()
    d2 = ImageDraw.Draw(img2)
    d2.rectangle([8, 14, 23, 18], fill=(35, 35, 45, 255), outline=(20, 20, 30, 255))
    d2.line([(10, 15), (14, 15)], fill=(120, 160, 255, 255))
    d2.line([(17, 15), (21, 15)], fill=(120, 160, 255, 255))
    upscale_pixel_art(img2, 4).save(os.path.join(out_dir, "avatar_hamster_cool.png"))

    # 3. Crown Hamster (Golden King)
    img3 = img1.copy()
    d3 = ImageDraw.Draw(img3)
    d3.polygon([(9, 8), (11, 4), (15, 7), (20, 4), (22, 8)], fill=(255, 210, 40, 255), outline=(160, 110, 0, 255))
    d3.point((11, 4), fill=(255, 50, 70, 255))
    d3.point((20, 4), fill=(50, 180, 255, 255))
    upscale_pixel_art(img3, 4).save(os.path.join(out_dir, "avatar_hamster_crown.png"))

    # 4. Angel Hamster (Halo)
    img4 = img1.copy()
    d4 = ImageDraw.Draw(img4)
    d4.ellipse([10, 2, 21, 6], outline=(255, 225, 60, 255), width=1)
    upscale_pixel_art(img4, 4).save(os.path.join(out_dir, "avatar_hamster_angel.png"))

    # 5. Admin Dew Avatar
    img5 = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d5 = ImageDraw.Draw(img5)
    # Background badge
    d5.ellipse([2, 2, 29, 29], fill=(80, 40, 140, 255), outline=(255, 215, 0, 255))
    # Cool hair
    d5.ellipse([8, 6, 23, 18], fill=(40, 30, 30, 255))
    # Face
    d5.ellipse([9, 10, 22, 24], fill=(255, 220, 185, 255))
    # Eyes with friendly wink
    d5.line([(12, 16), (14, 16)], fill=(30, 25, 25, 255), width=1)
    d5.point((18, 16), fill=(30, 25, 25, 255))
    # Smile
    d5.arc([13, 17, 18, 21], 0, 180, fill=(200, 60, 80, 255), width=1)
    # GM Crown
    d5.polygon([(11, 6), (13, 3), (16, 5), (18, 3), (20, 6)], fill=(255, 215, 0, 255), outline=(180, 120, 0, 255))
    d5.point((16, 4), fill=(255, 50, 50, 255))
    upscale_pixel_art(img5, 4).save(os.path.join(out_dir, "avatar_dew_admin.png"))

    print("Created all 5 avatars")

if __name__ == "__main__":
    create_diamond()
    create_angel_wings()
    create_devil_wings()
    create_fairy_wings()
    create_golden_wings()
    create_cage_ladder()
    create_cage_balcony()
    create_flying_seed()
    create_avatars()
    print("ALL V6 PIXEL ART GENERATED SUCCESSFULLY!")
