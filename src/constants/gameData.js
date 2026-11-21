// ==============================================================================
// 🐹 HEAVEN GAME CONSTANTS & DATA — UPDATED WITH PASS & STREAK
// ==============================================================================

export const INITIAL_GAME_STATE = {
  name: "น้องเฮเว่น (Heaven)",
  hunger: 80,
  happiness: 85,
  cleanliness: 75,
  energy: 90,
  level: 1,
  exp: 0,
  maxExp: 100,
  coins: 60,
  poopCount: 0,
  isSleeping: false,
  actionState: "idle",
  actionExpiry: 0,
  mood: "happy",

  // 👗 WARDROBE (Multi-wear stacking: รองรับสวมใส่หลายชิ้นพร้อมกัน)
  equipped: ["frog_hat"],
  inventory: ["frog_hat"],
  wardrobeOffsets: {}, // { [itemId]: { x: 0, y: 0, scale: 1.0 } }

  // 🐹 BREEDS & PERSONALITY (v4.0)
  breed: "winter_white",
  unlockedBreeds: ["winter_white"],
  personality: "affectionate",

  // 🏡 CAGE FURNITURE & DECORATIONS
  furniture: {
    equipped: {
      house: null,
      toy: null,
      wallpaper: "default_grid",
      rug: null,
    },
    positions: {
      house: { x: 18, y: 3 },
      toy: { x: 82, y: 3 },
      rug: { x: 50, y: 6 },
    },
    scales: {
      house: 1.0,
      toy: 1.0,
      rug: 1.0,
    },
    inventory: ["default_grid"],
  },

  // Stats for Achievements & Quests
  stats: {
    totalFed: 0,
    totalPets: 0,
    totalCleans: 0,
    totalCoinsEarned: 0,
    maxStreakDays: 0,
    miniGamesPlayed: 0,
  },

  achievements: [],

  // 🎟️ HAMSTER PASS (Battle Pass Season 1)
  pass: {
    season: 1,
    exp: 0,
    hasGoldPass: false,
    claimedFree: [],
    claimedGold: [],
    dailyProgress: {
      feed_twice: 0,
      pet_thrice: 0,
      clean_cage: 0,
      spin_wheel: 0,
    },
    claimedQuests: [],
    lastQuestDate: new Date().toDateString(),
  },

  // 📅 7-DAY LOGIN STREAK
  streak: {
    days: 0,
    lastClaimDate: null,
    claimedDays: [],
  },

  speechBubble: {
    text: "สวัสดีงับ! นู๋ชื่อน้องเฮเว่น ยินดีที่ได้รู้จักน้า~ 🐹✨",
    timestamp: Date.now(),
    duration: 6000,
  },
  announcement: {
    id: 1, title: "", message: "", active: false, timestamp: Date.now(),
  },
  seedRainEvent: {
    id: 0, active: false, timestamp: 0,
  },

  // 🌾 v5.0 GARDEN & PANTRY
  gardenPlots: [
    { id: 0, cropId: null, plantedAt: 0, watered: false },
    { id: 1, cropId: null, plantedAt: 0, watered: false },
    { id: 2, cropId: null, plantedAt: 0, watered: false },
    { id: 3, cropId: null, plantedAt: 0, watered: false },
  ],
  pantry: {
    basil_leaf: 0,
    chili_pepper: 0,
    fresh_strawberry: 0,
  },

  // ⚡ v5.0 BUFFS & BUDDIES & MANSION
  activeBuffs: {
    doubleCoinUntil: 0,
    slowHungerUntil: 0,
  },
  equippedBuddy: "buddy_piyo",
  unlockedBuddies: ["buddy_piyo"],
  mansionTheme: "default_grid",
  unlockedThemes: ["default_grid"],
  playerTitle: "เด็กเส้นแอดมินดิว 💎",
  playerAvatar: "avatar_hamster_classic",
  unlockedAvatars: ["avatar_hamster_classic", "avatar_hamster_cool"],
  unlockedTitles: ["แฮมสเตอร์ฝึกหัด", "เด็กเส้นแอดมินดิว 💎", "เพื่อนซี้พี่ดิว 👑", "นักบินอวกาศจิ๋ว 🚀", "มหาเศรษฐีเมล็ดทานตะวัน 🌻"],
  currentFloor: 1, // 1 = ชั้น 1 (พื้นกรง), 2 = ชั้น 2 (ระเบียงชั้นลอย)
  diamonds: 100, // 💎 หน่วยเงินพรีเมียมใหม่จากการอ้อนแอดมินดิว
  trickState: null, // { type: 'toss_seed' | 'tickle' | 'spin_wings', startedAt: number }
  diamondRequests: [], // ประวัติการขอเพชร
  mysteryBoxPending: null,
  highScores: {
    hamsterJump: 0,
  },

  lastDecayTime: Date.now(),
  lastUpdated: Date.now(),
};

