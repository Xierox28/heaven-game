// ==============================================================================
// 🐹 HEAVEN GAME STATE SERVICE — WITH 10S ENERGY RECHARGE & STRICT CLAIM GUARDS
// ==============================================================================
import { ref, onValue, set, get } from "firebase/database";
import { database, isFirebaseConfigured } from "../firebaseConfig";
import { authService } from "./authService";
import {
  INITIAL_GAME_STATE,
  FOOD_ITEMS,
  WARDROBE_ITEMS,
  HAPPY_QUOTES,
  ACHIEVEMENT_DEFS,
} from "../constants/gameData";
import { FURNITURE_ITEMS, MYSTERY_BOXES } from "../constants/furnitureData";
import { sound } from "../utils/audio";

class GameStateService {
  constructor() {
    this.currentUser = authService.currentUser;
    this.currentState = this.loadInitialFromStorage();
    this.listeners = new Set();
    this.achievementListeners = new Set();
    this.channel =
      typeof window !== "undefined" && window.BroadcastChannel
        ? new BroadcastChannel("heaven_game_channel")
        : null;
    this.decayInterval = null;
    this.sleepRechargeInterval = null;
    this.unsubFirebase = null;
    this.unsubGlobal = null;

    authService.subscribe((user) => {
      this.bindUser(user);
    });

    this.init();
  }

  getStorageKey() {
    return this.currentUser
      ? `heaven_game_state_user_${this.currentUser.username}`
      : "heaven_game_state_guest";
  }

  getDbPath() {
    return this.currentUser
      ? `players/${this.currentUser.username}/hamster`
      : "heaven_game";
  }

  loadInitialFromStorage() {
    if (typeof window === "undefined") return { ...INITIAL_GAME_STATE };
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.mergeState(parsed);
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return {
      ...INITIAL_GAME_STATE,
      name: this.currentUser?.hamsterName || INITIAL_GAME_STATE.name,
    };
  }

