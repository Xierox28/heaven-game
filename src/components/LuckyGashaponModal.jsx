import React, { useState } from "react";
import { X, Sparkles, Crown, Gift, RotateCcw, Home, Star, Check } from "lucide-react";
import { GASHAPON_POOL, MANSION_THEMES, BUDDY_PETS } from "../constants/gameData";
import { sound } from "../utils/audio";
import confetti from "canvas-confetti";

export default function LuckyGashaponModal({
  state,
  isOpen,
  onClose,
  onSpin,
  onEquipBuddy,
  onBuyTheme,
  onEquipTheme,
}) {
  const [activeTab, setActiveTab] = useState("gashapon"); // 'gashapon' | 'mansion' | 'buddies'
  const [spinning, setSpinning] = useState(false);
  const [spinResults, setSpinResults] = useState(null);

  if (!isOpen) return null;

  const coins = state?.coins || 0;
  const unlockedBuddies = state?.unlockedBuddies || ["buddy_piyo"];
  const equippedBuddy = state?.equippedBuddy || "buddy_piyo";
  const unlockedThemes = state?.unlockedThemes || ["default_grid"];
  const mansionTheme = state?.mansionTheme || "default_grid";

  const handleSpin = (count) => {
    const cost = count === 10 ? 1350 : 150;
    if (coins < cost || spinning) return;

    sound.playLevelUp();
    setSpinning(true);
    setSpinResults(null);

    // Bouncing animation
    setTimeout(() => {
      const results = onSpin(count);
      setSpinResults(results);
      setSpinning(false);

      // Check if SSR
      const hasSSR = results?.some((r) => r.rarity === "SSR");
      if (hasSSR) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#FF69B4", "#00FFFF"],
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-purple-50 via-pink-50/70 to-amber-50/80 border-4 border-purple-300 rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-200">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎰</span>
            <div>
              <h2 className="text-lg font-black text-purple-950">ตู้กาชาปอง & คฤหาสน์หรู</h2>
              <p className="text-[11px] font-bold text-purple-800">ศูนย์รวมความลักชัวรี่สำหรับชาวกระเป๋าหนัก</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 mt-3 bg-purple-200/60 rounded-2xl">
          <button
            onClick={() => { sound.playClick(); setActiveTab("gashapon"); setSpinResults(null); }}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1 transition-all ${
              activeTab === "gashapon" ? "bg-white text-purple-900 shadow-md scale-[1.02]" : "text-purple-950 hover:bg-white/40"
            }`}
          >
            <span>🎰 ตู้กาชาปอง</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab("mansion"); }}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1 transition-all ${
              activeTab === "mansion" ? "bg-white text-amber-900 shadow-md scale-[1.02]" : "text-purple-950 hover:bg-white/40"
            }`}
          >
            <span>🏰 อัปเกรดกรง</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab("buddies"); }}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1 transition-all ${
              activeTab === "buddies" ? "bg-white text-emerald-900 shadow-md scale-[1.02]" : "text-purple-950 hover:bg-white/40"
            }`}
          >
            <span>🐥 คู่หูตัวจิ๋ว</span>
          </button>
        </div>

        {/* Coins indicator */}
        <div className="flex items-center justify-between px-3 py-1.5 my-2 bg-amber-100/90 border border-amber-300 rounded-xl text-xs font-black text-amber-950">
          <span>🌻 เมล็ดทานตะวันของคุณ:</span>
          <span className="text-sm text-amber-700 font-extrabold">{coins.toLocaleString()} เมล็ด</span>
        </div>

        {/* =========================================================================
            TAB 1: GASHAPON
        ========================================================================= */}
        {activeTab === "gashapon" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-center">
            {/* Gashapon Machine Visual */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              <img
                src="/assets/gashapon/gashapon_machine.png"
                alt="Gashapon"
                className={`w-36 h-36 object-contain pixel-art drop-shadow-xl transition-all duration-300 ${
                  spinning ? "animate-bounce scale-110" : "hover:scale-105"
                }`}
              />

              {/* Rarity Rates Badge */}
              <div className="flex items-center space-x-2 mt-2 text-[10px] font-black">
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full border border-amber-300">
                  👑 SSR (3%)
                </span>
                <span className="px-2 py-0.5 bg-purple-200 text-purple-900 rounded-full border border-purple-300">
                  🌟 SR (17%)
                </span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full border border-slate-300">
                  Common (80%)
                </span>
              </div>
            </div>

            {/* Results Display */}
            {spinResults && spinResults.length > 0 && (
              <div className="bg-white/95 rounded-2xl border-2 border-purple-300 p-3 shadow-lg animate-slide-in-up">
                <div className="text-xs font-black text-purple-950 mb-2">🎉 ยินดีด้วย! ของรางวัลที่คุณได้รับ:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {spinResults.map((r, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border-2 flex flex-col items-center text-center ${
                        r.rarity === "SSR"
                          ? "bg-amber-50 border-amber-400 shadow-md animate-pulse"
                          : r.rarity === "SR"
                          ? "bg-purple-50 border-purple-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <span className="text-2xl mb-1">{r.icon}</span>
                      <span className="text-[11px] font-black text-slate-900 truncate w-full">{r.name}</span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded-full mt-1 ${
                          r.rarity === "SSR"
                            ? "bg-amber-400 text-amber-950 font-extrabold"
                            : r.rarity === "SR"
                            ? "bg-purple-300 text-purple-950 font-bold"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {r.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spin Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={coins < 150 || spinning}
                onClick={() => handleSpin(1)}
                className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center transition-all ${
                  coins >= 150 && !spinning
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md active:scale-95"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <span>สุ่ม 1 ครั้ง</span>
                <span className="text-[11px] font-extrabold opacity-90">🌻 150 เมล็ด</span>
              </button>

              <button
                disabled={coins < 1350 || spinning}
                onClick={() => handleSpin(10)}
                className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                  coins >= 1350 && !spinning
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg active:scale-95 animate-pulse"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <div className="absolute top-0 right-0 bg-red-600 text-[9px] text-white px-2 py-0.5 rounded-bl-lg font-black">
                  ลด 10%
                </div>
                <span>สุ่ม 10 ครั้งรวด!</span>
                <span className="text-[11px] font-extrabold opacity-95">🌻 1,350 เมล็ด (การันตี SR)</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: MANSION THEMES
        ========================================================================= */}
        {activeTab === "mansion" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {MANSION_THEMES.map((theme) => {
              const isOwned = unlockedThemes.includes(theme.id);
              const isEquipped = mansionTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-2xl border-2 border-amber-200 p-3 shadow-sm flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base">🏰</span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">{theme.name}</h3>
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold mt-1 leading-tight">{theme.desc}</p>
                    <div className="text-[11px] font-extrabold text-amber-700 mt-1">
                      {theme.cost === 0 ? "เริ่มต้นฟรี" : `🌻 ${theme.cost.toLocaleString()} เมล็ดทานตะวัน`}
                    </div>
                  </div>

                  {isEquipped ? (
                    <button
                      disabled
                      className="px-3 py-2 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl flex items-center space-x-1 cursor-default"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ใช้งานอยู่</span>
                    </button>
                  ) : isOwned ? (
                    <button
                      onClick={() => onEquipTheme(theme.id)}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95"
                    >
                      เลือกใช้
                    </button>
                  ) : (
                    <button
                      disabled={coins < theme.cost}
                      onClick={() => onBuyTheme(theme.id)}
                      className={`px-3 py-2 rounded-xl font-black text-xs shadow-sm transition-all ${
                        coins >= theme.cost
                          ? "bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-md"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      }`}
                    >
                      ซื้ออัปเกรด
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            TAB 3: BUDDY PETS
        ========================================================================= */}
        {activeTab === "buddies" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="bg-emerald-100/70 border border-emerald-300 rounded-2xl p-2.5 text-xs font-black text-emerald-950 flex items-center space-x-1.5">
              <span>🐥</span>
              <span>เลือกสัตว์เลี้ยงคู่หูตัวจิ๋วให้เดินตามน้องเฮเว่นในกรง พร้อมรับสกิลสนับสนุนสุดเจ๋ง!</span>
            </div>

            {BUDDY_PETS.map((buddy) => {
              const isOwned = unlockedBuddies.includes(buddy.id);
              const isEquipped = equippedBuddy === buddy.id;

              return (
                <div
                  key={buddy.id}
                  className="bg-white rounded-2xl border-2 border-emerald-200 p-3 shadow-sm flex items-center space-x-3"
                >
                  <img
                    src={buddy.image}
                    alt={buddy.name}
                    className="w-14 h-14 object-contain pixel-art bg-emerald-50 rounded-xl p-1 border border-emerald-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">{buddy.name}</h3>
                      <span className="text-[9px] font-black px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                        {buddy.rarity}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-700 font-extrabold mt-0.5">✨ {buddy.perk}</p>
                    <p className="text-[9px] text-slate-500 font-bold mt-0.5">{buddy.desc}</p>
                  </div>

                  {isEquipped ? (
                    <button
                      disabled
                      className="px-3 py-2 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl flex items-center space-x-1 cursor-default flex-shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>เดินตามอยู่</span>
                    </button>
                  ) : isOwned ? (
                    <button
                      onClick={() => onEquipBuddy(buddy.id)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex-shrink-0"
                    >
                      เลือกใช้
                    </button>
                  ) : (
                    <div className="text-[11px] font-black text-slate-400 flex-shrink-0">
                      ลุ้นได้จากตู้กาชาปอง
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
