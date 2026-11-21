// ==============================================================================
// 🐹 HEAVEN GAME STATE SERVICE — UPGRADED v2
// ==============================================================================
import { ref, onValue, set, get } from "firebase/database";
import { database, isFirebaseConfigured } from "../firebaseConfig";
import {
  INITIAL_GAME_STATE,
  FOOD_ITEMS,
  WARDROBE_ITEMS,
  HAPPY_QUOTES,
  ANGRY_QUOTES,
  SAD_QUOTES,
  ACHIEVEMENT_DEFS,
} from "../constants/gameData";
import { sound } from "../utils/audio";

const DB_NODE = "heaven_game";
const LOCAL_STORAGE_KEY = "heaven_game_state_v2";

class GameStateService {
  constructor() {
    this.currentState = this.loadInitialFromStorage();
    this.listeners = new Set();
    this.channel =
      typeof window !== "undefined" && window.BroadcastChannel
        ? new BroadcastChannel("heaven_game_channel")
        : null;
    this.decayInterval = null;
    this.newlyUnlockedAchievements = [];
    this.achievementListeners = new Set();
    this.init();
  }

  loadInitialFromStorage() {
    if (typeof window === "undefined") return { ...INITIAL_GAME_STATE };
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_GAME_STATE,
          ...parsed,
          equipped: { ...INITIAL_GAME_STATE.equipped, ...(parsed.equipped || {}) },
          inventory: Array.isArray(parsed.inventory) ? parsed.inventory : INITIAL_GAME_STATE.inventory,
          stats: { ...INITIAL_GAME_STATE.stats, ...(parsed.stats || {}) },
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
          speechBubble: { ...INITIAL_GAME_STATE.speechBubble, ...(parsed.speechBubble || {}) },
          announcement: { ...INITIAL_GAME_STATE.announcement, ...(parsed.announcement || {}) },
          seedRainEvent: { ...INITIAL_GAME_STATE.seedRainEvent, ...(parsed.seedRainEvent || {}) },
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return { ...INITIAL_GAME_STATE };
  }

