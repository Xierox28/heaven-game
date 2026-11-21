// ==============================================================================
// 🎟️ HAMSTER PASS & DAILY STREAK CONFIGURATION
// ==============================================================================

export const PASS_LEVELS = [
  {
    level: 1,
    requiredExp: 50,
    freeReward: { type: "coins", amount: 20, icon: "🌻", name: "20 เมล็ดทานตะวัน" },
    goldReward: { type: "coins", amount: 50, icon: "🌻", name: "50 เมล็ดทานตะวัน" },
  },
  {
    level: 2,
    requiredExp: 100,
    freeReward: { type: "food", id: "sunflower_seeds", amount: 2, icon: "🌻", name: "เมล็ดทานตะวันอบ x2" },
    goldReward: { type: "exp", amount: 80, icon: "🌟", name: "80 Hamster EXP" },
  },
  {
    level: 3,
    requiredExp: 160,
    freeReward: { type: "coins", amount: 35, icon: "🌻", name: "35 เมล็ดทานตะวัน" },
    goldReward: { type: "item", id: "star_glasses", category: "hat", icon: "⭐", name: "แว่นตาดาววิ้งค์ (Gold Exclusive)" },
  },
  {
    level: 4,
    requiredExp: 230,
    freeReward: { type: "food", id: "strawberry", amount: 2, icon: "🍓", name: "สตรอว์เบอร์รี x2" },
    goldReward: { type: "coins", amount: 100, icon: "💰", name: "100 เมล็ดทานตะวัน" },
  },
  {
    level: 5,
    requiredExp: 310,
    freeReward: { type: "exp", amount: 100, icon: "🌟", name: "100 Hamster EXP" },
    goldReward: { type: "food", id: "cheesecake", amount: 3, icon: "🧀", name: "ชีสเค้กเนียนนุ่ม x3" },
  },
  {
    level: 6,
    requiredExp: 400,
    freeReward: { type: "coins", amount: 50, icon: "🌻", name: "50 เมล็ดทานตะวัน" },
    goldReward: { type: "coins", amount: 120, icon: "💰", name: "120 เมล็ดทานตะวัน" },
  },
  {
    level: 7,
    requiredExp: 500,
    freeReward: { type: "food", id: "cheesecake", amount: 2, icon: "🧀", name: "ชีสเค้ก x2" },
    goldReward: { type: "exp", amount: 150, icon: "🌟", name: "150 Hamster EXP" },
  },
  {
    level: 8,
    requiredExp: 620,
    freeReward: { type: "coins", amount: 80, icon: "🌻", name: "80 เมล็ดทานตะวัน" },
    goldReward: { type: "coins", amount: 150, icon: "💰", name: "150 เมล็ดทานตะวัน" },
  },
  {
    level: 9,
    requiredExp: 750,
    freeReward: { type: "exp", amount: 200, icon: "🌟", name: "200 Hamster EXP" },
    goldReward: { type: "coins", amount: 200, icon: "💰", name: "200 เมล็ดทานตะวัน" },
  },
  {
    level: 10,
    requiredExp: 900,
    freeReward: { type: "item", id: "party_hat", category: "hat", icon: "🎉", name: "หมวกปาร์ตี้สายรุ้ง" },
    goldReward: { type: "item", id: "cloud_pajamas", category: "outfit", icon: "☁️", name: "ชุดนอนปุยเมฆแฟนซี (Season 1 Master)" },
  },
];

export const DAILY_QUEST_DEFS = [
  {
    id: "feed_twice",
    name: "ป้อนของอร่อยให้น้อง",
    desc: "ให้อาหารน้องเฮเว่น 2 ครั้ง",
    icon: "🥣",
    target: 2,
    passExpReward: 35,
    coinsReward: 15,
  },
  {
    id: "pet_thrice",
    name: "ลูบหัวส่งความรัก",
    desc: "ลูบหัวน้องเฮเว่น 3 ครั้ง",
    icon: "✋",
    target: 3,
    passExpReward: 30,
    coinsReward: 10,
  },
  {
    id: "clean_cage",
    name: "กรงสะอาดสดชื่น",
    desc: "ทำความสะอาดกรง 1 ครั้ง",
    icon: "🧹",
    target: 1,
    passExpReward: 30,
    coinsReward: 15,
  },
  {
    id: "spin_wheel",
    name: "นักวิ่งประจำวัน",
    desc: "เล่นมินิเกมปั่นวงล้อ 1 ครั้ง",
    icon: "🎡",
    target: 1,
    passExpReward: 40,
    coinsReward: 20,
  },
];

export const DAILY_STREAK_REWARDS = [
  { day: 1, name: "20 เมล็ดทานตะวัน", icon: "🌻", type: "coins", amount: 20 },
  { day: 2, name: "สตรอว์เบอร์รี x2", icon: "🍓", type: "food", id: "strawberry", amount: 2 },
  { day: 3, name: "50 เมล็ดทานตะวัน", icon: "🌻", type: "coins", amount: 50 },
  { day: 4, name: "100 Hamster EXP", icon: "🌟", type: "exp", amount: 100 },
  { day: 5, name: "80 เมล็ดทานตะวัน", icon: "🌻", type: "coins", amount: 80 },
  { day: 6, name: "ชีสเค้กเนียนนุ่ม x2", icon: "🧀", type: "food", id: "cheesecake", amount: 2 },
  { day: 7, name: "หมวกยูนิคอร์นสายรุ้ง 🦄", icon: "🦄", type: "item", id: "unicorn_hat", category: "hat" },
];