// ============================================================
// FOOD ITEMS
// ============================================================
// FOOD ITEMS (รวมอาหารปกติ และอาหารพรีเมียมบัฟพิเศษ v5.0)
// ============================================================
export const FOOD_ITEMS = [
  {
    id: "pellets", name: "อาหารเม็ดธรรมดา", icon: "🥣",
    cost: 0, reqLevel: 1, hunger: 15, happiness: 5, exp: 5,
    desc: "อาหารเม็ดแสนอร่อย กินอิ่มง่ายๆ ฟรี!",
  },
  {
    id: "sunflower_seeds", name: "เมล็ดทานตะวันอบ", icon: "🌻",
    cost: 5, reqLevel: 3, hunger: 25, happiness: 12, exp: 10,
    desc: "ของโปรดอันดับหนึ่งของน้องเฮเว่น เคี้ยวกรุบกรอบ",
  },
  {
    id: "broccoli", name: "บรอกโคลีสดกรอบ", icon: "🥦",
    cost: 10, reqLevel: 3, hunger: 35, happiness: 15, exp: 15,
    desc: "ผักสดเพื่อสุขภาพ เพิ่มไฟเบอร์ให้น้องแฮมเตอร์",
  },
  {
    id: "strawberry", name: "สตรอว์เบอร์รีหวานฉ่ำ", icon: "🍓",
    cost: 15, reqLevel: 3, hunger: 50, happiness: 30, exp: 25,
    desc: "ผลไม้สีแดงสดใส กลิ่นหอมหวานถูกใจน้องเฮเว่น",
  },
  {
    id: "cheesecake", name: "ชีสเค้กเนียนนุ่ม", icon: "🧀",
    cost: 25, reqLevel: 3, hunger: 70, happiness: 50, exp: 40,
    desc: "ของหวานพรีเมียม กินแล้วฟินจนแก้มตุ่ย",
  },
  // v5.0 Premium Foods
  {
    id: "kaprao_rice", name: "ข้าวกะเพราหมูสับไข่ดาวกรอบ", icon: "🍳",
    image: "/assets/food/kaprao_rice.png",
    cost: 120, reqLevel: 3, hunger: 60, happiness: 45, exp: 50,
    buff: { type: "double_coin", label: "🔥 ไฟลุก! มินิเกมได้เหรียญ x2", duration: 15 * 60 * 1000 },
    desc: "อาหารไทยยอดฮิตสูตรลับ ไข่ดาวกรอบเยิ้มๆ ให้บัฟเหรียญมินิเกม x2 นาน 15 นาที!",
  },
  {
    id: "boba_tea", name: "ชานมไข่มุกไต้หวัน", icon: "🧋",
    image: "/assets/food/boba_tea.png",
    cost: 65, reqLevel: 3, hunger: 45, happiness: 40, exp: 35,
    buff: { type: "slow_hunger", label: "🧋 อิ่มนานขึ้น 2 เท่า (ลดความหิวช้าลง 50%)", duration: 30 * 60 * 1000 },
    desc: "ชานมหอมละมุนพร้อมไข่มุกหนึบหนับ ช่วยให้น้องอิ่มนานขึ้น 2 เท่า!",
  },
  {
    id: "watermelon", name: "แตงโมหวานฉ่ำเย็นเจี๊ยบ", icon: "🍉",
    image: "/assets/food/watermelon.png",
    cost: 40, reqLevel: 3, hunger: 35, happiness: 50, exp: 25,
    desc: "แตงโมแดงสดหวานเจี๊ยบ ดับร้อน ฟื้นฟูความสุขและความสะอาดทันที!",
  },
  {
    id: "shabu_pot", name: "ชาบูหม้อไฟทองเหลืองจิ๋ว", icon: "🍲",
    image: "/assets/food/shabu_pot.png",
    cost: 250, reqLevel: 5, hunger: 100, happiness: 100, exp: 100,
    desc: "ปาร์ตี้หม้อไฟสุดหรู ฟื้นฟูค่าสถานะของน้องเฮเว่นทุกหลอดเต็ม 100% ทันที!",
  },
];