  saveToStorage(state) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(state));
    } catch {}
  }

  mergeState(val) {
    return {
      ...INITIAL_GAME_STATE,
      ...val,
      name: val?.name || this.currentUser?.hamsterName || INITIAL_GAME_STATE.name,
      equipped: { ...INITIAL_GAME_STATE.equipped, ...(val?.equipped || {}) },
      inventory: Array.isArray(val?.inventory) ? val.inventory : INITIAL_GAME_STATE.inventory,
      stats: { ...INITIAL_GAME_STATE.stats, ...(val?.stats || {}) },
      achievements: Array.isArray(val?.achievements) ? val.achievements : [],
      pass: { ...INITIAL_GAME_STATE.pass, ...(val?.pass || {}) },
      streak: { ...INITIAL_GAME_STATE.streak, ...(val?.streak || {}) },
      speechBubble: { ...INITIAL_GAME_STATE.speechBubble, ...(val?.speechBubble || {}) },
      announcement: { ...INITIAL_GAME_STATE.announcement, ...(val?.announcement || {}) },
      seedRainEvent: { ...INITIAL_GAME_STATE.seedRainEvent, ...(val?.seedRainEvent || {}) },
      furniture: {
        equipped: {
          ...INITIAL_GAME_STATE.furniture.equipped,
          ...(val?.furniture?.equipped || {}),
        },
        inventory: Array.isArray(val?.furniture?.inventory)
          ? val.furniture.inventory
          : INITIAL_GAME_STATE.furniture.inventory,
      },
    };
  }

  bindUser(user) {
    this.currentUser = user;
    if (this.unsubFirebase) {
      this.unsubFirebase();
      this.unsubFirebase = null;
    }

    // โหลดข้อมูลที่มีอยู่ของบัญชีนี้
    let loadedState = this.loadInitialFromStorage();

    // กฎป้องกันเลเวลลด/ข้อมูลหาย: ถ้าผู้ใช้ใหม่เพิ่งสมัครแล้วในเครื่องมีข้อมูลเดิม (Guest) ที่มีเลเวล > 1 หรือมีของ/เหรียญ
    // ให้นำความก้าวหน้านั้นย้ายมาเป็นของบัญชีใหม่ทันที เลเวลจะได้ไม่ลดลงเหลือ 1
    if (this.currentState && (this.currentState.level > 1 || this.currentState.coins > 60 || this.currentState.exp > 0)) {
      if (!loadedState || (loadedState.level <= 1 && loadedState.coins <= 60 && loadedState.exp === 0)) {
        loadedState = {
          ...this.currentState,
          name: user?.hamsterName || this.currentState.name,
          lastUpdated: Date.now(),
        };
        this.saveToStorage(loadedState);
      }
    }

    this.currentState = loadedState;
    if (user && user.hamsterName) {
      this.currentState.name = user.hamsterName;
    }
    this.notify();
    this.initFirebase();
  }

  init() {
    this.initFirebase();

    if (this.channel) {
      this.channel.onmessage = (event) => {
        if (event.data?.type === "STATE_UPDATE" && event.data.state) {
          this.applyIncomingState(event.data.state, false);
        }
      };
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === this.getStorageKey() && e.newValue) {
          try {
            this.applyIncomingState(JSON.parse(e.newValue), false);
          } catch {}
        }
      });
    }

    this.startDecayTimer();
    if (this.currentState.isSleeping) {
      this.startSleepRecharge();
    }
  }

  initFirebase() {
    if (!isFirebaseConfigured() || !database) return;

    const dbPath = this.getDbPath();
    const gameRef = ref(database, dbPath);

    get(gameRef).then((snapshot) => {
      if (!snapshot.exists()) {
        const initData = {
          ...this.currentState,
          name: this.currentUser?.hamsterName || this.currentState.name,
          lastUpdated: Date.now(),
        };
        set(gameRef, initData);
        this.updateLeaderboard(initData);
      }
    }).catch(() => {});

    this.unsubFirebase = onValue(gameRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Timestamp Guard: ป้องกันข้อมูลเก่ากว่ามาเขียนทับ
        if (this.currentState?.lastUpdated && val.lastUpdated && val.lastUpdated < this.currentState.lastUpdated) {
          return;
        }
        const merged = this.mergeState(val);
        this.applyIncomingState(merged, false);
      }
    }, () => {});

    const globalRef = ref(database, "global_events");
    this.unsubGlobal = onValue(globalRef, (snapshot) => {
      const g = snapshot.val();
      if (g) {
        this.updateState((prev) => ({
          ...prev,
          announcement: g.announcement ? { ...prev.announcement, ...g.announcement } : prev.announcement,
          seedRainEvent: g.seedRainEvent ? { ...prev.seedRainEvent, ...g.seedRainEvent } : prev.seedRainEvent,
          speechBubble: g.globalSpeech && Date.now() - g.globalSpeech.timestamp < 10000
            ? g.globalSpeech
            : prev.speechBubble,
        }));
      }
    }, () => {});
  }

  updateLeaderboard(state) {
    if (!isFirebaseConfigured() || !database) return;
    const username = this.currentUser?.username || "guest";
    const lbRef = ref(database, `leaderboard/${username}`);
    set(lbRef, {
      username,
      hamsterName: state.name || this.currentUser?.hamsterName || "น้องเฮเว่น",
      level: state.level || 1,
      coins: state.coins || 0,
      happiness: state.happiness || 85,
      passExp: state.pass?.exp || 0,
      updatedAt: Date.now(),
    }).catch(() => {});
  }

  applyIncomingState(newState, broadcast = true) {
    if (!newState) return;

    // 1. Timestamp Guard: ถ้าข้อมูลที่ได้รับมี lastUpdated เก่ากว่าของปัจจุบัน ไม่ยอมให้เขียนทับ
    if (this.currentState?.lastUpdated && newState.lastUpdated && newState.lastUpdated < this.currentState.lastUpdated) {
      return;
    }

    // 2. Strict Level Monotonic Guard: ป้องกันเลเวลลดลงเองโดยเด็ดขาด!
    const currentLevel = Math.max(1, Number(this.currentState?.level) || 1);
    const incomingLevel = Math.max(1, Number(newState.level) || 1);
    const finalLevel = Math.max(currentLevel, incomingLevel);
    const finalMaxExp = finalLevel * 100;

    const validatedState = {
      ...newState,
      level: finalLevel,
      maxExp: finalMaxExp,
      coins: Math.max(0, newState.coins ?? this.currentState?.coins ?? 60),
    };

    this.currentState = validatedState;
    this.saveToStorage(validatedState);
    this.notify();
    if (broadcast && this.channel) {
      this.channel.postMessage({ type: "STATE_UPDATE", state: validatedState });
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
    nextState.mood = this.calculateMood(nextState);
    nextState = this.checkAchievements(nextState);

    this.currentState = nextState;
    this.saveToStorage(nextState);
    this.notify();

    if (this.channel) {
      this.channel.postMessage({ type: "STATE_UPDATE", state: nextState });
    }

    if (isFirebaseConfigured() && database) {
      try {
        const gameRef = ref(database, this.getDbPath());
        await set(gameRef, nextState);
        this.updateLeaderboard(nextState);
      } catch {}
    }
  }

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

  checkAchievements(state) {
    const unearned = ACHIEVEMENT_DEFS.filter(
      (def) => !state.achievements.includes(def.id)
    );

    const newlyEarned = unearned.filter((def) => {
      try { return def.check(state.stats || {}, state); } catch { return false; }
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
  // ⚡ 10-SECOND SLEEP ENERGY RECHARGE SYSTEM
  // ==============================================================================
  startSleepRecharge() {
    if (this.sleepRechargeInterval) clearInterval(this.sleepRechargeInterval);

    // ทำงานทุกๆ 1 วินาที เติมพลังงาน +10% (หรือเร็วกว่านั้นหากมีบัฟบ้านไม้/ที่นอน)
    this.sleepRechargeInterval = setInterval(() => {
      if (!this.currentState.isSleeping) {
        clearInterval(this.sleepRechargeInterval);
        this.sleepRechargeInterval = null;
        return;
      }

      const currentEnergy = this.currentState.energy || 0;
      if (currentEnergy >= 100) return;

      // คำนวณบัฟจากบ้านไม้/ที่นอนที่ติดตั้ง
      const equippedHouse = this.currentState.furniture?.equipped?.house;
      const houseDef = FURNITURE_ITEMS.find((f) => f.id === equippedHouse);
      const regenBonus = houseDef?.perk?.energyRegenBonus || 0;
      const chargeAmount = Math.round(10 * (1 + regenBonus));

      const newEnergy = Math.min(100, currentEnergy + chargeAmount);
      const isNowFull = newEnergy === 100 && currentEnergy < 100;

      this.updateState((prev) => ({
        ...prev,
        energy: newEnergy,
        speechBubble: isNowFull
          ? { text: "พลังงานชาร์จเต็ม 100% แล้ว พร้อมตื่นแล้วงับ! ⚡☀️", timestamp: Date.now(), duration: 4000 }
          : prev.speechBubble,
      }));

      if (isNowFull) {
        sound.playLevelUp();
      }
    }, 1000);
  }

  stopSleepRecharge() {
    if (this.sleepRechargeInterval) {
      clearInterval(this.sleepRechargeInterval);
      this.sleepRechargeInterval = null;
    }
  }

  startDecayTimer() {
    if (this.decayInterval) clearInterval(this.decayInterval);

    this.decayInterval = setInterval(() => {
      const now = Date.now();
      const last = this.currentState.lastDecayTime || now;
      const elapsedSeconds = Math.max(0, (now - last) / 1000);
      if (elapsedSeconds < 10) return;

      this.updateState((prev) => {
        let { hunger, happiness, cleanliness, energy, poopCount, isSleeping } = prev;

        // คำนวณบัฟจากของเล่นและพรมปูพื้น
        const equippedToy = prev.furniture?.equipped?.toy;
        const toyDef = FURNITURE_ITEMS.find((f) => f.id === equippedToy);
        const happyDecayReduction = toyDef?.perk?.happinessDecayReduction || 0;

        const equippedRug = prev.furniture?.equipped?.rug;
        const rugDef = FURNITURE_ITEMS.find((f) => f.id === equippedRug);
        const cleanDecayReduction = rugDef?.perk?.cleanDecayReduction || 0;

        if (isSleeping) {
          // พลังงานเติมเร็ว 10 วินาทีเต็ม (+10 ต่อวินาที)
          energy = Math.min(100, energy + elapsedSeconds * 10);
          hunger = Math.max(0, hunger - elapsedSeconds * 0.03);
          cleanliness = Math.max(0, cleanliness - elapsedSeconds * 0.02 * (1 - cleanDecayReduction));
        } else {
          hunger = Math.max(0, hunger - elapsedSeconds * 0.08);
          happiness = Math.max(0, happiness - elapsedSeconds * 0.06 * (1 - happyDecayReduction));
          cleanliness = Math.max(0, cleanliness - elapsedSeconds * 0.05 * (1 - cleanDecayReduction));
          energy = Math.max(0, energy - elapsedSeconds * 0.07);

          const poopChance = 0.15 * (1 - cleanDecayReduction);
          if (cleanliness < 60 && poopCount < 4 && Math.random() < poopChance) {
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
  // ACTIONS (WITH DAILY QUEST PROGRESSION)
  // ==============================================================================
  feed(foodItem = FOOD_ITEMS[0]) {
    sound.playEat();
    return this.updateState((prev) => {
      if (prev.coins < foodItem.cost) return prev;
      const hunger = Math.min(100, prev.hunger + foodItem.hunger);
      const happiness = Math.min(100, prev.happiness + foodItem.happiness);
      const coins = prev.coins - foodItem.cost;
      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + foodItem.exp, prev.level, prev.maxExp);
      const newStats = { ...prev.stats, totalFed: (prev.stats?.totalFed || 0) + 1 };

      let newPoop = prev.poopCount;
      if (Math.random() < 0.3 && newPoop < 4) newPoop += 1;
      if (leveledUp) sound.playLevelUp();

      const newDailyProgress = {
        ...(prev.pass?.dailyProgress || {}),
        feed_twice: ((prev.pass?.dailyProgress?.feed_twice || 0) + 1),
      };

      return {
        ...prev,
        hunger, happiness, coins, exp, level, maxExp,
        poopCount: newPoop,
        stats: newStats,
        pass: {
          ...(prev.pass || {}),
          dailyProgress: newDailyProgress,
        },
        actionState: "eating",
        actionExpiry: Date.now() + 2500,
        speechBubble: leveledUp
          ? { text: `เย้ๆ! เลเวลอัปเป็น Lv.${level} แล้วจ้า! 🎉✨`, timestamp: Date.now(), duration: 5000 }
          : { text: `งั่มๆ! ${foodItem.name} อร่อยม๊ากกกก 😋`, timestamp: Date.now(), duration: 3500 },
      };
    });
  }

  quickFeed() {
    sound.playEat();
    return this.updateState((prev) => {
      const newStats = { ...prev.stats, totalFed: (prev.stats?.totalFed || 0) + 1 };
      const newDailyProgress = {
        ...(prev.pass?.dailyProgress || {}),
        feed_twice: ((prev.pass?.dailyProgress?.feed_twice || 0) + 1),
      };

      return {
        ...prev,
        hunger: Math.min(100, prev.hunger + 10),
        exp: Math.min(prev.maxExp - 1, prev.exp + 2),
        stats: newStats,
        pass: {
          ...(prev.pass || {}),
          dailyProgress: newDailyProgress,
        },
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

      const newDailyProgress = {
        ...(prev.pass?.dailyProgress || {}),
        pet_thrice: ((prev.pass?.dailyProgress?.pet_thrice || 0) + 1),
      };

      return {
        ...prev,
        happiness, exp, level, maxExp,
        stats: newStats,
        pass: {
          ...(prev.pass || {}),
          dailyProgress: newDailyProgress,
        },
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

      const newDailyProgress = {
        ...(prev.pass?.dailyProgress || {}),
        clean_cage: ((prev.pass?.dailyProgress?.clean_cage || 0) + 1),
      };

      return {
        ...prev,
        cleanliness: 100, poopCount: 0,
        coins: prev.coins + rewardCoins,
        exp, level, maxExp,
        stats: newStats,
        pass: {
          ...(prev.pass || {}),
          dailyProgress: newDailyProgress,
        },
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

      if (nextSleeping) {
        this.startSleepRecharge();
      } else {
        this.stopSleepRecharge();
      }

      return {
        ...prev,
        isSleeping: nextSleeping,
        actionState: nextSleeping ? "sleeping" : "idle",
        speechBubble: nextSleeping
          ? { text: "ปิดไฟแล้ว... กำลังชาร์จพลังงาน 10 วิเต็มงับ! 💤⚡", timestamp: Date.now(), duration: 3500 }
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

      const newDailyProgress = {
        ...(prev.pass?.dailyProgress || {}),
        spin_wheel: ((prev.pass?.dailyProgress?.spin_wheel || 0) + 1),
      };

      return {
        ...prev,
        coins: prev.coins + earnedCoins,
        exp, level, maxExp,
        energy: Math.max(10, prev.energy - 15),
        happiness: Math.min(100, prev.happiness + 20),
        stats: newStats,
        pass: {
          ...(prev.pass || {}),
          dailyProgress: newDailyProgress,
        },
        actionState: "happy",
        actionExpiry: Date.now() + 2500,
        speechBubble: {
          text: `ปั่นวงล้อสนุกมากกก! ได้มา ${earnedCoins} เมล็ดทานตะวันเลยงับ 🏃‍♂️💨`,
          timestamp: Date.now(), duration: 4000,
        },
      };
    });
  }

  // ==============================================================================
  // 🎟️ HAMSTER PASS & STREAK CLAIM HANDLERS (WITH STRICT DUPLICATION GUARDS)
  // ==============================================================================
  unlockGoldPass() {
    if (this.currentState.coins < 200) return;
    if (this.currentState.pass?.hasGoldPass) return; // มีอยู่แล้ว
    sound.playLevelUp();
    return this.updateState((prev) => ({
      ...prev,
      coins: prev.coins - 200,
      pass: {
        ...(prev.pass || {}),
        hasGoldPass: true,
      },
      speechBubble: {
        text: "เย้ๆๆ! ปลดล็อค Gold Pass แล้วจ้า! พร้อมรับของพรีเมียมเพียบ! 🌟🎟️",
        timestamp: Date.now(),
        duration: 5000,
      },
    }));
  }

  claimFreePass(levelToClaim, reward) {
    // ป้องกันรับซ้ำ
    if (this.currentState.pass?.claimedFree?.includes(levelToClaim)) return;

    sound.playCoin();
    return this.updateState((prev) => {
      if (prev.pass?.claimedFree?.includes(levelToClaim)) return prev;

      let coins = prev.coins;
      let exp = prev.exp;
      let level = prev.level;
      let maxExp = prev.maxExp || level * 100;
      let inv = prev.inventory || [];

      if (reward.type === "coins") coins += reward.amount;
      if (reward.type === "exp") {
        const res = this.calculateExp(exp + reward.amount, level, maxExp);
        exp = res.exp;
        level = res.level;
        maxExp = res.maxExp;
        if (res.leveledUp) sound.playLevelUp();
      }
      if (reward.type === "item" && !inv.includes(reward.id)) inv = [...inv, reward.id];

      return {
        ...prev,
        coins,
        exp,
        level,
        maxExp,
        inventory: inv,
        pass: {
          ...(prev.pass || {}),
          claimedFree: [...(prev.pass?.claimedFree || []), levelToClaim],
        },
      };
    });
  }

  claimGoldPass(levelToClaim, reward) {
    if (!this.currentState.pass?.hasGoldPass) return;
    // ป้องกันรับซ้ำ
    if (this.currentState.pass?.claimedGold?.includes(levelToClaim)) return;

    sound.playCoin();
    return this.updateState((prev) => {
      if (prev.pass?.claimedGold?.includes(levelToClaim)) return prev;

      let coins = prev.coins;
      let exp = prev.exp;
      let level = prev.level;
      let maxExp = prev.maxExp || level * 100;
      let inv = prev.inventory || [];

      if (reward.type === "coins") coins += reward.amount;
      if (reward.type === "exp") {
        const res = this.calculateExp(exp + reward.amount, level, maxExp);
        exp = res.exp;
        level = res.level;
        maxExp = res.maxExp;
        if (res.leveledUp) sound.playLevelUp();
      }
      if (reward.type === "item" && !inv.includes(reward.id)) inv = [...inv, reward.id];

      return {
        ...prev,
        coins,
        exp,
        level,
        maxExp,
        inventory: inv,
        pass: {
          ...(prev.pass || {}),
          claimedGold: [...(prev.pass?.claimedGold || []), levelToClaim],
        },
      };
    });
  }

  claimQuest(questId, passExpReward, coinsReward) {
    // ป้องกันรับซ้ำ
    if (this.currentState.pass?.claimedQuests?.includes(questId)) return;

    sound.playCoin();
    return this.updateState((prev) => {
      if (prev.pass?.claimedQuests?.includes(questId)) return prev;

      const currentPassExp = (prev.pass?.exp || 0) + passExpReward;
      const claimed = [...(prev.pass?.claimedQuests || []), questId];

      return {
        ...prev,
        coins: prev.coins + coinsReward,
        pass: {
          ...(prev.pass || {}),
          exp: currentPassExp,
          claimedQuests: claimed,
        },
        speechBubble: {
          text: `ทำเควสต์สำเร็จ! +${passExpReward} Pass EXP และ +${coinsReward} 🌻`,
          timestamp: Date.now(),
          duration: 3500,
        },
      };
    });
  }

  claimDailyStreak(item) {
    const todayStr = new Date().toDateString();
    // ป้องกันรับซ้ำในวันเดียวกัน หรือรับเลเวลเดิมซ้ำ
    if (this.currentState.streak?.lastClaimDate === todayStr) return;
    if (this.currentState.streak?.claimedDays?.includes(item.day)) return;

    sound.playLevelUp();
    return this.updateState((prev) => {
      if (prev.streak?.lastClaimDate === todayStr || prev.streak?.claimedDays?.includes(item.day)) {
        return prev;
      }

      const nextDays = (prev.streak?.days || 0) + 1;
      let coins = prev.coins;
      let exp = prev.exp;
      let level = prev.level;
      let maxExp = prev.maxExp || level * 100;
      let inv = prev.inventory || [];

      if (item.type === "coins") coins += item.amount;
      if (item.type === "exp") {
        const res = this.calculateExp(exp + item.amount, level, maxExp);
        exp = res.exp;
        level = res.level;
        maxExp = res.maxExp;
        if (res.leveledUp) sound.playLevelUp();
      }
      if (item.type === "item" && !inv.includes(item.id)) inv = [...inv, item.id];

      return {
        ...prev,
        coins,
        exp,
        level,
        maxExp,
        inventory: inv,
        streak: {
          days: nextDays,
          lastClaimDate: todayStr,
          claimedDays: [...(prev.streak?.claimedDays || []), item.day],
        },
        speechBubble: {
          text: `เช็คชื่อวันที่ ${item.day} สำเร็จแล้ว! ได้รับ ${item.name} 🎁✨`,
          timestamp: Date.now(),
          duration: 4000,
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

  // ==============================================================================
  // 🏡 CAGE FURNITURE & MYSTERY BOX METHODS
  // ==============================================================================
  buyFurniture(furnitureId) {
    const item = FURNITURE_ITEMS.find((f) => f.id === furnitureId);
    if (!item) return { success: false, message: "ไม่พบไอเทมนี้ในระบบ" };

    if (this.currentState.coins < item.cost) {
      sound.playPrank();
      return { success: false, message: "เมล็ดทานตะวันไม่พอจ้า!" };
    }

    const currentInv = this.currentState.furniture?.inventory || [];
    if (currentInv.includes(furnitureId)) {
      return { success: false, message: "คุณมีเฟอร์นิเจอร์ชิ้นนี้อยู่แล้ว!" };
    }

    sound.playCoin();
    this.updateState((prev) => {
      const inv = prev.furniture?.inventory || [];
      return {
        ...prev,
        coins: prev.coins - item.cost,
        furniture: {
          ...(prev.furniture || {}),
          inventory: [...inv, furnitureId],
        },
        speechBubble: {
          text: `ว้าววว! ได้ ${item.name} มาแต่งกรงแล้ว น่ารักสุดๆ 🏡✨`,
          timestamp: Date.now(),
          duration: 3500,
        },
      };
    });
    return { success: true, item };
  }

  toggleEquipFurniture(category, furnitureId) {
    sound.playClick();
    return this.updateState((prev) => {
      const currentEquipped = prev.furniture?.equipped || {};
      const isAlready = currentEquipped[category] === furnitureId;
      // วอลเปเปอร์ถ้าถอดออก ให้กลับเป็นลายตารางเริ่มต้น (default_grid)
      const nextEquipped = isAlready
        ? (category === "wallpaper" ? "default_grid" : null)
        : furnitureId;

      return {
        ...prev,
        furniture: {
          ...(prev.furniture || {}),
          equipped: {
            ...currentEquipped,
            [category]: nextEquipped,
          },
        },
      };
    });
  }

  openMysteryBox(boxId) {
    const box = MYSTERY_BOXES.find((b) => b.id === boxId);
    if (!box) return { success: false, message: "ไม่พบกล่องสุ่มนี้" };

    if (this.currentState.coins < box.cost) {
      sound.playPrank();
      return { success: false, message: "เมล็ดทานตะวันไม่พอเปิดกล่องสุ่มงับ!" };
    }

    // คำนวณความหายาก (RNG)
    const roll = Math.random();
    let chosenRarity = "common";
    if (box.id === "gold_box") {
      if (roll < 0.25) chosenRarity = "epic";
      else if (roll < 0.80) chosenRarity = "rare";
      else chosenRarity = "common";
    } else {
      if (roll < 0.05) chosenRarity = "epic";
      else if (roll < 0.30) chosenRarity = "rare";
      else chosenRarity = "common";
    }

    let pool = FURNITURE_ITEMS.filter((f) => f.rarity === chosenRarity && f.cost > 0);
    if (pool.length === 0) pool = FURNITURE_ITEMS.filter((f) => f.cost > 0);
    const wonItem = pool[Math.floor(Math.random() * pool.length)];

    sound.playLevelUp();

    let isDuplicate = false;
    let refund = 0;

    this.updateState((prev) => {
      const currentInv = prev.furniture?.inventory || [];
      isDuplicate = currentInv.includes(wonItem.id);
      if (isDuplicate) {
        refund = Math.floor(box.cost * 0.4); // คืนเงินปลอบใจ 40%
      }
      const newInv = isDuplicate ? currentInv : [...currentInv, wonItem.id];

      return {
        ...prev,
        coins: prev.coins - box.cost + refund,
        furniture: {
          ...(prev.furniture || {}),
          inventory: newInv,
        },
        speechBubble: {
          text: isDuplicate
            ? `เปิดได้ ${wonItem.name} ซ้ำ! ได้รับเงินปลอบใจ ${refund} 🌻 งับ`
            : `🎉 ยินดีด้วย! เปิดกล่องสุ่มได้ [${wonItem.name}] ระดับ ${wonItem.rarity.toUpperCase()}! ✨`,
          timestamp: Date.now(),
          duration: 4500,
        },
      };
    });

    return { success: true, item: wonItem, isDuplicate, refund };
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

  // Admin GM Actions
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
    const speechData = { text: text.trim(), timestamp: Date.now(), duration: 7000 };

    if (isFirebaseConfigured() && database) {
      set(ref(database, "global_events/globalSpeech"), speechData).catch(() => {});
    }

    return this.updateState((prev) => ({
      ...prev,
      speechBubble: speechData,
    }));
  }

  adminSendAnnouncement(title, message) {
    if (!title || !message) return;
    sound.playNotification();
    const announceData = { id: Date.now(), title: title.trim(), message: message.trim(), active: true, timestamp: Date.now() };

    if (isFirebaseConfigured() && database) {
      set(ref(database, "global_events/announcement"), announceData).catch(() => {});
    }

    return this.updateState((prev) => ({
      ...prev,
      announcement: announceData,
    }));
  }

  adminTriggerSeedRain() {
    sound.playNotification();
    const seedEvent = { id: Date.now(), active: true, timestamp: Date.now() };

    if (isFirebaseConfigured() && database) {
      set(ref(database, "global_events/seedRainEvent"), seedEvent).catch(() => {});
    }

    return this.updateState((prev) => ({
      ...prev,
      seedRainEvent: seedEvent,
      speechBubble: { text: "ฝนเมล็ดทานตะวันตกลงมาแล้ววว! รีบจิ้มเก็บกันเร็วพวกเรา! 🌻🌧️", timestamp: Date.now(), duration: 5000 },
    }));
  }

  adminResetGame() {
    return this.updateState(() => ({
      ...INITIAL_GAME_STATE,
      name: this.currentUser?.hamsterName || INITIAL_GAME_STATE.name,
      lastDecayTime: Date.now(),
      lastUpdated: Date.now(),
    }));
  }

  calculateExp(currentExp, currentLevel, currentMaxExp) {
    let exp = Math.max(0, Number(currentExp) || 0);
    let level = Math.max(1, Number(currentLevel) || 1);
    let maxExp = level * 100;
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
