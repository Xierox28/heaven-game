import os
from collections import deque
from PIL import Image, ImageDraw

OUTPUT_DIR = r"c:\Users\nongd\OneDrive\Desktop\Vs\HaevenGame\public\assets\wardrobe"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. PROCESS AI-GENERATED FROG HAT & UNICORN HAT
# -------------------------------------------------------------
def clean_and_crop(src_path, dst_path, threshold=240):
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    data = img.load()

    # Flood-fill from corners
    visited = [[False] * h for _ in range(w)]
    q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])

    for x, y in q:
        visited[x][y] = True

    while q:
        cx, cy = q.popleft()
        r, g, b, a = data[cx, cy]
        # If near white, make transparent and explore neighbors
        if r >= threshold and g >= threshold and b >= threshold:
            data[cx, cy] = (0, 0, 0, 0)
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                    visited[nx][ny] = True
                    q.append((nx, ny))

    # Also make any remaining very white isolated pixels transparent
    for x in range(w):
        for y in range(h):
            r, g, b, a = data[x, y]
            if a > 0 and r >= 248 and g >= 248 and b >= 248:
                data[x, y] = (0, 0, 0, 0)

    # Crop to non-transparent bounding box
    bbox = img.getbbox()
    if bbox:
        # Add slight padding
        cropped = img.crop(bbox)
        # Resize to standard wardrobe resolution (max 256px)
        cropped.thumbnail((256, 256), Image.Resampling.LANCZOS)
        cropped.save(dst_path, "PNG")
        print(f"Saved cleaned: {dst_path} size={cropped.size}")
    else:
        img.save(dst_path, "PNG")
        print(f"Saved fallback: {dst_path}")

f1 = r"C:\Users\nongd\.gemini\antigravity\brain\03ac06db-5441-423c-a3b4-de00a8f7314d\frog_hat_1795285375223.jpg"
f2 = r"C:\Users\nongd\.gemini\antigravity\brain\03ac06db-5441-423c-a3b4-de00a8f7314d\unicorn_hat_1795285382966.jpg"

if os.path.exists(f1):
    clean_and_crop(f1, os.path.join(OUTPUT_DIR, "frog_hat.png"))
if os.path.exists(f2):
    clean_and_crop(f2, os.path.join(OUTPUT_DIR, "unicorn_hat.png"))


# -------------------------------------------------------------
# 2. PIXEL ART SPRITE GENERATOR (32x32 to 128x128 Nearest Neighbor)
# -------------------------------------------------------------
def make_sprite(width, height, pixel_map, scale=4):
    """
    width, height: dimensions in logical pixels (e.g. 32x32)
    pixel_map: dict of (x, y) -> (r, g, b, a)
    scale: integer scaling factor for crisp retro pixel art
    """
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    for (x, y), color in pixel_map.items():
        if 0 <= x < width and 0 <= y < height:
            img.putpixel((x, y), color)
    # Upscale with NEAREST for razor-sharp pixel edges
    out = img.resize((width * scale, height * scale), Image.Resampling.NEAREST)
    return out