// ============================================================
// GARDEN CROPS (พืชสวนผักหลังบ้าน v5.0)
// ============================================================
export const GARDEN_CROPS = [
  {
    id: "sunflower",
    name: "ต้นทานตะวันยักษ์",
    icon: "🌻",
    image: "/assets/garden/sunflower.png",
    seedCost: 10,
    growTime: 120, // 2 นาที
    yieldType: "coins",
    yieldAmount: 40,
    desc: "ปลูกง่าย ผลิตเมล็ดทานตะวันทองคำเป็นเหรียญก้อนโต",
  },
  {
    id: "basil",
    name: "ต้นกะเพราหอม",
    icon: "🌿",
    image: "/assets/garden/basil_leaf.png",
    seedCost: 15,
    growTime: 180, // 3 นาที
    yieldType: "item",
    yieldItem: "basil_leaf",
    yieldAmount: 2,
    desc: "ใบกะเพราสดกลิ่นหอมกรุ่น วัตถุดิบหลักสำหรับผัดข้าวกะเพรา",
  },
  {
    id: "chili",
    name: "ต้นพริกขี้หนูสวน",
    icon: "🌶️",
    image: "/assets/garden/chili_pepper.png",
    seedCost: 15,
    growTime: 180, // 3 นาที
    yieldType: "item",
    yieldItem: "chili_pepper",
    yieldAmount: 2,
    desc: "พริกแดงรสแซ่บ เติมความจี๊ดจ๊าดให้จานเด็ด",
  },
  {
    id: "strawberry",
    name: "ต้นสตรอว์เบอร์รีหวาน",
    icon: "🍓",
    image: "/assets/garden/strawberry.png",
    seedCost: 25,
    growTime: 300, // 5 นาที
    yieldType: "item",
    yieldItem: "fresh_strawberry",
    yieldAmount: 2,
    desc: "สตรอว์เบอร์รีสีแดงฉ่ำ ใช้ทำชานมและของหวาน",
  },
];

// ============================================================
// COOKING RECIPES (สูตรอาหารปรุงสดในห้องครัว v5.0)
// ============================================================
export const COOKING_RECIPES = [
  {
    id: "cook_kaprao",
    name: "ข้าวกะเพราหมูสับไข่ดาวกรอบ",
    resultFoodId: "kaprao_rice",
    icon: "🍳",
    image: "/assets/food/kaprao_rice.png",
    reqIngredients: { basil_leaf: 2, chili_pepper: 1 },
    desc: "ใช้ใบกะเพรา 2 ใบ + พริกขี้หนู 1 เม็ด ปรุงเป็นข้าวกะเพราไข่ดาวฟรี!",
  },
  {
    id: "cook_boba",
    name: "ชานมไข่มุกไต้หวัน",
    resultFoodId: "boba_tea",
    icon: "🧋",
    image: "/assets/food/boba_tea.png",
    reqIngredients: { fresh_strawberry: 1, basil_leaf: 1 },
    desc: "ใช้สตรอว์เบอร์รี 1 ผล + ใบชาหอม 1 ใบ ชงเป็นชานมไข่มุกอิ่มนาน 2 เท่า!",
  },
];

// ============================================================
// MINI BUDDY PETS (สัตว์เลี้ยงคู่หูตัวจิ๋ว v5.0)
// ============================================================
export const BUDDY_PETS = [
  {
    id: "buddy_piyo",
    name: "ลูกเจี๊ยบปิโย๊ะ (Piyo)",
    icon: "🐥",
    image: "/assets/buddies/buddy_piyo.png",
    rarity: "uncommon",
    cost: 0,
    perk: "ช่วยเก็บเหรียญตกในกรงอัตโนมัติ (+15 เหรียญทุก 3 นาที)",
    desc: "ลูกเจี๊ยบขนปุยสีเหลือง คอยเดินดุ๊กดิ๊กเก็บเมล็ดทานตะวันช่วยเจ้านาย",
  },
  {
    id: "buddy_ladybug",
    name: "เต่าทองนำโชค (Ladybug)",
    icon: "🐞",
    image: "/assets/buddies/buddy_ladybug.png",
    rarity: "rare",
    cost: 500,
    perk: "เพิ่มโอกาสเก็บเกี่ยวผลผลิตในสวนผักได้ x2 (+50% Double Harvest)",
    desc: "เต่าทองนำโชคที่จะช่วยดูแลสวนผักของคุณให้อุดมสมบูรณ์",
  },
  {
    id: "buddy_mimi",
    name: "น้องแมวจิ๋วมิมี่ (Mimi)",
    icon: "🐱",
    image: "/assets/buddies/buddy_mimi.png",
    rarity: "legendary",
    cost: 800,
    perk: "เพิ่มค่าความสุขให้น้องเฮเว่นเรื่อยๆ (+10 ทุก 5 นาที)",
    desc: "ลูกแมวตัวจิ๋วเพื่อนซี้ของน้องเฮเว่น อยู่ด้วยกันแล้วมีความสุขที่สุด",
  },
];

