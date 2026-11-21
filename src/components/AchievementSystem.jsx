import React, { useState, useEffect, useCallback } from "react";
import { X, Trophy, Zap, Play } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../utils/audio";
import { ACHIEVEMENT_DEFS, RARITY_STYLES } from "../constants/gameData";

// ==============================================================================
// ACHIEVEMENT TOAST — pops up briefly when you earn a new achievement
// ==============================================================================
export function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!achievement) return null;
  const style = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-slide-in-down pointer-events-none max-w-sm w-full px-4">
      <div className={`${style.bg} border-2 ${style.border} rounded-2xl p-3 shadow-xl flex items-center space-x-3 ${style.glow}`}>
        <div className="text-3xl animate-badge-pop">{achievement.icon}</div>
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            🏆 Achievement ปลดล็อคแล้ว!
          </div>
          <div className={`font-black text-sm ${style.text}`}>{achievement.name}</div>
          <div className="text-xs text-slate-600">{achievement.desc}</div>
        </div>
        <div className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full border ${style.border} ${style.text} bg-white/60 uppercase`}>
          {style.label}
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// ACHIEVEMENT PANEL — full modal to browse all achievements
// ==============================================================================
export function AchievementPanel({ isOpen, onClose, earnedIds = [] }) {
  if (!isOpen) return null;

  const earned = ACHIEVEMENT_DEFS.filter((a) => earnedIds.includes(a.id));
  const unearned = ACHIEVEMENT_DEFS.filter((a) => !earnedIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 to-orange-50 border-4 border-amber-300 rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <span className="text-3xl">🏆</span>
          <h3 className="text-lg font-black text-amber-900 mt-1">Achievement ของน้องเฮเว่น</h3>
          <p className="text-xs text-amber-700">
            ปลดล็อคแล้ว {earned.length} / {ACHIEVEMENT_DEFS.length} รางวัล
          </p>
          {/* Progress bar */}
          <div className="w-full h-2 bg-amber-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
              style={{ width: `${(earned.length / ACHIEVEMENT_DEFS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="overflow-y-auto space-y-2 pr-1">
          {/* Earned */}
          {earned.length > 0 && (
            <>
              <div className="text-[11px] font-black text-emerald-700 uppercase tracking-wider px-1">✅ ปลดล็อคแล้ว</div>
              {earned.map((ach) => {
                const style = RARITY_STYLES[ach.rarity] || RARITY_STYLES.common;
                return (
                  <div key={ach.id} className={`flex items-center space-x-3 p-2.5 rounded-2xl border-2 ${style.bg} ${style.border} ${style.glow}`}>
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <div className={`font-black text-sm ${style.text}`}>{ach.name}</div>
                      <div className="text-xs text-slate-500">{ach.desc}</div>
                    </div>
                    <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full border ${style.border} ${style.text} bg-white/60 whitespace-nowrap`}>
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {/* Unearned */}
          {unearned.length > 0 && (
            <>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1 mt-2">🔒 ยังไม่ปลดล็อค</div>
              {unearned.map((ach) => {
                const style = RARITY_STYLES[ach.rarity] || RARITY_STYLES.common;
                return (
                  <div key={ach.id} className="flex items-center space-x-3 p-2.5 rounded-2xl border-2 bg-slate-100 border-slate-200 opacity-60">
                    <span className="text-2xl grayscale">{ach.icon}</span>
                    <div>
                      <div className="font-black text-sm text-slate-500">???</div>
                      <div className="text-xs text-slate-400">{ach.desc}</div>
                    </div>
                    <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full border ${style.border} ${style.text} bg-white/40 whitespace-nowrap`}>
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
