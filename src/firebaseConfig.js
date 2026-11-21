// ==============================================================================
// 🐹 FIREBASE REALTIME DATABASE CONFIGURATION
// ==============================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCCQbiDrtE3yHGuGrBWCweHNjocbT2nFFg",
  authDomain: "heaven-game-b8c5a.firebaseapp.com",
  databaseURL: "https://heaven-game-b8c5a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "heaven-game-b8c5a",
  storageBucket: "heaven-game-b8c5a.firebasestorage.app",
  messagingSenderId: "808381811590",
  appId: "1:808381811590:web:90c64ad78643a85e337a07"
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