// ============================================================
// GASHAPON REWARD POOL (ตู้สุ่มกาชาปอง v5.0)
// ============================================================
export const GASHAPON_POOL = [
  // SSR (3%)
  { id: "ssr_golden_crown", name: "มงกุฎราชาทองคำแท้", type: "wardrobe", itemId: "flower_crown", icon: "👑", rarity: "SSR", rate: 1.0 },
  { id: "ssr_buddy_mimi", name: "คู่หู: น้องแมวจิ๋วมิมี่", type: "buddy", itemId: "buddy_mimi", icon: "🐱", rarity: "SSR", rate: 1.0 },
  { id: "ssr_title_tycoon", name: "ฉายาสีทอง: 'มหาเศรษฐีทานตะวัน'", type: "title", title: "มหาเศรษฐีทานตะวัน", icon: "🏆", rarity: "SSR", rate: 1.0 },
  // SR (17%)
  { id: "sr_buddy_ladybug", name: "คู่หู: เต่าทองนำโชค", type: "buddy", itemId: "buddy_ladybug", icon: "🐞", rarity: "SR", rate: 5.0 },
  { id: "sr_shabu_pot", name: "ชาบูหม้อไฟจิ๋ว x2", type: "food", foodId: "shabu_pot", count: 2, icon: "🍲", rarity: "SR", rate: 6.0 },
  { id: "sr_title_spender", name: "ฉายา: 'สายเปย์แห่งปี'", type: "title", title: "สายเปย์แห่งปี", icon: "💎", rarity: "SR", rate: 6.0 },
  // Common (80%)
  { id: "com_kaprao", name: "ข้าวกะเพราหมูสับไข่ดาว", type: "food", foodId: "kaprao_rice", count: 1, icon: "🍳", rarity: "Common", rate: 20.0 },
  { id: "com_boba", name: "ชานมไข่มุกไต้หวัน", type: "food", foodId: "boba_tea", count: 1, icon: "🧋", rarity: "Common", rate: 20.0 },
  { id: "com_seeds_200", name: "ถุงเมล็ดทานตะวัน 200 เมล็ด", type: "coins", amount: 200, icon: "🌻", rarity: "Common", rate: 20.0 },
  { id: "com_seeds_100", name: "ถุงเมล็ดทานตะวัน 100 เมล็ด", type: "coins", amount: 100, icon: "🌻", rarity: "Common", rate: 20.0 },
];

// ============================================================
// MANSION THEMES (อัพเกรดกรงคฤหาสน์หรู v5.0 & 2-Story Balcony)
// ============================================================
export const MANSION_THEMES = [
  {
    id: "default_grid",
    name: "กรงกระดาษกริดดั้งเดิม",
    cost: 0,
    bgStyle: "bg-amber-50/60",
    bgClass: "bg-gradient-to-b from-amber-50 via-orange-50/80 to-amber-100 border-amber-300 shadow-amber-200/50",
    desc: "ธีมกรงอบอุ่น เรียบง่าย คลาสสิก",
    hasSecondFloor: false,
  },
  {
    id: "penthouse_wood",
    name: "เพนต์เฮาส์สองชั้นลายไม้โอ๊คหรู",
    cost: 1500,
    bgStyle: "bg-gradient-to-b from-amber-100/90 to-amber-200/90 border-amber-300",
    bgClass: "bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 border-amber-500 shadow-amber-300/50",
    desc: "บ้านเพนต์เฮาส์สองชั้นลายไม้โอ๊คพรีเมียม สไตล์คฤหาสน์หรูหรา",
    hasSecondFloor: true,
    floorName: "ระเบียงไม้โอ๊คชั้น 2",
    themeType: "wood",
    ambientIcon: "🪵",
  },
  {
    id: "pastel_palace",
    name: "พระราชวังพาสเทลฟรุ้งฟริ้ง",
    cost: 3000,
    bgStyle: "bg-gradient-to-b from-pink-100/90 via-purple-100/90 to-indigo-100/90 border-pink-300",
    bgClass: "bg-gradient-to-b from-pink-100 via-rose-100 to-purple-200 border-pink-400 shadow-pink-300/50",
    desc: "ปราสาทเจ้าหญิงสีชมพูพาสเทล ประดับประกายดาวระยิบระยับ",
    hasSecondFloor: true,
    floorName: "หอคอยเจ้าหญิงพาสเทล",
    themeType: "pastel",
    ambientIcon: "✨",
  },
  {
    id: "space_cyber",
    name: "สถานีอวกาศแฮมสเตอร์นีออน",
    cost: 5000,
    bgStyle: "bg-gradient-to-b from-slate-900/90 via-indigo-950/90 to-purple-950/90 text-white border-cyan-400",
    bgClass: "bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 border-cyan-400 shadow-cyan-500/40 text-white",
    desc: "ห้องควบคุมสถานีอวกาศธีมไซเบอร์พังก์ พร้อมวิวทางช้างเผือก",
    hasSecondFloor: true,
    floorName: "ดาดฟ้าชมทางช้างเผือก",
    themeType: "cyber",
    ambientIcon: "🚀",
  },
];

