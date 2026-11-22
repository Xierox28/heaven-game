import React from "react";

const STAT_CONFIG = [
  {
    key: "hunger",
    label: "ความหิว",
    emoji: "🥣",
    barGradient: "bg-gradient-to-r from-amber-400 to-yellow-400",
    critColor: "bg-gradient-to-r from-red-500 to-rose-500",
    bg: "bg-gradient-to-b from-amber-50/95 to-orange-50/60",
    border: "border-amber-200/90",
    text: "text-amber-800",
    pillBg: "bg-amber-100/80 text-amber-900 border-amber-300/80",
    darkBg: "bg-slate-900/90",
    darkBorder: "border-amber-500/40",
    darkText: "text-amber-300",
    darkPillBg: "bg-amber-950/80 text-amber-200 border-amber-500/40",
  },
  {
    key: "happiness",
    label: "ความสุข",
    emoji: "💖",
    barGradient: "bg-gradient-to-r from-rose-400 to-pink-500",
    critColor: "bg-gradient-to-r from-red-500 to-rose-500",
    bg: "bg-gradient-to-b from-rose-50/95 to-pink-50/60",
    border: "border-rose-200/90",
    text: "text-rose-800",
    pillBg: "bg-rose-100/80 text-rose-900 border-rose-300/80",
    darkBg: "bg-slate-900/90",
    darkBorder: "border-rose-500/40",
    darkText: "text-rose-300",
    darkPillBg: "bg-rose-950/80 text-rose-200 border-rose-500/40",
  },
  {
    key: "cleanliness",
    label: "ความสะอาด",
    emoji: "✨",
    barGradient: "bg-gradient-to-r from-sky-400 to-cyan-400",
    critColor: "bg-gradient-to-r from-red-500 to-rose-500",
    bg: "bg-gradient-to-b from-sky-50/95 to-cyan-50/60",
    border: "border-sky-200/90",
    text: "text-sky-800",
    pillBg: "bg-sky-100/80 text-sky-900 border-sky-300/80",
    darkBg: "bg-slate-900/90",
    darkBorder: "border-sky-500/40",
    darkText: "text-sky-300",
    darkPillBg: "bg-sky-950/80 text-sky-200 border-sky-500/40",
  },
  {
    key: "energy",
    label: "พลังงาน",
    emoji: "⚡",
    barGradient: "bg-gradient-to-r from-indigo-400 to-purple-500",
    critColor: "bg-gradient-to-r from-red-500 to-rose-500",
    bg: "bg-gradient-to-b from-indigo-50/95 to-purple-50/60",
    border: "border-indigo-200/90",
    text: "text-indigo-800",
    pillBg: "bg-indigo-100/80 text-indigo-900 border-indigo-300/80",
    darkBg: "bg-slate-900/90",
    darkBorder: "border-indigo-500/40",
    darkText: "text-indigo-300",
    darkPillBg: "bg-indigo-950/80 text-indigo-200 border-indigo-500/40",
  },
];

