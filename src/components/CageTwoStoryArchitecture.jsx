import React from "react";
import { Sparkles, Compass, Eye, Coffee, Wind, Moon, Sun, ArrowUp, ArrowDown } from "lucide-react";
import { sound } from "../utils/audio";

/**
 * 🏰 CageTwoStoryArchitecture
 * Component ที่สร้างโครงสร้าง 2 ชั้น (Mezzanine Loft & Ground Floor)
 * พร้อมราวระเบียง บันไดปีน/สไลเดอร์ และจุดกิจกรรมบนชั้น 2 (กล้องส่องดาว, เปลญวน, จานขนม)
 */
export default function CageTwoStoryArchitecture({
  theme,
  currentFloor,
  onSwitchFloor,
  onUseTelescope,
  onUseHammock,
  onUseSnack,
  isMoveMode,
  isDarkMode,
  isNight,
}) {
  if (!theme) return null;
  const hasSecondFloor = Boolean(theme.hasSecondFloor);
  const themeType = theme.themeType || "default";

  // =========================================================================
  // 1. RENDER BALCONY RAILING (ราวกันตกชั้น 2 ตามแต่ละธีม)
  // =========================================================================
  const renderBalconyRailing = () => {
    switch (themeType) {
      case "wood":
        return (
          <div className="relative w-full h-8 flex items-end justify-between px-2 overflow-hidden pointer-events-none select-none">
            {/* Top Wooden Handrail */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#693915] via-[#8f5223] to-[#5a2e0e] border-y border-[#3d1d07] shadow-xs flex items-center justify-around">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1 bg-[#472209] rounded-xs opacity-70"></div>
              ))}
            </div>
            {/* Carved Balusters (เสาราวไม้) */}
            <div className="w-full h-6 pt-2 flex items-center justify-between px-1">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-2 h-4 bg-gradient-to-b from-[#8f5223] via-[#b6733a] to-[#693915] rounded-xs border border-[#4a240a] shadow-2xs"></div>
              ))}
            </div>
            {/* Bottom Baseboard */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#4a240a]"></div>
          </div>
        );

      case "pastel":
        return (
          <div className="relative w-full h-8 flex items-end justify-between px-2 overflow-hidden pointer-events-none select-none">
            {/* Top Golden Handrail */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border-y border-amber-500 shadow-xs flex items-center justify-around">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="text-[8px] text-amber-700 leading-none">✨</span>
              ))}
            </div>
            {/* Golden Heart & Star Filigree Arches */}
            <div className="w-full h-6 pt-2 flex items-center justify-between px-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-2.5 h-4 bg-gradient-to-b from-pink-200 via-rose-200 to-purple-200 rounded-t-full border border-pink-400 shadow-2xs flex items-center justify-center">
                  <span className="text-[7px] text-rose-500">🌸</span>
                </div>
              ))}
            </div>
            {/* Bottom Trim */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 to-purple-400"></div>
          </div>
        );

      case "cyber":
        return (
          <div className="relative w-full h-8 flex items-end justify-between px-1 overflow-hidden pointer-events-none select-none">
            {/* Top Neon Blue Handrail */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 border-y border-cyan-300 shadow-sm shadow-cyan-400/80 flex items-center justify-between px-2">
              <span className="text-[6px] font-mono text-slate-950 font-black tracking-widest">DECK 02 • SYSTEM ONLINE</span>
              <div className="w-2 h-1 bg-emerald-400 animate-pulse rounded-full"></div>
            </div>
            {/* Translucent Cyber Glass Panels */}
            <div className="w-full h-6 pt-1.5 flex items-center justify-between gap-1 px-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 h-4 bg-cyan-500/20 backdrop-blur-xs border border-cyan-400/70 rounded-xs flex items-center justify-center relative">
                  <div className="w-full h-[1px] bg-cyan-400/40"></div>
                  <span className="absolute text-[6px] font-mono text-cyan-300 font-bold opacity-75">#{i + 1}</span>
                </div>
              ))}
            </div>
            {/* Bottom Laser Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-cyan-500 to-indigo-700 shadow-sm shadow-cyan-400"></div>
          </div>
        );

      case "crystal":
        return (
          <div className="relative w-full h-8 flex items-end justify-between px-1 overflow-hidden pointer-events-none select-none">
            {/* Top Crystal Prismatic Rail */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-sky-200 via-white to-cyan-200 border-y border-sky-400 shadow-md shadow-sky-300/80 flex items-center justify-around">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="text-[7px] text-cyan-700 leading-none">💎</span>
              ))}
            </div>
            {/* Faceted Diamond Spindles */}
            <div className="w-full h-6 pt-2 flex items-center justify-between px-1">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="w-2 h-4 bg-gradient-to-b from-white via-cyan-100 to-sky-200 border border-sky-300 rounded-xs rotate-3 shadow-xs"></div>
              ))}
            </div>
            {/* Bottom Frost Trim */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400"></div>
          </div>
        );

      default:
        return null;
    }
  };

  // =========================================================================
  // 2. RENDER STAIRCASE / LADDER / LIFT (ทางเชื่อมระหว่างชั้น 1 และ 2)
  // =========================================================================
  const renderStairs = () => {
    if (!hasSecondFloor) return null;

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSwitchFloor(currentFloor === 2 ? 1 : 2);
        }}
        className="absolute top-12 left-2 sm:left-3 w-16 sm:w-20 h-52 z-30 cursor-pointer group flex flex-col items-center pointer-events-auto"
        title={currentFloor === 2 ? "แตะเพื่อสไลด์ลงมาชั้น 1 🛝" : "แตะเพื่อปีนบันไดขึ้นชั้น 2 🪜"}
      >
        {/* Visual Stairs Graphic */}
        <div className="relative w-full h-full flex flex-col items-center justify-between filter drop-shadow-md group-hover:scale-105 active:scale-95 transition-transform duration-200">
          {themeType === "wood" && (
            <div className="relative w-12 sm:w-14 h-44 bg-gradient-to-b from-[#8f5223] via-[#a86834] to-[#693915] rounded-xl border-2 border-[#4a240a] p-1 flex flex-col justify-around shadow-inner">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-full h-2.5 bg-gradient-to-r from-[#d49b6a] via-[#e2b184] to-[#c58b59] rounded-xs border border-[#4a240a] shadow-xs flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-[#753d16]/40"></div>
                </div>
              ))}
              {/* Wooden Side Rails */}
              <div className="absolute -left-1 top-0 bottom-0 w-2 bg-[#5e3110] rounded-l-xs border-r border-[#3d1d07]"></div>
              <div className="absolute -right-1 top-0 bottom-0 w-2 bg-[#5e3110] rounded-r-xs border-l border-[#3d1d07]"></div>
            </div>
          )}

          {themeType === "pastel" && (
            <div className="relative w-12 sm:w-14 h-44 bg-gradient-to-b from-pink-200 via-rose-200 to-purple-200 rounded-2xl border-2 border-pink-400 p-1 flex flex-col justify-around shadow-inner">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-full h-3 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-full border border-amber-400 shadow-xs flex items-center justify-center">
                  <span className="text-[8px]">⭐</span>
                </div>
              ))}
              {/* Golden Spiral Ribbon Side */}
              <div className="absolute -left-1.5 top-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-300 to-yellow-400 rounded-l-full border border-amber-500 shadow-xs"></div>
              <div className="absolute -right-1.5 top-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-300 to-yellow-400 rounded-r-full border border-amber-500 shadow-xs"></div>
            </div>
          )}

          {themeType === "cyber" && (
            <div className="relative w-12 sm:w-14 h-44 bg-slate-950/90 rounded-2xl border-2 border-cyan-400 p-1 flex flex-col justify-around shadow-lg shadow-cyan-500/30 overflow-hidden">
              {/* Anti-gravity particle beam */}
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] bg-[size:8px_8px] opacity-40 animate-pulse"></div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full h-2.5 bg-cyan-400/80 rounded-xs border border-white/60 shadow-sm shadow-cyan-300 flex items-center justify-between px-1">
                  <div className="w-1.5 h-1 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1 bg-white rounded-full"></div>
                </div>
              ))}
              {/* Glowing Laser Railings */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-300 shadow-md shadow-cyan-400"></div>
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-cyan-300 shadow-md shadow-cyan-400"></div>
            </div>
          )}

          {themeType === "crystal" && (
            <div className="relative w-12 sm:w-14 h-44 bg-gradient-to-b from-sky-900/60 via-cyan-900/50 to-blue-950/60 rounded-2xl border-2 border-sky-300 p-1 flex flex-col justify-around shadow-lg shadow-sky-400/40 backdrop-blur-xs">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-full h-3 bg-gradient-to-r from-sky-100 via-white to-cyan-100 rounded-xs border border-sky-400 shadow-sm flex items-center justify-center">
                  <span className="text-[7px]">❄️</span>
                </div>
              ))}
              {/* Crystal Pillars */}
              <div className="absolute -left-1 top-0 bottom-0 w-2 bg-gradient-to-b from-white to-sky-300 rounded-l-xs border border-sky-400"></div>
              <div className="absolute -right-1 top-0 bottom-0 w-2 bg-gradient-to-b from-white to-sky-300 rounded-r-xs border border-sky-400"></div>
            </div>
          )}

          {/* Interactive Climb / Slide Action Pill */}
          <div className="mt-1">
            <span
              className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center space-x-1 border border-white transition-all ${
                currentFloor === 2
                  ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white animate-pulse"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white animate-bounce"
              }`}
            >
              {currentFloor === 2 ? (
                <>
                  <ArrowDown className="w-3 h-3 stroke-[3]" />
                  <span>สไลด์ลงชั้น 1 🛝</span>
                </>
              ) : (
                <>
                  <ArrowUp className="w-3 h-3 stroke-[3]" />
                  <span>ปีนขึ้นชั้น 2 🪜</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 3. RENDER FLOOR 2 MEZZANINE PLATFORM & ACTIVITIES
  // =========================================================================
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl select-none">
      {/* ============================================================
          FLOOR 2 LOFT MEZZANINE (แสดงเมื่อธีมมี 2 ชั้น)
      ============================================================ */}
      {hasSecondFloor && (
        <div className="absolute top-12 left-18 sm:left-22 right-14 sm:right-16 h-36 z-15 animate-fade-in pointer-events-none">
          {/* Deck Structure (พื้นไม้ / หินอ่อน / กระจกชั้นลอย) */}
          <div className="relative w-full h-full flex flex-col justify-end">
            {/* Themed Upper Wall Ambiance / Window */}
            {themeType === "wood" && (
              <div className="absolute top-1 left-4 right-4 flex items-center justify-between opacity-80 pointer-events-none">
                {/* Cozy Upper Sun Window */}
                <div className="w-14 h-12 bg-amber-100/90 border-2 border-[#5a2e0e] rounded-t-full shadow-sm flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-sky-200 to-amber-100 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
                  </div>
                </div>
                {/* Hanging Warm Lantern */}
                <div className="w-7 h-9 bg-amber-400/90 border border-amber-800 rounded-b-lg shadow-md shadow-amber-300 flex items-center justify-center animate-wiggle">
                  <span className="text-[10px]">🏮</span>
                </div>
              </div>
            )}

            {themeType === "pastel" && (
              <div className="absolute top-1 left-4 right-4 flex items-center justify-between opacity-85 pointer-events-none">
                {/* Castle Spire Arch */}
                <div className="w-16 h-12 bg-pink-100/90 border-2 border-pink-400 rounded-t-full shadow-sm flex items-center justify-center">
                  <span className="text-sm">🏰</span>
                </div>
                {/* Fairy Lights */}
                <div className="flex space-x-1.5 text-xs text-yellow-300 animate-pulse">
                  <span>✨</span><span>🌸</span><span>⭐</span>
                </div>
              </div>
            )}

            {themeType === "cyber" && (
              <div className="absolute top-1 left-4 right-4 flex items-center justify-between opacity-90 pointer-events-none">
                {/* Space Viewport (หน้าต่างชมอวกาศทรงกลม) */}
                <div className="w-16 h-12 bg-slate-950 border-2 border-cyan-400 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center overflow-hidden">
                  <span className="text-base animate-pulse">🪐</span>
                </div>
                {/* HUD Holo-Status */}
                <div className="bg-cyan-950/80 border border-cyan-400/80 rounded-md px-1.5 py-0.5 text-[8px] font-mono text-cyan-300">
                  ORBIT: 420KM 🛰️
                </div>
              </div>
            )}

            {themeType === "crystal" && (
              <div className="absolute top-1 left-4 right-4 flex items-center justify-between opacity-90 pointer-events-none">
                {/* Crystal Chandelier */}
                <div className="w-14 h-12 flex items-center justify-center text-cyan-300 text-lg animate-pulse drop-shadow-md">
                  💎✨
                </div>
                {/* Aurora Borealis Ribbon Header */}
                <div className="text-[8px] font-black text-cyan-200 bg-sky-950/70 border border-cyan-400/60 rounded-full px-2 py-0.5 shadow-xs">
                  AURORA LIVE 🌌
                </div>
              </div>
            )}

            {/* Floor 2 Interactive Activity Props (วางอยู่บนพื้นระเบียง) */}
            {!isMoveMode && (
              <div className="relative z-25 w-full flex items-center justify-between px-3 sm:px-5 pb-1 pointer-events-auto">
                {/* 1. 🔭 Sky Telescope (ส่องกล้องดูดาว) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onUseTelescope) onUseTelescope();
                  }}
                  className="group flex flex-col items-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title={`${theme.telescopeLabel || "กล้องส่องทางไกลชั้น 2"} (แตะเพื่อส่องรับ EXP และเหรียญ!)`}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/90 rounded-2xl border-2 border-amber-400 shadow-sm flex items-center justify-center text-sm sm:text-base group-hover:rotate-12 transition-transform">
                    <span>🔭</span>
                  </div>
                  <span className="text-[7px] sm:text-[8px] font-black bg-amber-950/80 text-amber-200 px-1.5 py-0.2 rounded-full mt-0.5 border border-amber-400/30 whitespace-nowrap">
                    ส่องดาว ✨
                  </span>
                </button>

                {/* 2. 🍪 Premium Loft Snack Bowl (กินขนมชั้น 2) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onUseSnack) onUseSnack();
                  }}
                  className="group flex flex-col items-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title={`${theme.snackLabel || "จานขนมพรีเมียมชั้น 2"} (แตะเพื่อกินขนมฟินๆ!)`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 rounded-2xl border-2 border-amber-300 shadow-sm flex items-center justify-center text-xs sm:text-sm group-hover:scale-110 transition-transform">
                    <span>{themeType === "pastel" ? "🍓" : themeType === "cyber" ? "🧪" : themeType === "crystal" ? "🌟" : "🌻"}</span>
                  </div>
                  <span className="text-[7px] sm:text-[8px] font-black bg-amber-950/80 text-amber-200 px-1.5 py-0.2 rounded-full mt-0.5 border border-amber-400/30 whitespace-nowrap">
                    กินขนม 😋
                  </span>
                </button>

                {/* 3. 🛋️ Sky Hammock / Sunbed (นอนไกวเปลชั้น 2) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onUseHammock) onUseHammock();
                  }}
                  className="group flex flex-col items-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title={`${theme.hammockLabel || "เปลญวนพักผ่อนชั้น 2"} (แตะเพื่อพักผ่อนฟื้นฟูพลังงาน!)`}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/90 rounded-2xl border-2 border-amber-400 shadow-sm flex items-center justify-center text-sm sm:text-base group-hover:-rotate-12 transition-transform">
                    <span>{themeType === "pastel" ? "☁️" : themeType === "cyber" ? "⚡" : themeType === "crystal" ? "👑" : "🛋️"}</span>
                  </div>
                  <span className="text-[7px] sm:text-[8px] font-black bg-amber-950/80 text-amber-200 px-1.5 py-0.2 rounded-full mt-0.5 border border-amber-400/30 whitespace-nowrap">
                    พักผ่อน 💤
                  </span>
                </button>
              </div>
            )}

            {/* Platform Deck Plank (พื้นระเบียงที่มีความหนาและเงาตกกระทบ) */}
            <div className={`relative w-full h-5 rounded-t-md ${theme.deckStyle || "bg-amber-800"}`}>
              {/* Floorboard wood lines / tile joints */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_1px,transparent_1px)] bg-[size:16px_100%]"></div>
            </div>

            {/* Balcony Railing (ราวกันตกด้านหน้า) */}
            {renderBalconyRailing()}

            {/* Drop Shadow Under 2nd Floor Mezzanine */}
            <div className="w-full h-3 bg-gradient-to-b from-black/35 to-transparent pointer-events-none"></div>
          </div>
        </div>
      )}

      {/* ============================================================
          STAIRCASE / LADDER CONNECTOR
      ============================================================ */}
      {!isMoveMode && renderStairs()}

      {/* ============================================================
          FLOOR 1 GROUND BEDDING & PLANE (พื้นกรงชั้น 1 ธรรมชาติ)
      ============================================================ */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none rounded-b-2xl transition-colors duration-500 ${
          theme.groundClass || "bg-gradient-to-t from-amber-300/35 via-amber-200/15 to-transparent border-t-2 border-amber-300/30"
        }`}
      >
        {/* Natural Bedding Texture Chips */}
        <div className="absolute bottom-2 left-6 right-6 flex items-center justify-between opacity-30 text-xs">
          <span>{themeType === "wood" ? "🪵" : themeType === "pastel" ? "🌸" : themeType === "cyber" ? "⚡" : "❄️"}</span>
          <span>{themeType === "wood" ? "🪵" : themeType === "pastel" ? "☁️" : themeType === "cyber" ? "🔩" : "💎"}</span>
          <span>{themeType === "wood" ? "🪵" : themeType === "pastel" ? "🌸" : themeType === "cyber" ? "⚡" : "❄️"}</span>
        </div>
      </div>
    </div>
  );
}
