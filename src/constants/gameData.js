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
  lastDecayTime: Date.now(),
  lastUpdated: Date.now(),
};

// ============================================================
// FOOD ITEMS
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
