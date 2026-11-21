// ==============================================================================
// 👑 ADMIN GM SERVICE — MULTI-PLAYER MANAGEMENT & BROADCASTING
// ==============================================================================
import { ref, get, set, update } from "firebase/database";
import { database, isFirebaseConfigured } from "../firebaseConfig";
import { sound } from "../utils/audio";
import { INITIAL_GAME_STATE, WARDROBE_ITEMS } from "../constants/gameData";

class AdminService {
  // ดึงรายชื่อผู้เล่นทั้งหมดจาก Firebase หรือ Local
  async getAllPlayers() {
    if (isFirebaseConfigured() && database) {
      try {
        const usersRef = ref(database, "users");
        const snap = await get(usersRef);
        if (snap.exists()) {
          const val = snap.val();
          return Object.keys(val).map((username) => ({
            username,
            hamsterName: val[username].hamsterName || "น้องเฮเว่น",
            createdAt: val[username].createdAt || Date.now(),
          }));
        }
      } catch (err) {
        console.warn("Failed to get all users from Firebase", err);
      }
    }

    // Local Fallback
    try {
      const stored = localStorage.getItem("heaven_local_users_v1");
      if (stored) {
        const val = JSON.parse(stored);
        return Object.keys(val).map((username) => ({
          username,
          hamsterName: val[username].hamsterName || "น้องเฮเว่น",
          createdAt: val[username].createdAt || Date.now(),
        }));
      }
    } catch {}

    return [
      { username: "guest", hamsterName: "น้องเฮเว่น (Guest)", createdAt: Date.now() },
    ];
  }

  // ดึงสถานะของแฮมสเตอร์ของผู้เล่นที่เลือก
  async getPlayerHamster(username) {
    if (username === "all") return null;

    if (isFirebaseConfigured() && database) {
      try {
        const dbPath = username === "guest" ? "heaven_game" : `players/${username}/hamster`;
        const snap = await get(ref(database, dbPath));
        if (snap.exists()) {
          return snap.val();
        }
      } catch (err) {
        console.warn("Failed to get player hamster", err);
      }
    }

    // Local Fallback
    try {
      const key = username === "guest" ? "heaven_game_state_guest" : `heaven_game_state_user_${username}`;
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch {}

    return { ...INITIAL_GAME_STATE };
  }

  // อัปเดตสถานะของผู้เล่นที่เลือก
  async updatePlayerHamster(username, updates) {
    const updatedWithTime = {
      ...updates,
      lastUpdated: Date.now(),
    };

    if (isFirebaseConfigured() && database) {
      try {
        const dbPath = username === "guest" ? "heaven_game" : `players/${username}/hamster`;
        await update(ref(database, dbPath), updatedWithTime);

        // อัปเดต Leaderboard
        if (updates.level || updates.coins || updates.name) {
          const lbRef = ref(database, `leaderboard/${username}`);
          await update(lbRef, {
            username,
            hamsterName: updates.name || "น้องเฮเว่น",
            level: updates.level || 1,
            coins: updates.coins || 0,
            updatedAt: Date.now(),
          });
        }
      } catch (err) {
        console.warn("Firebase update player failed", err);
      }
    }

    // Local Fallback
    try {
      const key = username === "guest" ? "heaven_game_state_guest" : `heaven_game_state_user_${username}`;
      const stored = localStorage.getItem(key);
      const curr = stored ? JSON.parse(stored) : { ...INITIAL_GAME_STATE };
      const next = { ...curr, ...updatedWithTime };
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}

    return updatedWithTime;
  }

  // สั่งให้น้องพูด (Whisper เฉพาะคน หรือ Broadcast ทุกคน)
  async sendSpeech(targetUser, text) {
    if (!text?.trim()) return;
    sound.playNotification();

    const speechData = {
      text: text.trim(),
      timestamp: Date.now(),
      duration: 7000,
    };

    if (targetUser === "all") {
      // Broadcast ทุกคน
      if (isFirebaseConfigured() && database) {
        await set(ref(database, "global_events/globalSpeech"), speechData);
      }
      return speechData;
    }

    // Whisper เฉพาะคน
    return this.updatePlayerHamster(targetUser, { speechBubble: speechData });
  }

  // ส่ง Pop-up ประกาศพิเศษ
  async sendAnnouncement(targetUser, title, message) {
    if (!title || !message) return;
    sound.playNotification();

    const announceData = {
      id: Date.now(),
      title: title.trim(),
      message: message.trim(),
      active: true,
      timestamp: Date.now(),
    };

    if (targetUser === "all") {
      if (isFirebaseConfigured() && database) {
        await set(ref(database, "global_events/announcement"), announceData);
      }
      return announceData;
    }

    return this.updatePlayerHamster(targetUser, { announcement: announceData });
  }

  // เปิด Event ฝนเมล็ดทานตะวัน
  async triggerSeedRain() {
    sound.playNotification();
    const eventData = { id: Date.now(), active: true, timestamp: Date.now() };

    if (isFirebaseConfigured() && database) {
      await set(ref(database, "global_events/seedRainEvent"), eventData);
    }
    return eventData;
  }

  // แจกเหรียญให้ทุกคนในเซิร์ฟเวอร์พร้อมกัน (Mass Coins)
  async massAddCoins(amount) {
    sound.playLevelUp();
    const players = await this.getAllPlayers();
    for (const p of players) {
      const curr = await this.getPlayerHamster(p.username);
      if (curr) {
        await this.updatePlayerHamster(p.username, {
          coins: (curr.coins || 0) + amount,
          speechBubble: {
            text: `GM แจกอั่งเปาทั่วเซิร์ฟเวอร์ +${amount} เมล็ดทานตะวัน! 🌻💰`,
            timestamp: Date.now(),
            duration: 5000,
          },
        });
      }
    }
  }

  // เสกของทุกชิ้นในตู้เสื้อผ้าให้ผู้เล่นคนนั้น
  async unlockAllWardrobe(username) {
    sound.playLevelUp();
    const allItemIds = WARDROBE_ITEMS.map((item) => item.id);
    return this.updatePlayerHamster(username, {
      inventory: allItemIds,
      speechBubble: {
        text: "กรี๊ดดด! GM เสกตู้เสื้อผ้าเต็มตู้ มีชุดครบทุกแบบในเกมแล้ว! 👗✨",
        timestamp: Date.now(),
        duration: 5000,
      },
    });
  }

  // ปลดล็อค Gold Pass ให้ฟรี
  async unlockGoldPass(username) {
    sound.playLevelUp();
    const curr = await this.getPlayerHamster(username);
    return this.updatePlayerHamster(username, {
      pass: {
        ...(curr?.pass || {}),
        hasGoldPass: true,
      },
      speechBubble: {
        text: "ว้าววว! GM อัปเกรดเป็น Gold Pass ให้ฟรีแล้วจ้า! 🌟🎟️",
        timestamp: Date.now(),
        duration: 5000,
      },
    });
  }
}

export const adminService = new AdminService();