// ============================================================
// WARDROBE ITEMS (รวมชุด Pass และ Streak พร้อมภาพ Pixel Art)
// ============================================================
export const WARDROBE_ITEMS = [
  { id: "frog_hat",    type: "hat",       name: "หมวกกบเขียวตาโต",         icon: "🐸", image: "/assets/wardrobe/thumbs/frog_hat.png", cost: 0,   reqLevel: 1, desc: "หมวกกบน้อยสุดคิ้วท์ ใส่แล้วน่ารักตาแป๋ว" },
  { id: "unicorn_hat", type: "hat",       name: "หมวกยูนิคอร์นสายรุ้ง",     icon: "🦄", image: "/assets/wardrobe/thumbs/unicorn_hat.png", cost: 200, reqLevel: 1, desc: "ไอเทมลิมิเต็ดจากเช็คชื่อ 7 วัน สวยวิ้งค์มีเขาเวทมนตร์" },
  { id: "star_glasses",type: "hat",       name: "แว่นตาดาววิ้งค์",          icon: "⭐", image: "/assets/wardrobe/thumbs/star_glasses.png", cost: 150, reqLevel: 1, desc: "แว่นรูปดาวประกายวิบวับ ลิมิเต็ดจาก Gold Pass" },
  { id: "sunglasses",  type: "hat",       name: "แว่นกันแดดสุดเท่",         icon: "🕶️", image: "/assets/wardrobe/thumbs/sunglasses.png", cost: 50,  reqLevel: 5, desc: "แว่นดำบอสใหญ่ เพิ่มความคูล 300%" },
  { id: "flower_crown",type: "hat",       name: "มงกุฎดอกไม้พาสเทล",       icon: "🌸", image: "/assets/wardrobe/thumbs/flower_crown.png", cost: 75,  reqLevel: 5, desc: "มงกุฎดอกซากุระ หวานละมุนน่าทะนุถนอม" },
  { id: "party_hat",   type: "hat",       name: "หมวกปาร์ตี้สายรุ้ง",      icon: "🎉", image: "/assets/wardrobe/thumbs/party_hat.png", cost: 60,  reqLevel: 5, desc: "หมวกทรงกรวยหลากสี พร้อมลุยทุกเทศกาล" },
  { id: "red_bow",     type: "accessory", name: "โบว์แดงน่ารัก",           icon: "🎀", image: "/assets/wardrobe/thumbs/red_bow.png", cost: 40,  reqLevel: 5, desc: "โบว์ผ้าซาตินสีแดงสด เพิ่มความหวาน" },
  { id: "bell_collar", type: "accessory", name: "กระดิ่งทองกุ๊งกิ๊ง",       icon: "🔔", image: "/assets/wardrobe/thumbs/bell_collar.png", cost: 55,  reqLevel: 5, desc: "ปลอกคอกระดิ่งสีทอง เดินไปไหนมีเสียงกุ๊งกิ๊ง" },
  { id: "star_badge",  type: "accessory", name: "เข็มกลัดดาวประกาย",       icon: "⭐", image: "/assets/wardrobe/thumbs/star_badge.png", cost: 45,  reqLevel: 5, desc: "เข็มกลัดรูปดาวส่องแสงวิบวับ" },
  { id: "cloud_pajamas",type: "outfit",   name: "ชุดนอนปุยเมฆแฟนซี",       icon: "☁️", image: "/assets/wardrobe/thumbs/cloud_pajamas.png", cost: 250, reqLevel: 1, desc: "ชุดนอนขนนุ่มลายปุยเมฆ ลิมิเต็ด Season 1 Gold Pass Master" },
  { id: "hoodie_special", type: "outfit", name: "ชุดฮู้ดดี้พิเศษ (Limited)", icon: "🧥", image: "/assets/wardrobe/thumbs/hoodie_special.png", cost: 150, reqLevel: 5, desc: "ฮู้ดดี้ขนปุยโทนพาสเทล อุ่นสบาย (ไอเทมลิมิเต็ด!)" },
  { id: "cute_bib",    type: "outfit",    name: "ผ้ากันเปื้อนลายดาว",       icon: "⭐", image: "/assets/wardrobe/thumbs/cute_bib.png", cost: 65,  reqLevel: 5, desc: "ผ้ากันเปื้อนสำหรับเจ้าแฮมสเตอร์ตัวน้อย" },
  { id: "cape_hero",   type: "outfit",    name: "ผ้าคลุมฮีโร่สีแดง",       icon: "🦸", image: "/assets/wardrobe/thumbs/cape_hero.png", cost: 120, reqLevel: 5, desc: "ผ้าคลุมยาวพลิ้วไหว สำหรับผู้พิทักษ์ความยุติธรรม" },
  // 🪽 ANIMATED WINGS (คอสตูมปีกขยับได้ Pixel Art v6.0)
  { id: "wings_angel",  type: "wings", name: "ปีกนางฟ้าปุกปุย",         icon: "🪽", image: "/assets/wardrobe/thumbs/wings_angel.png", cost: 600, reqLevel: 3, desc: "ปีกขนนกสีขาวบริสุทธิ์ กระพือปีกนุ่มฟูดุ๊กดิ๊กบนหลังน้อง", isAnimated: true },
  { id: "wings_devil",  type: "wings", name: "ปีกค้างคาวปีศาจน้อย",     icon: "🦇", image: "/assets/wardrobe/thumbs/wings_devil.png", cost: 750, reqLevel: 4, desc: "ปีกค้างคาวปีศาจ ขยับกระพือดุ๊กดิ๊ก เพิ่มความซน", isAnimated: true },
  { id: "wings_fairy",  type: "wings", name: "ปีกภูตแฟรี่ประกายรุ้ง",     icon: "🧚", image: "/assets/wardrobe/thumbs/wings_fairy.png", cost: 900, reqLevel: 5, desc: "ปีกภูตแฟรี่โปร่งแสง เปล่งประกายละอองเวทมนตร์", isAnimated: true },
  { id: "wings_golden", type: "wings", name: "ปีกฟีนิกซ์ทองคำ (SSR)",   icon: "✨", image: "/assets/wardrobe/thumbs/wings_golden.png", cost: 2500, reqLevel: 6, desc: "ปีกทองคำเปล่งประกาย สัญลักษณ์แห่งความยิ่งใหญ่", isAnimated: true },
];

