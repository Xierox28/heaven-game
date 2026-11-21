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
  HAMSTER_BREEDS,
  PERSONALITIES,
  GARDEN_CROPS,
  COOKING_RECIPES,
  BUDDY_PETS,
  GASHAPON_POOL,
  MANSION_THEMES,
} from "../constants/gameData";
import { FURNITURE_ITEMS, MYSTERY_BOXES } from "../constants/furnitureData";
import { sound } from "../utils/audio";

// Helper: แปลง Array หรือ Object จาก Firebase ({ 0: 'a', 1: 'b' }) ให้เป็น JavaScript Array เสมอ
const toSafeArray = (val, defaultVal = []) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === "object") {
    return Object.values(val);
  }
  return defaultVal;
};

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
      // ตรวจสอบ Safety Backup สำรองกรณีข้อมูลหลักสูญหาย
      const backup = localStorage.getItem(`heaven_safety_backup_${this.getStorageKey()}`);
      if (backup) {
        const parsedBackup = JSON.parse(backup);
        return this.mergeState(parsedBackup);
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
    if (typeof window === "undefined" || !state) return;
    try {
      const dataStr = JSON.stringify(state);
      localStorage.setItem(this.getStorageKey(), dataStr);
      // Safety Emergency Backup สำรองข้อมูลเมื่อมีความก้าวหน้า ป้องกันข้อมูลหาย 100%
      if (state.coins > 0 || state.level > 1 || (state.inventory && state.inventory.length > 1)) {
        localStorage.setItem(`heaven_safety_backup_${this.getStorageKey()}`, dataStr);
      }
    } catch {}
  }

  mergeState(val) {
    if (!val || typeof val !== "object") return this.currentState || { ...INITIAL_GAME_STATE };

    // Anti-wipe: รวมไอเทมที่มีอยู่กับของใหม่เข้าด้วยกัน (ไม่มีทางที่ของจะหายเด็ดขาด)
    const prevInventory = toSafeArray(this.currentState?.inventory, []);
    const incomingInventory = toSafeArray(val?.inventory, INITIAL_GAME_STATE.inventory);
    const mergedInventory = Array.from(new Set([...prevInventory, ...incomingInventory]));

    const prevFurnitureInv = toSafeArray(this.currentState?.furniture?.inventory, []);
    const incomingFurnitureInv = toSafeArray(val?.furniture?.inventory, INITIAL_GAME_STATE.furniture.inventory);
    const mergedFurnitureInv = Array.from(new Set([...prevFurnitureInv, ...incomingFurnitureInv]));

    const prevAchievements = toSafeArray(this.currentState?.achievements, []);
    const incomingAchievements = toSafeArray(val?.achievements, []);
    const mergedAchievements = Array.from(new Set([...prevAchievements, ...incomingAchievements]));

    // Monotonic coins & level guard: ป้องกันเงินลดฮวบหรือเลเวลลดลงเอง
    const currentCoins = Math.max(0, Number(this.currentState?.coins) || 0);
    const incomingCoins = Math.max(0, Number(val?.coins) || 0);
    const finalCoins = Math.max(currentCoins, incomingCoins);

    const currentLevel = Math.max(1, Number(this.currentState?.level) || 1);
    const incomingLevel = Math.max(1, Number(val?.level) || 1);
    const finalLevel = Math.max(currentLevel, incomingLevel);

    // Stats safety floors: ป้องกันค่าสถานะกลายเป็น 0 โดยมีพื้นต่ำสุดที่ปลอดภัย
    const rawHunger = Number(val?.hunger ?? this.currentState?.hunger ?? 80);
    const rawHappy = Number(val?.happiness ?? this.currentState?.happiness ?? 85);
    const rawClean = Number(val?.cleanliness ?? this.currentState?.cleanliness ?? 75);
    const rawEnergy = Number(val?.energy ?? this.currentState?.energy ?? 90);

    return {
      ...INITIAL_GAME_STATE,
      ...val,
      name: val?.name || this.currentUser?.hamsterName || this.currentState?.name || INITIAL_GAME_STATE.name,
      level: finalLevel,
      maxExp: finalLevel * 100,
      coins: finalCoins,
      hunger: Math.max(20, Math.min(100, isNaN(rawHunger) ? 80 : rawHunger)),
      happiness: Math.max(20, Math.min(100, isNaN(rawHappy) ? 85 : rawHappy)),
      cleanliness: Math.max(20, Math.min(100, isNaN(rawClean) ? 75 : rawClean)),
      energy: Math.max(15, Math.min(100, isNaN(rawEnergy) ? 90 : rawEnergy)),
      // 👗 Multi-wear stacking: รองรับทั้ง Array ของไอเทมหลายชิ้น หรือ Object เดิม
      equipped: Array.isArray(val?.equipped)
        ? val.equipped
        : (val?.equipped && typeof val.equipped === "object"
            ? Object.values(val.equipped).filter(Boolean)
            : (Array.isArray(this.currentState?.equipped) ? this.currentState.equipped : ["frog_hat"])),
      inventory: mergedInventory.length > 0 ? mergedInventory : INITIAL_GAME_STATE.inventory,
      stats: { ...INITIAL_GAME_STATE.stats, ...(this.currentState?.stats || {}), ...(val?.stats || {}) },
      achievements: mergedAchievements,
      pass: {
        ...INITIAL_GAME_STATE.pass,
        ...(this.currentState?.pass || {}),
        ...(val?.pass || {}),
        claimedFree: toSafeArray(val?.pass?.claimedFree ?? this.currentState?.pass?.claimedFree, []),
        claimedGold: toSafeArray(val?.pass?.claimedGold ?? this.currentState?.pass?.claimedGold, []),
        claimedQuests: toSafeArray(val?.pass?.claimedQuests ?? this.currentState?.pass?.claimedQuests, []),
      },
      streak: {
        ...INITIAL_GAME_STATE.streak,
        ...(this.currentState?.streak || {}),
        ...(val?.streak || {}),
        claimedDays: toSafeArray(val?.streak?.claimedDays ?? this.currentState?.streak?.claimedDays, []),
      },
      speechBubble: { ...INITIAL_GAME_STATE.speechBubble, ...(val?.speechBubble || this.currentState?.speechBubble || {}) },
      announcement: { ...INITIAL_GAME_STATE.announcement, ...(val?.announcement || {}) },
      seedRainEvent: { ...INITIAL_GAME_STATE.seedRainEvent, ...(val?.seedRainEvent || {}) },
      furniture: {
        equipped: {
          house: val?.furniture?.equipped?.house !== undefined ? val.furniture.equipped.house : (this.currentState?.furniture?.equipped?.house ?? null),
          toy: val?.furniture?.equipped?.toy !== undefined ? val.furniture.equipped.toy : (this.currentState?.furniture?.equipped?.toy ?? null),
          wallpaper: val?.furniture?.equipped?.wallpaper || this.currentState?.furniture?.equipped?.wallpaper || "default_grid",
          rug: val?.furniture?.equipped?.rug !== undefined ? val.furniture.equipped.rug : (this.currentState?.furniture?.equipped?.rug ?? null),
        },
        positions: {
          house: { x: 18, y: 3 },
          toy: { x: 82, y: 3 },
          rug: { x: 50, y: 6 },
          ...(this.currentState?.furniture?.positions || {}),
          ...(val?.furniture?.positions || {}),
        },
        scales: {
          house: 1.0,
          toy: 1.0,
          rug: 1.0,
          ...(this.currentState?.furniture?.scales || {}),
          ...(val?.furniture?.scales || {}),
        },
        inventory: mergedFurnitureInv.length > 0 ? mergedFurnitureInv : INITIAL_GAME_STATE.furniture.inventory,
      },
      wardrobeOffsets: {
        ...(this.currentState?.wardrobeOffsets || {}),
        ...(val?.wardrobeOffsets || {}),
      },
      // 🐹 Breeds & Personalities (v4.0) — Auto-unlock by Level Milestone
      breed: val?.breed || this.currentState?.breed || INITIAL_GAME_STATE.breed,
      unlockedBreeds: (() => {
        const raw = toSafeArray(val?.unlockedBreeds ?? this.currentState?.unlockedBreeds, INITIAL_GAME_STATE.unlockedBreeds);
        const levelUnlocked = HAMSTER_BREEDS.filter((b) => finalLevel >= b.reqLevel).map((b) => b.id);
        return Array.from(new Set([...raw, ...levelUnlocked]));
      })(),
      personality: val?.personality || this.currentState?.personality || INITIAL_GAME_STATE.personality,
      // 🌾 v5.0 Garden & Pantry
      gardenPlots: val?.gardenPlots || this.currentState?.gardenPlots || INITIAL_GAME_STATE.gardenPlots,
      pantry: {
        ...INITIAL_GAME_STATE.pantry,
        ...(this.currentState?.pantry || {}),
        ...(val?.pantry || {}),
      },
      // ⚡ v5.0 Buffs & Buddies & Mansion Themes
      activeBuffs: {
        ...INITIAL_GAME_STATE.activeBuffs,
        ...(this.currentState?.activeBuffs || {}),
        ...(val?.activeBuffs || {}),
      },
      equippedBuddy: val?.equippedBuddy || this.currentState?.equippedBuddy || "buddy_piyo",
      unlockedBuddies: toSafeArray(val?.unlockedBuddies ?? this.currentState?.unlockedBuddies, ["buddy_piyo"]),
      mansionTheme: val?.mansionTheme || this.currentState?.mansionTheme || "default_grid",
      unlockedThemes: toSafeArray(val?.unlockedThemes ?? this.currentState?.unlockedThemes, ["default_grid"]),
      playerTitle: val?.playerTitle || this.currentState?.playerTitle || INITIAL_GAME_STATE.playerTitle,
      playerAvatar: val?.playerAvatar || this.currentState?.playerAvatar || INITIAL_GAME_STATE.playerAvatar,
      unlockedAvatars: toSafeArray(val?.unlockedAvatars ?? this.currentState?.unlockedAvatars, INITIAL_GAME_STATE.unlockedAvatars),
      unlockedTitles: toSafeArray(val?.unlockedTitles ?? this.currentState?.unlockedTitles, INITIAL_GAME_STATE.unlockedTitles),
      currentFloor: val?.currentFloor !== undefined ? Number(val.currentFloor) : (this.currentState?.currentFloor ?? 1),
      diamonds: val?.diamonds !== undefined ? Number(val.diamonds) : (this.currentState?.diamonds ?? INITIAL_GAME_STATE.diamonds),
      trickState: val?.trickState || this.currentState?.trickState || null,
      diamondRequests: toSafeArray(val?.diamondRequests ?? this.currentState?.diamondRequests, []),
      mysteryBoxPending: val?.mysteryBoxPending !== undefined ? val.mysteryBoxPending : (this.currentState?.mysteryBoxPending || null),
      highScores: {
        ...INITIAL_GAME_STATE.highScores,
        ...(this.currentState?.highScores || {}),
        ...(val?.highScores || {}),
      },
      serverFever: val?.serverFever || this.currentState?.serverFever || { active: false, multiplier: 2, expiresAt: 0 },
      lastDecayTime: Date.now(),
      lastUpdated: Math.max(Number(val?.lastUpdated) || 0, Number(this.currentState?.lastUpdated) || 0, Date.now()),
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
        this.updateState((prev) => {
          let box = prev.mysteryBoxPending;
          if (g.globalMysteryDrop && (Date.now() - (g.globalMysteryDrop.timestamp || 0) < 120000)) {
            if (!box || box.id !== g.globalMysteryDrop.id) {
              box = g.globalMysteryDrop;
            }
          }
          let ann = prev.announcement;
          if (g.announcement) {
            let dismissedId = null;
            try { dismissedId = localStorage.getItem("last_dismissed_announcement_id"); } catch (e) {}
            const isDismissed = dismissedId && String(dismissedId) === String(g.announcement.id);
            if (!g.announcement.active || isDismissed) {
              ann = { ...g.announcement, active: false };
            } else {
              ann = { ...g.announcement };
            }
          }

          return {
            ...prev,
            announcement: ann,
            seedRainEvent: g.seedRainEvent ? { ...prev.seedRainEvent, ...g.seedRainEvent } : prev.seedRainEvent,
            serverFever: g.serverFever || prev.serverFever,
            mysteryBoxPending: box,
            speechBubble: g.globalSpeech && Date.now() - g.globalSpeech.timestamp < 10000
              ? g.globalSpeech
              : prev.speechBubble,
          };
        });
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
      let elapsedSeconds = Math.max(0, (now - last) / 1000);
      if (elapsedSeconds < 10) return;

      // 🛡️ SAFETY CAP: จำกัดเวลาลดค่าสถานะไม่เกิน 60 วินาทีต่อครั้ง
      // ป้องกันอาการค่าสถานะลดฮวบเหลือ 0 ทันทีเมื่อสลับแท็บหรือเปิดเกมทิ้งไว้
      elapsedSeconds = Math.min(elapsedSeconds, 60);

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
          hunger = Math.max(20, hunger - elapsedSeconds * 0.015);
          cleanliness = Math.max(20, cleanliness - elapsedSeconds * 0.01 * (1 - cleanDecayReduction));
        } else {
          // อัตราการลดที่สมดุล พร้อม Safety Floor ขั้นต่ำ 20% (ไม่มีทางลดฮวบจนเหลือ 0)
          hunger = Math.max(25, hunger - elapsedSeconds * 0.025);
          happiness = Math.max(25, happiness - elapsedSeconds * 0.02 * (1 - happyDecayReduction));
          cleanliness = Math.max(20, cleanliness - elapsedSeconds * 0.02 * (1 - cleanDecayReduction));
          energy = Math.max(20, energy - elapsedSeconds * 0.025);

          const poopChance = 0.06 * (1 - cleanDecayReduction);
          if (cleanliness < 50 && poopCount < 4 && Math.random() < poopChance) {
            poopCount = Math.min(4, poopCount + 1);
            cleanliness = Math.max(15, cleanliness - 5);
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
      const cleanliness = foodItem.cleanliness ? Math.min(100, prev.cleanliness + foodItem.cleanliness) : prev.cleanliness;
      const coins = prev.coins - foodItem.cost;
      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + foodItem.exp, prev.level, prev.maxExp);
      const newStats = { ...prev.stats, totalFed: (prev.stats?.totalFed || 0) + 1 };

      let newPoop = prev.poopCount;
      if (Math.random() < 0.3 && newPoop < 4) newPoop += 1;
      if (leveledUp) sound.playLevelUp();

      // v5.0 Active Buffs
      let activeBuffs = { ...(prev.activeBuffs || {}) };
      if (foodItem.buff) {
        if (foodItem.buff.type === "double_coin") {
          activeBuffs.doubleCoinUntil = Date.now() + foodItem.buff.duration;
        } else if (foodItem.buff.type === "slow_hunger") {
          activeBuffs.slowHungerUntil = Date.now() + foodItem.buff.duration;
        }
      }

      const newDailyProgress = {
        ...(prev.pass?.dailyProgress || {}),
        feed_twice: ((prev.pass?.dailyProgress?.feed_twice || 0) + 1),
      };

      return {
        ...prev,
        hunger, happiness, cleanliness, coins, exp, level, maxExp,
        poopCount: newPoop,
        activeBuffs,
        stats: newStats,
        pass: {
          ...(prev.pass || {}),
          dailyProgress: newDailyProgress,
        },
        actionState: "eating",
        actionExpiry: Date.now() + 2500,
        speechBubble: leveledUp
          ? { text: `เย้ๆ! เลเวลอัปเป็น Lv.${level} แล้วจ้า! 🎉✨`, timestamp: Date.now(), duration: 5000 }
          : { text: foodItem.buff ? `งั่มมม! ${foodItem.name} อร่อยม๊าก! [ได้รับบัฟ ${foodItem.buff.label}] 🔥✨` : `งั่มๆ! ${foodItem.name} อร่อยม๊ากกกก 😋`, timestamp: Date.now(), duration: 4000 },
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
      // v5.0 Multiplier: Server Fever & Food Buffs
      const isFever = prev.serverFever?.active && ((prev.serverFever.expiresAt || 0) > Date.now());
      const hasDoubleBuff = (prev.activeBuffs?.doubleCoinUntil || 0) > Date.now();
      let multiplier = 1;
      if (isFever) multiplier *= (prev.serverFever.multiplier || 2);
      if (hasDoubleBuff) multiplier *= 2;
      const finalEarnedCoins = earnedCoins * multiplier;

      const { exp, level, maxExp, leveledUp } = this.calculateExp(prev.exp + earnedExp, prev.level, prev.maxExp);
      if (leveledUp) sound.playLevelUp();
      const newStats = {
        ...prev.stats,
        miniGamesPlayed: (prev.stats?.miniGamesPlayed || 0) + 1,
        totalCoinsEarned: (prev.stats?.totalCoinsEarned || 0) + finalEarnedCoins,
      };

      const newDailyProgress = {
        ...(prev.pass?.dailyProgress || {}),
        spin_wheel: ((prev.pass?.dailyProgress?.spin_wheel || 0) + 1),
      };

      return {
        ...prev,
        coins: prev.coins + finalEarnedCoins,
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
          text: multiplier > 1
            ? `ปั่นวงล้อสนุกมากกก! ได้บัฟ x${multiplier} รับไปเต็มๆ ${finalEarnedCoins} เมล็ดทานตะวัน! 🏃‍♂️💨🔥`
            : `ปั่นวงล้อสนุกมากกก! ได้มา ${finalEarnedCoins} เมล็ดทานตะวันเลยงับ 🏃‍♂️💨`,
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

  toggleEquip(typeOrId, explicitId) {
    const id = explicitId || typeOrId;
    sound.playClick();
    return this.updateState((prev) => {
      let currentEquipped = [];
      if (Array.isArray(prev.equipped)) {
        currentEquipped = [...prev.equipped];
      } else if (prev.equipped && typeof prev.equipped === "object") {
        currentEquipped = Object.values(prev.equipped).filter(Boolean);
      }

      let nextEquipped;
      if (currentEquipped.includes(id)) {
        // ถอดออก (Toggle OFF)
        nextEquipped = currentEquipped.filter((x) => x !== id);
      } else {
        // สวมใส่เพิ่มได้หลายชิ้นพร้อมกัน (Multi-wear stacking อิสระเต็มรูปแบบ)
        nextEquipped = [...currentEquipped, id];
      }

      return {
        ...prev,
        equipped: nextEquipped,
      };
    });
  }

  adjustWardrobeOffset(itemId, deltaX = 0, deltaY = 0, deltaScale = 0) {
    sound.playClick();
    return this.updateState((prev) => {
      const current = prev.wardrobeOffsets?.[itemId] || { x: 0, y: 0, scale: 1.0 };
      const newX = Math.max(-30, Math.min(30, Math.round(((current.x || 0) + deltaX) * 10) / 10));
      const newY = Math.max(-30, Math.min(30, Math.round(((current.y || 0) + deltaY) * 10) / 10));
      const newScale = Math.max(0.6, Math.min(1.8, Math.round(((current.scale || 1.0) + deltaScale) * 100) / 100));

      return {
        ...prev,
        wardrobeOffsets: {
          ...(prev.wardrobeOffsets || {}),
          [itemId]: { x: newX, y: newY, scale: newScale },
        },
      };
    });
  }

  resetWardrobeOffset(itemId) {
    sound.playClick();
    return this.updateState((prev) => {
      const updated = { ...(prev.wardrobeOffsets || {}) };
      delete updated[itemId];
      return {
        ...prev,
        wardrobeOffsets: updated,
      };
    });
  }

  // ==============================================================================
  // 🐹 BREEDS & PERSONALITY METHODS (v4.0)
  // ==============================================================================
  buyBreed(breedId) {
    const breedDef = HAMSTER_BREEDS.find((b) => b.id === breedId);
    if (!breedDef) return { success: false, message: "ไม่พบสายพันธุ์นี้" };

    if (this.currentState.coins < breedDef.cost) {
      sound.playPrank();
      return { success: false, message: "เมล็ดทานตะวันไม่พอจ้า!" };
    }

    if (this.currentState.level < breedDef.reqLevel) {
      sound.playPrank();
      return { success: false, message: `ต้องการเลเวล ${breedDef.reqLevel} ขึ้นไปจ้า!` };
    }

    sound.playReward();
    this.updateState((prev) => {
      const prevUnlocked = toSafeArray(prev.unlockedBreeds, ["winter_white"]);
      const nextUnlocked = Array.from(new Set([...prevUnlocked, breedId]));
      return {
        ...prev,
        coins: Math.max(0, prev.coins - breedDef.cost),
        unlockedBreeds: nextUnlocked,
        breed: breedId,
        speechBubble: {
          text: `แปลงร่างเป็นสายพันธุ์ ${breedDef.name} แล้วงับ! น่ารักมั้ย~ ✨`,
          timestamp: Date.now(),
          duration: 5000,
        },
      };
    });
    return { success: true, message: `ปลดล็อคสายพันธุ์ ${breedDef.name} เรียบร้อย!` };
  }

  setBreed(breedId) {
    const breedDef = HAMSTER_BREEDS.find((b) => b.id === breedId);
    if (!breedDef) return;
    const unlocked = toSafeArray(this.currentState?.unlockedBreeds, ["winter_white"]);
    const isLevelMet = (this.currentState?.level || 1) >= (breedDef.reqLevel || 1);
    if (!unlocked.includes(breedId) && !isLevelMet) return;

    sound.playClick();
    this.updateState((prev) => {
      const prevUnlocked = toSafeArray(prev.unlockedBreeds, ["winter_white"]);
      const nextUnlocked = Array.from(new Set([...prevUnlocked, breedId]));
      return {
        ...prev,
        breed: breedId,
        unlockedBreeds: nextUnlocked,
      };
    });
  }

  setPersonality(personalityId) {
    sound.playClick();
    this.updateState((prev) => {
      const pDef = PERSONALITIES.find((p) => p.id === personalityId);
      const randomQuote = pDef ? pDef.quotes[Math.floor(Math.random() * pDef.quotes.length)] : "นิสัยใหม่น่ารักจัง!";
      return {
        ...prev,
        personality: personalityId,
        speechBubble: {
          text: randomQuote,
          timestamp: Date.now(),
          duration: 5000,
        },
      };
    });
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
    if (this.currentState?.announcement?.id) {
      try {
        localStorage.setItem("last_dismissed_announcement_id", String(this.currentState.announcement.id));
      } catch (e) {}
    }
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

  // ==============================================================================
  // 🌾 v5.0 GARDEN & COOKING HANDLERS
  // ==============================================================================
  plantCrop(plotId, cropId) {
    const crop = GARDEN_CROPS.find((c) => c.id === cropId);
    if (!crop) return;
    if (this.currentState.coins < crop.seedCost) return;

    sound.playEat();
    return this.updateState((prev) => {
      if (prev.coins < crop.seedCost) return prev;
      const plots = [...(prev.gardenPlots || INITIAL_GAME_STATE.gardenPlots)];
      plots[plotId] = {
        id: plotId,
        cropId,
        plantedAt: Date.now(),
        watered: false,
      };
      return {
        ...prev,
        coins: prev.coins - crop.seedCost,
        gardenPlots: plots,
        speechBubble: {
          text: `หว่านเมล็ด ${crop.name} เรียบร้อยแล้ว รดน้ำให้น้องโตเร็วๆ นะงับ! 🌱💧`,
          timestamp: Date.now(),
          duration: 3500,
        },
      };
    });
  }

  waterCrop(plotId) {
    sound.playClean();
    return this.updateState((prev) => {
      const plots = [...(prev.gardenPlots || INITIAL_GAME_STATE.gardenPlots)];
      if (!plots[plotId] || !plots[plotId].cropId) return prev;
      plots[plotId] = {
        ...plots[plotId],
        watered: true,
      };
      return {
        ...prev,
        gardenPlots: plots,
        happiness: Math.min(100, prev.happiness + 5),
        speechBubble: {
          text: "รดน้ำชุ่มฉ่ำ! พืชผักสดชื่นเติบโตไวขึ้นแล้วจ้า 💦🌱",
          timestamp: Date.now(),
          duration: 3000,
        },
      };
    });
  }

  harvestCrop(plotId) {
    sound.playLevelUp();
    return this.updateState((prev) => {
      const plots = [...(prev.gardenPlots || INITIAL_GAME_STATE.gardenPlots)];
      const plot = plots[plotId];
      if (!plot || !plot.cropId) return prev;

      const crop = GARDEN_CROPS.find((c) => c.id === plot.cropId);
      if (!crop) return prev;

      // สัตว์เลี้ยงเต่าทอง (Ladybug) มีโอกาสได้ผลผลิต 2 เท่า 50%
      const isLadybug = prev.equippedBuddy === "buddy_ladybug";
      const hasDoubleYield = isLadybug && Math.random() < 0.5;
      const multiplier = hasDoubleYield ? 2 : 1;

      let newCoins = prev.coins;
      let newPantry = { ...(prev.pantry || INITIAL_GAME_STATE.pantry) };
      let harvestText = "";

      if (crop.yieldType === "coins") {
        const earned = crop.yieldAmount * multiplier;
        newCoins += earned;
        harvestText = `เก็บเกี่ยว ${crop.name} สำเร็จ! ได้รับ ${earned} เมล็ดทานตะวัน! 🌻${hasDoubleYield ? " (โบนัสเต่าทอง x2! 🐞)" : ""}`;
      } else if (crop.yieldType === "item") {
        const earned = crop.yieldAmount * multiplier;
        newPantry[crop.yieldItem] = (newPantry[crop.yieldItem] || 0) + earned;
        harvestText = `เก็บเกี่ยว ${crop.name} สำเร็จ! ได้รับ +${earned} ชิ้นเข้าคลังครัว! 🌿${hasDoubleYield ? " (โบนัสเต่าทอง x2! 🐞)" : ""}`;
      }

      plots[plotId] = { id: plotId, cropId: null, plantedAt: 0, watered: false };

      return {
        ...prev,
        coins: newCoins,
        pantry: newPantry,
        gardenPlots: plots,
        happiness: Math.min(100, prev.happiness + 15),
        exp: prev.exp + 15,
        speechBubble: {
          text: harvestText,
          timestamp: Date.now(),
          duration: 4000,
        },
      };
    });
  }

  cookRecipe(recipe) {
    sound.playLevelUp();
    return this.updateState((prev) => {
      const pantry = { ...(prev.pantry || INITIAL_GAME_STATE.pantry) };
      // Check ingredients
      for (const [item, reqCount] of Object.entries(recipe.reqIngredients || {})) {
        if ((pantry[item] || 0) < reqCount) return prev;
      }
      // Deduct ingredients
      for (const [item, reqCount] of Object.entries(recipe.reqIngredients || {})) {
        pantry[item] -= reqCount;
      }

      const foodItem = FOOD_ITEMS.find((f) => f.id === recipe.resultFoodId);
      let hunger = prev.hunger;
      let happiness = prev.happiness;
      let activeBuffs = { ...(prev.activeBuffs || {}) };

      if (foodItem) {
        hunger = Math.min(100, prev.hunger + foodItem.hunger);
        happiness = Math.min(100, prev.happiness + foodItem.happiness);
        if (foodItem.buff) {
          if (foodItem.buff.type === "double_coin") {
            activeBuffs.doubleCoinUntil = Date.now() + foodItem.buff.duration;
          } else if (foodItem.buff.type === "slow_hunger") {
            activeBuffs.slowHungerUntil = Date.now() + foodItem.buff.duration;
          }
        }
      }

      return {
        ...prev,
        pantry,
        hunger,
        happiness,
        activeBuffs,
        exp: prev.exp + 30,
        actionState: "eating",
        actionExpiry: Date.now() + 3000,
        speechBubble: {
          text: `ปรุง ${recipe.name} สำเร็จและกินทันที! อร่อยฟินสุดๆ! 🍳🔥`,
          timestamp: Date.now(),
          duration: 4500,
        },
      };
    });
  }

  // ==============================================================================
  // 🎰 v5.0 LUCKY GASHAPON HANDLERS
  // ==============================================================================
  spinGashapon(count = 1) {
    const cost = count === 10 ? 1350 : 150;
    if (this.currentState.coins < cost) return null;

    sound.playLevelUp();
    const results = [];
    const pool = GASHAPON_POOL;

    for (let i = 0; i < count; i++) {
      const rand = Math.random() * 100;
      let selected = pool[pool.length - 1];
      let accum = 0;
      for (const item of pool) {
        accum += item.rate;
        if (rand <= accum) {
          selected = item;
          break;
        }
      }
      results.push(selected);
    }

    this.updateState((prev) => {
      let coins = prev.coins - cost;
      let inv = [...(prev.inventory || [])];
      let unlockedBuddies = [...(prev.unlockedBuddies || ["buddy_piyo"])];
      let playerTitle = prev.playerTitle || "";

      for (const r of results) {
        if (r.type === "coins") coins += r.amount;
        if (r.type === "wardrobe" && !inv.includes(r.itemId)) inv.push(r.itemId);
        if (r.type === "buddy" && !unlockedBuddies.includes(r.itemId)) unlockedBuddies.push(r.itemId);
        if (r.type === "title") playerTitle = r.title;
      }

      return {
        ...prev,
        coins,
        inventory: inv,
        unlockedBuddies,
        playerTitle,
        speechBubble: {
          text: `หมุนกาชาปองได้ของขวัญสุดเจ๋ง! ลุ้นรางวัลกันมันส์สุดๆ! 🎰✨`,
          timestamp: Date.now(),
          duration: 4000,
        },
      };
    });

    return results;
  }

  // ==============================================================================
  // 🐥 v5.0 BUDDY PETS & MANSION THEMES
  // ==============================================================================
  equipBuddy(buddyId) {
    sound.playNotification();
    return this.updateState((prev) => ({
      ...prev,
      equippedBuddy: buddyId,
      speechBubble: {
        text: `เปลี่ยนคู่หูตัวจิ๋วเรียบร้อย! คอยดูแลน้องเฮเว่นนะงับ 🐾`,
        timestamp: Date.now(),
        duration: 3500,
      },
    }));
  }

  buyMansionTheme(themeId) {
    const theme = MANSION_THEMES.find((t) => t.id === themeId);
    if (!theme) return;
    if (this.currentState.coins < theme.cost) return;

    sound.playLevelUp();
    return this.updateState((prev) => {
      const unlockedThemes = [...(prev.unlockedThemes || ["default_grid"])];
      if (!unlockedThemes.includes(themeId)) unlockedThemes.push(themeId);
      return {
        ...prev,
        coins: prev.coins - theme.cost,
        unlockedThemes,
        mansionTheme: themeId,
        speechBubble: {
          text: `อัปเกรดกรงคฤหาสน์เป็น '${theme.name}' แล้วจ้า! หรูหราอลังการที่สุด! 🏰✨`,
          timestamp: Date.now(),
          duration: 5000,
        },
      };
    });
  }

  equipMansionTheme(themeId) {
    return this.updateState((prev) => ({
      ...prev,
      mansionTheme: themeId,
    }));
  }

  // ==============================================================================
  // 🎁 v5.0 MYSTERY BOX & HAMSTER JUMP
  // ==============================================================================
  claimMysteryBox() {
    sound.playLevelUp();
    return this.updateState((prev) => {
      const bonusSeeds = Math.floor(Math.random() * 300) + 200;
      return {
        ...prev,
        coins: prev.coins + bonusSeeds,
        mysteryBoxPending: null,
        happiness: 100,
        speechBubble: {
          text: `ว้าววว! เปิดกล่องสมบัติ GM ได้รับ ${bonusSeeds} เมล็ดทานตะวันทองคำ! ขอบคุณ GM ค้าบบบ! 🎁🌻🎉`,
          timestamp: Date.now(),
          duration: 5000,
        },
      };
    });
  }

  recordJumpScore(score, earnedSeeds) {
    sound.playCoin();
    return this.updateState((prev) => {
      const isFever = prev.serverFever?.active && ((prev.serverFever.expiresAt || 0) > Date.now());
      const hasDoubleBuff = (prev.activeBuffs?.doubleCoinUntil || 0) > Date.now();
      let multiplier = 1;
      if (isFever) multiplier *= (prev.serverFever.multiplier || 2);
      if (hasDoubleBuff) multiplier *= 2;
      const totalSeeds = earnedSeeds * multiplier;

      const currentBest = prev.highScores?.hamsterJump || 0;
      const newBest = Math.max(currentBest, score);

      return {
        ...prev,
        coins: prev.coins + totalSeeds,
        highScores: {
          ...(prev.highScores || {}),
          hamsterJump: newBest,
        },
        energy: Math.max(10, prev.energy - 10),
        happiness: Math.min(100, prev.happiness + 25),
        speechBubble: {
          text: score > currentBest
            ? `NEW RECORD! กระโดดเมฆได้สูงถึง ${score} เมตร! ได้รับ ${totalSeeds} เมล็ดทานตะวัน! 🚀☁️`
            : `กระโดดเมฆสนุกมากกก! ไต่ได้ ${score} เมตร ได้รับ ${totalSeeds} เมล็ดทานตะวันงับ! 🐹✨`,
          timestamp: Date.now(),
          duration: 4000,
        },
      };
    });
  }

  // 💎 ใช้เพชรเร่งโตแปลงผักเสร็จทันที (Instant Crop Acceleration)
  instantHarvestPlot(plotIndex, costDiamonds = 5) {
    if ((this.currentState?.diamonds || 0) < costDiamonds) {
      sound.playClick();
      return { success: false, reason: "เพชรไม่พอ ขอเพชรจากพี่ดิวเพิ่มก่อนน้า!" };
    }

    sound.playLevelUp();
    this.updateState((prev) => ({
      ...prev,
      diamonds: Math.max(0, prev.diamonds - costDiamonds),
      gardenPlots: prev.gardenPlots.map((plot, idx) =>
        idx === plotIndex ? { ...plot, plantedAt: 1 } : plot
      ),
      speechBubble: {
        text: `ใช้ ${costDiamonds} 💎 เร่งโตสำเร็จ! พืชโตเต็มวัยพร้อมเก็บเกี่ยวทันที! 🌾✨`,
        timestamp: Date.now(),
        duration: 4000,
      },
    }));

    // Auto harvest after instant growth
    setTimeout(() => {
      this.harvestCrop(plotIndex);
    }, 200);

    return { success: true };
  }

  // 💎 ใช้เพชรฟื้นฟูสถานะ 100% ทันที (Full Recovery Shortcut)
  instantRefreshStats(costDiamonds = 10) {
    if ((this.currentState?.diamonds || 0) < costDiamonds) {
      return { success: false, reason: "เพชรไม่พอจ้า" };
    }
    sound.playLevelUp();
    this.updateState((prev) => ({
      ...prev,
      diamonds: Math.max(0, prev.diamonds - costDiamonds),
      hunger: 100,
      energy: 100,
      cleanliness: 100,
      happiness: 100,
      poopCount: 0,
      speechBubble: {
        text: `ใช้ ${costDiamonds} 💎 ฟื้นฟูเต็ม 100%! สดชื่นกระปรี้กระเปร่าพร้อมลุยงับ! 💖✨`,
        timestamp: Date.now(),
        duration: 4000,
      },
    }));
    return { success: true };
  }

  // 💬 อ้อนแอดมินดิวขอเพชร (Send Diamond Request Ticket)
  async requestDiamonds(amount, message) {
    sound.playClick();
    const reqId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const username = this.currentUser?.username || "guest";
    const hamsterName = this.currentState?.name || "น้องเฮเว่น";
    const requestData = {
      id: reqId,
      username,
      hamsterName,
      amount: Number(amount) || 100,
      message: message.trim(),
      status: "pending",
      reply: "",
      timestamp: Date.now(),
    };

    if (isFirebaseConfigured() && database) {
      try {
        await set(ref(database, `global_events/diamond_requests/${reqId}`), requestData);
      } catch (e) {}
    }

    this.updateState((prev) => ({
      ...prev,
      diamondRequests: [requestData, ...(prev.diamondRequests || []).slice(0, 15)],
      speechBubble: {
        text: `ส่งข้อความอ้อนพี่ดิวแล้วงับ! ขอ ${amount} 💎 รอพี่ดิวมาแจกน้า~ 🥺💖`,
        timestamp: Date.now(),
        duration: 5000,
      },
    }));

    return { success: true, reqId };
  }

  // 🎭 สั่งให้น้องเล่นท่าทางพิเศษ (Hamster Tricks)
  performTrick(trickType) {
    sound.playPet();
    const textMap = {
      toss_seed: "ง่ำมมม! โดดงับเมล็ดทานตะวันกลางอากาศอย่างแม่นยำ! 🌻😋✨",
      tickle: "ฮ่าๆๆๆๆ จั๊กจี้พุงจังเลยยย กลิ้งตัวไม่หยุดแย้ววว! 😆💖🐾",
      spin_wings: "หมุนตัว 360 องศา โชว์ปีกกระพือระยิบระยับ สวยมั้ยงับบ! 🪽💫✨",
    };

    this.updateState((prev) => ({
      ...prev,
      trickState: { type: trickType, startedAt: Date.now() },
      happiness: Math.min(100, prev.happiness + 15),
      speechBubble: {
        text: textMap[trickType] || "นู๋ทำท่าพิเศษให้ดูงับ! 🐹✨",
        timestamp: Date.now(),
        duration: 4000,
      },
    }));

    // Reset trick after animation
    setTimeout(() => {
      this.updateState((prev) => ({
        ...prev,
        trickState: null,
      }));
    }, 3500);
  }

  // 🪜 สลับชั้นกรง (Floor 1: พื้นกรง / Floor 2: ระเบียงชั้นลอย)
  switchFloor(floor) {
    sound.playClick();
    this.updateState((prev) => ({
      ...prev,
      currentFloor: floor,
      speechBubble: {
        text: floor === 2
          ? "ปีนบันไดขึ้นมาชั้น 2 แล้วงับ! รับลมชมวิวสบายจังเลยยย~ 🪜✨"
          : "ไต่ลงมาชั้นล่างแล้วงับ! พื้นกรงอบอุ่นเหมือนเดิม~ 🐾",
        timestamp: Date.now(),
        duration: 3500,
      },
    }));
  }

  // 👤 เปลี่ยนรูปโปรไฟล์ Avatar
  setAvatar(avatarId) {
    sound.playClick();
    this.updateState((prev) => ({
      ...prev,
      playerAvatar: avatarId,
    }));
  }

  // 👑 เปลี่ยนฉายาผู้เล่น
  setTitle(title) {
    sound.playClick();
    this.updateState((prev) => ({
      ...prev,
      playerTitle: title,
    }));
  }

  calculateLevelProgression(currentExp, currentLevel) {
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
