import React, { useState, useEffect, useRef, useCallback } from "react";
import { Moon, Sun, Volume2, VolumeX, Shield, Trophy, Wifi, Sparkles, User, LogOut, LogIn } from "lucide-react";

import { gameStateService } from "../services/gameStateService";
import { authService } from "../services/authService";
import { isFirebaseConfigured } from "../firebaseConfig";
import { sound } from "../utils/audio";
import { FOOD_ITEMS } from "../constants/gameData";

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
import { AchievementToast, AchievementPanel } from "../components/AchievementSystem";

export default function PlayerView({ onNavigateToAdmin }) {
  const [currentUser, setCurrentUser] = useState(authService.currentUser);
  const [gameState, setGameState] = useState(gameStateService.currentState);
  const [isMuted, setIsMuted] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isFoodShopOpen, setIsFoodShopOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
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

  // Double-tap on cage = Quick Feed
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
  const achievedCount = (gameState.achievements || []).length;

  return (
    <div
      className={`min-h-screen font-['Itim',sans-serif] transition-colors duration-700 relative`}
      style={{
        background: isNight
          ? "linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 50%, #0d0d1f 100%)"
          : "linear-gradient(135deg, #fff7ed 0%, #fef3c7 35%, #fff1f2 65%, #f0fdf4 100%)",
      }}
    >
      {/* Animated Background Blobs */}
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
      <div className="relative z-10 flex flex-col items-center justify-start p-3 sm:p-5 pb-12">
        <div className="w-full max-w-md space-y-3">

          {/* ============================================================
              1. HEADER BAR (User Profile, Leaderboard, Coins, GM, Sound)
          ============================================================ */}
          <header className={`bg-white/90 backdrop-blur-md border border-amber-200/90 rounded-3xl px-3.5 py-2.5 shadow-sm flex items-center justify-between ${isNight ? "bg-slate-900/90 border-slate-700 text-white" : "text-slate-900"}`}>
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
                  title={isCloud ? "Cloud Connected" : "Local Sync"}
                ></div>
              </div>

              <div>
                <h1 className="font-black text-sm leading-tight text-amber-950 flex items-center">
                  <span>{gameState.name || "Heaven (เฮเว่น)"}</span>
                </h1>
                {/* Username badge button */}
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
              2. CAGE STAGE (กรงของน้องเฮเว่น พร้อมกล่องข้อความไม่ตกขอบ)
          ============================================================ */}
          <div
            className={`relative w-full rounded-3xl border-4 shadow-lg min-h-[330px] flex flex-col justify-between p-4 cursor-pointer transition-all duration-700 ${
              isNight
                ? "bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-slate-700 shadow-indigo-950/40"
                : "bg-gradient-to-b from-amber-50 via-orange-50/80 to-amber-100 border-amber-300 shadow-amber-200/50"
            }`}
            onClick={handleCageTap}
            title="ดับเบิ้ลแทปเพื่อให้อาหารด่วน!"
          >
            {/* ซี่กรง background overlay (ใส่ overflow-hidden เฉพาะ layer นี้เพื่อไม่ให้ล้น) */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:18px_18px]"></div>
            </div>

            {/* Top Room Badge & Double-tap hint */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-xs ${
                isNight
                  ? "bg-slate-800/90 border-slate-600 text-indigo-200"
                  : "bg-white/95 border-amber-200 text-amber-950"
              }`}>
                {isNight ? "🌙 Sweet Dreams Room" : `🏡 บ้านของ${gameState.name || "น้องเฮเว่น"}`}
              </span>

              <span className="text-[10px] font-black text-amber-800 bg-amber-200/70 border border-amber-300/80 px-2 py-0.5 rounded-full">
                👆👆 ดับเบิ้ลแทปให้อาหารด่วน
              </span>
            </div>

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

            {/* Poop objects — click to clean */}
            <div className="absolute bottom-3 left-6 right-6 flex items-end pointer-events-auto z-20">
              {Array.from({ length: gameState.poopCount || 0 }).map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    gameStateService.cleanCage();
                  }}
                  className="cursor-pointer text-2xl filter drop-shadow transform hover:scale-125 transition-transform animate-bounce active:scale-90"
                  style={{ animationDelay: `${idx * 0.2}s`, marginLeft: idx > 0 ? "10px" : "0" }}
                  title="คลิกเพื่อเก็บอึ!"
                >
                  💩
                </div>
              ))}
            </div>

            {/* Hamster Character (with clear visible Speech Bubble) */}
            <div className="relative z-10 my-auto py-1" onClick={(e) => e.stopPropagation()}>
              <HamsterCharacter
                state={gameState}
                onPet={() => gameStateService.pet()}
              />
            </div>

            {/* Floor seed decoration */}
            <div className="relative z-10 self-end mr-2 flex items-center space-x-1 pointer-events-none">
              <span className="text-xl">🌻</span>
              <div className="w-12 h-2.5 bg-amber-900/20 rounded-full blur-[1px]"></div>
            </div>
          </div>

          {/* ============================================================
              3. STATUS BARS (4 หลอด: หิว, สุข, สะอาด, พลังงาน)
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
            onOpenWardrobe={() => setIsWardrobeOpen(true)}
          />

          {/* Quick feed hint */}
          <div className="text-center pointer-events-none pt-1">
            <span className="text-[11px] text-amber-900 font-bold bg-amber-100/80 px-3 py-1 rounded-full inline-block border border-amber-200">
              💡 ดับเบิ้ลแทปที่กรงเพื่อให้อาหารด่วน | คลิกที่ตัวน้องเพื่อลูบหัว
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          5. MODALS & REAL-TIME OVERLAYS
      ============================================================ */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          // Handled via authService subscriber
        }}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUsername={currentUser?.username}
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
        inventory={gameState.inventory || []}
        equipped={gameState.equipped || {}}
        onBuyItem={(id) => gameStateService.buyItem(id)}
        onToggleEquip={(type, id) => gameStateService.toggleEquip(type, id)}
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