// ============================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================
export const ACHIEVEMENT_DEFS = [
  { id: "first_feed", name: "นักเลี้ยงมือใหม่", desc: "ให้อาหารน้องเฮเว่นครั้งแรก", icon: "🥣", rarity: "common", check: (stats) => stats.totalFed >= 1 },
  { id: "feed_10", name: "แม่ครัวแห่งกรง", desc: "ให้อาหารครบ 10 ครั้ง", icon: "👨‍🍳", rarity: "uncommon", check: (stats) => stats.totalFed >= 10 },
  { id: "feed_50", name: "เชฟสามดาวมิชลิน", desc: "ให้อาหารครบ 50 ครั้ง", icon: "⭐⭐⭐", rarity: "rare", check: (stats) => stats.totalFed >= 50 },
  { id: "first_pet", name: "นักลูบหัวมือโปร", desc: "ลูบหัวน้องเฮเว่นครั้งแรก", icon: "✋", rarity: "common", check: (stats) => stats.totalPets >= 1 },
  { id: "pet_20", name: "นักลูบแห่งปี", desc: "ลูบหัวน้อง 20 ครั้ง", icon: "💆", rarity: "uncommon", check: (stats) => stats.totalPets >= 20 },
  { id: "clean_5", name: "นักสุขาภิบาลสุดเจ๋ง", desc: "ทำความสะอาดกรง 5 ครั้ง", icon: "🧹", rarity: "uncommon", check: (stats) => stats.totalCleans >= 5 },
  { id: "coins_100", name: "นักสะสมเมล็ดทานตะวัน", desc: "สะสมเหรียญรวมถึง 100 เมล็ด", icon: "🌻", rarity: "uncommon", check: (stats) => stats.totalCoinsEarned >= 100 },
  { id: "coins_1000", name: "เจ้าสวนทานตะวัน", desc: "สะสมเหรียญรวมถึง 1,000 เมล็ด", icon: "💰", rarity: "rare", check: (stats) => stats.totalCoinsEarned >= 1000 },
  { id: "minigame_1", name: "นักปั่นมือใหม่", desc: "เล่นมินิเกมปั่นวงล้อครั้งแรก", icon: "🎡", rarity: "common", check: (stats) => stats.miniGamesPlayed >= 1 },
  { id: "minigame_5", name: "แชมป์วงล้อ", desc: "เล่นมินิเกมปั่นวงล้อ 5 ครั้ง", icon: "🏆", rarity: "rare", check: (stats) => stats.miniGamesPlayed >= 5 },
  { id: "level_3", name: "น้องเฮเว่นโต!", desc: "น้องเฮเว่นถึงระดับ 3", icon: "🌟", rarity: "uncommon", check: (_, state) => state.level >= 3 },
  { id: "level_5", name: "เฮเว่นสุดยอด!", desc: "น้องเฮเว่นถึงระดับ 5", icon: "👑", rarity: "legendary", check: (_, state) => state.level >= 5 },
];