# --- A. SUNGLASSES (Cool retro black pixel shades with shine) ---
def gen_sunglasses():
    W, H = 36, 16
    P = {}
    C_OUTLINE = (20, 24, 33, 255)
    C_FRAME = (35, 39, 50, 255)
    C_LENS_DARK = (45, 52, 68, 255)
    C_LENS_LIGHT = (70, 80, 105, 255)
    C_GLINT = (255, 255, 255, 255)

    # Left Lens (x: 4..16, y: 3..12)
    for x in range(4, 17):
        for y in range(4, 13):
            P[(x, y)] = C_LENS_DARK
    # Right Lens (x: 19..31, y: 4..13)
    for x in range(19, 32):
        for y in range(4, 13):
            P[(x, y)] = C_LENS_DARK

    # Bridge between lenses
    for x in range(15, 21):
        P[(x, 5)] = C_FRAME
        P[(x, 6)] = C_OUTLINE

    # Lens shading (diagonal split)
    for x in range(4, 17):
        for y in range(9, 13):
            P[(x, y)] = C_LENS_LIGHT
    for x in range(19, 32):
        for y in range(9, 13):
            P[(x, y)] = C_LENS_LIGHT

    # Glint / Reflection highlights
    for x, y in [(6, 5), (7, 5), (8, 6), (21, 5), (22, 5), (23, 6)]:
        P[(x, y)] = C_GLINT

    # Outlines for left frame
    for x in range(4, 17):
        P[(x, 3)] = C_OUTLINE
        P[(x, 13)] = C_OUTLINE
    for y in range(4, 13):
        P[(3, y)] = C_OUTLINE
        P[(17, y)] = C_OUTLINE

    # Outlines for right frame
    for x in range(19, 32):
        P[(x, 3)] = C_OUTLINE
        P[(x, 13)] = C_OUTLINE
    for y in range(4, 13):
        P[(18, y)] = C_OUTLINE
        P[(32, y)] = C_OUTLINE

    # Temples / side arms
    for x in range(0, 4):
        P[(x, 4)] = C_FRAME
        P[(x, 5)] = C_OUTLINE
    for x in range(32, 36):
        P[(x, 4)] = C_FRAME
        P[(x, 5)] = C_OUTLINE

    return make_sprite(W, H, P, scale=4)


# --- B. STAR GLASSES (Bright yellow star spectacles) ---
def gen_star_glasses():
    W, H = 40, 22
    P = {}
    C_OUTLINE = (180, 110, 0, 255)
    C_BASE = (255, 215, 0, 255)
    C_LIGHT = (255, 245, 120, 255)
    C_SHADOW = (235, 175, 10, 255)
    C_WHITE = (255, 255, 255, 255)

    def draw_star(cx, cy):
        # 5-pointed star mask around cx, cy
        offsets = [
            # Top point
            (0, -7), (0, -6), (0, -5),
            # Upper body
            (-1, -4), (0, -4), (1, -4),
            (-3, -3), (-2, -3), (-1, -3), (0, -3), (1, -3), (2, -3), (3, -3),
            # Side arms
            (-7, -2), (-6, -2), (-5, -2), (-4, -2), (-3, -2), (-2, -2), (-1, -2), (0, -2), (1, -2), (2, -2), (3, -2), (4, -2), (5, -2), (6, -2), (7, -2),
            (-6, -1), (-5, -1), (-4, -1), (-3, -1), (-2, -1), (-1, -1), (0, -1), (1, -1), (2, -1), (3, -1), (4, -1), (5, -1), (6, -1),
            # Center
            (-4, 0), (-3, 0), (-2, 0), (-1, 0), (0, 0), (1, 0), (2, 0), (3, 0), (4, 0),
            (-3, 1), (-2, 1), (-1, 1), (0, 1), (1, 1), (2, 1), (3, 1),
            # Lower body & legs
            (-4, 2), (-3, 2), (-2, 2), (2, 2), (3, 2), (4, 2),
            (-5, 3), (-4, 3), (4, 3), (5, 3),
            (-6, 4), (-5, 4), (5, 4), (6, 4),
            (-7, 5), (-6, 5), (6, 5), (7, 5),
            (-7, 6), (7, 6),
        ]
        for dx, dy in offsets:
            P[(cx + dx, cy + dy)] = C_BASE

        # Inner highlight
        for dx, dy in [(-1, -3), (0, -3), (0, -2), (-2, -1), (-1, -1)]:
            P[(cx + dx, cy + dy)] = C_LIGHT
        P[(cx - 1, cy - 2)] = C_WHITE

        # Inner shadow
        for dx, dy in [(-5, 4), (-6, 5), (5, 4), (6, 5), (0, 1), (1, 1)]:
            P[(cx + dx, cy + dy)] = C_SHADOW

    # Left star at (10, 10), Right star at (29, 10)
    draw_star(10, 10)
    draw_star(29, 10)

    # Bridge between the two stars
    for x in range(17, 23):
        P[(x, 9)] = C_LIGHT
        P[(x, 10)] = C_BASE
        P[(x, 11)] = C_OUTLINE

    return make_sprite(W, H, P, scale=4)


