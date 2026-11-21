import React, { useState, useEffect, useRef, useCallback } from "react";
import { Moon, Sun, Volume2, VolumeX, Shield, Trophy, Wifi, Sparkles } from "lucide-react";

import { gameStateService } from "../services/gameStateService";
import { isFirebaseConfigured } from "../firebaseConfig";
import { sound } from "../utils/audio";
import { FOOD_ITEMS, ANGRY_QUOTES, SAD_QUOTES } from "../constants/gameData";

import HamsterCharacter from "../components/HamsterCharacter";
import StatusBars from "../components/StatusBars";
import ActionControls from "../components/ActionControls";
import MiniGameWheel from "../components/MiniGameWheel";
import FoodShopModal from "../components/FoodShopModal";
import WardrobeModal from "../components/WardrobeModal";
import SeedRainOverlay from "../components/SeedRainOverlay";
import AnnouncementModal from "../components/AnnouncementModal";
import { AchievementToast, AchievementPanel } from "../components/AchievementSystem";

export default function PlayerView({ onNavigateToAdmin }) {
  const [gameState, setGameState] = useState(gameStateService.currentState);
  const [isMuted, setIsMuted] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isFoodShopOpen, setIsFoodShopOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [pendingAchievement, setPendingAchievement] = useState(null);

  // Double-tap Quick Feed state
  const lastTapRef = useRef(0);
  const DOUBLE_TAP_MS = 350;

  useEffect(() => {
    const unsub = gameStateService.subscribe((s) => setGameState({ ...s }));
    const unsubAch = gameStateService.subscribeAchievement((ach) => setPendingAchievement(ach));
    return () => { unsub(); unsubAch(); };
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
      // double tap!
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
      className={`min-h-screen font-['Itim',sans-serif] transition-colors duration-700 relative overflow-hidden`}
      style={{
        background: isNight
          ? "linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 50%, #0d0d1f 100%)"
          : "linear-gradient(135deg, #fff7ed 0%, #fef3c7 35%, #fff1f2 65%, #f0fdf4 100%)",
      }}
    >
      {/* ---- Animated Background Orbs (Glassmorphism Blobs) ---- */}
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
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 bg-blob-3 ${
            isNight ? "bg-blue-400" : "bg-orange-200"
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

      {/* ---- Main Content ---- */}
      <div className="relative z-10 flex flex-col items-center justify-start p-3 sm:p-5 pb-10">
        <div className="w-full max-w-md space-y-3">

          {/* ============================================================
              HEADER — Glassmorphism Card
          ============================================================ */}
          <header className={`glass rounded-3xl px-4 py-3 shadow-sm flex items-center justify-between ${isNight ? "glass-dark border-white/10" : ""}`}>
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 border-2 border-white/60 flex items-center justify-center text-xl shadow-sm">
                  🐹
                </div>
                {/* Online dot */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isCloud ? "bg-emerald-400" : "bg-blue-400"}`}></div>
              </div>
              <div>
                <h1 className={`font-black text-sm leading-tight shimmer-text`}>Heaven เฮเว่น 🐾</h1>
                <div className="flex items-center space-x-1 mt-0.5">
                  <Wifi className="w-2.5 h-2.5 text-slate-400" />
                  <span className="text-[9px] text-slate-500 font-bold">{isCloud ? "Firebase Real-time" : "Local Sync"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Coin wallet */}
              <div className="bg-gradient-to-r from-amber-300 to-yellow-300 border-2 border-amber-400/60 rounded-xl px-2.5 py-1 flex items-center space-x-1 shadow-xs">
                <span className="text-sm">🌻</span>
                <span className="font-black text-xs text-amber-950">{gameState.coins}</span>
              </div>

              {/* Achievement badge */}
              <button
                onClick={() => setIsAchievementOpen(true)}
                className="relative p-2 glass rounded-xl border border-amber-200/50 hover:bg-amber-50/50 transition-all active:scale-90"
                title="Achievement"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                {achievedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {achievedCount}
                  </span>
                )}
              </button>

              {/* Mute */}
              <button
                onClick={toggleSound}
                className="p-2 glass rounded-xl border border-amber-200/50 hover:bg-amber-50/50 transition-all active:scale-90"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              </button>

              {/* Admin */}
              <button
                onClick={onNavigateToAdmin}
                className="p-2 bg-amber-500 hover:bg-amber-600 rounded-xl border border-amber-600/50 text-white transition-all active:scale-90 shadow-xs"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* ============================================================
              CAGE STAGE — Glassmorphism + Double-tap Quick Feed
          ============================================================ */}
          <div
            className={`relative w-full rounded-3xl border overflow-hidden shadow-lg min-h-[310px] flex flex-col justify-between p-4 cursor-pointer transition-all duration-700 ${
              isNight
                ? "glass-dark border-white/10 shadow-indigo-900/40"
                : "glass border-white/60 shadow-amber-100/60"
            }`}
            onClick={handleCageTap}
            title="ดับเบิ้ลแทปเพื่อให้อาหารด่วน!"
          >
            {/* Night overlay */}
            {isNight && (
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 to-slate-950/70 pointer-events-none z-0"></div>
            )}

            {/* Cage grid pattern */}
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

            {/* Top badge */}
            <div className="relative z-10 self-center">
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-xs glass ${
                isNight ? "border-white/15 text-indigo-200" : "border-white/50 text-amber-900"
              }`}>
                {isNight ? "🌙 Sweet Dreams Room" : "🏡 Heaven's Cozy Room"}
              </span>
            </div>

            {/* Double-tap hint */}
            <div className={`absolute top-12 right-3 z-10 pointer-events-none text-[9px] font-bold px-2 py-1 rounded-full ${
              isNight ? "bg-white/5 text-white/30" : "bg-black/5 text-black/25"
            }`}>
              👆👆 ดับเบิ้ลแทปให้อาหาร
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
              className="absolute top-10 left-3 z-20 cursor-pointer group flex flex-col items-center"
            >
              <div className="relative w-7 h-14 bg-sky-200/80 border-2 border-sky-400/70 rounded-b-xl shadow-xs flex flex-col justify-end p-0.5 overflow-hidden backdrop-blur-sm">
                <div className="w-full h-9 bg-sky-400/80 rounded-b-lg"></div>
                <div className="absolute -bottom-1.5 -right-1 w-2 h-3.5 bg-slate-400 rounded-xs rotate-45 border border-slate-500"></div>
              </div>
              <span className="text-[8px] font-bold text-sky-600 mt-1">💧</span>
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
                  className="cursor-pointer text-xl filter drop-shadow transform hover:scale-125 transition-transform animate-bounce"
                  style={{ animationDelay: `${idx * 0.2}s`, marginLeft: idx > 0 ? "10px" : "0" }}
                  title="คลิกเพื่อเก็บอึ!"
                >
                  💩
                </div>
              ))}
            </div>

            {/* Hamster */}
            <div className="relative z-10 my-auto py-2" onClick={(e) => e.stopPropagation()}>
              <HamsterCharacter
                state={gameState}
                onPet={() => gameStateService.pet()}
              />
            </div>

            {/* Floor seed decoration */}
            <div className="relative z-10 self-end mr-2 flex items-center space-x-1 pointer-events-none">
              <span className="text-lg">🌻</span>
              <div className="w-10 h-2 bg-amber-800/25 rounded-full blur-[1px]"></div>
            </div>
          </div>

          {/* ============================================================
              STATUS BARS
          ============================================================ */}
          <StatusBars state={gameState} />

          {/* ============================================================
              ACTION CONTROLS
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

          {/* Quick Feed tip */}
          <div className="text-center pointer-events-none">
            <span className="text-[10px] text-amber-600/70 font-semibold bg-amber-50/60 px-3 py-1 rounded-full inline-block border border-amber-100">
              💡 ดับเบิ้ลแทปที่กรงเพื่อให้อาหารด่วน! | กดน้องเพื่อลูบหัว
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          MODALS & OVERLAYS
      ============================================================ */}
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
