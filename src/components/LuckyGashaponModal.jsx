import React, { useState } from "react";
import { X, Sparkles, Crown, Gift, RotateCcw, Home, Star, Check, Flame, Coins, HeartHandshake, Gem, ShieldAlert } from "lucide-react";
import {
  GASHAPON_POOL,
  HIGH_ROLLER_GASHAPON_POOL,
  MANSION_THEMES,
  BUDDY_PETS,
  PRESTIGE_TIERS,
  MINT_EXCHANGE_TIERS,
  SHRINE_DONATION_TIERS,
  SHRINE_BLESSING_SHOP,
} from "../constants/gameData";
import { sound } from "../utils/audio";
import confetti from "canvas-confetti";

export default function LuckyGashaponModal({
  state,
  isOpen,
  onClose,
  onSpin,
  onSpinHighRoller,
  onPrestige,
  onMintDiamonds,
  onDonateShrine,
  onClaimFaithReward,
  onEquipBuddy,
  onBuyTheme,
  onEquipTheme,
}) {
  const [activeTab, setActiveTab] = useState("gashapon"); // 'gashapon' | 'high_roller' | 'prestige' | 'mint' | 'shrine' | 'mansion' | 'buddies'
  const [spinning, setSpinning] = useState(false);
  const [spinResults, setSpinResults] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  if (!isOpen) return null;

  const coins = state?.coins || 0;
  const diamonds = state?.diamonds || 0;
  const faithPoints = state?.faithPoints || 0;
  const prestigeRank = state?.prestige?.rank || 0;
  const level = state?.level || 1;
  const unlockedBuddies = state?.unlockedBuddies || ["buddy_piyo"];
  const equippedBuddy = state?.equippedBuddy || "buddy_piyo";
  const unlockedThemes = state?.unlockedThemes || ["default_grid"];
  const mansionTheme = state?.mansionTheme || "default_grid";

  const triggerToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(""), 3500);
  };

  const handleSpinStandard = (count) => {
    const cost = count === 10 ? 1350 : 150;
    if (coins < cost || spinning) return;

    sound.playLevelUp();
    setSpinning(true);
    setSpinResults(null);

    setTimeout(() => {
      const results = onSpin(count);
      setSpinResults(results);
      setSpinning(false);

      if (results?.some((r) => r.rarity === "SSR")) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#FFD700", "#FF69B4", "#00FFFF"] });
      }
    }, 1100);
  };

  const handleSpinHighRoller = (count) => {
    const cost = count === 10 ? 45000 : 5000;
    if (coins < cost || spinning) return;

    sound.playLevelUp();
    setSpinning(true);
    setSpinResults(null);

    setTimeout(() => {
      const results = onSpinHighRoller ? onSpinHighRoller(count) : null;
      setSpinResults(results);
      setSpinning(false);

      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ["#FFD700", "#FFA500", "#E066FF"] });
    }, 1200);
  };

  const handlePrestigeClick = () => {
    const nextTier = PRESTIGE_TIERS.find((t) => t.rank === prestigeRank + 1);
    if (!nextTier) return;
    if (level < nextTier.reqLevel || coins < nextTier.cost) return;

    const res = onPrestige ? onPrestige() : { success: false };
    if (res?.success) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ["#FFD700", "#FF4500", "#00FFFF"] });
      triggerToast(`🎉 ยินดีด้วย! บรรลุการจุติ ${nextTier.star} '${nextTier.name}' แล้ว!`);
    } else {
      triggerToast(res?.reason || "ไม่สามารถจุติได้");
    }
  };

  const nextPrestigeTier = PRESTIGE_TIERS.find((t) => t.rank === prestigeRank + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-purple-50 via-pink-50/80 to-amber-50/90 border-4 border-purple-300 rounded-3xl shadow-2xl p-4 sm:p-5 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-purple-200">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-purple-600 flex items-center justify-center text-xl shadow-md border-2 border-white text-white">
              👑
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-purple-950 leading-tight">
                ศูนย์การเงิน & ความมั่งคั่งแฮมสเตอร์ (Tycoon Pavilion)
              </h2>
              <p className="text-[10px] sm:text-[11px] font-bold text-purple-800">
                ศูนย์รวมความลักชัวรี่ ตู้สุ่มมหาเศรษฐี จุติเกียรติยศ และแท่นบูชาทานตะวัน
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full transition-colors active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Strip */}
        <div className="grid grid-cols-3 gap-1.5 my-2.5">
          <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-1.5 text-center shadow-2xs">
            <div className="text-[9px] font-bold text-amber-800">🌻 เมล็ดทานตะวัน</div>
            <div className="text-xs sm:text-sm font-black text-amber-950 truncate">{coins.toLocaleString()}</div>
          </div>
          <div className="bg-cyan-100/90 border border-cyan-300 rounded-xl p-1.5 text-center shadow-2xs">
            <div className="text-[9px] font-bold text-cyan-800">💎 เพชร VIP</div>
            <div className="text-xs sm:text-sm font-black text-cyan-950 truncate">{diamonds.toLocaleString()}</div>
          </div>
          <div className="bg-purple-100/90 border border-purple-300 rounded-xl p-1.5 text-center shadow-2xs">
            <div className="text-[9px] font-bold text-purple-800">🕊️ แต้มศรัทธา</div>
            <div className="text-xs sm:text-sm font-black text-purple-950 truncate">{faithPoints.toLocaleString()}</div>
          </div>
        </div>

        {/* Feedback Toast */}
        {feedbackMsg && (
          <div className="mb-2 p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-center text-xs font-black shadow-md animate-slide-in-down">
            {feedbackMsg}
          </div>
        )}

        {/* Tab Switcher - Scrollable on mobile */}
        <div className="flex p-1 bg-purple-200/60 rounded-2xl overflow-x-auto no-scrollbar space-x-1 mb-2.5 text-xs font-black">
          {[
            { id: "gashapon", label: "🎰 กาชาทั่วไป" },
            { id: "high_roller", label: "👑 VIP ไฮโซ", highlight: true },
            { id: "prestige", label: `⭐ จุติ ${prestigeRank > 0 ? `★${prestigeRank}` : ""}` },
            { id: "mint", label: "💱 หลอมเพชร" },
            { id: "shrine", label: "🏛️ แท่นบูชา" },
            { id: "mansion", label: "🏰 คฤหาสน์" },
            { id: "buddies", label: "🐥 คู่หู" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id);
                setSpinResults(null);
              }}
              className={`py-1.5 px-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-purple-950 shadow-md scale-[1.02]"
                  : tab.highlight
                  ? "bg-amber-400 text-amber-950 shadow-xs hover:bg-amber-300"
                  : "text-purple-900 hover:bg-white/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: NORMAL GASHAPON (150 / 1,350 Coins)
        ========================================================================= */}
        {activeTab === "gashapon" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-center">
            <div className="relative py-1 flex flex-col items-center justify-center">
              <img
                src="/assets/gashapon/gashapon_machine.png"
                alt="Gashapon"
                className={`w-32 h-32 object-contain pixel-art drop-shadow-xl transition-all duration-300 ${
                  spinning ? "animate-bounce scale-110" : "hover:scale-105"
                }`}
              />
              <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-black">
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
              <div className="bg-white/95 rounded-2xl border-2 border-purple-300 p-2.5 shadow-lg animate-slide-in-up">
                <div className="text-xs font-black text-purple-950 mb-2">🎉 ของรางวัลที่คุณได้รับ:</div>
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
                      <span className="text-xl mb-1">{r.icon}</span>
                      <span className="text-[10px] font-black text-slate-900 truncate w-full">{r.name}</span>
                      <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full mt-1 bg-slate-200 text-slate-700">
                        {r.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spin Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                disabled={coins < 150 || spinning}
                onClick={() => handleSpinStandard(1)}
                className={`py-2.5 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all ${
                  coins >= 150 && !spinning
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 text-white shadow-md active:scale-95 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <span>สุ่ม 1 ครั้ง</span>
                <span className="text-[10px] font-extrabold opacity-90">🌻 150 เมล็ด</span>
              </button>

              <button
                disabled={coins < 1350 || spinning}
                onClick={() => handleSpinStandard(10)}
                className={`py-2.5 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                  coins >= 1350 && !spinning
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 text-white shadow-lg active:scale-95 animate-pulse cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <div className="absolute top-0 right-0 bg-red-600 text-[8px] text-white px-1.5 py-0.2 rounded-bl font-black">
                  ลด 10%
                </div>
                <span>สุ่ม 10 ครั้งรวด!</span>
                <span className="text-[10px] font-extrabold opacity-95">🌻 1,350 เมล็ด</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: HIGH-ROLLER VIP GASHAPON (5,000 / 45,000 Coins)
        ========================================================================= */}
        {activeTab === "high_roller" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-center">
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-amber-950 p-3 rounded-2xl shadow-md border-2 border-yellow-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-left">
                <span className="text-3xl animate-bounce">👑</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black">ตู้สุ่มมหาเศรษฐี VIP Golden Gashapon</h3>
                  <p className="text-[10px] font-bold text-amber-900">
                    โอกาสได้ SSR สูงถึง 10%! ลุ้นรับปีกเนบิวลาจักรวาล รูปปั้นทองคำแท้ และหีบเพชร 500 💎
                  </p>
                </div>
              </div>
            </div>

            <div className="relative py-1 flex flex-col items-center justify-center">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-orange-400 p-2 shadow-xl border-4 border-white flex items-center justify-center animate-pulse">
                <span className="text-5xl drop-shadow-md">💎</span>
              </div>

              <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-black">
                <span className="px-2 py-0.5 bg-yellow-400 text-amber-950 rounded-full border border-yellow-500 font-extrabold">
                  👑 SSR (10%)
                </span>
                <span className="px-2 py-0.5 bg-purple-300 text-purple-950 rounded-full border border-purple-400 font-bold">
                  🌟 SR (30%)
                </span>
                <span className="px-2 py-0.5 bg-cyan-200 text-cyan-950 rounded-full border border-cyan-300">
                  💎 เพชร & กะเพรา (60%)
                </span>
              </div>
            </div>

            {/* Results Display */}
            {spinResults && spinResults.length > 0 && (
              <div className="bg-white/95 rounded-2xl border-2 border-amber-400 p-2.5 shadow-lg animate-slide-in-up">
                <div className="text-xs font-black text-amber-950 mb-2">🏆 รางวัลระดับมหาเศรษฐีที่ได้รับ:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {spinResults.map((r, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border-2 flex flex-col items-center text-center ${
                        r.rarity === "SSR"
                          ? "bg-yellow-100 border-yellow-500 shadow-md animate-pulse"
                          : r.rarity === "SR"
                          ? "bg-purple-50 border-purple-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <span className="text-xl mb-1">{r.icon}</span>
                      <span className="text-[10px] font-black text-slate-900 truncate w-full">{r.name}</span>
                      <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full mt-1 bg-yellow-300 text-yellow-950">
                        {r.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High Roller Spin Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                disabled={coins < 5000 || spinning}
                onClick={() => handleSpinHighRoller(1)}
                className={`py-2.5 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all ${
                  coins >= 5000 && !spinning
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 shadow-md active:scale-95 cursor-pointer border border-yellow-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <span>สุ่ม VIP 1 ครั้ง</span>
                <span className="text-[10px] font-black text-amber-900">🌻 5,000 เมล็ด</span>
              </button>

              <button
                disabled={coins < 45000 || spinning}
                onClick={() => handleSpinHighRoller(10)}
                className={`py-2.5 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                  coins >= 45000 && !spinning
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 text-white shadow-xl active:scale-95 animate-pulse cursor-pointer border-2 border-yellow-300"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <div className="absolute top-0 right-0 bg-red-600 text-[8px] text-white px-1.5 py-0.2 rounded-bl font-black">
                  ลด 10%
                </div>
                <span>สุ่ม VIP 10 ครั้งรวด!</span>
                <span className="text-[10px] font-black text-yellow-200">🌻 45,000 เมล็ด (การันตี SSR)</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PRESTIGE REBIRTH SYSTEM (ระบบจุติเกียรติยศ)
        ========================================================================= */}
        {activeTab === "prestige" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-slate-900">
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 text-white p-3.5 rounded-2xl shadow-lg border-2 border-amber-400 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl">⭐</span>
                  <h3 className="text-sm font-black text-amber-300">
                    ระดับจุติปัจจุบัน: {prestigeRank > 0 ? `★${prestigeRank} ขั้นที่ ${prestigeRank}` : "ยังไม่เคยจุติ"}
                  </h3>
                </div>
                <p className="text-[10px] text-indigo-200 mt-0.5">
                  รีเซ็ตเลเวลและเหรียญเพื่อแลกรับดาวเกียรติยศ บัฟถาวร และสายพันธุ์เทพเจ้า
                </p>
              </div>
            </div>

            {/* Next Milestone Box */}
            {nextPrestigeTier ? (
              <div className="bg-white rounded-2xl border-2 border-purple-300 p-3.5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-950 flex items-center space-x-1">
                    <span>🌟</span>
                    <span>เป้าหมายต่อไป: {nextPrestigeTier.star} '{nextPrestigeTier.name}'</span>
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-black border border-amber-300">
                    โบนัส +{nextPrestigeTier.bonusDiamonds} 💎
                  </span>
                </div>

                <div className="text-[11px] bg-purple-50 p-2 rounded-xl border border-purple-200 text-purple-900 font-bold">
                  ✨ บัฟถาวรที่จะได้รับ: <span className="font-black text-purple-950">{nextPrestigeTier.perkDesc}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className={`p-2 rounded-xl border flex flex-col ${
                    level >= nextPrestigeTier.reqLevel ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-black" : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}>
                    <span className="text-[10px]">เลเวลที่ต้องการ:</span>
                    <span className="text-sm font-black">{level} / {nextPrestigeTier.reqLevel}</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex flex-col ${
                    coins >= nextPrestigeTier.cost ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-black" : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}>
                    <span className="text-[10px]">เมล็ดทานตะวัน:</span>
                    <span className="text-sm font-black">{coins.toLocaleString()} / {nextPrestigeTier.cost.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={level < nextPrestigeTier.reqLevel || coins < nextPrestigeTier.cost}
                  onClick={handlePrestigeClick}
                  className={`w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-1.5 ${
                    level >= nextPrestigeTier.reqLevel && coins >= nextPrestigeTier.cost
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 text-white active:scale-95 cursor-pointer animate-pulse"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>เริ่มพิธีจุติสู่วังทองคำ ({nextPrestigeTier.star})</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-amber-100 rounded-2xl text-center font-black text-xs text-amber-950 border border-amber-300">
                👑 คุณได้บรรลุระดับจุติสูงสุด ★4 เทพเจ้าแฮมสเตอร์ทองคำแล้ว!
              </div>
            )}

            {/* Prestige Tiers Overview */}
            <div className="space-y-1.5">
              <span className="text-xs font-black text-purple-950">📜 ขั้นตอนการจุติทั้งหมด:</span>
              {PRESTIGE_TIERS.map((tier) => (
                <div
                  key={tier.rank}
                  className={`p-2 rounded-xl border text-[11px] flex items-center justify-between ${
                    prestigeRank >= tier.rank
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-black"
                      : "bg-white/80 border-slate-200 text-slate-700 font-semibold"
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm">{tier.star}</span>
                    <span>{tier.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {prestigeRank >= tier.rank ? "✓ บรรลุแล้ว" : `Lv.${tier.reqLevel} • 🌻 ${tier.cost.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SEED-TO-DIAMOND CENTRAL MINT (โรงกษาปณ์หลอมเพชร)
        ========================================================================= */}
        {activeTab === "mint" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-slate-900">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white p-3 rounded-2xl shadow-md border-2 border-cyan-300 flex items-center space-x-2.5">
              <span className="text-3xl animate-pulse">💱</span>
              <div>
                <h3 className="text-xs sm:text-sm font-black">โรงกษาปณ์แฮมสเตอร์ (Seed-to-Diamond Mint)</h3>
                <p className="text-[10px] text-cyan-100 font-bold">
                  หลอมเมล็ดทานตะวันส่วนเกิน แปลงเป็นเพชร VIP 💎 แท้ 100% เอาไว้ใช้เร่งโตผักและแต่งโปรไฟล์
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {MINT_EXCHANGE_TIERS.map((tier) => {
                const canAfford = coins >= tier.seedCost;
                return (
                  <div
                    key={tier.id}
                    className="bg-white rounded-2xl border-2 border-cyan-200 p-3 shadow-xs flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-cyan-950">{tier.label}</span>
                        {tier.bonus && (
                          <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full font-black border border-red-200">
                            {tier.bonus}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                        ใช้ 🌻 {tier.seedCost.toLocaleString()} เมล็ด ➔ รับ +{tier.diamondYield} 💎
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        const res = onMintDiamonds ? onMintDiamonds(tier.id) : { success: false };
                        if (res?.success) {
                          triggerToast(`หลอมสำเร็จ! ได้รับ +${tier.diamondYield} 💎 เรียบร้อยแล้ว!`);
                        }
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center space-x-1 ${
                        canAfford
                          ? "bg-cyan-500 hover:bg-cyan-600 text-white active:scale-95 cursor-pointer"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      }`}
                    >
                      <Gem className="w-3.5 h-3.5" />
                      <span>หลอมเพชร +{tier.diamondYield} 💎</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: GOLDEN SHRINE DONATIONS (แท่นบูชาทานตะวันทองคำ)
        ========================================================================= */}
        {activeTab === "shrine" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-slate-900">
            <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500 text-amber-950 p-3 rounded-2xl shadow-md border-2 border-yellow-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-3xl animate-bounce">🏛️</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black">แท่นบูชาทานตะวันทองคำ (Golden Shrine)</h3>
                  <p className="text-[10px] text-amber-900 font-bold">
                    บริจาคเมล็ดทานตะวันสะสมแต้มศรัทธา 🕊️ แลกฉายาสุดแรร์ และเสกฝนเมล็ดทานตะวันให้ทั้งเซิร์ฟเวอร์!
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Buttons */}
            <div className="space-y-1.5">
              <span className="text-xs font-black text-amber-950">🌻 เลือกจำนวนเมล็ดทานตะวันเพื่อบริจาค:</span>
              <div className="grid grid-cols-2 gap-2">
                {SHRINE_DONATION_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    disabled={coins < tier.amount}
                    onClick={() => {
                      const res = onDonateShrine ? onDonateShrine(tier.id) : { success: false };
                      if (res?.success) {
                        triggerToast(`บริจาค ${tier.amount.toLocaleString()} เมล็ด สำเร็จ! ได้รับ +${tier.faithYield} แต้มศรัทธา 🕊️`);
                      }
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      coins >= tier.amount
                        ? "bg-amber-50/80 hover:bg-amber-100 border-amber-300 text-amber-950 active:scale-95 cursor-pointer shadow-xs"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                    }`}
                  >
                    <span className="text-xs font-black">{tier.label}</span>
                    <span className="text-[10px] text-amber-800 font-extrabold mt-0.5">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Blessing Rewards Shop */}
            <div className="space-y-1.5 pt-1 border-t border-purple-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-950">🕊️ ร้านค้าพรอันศักดิ์สิทธิ์ (ใช้แต้มศรัทธาแลก):</span>
                <span className="text-[11px] font-black text-purple-800">มีอยู่: {faithPoints} แต้ม</span>
              </div>

              <div className="space-y-2">
                {SHRINE_BLESSING_SHOP.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="text-xs font-black text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{item.desc}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={faithPoints < item.cost}
                      onClick={() => {
                        const res = onClaimFaithReward ? onClaimFaithReward(item.id) : { success: false };
                        if (res?.success) {
                          triggerToast(`แลกรับ '${item.name}' เรียบร้อยแล้ว! ✨`);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1 ${
                        faithPoints >= item.cost
                          ? "bg-purple-600 hover:bg-purple-700 text-white active:scale-95 cursor-pointer shadow-xs"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      }`}
                    >
                      <span>แลก {item.cost} แต้ม</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: MANSION THEMES
        ========================================================================= */}
        {activeTab === "mansion" && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {MANSION_THEMES.map((theme) => {
              const isOwned = unlockedThemes.includes(theme.id);
              const isEquipped = mansionTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-2xl border-2 border-amber-200 p-3 shadow-xs flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base">🏰</span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">{theme.name}</h3>
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold mt-0.5 leading-tight">{theme.desc}</p>
                    <div className="text-[11px] font-extrabold text-amber-700 mt-1">
                      {theme.cost === 0 ? "เริ่มต้นฟรี" : `🌻 ${theme.cost.toLocaleString()} เมล็ดทานตะวัน`}
                    </div>
                  </div>

                  {isEquipped ? (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl flex items-center space-x-1 cursor-default"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ใช้งานอยู่</span>
                    </button>
                  ) : isOwned ? (
                    <button
                      onClick={() => onEquipTheme(theme.id)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      เลือกใช้
                    </button>
                  ) : (
                    <button
                      disabled={coins < theme.cost}
                      onClick={() => onBuyTheme(theme.id)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs shadow-xs transition-all ${
                        coins >= theme.cost
                          ? "bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-md cursor-pointer"
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
            TAB 7: BUDDY PETS
        ========================================================================= */}
        {activeTab === "buddies" && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
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
                  className="bg-white rounded-2xl border-2 border-emerald-200 p-2.5 shadow-xs flex items-center space-x-3"
                >
                  <img
                    src={buddy.image}
                    alt={buddy.name}
                    className="w-12 h-12 object-contain pixel-art bg-emerald-50 rounded-xl p-1 border border-emerald-200 flex-shrink-0"
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
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl flex items-center space-x-1 cursor-default flex-shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>เดินตามอยู่</span>
                    </button>
                  ) : isOwned ? (
                    <button
                      onClick={() => onEquipBuddy(buddy.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                    >
                      เลือกใช้
                    </button>
                  ) : (
                    <div className="text-[10px] font-black text-slate-400 flex-shrink-0">
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
