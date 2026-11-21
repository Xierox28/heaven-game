import os
import math
from PIL import Image, ImageDraw

def create_v5_pixel_art():
    dirs = [
        "public/assets/food",
        "public/assets/garden",
        "public/assets/buddies",
        "public/assets/gashapon",
        "public/assets/events"
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

    # =========================================================================
    # 1. FOOD PIXEL ART (32x32 native -> upscaled 4x to 128x128)
    # =========================================================================

    # 1a. KAPRAO RICE (ข้าวกะเพราหมูสับไข่ดาวกรอบ)
    # Authentic Thai street food: White ceramic plate, fragrant rice, dark savory minced pork with green holy basil & sliced red bird's eye chilies, topped with a golden crispy sunny-side-up egg with runny yolk!
    im_kaprao = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_kaprao)
    # White round plate with blue retro rim
    d.ellipse([1, 4, 30, 29], fill=(245, 248, 252, 255), outline=(70, 90, 130, 255))
    d.ellipse([3, 6, 28, 27], fill=(255, 255, 255, 255), outline=(215, 225, 240, 255))
    # Rice mound on left side
    d.ellipse([4, 9, 17, 24], fill=(250, 250, 250, 255), outline=(210, 210, 215, 255))
    d.point([(7, 12), (11, 14), (8, 17), (13, 19), (6, 21), (10, 22)], fill=(230, 230, 235, 255))
    # Minced Pork with spicy sauce on right side
    C_MEAT_DARK = (90, 45, 20, 255)
    C_MEAT_MID  = (145, 75, 35, 255)
    C_MEAT_LGT  = (190, 115, 60, 255)
    for (x, y) in [
        (15, 11), (16, 10), (17, 11), (18, 10), (19, 11), (20, 12), (21, 13),
        (14, 13), (15, 14), (16, 13), (17, 14), (18, 13), (19, 14), (20, 14), (21, 15), (22, 16),
        (13, 16), (14, 17), (15, 16), (16, 17), (17, 18), (18, 17), (19, 18), (20, 19), (21, 20),
        (12, 19), (13, 20), (14, 21), (15, 22), (16, 22), (17, 23), (18, 24), (19, 23),
        (14, 23), (15, 24), (16, 25), (17, 25), (18, 26)
    ]:
        d.point([(x, y)], fill=C_MEAT_MID)
    # Meat dark shadows & highlights
    d.point([(16, 12), (19, 13), (14, 16), (18, 19), (16, 23)], fill=C_MEAT_DARK)
    d.point([(17, 10), (20, 11), (16, 14), (19, 15), (14, 20)], fill=C_MEAT_LGT)
    # Basil leaves (Dark fragrant holy basil green)
    C_BASIL_DK = (25, 75, 25, 255)
    C_BASIL_LT = (55, 140, 50, 255)
    for bx, by in [(16, 11), (19, 12), (15, 15), (20, 17), (17, 20), (14, 22)]:
        d.point([(bx, by)], fill=C_BASIL_DK)
        d.point([(bx+1, by)], fill=C_BASIL_LT)
    # Sliced Red Chilies
    C_CHILI = (225, 30, 20, 255)
    d.point([(18, 11), (14, 14), (21, 16), (16, 18), (18, 22)], fill=C_CHILI)
    # Crispy Fried Egg on top of rice!
    # Crispy golden brown egg white border
    d.ellipse([6, 10, 19, 21], fill=(255, 255, 250, 255), outline=(195, 130, 40, 255))
    # Crispy bubbly edges
    d.point([(6, 14), (7, 10), (18, 12), (19, 17), (17, 20), (8, 21)], fill=(170, 100, 25, 255))
    # Juicy sunny-side-up egg yolk!
    d.ellipse([9, 12, 15, 18], fill=(255, 175, 10, 255), outline=(220, 115, 0, 255))
    d.ellipse([10, 13, 13, 16], fill=(255, 215, 35, 255))
    d.point([(11, 14)], fill=(255, 255, 255, 255)) # Yolk shine glint!
    im_kaprao.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/food/kaprao_rice.png")

    # 1b. BOBA MILK TEA (ชานมไข่มุกไต้หวัน)
    im_boba = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_boba)
    # Straw (Pink pastel straw sticking out)
    d.line([(18, 1), (17, 10)], fill=(255, 120, 160, 255), width=2)
    # Cup Lid
    d.ellipse([8, 8, 23, 12], fill=(255, 255, 255, 255), outline=(180, 180, 195, 255))
    # Clear Cup Body (tapering downwards)
    cup_pts = [(9, 10), (22, 10), (20, 28), (11, 28)]
    d.polygon(cup_pts, fill=(235, 245, 255, 180), outline=(140, 160, 190, 255))
    # Milk tea liquid (Warm caramelized milk tea color)
    tea_pts = [(10, 13), (21, 13), (19, 27), (12, 27)]
    d.polygon(tea_pts, fill=(225, 175, 125, 255))
    # Tea surface line & swirl
    d.ellipse([10, 12, 21, 15], fill=(240, 195, 150, 255))
    # Chewy black tapioca pearls at bottom!
    C_BOBA = (40, 25, 20, 255)
    C_BOBA_SHINE = (95, 70, 60, 255)
    pearls = [(13, 22), (16, 22), (18, 22), (14, 24), (17, 24), (13, 26), (15, 26), (18, 25)]
    for px, py in pearls:
        d.ellipse([px-1, py-1, px+1, py+1], fill=C_BOBA)
        d.point([(px, py-1)], fill=C_BOBA_SHINE)
    # Cup glass reflection highlight
    d.line([(11, 14), (12, 26)], fill=(255, 255, 255, 160), width=1)
    im_boba.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/food/boba_tea.png")

    # 1c. CHILLED WATERMELON (แตงโมหวานฉ่ำ)
    im_wm = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_wm)
    # Green Rind (Curved bottom arch)
    d.pieslice([3, 5, 29, 31], 0, 180, fill=(35, 140, 45, 255), outline=(15, 80, 25, 255))
    # Light green inner rind
    d.pieslice([4, 6, 28, 29], 0, 180, fill=(180, 240, 160, 255))
    # Juicy Red Watermelon Flesh
    d.pieslice([5, 7, 27, 27], 0, 180, fill=(250, 50, 65, 255))
    # Highlights
    d.pieslice([7, 8, 25, 22], 0, 180, fill=(255, 95, 110, 255))
    # Black Watermelon Seeds
    seeds = [(10, 14), (15, 12), (20, 14), (12, 18), (17, 18), (14, 22)]
    for sx, sy in seeds:
        d.point([(sx, sy)], fill=(30, 20, 20, 255))
        d.point([(sx, sy-1)], fill=(70, 50, 50, 255))
    im_wm.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/food/watermelon.png")

    # 1d. MINI SHABU POT (ชาบูหม้อไฟจิ๋ว)
    im_shabu = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_shabu)
    # Steam puffs above pot
    d.point([(12, 3), (13, 2), (18, 4), (19, 3), (15, 1)], fill=(255, 255, 255, 180))
    # Brass Shabu Pot Rim & Handles
    d.ellipse([4, 10, 27, 23], fill=(225, 165, 50, 255), outline=(145, 95, 15, 255))
    # Pot bowl base
    d.pieslice([5, 12, 26, 28], 0, 180, fill=(195, 135, 30, 255), outline=(125, 80, 10, 255))
    # Two metal side handles
    d.rectangle([2, 13, 4, 16], fill=(160, 110, 25, 255))
    d.rectangle([27, 13, 29, 16], fill=(160, 110, 25, 255))
    # Boiling Soup Base (Rich golden broth)
    d.ellipse([6, 12, 25, 21], fill=(245, 180, 60, 255))
    # Divided pot yin-yang divider
    d.line([(15, 12), (16, 21)], fill=(210, 140, 30, 255), width=1)
    # Ingredients in soup: Shabu beef slice (pink marble), mushrooms, tofu, greens
    # Beef roll (pink marble)
    d.ellipse([8, 14, 13, 18], fill=(235, 85, 100, 255), outline=(255, 185, 195, 255))
    # Shiitake Mushroom (brown with white cross slit)
    d.ellipse([18, 13, 23, 17], fill=(120, 75, 45, 255))
    d.point([(20, 15), (21, 15), (20, 14), (20, 16)], fill=(240, 225, 205, 255))
    # White Tofu cube
    d.rectangle([11, 17, 14, 19], fill=(255, 255, 250, 255), outline=(220, 215, 200, 255))
    # Green bok choy
    d.point([(16, 18), (17, 18), (16, 19)], fill=(45, 160, 60, 255))
    im_shabu.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/food/shabu_pot.png")

    # =========================================================================
    # 2. GARDEN INGREDIENTS & CROPS (32x32 -> upscaled to 128x128)
    # =========================================================================
    # 2a. Basil Leaf (ใบกะเพราสด)
    im_basil = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_basil)
    d.polygon([(16, 4), (24, 12), (22, 22), (16, 27), (10, 22), (8, 12)], fill=(45, 155, 55, 255), outline=(20, 85, 25, 255))
    d.line([(16, 6), (16, 28)], fill=(25, 105, 35, 255), width=1)
    d.line([(16, 14), (21, 12)], fill=(25, 105, 35, 255), width=1)
    d.line([(16, 18), (11, 16)], fill=(25, 105, 35, 255), width=1)
    d.point([(14, 10), (18, 15)], fill=(120, 215, 110, 255))
    im_basil.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/garden/basil_leaf.png")

    # 2b. Chili Pepper (พริกขี้หนูสวน)
    im_chili = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_chili)
    # Green stem
    d.line([(18, 4), (16, 8)], fill=(45, 140, 45, 255), width=2)
    # Curved bright red chili body
    chili_pts = [(16, 8), (21, 11), (23, 17), (20, 24), (15, 28), (14, 27), (18, 20), (17, 13), (14, 9)]
    d.polygon(chili_pts, fill=(235, 25, 25, 255), outline=(145, 10, 10, 255))
    d.point([(18, 12), (19, 15), (17, 21)], fill=(255, 120, 110, 255)) # Glossy shine
    im_chili.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/garden/chili_pepper.png")

    # 2c. Fresh Strawberry (สตรอว์เบอร์รีสวน)
    im_sb = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_sb)
    # Green calyx leaves
    d.polygon([(16, 6), (12, 4), (8, 7), (12, 9), (16, 9), (20, 9), (24, 7), (20, 4)], fill=(45, 165, 55, 255), outline=(20, 95, 30, 255))
    # Red strawberry heart shape
    sb_pts = [(10, 10), (22, 10), (24, 16), (20, 23), (16, 27), (12, 23), (8, 16)]
    d.polygon(sb_pts, fill=(245, 45, 60, 255), outline=(155, 15, 25, 255))
    # Golden yellow seeds
    for sx, sy in [(12, 13), (16, 12), (20, 13), (14, 17), (18, 17), (16, 22)]:
        d.point([(sx, sy)], fill=(255, 235, 100, 255))
    im_sb.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/garden/strawberry.png")

    # 2d. Giant Sunflower (ดอกทานตะวันเก็บเกี่ยว)
    im_sf = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_sf)
    # Golden Petals radiating around center
    C_PETAL = (255, 205, 35, 255)
    C_PETAL_OUT = (195, 135, 15, 255)
    d.ellipse([4, 4, 27, 27], fill=C_PETAL, outline=C_PETAL_OUT)
    # Brown seed disk in center
    d.ellipse([10, 10, 21, 21], fill=(95, 55, 25, 255), outline=(60, 35, 15, 255))
    # Seed texture
    for sx in range(12, 20, 2):
        for sy in range(12, 20, 2):
            d.point([(sx, sy)], fill=(145, 90, 45, 255))
    im_sf.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/garden/sunflower.png")

    # 2e. Garden Plot Soil (ดินแปลงปลูก 3 สถานะ)
    # Empty soil
    im_soil = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_soil)
    d.ellipse([2, 8, 29, 25], fill=(130, 85, 45, 255), outline=(85, 50, 25, 255))
    d.ellipse([4, 10, 27, 23], fill=(160, 105, 55, 255))
    im_soil.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/garden/soil_empty.png")

    # Sprout growing
    im_sprout = im_soil.copy()
    d = ImageDraw.Draw(im_sprout)
    d.line([(16, 16), (16, 8)], fill=(45, 165, 45, 255), width=2)
    d.ellipse([11, 6, 15, 10], fill=(70, 200, 65, 255), outline=(30, 110, 30, 255))
    d.ellipse([17, 6, 21, 10], fill=(70, 200, 65, 255), outline=(30, 110, 30, 255))
    im_sprout.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/garden/soil_sprout.png")

    # =========================================================================
    # 3. MINI BUDDY PETS (32x32 -> 128x128)
    # =========================================================================
    # 3a. PIYO THE YELLOW CHICK (ลูกเจี๊ยบสีเหลือง)
    im_piyo = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_piyo)
    # Shadow
    d.ellipse([8, 25, 24, 29], fill=(0, 0, 0, 40))
    # Round yellow body
    d.ellipse([6, 9, 25, 26], fill=(255, 225, 45, 255), outline=(195, 155, 20, 255))
    # Cute round wings
    d.ellipse([4, 14, 9, 21], fill=(245, 205, 30, 255), outline=(180, 140, 15, 255))
    # Big sparkling black eye
    d.ellipse([17, 13, 21, 17], fill=(30, 30, 30, 255))
    d.point([(18, 14)], fill=(255, 255, 255, 255))
    # Cheerful orange beak
    d.polygon([(23, 16), (28, 17), (23, 20)], fill=(255, 135, 20, 255), outline=(190, 85, 10, 255))
    # Pink blush
    d.ellipse([14, 18, 18, 21], fill=(255, 160, 160, 180))
    # Tiny feet
    d.line([(12, 26), (12, 28), (10, 29)], fill=(235, 115, 15, 255), width=1)
    d.line([(18, 26), (18, 28), (16, 29)], fill=(235, 115, 15, 255), width=1)
    im_piyo.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/buddies/buddy_piyo.png")

    # 3b. LADYBUG (เต่าทองนำโชค)
    im_lb = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_lb)
    # Red shell
    d.ellipse([7, 9, 25, 25], fill=(235, 35, 45, 255), outline=(145, 15, 20, 255))
    # Black head
    d.ellipse([12, 5, 20, 11], fill=(35, 35, 40, 255))
    # Black divider line
    d.line([(16, 9), (16, 25)], fill=(35, 35, 40, 255), width=2)
    # Black spots
    spots = [(11, 14), (21, 14), (10, 20), (22, 20), (14, 17), (18, 17)]
    for sx, sy in spots:
        d.ellipse([sx-1, sy-1, sx+1, sy+1], fill=(35, 35, 40, 255))
    # Antennae
    d.point([(13, 3), (14, 4), (18, 4), (19, 3)], fill=(35, 35, 40, 255))
    im_lb.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/buddies/buddy_ladybug.png")

    # 3c. MIMI THE KITTEN (ลูกแมวจิ๋ว)
    im_mimi = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_mimi)
    # Soft cream/white cat body
    d.ellipse([7, 11, 24, 26], fill=(250, 245, 235, 255), outline=(180, 160, 140, 255))
    # Calico patch (orange on ear/flank)
    d.ellipse([16, 7, 24, 15], fill=(235, 145, 65, 255))
    # Pointy cat ears
    d.polygon([(8, 12), (9, 5), (14, 10)], fill=(250, 245, 235, 255), outline=(180, 160, 140, 255))
    d.polygon([(18, 10), (23, 5), (24, 12)], fill=(235, 145, 65, 255), outline=(180, 160, 140, 255))
    d.polygon([(10, 10), (10, 7), (13, 9)], fill=(255, 185, 195, 255))
    # Blue eyes
    d.point([(12, 14), (19, 14)], fill=(45, 135, 220, 255))
    # Pink nose & mouth
    d.point([(15, 17)], fill=(255, 140, 160, 255))
    # Whiskers
    d.line([(7, 16), (11, 16)], fill=(160, 140, 120, 255))
    d.line([(20, 16), (24, 16)], fill=(160, 140, 120, 255))
    # Curled tail
    d.line([(22, 23), (27, 21), (28, 17)], fill=(235, 145, 65, 255), width=2)
    im_mimi.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/buddies/buddy_mimi.png")

    # =========================================================================
    # 4. GASHAPON & MYSTERY DROP (32x32 -> 128x128)
    # =========================================================================
    # 4a. Gashapon Machine
    im_gasha = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_gasha)
    # Red metal stand & roof
    d.rectangle([8, 1, 23, 5], fill=(225, 45, 55, 255), outline=(145, 20, 30, 255))
    # Clear glass dome
    d.ellipse([6, 4, 25, 20], fill=(220, 240, 255, 160), outline=(130, 160, 195, 255))
    # Colorful capsule balls inside dome
    d.ellipse([9, 10, 14, 15], fill=(255, 80, 95, 255))
    d.ellipse([17, 9, 22, 14], fill=(70, 170, 255, 255))
    d.ellipse([13, 13, 18, 18], fill=(255, 215, 45, 255))
    d.ellipse([9, 15, 14, 20], fill=(165, 95, 235, 255))
    d.ellipse([16, 15, 21, 20], fill=(85, 220, 115, 255))
    # Red base unit
    d.rectangle([7, 19, 24, 30], fill=(225, 45, 55, 255), outline=(145, 20, 30, 255))
    # Turning dial knob (golden turn handle)
    d.ellipse([13, 21, 18, 26], fill=(255, 215, 60, 255), outline=(160, 125, 20, 255))
    d.line([(13, 23), (18, 23)], fill=(120, 80, 10, 255), width=2)
    # Dispenser prize slot
    d.rectangle([12, 27, 19, 30], fill=(40, 20, 25, 255))
    im_gasha.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/gashapon/gashapon_machine.png")

    # 4b. Mystery Box (กล่องสมบัติปริศนา)
    im_box = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_box)
    # Golden sparkle stars around box
    d.point([(5, 5), (26, 4), (4, 22), (27, 21)], fill=(255, 220, 75, 255))
    # Purple/Gold Luxury Gift Box
    d.rectangle([6, 12, 25, 27], fill=(145, 75, 215, 255), outline=(75, 25, 125, 255))
    # Box Lid
    d.rectangle([5, 9, 26, 13], fill=(165, 95, 235, 255), outline=(75, 25, 125, 255))
    # Gold Ribbon Band (vertical & horizontal)
    d.rectangle([14, 9, 17, 27], fill=(255, 215, 55, 255))
    d.rectangle([6, 17, 25, 19], fill=(255, 215, 55, 255))
    # Big Gold Ribbon Bow on top
    d.ellipse([10, 4, 15, 10], fill=(255, 225, 70, 255), outline=(180, 135, 20, 255))
    d.ellipse([16, 4, 21, 10], fill=(255, 225, 70, 255), outline=(180, 135, 20, 255))
    d.ellipse([13, 7, 18, 11], fill=(255, 185, 35, 255), outline=(180, 135, 20, 255))
    im_box.resize((128, 128), Image.Resampling.NEAREST).save("public/assets/events/mystery_box.png")

    print("All v5.0 pixel art assets created successfully!")

if __name__ == "__main__":
    create_v5_pixel_art()
