import React, { useState, useEffect, useRef, useCallback } from "react";
import { Moon, Sun, Volume2, VolumeX, Shield, Trophy, Wifi, Sparkles, User, LogOut, LogIn, Calendar, Star, Scroll } from "lucide-react";

import { gameStateService } from "../services/gameStateService";
import { authService } from "../services/authService";
import { isFirebaseConfigured } from "../firebaseConfig";
import { sound } from "../utils/audio";
import { FOOD_ITEMS } from "../constants/gameData";
import { FURNITURE_ITEMS } from "../constants/furnitureData";

import HamsterCharacter from "../components/HamsterCharacter";
import StatusBars from "../components/StatusBars";
import ActionControls from "../components/ActionControls";
import MiniGameWheel from "../components/MiniGameWheel";
import FoodShopModal from "../components/FoodShopModal";
import WardrobeModal from "../components/WardrobeModal";
import SeedRainOverlay from "../components/SeedRainOverlay";
import AnnouncementModal from "../components/AnnouncementModal";
import AuthModal from "../components/AuthModal";
import LeaderboardModal from "../components/LeaderboardModal";
import HamsterPassModal from "../components/HamsterPassModal";
import UpdateLogModal from "../components/UpdateLogModal";
import CageDecorModal from "../components/CageDecorModal";
import { AchievementToast, AchievementPanel } from "../components/AchievementSystem";

