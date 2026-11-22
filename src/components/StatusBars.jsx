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
  },
];

export default function StatusBars({ state }) {
  const { level = 1, exp = 0, maxExp = 100, isSleeping, prestige } = state || {};
  const expPercent = Math.min(100, Math.round(((exp || 0) / (maxExp || 100)) * 100));
  const prestigeRank = prestige?.rank || 0;

  return (
    <div className="w-full space-y-2.5">
      {/* ============================================================
          EXP / LEVEL BAR (Cozy Candy Level Capsule)
          ============================================================ */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xs border-2 border-amber-200/90 transition-all hover:border-amber-300">
        <div className="flex items-center justify-between mb-1.5 text-xs">
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

            <span className="text-amber-900 font-extrabold text-[12px]">ระดับสายสัมพันธ์</span>
          </div>

          {/* EXP Numbers & % Pill */}
          <div className="flex items-center space-x-1.5">
            <span className="text-amber-800 font-extrabold text-[11px]">
              {exp} / {maxExp} EXP
            </span>
            <span className="bg-amber-100 text-amber-950 text-[10px] font-black px-1.5 py-0.2 rounded-md border border-amber-300/80 shadow-2xs">
              {expPercent}%
            </span>
          </div>
        </div>

        {/* Glossy Candy Progress Bar */}
        <div className="w-full h-3.5 bg-amber-100/70 rounded-full overflow-hidden border border-amber-200/80 p-0.5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 progress-gloss shadow-xs"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>

      {/* ============================================================
          4 VITAL STATUS CARDS (Tactile 2x2 Grid)
          ============================================================ */}
      <div className="grid grid-cols-2 gap-2">
        {STAT_CONFIG.map(({ key, label, emoji, barGradient, critColor, bg, border, text, pillBg }) => {
          const val = Math.max(0, Math.min(100, state[key] || 0));
          const isCritical = val < 15;
          const isLow = val < 35;

          return (
            <div
              key={key}
              className={`relative ${bg} border-2 ${border} rounded-2xl p-2.5 transition-all duration-300 shadow-xs ${
                isCritical
                  ? "animate-critical-pulse border-red-400 bg-gradient-to-b from-red-50 to-rose-100/70"
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
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-1 font-extrabold text-slate-800">
                  <span className="text-sm drop-shadow-2xs">{emoji}</span>
                  <span className="text-[11px] font-bold">{label}</span>
                </div>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-md border shadow-2xs ${
                    isCritical
                      ? "bg-red-500 text-white border-red-600 animate-pulse"
                      : isLow
                      ? "bg-orange-100 text-orange-900 border-orange-300"
                      : pillBg
                  }`}
                >
                  {val}%
                </span>
              </div>

              {/* Candy Bar Meter */}
              <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden border border-black/5 p-0.5 shadow-inner">
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
                <div className="text-[9px] text-indigo-800 font-black mt-1 animate-pulse flex items-center space-x-1 bg-indigo-100/80 px-1.5 py-0.5 rounded-md border border-indigo-200">
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
