// ==============================================================================
// 🔐 PLAYER AUTHENTICATION SERVICE (FIREBASE REALTIME DB + LOCAL FALLBACK)
// ==============================================================================
import { ref, get, set } from "firebase/database";
import { database, isFirebaseConfigured } from "../firebaseConfig";
import { sound } from "../utils/audio";

const CURRENT_USER_KEY = "heaven_current_user_v1";
const LOCAL_USERS_KEY = "heaven_local_users_v1";

class AuthService {
  constructor() {
    this.currentUser = this.loadCurrentUser();
    this.listeners = new Set();
  }

  loadCurrentUser() {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try { cb(this.currentUser); } catch {}
    });
  }

  // Helper for local mock users storage
  getLocalUsers() {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(LOCAL_USERS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  saveLocalUsers(users) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch {}
  }

  // ============================================================================
  // REGISTER
  // ============================================================================
  async register(username, password, hamsterName = "น้องเฮเว่น") {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanHamster = (hamsterName || "น้องเฮเว่น").trim();

    if (!cleanUser || cleanUser.length < 3) {
      throw new Error("ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUser)) {
      throw new Error("ชื่อผู้ใช้ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น");
    }
    if (!cleanPass || cleanPass.length < 4) {
      throw new Error("รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
    }

    // 1. Firebase Online Check
    if (isFirebaseConfigured() && database) {
      const userRef = ref(database, `users/${cleanUser}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        throw new Error("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น");
      }

      const userData = {
        username: cleanUser,
        password: cleanPass,
        hamsterName: cleanHamster,
        createdAt: Date.now(),
      };

      await set(userRef, userData);
      const userSession = { username: cleanUser, hamsterName: cleanHamster };
      this.setCurrentUser(userSession);
      sound.playLevelUp();
      return userSession;
    }

    // 2. Local Fallback
    const localUsers = this.getLocalUsers();
    if (localUsers[cleanUser]) {
      throw new Error("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว (ในระบบ Local)");
    }

    localUsers[cleanUser] = {
      username: cleanUser,
      password: cleanPass,
      hamsterName: cleanHamster,
      createdAt: Date.now(),
    };
    this.saveLocalUsers(localUsers);

    const userSession = { username: cleanUser, hamsterName: cleanHamster };
    this.setCurrentUser(userSession);
    sound.playLevelUp();
    return userSession;
  }

  // ============================================================================
  // LOGIN
  // ============================================================================
  async login(username, password) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      throw new Error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
    }

    // 1. Firebase Online
    if (isFirebaseConfigured() && database) {
      const userRef = ref(database, `users/${cleanUser}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        throw new Error("ไม่พบชื่อผู้ใช้นี้ในระบบ");
      }
      const data = snapshot.val();
      if (data.password !== cleanPass) {
        throw new Error("รหัสผ่านไม่ถูกต้อง");
      }

      const userSession = {
        username: cleanUser,
        hamsterName: data.hamsterName || "น้องเฮเว่น",
      };
      this.setCurrentUser(userSession);
      sound.playLevelUp();
      return userSession;
    }

    // 2. Local Fallback
    const localUsers = this.getLocalUsers();
    const user = localUsers[cleanUser];
    if (!user) {
      throw new Error("ไม่พบชื่อผู้ใช้นี้ในระบบ (Local)");
    }
    if (user.password !== cleanPass) {
      throw new Error("รหัสผ่านไม่ถูกต้อง");
    }

    const userSession = {
      username: cleanUser,
      hamsterName: user.hamsterName || "น้องเฮเว่น",
    };
    this.setCurrentUser(userSession);
    sound.playLevelUp();
    return userSession;
  }

  logout() {
    this.setCurrentUser(null);
    sound.playClick();
  }
}

export const authService = new AuthService();
