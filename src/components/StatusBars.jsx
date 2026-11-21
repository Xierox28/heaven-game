import React from "react";

const STAT_CONFIG = [
  { key: "hunger",     label: "ความหิว",     emoji: "🥣", barColor: "bg-amber-400",  critColor: "bg-red-500",  bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800"  },
  { key: "happiness",  label: "ความสุข",     emoji: "💖", barColor: "bg-rose-400",   critColor: "bg-red-500",  bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-800"   },
  { key: "cleanliness",label: "ความสะอาด",  emoji: "✨", barColor: "bg-sky-400",    critColor: "bg-red-500",  bg: "bg-sky-50",    border: "border-sky-200",    text: "text-sky-800"    },
  { key: "energy",     label: "พลังงาน",    emoji: "⚡", barColor: "bg-indigo-400", critColor: "bg-red-500",  bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800" },
];

export default function StatusBars({ state }) {
  const { level, exp, maxExp, isSleeping } = state;
  const expPercent = Math.min(100, Math.round(((exp || 0) / (maxExp || 100)) * 100));

  return (
    <div className="w-full space-y-2.5">
      {/* EXP / Level Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 shadow-xs border border-amber-200/80">
        <div className="flex items-center justify-between mb-1 text-xs">
          <div className="flex items-center space-x-1.5 font-black">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl px-2.5 py-0.5 text-xs shadow-xs flex items-center space-x-1">
              <span>⭐</span>
              <span>Lv. {level}</span>
            </span>
            <span className="text-amber-800 font-bold">ระดับสายสัมพันธ์</span>
          </div>
          <span className="text-amber-700 font-bold text-[11px]">{exp} / {maxExp} EXP</span>
        </div>
        <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden border border-amber-200/60">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 shadow-xs"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Status Bars */}
      <div className="grid grid-cols-2 gap-2">
        {STAT_CONFIG.map(({ key, label, emoji, barColor, critColor, bg, border, text }) => {
          const val = Math.max(0, Math.min(100, state[key] || 0));
          const isCritical = val < 15;
          const isLow = val < 35;

          return (
            <div
              key={key}
              className={`relative ${bg} border ${border} rounded-2xl p-2 transition-all duration-300 ${
                isCritical ? "animate-critical-pulse border-red-400 bg-red-50" : ""
              }`}
            >
              {/* Critical badge */}
              {isCritical && (
                <div className="absolute -top-2 -right-1 z-10">
                  <span className="animate-critical-shake inline-block bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                    ⚠️ ด่วน!
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center space-x-1 font-bold text-slate-700">
                  <span>{emoji}</span>
                  <span className="text-[11px]">{label}</span>
                </div>
                <span className={`text-[11px] font-black ${isCritical ? "text-red-600 animate-pulse" : text}`}>
                  {val}%
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden border border-black/5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCritical ? "bar-critical" : isLow ? "bg-orange-400" : barColor
                  }`}
                  style={{ width: `${val}%` }}
                />
              </div>

              {/* Sleep charging indicator */}
              {key === "energy" && isSleeping && (
                <div className="text-[9px] text-indigo-700 font-black mt-0.5 animate-pulse flex items-center space-x-1">
                  <span>⚡ ชาร์จไว 10 วิเต็ม! ({val}%)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
