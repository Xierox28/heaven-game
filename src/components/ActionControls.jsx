import React from "react";
import { Utensils, Heart, Sparkles, Moon, Sun, ShoppingBag, Shirt, Compass, Lock } from "lucide-react";

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
}) {
  const { level = 1, isSleeping = false, poopCount = 0, cleanliness = 100 } = state || {};

  return (
    <div className="w-full space-y-3 font-['Itim',sans-serif]">
      {/* ============================================================
          1. 4 HERO TACTILE 3D ACTION BUTTONS
          ============================================================ */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* 1) ให้อาหาร (Feed) */}
        <button
          onClick={onFeed}
          disabled={isSleeping}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 ${
            isSleeping
              ? "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
              : "bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300 border-b-4 border-b-amber-500 text-amber-950 hover:bg-amber-100 hover:shadow-md cursor-pointer"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-white flex items-center justify-center shadow-xs text-xl mb-1 border border-yellow-200/70">
            🥣
          </div>
          <span className="text-[11px] font-black leading-tight">ให้อาหาร</span>
          <span className="text-[9px] text-amber-700 font-bold leading-none mt-0.5">+อิ่มท้อง</span>
        </button>

        {/* 2) ลูบหัว (Pet) */}
        <button
          onClick={onPet}
          disabled={isSleeping}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 ${
            isSleeping
              ? "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
              : "bg-gradient-to-b from-rose-50 to-pink-100 border-rose-300 border-b-4 border-b-rose-500 text-rose-950 hover:bg-rose-100 hover:shadow-md cursor-pointer"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-xs text-xl mb-1 border border-rose-200/70">
            ✋
          </div>
          <span className="text-[11px] font-black leading-tight">ลูบหัว</span>
          <span className="text-[9px] text-rose-700 font-bold leading-none mt-0.5">+ความสุข</span>
        </button>

        {/* 3) ทำความสะอาด / เก็บอึ (Clean) */}
        <button
          onClick={onClean}
          className={`relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 cursor-pointer ${
            poopCount > 0 || cleanliness < 45
              ? "bg-gradient-to-b from-sky-100 to-cyan-200 border-sky-400 border-b-4 border-b-sky-600 text-sky-950 animate-pulse hover:bg-sky-200"
              : "bg-gradient-to-b from-sky-50 to-sky-100 border-sky-300 border-b-4 border-b-sky-500 text-sky-950 hover:bg-sky-100 hover:shadow-md"
          }`}
        >
          {poopCount > 0 && (
            <span className="absolute -top-2 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md border-2 border-white animate-bounce">
              {poopCount}
            </span>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-500 text-white flex items-center justify-center shadow-xs text-xl mb-1 border border-sky-200/70">
            🧹
          </div>
          <span className="text-[11px] font-black leading-tight">
            {poopCount > 0 ? "เก็บอึ!" : "ทำความสะอาด"}
          </span>
          <span className="text-[9px] text-sky-700 font-bold leading-none mt-0.5">+สะอาด</span>
        </button>

        {/* 4) ปิดไฟนอน / เปิดไฟปลุก (Sleep / Wake) */}
        <button
          onClick={onToggleSleep}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all shadow-sm active:translate-y-1 active:border-b-2 cursor-pointer ${
            isSleeping
              ? "bg-gradient-to-b from-indigo-700 to-purple-800 border-indigo-400 border-b-4 border-b-indigo-950 text-white shadow-indigo-300/50 shadow-md animate-pulse"
              : "bg-gradient-to-b from-indigo-50 to-purple-100 border-indigo-300 border-b-4 border-b-indigo-500 text-indigo-950 hover:bg-indigo-100 hover:shadow-md"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs text-xl mb-1 border ${
              isSleeping
                ? "bg-gradient-to-tr from-amber-300 to-yellow-400 text-slate-900 border-yellow-200"
                : "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white border-indigo-300/70"
            }`}
          >
            {isSleeping ? <Sun className="w-5 h-5 text-amber-950" /> : <Moon className="w-5 h-5" />}
          </div>
          <span className="text-[11px] font-black leading-tight">
            {isSleeping ? "เปิดไฟปลุก" : "ปิดไฟนอน"}
          </span>
          <span
            className={`text-[9px] font-bold leading-none mt-0.5 ${
              isSleeping ? "text-amber-200" : "text-indigo-700"
            }`}
          >
            {isSleeping ? "ตื่นนอน" : "ชาร์จพลัง"}
          </span>
        </button>
      </div>

      {/* ============================================================
          2. ACTIVITY & SHOP HUB (Cozy 2-Tier Modular Grid)
          ============================================================ */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border-2 border-amber-200/90 shadow-xs">
        <div className="text-[11px] font-bold text-amber-900 mb-2 flex items-center justify-between">
          <span className="flex items-center space-x-1 font-extrabold">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>ศูนย์รวมกิจกรรม & ร้านค้าประจำกรง</span>
          </span>
          <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
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
                ? "bg-gradient-to-b from-amber-50 to-orange-100/90 border-orange-200 border-b-3 border-b-orange-400 text-orange-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
                : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-xl mb-0.5">🎡</div>
            <span className="text-[10px] sm:text-[11px] font-black leading-tight">ปั่นวงล้อ</span>
            {level < 2 ? (
              <span className="flex items-center text-[8px] sm:text-[9px] text-slate-500 mt-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.2
              </span>
            ) : (
              <span className="text-[8px] sm:text-[9px] text-orange-700 font-bold mt-0.5">หาเหรียญ</span>
            )}
          </button>

          {/* ร้านอาหารพรีเมียม (Lv.3) */}
          <button
            onClick={onOpenFoodShop}
            disabled={level < 3 || isSleeping}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
              level >= 3 && !isSleeping
                ? "bg-gradient-to-b from-rose-50 to-pink-100/90 border-pink-200 border-b-3 border-b-pink-400 text-pink-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
                : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-xl mb-0.5">🍰</div>
            <span className="text-[10px] sm:text-[11px] font-black leading-tight">ร้านอาหาร</span>
            {level < 3 ? (
              <span className="flex items-center text-[8px] sm:text-[9px] text-slate-500 mt-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.3
              </span>
            ) : (
              <span className="text-[8px] sm:text-[9px] text-pink-700 font-bold mt-0.5">เมนูเด็ด</span>
            )}
          </button>

          {/* ตกแต่งกรง & กล่องสุ่ม (Lv.4) */}
          <button
            onClick={onOpenDecor}
            disabled={level < 4 || isSleeping}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
              level >= 4 && !isSleeping
                ? "bg-gradient-to-b from-emerald-50 to-teal-100/90 border-teal-200 border-b-3 border-b-teal-400 text-teal-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
                : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-xl mb-0.5">🏡</div>
            <span className="text-[10px] sm:text-[11px] font-black leading-tight">แต่งกรง</span>
            {level < 4 ? (
              <span className="flex items-center text-[8px] sm:text-[9px] text-slate-500 mt-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.4
              </span>
            ) : (
              <span className="text-[8px] sm:text-[9px] text-teal-700 font-bold mt-0.5">ของแต่ง</span>
            )}
          </button>

          {/* ร้านแฟชั่น & ตู้เสื้อผ้า (Lv.5) */}
          <button
            onClick={onOpenWardrobe}
            disabled={level < 5}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
              level >= 5
                ? "bg-gradient-to-b from-purple-50 to-indigo-100/90 border-purple-200 border-b-3 border-b-purple-400 text-purple-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
                : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-xl mb-0.5">👗</div>
            <span className="text-[10px] sm:text-[11px] font-black leading-tight">ตู้เสื้อผ้า</span>
            {level < 5 ? (
              <span className="flex items-center text-[8px] sm:text-[9px] text-slate-500 mt-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.5
              </span>
            ) : (
              <span className="text-[8px] sm:text-[9px] text-purple-700 font-bold mt-0.5">แฟชั่น</span>
            )}
          </button>
        </div>

        {/* 3 Adventure & Mini-Game Modules */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2.5 pt-2.5 border-t border-amber-200/80">
          {/* สวนผัก & ครัว (Lv.2) */}
          <button
            onClick={onOpenGarden}
            disabled={level < 2 || isSleeping}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
              level >= 2 && !isSleeping
                ? "bg-gradient-to-b from-emerald-50 to-emerald-100/90 border-emerald-300 border-b-3 border-b-emerald-500 text-emerald-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
                : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-xl mb-0.5">🌱</div>
            <span className="text-[10px] sm:text-[11px] font-black leading-tight">สวน & ครัว</span>
            <span className="text-[8px] sm:text-[9px] text-emerald-700 font-bold mt-0.5">ปลูกผัก/ปรุงอาหาร</span>
          </button>

          {/* ตู้สุ่มกาชาปอง & หรูหรา (Lv.2) */}
          <button
            onClick={onOpenGashapon}
            disabled={level < 2 || isSleeping}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
              level >= 2 && !isSleeping
                ? "bg-gradient-to-b from-purple-50 to-pink-100/90 border-purple-300 border-b-3 border-b-purple-500 text-purple-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
                : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-xl mb-0.5">🎰</div>
            <span className="text-[10px] sm:text-[11px] font-black leading-tight">กาชา & เศรษฐี</span>
            <span className="text-[8px] sm:text-[9px] text-purple-700 font-bold mt-0.5">จุติ/คู่หู/คฤหาสน์</span>
          </button>

          {/* Hamster Jump (Lv.1) */}
          <button
            onClick={onOpenJump}
            disabled={isSleeping}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
              !isSleeping
                ? "bg-gradient-to-b from-amber-50 to-orange-100/90 border-orange-300 border-b-3 border-b-orange-500 text-orange-950 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
                : "bg-slate-100 border-slate-200 border-b-2 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-xl mb-0.5">🚀</div>
            <span className="text-[10px] sm:text-[11px] font-black leading-tight">Hamster Jump</span>
            <span className="text-[8px] sm:text-[9px] text-orange-700 font-bold mt-0.5">ไต่เมฆเก็บเหรียญ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
