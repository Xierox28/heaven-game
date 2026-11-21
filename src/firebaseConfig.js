// ==============================================================================
// 🐹 FIREBASE REALTIME DATABASE CONFIGURATION
// ==============================================================================
// นำค่า Config ที่ได้จาก Firebase Console (Project Settings > General > Your apps)
// มาวางแทนที่ค่าว่างใน object ด้านล่างนี้ หรือใส่ในไฟล์ .env.local
//
// หมายเหตุ: หากยังไม่ได้ใส่ Key ระบบจะทำงานในโหมด "Demo / Offline Sync"
// ซึ่งซิงก์ข้อมูลข้ามแท็บ (Player <-> Admin) ผ่าน BroadcastChannel ทันทีโดยไม่ error!
// ==============================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// ตรวจสอบว่าใส่ Firebase Key จริงหรือยัง
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("YOUR_API_KEY") &&
    firebaseConfig.databaseURL &&
    !firebaseConfig.databaseURL.includes("YOUR_PROJECT_ID")
  );
};

// Initialize Firebase
let app = null;
let database = null;

if (isFirebaseConfigured()) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    database = getDatabase(app);
    console.log("🐹 [Heaven Game] Firebase Realtime Database connected successfully!");
  } catch (err) {
    console.warn("⚠️ [Heaven Game] Failed to initialize Firebase:", err.message);
  }
} else {
  console.log("ℹ️ [Heaven Game] Running with Local Broadcast Sync (Waiting for Firebase Keys in firebaseConfig.js)");
}

export { app, database, firebaseConfig };
export default firebaseConfig;
