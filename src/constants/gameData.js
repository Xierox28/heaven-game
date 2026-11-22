// ==============================================================================
// 🐹 HEAVEN GAME CONSTANTS & DATA — UPDATED WITH PASS & STREAK
// ==============================================================================

export const INITIAL_GAME_STATE = {
  schemaVersion: 8,
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

  // 🏛️ v7.0 TYCOON ECONOMY & PRESTIGE
  prestige: {
    rank: 0,
    totalRebirths: 0,
    perks: [],
  },
  faithPoints: 0,
  totalDonatedSeeds: 0,

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
// 👑 HIGH-ROLLER VIP GASHAPON (ตู้สุ่มมหาเศรษฐี v7.0)
// สุ่ม 5,000 เมล็ด / สุ่ม 10 ครั้ง 45,000 เมล็ด
// ============================================================
export const HIGH_ROLLER_GASHAPON_POOL = [
  // Jackpot SSR (10%)
  { id: "hr_wings_cosmic", name: "ปีกเนบิวลาจักรวาล 6 แฉก (SSR)", type: "wardrobe", itemId: "wings_cosmic_nebula", icon: "🌌", rarity: "SSR", rate: 3.0 },
  { id: "hr_statue_gold", name: "รูปปั้นทองคำแท้น้องเฮเว่น (SSR)", type: "furniture", itemId: "statue_golden_hamster", icon: "🏆", rarity: "SSR", rate: 3.0 },
  { id: "hr_diamond_500", name: "หีบเพชรเจ้าสัว +500 💎", type: "diamonds", amount: 500, icon: "💎", rarity: "SSR", rate: 4.0 },
  // SR (30%)
  { id: "hr_title_sultan", name: "ฉายาทองคำ: 'สุลต่านแห่งกรงสวรรค์ 👑'", type: "title", title: "สุลต่านแห่งกรงสวรรค์ 👑", icon: "👑", rarity: "SR", rate: 8.0 },
  { id: "hr_diamond_150", name: "ถุงเพชรแท้ +150 💎", type: "diamonds", amount: 150, icon: "💎", rarity: "SR", rate: 10.0 },
  { id: "hr_shabu_x5", name: "ปาร์ตี้ชาบูหม้อไฟทองคำ x5 ชุด", type: "food", foodId: "shabu_pot", count: 5, icon: "🍲", rarity: "SR", rate: 12.0 },
  // Common (60%)
  { id: "hr_diamond_50", name: "ถุงเพชรย่อย +50 💎", type: "diamonds", amount: 50, icon: "💎", rarity: "Common", rate: 25.0 },
  { id: "hr_kaprao_x10", name: "กะเพราไข่ดาวพรีเมียม x10 จาน", type: "food", foodId: "kaprao_rice", count: 10, icon: "🍳", rarity: "Common", rate: 35.0 },
];

// ============================================================
// ⭐ PRESTIGE REBIRTH TIERS (ระบบจุติเกียรติยศ v7.0)
// ============================================================
export const PRESTIGE_TIERS = [
  {
    rank: 1,
    cost: 50000,
    reqLevel: 10,
    star: "★1",
    name: "จุติขั้น 1: ดาราทองคำ",
    perkDesc: "ความหิวและความสะอาดลดช้าลง 20% ถาวร",
    bonusDiamonds: 100,
  },
  {
    rank: 2,
    cost: 200000,
    reqLevel: 15,
    star: "★2",
    name: "จุติขั้น 2: สุลต่านทานตะวัน",
    perkDesc: "ได้รับเพชรฟรี +10 💎 ทุกครั้งที่อัปเลเวล & เพิ่มความสุขไวขึ้น 30%",
    bonusDiamonds: 300,
  },
  {
    rank: 3,
    cost: 1000000,
    reqLevel: 20,
    star: "★3",
    name: "จุติขั้น 3: จักรพรรดิแห่งสวรรค์",
    perkDesc: "ผลผลิตการปลูกผักในสวน x2 ถาวร & มินิเกมได้เหรียญโบนัส +50%",
    bonusDiamonds: 1000,
  },
  {
    rank: 4,
    cost: 5000000,
    reqLevel: 25,
    star: "★4",
    name: "จุติขั้น 4: มหาเทพแฮมสเตอร์ทองคำ",
    perkDesc: "ปลดล็อคสายพันธุ์ลับ 'แฮมสเตอร์ทองคำจุติ' & รัศมีออร่าดาวรอบตัวถาวร",
    bonusDiamonds: 5000,
  },
];

// ============================================================
// 💱 SEED-TO-DIAMOND CENTRAL MINT (โรงกษาปณ์แลกเพชร v7.0)
// ============================================================
export const MINT_EXCHANGE_TIERS = [
  { id: "mint_25k", seedCost: 25000, diamondYield: 50, label: "25,000 เมล็ด ➔ 50 💎", bonus: "" },
  { id: "mint_50k", seedCost: 50000, diamondYield: 120, label: "50,000 เมล็ด ➔ 120 💎", bonus: "+20% โบนัส" },
  { id: "mint_100k", seedCost: 100000, diamondYield: 260, label: "100,000 เมล็ด ➔ 260 💎", bonus: "+30% โบนัส" },
  { id: "mint_1m", seedCost: 1000000, diamondYield: 3000, label: "1,000,000 เมล็ด ➔ 3,000 💎", bonus: "+50% โบนัสเจ้าสัว" },
];

// ============================================================
// 🏛️ GOLDEN SHRINE DONATIONS & BLESSINGS (แท่นบูชาทานตะวัน v7.0)
// ============================================================
export const SHRINE_DONATION_TIERS = [
  { id: "shrine_1k", amount: 1000, faithYield: 10, label: "บริจาค 1,000 เมล็ด", desc: "รับ +10 แต้มศรัทธา" },
  { id: "shrine_10k", amount: 10000, faithYield: 120, label: "บริจาค 10,000 เมล็ด", desc: "รับ +120 แต้มศรัทธา (โบนัส +20%)" },
  { id: "shrine_100k", amount: 100000, faithYield: 1500, label: "บริจาค 100,000 เมล็ด", desc: "รับ +1,500 แต้มศรัทธา (โบนัส +50%)" },
  { id: "shrine_1m", amount: 1000000, faithYield: 20000, label: "บริจาค 1,000,000 เมล็ด", desc: "รับ +20,000 แต้มศรัทธา (โบนัสเศรษฐี x2)" },
];

export const SHRINE_BLESSING_SHOP = [
  { id: "faith_title_saint", name: "ฉายา: 'ผู้ใจบุญแห่งสวรรค์' ✨", cost: 100, type: "title", title: "ผู้ใจบุญแห่งสวรรค์ ✨", icon: "🕊️", desc: "ฉายาประกายแสงสีฟ้าสำหรับผู้บำเพ็ญบุญ" },
  { id: "faith_title_billionaire", name: "ฉายา: 'มหาเศรษฐีใจบุญพันล้าน' 💰", cost: 500, type: "title", title: "มหาเศรษฐีใจบุญพันล้าน 💰", icon: "👑", desc: "ฉายาทองคำสะท้อนความมั่งคั่งและใจกว้าง" },
  { id: "faith_server_rain", name: "เสกฝนเมล็ดทานตะวันให้ทั้งเซิร์ฟเวอร์! 🌧️", cost: 1000, type: "server_event", icon: "🌻", desc: "เปิด Event ฝนเมล็ดทานตะวันตกให้ผู้เล่นทุกคนเป็นเวลา 3 นาที" },
  { id: "faith_server_fever", name: "เปิด Golden Fever Time ทั้งเซิร์ฟเวอร์! 🔥", cost: 2500, type: "server_fever", icon: "⚡", desc: "เปิดมินิเกม x2 เหรียญให้ทุกคนในเซิร์ฟเวอร์เป็นเวลา 30 นาที" },
];

// ============================================================
// MANSION THEMES (อัปเกรดกรงคฤหาสน์หรู 2 ชั้น & Multi-Story Architecture)
// ============================================================
export const MANSION_THEMES = [
  {
    id: "default_grid",
    name: "กรงกระดาษกริดดั้งเดิม",
    cost: 0,
    desc: "ธีมกรงอบอุ่น เรียบง่าย คลาสสิก พร้อมขี้เลื่อยไม้สนธรรมชาติ",
    hasSecondFloor: false,
    themeType: "default",
    bgClass: "border-amber-300 shadow-amber-200/50",
    wallClass: "bg-gradient-to-b from-amber-50 via-orange-50/70 to-amber-100/90",
    wallPattern: "grid",
    groundClass: "bg-gradient-to-t from-amber-300/40 via-amber-200/25 to-transparent border-t-2 border-amber-300/40",
    beddingName: "ขี้เลื่อยไม้สนอบอุ่น 🪵",
    perk: "เรียบง่าย สบายใจ ไม่ยุ่งยาก",
  },
  {
    id: "penthouse_wood",
    name: "เพนต์เฮาส์สองชั้นลายไม้โอ๊คหรู",
    cost: 1500,
    desc: "บ้านเพนต์เฮาส์ 2 ชั้นลายไม้โอ๊คพรีเมียม ระเบียงชั้นลอยพร้อมหน้าต่างชมสวนแดดอุ่น",
    hasSecondFloor: true,
    themeType: "wood",
    floorName: "ระเบียงไม้โอ๊คชั้น 2 🪵",
    stairsName: "บันไดไม้โอ๊คปีนป่าย",
    bgClass: "border-amber-600/90 shadow-amber-900/40 shadow-xl",
    wallClass: "bg-gradient-to-b from-[#f7ecd6] via-[#f1dfbe] to-[#e4c99c]",
    wallPattern: "wood_stripes",
    deckStyle: "bg-gradient-to-r from-[#8a5327] via-[#a86834] to-[#7f4a21] border-b-4 border-[#522c0d] shadow-md",
    railingType: "wood",
    groundClass: "bg-gradient-to-t from-[#8b5529]/40 via-[#b97a3f]/25 to-transparent border-t-2 border-[#a76a37]/50",
    beddingName: "พรมขี้เลื่อยไม้ซีดาร์เกรดพรีเมียม 🪵✨",
    ambientIcon: "🪵",
    telescopeLabel: "กล้องส่องวิวสวนดอกไม้ 🌻",
    hammockLabel: "เปลญวนผ้าลินินธรรมชาติ 🛋️",
    snackLabel: "ชามเมล็ดสนคั่วชั้น 2 🥜",
    floorQuotes: [
      "ลมพัดกลิ่นไม้โอ๊คหอมสดชื่นจังฮับ! สบายใจที่สุดเล้ยยย~ 🪵🍃",
      "มองลงไปเห็นห้องนั่งเล่นชั้นล่างด้วย! กรงกว้างขึ้นเป็นกอง 🏡✨",
      "ระเบียงไม้ชั้นลอยตรงนี้ แดดส่องอุ่นกำลังดีเลยงับ ☀️🐹",
      "นั่งแทะเมล็ดทานตะวันบนดาดฟ้าไม้โอ๊ค ชิลอย่าบอกใคร! 🌻😋"
    ],
    groundQuotes: [
      "ไต่บันไดลงมาถึงห้องนั่งเล่นชั้น 1 แล้วฮับ! อบอุ่นคุ้นเคยเหมือนเดิม~ 🐾",
      "ลงมาดื่มน้ำกับวิ่งเล่นข้างล่างดีกว่าาา 💧🎡"
    ],
    perk: "โบนัสความสุข +25% เมื่อพักผ่อนบนระเบียงไม้",
  },
  {
    id: "pastel_palace",
    name: "พระราชวังพาสเทลฟรุ้งฟริ้ง",
    cost: 3000,
    desc: "ปราสาทเจ้าหญิงหินอ่อนสีชมพูพาสเทล ระเบียงหอคอยสีทองประดับดวงดาวระยิบระยับ",
    hasSecondFloor: true,
    themeType: "pastel",
    floorName: "หอคอยเจ้าหญิงพาสเทล 🏰",
    stairsName: "บันไดวนเกลียวทองคำริบบิ้น",
    bgClass: "border-pink-400 shadow-pink-300/60 shadow-xl",
    wallClass: "bg-gradient-to-b from-[#fff0f6] via-[#fce7f3] to-[#f5d0fe]",
    wallPattern: "stars",
    deckStyle: "bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 border-b-4 border-rose-500 shadow-md",
    railingType: "pastel",
    groundClass: "bg-gradient-to-t from-pink-400/40 via-purple-300/20 to-transparent border-t-2 border-pink-300/60",
    beddingName: "เบาะปุยนุ่นกลิ่นสตรอว์เบอร์รี 🍓☁️",
    ambientIcon: "✨",
    telescopeLabel: "กล้องส่องดาววิเศษประกายชมพู ⭐",
    hammockLabel: "เบาะเมฆพาสเทลนุ่มละมุน ☁️💖",
    snackLabel: "มาการองสตรอว์เบอร์รีชั้น 2 🍓",
    floorQuotes: [
      "เหมือนได้เป็นเจ้าหญิงแฮมสเตอร์บนยอดปราสาทสูงเลยงับ! 👑✨",
      "ประกายดาวระยิบระยับรอบตัวหนูสวยจังเลยยยย 💖🌸",
      "ยืนบนระเบียงปราสาทสีชมพูมองลงไปแล้วใจฟูสุดๆ! 🏰🎀",
      "ลมข้างบนนี้หอมกลิ่นดอกซากุระพาสเทลชื่นใจจัง~ 🌸🍃"
    ],
    groundQuotes: [
      "เดินลงบันไดวนทองคำลงมาห้องโถงหลวงชั้นล่างแล้วเพคะ! 🏰🐾",
      "พื้นเบาะเมฆนุ่มๆ ชั้น 1 เดินสบายเท้าจังเลยงับ ☁️✨"
    ],
    perk: "โบนัส EXP +30% เมื่อส่องกล้องดาวบนหอคอย",
  },
  {
    id: "space_cyber",
    name: "สถานีอวกาศแฮมสเตอร์นีออน",
    cost: 5000,
    desc: "ห้องควบคุมสถานีอวกาศไซเบอร์พังก์ ดาดฟ้าชมวิวทางช้างเผือกและโลกสีคราม",
    hasSecondFloor: true,
    themeType: "cyber",
    floorName: "ดาดฟ้าชมทางช้างเผือก 🚀",
    stairsName: "ลิฟต์ลำแสงต้านแรงโน้มถ่วง",
    bgClass: "border-cyan-400 shadow-cyan-500/50 shadow-xl",
    wallClass: "bg-gradient-to-b from-[#060919] via-[#0b132b] to-[#1c2541]",
    wallPattern: "cyber_grid",
    deckStyle: "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 border-b-4 border-cyan-400 shadow-cyan-500/40 shadow-lg",
    railingType: "cyber",
    groundClass: "bg-gradient-to-t from-cyan-900/50 via-blue-950/30 to-transparent border-t-2 border-cyan-400/50",
    beddingName: "แผ่นรองสลายแรงสั่นสะเทือนไทเทเนียม 🛸⚡",
    ambientIcon: "🚀",
    telescopeLabel: "กล้องโทรทรรศน์ส่องกาแล็กซี 🛰️",
    hammockLabel: "แคปซูลชาร์จพลังงานควอนตัม ⚡🔋",
    snackLabel: "อาหารอวกาศอัดเม็ดพลังงานสูง 🧪",
    floorQuotes: [
      "พิกัดทางช้างเผือกชัดเจน! มองเห็นดาวเคราะห์หมุนอยู่ข้างนอกด้วย! 🚀🌌",
      "ระบบสถานีอวกาศตรวจพบพลังงานความสุขระดับ 100%! ⚡🛰️",
      "ดาดฟ้านีออนชั้น 2 เท่ที่สุดในจักรวาลเลยฮับ! 🛸✨",
      "ลอยตัวต้านแรงโน้มถ่วงขึ้นมาชมวิวโลกสีคราม ฟินมากกก! 🌍💙"
    ],
    groundQuotes: [
      "วาร์ปลงมาห้องควบคุมภาคพื้นชั้น 1 เรียบร้อย กัปตันพร้อมลุย! 🚀🐾",
      "ระบบฐานชั้น 1 เสถียร พร้อมดื่มน้ำเติมพลังงาน! ⚡💧"
    ],
    perk: "โบนัสความไวและพลังงาน +30% บนดาดฟ้าอวกาศ",
  },
  {
    id: "mansion_diamond_palace",
    name: "พระราชวังคริสตัลเพชรแสงเหนือ",
    cost: 150000,
    desc: "พระราชวังคริสตัลอัครมหาเศรษฐี หอคอยเพชรประกายแสงเหนือออโรร่าระบำบนฟ้า",
    hasSecondFloor: true,
    themeType: "crystal",
    floorName: "หอคอยเพชรชมแสงออโรร่า 💎",
    stairsName: "บันไดผลึกเพชรเจียระไน",
    bgClass: "border-sky-300 shadow-cyan-300/60 shadow-2xl",
    wallClass: "bg-gradient-to-b from-[#0a192f] via-[#0f3057] to-[#144272]",
    wallPattern: "aurora",
    deckStyle: "bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 border-b-4 border-cyan-200 shadow-cyan-300/50 shadow-xl",
    railingType: "crystal",
    groundClass: "bg-gradient-to-t from-sky-500/40 via-cyan-400/20 to-transparent border-t-2 border-sky-300/60",
    beddingName: "พรมหิมะผลึกเพชรประกายแสงเหนือ ❄️💎",
    ambientIcon: "💎",
    telescopeLabel: "กล้องเพชรชมแสงเหนือออโรร่า 🌌✨",
    hammockLabel: "บัลลังก์ผลึกเพชรหิมะนุ่ม 👑❄️",
    snackLabel: "เมล็ดทานตะวันทองคำชุบเพชร 🌟🌻",
    floorQuotes: [
      "แสงออโรร่าสีเขียวมรกตและม่วงกำลังเต้นระบำอยู่เหนือกรงหนูเลย! 🌌💎✨",
      "ยืนบนหอคอยเพชร สัมผัสถึงพลังแห่งอัครมหาเศรษฐีอันดับ 1! 👑🌟",
      "ลมหนาวแห่งแสงเหนือเย็นชื่นใจ ผลึกเพชรสะท้อนแสงวิบวับสวยจับใจ! ❄️✨",
      "นี่คือจุดสูงสุดของกรงแฮมสเตอร์ระดับเวิลด์คลาส! 🏆💎"
    ],
    groundQuotes: [
      "เยื้องย่างลงมาจากหอคอยเพชรสู่พระที่นั่งชั้นล่างอย่างสง่างาม 💎🐾",
      "พื้นคริสตัลชั้นล่างเย็นสบายเท้า ราวกับเดินบนก้อนเมฆน้ำแข็ง ❄️✨"
    ],
    perk: "มหาเศรษฐีเหนือกาลเวลา: รางวัลเหรียญและ EXP x1.5 ทุกกิจกรรม!",
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
  // 👑 TYCOON LUXURY PIECES (v7.0)
  { id: "wings_cosmic_nebula", type: "wings", name: "ปีกเนบิวลาจักรวาล 6 แฉก (SSR)", icon: "🌌", image: "/assets/wardrobe/thumbs/wings_fairy.png", cost: 300000, reqLevel: 8, desc: "ปีกคอสมิกแห่งมิติสวรรค์ ขยับกระพือละอองดาวจักรวาลเรืองแสง", isAnimated: true },
  { id: "crown_sunflower_tycoon", type: "hat", name: "มงกุฎจักรพรรดิทานตะวัน (1M)", icon: "👑", image: "/assets/wardrobe/thumbs/flower_crown.png", cost: 1000000, reqLevel: 10, desc: "มงกุฎทองคำประดับอัญมณี 1 ล้านเมล็ดทานตะวัน สัญลักษณ์แห่งเจ้าสัวที่แท้จริง" },
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
  {
    id: "golden_celestial",
    name: "แฮมสเตอร์ทองคำจุติ (Golden Celestial)",
    tag: "ปลดล็อค Prestige ★4",
    image: "/assets/breeds/golden_giant.png",
    thumb: "/assets/breeds/thumbs/golden_giant.png",
    desc: "แฮมสเตอร์ระดับเทพเจ้า จุติจากสรวงสวรรค์ เปล่งรัศมีทองคำบริสุทธิ์รอบตัวตลอดเวลา",
    cost: 0,
    reqLevel: 1,
    reqPrestige: 4,
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
  "สุลต่านแห่งกรงสวรรค์ 👑",
  "ผู้ใจบุญแห่งสวรรค์ ✨",
  "มหาเศรษฐีใจบุญพันล้าน 💰",
  "มหาเทพแฮมสเตอร์ทองคำ ★4 🌟",
];
