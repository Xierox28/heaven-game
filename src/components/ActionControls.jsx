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
  onOpenWardrobe,
}) {
  const { level, isSleeping, poopCount, cleanliness } = state;

  return (
    <div className="w-full space-y-3">
      {/* 1. ปุ่มแอ็กชันหลัก 4 ปุ่ม (ให้อาหาร, ลูบหัว, ทำความสะอาด, ปิดไฟนอน) */}
      <div className="grid grid-cols-4 gap-2">
        {/* ให้อาหาร */}
        <button
          onClick={onFeed}
          disabled={isSleeping}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all shadow-sm active:scale-95 ${
            isSleeping
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-amber-100/90 border-amber-300 text-amber-900 hover:bg-amber-200 hover:shadow-md"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center shadow-xs text-lg mb-1">
            🥣
          </div>
          <span className="text-[11px] font-black">ให้อาหาร</span>
        </button>

        {/* ลูบหัว */}
        <button
          onClick={onPet}
          disabled={isSleeping}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all shadow-sm active:scale-95 ${
            isSleeping
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-rose-100/90 border-rose-300 text-rose-900 hover:bg-rose-200 hover:shadow-md"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-rose-400 text-white flex items-center justify-center shadow-xs text-lg mb-1">
            ✋
          </div>
          <span className="text-[11px] font-black">ลูบหัว</span>
        </button>

        {/* ทำความสะอาด / เก็บอึ */}
        <button
          onClick={onClean}
          className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all shadow-sm active:scale-95 ${
            poopCount > 0 || cleanliness < 50
              ? "bg-sky-100 border-sky-400 text-sky-900 animate-pulse hover:bg-sky-200"
              : "bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100"
          }`}
        >
          {poopCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-xs">
              {poopCount}
            </span>
          )}
          <div className="w-9 h-9 rounded-xl bg-sky-400 text-white flex items-center justify-center shadow-xs text-lg mb-1">
            🧹
          </div>
          <span className="text-[11px] font-black">
            {poopCount > 0 ? "เก็บอึ!" : "ทำความสะอาด"}
          </span>
        </button>

        {/* ปิดไฟนอน / เปิดไฟ */}
        <button
          onClick={onToggleSleep}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all shadow-sm active:scale-95 ${
            isSleeping
              ? "bg-indigo-600 border-indigo-700 text-white shadow-indigo-300 shadow-md animate-pulse"
              : "bg-indigo-100/90 border-indigo-300 text-indigo-900 hover:bg-indigo-200 hover:shadow-md"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs text-lg mb-1 ${
              isSleeping ? "bg-amber-300 text-slate-900" : "bg-indigo-500 text-white"
            }`}
          >
            {isSleeping ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <span className="text-[11px] font-black">
            {isSleeping ? "เปิดไฟปลุก" : "ปิดไฟนอน"}
          </span>
        </button>
      </div>

      {/* 2. เมนูกิจกรรมที่ปลดล็อคตามเลเวล (วงล้อ Lv.2, ร้านอาหาร Lv.3, ร้านแฟชั่น Lv.5) */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 border border-amber-200 shadow-xs">
        <div className="text-[11px] font-bold text-amber-800 mb-2 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>กิจกรรมและร้านค้าประจำกรง</span>
          </span>
          <span className="text-[10px] text-amber-600">อัปเลเวลเพื่อปลดล็อค</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* ปั่นวงล้อ (Lv.2) */}
          <button
            onClick={onOpenWheel}
            disabled={level < 2 || isSleeping}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
              level >= 2 && !isSleeping
                ? "bg-gradient-to-b from-amber-50 to-orange-100 border-orange-300 text-orange-950 hover:shadow-sm active:scale-95 cursor-pointer"
                : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75"
            }`}
          >
            <div className="text-xl mb-0.5">🎡</div>
            <span className="text-[11px] font-black leading-tight">ปั่นวงล้อ</span>
            {level < 2 ? (
              <span className="flex items-center text-[9px] text-slate-500 mt-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.2
              </span>
            ) : (
              <span className="text-[9px] text-orange-600 font-bold mt-0.5">หาเหรียญ!</span>
            )}
          </button>

          {/* ร้านอาหารพรีเมียม (Lv.3) */}
          <button
            onClick={onOpenFoodShop}
            disabled={level < 3 || isSleeping}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
              level >= 3 && !isSleeping
                ? "bg-gradient-to-b from-rose-50 to-pink-100 border-pink-300 text-pink-950 hover:shadow-sm active:scale-95 cursor-pointer"
                : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75"
            }`}
          >
            <div className="text-xl mb-0.5">🍰</div>
            <span className="text-[11px] font-black leading-tight">ร้านอาหาร</span>
            {level < 3 ? (
              <span className="flex items-center text-[9px] text-slate-500 mt-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.3
              </span>
            ) : (
              <span className="text-[9px] text-pink-600 font-bold mt-0.5">เมนูเด็ด</span>
            )}
          </button>

          {/* ร้านแฟชั่น & ตู้เสื้อผ้า (Lv.5) */}
          <button
            onClick={onOpenWardrobe}
            disabled={level < 5}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
              level >= 5
                ? "bg-gradient-to-b from-purple-50 to-indigo-100 border-purple-300 text-purple-950 hover:shadow-sm active:scale-95 cursor-pointer"
                : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75"
            }`}
          >
            <div className="text-xl mb-0.5">👗</div>
            <span className="text-[11px] font-black leading-tight">ตู้เสื้อผ้า</span>
            {level < 5 ? (
              <span className="flex items-center text-[9px] text-slate-500 mt-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Lv.5
              </span>
            ) : (
              <span className="text-[9px] text-purple-600 font-bold mt-0.5">แต่งตัว</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