export default function StatusBars({ state, onInstantRefresh, isDarkMode = false, isCompact = false }) {
  const { level = 1, exp = 0, maxExp = 100, isSleeping, prestige } = state || {};
  const expPercent = Math.min(100, Math.round(((exp || 0) / (maxExp || 100)) * 100));
  const prestigeRank = prestige?.rank || 0;

  const anyLow = ["hunger", "happiness", "cleanliness", "energy"].some(
    (k) => (state?.[k] || 0) < 35
  );

  return (
    <div className={`w-full ${isCompact ? "space-y-1.5" : "space-y-2.5"} font-['Itim',sans-serif]`}>
      {/* ============================================================
          EXP / LEVEL BAR (Cozy Candy Level Capsule)
          ============================================================ */}
      <div
        className={`rounded-2xl transition-all ${
          isCompact ? "p-2" : "p-2.5 sm:p-3"
        } shadow-xs border-2 ${
          isDarkMode
            ? "dark-card-glass border-slate-700/80 text-white"
            : "bg-white/90 backdrop-blur-md border-amber-200/90 hover:border-amber-300"
        }`}
      >
        <div className="flex items-center justify-between mb-1 text-xs">
          <div className="flex items-center space-x-1.5 font-black">
            {/* Level Badge with Star */}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-white rounded-xl px-2.5 py-0.5 text-xs shadow-xs flex items-center space-x-1 border border-yellow-200/60">
              <span className="animate-star-shine inline-block">⭐</span>
              <span className="font-extrabold tracking-wide">Lv. {level}</span>
            </span>

            {/* Prestige Star Badge if active */}
            {prestigeRank > 0 && (
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-600 shadow-2xs animate-pulse">
                ★{prestigeRank}
              </span>
            )}

            <span className={`font-extrabold text-[12px] ${isDarkMode ? "text-amber-300" : "text-amber-900"}`}>
              ระดับสายสัมพันธ์
            </span>
          </div>

          {/* EXP Numbers & % Pill */}
          <div className="flex items-center space-x-1.5">
            <span className={`font-extrabold text-[11px] ${isDarkMode ? "text-slate-300" : "text-amber-800"}`}>
              {exp} / {maxExp} EXP
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-md border shadow-2xs ${
                isDarkMode
                  ? "bg-slate-800 text-amber-300 border-slate-650"
                  : "bg-amber-100 text-amber-950 border-amber-300/80"
              }`}
            >
              {expPercent}%
            </span>
          </div>
        </div>

        {/* Glossy Candy Progress Bar */}
        <div
          className={`w-full ${
            isCompact ? "h-2.5" : "h-3.5"
          } rounded-full overflow-hidden border p-0.5 shadow-inner ${
            isDarkMode ? "bg-slate-800/90 border-slate-700/80" : "bg-amber-100/70 border-amber-200/80"
          }`}
        >
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 progress-gloss shadow-xs"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>

      {/* 💎 Quick Full Recovery Banner using Diamonds */}
      {anyLow && onInstantRefresh && (
        <button
          onClick={onInstantRefresh}
          className="w-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 border-2 border-white text-white p-2 sm:p-2.5 rounded-2xl shadow-sm flex items-center justify-between text-left transition-all active:translate-y-0.5 cursor-pointer animate-pulse"
        >
          <div className="flex items-center space-x-2">
            <span className="text-xl">💎</span>
            <div>
              <div className="text-[11px] font-black leading-tight">ฟื้นฟูค่าสถานะเต็ม 100% ทันที!</div>
              <div className="text-[9px] text-cyan-100 font-bold">อิ่มแปล้ อารมณ์ดี สะอาดเอี่ยม พลังเต็มเปี่ยม</div>
            </div>
          </div>
          <span className="text-[10px] bg-white/30 text-white font-black px-2.5 py-1 rounded-xl shadow-xs border border-white/40">
            ใช้ 10 💎
          </span>
        </button>
      )}

      {/* ============================================================
          4 VITAL STATUS CARDS (Tactile 2x2 Grid)
          ============================================================ */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {STAT_CONFIG.map((cfg) => {
          const { key, label, emoji, barGradient, bg, border, text, pillBg, darkBg, darkBorder, darkText, darkPillBg } = cfg;
          const val = Math.max(0, Math.min(100, state[key] || 0));
          const isCritical = val < 15;
          const isLow = val < 35;

          const cardBg = isDarkMode ? darkBg : bg;
          const cardBorder = isDarkMode ? darkBorder : border;
          const textColor = isDarkMode ? darkText : text;
          const badgePill = isDarkMode ? darkPillBg : pillBg;

          return (
            <div
              key={key}
              className={`relative ${cardBg} border-2 ${cardBorder} rounded-2xl ${
                isCompact ? "p-1.5 sm:p-2" : "p-2 sm:p-2.5"
              } transition-all duration-300 shadow-xs ${
                isCritical
                  ? "animate-critical-pulse border-red-400 bg-gradient-to-b from-red-50 to-rose-100/70"
                  : isDarkMode
                  ? "hover:border-slate-500"
                  : "hover:border-amber-300"
              }`}
            >
              {/* Critical Alert Badge */}
              {isCritical && (
                <div className="absolute -top-2.5 -right-1 z-10">
                  <span className="animate-critical-shake inline-block bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md border border-white">
                    ⚠️ ด่วน!
                  </span>
                </div>
              )}

              {/* Title row */}
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center space-x-1 font-extrabold">
                  <span className="text-sm drop-shadow-2xs">{emoji}</span>
                  <span className={`text-[11px] font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {label}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-md border shadow-2xs ${
                    isCritical
                      ? "bg-red-500 text-white border-red-600 animate-pulse"
                      : isLow
                      ? "bg-orange-100 text-orange-900 border-orange-300"
                      : badgePill
                  }`}
                >
                  {val}%
                </span>
              </div>

              {/* Candy Bar Meter */}
              <div
                className={`w-full ${
                  isCompact ? "h-2" : "h-2.5"
                } rounded-full overflow-hidden border p-0.5 shadow-inner ${
                  isDarkMode ? "bg-slate-800/90 border-slate-700/80" : "bg-white/80 border-black/5"
                }`}
              >
                <div
                  className={`h-full rounded-full progress-gloss transition-all duration-500 shadow-xs ${
                    isCritical
                      ? "bar-critical"
                      : isLow
                      ? "bg-gradient-to-r from-orange-400 to-amber-500"
                      : barGradient
                  }`}
                  style={{ width: `${val}%` }}
                />
              </div>

              {/* Fast Sleep Recharge Alert */}
              {key === "energy" && isSleeping && (
                <div className="text-[9px] text-indigo-400 font-black mt-1 animate-pulse flex items-center space-x-1 bg-indigo-950/80 px-1.5 py-0.5 rounded-md border border-indigo-700/60">
                  <span className="animate-bounce">⚡</span>
                  <span>ชาร์จไว 10 วิเต็ม! ({val}%)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