# --- C. FLOWER CROWN (Pastel sakura garland wreath) ---
def gen_flower_crown():
    W, H = 54, 22
    P = {}
    C_STEM_DARK = (40, 110, 45, 255)
    C_STEM_LIGHT = (90, 180, 75, 255)
    C_PETAL_MAIN = (255, 175, 195, 255)
    C_PETAL_LIGHT = (255, 220, 230, 255)
    C_PETAL_DARK = (230, 110, 140, 255)
    C_CORE = (255, 235, 100, 255)
    C_WHITE = (255, 255, 255, 255)

    # Vine arc
    for x in range(4, 50):
        # parabolic arc
        normalized = (x - 27) / 23.0
        y = int(8 + (normalized ** 2) * 6)
        P[(x, y)] = C_STEM_DARK
        P[(x, y - 1)] = C_STEM_LIGHT

    # Leaves sprouting
    leaf_locs = [(8, 12), (15, 9), (22, 7), (32, 7), (39, 9), (46, 12)]
    for lx, ly in leaf_locs:
        P[(lx, ly - 2)] = C_STEM_LIGHT
        P[(lx + 1, ly - 3)] = C_STEM_LIGHT
        P[(lx - 1, ly - 1)] = C_STEM_DARK

    def draw_sakura(cx, cy):
        # 5 petals
        petals = [
            # Top
            (0, -3), (-1, -3), (1, -3), (0, -4),
            # Top Left
            (-3, -2), (-4, -2), (-3, -1),
            # Top Right
            (3, -2), (4, -2), (3, -1),
            # Bottom Left
            (-3, 2), (-4, 2), (-2, 3),
            # Bottom Right
            (3, 2), (4, 2), (2, 3),
        ]
        for dx, dy in petals:
            P[(cx + dx, cy + dy)] = C_PETAL_MAIN
            P[(cx + dx, cy + dy - 1)] = C_PETAL_LIGHT

        # Core
        P[(cx, cy)] = C_CORE
        P[(cx - 1, cy)] = C_PETAL_DARK
        P[(cx + 1, cy)] = C_PETAL_DARK
        P[(cx, cy - 1)] = C_WHITE
        P[(cx, cy + 1)] = C_PETAL_DARK

    # 4 beautiful blossoms across the wreath
    for fx, fy in [(11, 11), (21, 8), (33, 8), (43, 11)]:
        draw_sakura(fx, fy)

    return make_sprite(W, H, P, scale=4)


# --- D. PARTY HAT (Festive striped cone party hat) ---
def gen_party_hat():
    W, H = 32, 40
    P = {}
    C_OUTLINE = (40, 20, 60, 255)
    C_POMPOM = (255, 230, 40, 255)
    C_POMPOM_SHADOW = (220, 170, 10, 255)
    C_WHITE = (255, 255, 255, 255)

    C_CYAN = (45, 210, 235, 255)
    C_MAGENTA = (245, 75, 145, 255)
    C_YELLOW = (255, 215, 30, 255)
    C_PURPLE = (160, 75, 235, 255)

    # Fluffy Pom-pom on top (cx: 16, cy: 5)
    for dx in range(-3, 4):
        for dy in range(-3, 4):
            if abs(dx) + abs(dy) <= 4:
                P[(16 + dx, 5 + dy)] = C_POMPOM
    P[(15, 4)] = C_WHITE
    P[(17, 6)] = C_POMPOM_SHADOW

    # Cone body from y=9 to y=35
    for y in range(9, 36):
        progress = (y - 9) / 26.0
        half_width = int(1 + progress * 13)
        for x in range(16 - half_width, 17 + half_width):
            # Diagonal stripe pattern based on (x + y)
            stripe_val = (x + y * 2) % 16
            if stripe_val < 4:
                col = C_MAGENTA
            elif stripe_val < 8:
                col = C_YELLOW
            elif stripe_val < 12:
                col = C_CYAN
            else:
                col = C_PURPLE
            P[(x, y)] = col

        # Outlines of the cone
        P[(16 - half_width, y)] = C_OUTLINE
        P[(16 + half_width, y)] = C_OUTLINE

    # Bottom curved rim
    for x in range(2, 31):
        P[(x, 35)] = C_WHITE
        P[(x, 36)] = C_OUTLINE

    # Stars & confetti specks on hat
    P[(14, 18)] = C_WHITE
    P[(19, 25)] = C_WHITE

    return make_sprite(W, H, P, scale=4)