  saveToStorage(state) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  init() {
    if (isFirebaseConfigured() && database) {
      const gameRef = ref(database, DB_NODE);
      get(gameRef).then((snapshot) => {
        if (!snapshot.exists()) {
          set(gameRef, { ...INITIAL_GAME_STATE });
        }
      }).catch(() => {});

      onValue(gameRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const merged = this.mergeState(val);
          this.applyIncomingState(merged, false);
        }
      }, () => {});
    }

    if (this.channel) {
      this.channel.onmessage = (event) => {
        if (event.data?.type === "STATE_UPDATE") {
          this.applyIncomingState(event.data.state, false);
        }
      };
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
          try {
            this.applyIncomingState(JSON.parse(e.newValue), false);
          } catch {}
        }
      });
    }

    this.startDecayTimer();
  }

  mergeState(val) {
    return {
      ...INITIAL_GAME_STATE,
      ...val,
      equipped: { ...INITIAL_GAME_STATE.equipped, ...(val.equipped || {}) },
      inventory: Array.isArray(val.inventory) ? val.inventory : INITIAL_GAME_STATE.inventory,
      stats: { ...INITIAL_GAME_STATE.stats, ...(val.stats || {}) },
      achievements: Array.isArray(val.achievements) ? val.achievements : [],
      speechBubble: { ...INITIAL_GAME_STATE.speechBubble, ...(val.speechBubble || {}) },
      announcement: { ...INITIAL_GAME_STATE.announcement, ...(val.announcement || {}) },
      seedRainEvent: { ...INITIAL_GAME_STATE.seedRainEvent, ...(val.seedRainEvent || {}) },
    };
  }

  applyIncomingState(newState, broadcast = true) {
    this.currentState = newState;
    this.saveToStorage(newState);
    this.notify();
    if (broadcast && this.channel) {
      this.channel.postMessage({ type: "STATE_UPDATE", state: newState });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.currentState);
    return () => this.listeners.delete(callback);
  }

  subscribeAchievement(callback) {
    this.achievementListeners.add(callback);
    return () => this.achievementListeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try { cb(this.currentState); } catch {}
    });
  }

  notifyAchievement(achievement) {
    this.achievementListeners.forEach((cb) => {
      try { cb(achievement); } catch {}
    });
  }

  async updateState(updater) {
    let nextState;
    if (typeof updater === "function") {
      nextState = updater(this.currentState);
    } else {
      nextState = { ...this.currentState, ...updater };
    }

    nextState.lastUpdated = Date.now();

    // Recalculate mood based on stats
    nextState.mood = this.calculateMood(nextState);

    // Check achievements
    nextState = this.checkAchievements(nextState);

    this.currentState = nextState;
    this.saveToStorage(nextState);
    this.notify();

    if (this.channel) {
      this.channel.postMessage({ type: "STATE_UPDATE", state: nextState });
    }

    if (isFirebaseConfigured() && database) {
      try {
        const gameRef = ref(database, DB_NODE);
        await set(gameRef, nextState);
      } catch {}
    }
  }

  // ==============================================================================
  // 🌡️ MOOD ENGINE
  // ==============================================================================
  calculateMood(state) {
    const { hunger, happiness, cleanliness, energy, poopCount } = state;
    const avg = (hunger + happiness + cleanliness + energy) / 4;

    if (poopCount >= 3 || cleanliness < 20) return "angry";
    if (hunger < 15 || energy < 10) return "sick";
    if (happiness < 25 || avg < 30) return "sad";
    if (happiness > 85 && avg > 75) return "excited";
    if (avg > 60) return "happy";
    return "neutral";
  }

  // ==============================================================================
  // 🏆 ACHIEVEMENT ENGINE
  // ==============================================================================
  checkAchievements(state) {
    const unearned = ACHIEVEMENT_DEFS.filter(
      (def) => !state.achievements.includes(def.id)
    );

    const newlyEarned = unearned.filter((def) => {
      try {
        return def.check(state.stats || {}, state);
      } catch {
        return false;
      }
    });

    if (newlyEarned.length > 0) {
      newlyEarned.forEach((ach) => {
        sound.playLevelUp();
        setTimeout(() => this.notifyAchievement(ach), 300);
      });
      return {
        ...state,
        achievements: [...state.achievements, ...newlyEarned.map((a) => a.id)],
      };
    }

    return state;
  }

  // ==============================================================================
  // ⏱️ DECAY TIMER
  // ==============================================================================
  startDecayTimer() {
    if (this.decayInterval) clearInterval(this.decayInterval);

    this.decayInterval = setInterval(() => {
      const now = Date.now();
      const last = this.currentState.lastDecayTime || now;
      const elapsedSeconds = Math.max(0, (now - last) / 1000);
      if (elapsedSeconds < 10) return;

      this.updateState((prev) => {
        let { hunger, happiness, cleanliness, energy, poopCount, isSleeping } = prev;

        if (isSleeping) {
          energy = Math.min(100, energy + elapsedSeconds * 0.15);
          hunger = Math.max(0, hunger - elapsedSeconds * 0.03);
          cleanliness = Math.max(0, cleanliness - elapsedSeconds * 0.02);
        } else {
          hunger = Math.max(0, hunger - elapsedSeconds * 0.08);
          happiness = Math.max(0, happiness - elapsedSeconds * 0.06);
          cleanliness = Math.max(0, cleanliness - elapsedSeconds * 0.05);
          energy = Math.max(0, energy - elapsedSeconds * 0.07);

          if (cleanliness < 60 && poopCount < 4 && Math.random() < 0.15) {
            poopCount = Math.min(5, poopCount + 1);
            cleanliness = Math.max(0, cleanliness - 15);
          }
        }

        let actionState = prev.actionState;
        if (prev.actionExpiry && now > prev.actionExpiry) {
          actionState = isSleeping ? "sleeping" : (cleanliness < 40 || poopCount > 1 ? "dirty" : "idle");
        }

        return {
          ...prev,
          hunger: Math.round(hunger),
          happiness: Math.round(happiness),
          cleanliness: Math.round(cleanliness),
          energy: Math.round(energy),
          poopCount,
          actionState,
          lastDecayTime: now,
        };
      });
    }, 15000);
  }

  // ==============================================================================
  // 🎮 PLAYER ACTIONS
  // ==============================================================================
  feed(foodItem = FOOD_ITEMS[0]) {
    sound.playEat();
    return this.updateState((prev) => {
      if (prev.coins < foodItem.cost) return prev;
      const hunger = Math.min(100, prev.hunger + foodItem.hunger);
      const happiness = Math.min(100, prev.happiness + foodItem.happiness);
      const coins = prev.coins - foodItem.cost;
      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + foodItem.exp, prev.level, prev.maxExp);
      const newStats = { ...prev.stats, totalFed: (prev.stats?.totalFed || 0) + 1, totalCoinsEarned: (prev.stats?.totalCoinsEarned || 0) };

      let newPoop = prev.poopCount;
      if (Math.random() < 0.3 && newPoop < 4) newPoop += 1;
      if (leveledUp) sound.playLevelUp();

      return {
        ...prev,
        hunger, happiness, coins, exp, level, maxExp,
        poopCount: newPoop,
        stats: newStats,
        actionState: "eating",
        actionExpiry: Date.now() + 2500,
        speechBubble: leveledUp
          ? { text: `เย้ๆ! เลเวลอัปเป็น Lv.${level} แล้วจ้า! 🎉✨`, timestamp: Date.now(), duration: 5000 }
          : { text: `งั่มๆ! ${foodItem.name} อร่อยม๊ากกกก 😋`, timestamp: Date.now(), duration: 3500 },
      };
    });
  }

  quickFeed() {
    // Double-tap quick feed — ให้อาหารเม็ดพื้นฐาน +10 hunger ทันที
    sound.playEat();
    return this.updateState((prev) => {
      const newStats = { ...prev.stats, totalFed: (prev.stats?.totalFed || 0) + 1 };
      return {
        ...prev,
        hunger: Math.min(100, prev.hunger + 10),
        exp: Math.min(prev.maxExp - 1, prev.exp + 2),
        stats: newStats,
        actionState: "eating",
        actionExpiry: Date.now() + 1500,
        speechBubble: { text: "อ้าวของกิน! จิ้มๆ ขอบคุณงับ 🥣⚡", timestamp: Date.now(), duration: 2500 },
      };
    });
  }

  pet() {
    sound.playPet();
    return this.updateState((prev) => {
      const happiness = Math.min(100, prev.happiness + 8);
      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + 3, prev.level, prev.maxExp);
      const newStats = { ...prev.stats, totalPets: (prev.stats?.totalPets || 0) + 1 };
      if (leveledUp) sound.playLevelUp();
      const randomQuote = HAPPY_QUOTES[Math.floor(Math.random() * HAPPY_QUOTES.length)];
      return {
        ...prev,
        happiness, exp, level, maxExp,
        stats: newStats,
        actionState: "petting",
        actionExpiry: Date.now() + 1800,
        speechBubble: { text: randomQuote, timestamp: Date.now(), duration: 3500 },
      };
    });
  }

  cleanCage() {
    sound.playClean();
    return this.updateState((prev) => {
      const cleanedPoops = prev.poopCount;
      const rewardCoins = cleanedPoops * 5 + 2;
      const rewardExp = cleanedPoops * 8 + 5;
      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + rewardExp, prev.level, prev.maxExp);
      const newStats = {
        ...prev.stats,
        totalCleans: (prev.stats?.totalCleans || 0) + 1,
        totalCoinsEarned: (prev.stats?.totalCoinsEarned || 0) + rewardCoins,
      };
      if (leveledUp) sound.playLevelUp();
      sound.playCoin();
      return {
        ...prev,
        cleanliness: 100, poopCount: 0,
        coins: prev.coins + rewardCoins,
        exp, level, maxExp,
        stats: newStats,
        actionState: "happy",
        actionExpiry: Date.now() + 2500,
        speechBubble: {
          text: `ว้าวววกรงสะอาดวิ้งค์เลย! ได้รับ ${rewardCoins} เมล็ดทานตะวัน 🌻✨`,
          timestamp: Date.now(), duration: 4000,
        },
      };
    });
  }

  toggleSleep() {
    sound.playClick();
    return this.updateState((prev) => {
      const nextSleeping = !prev.isSleeping;
      return {
        ...prev,
        isSleeping: nextSleeping,
        actionState: nextSleeping ? "sleeping" : "idle",
        speechBubble: nextSleeping
          ? { text: "ปิดไฟแล้ว... ฝันดีนะงับ ฟี้~ 💤", timestamp: Date.now(), duration: 3000 }
          : { text: "ตื่นแล้วจ้า! สดชื่นสุดๆ พร้อมวิ่งเล่นแล้ว ☀️🐹", timestamp: Date.now(), duration: 3500 },
      };
    });
  }

  rewardMiniGame(earnedCoins, earnedExp) {
    sound.playCoin();
    return this.updateState((prev) => {
      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + earnedExp, prev.level, prev.maxExp);
      if (leveledUp) sound.playLevelUp();
      const newStats = {
        ...prev.stats,
        miniGamesPlayed: (prev.stats?.miniGamesPlayed || 0) + 1,
        totalCoinsEarned: (prev.stats?.totalCoinsEarned || 0) + earnedCoins,
      };
      return {
        ...prev,
        coins: prev.coins + earnedCoins,
        exp, level, maxExp,
        energy: Math.max(10, prev.energy - 15),
        happiness: Math.min(100, prev.happiness + 20),
        stats: newStats,
        actionState: "happy",
        actionExpiry: Date.now() + 2500,
        speechBubble: {
          text: `ปั่นวงล้อสนุกมากกก! ได้มา ${earnedCoins} เมล็ดทานตะวันเลยงับ 🏃‍♂️💨`,
          timestamp: Date.now(), duration: 4000,
        },
      };
    });
  }

  buyItem(itemId) {
    const item = WARDROBE_ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    return this.updateState((prev) => {
      if (prev.inventory.includes(itemId)) return prev;
      if (prev.coins < item.cost) return prev;
      sound.playCoin();
      return {
        ...prev,
        coins: prev.coins - item.cost,
        inventory: [...prev.inventory, itemId],
        speechBubble: { text: `เย้! ได้ ${item.name} มาใส่แล้ว ดีใจจังเลย! 🛍️✨`, timestamp: Date.now(), duration: 3500 },
      };
    });
  }

  toggleEquip(type, itemId) {
    sound.playClick();
    return this.updateState((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [type]: prev.equipped[type] === itemId ? null : itemId,
      },
    }));
  }

  collectRainSeed() {
    sound.playCoin();
    return this.updateState((prev) => ({
      ...prev,
      coins: prev.coins + 5,
      stats: { ...prev.stats, totalCoinsEarned: (prev.stats?.totalCoinsEarned || 0) + 5 },
    }));
  }

  dismissAnnouncement() {
    return this.updateState((prev) => ({
      ...prev,
      announcement: { ...prev.announcement, active: false },
    }));
  }

  stopSeedRain() {
    return this.updateState((prev) => ({
      ...prev,
      seedRainEvent: { ...prev.seedRainEvent, active: false },
    }));
  }

  // ==============================================================================
  // 👑 ADMIN / GM COMMANDS
  // ==============================================================================
  adminAddCoins(amount) {
    sound.playCoin();
    return this.updateState((prev) => ({
      ...prev,
      coins: prev.coins + amount,
      stats: { ...prev.stats, totalCoinsEarned: (prev.stats?.totalCoinsEarned || 0) + amount },
      speechBubble: { text: `ได้รับเงินอั่งเปาจาก GM +${amount} เมล็ดทานตะวัน! 🌻💰`, timestamp: Date.now(), duration: 4000 },
    }));
  }

  adminAddExp(amount) {
    return this.updateState((prev) => {
      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + amount, prev.level, prev.maxExp);
      if (leveledUp) sound.playLevelUp();
      return {
        ...prev, exp, level, maxExp,
        speechBubble: { text: `GM เพิ่มค่าประสบการณ์ให้ +${amount} EXP! 🌟`, timestamp: Date.now(), duration: 4000 },
      };
    });
  }

  adminLevelUp() {
    sound.playLevelUp();
    return this.updateState((prev) => {
      const newLevel = prev.level + 1;
      return {
        ...prev, level: newLevel, exp: 0, maxExp: newLevel * 100,
        speechBubble: { text: `GM สั่งอัปเลเวลทันที! พุ่งสู่ Lv.${newLevel} แว้ววว 🚀✨`, timestamp: Date.now(), duration: 5000 },
      };
    });
  }

  adminHealAll() {
    sound.playClean();
    return this.updateState((prev) => ({
      ...prev,
      hunger: 100, happiness: 100, cleanliness: 100, energy: 100, poopCount: 0,
      actionState: "happy", actionExpiry: Date.now() + 3000,
      speechBubble: { text: "โอ้โหหห! GM ร่ายมนตร์ฟื้นฟูเต็ม 100% ทุกหลอด รู้สึกดีสุดๆ ไปเลย! 💖✨", timestamp: Date.now(), duration: 4500 },
    }));
  }

  adminPrank() {
    sound.playPrank();
    return this.updateState((prev) => ({
      ...prev,
      cleanliness: 20,
      happiness: Math.max(10, prev.happiness - 30),
      poopCount: 3,
      actionState: "dirty",
      actionExpiry: Date.now() + 4000,
      speechBubble: { text: "แงงงง! GM แกล้งปล่อยอึเต็มกรงเลย ช่วยเค้าเก็บทีน้าาา 💩🥺", timestamp: Date.now(), duration: 5000 },
    }));
  }

  adminGiveSecretItem(itemId = "hoodie_special") {
    sound.playLevelUp();
    const item = WARDROBE_ITEMS.find((i) => i.id === itemId);
    const itemName = item ? item.name : "ไอเทมลับ";
    return this.updateState((prev) => {
      const currentInv = prev.inventory || [];
      const newInv = currentInv.includes(itemId) ? currentInv : [...currentInv, itemId];
      return {
        ...prev,
        inventory: newInv,
        equipped: { ...prev.equipped, outfit: itemId },
        speechBubble: { text: `กรี๊ดดด! GM ส่งกล่องของขวัญลับ '${itemName}' มาให้ถึงตู้เสื้อผ้าเลย! 🎁✨`, timestamp: Date.now(), duration: 5000 },
        announcement: {
          id: Date.now(),
          title: "🎁 คุณได้รับไอเทมพิเศษจาก GM!",
          message: `GM ได้ส่ง '${itemName}' เข้าสู่ตู้เสื้อผ้าของคุณเรียบร้อยแล้ว ลองเข้าไปดูในตู้เสื้อผ้าได้เลยนะ!`,
          active: true, timestamp: Date.now(),
        },
      };
    });
  }

  adminSendSpeech(text) {
    if (!text?.trim()) return;
    sound.playNotification();
    return this.updateState((prev) => ({
      ...prev,
      speechBubble: { text: text.trim(), timestamp: Date.now(), duration: 7000 },
    }));
  }

  adminSendAnnouncement(title, message) {
    if (!title || !message) return;
    sound.playNotification();
    return this.updateState((prev) => ({
      ...prev,
      announcement: { id: Date.now(), title: title.trim(), message: message.trim(), active: true, timestamp: Date.now() },
    }));
  }

  adminTriggerSeedRain() {
    sound.playNotification();
    return this.updateState((prev) => ({
      ...prev,
      seedRainEvent: { id: Date.now(), active: true, timestamp: Date.now() },
      speechBubble: { text: "ฝนเมล็ดทานตะวันตกลงมาแล้ววว! รีบจิ้มเก็บกันเร็วพวกเรา! 🌻🌧️", timestamp: Date.now(), duration: 5000 },
    }));
  }

  adminResetGame() {
    return this.updateState(() => ({ ...INITIAL_GAME_STATE, lastDecayTime: Date.now(), lastUpdated: Date.now() }));
  }

  // ==============================================================================
  // 📈 EXP & LEVEL
  // ==============================================================================
  calculateExp(currentExp, currentLevel, currentMaxExp) {
    let exp = currentExp;
    let level = currentLevel;
    let maxExp = currentMaxExp || level * 100;
    let leveledUp = false;

    while (exp >= maxExp) {
      exp -= maxExp;
      level += 1;
      maxExp = level * 100;
      leveledUp = true;
    }

    return { exp, level, maxExp, leveledUp };
  }
}

export const gameStateService = new GameStateService();