export default function PlayerView({ onNavigateToAdmin }) {
  const [currentUser, setCurrentUser] = useState(authService.currentUser);
  const [gameState, setGameState] = useState(gameStateService.currentState);
  const [isMuted, setIsMuted] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isFoodShopOpen, setIsFoodShopOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isDecorOpen, setIsDecorOpen] = useState(false);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [isUpdateLogOpen, setIsUpdateLogOpen] = useState(false);
  const [isMoveMode, setIsMoveMode] = useState(false);
  const [selectedDecor, setSelectedDecor] = useState("house");
  const [pendingAchievement, setPendingAchievement] = useState(null);

  // Double-tap Quick Feed state
  const lastTapRef = useRef(0);
  const DOUBLE_TAP_MS = 350;

  useEffect(() => {
    const unsub = gameStateService.subscribe((s) => setGameState({ ...s }));
    const unsubAch = gameStateService.subscribeAchievement((ach) => setPendingAchievement(ach));
    const unsubAuth = authService.subscribe((user) => setCurrentUser(user));
    return () => { unsub(); unsubAch(); unsubAuth(); };
  }, []);

  const toggleSound = () => {
    sound.muted = !sound.muted;
    setIsMuted(sound.muted);
  };

  const handleFeed = () => {
    if (gameState.level >= 3) {
      setIsFoodShopOpen(true);
    } else {
      gameStateService.feed(FOOD_ITEMS[0]);
    }
  };

  // 🏡 FURNITURE POSITION & SCALE HELPERS
  const currentPositions = {
    house: { x: 18, y: 3 },
    toy: { x: 82, y: 3 },
    rug: { x: 50, y: 6 },
    ...(gameState.furniture?.positions || {}),
  };

  const currentScales = {
    house: 1.0,
    toy: 1.0,
    rug: 1.0,
    ...(gameState.furniture?.scales || {}),
  };

  const handleNudgeDecor = (category, dx, dy) => {
    sound.playClick();
    const current = currentPositions[category] || { x: 50, y: 5 };
    const newX = Math.max(8, Math.min(92, current.x + dx));
    const newY = Math.max(1, Math.min(38, current.y + dy));

    gameStateService.updateState((prev) => ({
      ...prev,
      furniture: {
        ...prev.furniture,
        positions: {
          house: { x: 18, y: 3 },
          toy: { x: 82, y: 3 },
          rug: { x: 50, y: 6 },
          ...(prev.furniture?.positions || {}),
          [category]: { x: newX, y: newY },
        },
      },
    }));
  };

  const handleScaleDecor = (category, delta) => {
    sound.playClick();
    const current = currentScales[category] || 1.0;
    const newScale = Math.max(0.6, Math.min(1.6, Math.round((current + delta) * 10) / 10));

    gameStateService.updateState((prev) => ({
      ...prev,
      furniture: {
        ...prev.furniture,
        scales: {
          house: 1.0,
          toy: 1.0,
          rug: 1.0,
          ...(prev.furniture?.scales || {}),
          [category]: newScale,
        },
      },
    }));
  };

  const handleSetDecorPreset = (category, x, y) => {
    sound.playClick();
    gameStateService.updateState((prev) => ({
      ...prev,
      furniture: {
        ...prev.furniture,
        positions: {
          house: { x: 18, y: 3 },
          toy: { x: 82, y: 3 },
          rug: { x: 50, y: 6 },
          ...(prev.furniture?.positions || {}),
          [category]: { x, y },
        },
      },
    }));
  };

  const handleResetAllPositions = () => {
    sound.playClick();
    gameStateService.updateState((prev) => ({
      ...prev,
      furniture: {
        ...prev.furniture,
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
      },
    }));
  };

  const handleCageTap = useCallback(() => {
    if (gameState.isSleeping) return;
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      gameStateService.quickFeed();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [gameState.isSleeping]);

  const isNight = gameState.isSleeping;
  const isCloud = isFirebaseConfigured();
  const streakDays = gameState.streak?.days || 0;
  const todayStr = new Date().toDateString();
  const hasStreakToClaim = gameState.streak?.lastClaimDate !== todayStr;

  return (
    <div
      className={`min-h-screen font-['Itim',sans-serif] transition-colors duration-700 relative`}
      style={{
        background: isNight
          ? "linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 50%, #0d0d1f 100%)"
          : "linear-gradient(135deg, #fff7ed 0%, #fef3c7 35%, #fff1f2 65%, #f0fdf4 100%)",
      }}
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-30 bg-blob-1 ${
            isNight ? "bg-indigo-500" : "bg-amber-300"
          }`}
        ></div>
        <div
          className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25 bg-blob-2 ${
            isNight ? "bg-purple-500" : "bg-rose-300"
          }`}
        ></div>
      </div>

      {/* Achievement Toast */}
      {pendingAchievement && (
        <AchievementToast
          achievement={pendingAchievement}
          onDone={() => setPendingAchievement(null)}
        />
      )}

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-start p-3 sm:p-5 pb-14">
        <div className="w-full max-w-md space-y-3">

          {/* ============================================================
              1. HEADER BAR
          ============================================================ */}
          <header className={`bg-white/95 backdrop-blur-md border border-amber-200/90 rounded-3xl px-3.5 py-2.5 shadow-sm flex items-center justify-between ${isNight ? "bg-slate-900/95 border-slate-700 text-white" : "text-slate-900"}`}>
            {/* Logo + User info */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 border-2 border-white/80 flex items-center justify-center text-xl shadow-xs">
                  🐹
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    isCloud ? "bg-emerald-400" : "bg-blue-400"
                  }`}
                  title={isCloud ? "Firebase Cloud Real-time" : "Local Sync"}
                ></div>
              </div>

              <div>
                <h1 className="font-black text-sm leading-tight text-amber-950 flex items-center">
                  <span>{gameState.name || "Heaven (เฮเว่น)"}</span>
                </h1>
                {/* Username / Account button */}
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center space-x-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 transition-colors mt-0.5"
                >
                  <User className="w-3 h-3 text-amber-600" />
                  <span className="underline decoration-amber-400 underline-offset-2">
                    {currentUser ? `@${currentUser.username}` : "เข้าสู่ระบบ / Guest"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-1.5">
              {/* Coin wallet */}
              <div className="bg-gradient-to-r from-amber-300 to-yellow-300 border border-amber-400 rounded-xl px-2.5 py-1 flex items-center space-x-1 shadow-xs">
                <span className="text-sm">🌻</span>
                <span className="font-black text-xs text-amber-950">{gameState.coins}</span>
              </div>

              {/* Leaderboard Button 🏆 */}
              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="p-2 bg-gradient-to-tr from-yellow-300 to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-amber-950 rounded-xl border border-amber-400 transition-all active:scale-90 shadow-xs"
                title="ตารางอันดับผู้เล่น (Leaderboard)"
              >
                <Trophy className="w-4 h-4 fill-amber-700 text-amber-950" />
              </button>

              {/* Update Log Button 📜 */}
              <button
                onClick={() => setIsUpdateLogOpen(true)}
                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl border border-amber-300 transition-all active:scale-90 shadow-xs"
                title="ประวัติการอัปเดต (Update Log v2.3)"
              >
                <Scroll className="w-4 h-4 text-amber-800" />
              </button>

              {/* Mute button */}
              <button
                onClick={toggleSound}
                className="p-2 bg-amber-100/90 hover:bg-amber-200 text-amber-900 rounded-xl border border-amber-300/70 transition-all active:scale-90"
                title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
              </button>

              {/* GM button */}
              <button
                onClick={onNavigateToAdmin}
                className="p-2 bg-amber-500 hover:bg-amber-600 rounded-xl border border-amber-600 text-white transition-all active:scale-90 shadow-xs"
                title="แผงควบคุม GM"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* ============================================================
              ⭐ PASS & DAILY STREAK QUICK BANNER
          ============================================================ */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsPassOpen(true)}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 text-slate-950 p-2.5 rounded-2xl border-2 border-white shadow-sm flex items-center justify-between text-left transition-all active:scale-95 group"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">🎟️</span>
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider">SEASON 1</div>
                  <div className="text-xs font-black leading-tight text-slate-950">Hamster Pass</div>
                </div>
              </div>
              <span className="text-[10px] bg-white/80 font-black px-2 py-0.5 rounded-full border border-amber-300">
                เควสต์
              </span>
            </button>

            <button
              onClick={() => setIsPassOpen(true)}
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 hover:from-purple-500 text-white p-2.5 rounded-2xl border-2 border-white shadow-sm flex items-center justify-between text-left transition-all active:scale-95 group"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">📅</span>
                <div>
                  <div className="text-[10px] font-black uppercase text-purple-100 tracking-wider">
                    {hasStreakToClaim ? "ยังไม่เช็คชื่อ" : "เช็คชื่อแล้ว"}
                  </div>
                  <div className="text-xs font-black leading-tight">
                    วันที่ {streakDays}/7 วัน
                  </div>
                </div>
              </div>
              {hasStreakToClaim ? (
                <span className="text-[9px] bg-rose-500 text-white font-black px-2 py-0.5 rounded-full animate-bounce shadow-xs">
                  รับ!
                </span>
              ) : (
                <span className="text-[9px] bg-white/30 text-white font-black px-2 py-0.5 rounded-full">
                  ✓
                </span>
              )}
            </button>
          </div>

          {/* ============================================================
              2. CAGE STAGE
          ============================================================ */}
          {(() => {
            const equippedFurniture = gameState.furniture?.equipped || {};
            let wallpaperStyle = "bg-gradient-to-b from-amber-50 via-orange-50/80 to-amber-100 border-amber-300 shadow-amber-200/50";
            if (isNight) {
              wallpaperStyle = "bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-slate-700 shadow-indigo-950/40";
            } else if (equippedFurniture.wallpaper === "sakura_blossom") {
              wallpaperStyle = "bg-gradient-to-b from-pink-100 via-rose-50 to-pink-200 border-pink-300 shadow-pink-200/50";
            } else if (equippedFurniture.wallpaper === "forest_camp") {
              wallpaperStyle = "bg-gradient-to-b from-emerald-100 via-green-50 to-emerald-200 border-emerald-400 shadow-emerald-200/50";
            } else if (equippedFurniture.wallpaper === "galaxy_stars") {
              wallpaperStyle = "bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-950 border-purple-500 shadow-purple-950/50";
            }

            return (
              <div
                className={`relative w-full rounded-3xl border-4 shadow-lg min-h-[330px] flex flex-col justify-between p-4 cursor-pointer transition-all duration-700 ${wallpaperStyle}`}
                onClick={handleCageTap}
                title="ดับเบิ้ลแทปเพื่อให้อาหารด่วน!"
              >
                {/* Background grid pattern */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:18px_18px]"></div>

                  {/* Wallpaper special ambiance */}
                  {equippedFurniture.wallpaper === "sakura_blossom" && !isNight && (
                    <div className="absolute inset-0 flex justify-around opacity-35 text-xs pt-4 select-none">
                      <span>🌸</span><span>🌸</span><span>🌸</span>
                    </div>
                  )}
                  {equippedFurniture.wallpaper === "forest_camp" && !isNight && (
                    <div className="absolute top-2 right-12 opacity-35 text-xl select-none">
                      🌲🌲
                    </div>
                  )}
                  {equippedFurniture.wallpaper === "galaxy_stars" && (
                    <div className="absolute inset-0 opacity-40 flex justify-around pt-3 select-none text-yellow-300 text-xs">
                      <span>✨</span><span>⭐</span><span>✨</span>
                    </div>
                  )}
                </div>

                {/* Room Badge & Decor Action */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-xs ${
                    isNight || equippedFurniture.wallpaper === "galaxy_stars"
                      ? "bg-slate-800/90 border-slate-600 text-indigo-200"
                      : "bg-white/95 border-amber-200 text-amber-950"
                  }`}>
                    {isNight ? "🌙 Sweet Dreams Room" : `🏡 บ้านของ${gameState.name || "น้องเฮเว่น"}`}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setIsDecorOpen(true);
                      }}
                      className="px-2.5 py-1 bg-white/95 hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-[11px] font-black shadow-xs flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                      title="ตกแต่งกรง & ร้านค้าเฟอร์นิเจอร์"
                    >
                      <span>🛋️</span>
                      <span>แต่งห้อง</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setIsMoveMode(!isMoveMode);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black shadow-xs flex items-center space-x-1 cursor-pointer transition-all active:scale-95 border ${
                        isMoveMode
                          ? "bg-amber-500 text-white border-amber-600 shadow-amber-300 shadow-sm"
                          : "bg-white/95 hover:bg-amber-50 text-amber-900 border-amber-300"
                      }`}
                      title="โหมดจัดวางและเลื่อนตำแหน่งของตกแต่ง"
                    >
                      <span>📍</span>
                      <span>{isMoveMode ? "เสร็จสิ้น" : "ย้ายของ"}</span>
                    </button>

                    <span className="text-[10px] font-black text-amber-800 bg-amber-200/70 border border-amber-300/80 px-2 py-0.5 rounded-full hidden sm:inline-block">
                      👆👆 ดับเบิ้ลแทปให้อาหารด่วน
                    </span>
                  </div>
                </div>

                {/* พื้นห้อง / Cage Floor Ground Plane (รองรับเฟอร์นิเจอร์อย่างสมจริง) */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-200/35 via-amber-100/15 to-transparent pointer-events-none rounded-b-2xl border-b-2 border-amber-300/30"></div>

                {/* Water bottle */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (gameState.isSleeping) return;
                    sound.playEat();
                    gameStateService.updateState((prev) => ({
                      ...prev,
                      happiness: Math.min(100, prev.happiness + 5),
                      speechBubble: { text: "จ๊วบๆ... น้ำเย็นชื่นใจจังงับ! 💧🐹", timestamp: Date.now(), duration: 3000 },
                    }));
                  }}
                  className="absolute top-12 left-3 z-20 cursor-pointer group flex flex-col items-center"
                  title="กดเพื่อดื่มน้ำ"
                >
                  <div className="relative w-7 h-14 bg-sky-200/90 border-2 border-sky-400 rounded-b-xl shadow-xs flex flex-col justify-end p-0.5 overflow-hidden">
                    <div className="w-full h-9 bg-sky-400"></div>
                    <div className="absolute -bottom-1.5 -right-1 w-2 h-3.5 bg-slate-400 rounded-xs rotate-45 border border-slate-500"></div>
                  </div>
                  <span className="text-[9px] font-bold text-sky-700 mt-1">💧 ดื่มน้ำ</span>
                </div>

                {/* 🏡 House / Bed Slot (วางบนพื้นกรง ปรับตำแหน่ง & ขนาดได้อิสระ) */}
                {(() => {
                  const houseDef = FURNITURE_ITEMS.find((f) => f.id === equippedFurniture.house);
                  if (!houseDef) return null;
                  const isSelected = isMoveMode && selectedDecor === "house";
                  const scale = currentScales.house || 1.0;
                  return (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        if (isMoveMode) {
                          setSelectedDecor("house");
                        } else {
                          setIsDecorOpen(true);
                        }
                      }}
                      style={{
                        left: `${currentPositions.house.x}%`,
                        bottom: `${currentPositions.house.y}%`,
                        transform: `translateX(-50%) scale(${scale})`,
                        transformOrigin: "bottom center",
                      }}
                      className={`absolute z-10 cursor-pointer group flex flex-col items-center select-none transition-all duration-200 ${
                        isSelected ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-50 rounded-2xl scale-105 shadow-lg shadow-amber-400/40" : ""
                      }`}
                      title={isMoveMode ? "คลิกเพื่อเลือกย้ายบ้าน" : `${houseDef.name} (คลิกเพื่อตกแต่งห้อง)`}
                    >
                      {isMoveMode && (
                        <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full mb-1 shadow-xs animate-bounce">
                          🏠 บ้าน ({Math.round(scale * 100)}%)
                        </span>
                      )}
                      <div className="relative w-26 h-26 sm:w-32 sm:h-32 flex items-end justify-center filter drop-shadow-md group-hover:scale-105 transition-all duration-300">
                        {/* เงาใต้บ้านบนพื้น */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 sm:w-26 h-4 bg-amber-950/20 rounded-full blur-[2px] pointer-events-none"></div>
                        {houseDef.image ? (
                          <img
                            src={houseDef.image}
                            alt={houseDef.name}
                            className="w-full h-full object-contain pixel-art drop-shadow-sm"
                          />
                        ) : (
                          <span className="text-4xl">{houseDef.icon}</span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 🎠 Toy Slot (วางบนพื้นกรง ปรับตำแหน่ง & ขนาดได้อิสระ) */}
                {(() => {
                  const toyDef = FURNITURE_ITEMS.find((f) => f.id === equippedFurniture.toy);
                  if (!toyDef) return null;
                  const isSelected = isMoveMode && selectedDecor === "toy";
                  const scale = currentScales.toy || 1.0;
                  return (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playPet();
                        if (isMoveMode) {
                          setSelectedDecor("toy");
                        } else {
                          setIsDecorOpen(true);
                        }
                      }}
                      style={{
                        left: `${currentPositions.toy.x}%`,
                        bottom: `${currentPositions.toy.y}%`,
                        transform: `translateX(-50%) scale(${scale})`,
                        transformOrigin: "bottom center",
                      }}
                      className={`absolute z-10 cursor-pointer group flex flex-col items-center select-none transition-all duration-200 ${
                        isSelected ? "ring-4 ring-orange-400 ring-offset-2 ring-offset-orange-50 rounded-2xl scale-105 shadow-lg shadow-orange-400/40" : ""
                      }`}
                      title={isMoveMode ? "คลิกเพื่อเลือกย้ายของเล่น" : `${toyDef.name} (คลิกเพื่อตกแต่งห้อง)`}
                    >
                      {isMoveMode && (
                        <span className="text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-full mb-1 shadow-xs animate-bounce">
                          🎠 ของเล่น ({Math.round(scale * 100)}%)
                        </span>
                      )}
                      <div className="relative w-22 h-22 sm:w-26 sm:h-26 flex items-end justify-center filter drop-shadow-md group-hover:scale-105 transition-all duration-300">
                        {/* เงาใต้ของเล่นบนพื้น */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-18 sm:w-22 h-3.5 bg-amber-950/20 rounded-full blur-[2px] pointer-events-none"></div>
                        {toyDef.image ? (
                          <img
                            src={toyDef.image}
                            alt={toyDef.name}
                            className={`w-full h-full object-contain pixel-art drop-shadow-sm ${
                              toyDef.id === "wooden_swing" ? "animate-[floatAngryPuff_2s_ease-in-out_infinite]" : ""
                            }`}
                          />
                        ) : (
                          <span className="text-3xl">{toyDef.icon}</span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Poop objects (กระจายบนพื้นด้านหน้า) */}
                <div className="absolute bottom-2 left-32 right-32 flex justify-center items-end pointer-events-auto z-25">
                  {Array.from({ length: gameState.poopCount || 0 }).map((_, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        gameStateService.cleanCage();
                      }}
                      className="cursor-pointer text-2xl filter drop-shadow transform hover:scale-125 transition-transform animate-bounce active:scale-90"
                      style={{ animationDelay: `${idx * 0.2}s`, margin: "0 4px" }}
                      title="คลิกเพื่อเก็บอึ!"
                    >
                      💩
                    </div>
                  ))}
                </div>

                {/* 🧶 Rug Slot (พรมปูพื้น Pixel Art รองใต้ตัวน้องบนพื้นกรง) */}
                {(() => {
                  const rugDef = FURNITURE_ITEMS.find((f) => f.id === equippedFurniture.rug);
                  if (!rugDef) return null;
                  const isSelected = isMoveMode && selectedDecor === "rug";
                  const scale = currentScales.rug || 1.0;
                  return (
                    <div
                      onClick={(e) => {
                        if (isMoveMode) {
                          e.stopPropagation();
                          sound.playClick();
                          setSelectedDecor("rug");
                        }
                      }}
                      style={{
                        left: `${currentPositions.rug.x}%`,
                        bottom: `${currentPositions.rug.y}%`,
                        transform: `translateX(-50%) scale(${scale})`,
                        transformOrigin: "bottom center",
                      }}
                      className={`absolute z-0 filter drop-shadow-xs flex items-center justify-center transition-all duration-200 ${
                        isMoveMode ? "cursor-pointer" : "pointer-events-none"
                      } ${isSelected ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-50 rounded-2xl scale-105 shadow-lg shadow-amber-400/40" : ""}`}
                    >
                      {rugDef.image ? (
                        <img
                          src={rugDef.image}
                          alt={rugDef.name}
                          className="w-56 sm:w-68 max-h-20 object-contain pixel-art drop-shadow-xs opacity-95"
                        />
                      ) : (
                        <div className="w-52 sm:w-60 h-10 bg-amber-100/90 border-2 border-white rounded-full shadow-inner flex items-center justify-center text-xs opacity-75">
                          {rugDef.icon}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Hamster Character */}
                <div className="relative z-10 my-auto py-1" onClick={(e) => e.stopPropagation()}>
                  <HamsterCharacter
                    state={gameState}
                    onPet={() => gameStateService.pet()}
                  />
                </div>

                {/* Floor decoration */}
                <div className="relative z-10 self-end mr-2 flex items-center space-x-1 pointer-events-none">
                  <span className="text-xl">🌻</span>
                  <div className="w-12 h-2.5 bg-amber-900/20 rounded-full blur-[1px]"></div>
                </div>
              </div>
            );
          })()}

          {/* 📍 MOVE & SCALE FURNITURE TOOLBAR (แผงควบคุมเลื่อนจัดวาง & ปรับขนาดของตกแต่ง) */}
          {isMoveMode && (
            <div className="mt-2.5 bg-white/95 backdrop-blur-md border-2 border-amber-300 rounded-2xl p-3 shadow-lg flex flex-col space-y-2.5 animate-slide-in-down">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black text-amber-950">📍 กำลังจัดวาง:</span>
                  <span className="text-xs text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200">
                    {selectedDecor === "house" ? "🏠 บ้าน/ที่นอน" : selectedDecor === "toy" ? "🎠 ของเล่น" : "🧶 พรม"}
                  </span>
                </div>

                {/* Category selector */}
                <div className="flex space-x-1">
                  {[
                    { id: "house", label: "🏠 บ้าน" },
                    { id: "toy", label: "🎠 ของเล่น" },
                    { id: "rug", label: "🧶 พรม" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedDecor(tab.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                        selectedDecor === tab.id
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls: Movement + Scale + Presets */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200">
                {/* D-Pad Buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleNudgeDecor(selectedDecor, -6, 0)}
                    className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm border border-amber-300 flex items-center justify-center active:scale-90 shadow-xs"
                    title="เลื่อนซ้าย"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => handleNudgeDecor(selectedDecor, 6, 0)}
                    className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm border border-amber-300 flex items-center justify-center active:scale-90 shadow-xs"
                    title="เลื่อนขวา"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => handleNudgeDecor(selectedDecor, 0, 4)}
                    className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm border border-amber-300 flex items-center justify-center active:scale-90 shadow-xs"
                    title="เลื่อนขึ้น"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleNudgeDecor(selectedDecor, 0, -4)}
                    className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm border border-amber-300 flex items-center justify-center active:scale-90 shadow-xs"
                    title="เลื่อนลง"
                  >
                    ▼
                  </button>
                </div>

                {/* Scale buttons */}
                <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl">
                  <span className="text-[10px] font-black text-amber-900">ขนาด:</span>
                  <button
                    onClick={() => handleScaleDecor(selectedDecor, -0.15)}
                    className="w-6 h-6 rounded-lg bg-white hover:bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 flex items-center justify-center active:scale-90 shadow-2xs"
                    title="ย่อขนาด (-15%)"
                  >
                    -
                  </button>
                  <span className="text-[10px] font-black text-amber-900 min-w-[34px] text-center">
                    {Math.round((currentScales[selectedDecor] || 1.0) * 100)}%
                  </span>
                  <button
                    onClick={() => handleScaleDecor(selectedDecor, 0.15)}
                    className="w-6 h-6 rounded-lg bg-white hover:bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 flex items-center justify-center active:scale-90 shadow-2xs"
                    title="ขยายขนาด (+15%)"
                  >
                    +
                  </button>
                </div>

                {/* Preset shortcuts & Swap button */}
                <div className="flex items-center space-x-1 ml-auto">
                  <button
                    onClick={() => handleSetDecorPreset(selectedDecor, 18, 3)}
                    className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black"
                  >
                    ซ้าย
                  </button>
                  <button
                    onClick={() => handleSetDecorPreset(selectedDecor, 50, 4)}
                    className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black"
                  >
                    กลาง
                  </button>
                  <button
                    onClick={() => handleSetDecorPreset(selectedDecor, 82, 3)}
                    className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black"
                  >
                    ขวา
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsDecorOpen(true);
                    }}
                    className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black flex items-center space-x-0.5 active:scale-95 shadow-xs"
                    title="เปลี่ยนเป็นไอเทมชิ้นอื่น"
                  >
                    <span>🔄</span>
                    <span>เปลี่ยนชิ้น</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              3. STATUS BARS
          ============================================================ */}
          <StatusBars state={gameState} />

          {/* ============================================================
              4. ACTION CONTROLS & MINI-GAMES
          ============================================================ */}
          <ActionControls
            state={gameState}
            onFeed={handleFeed}
            onPet={() => gameStateService.pet()}
            onClean={() => gameStateService.cleanCage()}
            onToggleSleep={() => gameStateService.toggleSleep()}
            onOpenWheel={() => setIsWheelOpen(true)}
            onOpenFoodShop={() => setIsFoodShopOpen(true)}
            onOpenDecor={() => setIsDecorOpen(true)}
            onOpenWardrobe={() => setIsWardrobeOpen(true)}
          />

          {/* Quick feed hint & Update Log shortcut */}
          <div className="flex items-center justify-between pt-1 px-1">
            <span className="text-[11px] text-amber-900 font-bold bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
              💡 ดับเบิ้ลแทปที่กรงเพื่อให้อาหารด่วน
            </span>
            <button
              onClick={() => setIsUpdateLogOpen(true)}
              className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center space-x-1"
            >
              <Scroll className="w-3 h-3 text-amber-700" />
              <span>ประวัติอัปเดต (v3.1)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          5. MODALS & REAL-TIME OVERLAYS
      ============================================================ */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {}}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUsername={currentUser?.username}
      />

      <UpdateLogModal
        isOpen={isUpdateLogOpen}
        onClose={() => setIsUpdateLogOpen(false)}
      />

      <CageDecorModal
        isOpen={isDecorOpen}
        onClose={() => setIsDecorOpen(false)}
        coins={gameState.coins}
        userLevel={gameState.level}
        furniture={gameState.furniture || {}}
        onBuy={(id) => gameStateService.buyFurniture(id)}
        onEquip={(cat, id) => gameStateService.toggleEquipFurniture(cat, id)}
        onOpenBox={(boxId) => gameStateService.openMysteryBox(boxId)}
      />

      <HamsterPassModal
        isOpen={isPassOpen}
        onClose={() => setIsPassOpen(false)}
        gameState={gameState}
        onUnlockGoldPass={() => gameStateService.unlockGoldPass()}
        onClaimFreePass={(level, reward) => gameStateService.claimFreePass(level, reward)}
        onClaimGoldPass={(level, reward) => gameStateService.claimGoldPass(level, reward)}
        onClaimQuest={(id, exp, coins) => gameStateService.claimQuest(id, exp, coins)}
        onClaimDailyStreak={(item) => gameStateService.claimDailyStreak(item)}
      />

      <MiniGameWheel
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onFinish={(coins, exp) => gameStateService.rewardMiniGame(coins, exp)}
      />

      <FoodShopModal
        isOpen={isFoodShopOpen}
        onClose={() => setIsFoodShopOpen(false)}
        coins={gameState.coins}
        userLevel={gameState.level}
        onSelectFood={(food) => { gameStateService.feed(food); }}
      />

      <WardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        coins={gameState.coins}
        userLevel={gameState.level}
        inventory={gameState.inventory || []}
        equipped={gameState.equipped || {}}
        wardrobeOffsets={gameState.wardrobeOffsets || {}}
        currentBreed={gameState.breed || "winter_white"}
        unlockedBreeds={gameState.unlockedBreeds || ["winter_white"]}
        currentPersonality={gameState.personality || "affectionate"}
        onBuyItem={(id) => gameStateService.buyItem(id)}
        onToggleEquip={(type, id) => gameStateService.toggleEquip(type, id)}
        onAdjustOffset={(id, dx, dy, ds) => gameStateService.adjustWardrobeOffset(id, dx, dy, ds)}
        onResetOffset={(id) => gameStateService.resetWardrobeOffset(id)}
        onSelectBreed={(id) => gameStateService.setBreed(id)}
        onBuyBreed={(id) => gameStateService.buyBreed(id)}
        onSelectPersonality={(id) => gameStateService.setPersonality(id)}
      />

      <AchievementPanel
        isOpen={isAchievementOpen}
        onClose={() => setIsAchievementOpen(false)}
        earnedIds={gameState.achievements || []}
      />

      <SeedRainOverlay
        isActive={gameState.seedRainEvent?.active}
        onCollect={() => gameStateService.collectRainSeed()}
        onEnd={() => gameStateService.stopSeedRain()}
      />

      <AnnouncementModal
        announcement={gameState.announcement}
        onDismiss={() => gameStateService.dismissAnnouncement()}
      />
    </div>
  );
}