export const RARITY_STYLES = {
  common:    { bg: "bg-slate-100",  border: "border-slate-300",  text: "text-slate-700",  label: "ทั่วไป",    glow: "" },
  uncommon:  { bg: "bg-green-50",   border: "border-green-300",  text: "text-green-800",  label: "หายาก",     glow: "shadow-green-200" },
  rare:      { bg: "bg-blue-50",    border: "border-blue-300",   text: "text-blue-800",   label: "หายากมาก", glow: "shadow-blue-200" },
  legendary: { bg: "bg-amber-50",   border: "border-amber-400",  text: "text-amber-900",  label: "ตำนาน",     glow: "shadow-amber-200 shadow-md" },
};

export const LEVEL_PERKS = {
  1: "เล่นพื้นฐาน ให้อาหารเม็ดธรรมดา",
  2: "ปลดล็อคมินิเกม 'ปั่นวงล้อ' วิ่งเก็บเหรียญ",
  3: "ปลดล็อค 'ร้านค้าอาหารพรีเมียม' 4 เมนู",
  5: "ปลดล็อค 'ร้านค้าแฟชั่น & ตู้เสื้อผ้า' แต่งตัวสุดคิ้วท์",
};

export const HAPPY_QUOTES = [
  "ฮัมมี่มีความสุขจังเลยงับ! 💖",
  "เมล็ดทานตะวันคือของอร่อยที่สุดในโลก! 🌻",
  "ลูบหัวอีกหน่อยน้า ชอบมั่กๆ เลย 🐹✨",
  "วันนี้อากาศดีจัง มาเล่นกันเถอะ!",
  "เฮเว่นรักเจ้านายที่สุดเลยยย~ 🐾",
  "กรงสะอาด น่านอนเกลือกกลิ้งที่สุด!",
];

export const HUNGRY_QUOTES = [
  "หิวจนพุงยุบแล้วน้า ขอของกินหน่อยงับ 🥺",
  "จ๊อกๆ... ท้องเฮเว่นร้องแล้วนะ",
  "มีเมล็ดทานตะวันมั้ยงับ?",
];

export const ANGRY_QUOTES = [
  "โกรธแล้วนะ! อย่าทำให้กรงสกปรกได้ยิน! 😤",
  "นู๋ไม่โอเคเลยวันนี้... 😠",
  "เฮ้ย! มีอึเยอะมาก! ช่วยเก็บทีได้มั้ย! 💢",
];

export const SAD_QUOTES = [
  "ทำไมไม่มาเล่นด้วยเลย... เหงาจัง 😢",
  "ไม่ค่อยมีความสุขเลยวันนี้...",
  "น้องรอนายอยู่นะ 🥺",
];

// ==============================================================================
// 🐹 HAMSTER BREEDS & SKINS (v4.0) — COSMETIC ONLY
// ==============================================================================
export const HAMSTER_BREEDS = [
  {
    id: "winter_white",
    name: "วินเทอร์ไวท์ (Winter White)",
    tag: "เริ่มต้น",
    image: "/assets/breeds/winter_white.png",
    thumb: "/assets/breeds/thumbs/winter_white.png",
    desc: "ขาวปุกปุย แก้มชมพูระเรื่อ นุ่มนิ่มน่ากอดที่สุด สายพันธุ์ดั้งเดิมของน้องเฮเว่น",
    cost: 0,
    reqLevel: 1,
  },
  {
    id: "roborovski",
    name: "โรโบรอฟสกี้ (Roborovski)",
    tag: "ปลดล็อค Lv.5",
    image: "/assets/breeds/roborovski.png",
    thumb: "/assets/breeds/thumbs/roborovski.png",
    desc: "สีน้ำตาลทองลายคาด คิ้วขาว ตาแป๋ว ตัวจิ๋วปราดเปรียว วิ่งไวเหมือนจรวด",
    cost: 0,
    reqLevel: 5,
  },
  {
    id: "golden_giant",
    name: "ไจแอนท์ส้มคาราเมล (Golden Syrian)",
    tag: "ปลดล็อค Lv.10",
    image: "/assets/breeds/golden_giant.png",
    thumb: "/assets/breeds/thumbs/golden_giant.png",
    desc: "ขนสีส้มแอปริคอต ตัวอ้วนตุ้ยนุ้ย แก้มป่อง น่าฟัดสุดๆ",
    cost: 0,
    reqLevel: 10,
  },
  {
    id: "panda",
    name: "แพนด้าลายวัว (Panda Hamster)",
    tag: "ปลดล็อค Lv.15",
    image: "/assets/breeds/panda.png",
    thumb: "/assets/breeds/thumbs/panda.png",
    desc: "ลายขาว-ดำคลาสสิก โดดเด่นไม่ซ้ำใคร น่ารักสะกดทุกสายตา",
    cost: 0,
    reqLevel: 15,
  },
];

