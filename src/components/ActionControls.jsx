import React, { useState } from "react";
import { Utensils, Heart, Sparkles, Moon, Sun, ShoppingBag, Shirt, Compass, Lock } from "lucide-react";

function PixelIcon({ src, fallback, alt, className = "w-7 h-7 sm:w-8 sm:h-8 object-contain pixel-art drop-shadow-xs" }) {
  const [hasError, setHasError] = useState(false);
  if (hasError || !src) {
    return <span className="text-xl">{fallback}</span>;
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
      draggable="false"
    />
  );
}

export default function ActionControls({
  state,
  onFeed,
  onPet,
  onClean,
  onToggleSleep,
  onOpenWheel,
  onOpenFoodShop,
  onOpenDecor,
  onOpenWardrobe,
  onOpenGarden,
  onOpenGashapon,
  onOpenJump,
  isDarkMode = false,
}) {
  const { level = 1, isSleeping = false, poopCount = 0, cleanliness = 100 } = state || {};
  const [mobileTab, setMobileTab] = useState("care"); // 'care' | 'activities'

  // ============================================================
  // 1. 4 TACTILE CARE BUTTONS (Pixel Art Edition)
  // ============================================================
  const renderCareButtons = () => (
    <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
      {/* 1) ให้อาหาร (Feed) */}
      <button
        onClick={onFeed}
        disabled={isSleeping}
        className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 ${
          isSleeping
            ? isDarkMode
              ? "bg-slate-800/60 border-slate-700/60 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            : isDarkMode
            ? "bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-600/70 border-b-4 border-b-amber-500 text-amber-200 hover:bg-slate-800 hover:shadow-md cursor-pointer"
            : "bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300 border-b-4 border-b-amber-500 text-amber-950 hover:bg-amber-100 hover:shadow-md cursor-pointer"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
            isDarkMode
              ? "bg-gradient-to-tr from-amber-600/80 to-yellow-600/80 border-amber-400/50"
              : "bg-gradient-to-tr from-amber-400 to-yellow-400 border-yellow-200/70"
          }`}
        >
          <PixelIcon src="/assets/ui/btn_feed.png" fallback="🥣" alt="ให้อาหาร" />
        </div>
        <span className={`text-[11px] font-black leading-tight ${isDarkMode ? "text-amber-200" : "text-amber-950"}`}>
          ให้อาหาร
        </span>
        <span className={`text-[9px] font-bold leading-none mt-0.5 ${isDarkMode ? "text-amber-400" : "text-amber-700"}`}>
          +อิ่มท้อง
        </span>
      </button>

      {/* 2) ลูบหัว (Pet) */}
      <button
        onClick={onPet}
        disabled={isSleeping}
        className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 ${
          isSleeping
            ? isDarkMode
              ? "bg-slate-800/60 border-slate-700/60 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            : isDarkMode
            ? "bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-600/70 border-b-4 border-b-rose-500 text-rose-200 hover:bg-slate-800 hover:shadow-md cursor-pointer"
            : "bg-gradient-to-b from-rose-50 to-pink-100 border-rose-300 border-b-4 border-b-rose-500 text-rose-950 hover:bg-rose-100 hover:shadow-md cursor-pointer"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
            isDarkMode
              ? "bg-gradient-to-tr from-rose-600/80 to-pink-600/80 border-pink-400/50"
              : "bg-gradient-to-tr from-rose-400 to-pink-500 border-rose-200/70"
          }`}
        >
          <PixelIcon src="/assets/ui/btn_pet.png" fallback="✋" alt="ลูบหัว" />
        </div>
        <span className={`text-[11px] font-black leading-tight ${isDarkMode ? "text-rose-200" : "text-rose-950"}`}>
          ลูบหัว
        </span>
        <span className={`text-[9px] font-bold leading-none mt-0.5 ${isDarkMode ? "text-rose-400" : "text-rose-700"}`}>
          +ความสุข
        </span>
      </button>

      {/* 3) ทำความสะอาด / เก็บอึ (Clean) */}
      <button
        onClick={onClean}
        className={`relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 cursor-pointer ${
          poopCount > 0 || cleanliness < 45
            ? "bg-gradient-to-b from-sky-100 to-cyan-200 border-sky-400 border-b-4 border-b-sky-600 text-sky-950 animate-pulse hover:bg-sky-200"
            : isDarkMode
            ? "bg-gradient-to-b from-sky-950/60 to-slate-900 border-sky-600/70 border-b-4 border-b-sky-500 text-sky-200 hover:bg-slate-800 hover:shadow-md"
            : "bg-gradient-to-b from-sky-50 to-sky-100 border-sky-300 border-b-4 border-b-sky-500 text-sky-950 hover:bg-sky-100 hover:shadow-md"
        }`}
      >
        {poopCount > 0 && (
          <span className="absolute -top-2 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md border-2 border-white animate-bounce">
            {poopCount}
          </span>
        )}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
            isDarkMode
              ? "bg-gradient-to-tr from-sky-600/80 to-cyan-600/80 border-cyan-400/50"
              : "bg-gradient-to-tr from-sky-400 to-cyan-500 border-sky-200/70"
          }`}
        >
          <PixelIcon src="/assets/ui/btn_clean.png" fallback="🧹" alt="ทำความสะอาด" />
        </div>
        <span className={`text-[11px] font-black leading-tight ${isDarkMode ? "text-sky-200" : "text-sky-950"}`}>
          {poopCount > 0 ? "เก็บอึ!" : "ทำความสะอาด"}
        </span>
        <span className={`text-[9px] font-bold leading-none mt-0.5 ${isDarkMode ? "text-sky-400" : "text-sky-700"}`}>
          +สะอาด
        </span>
      </button>

      {/* 4) ปิดไฟนอน / เปิดไฟปลุก (Sleep / Wake) */}
      <button
        onClick={onToggleSleep}
        className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 cursor-pointer ${
          isSleeping
            ? "bg-gradient-to-b from-indigo-700 to-purple-800 border-indigo-400 border-b-4 border-b-indigo-950 text-white shadow-indigo-300/50 shadow-md animate-pulse"
            : isDarkMode
            ? "bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-600/70 border-b-4 border-b-indigo-500 text-indigo-200 hover:bg-slate-800 hover:shadow-md"
            : "bg-gradient-to-b from-indigo-50 to-purple-100 border-indigo-300 border-b-4 border-b-indigo-500 text-indigo-950 hover:bg-indigo-100 hover:shadow-md"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
            isSleeping
              ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 border-yellow-200"
              : isDarkMode
              ? "bg-gradient-to-tr from-indigo-600/80 to-purple-700/80 text-white border-indigo-400/50"
              : "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white border-indigo-300/70"
          }`}
        >
          {isSleeping ? (
            <PixelIcon src="/assets/ui/btn_wake.png" fallback="☀️" alt="เปิดไฟปลุก" />
          ) : (
            <PixelIcon src="/assets/ui/btn_sleep.png" fallback="🌙" alt="ปิดไฟนอน" />
          )}
        </div>
        <span
          className={`text-[11px] font-black leading-tight ${
            isSleeping ? "text-amber-100" : isDarkMode ? "text-indigo-200" : "text-indigo-950"
          }`}
        >
          {isSleeping ? "เปิดไฟปลุก" : "ปิดไฟนอน"}
        </span>
        <span
          className={`text-[9px] font-bold leading-none mt-0.5 ${
            isSleeping ? "text-amber-300" : isDarkMode ? "text-indigo-400" : "text-indigo-700"
          }`}
        >
          {isSleeping ? "ตื่นนอน" : "ชาร์จพลัง"}
        </span>
      </button>
    </div>
  );

  // ============================================================
  // 2. ACTIVITY & SHOP HUB (Cozy 2-Tier Modular Grid)
  // ============================================================
  const renderActivityHub = () => (
    <div
      className={`rounded-2xl p-2.5 sm:p-3 border-2 shadow-xs transition-colors ${
        isDarkMode
          ? "dark-card-glass border-slate-700/80 text-white"
          : "bg-white/90 backdrop-blur-md border-amber-200/90"
      }`}
    >
      <div
        className={`text-[11px] font-bold mb-2 flex items-center justify-between ${
          isDarkMode ? "text-amber-300" : "text-amber-900"
        }`}
      >
        <span className="flex items-center space-x-1 font-extrabold">
          <Compass className={`w-3.5 h-3.5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
          <span>ศูนย์รวมกิจกรรม & ร้านค้าประจำกรง</span>
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border ${
            isDarkMode
              ? "text-amber-300 bg-slate-800 border-amber-500/40"
              : "text-amber-700 bg-amber-100 border-amber-200"
          }`}
        >
          อัปเลเวลเพื่อปลดล็อค 🌟
        </span>
      </div>

      {/* Primary 4 Shops */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {/* ปั่นวงล้อ (Lv.2) */}
        <button
          onClick={onOpenWheel}
          disabled={level < 2 || isSleeping}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
            level >= 2 && !isSleeping
              ? isDarkMode
                ? "bg-slate-800/90 border-orange-500/50 border-b-3 border-b-orange-500 text-orange-200 hover:bg-slate-750 active:translate-y-0.5 cursor-pointer"
                : "bg-gradient-to-b from-amber-50 to-orange-100/90 border-orange-200 border-b-3 border-b-orange-400 text-orange-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
              : isDarkMode
              ? "bg-slate-800/40 border-slate-700/40 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5">
            <PixelIcon src="/assets/ui/btn_wheel.png" fallback="🎡" alt="ปั่นวงล้อ" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black leading-tight">ปั่นวงล้อ</span>
          {level < 2 ? (
            <span className="flex items-center text-[8px] sm:text-[9px] text-slate-400 mt-0.5 font-bold">
              <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.2
            </span>
          ) : (
            <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isDarkMode ? "text-orange-400" : "text-orange-700"}`}>
              หาเหรียญ
            </span>
          )}
        </button>

        {/* ร้านอาหารพรีเมียม (Lv.3) */}
        <button
          onClick={onOpenFoodShop}
          disabled={level < 3 || isSleeping}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
            level >= 3 && !isSleeping
              ? isDarkMode
                ? "bg-slate-800/90 border-pink-500/50 border-b-3 border-b-pink-500 text-pink-200 hover:bg-slate-750 active:translate-y-0.5 cursor-pointer"
                : "bg-gradient-to-b from-rose-50 to-pink-100/90 border-pink-200 border-b-3 border-b-pink-400 text-pink-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
              : isDarkMode
              ? "bg-slate-800/40 border-slate-700/40 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5">
            <PixelIcon src="/assets/ui/btn_food_shop.png" fallback="🍰" alt="ร้านอาหาร" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black leading-tight">ร้านอาหาร</span>
          {level < 3 ? (
            <span className="flex items-center text-[8px] sm:text-[9px] text-slate-400 mt-0.5 font-bold">
              <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.3
            </span>
          ) : (
            <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isDarkMode ? "text-pink-400" : "text-pink-700"}`}>
              เมนูเด็ด
            </span>
          )}
        </button>

        {/* ตกแต่งกรง & กล่องสุ่ม (Lv.4) */}
        <button
          onClick={onOpenDecor}
          disabled={level < 4 || isSleeping}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
            level >= 4 && !isSleeping
              ? isDarkMode
                ? "bg-slate-800/90 border-teal-500/50 border-b-3 border-b-teal-500 text-teal-200 hover:bg-slate-750 active:translate-y-0.5 cursor-pointer"
                : "bg-gradient-to-b from-emerald-50 to-teal-100/90 border-teal-200 border-b-3 border-b-teal-400 text-teal-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
              : isDarkMode
              ? "bg-slate-800/40 border-slate-700/40 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5">
            <PixelIcon src="/assets/ui/btn_decor.png" fallback="🏡" alt="แต่งกรง" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black leading-tight">แต่งกรง</span>
          {level < 4 ? (
            <span className="flex items-center text-[8px] sm:text-[9px] text-slate-400 mt-0.5 font-bold">
              <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.4
            </span>
          ) : (
            <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isDarkMode ? "text-teal-400" : "text-teal-700"}`}>
              ของแต่ง
            </span>
          )}
        </button>

        {/* ร้านแฟชั่น & ตู้เสื้อผ้า (Lv.5) */}
        <button
          onClick={onOpenWardrobe}
          disabled={level < 5}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
            level >= 5
              ? isDarkMode
                ? "bg-slate-800/90 border-purple-500/50 border-b-3 border-b-purple-500 text-purple-200 hover:bg-slate-750 active:translate-y-0.5 cursor-pointer"
                : "bg-gradient-to-b from-purple-50 to-indigo-100/90 border-purple-200 border-b-3 border-b-purple-400 text-purple-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
              : isDarkMode
              ? "bg-slate-800/40 border-slate-700/40 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5">
            <PixelIcon src="/assets/ui/btn_wardrobe.png" fallback="👗" alt="ตู้เสื้อผ้า" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black leading-tight">ตู้เสื้อผ้า</span>
          {level < 5 ? (
            <span className="flex items-center text-[8px] sm:text-[9px] text-slate-400 mt-0.5 font-bold">
              <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.5
            </span>
          ) : (
            <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isDarkMode ? "text-purple-400" : "text-purple-700"}`}>
              แฟชั่น
            </span>
          )}
        </button>
      </div>

      {/* 3 Adventure & Mini-Game Modules */}
      <div
        className={`grid grid-cols-3 gap-1.5 sm:gap-2 mt-2.5 pt-2.5 border-t ${
          isDarkMode ? "border-slate-700/80" : "border-amber-200/80"
        }`}
      >
        {/* สวนผัก & ครัว (Lv.2) */}
        <button
          onClick={onOpenGarden}
          disabled={level < 2 || isSleeping}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
            level >= 2 && !isSleeping
              ? isDarkMode
                ? "bg-slate-800/90 border-emerald-500/50 border-b-3 border-b-emerald-500 text-emerald-200 hover:bg-slate-750 active:translate-y-0.5 cursor-pointer"
                : "bg-gradient-to-b from-emerald-50 to-emerald-100/90 border-emerald-300 border-b-3 border-b-emerald-500 text-emerald-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
              : isDarkMode
              ? "bg-slate-800/40 border-slate-700/40 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5">
            <PixelIcon src="/assets/ui/btn_garden.png" fallback="🌱" alt="สวน & ครัว" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black leading-tight">สวน & ครัว</span>
          <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
            ปลูกผัก/ปรุงอาหาร
          </span>
        </button>

        {/* ตู้สุ่มกาชาปอง & หรูหรา (Lv.2) */}
        <button
          onClick={onOpenGashapon}
          disabled={level < 2 || isSleeping}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
            level >= 2 && !isSleeping
              ? isDarkMode
                ? "bg-slate-800/90 border-purple-500/50 border-b-3 border-b-purple-500 text-purple-200 hover:bg-slate-750 active:translate-y-0.5 cursor-pointer"
                : "bg-gradient-to-b from-purple-50 to-pink-100/90 border-purple-300 border-b-3 border-b-purple-500 text-purple-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
              : isDarkMode
              ? "bg-slate-800/40 border-slate-700/40 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5">
            <PixelIcon src="/assets/ui/btn_gashapon.png" fallback="🎰" alt="กาชา & เศรษฐี" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black leading-tight">กาชา & เศรษฐี</span>
          <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isDarkMode ? "text-purple-400" : "text-purple-700"}`}>
            จุติ/คู่หู/คฤหาสน์
          </span>
        </button>

        {/* Hamster Jump (Lv.1) */}
        <button
          onClick={onOpenJump}
          disabled={isSleeping}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
            !isSleeping
              ? isDarkMode
                ? "bg-slate-800/90 border-amber-500/50 border-b-3 border-b-amber-500 text-amber-200 hover:bg-slate-750 active:translate-y-0.5 cursor-pointer"
                : "bg-gradient-to-b from-amber-50 to-orange-100/90 border-orange-300 border-b-3 border-b-orange-500 text-orange-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
              : isDarkMode
              ? "bg-slate-800/40 border-slate-700/40 border-b-2 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5">
            <PixelIcon src="/assets/ui/btn_jump.png" fallback="🚀" alt="Hamster Jump" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black leading-tight">Hamster Jump</span>
          <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${isDarkMode ? "text-orange-400" : "text-orange-700"}`}>
            ไต่เมฆเก็บเหรียญ
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-2 sm:space-y-2.5 font-['Itim',sans-serif]">
      {/* Mobile-Only Ergonomic Tab Switcher (Visible on < md) */}
      <div
        className={`flex md:hidden items-center justify-center p-1 rounded-2xl border shadow-2xs space-x-1 ${
          isDarkMode
            ? "bg-slate-900/90 border-slate-700/80"
            : "bg-amber-100/80 border-amber-200/90"
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileTab("care")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === "care"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs scale-[1.02]"
              : isDarkMode
              ? "text-slate-300 hover:text-white"
              : "text-amber-900 hover:text-amber-950"
          }`}
        >
          <img
            src="/assets/icons/icon_gamepad.png"
            alt="Care"
            className="w-3.5 h-3.5 object-contain pixel-art inline-block"
          />
          <span>ดูแลน้อง</span>
          {poopCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 rounded-full font-black animate-pulse">
              {poopCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("activities")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === "activities"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs scale-[1.02]"
              : isDarkMode
              ? "text-slate-300 hover:text-white"
              : "text-amber-900 hover:text-amber-950"
          }`}
        >
          <img
            src="/assets/ui/btn_wheel.png"
            alt="Activities"
            className="w-3.5 h-3.5 object-contain pixel-art inline-block"
          />
          <span>กิจกรรม & ร้านค้า</span>
        </button>
      </div>

      {/* On Mobile (< md): Render active tab only */}
      <div className="md:hidden">
        {mobileTab === "care" ? renderCareButtons() : renderActivityHub()}
      </div>

      {/* iPad / Tablet / Desktop Studio View (md: and up): Render both cleanly stacked */}
      <div className="hidden md:flex md:flex-col md:space-y-3">
        {renderCareButtons()}
        {renderActivityHub()}
      </div>
    </div>
  );
}
