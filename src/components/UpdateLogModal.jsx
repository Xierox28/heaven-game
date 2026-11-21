import React from "react";
import { X, Scroll, Sparkles, CheckCircle2, History } from "lucide-react";
import { PATCH_NOTES } from "../constants/patchNotes";

export default function UpdateLogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-300 rounded-3xl p-5 shadow-2xl text-slate-800 flex flex-col max-h-[88vh] animate-slide-in-down">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-yellow-400 rounded-2xl mx-auto flex items-center justify-center shadow-md border-2 border-white mb-1.5">
            <Scroll className="w-6 h-6 text-amber-950" />
          </div>
          <h3 className="text-lg font-black text-amber-950">
            ประวัติการอัปเดต (Update Log & Patch Notes)
          </h3>
          <p className="text-xs text-amber-800 font-semibold">
            บันทึกการพัฒนาและปรับปรุงฟีเจอร์ของเกมน้องเฮเว่นทั้งหมด
          </p>
        </div>

        {/* รายการประวัติเวอร์ชัน */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5">
          {PATCH_NOTES.map((patch) => (
            <div
              key={patch.version}
              className="bg-white/95 rounded-2xl p-3.5 border-2 border-amber-200/90 shadow-xs transition-all hover:border-amber-400"
            >
              {/* Version & Date Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded-full ${patch.tagColor} shadow-2xs`}>
                    {patch.tag}
                  </span>
                  <span className="font-black text-sm text-slate-900">{patch.version}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{patch.date}</span>
              </div>

              {/* Title */}
              <h4 className="font-black text-xs text-amber-950 mb-2 leading-snug">
                {patch.title}
              </h4>

              {/* Highlights */}
              <ul className="space-y-1.5 text-[11px] text-slate-700 font-semibold">
                {patch.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5 leading-snug">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-amber-200 text-center">
          <p className="text-[10px] text-amber-800 font-bold">
            🐹 Heaven Game พัฒนาด้วยความตั้งใจเพื่อความสนุกของผู้เล่นทุกคน
          </p>
        </div>
      </div>
    </div>
  );
}