// ==============================================================================
// 🎭 HAMSTER PERSONALITIES (v4.0)
// ==============================================================================
export const PERSONALITIES = [
  {
    id: "glutton",
    name: "จอมตะกละ",
    icon: "🍩",
    tagline: "เรื่องกินเรื่องใหญ่ แก้มตุ่ยตลอดเวลา",
    quotes: [
      "หม่ำๆ อร่อยจังเยยย~ 🌻",
      "มีเมล็ดทานตะวันอีกมั้ยน้า ท้องร้องแย้วว",
      "เคี้ยวแก้มตุ่ยเลยยย งั่มๆๆ",
      "วันนี้มีขนมอะไรให้หนูกินบ้างงับ? 🍪",
    ],
  },
  {
    id: "sleepyhead",
    name: "ขี้เซา",
    icon: "💤",
    tagline: "ง่วงได้ทุกที่ เตียงนุ่มๆ คือสวรรค์",
    quotes: [
      "ฮาวววว~ ขอหลับต่ออีก 5 นาทีนะงับ 💤",
      "อากาศดีแบบนี้ น่าม้วนตัวนอนที่สุดเลยย",
      "ขอนอนกลางวันแป๊บนึงน้า Zzz...",
      "เตียงนุ่มๆ กลิ่นหอมจังเยยย",
    ],
  },
  {
    id: "hyper",
    name: "นักซิ่งไฮเปอร์",
    icon: "⚡",
    tagline: "พลังงานล้นเหลือ พร้อมวิ่ง 100 รอบ!",
    quotes: [
      "วู้ฮู้วว! พลังล้นเหลือ พร้อมวิ่ง 100 รอบ! ⚡",
      "ไปเล่นของเล่นกันนนน ดุ๊กดิ๊กๆ!",
      "หมุนตัว 360 องศาให้ดูเลยยยย!",
      "วันนี้ตื่นเต้นจัง มีอะไรให้สำรวจบ้างน้า!",
    ],
  },
  {
    id: "affectionate",
    name: "จอมอ้อน",
    icon: "💕",
    tagline: "ติดเจ้าของ ชอบให้ลูบหัวเป็นที่สุด",
    quotes: [
      "รักเจ้าของที่สุดในโลกเล้ยยย~ 💕",
      "มาลูบหัวเค้าหน่อยจิ คิดถึงจังงง",
      "อยู่กับเจ้าของแล้วมีความสุขที่สุดเลย!",
      "ขอกอดแน่นๆ ทีหนึ่งได้มั้ยงับ~ 🐾",
    ],
  },
];

// ==============================================================================
// 👤 PLAYER AVATARS & TITLES (v6.0)
// ==============================================================================
export const PLAYER_AVATARS = [
  { id: "avatar_hamster_classic", name: "แฮมสเตอร์คลาสสิก", image: "/assets/avatars/avatar_hamster_classic.png", reqLevel: 1 },
  { id: "avatar_hamster_cool",    name: "แฮมสเตอร์สุดคูล (แว่นดำ)", image: "/assets/avatars/avatar_hamster_cool.png", reqLevel: 2 },
  { id: "avatar_hamster_crown",   name: "ราชาแฮมสเตอร์ (มงกุฎทอง)", image: "/assets/avatars/avatar_hamster_crown.png", reqLevel: 5 },
  { id: "avatar_hamster_angel",   name: "ทูตสวรรค์น้อย (วงแหวน)", image: "/assets/avatars/avatar_hamster_angel.png", reqLevel: 7 },
  { id: "avatar_dew_admin",       name: "แอดมินดิวสุดหล่อ (Admin)", image: "/assets/avatars/avatar_dew_admin.png", reqLevel: 1 },
];

export const PLAYER_TITLES = [
  "แฮมสเตอร์ฝึกหัด",
  "เด็กเส้นแอดมินดิว 💎",
  "เพื่อนซี้พี่ดิว 👑",
  "นักบินอวกาศจิ๋ว 🚀",
  "มหาเศรษฐีเมล็ดทานตะวัน 🌻",
  "ผู้พิทักษ์แห่งความน่ารัก ✨",
  "เชฟกระทะร้อนกะเพราไข่ดาว 🍳",
  "แชมป์กระโดดเมฆ Hamster Jump ☁️",
];
