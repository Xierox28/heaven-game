import React from "react";
import { ShieldAlert, Bell, Sparkles, X } from "lucide-react";

export default function AnnouncementModal({ announcement, onDismiss }) {
  if (!announcement || !announcement.active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-center animate-cute-bounce">
        {/* ไอคอนประกาศ */}
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center shadow-md border-2 border-white">
          <Bell className="w-8 h-8 text-amber-950 animate-wiggle" />
        </div>

        <div className="inline-flex items-center space-x-1 bg-amber-200/90 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1 border border-amber-300">
          <img
            src="/assets/icons/icon_crown.png"
            alt="Admin"
            className="w-3.5 h-3.5 object-contain pixel-art inline"
          />
          <span>ประกาศพิเศษจาก GM แอดมิน</span>
        </div>

        <h3 className="text-lg font-black text-amber-950 mt-1 mb-2">
          {announcement.title || "ข้อความจากระบบ"}
        </h3>

        <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold mb-5 shadow-inner">
          {announcement.message}
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black text-sm shadow-md hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>รับทราบ & ปิดหน้าต่าง</span>
        </button>
      </div>
    </div>
  );
}