# --- E. RED BOW (Satin red ribbon bow tie) ---
def gen_red_bow():
    W, H = 36, 26
    P = {}
    C_OUTLINE = (120, 15, 30, 255)
    C_DARK = (185, 25, 45, 255)
    C_MAIN = (235, 40, 65, 255)
    C_LIGHT = (255, 100, 120, 255)
    C_WHITE = (255, 200, 210, 255)

    # Left Loop (x: 3..14, y: 4..18)
    for x in range(3, 15):
        dist_from_knot = 15 - x
        half_h = int(2 + dist_from_knot * 0.6)
        for y in range(11 - half_h, 12 + half_h):
            P[(x, y)] = C_MAIN

    # Right Loop (x: 21..32, y: 4..18)
    for x in range(21, 33):
        dist_from_knot = x - 20
        half_h = int(2 + dist_from_knot * 0.6)
        for y in range(11 - half_h, 12 + half_h):
            P[(x, y)] = C_MAIN

    # Loop interior shadows (ribbon depth)
    for x in range(4, 8):
        P[(x, 10)] = C_DARK
        P[(x, 11)] = C_DARK
    for x in range(28, 32):
        P[(x, 10)] = C_DARK
        P[(x, 11)] = C_DARK

    # Top highlight sheen
    for x in range(6, 14):
        P[(x, 7)] = C_LIGHT
    P[(8, 6)] = C_WHITE
    for x in range(22, 30):
        P[(x, 7)] = C_LIGHT
    P[(26, 6)] = C_WHITE

    # Center Knot (x: 14..21, y: 7..15)
    for x in range(14, 22):
        for y in range(7, 16):
            P[(x, y)] = C_DARK
    for x in range(15, 21):
        for y in range(8, 15):
            P[(x, y)] = C_MAIN
    P[(16, 9)] = C_WHITE
    P[(17, 9)] = C_LIGHT

    # Ribbon Tails hanging down
    # Left tail (x: 9..14, y: 15..24)
    for y in range(15, 25):
        P[(12 - (y - 15) // 2, y)] = C_MAIN
        P[(13 - (y - 15) // 2, y)] = C_DARK
        P[(14 - (y - 15) // 2, y)] = C_OUTLINE
    # Right tail (x: 21..26, y: 15..24)
    for y in range(15, 25):
        P[(23 + (y - 15) // 2, y)] = C_MAIN
        P[(22 + (y - 15) // 2, y)] = C_DARK
        P[(21 + (y - 15) // 2, y)] = C_OUTLINE

    # Outlines for loops
    for x in range(3, 15):
        dist = 15 - x
        hh = int(2 + dist * 0.6)
        P[(x, 11 - hh - 1)] = C_OUTLINE
        P[(x, 12 + hh)] = C_OUTLINE
    P[(2, 11)] = C_OUTLINE
    P[(2, 12)] = C_OUTLINE

    for x in range(21, 33):
        dist = x - 20
        hh = int(2 + dist * 0.6)
        P[(x, 11 - hh - 1)] = C_OUTLINE
        P[(x, 12 + hh)] = C_OUTLINE
    P[(33, 11)] = C_OUTLINE
    P[(33, 12)] = C_OUTLINE

    return make_sprite(W, H, P, scale=4)


# --- F. BELL COLLAR (Red collar band + shiny round gold bell) ---
def gen_bell_collar():
    W, H = 34, 26
    P = {}
    C_COLLAR = (210, 35, 45, 255)
    C_COLLAR_DARK = (130, 20, 30, 255)
    C_GOLD_DARK = (165, 110, 10, 255)
    C_GOLD_MID = (235, 175, 25, 255)
    C_GOLD_LIGHT = (255, 230, 85, 255)
    C_WHITE = (255, 255, 255, 255)
    C_SLIT = (50, 30, 10, 255)

    # Collar Band (arc across neck)
    for x in range(4, 30):
        y = int(5 + ((x - 17) / 14.0) ** 2 * 3)
        P[(x, y)] = C_COLLAR
        P[(x, y + 1)] = C_COLLAR_DARK

    # Golden Ring Mount (cx: 17, cy: 9)
    for dx in range(-2, 3):
        for dy in range(0, 3):
            P[(17 + dx, 8 + dy)] = C_GOLD_DARK
    P[(17, 9)] = C_GOLD_LIGHT

    # Round Bell Sphere (cx: 17, cy: 17, radius: 6)
    for dx in range(-6, 7):
        for dy in range(-6, 7):
            d2 = dx * dx + dy * dy
            if d2 <= 36:
                if d2 <= 9:
                    col = C_GOLD_LIGHT
                elif dx < 0 and dy < 0:
                    col = C_GOLD_LIGHT
                elif dx > 2 or dy > 2:
                    col = C_GOLD_DARK
                else:
                    col = C_GOLD_MID
                P[(17 + dx, 17 + dy)] = col
            elif d2 <= 42:
                P[(17 + dx, 17 + dy)] = C_GOLD_DARK

    # Shine reflection dot
    P[(15, 14)] = C_WHITE
    P[(16, 14)] = C_WHITE
    P[(15, 15)] = C_WHITE

    # Horizontal slit of jingle bell
    for x in range(14, 21):
        P[(x, 19)] = C_SLIT
    # Round hole at center of slit
    P[(17, 20)] = C_SLIT
    P[(17, 21)] = C_SLIT

    return make_sprite(W, H, P, scale=4)


# --- G. STAR BADGE (Gleaming 5-pointed gold star badge with ribbon) ---
def gen_star_badge():
    W, H = 28, 32
    P = {}
    C_GOLD_DARK = (160, 105, 10, 255)
    C_GOLD_MID = (245, 185, 20, 255)
    C_GOLD_LIGHT = (255, 235, 100, 255)
    C_WHITE = (255, 255, 255, 255)
    C_RIBBON_BLUE = (55, 120, 235, 255)
    C_RIBBON_DARK = (30, 65, 160, 255)

    # Ribbon tails underneath
    for y in range(18, 30):
        # Left tail
        P[(10 - (y - 18) // 3, y)] = C_RIBBON_BLUE
        P[(11 - (y - 18) // 3, y)] = C_RIBBON_DARK
        # Right tail
        P[(17 + (y - 18) // 3, y)] = C_RIBBON_BLUE
        P[(16 + (y - 18) // 3, y)] = C_RIBBON_DARK

    # Star Center at (14, 12)
    star_offsets = [
        (0, -8), (0, -7), (0, -6),
        (-1, -5), (0, -5), (1, -5),
        (-2, -4), (-1, -4), (0, -4), (1, -4), (2, -4),
        (-7, -3), (-6, -3), (-5, -3), (-4, -3), (-3, -3), (-2, -3), (-1, -3), (0, -3), (1, -3), (2, -3), (3, -3), (4, -3), (5, -3), (6, -3), (7, -3),
        (-6, -2), (-5, -2), (-4, -2), (-3, -2), (-2, -2), (-1, -2), (0, -2), (1, -2), (2, -2), (3, -2), (4, -2), (5, -2), (6, -2),
        (-4, -1), (-3, -1), (-2, -1), (-1, -1), (0, -1), (1, -1), (2, -1), (3, -1), (4, -1),
        (-3, 0), (-2, 0), (-1, 0), (0, 0), (1, 0), (2, 0), (3, 0),
        (-4, 1), (-3, 1), (-2, 1), (2, 1), (3, 1), (4, 1),
        (-5, 2), (-4, 2), (4, 2), (5, 2),
        (-6, 3), (-5, 3), (5, 3), (6, 3),
        (-6, 4), (6, 4),
    ]
    for dx, dy in star_offsets:
        P[(14 + dx, 12 + dy)] = C_GOLD_MID

    # Star highlight
    for dx, dy in [(-1, -5), (0, -5), (-1, -4), (0, -4), (-2, -3), (-1, -3)]:
        P[(14 + dx, 12 + dy)] = C_GOLD_LIGHT
    P[(14, 9)] = C_WHITE
    P[(13, 10)] = C_WHITE

    # Star edge shadow
    for dx, dy in [(-6, 4), (-5, 3), (6, 4), (5, 3), (0, 0), (1, 0)]:
        P[(14 + dx, 12 + dy)] = C_GOLD_DARK

    return make_sprite(W, H, P, scale=4)


# --- H. HERO CAPE (Fluttering crimson superhero cape) ---
def gen_cape_hero():
    W, H = 40, 52
    P = {}
    C_OUTLINE = (100, 10, 25, 255)
    C_SHADOW_DEEP = (145, 15, 35, 255)
    C_SHADOW = (185, 25, 45, 255)
    C_MAIN = (230, 35, 60, 255)
    C_LIGHT = (255, 75, 95, 255)
    C_GOLD = (255, 215, 40, 255)

    # Golden clasp at shoulder (top-right of cape)
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            if abs(dx) + abs(dy) <= 3:
                P[(28 + dx, 6 + dy)] = C_GOLD
    P[(28, 5)] = (255, 255, 255, 255)

    # Cape body draping down and flapping backwards to the right
    for y in range(8, 50):
        # Left boundary (drape curves gently)
        x_start = int(24 - (y - 8) * 0.35)
        # Right boundary (expands outward as cape catches wind)
        x_end = int(32 + (y - 8) * 0.15 - ((y - 25) / 15.0) ** 2 * 3)

        for x in range(x_start, x_end + 1):
            # Dynamic cloth fold waves
            fold = (x * 2 + y) % 10
            if fold < 3:
                col = C_SHADOW_DEEP
            elif fold < 5:
                col = C_SHADOW
            elif fold < 8:
                col = C_MAIN
            else:
                col = C_LIGHT
            P[(x, y)] = col

        # Outlines
        P[(x_start, y)] = C_OUTLINE
        P[(x_end, y)] = C_OUTLINE

    # Bottom scalloped cape hem
    for x in range(10, 36):
        wave = int(48 + abs((x % 6) - 3) * 0.8)
        P[(x, wave)] = C_OUTLINE
        P[(x, wave - 1)] = C_SHADOW_DEEP

    return make_sprite(W, H, P, scale=4)


# --- I. CLOUD PAJAMAS (Soft pastel sky-blue onesie with fluffy clouds) ---
def gen_cloud_pajamas():
    W, H = 56, 36
    P = {}
    C_OUTLINE = (60, 95, 145, 255)
    C_BODY_DARK = (130, 185, 230, 255)
    C_BODY_MAIN = (165, 215, 250, 255)
    C_BODY_LIGHT = (205, 235, 255, 255)
    C_WHITE = (255, 255, 255, 255)
    C_BUTTON = (255, 225, 100, 255)

    # Hamster belly vest shape (wider in center, curved armholes)
    for y in range(4, 32):
        progress = (y - 4) / 28.0
        # Oval belly curve
        half_w = int(24 * (1 - ((progress - 0.5) * 1.5) ** 2) ** 0.5) if abs((progress - 0.5) * 1.5) < 1 else 10
        half_w = max(12, min(26, half_w))

        for x in range(28 - half_w, 28 + half_w + 1):
            P[(x, y)] = C_BODY_MAIN

        # Shading along borders
        P[(28 - half_w, y)] = C_OUTLINE
        P[(28 - half_w + 1, y)] = C_BODY_DARK
        P[(28 + half_w, y)] = C_OUTLINE
        P[(28 + half_w - 1, y)] = C_BODY_DARK

    # Top collar rim
    for x in range(16, 40):
        P[(x, 4)] = C_WHITE
        P[(x, 3)] = C_OUTLINE

    # Bottom ribbing hem
    for x in range(14, 42):
        P[(x, 31)] = C_WHITE
        P[(x, 32)] = C_OUTLINE

    # Puffy White Clouds Pattern
    def draw_cloud(cx, cy):
        cloud_pixels = [
            (0, -2), (1, -2), (2, -2),
            (-2, -1), (-1, -1), (0, -1), (1, -1), (2, -1), (3, -1),
            (-3, 0), (-2, 0), (-1, 0), (0, 0), (1, 0), (2, 0), (3, 0), (4, 0),
            (-2, 1), (-1, 1), (0, 1), (1, 1), (2, 1), (3, 1),
        ]
        for dx, dy in cloud_pixels:
            P[(cx + dx, cy + dy)] = C_WHITE
            P[(cx + dx, cy + dy + 1)] = C_BODY_LIGHT

    draw_cloud(18, 14)
    draw_cloud(38, 14)
    draw_cloud(28, 23)

    # Cute central buttons
    for by in [10, 18, 26]:
        P[(28, by)] = C_BUTTON
        P[(27, by)] = (180, 140, 20, 255)
        P[(29, by)] = (180, 140, 20, 255)

    return make_sprite(W, H, P, scale=4)


# --- J. HOODIE SPECIAL (Pastel lavender-pink fleece hoodie vest) ---
def gen_hoodie_special():
    W, H = 54, 34
    P = {}
    C_OUTLINE = (110, 60, 120, 255)
    C_DARK = (185, 130, 195, 255)
    C_MAIN = (225, 175, 235, 255)
    C_LIGHT = (245, 215, 250, 255)
    C_POCKET = (210, 150, 220, 255)
    C_WHITE = (255, 255, 255, 255)

    # Vest Body
    for y in range(4, 30):
        prog = (y - 4) / 26.0
        hw = int(22 * (1 - ((prog - 0.5) * 1.4) ** 2) ** 0.5) if abs((prog - 0.5) * 1.4) < 1 else 10
        hw = max(10, min(24, hw))
        for x in range(27 - hw, 27 + hw + 1):
            P[(x, y)] = C_MAIN
        P[(27 - hw, y)] = C_OUTLINE
        P[(27 + hw, y)] = C_OUTLINE
        P[(27 - hw + 1, y)] = C_DARK
        P[(27 + hw - 1, y)] = C_DARK

    # Top Collar & Hood rim
    for x in range(16, 38):
        P[(x, 3)] = C_OUTLINE
        P[(x, 4)] = C_LIGHT
        P[(x, 5)] = C_WHITE

    # Kangaroo front pocket (x: 19..35, y: 17..26)
    for y in range(17, 27):
        for x in range(19, 36):
            P[(x, y)] = C_POCKET
    # Pocket side slant openings
    for y in range(17, 27):
        P[(19, y)] = C_OUTLINE
        P[(35, y)] = C_OUTLINE
    for x in range(19, 36):
        P[(x, 17)] = C_OUTLINE
        P[(x, 26)] = C_OUTLINE
        P[(x, 18)] = C_LIGHT

    # Drawstring cords hanging from hood
    for y in range(7, 16):
        P[(23, y)] = C_WHITE
        P[(31, y)] = C_WHITE
    # Aglets at end of cords
    P[(23, 16)] = (255, 220, 100, 255)
    P[(31, 16)] = (255, 220, 100, 255)

    # Bottom hem
    for x in range(14, 40):
        P[(x, 29)] = C_DARK
        P[(x, 30)] = C_OUTLINE

    return make_sprite(W, H, P, scale=4)


# --- K. CUTE BIB (Buttercup baby bib with star embroidery) ---
def gen_cute_bib():
    W, H = 36, 28
    P = {}
    C_OUTLINE = (185, 140, 10, 255)
    C_MAIN = (255, 235, 130, 255)
    C_LIGHT = (255, 248, 180, 255)
    C_SHADOW = (235, 205, 90, 255)
    C_LACE = (255, 255, 255, 255)
    C_STAR = (255, 165, 20, 255)
    C_STRAP = (245, 220, 110, 255)

    # Neck straps (tied behind)
    for x in range(6, 14):
        P[(x, 4)] = C_STRAP
        P[(x, 5)] = C_OUTLINE
    for x in range(22, 30):
        P[(x, 4)] = C_STRAP
        P[(x, 5)] = C_OUTLINE

    # Bib curved rounded shield
    for y in range(6, 24):
        dist_y = (y - 6) / 18.0
        hw = int(14 * (1 - ((dist_y - 0.4) * 1.3) ** 2) ** 0.5) if abs((dist_y - 0.4) * 1.3) < 1 else 6
        hw = max(7, min(15, hw))
        for x in range(18 - hw, 18 + hw + 1):
            P[(x, y)] = C_MAIN

        # Outer outline
        P[(18 - hw, y)] = C_OUTLINE
        P[(18 + hw, y)] = C_OUTLINE

    # Scalloped white lace trim along bottom edge
    for x in range(4, 32):
        if (x % 3) == 0:
            for dy in range(20, 25):
                if (x, dy) in P and (x, dy + 1) not in P:
                    P[(x, dy + 1)] = C_LACE
                    P[(x, dy + 2)] = C_OUTLINE

    # Central embroidered cute star (cx: 18, cy: 14)
    star_pts = [
        (0, -3), (0, -2),
        (-3, -1), (-2, -1), (-1, -1), (0, -1), (1, -1), (2, -1), (3, -1),
        (-1, 0), (0, 0), (1, 0),
        (-2, 1), (-1, 1), (1, 1), (2, 1),
        (-3, 2), (3, 2)
    ]
    for dx, dy in star_pts:
        P[(18 + dx, 14 + dy)] = C_STAR
    P[(18, 13)] = (255, 255, 255, 255)

    return make_sprite(W, H, P, scale=4)


# -------------------------------------------------------------
# 3. SAVE ALL PROCEDURAL PIXEL ART ASSETS
# -------------------------------------------------------------
items = {
    "sunglasses.png": gen_sunglasses,
    "star_glasses.png": gen_star_glasses,
    "flower_crown.png": gen_flower_crown,
    "party_hat.png": gen_party_hat,
    "red_bow.png": gen_red_bow,
    "bell_collar.png": gen_bell_collar,
    "star_badge.png": gen_star_badge,
    "cape_hero.png": gen_cape_hero,
    "cloud_pajamas.png": gen_cloud_pajamas,
    "hoodie_special.png": gen_hoodie_special,
    "cute_bib.png": gen_cute_bib,
}

for filename, generator_fn in items.items():
    img = generator_fn()
    path = os.path.join(OUTPUT_DIR, filename)
    img.save(path, "PNG")
    print(f"Generated pixel art: {path} size={img.size}")

print("=== ALL 13 WARDROBE SPRITES GENERATED SUCCESSFULLY ===")
