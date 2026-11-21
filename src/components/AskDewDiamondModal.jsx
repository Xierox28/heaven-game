import React, { useState } from "react";
import { X, Sparkles, Send, Heart, Clock, CheckCircle2, MessageCircle } from "lucide-react";
import { sound } from "../utils/audio";

const PRESET_MESSAGES = [
  "พี่ดิวคนหล่อ ขอเพชรปลูกผักเร่งโตหน่อยน้าบบบ 🥺💎",
  "หนูรักพี่ดิวที่สุดในโลกเล้ยยย ขอเพชรหน่อยค้าบ ✨",
  "ขอเพชรสุ่มกาชาปองหน่อยงับ รับรองจะเป็นเด็กดี 🙏💖",
  "พี่ดิวใจดีที่สุดในสามโลก ขอเพชรสักนิดนะค้าบบ 🐹✨",
];

export default function AskDewDiamondModal({ state, isOpen, onClose, onRequest }) {
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState(PRESET_MESSAGES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSent, setSuccessSent] = useState(false);

  if (!isOpen) return null;

  const currentDiamonds = state?.diamonds || 0;
  const requests = state?.diamondRequests || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    sound.playLevelUp();

    await onRequest(amount, message);
    setIsSubmitting(false);
    setSuccessSent(true);

    setTimeout(() => {
      setSuccessSent(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-sky-50 via-cyan-50/80 to-blue-50 border-4 border-cyan-400 rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-cyan-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 border-2 border-white flex items-center justify-center shadow-md text-xl">
              💎
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                อ้อนแอดมินดิวขอเพชร (VIP Dew Shop)
              </h2>
              <p className="text-[11px] font-bold text-cyan-800">
                ระบบเติมเกมฉบับน่ารัก ส่งข้อความอ้อนแอดมินเพื่อรับเพชรฟรี!
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 bg-cyan-100 hover:bg-cyan-200 text-cyan-900 rounded-full transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="my-3 p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-bounce">💎</span>
            <div>
              <div className="text-[10px] font-black uppercase text-cyan-100">เพชรปัจจุบันของคุณ</div>
              <div className="text-lg font-black">{currentDiamonds.toLocaleString()} เม็ด</div>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 font-bold px-2.5 py-1 rounded-full border border-white/40">
            ใช้เร่งโตผัก & ทางลัด
          </span>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {successSent && (
            <div className="p-3 bg-emerald-500 text-white rounded-2xl font-black text-xs flex items-center space-x-2 shadow-md animate-slide-in-down">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>ส่งข้อความอ้อนพี่ดิวเรียบร้อยแล้วงับ! พี่ดิวจะเข้ามาอนุมัติให้น้า 💖</span>
            </div>
          )}

          {/* Amount Selector */}
          <div>
            <label className="text-xs font-black text-slate-800 mb-1.5 block">
              เลือกจำนวนเพชรที่ต้องการอ้อนขอ:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { sound.playClick(); setAmount(amt); }}
                  className={`py-2 px-1 rounded-xl font-black text-xs border transition-all ${
                    amount === amt
                      ? "bg-cyan-500 text-white border-cyan-600 shadow-sm scale-102"
                      : "bg-white hover:bg-cyan-50 text-slate-800 border-cyan-200"
                  }`}
                >
                  +{amt} 💎
                </button>
              ))}
            </div>
          </div>

          {/* Preset Messages */}
          <div>
            <label className="text-xs font-black text-slate-800 mb-1.5 block">
              เลือกคำพูดอ้อนสำเร็จรูป:
            </label>
            <div className="space-y-1.5">
              {PRESET_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { sound.playClick(); setMessage(msg); }}
                  className={`w-full text-left p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center space-x-1.5 ${
                    message === msg
                      ? "bg-cyan-100 border-cyan-400 text-cyan-950 font-black shadow-xs"
                      : "bg-white/80 hover:bg-cyan-50 border-cyan-200 text-slate-700"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                  <span>{msg}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Input */}
          <div>
            <label className="text-xs font-black text-slate-800 mb-1.5 block">
              หรือพิมพ์ข้อความอ้อนเองตามใจชอบ:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="พิมพ์ข้อความอ้อนแอดมินดิวที่นี่..."
              rows={2}
              className="w-full p-2.5 bg-white border-2 border-cyan-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim()}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "กำลังส่งคำขอ..." : `ส่งคำขออ้อนพี่ดิว (${amount} 💎)`}</span>
          </button>

          {/* Requests History */}
          {requests.length > 0 && (
            <div className="pt-2 border-t border-cyan-200">
              <div className="flex items-center space-x-1 text-xs font-black text-slate-800 mb-2">
                <Clock className="w-3.5 h-3.5 text-cyan-700" />
                <span>ประวัติคำขอที่ผ่านมา:</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {requests.slice(0, 5).map((r, i) => (
                  <div key={r.id || i} className="p-2 bg-white/90 border border-cyan-200 rounded-xl text-[10px]">
                    <div className="flex items-center justify-between font-black">
                      <span className="text-cyan-800">ขอ +{r.amount} 💎</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        r.status === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                      }`}>
                        {r.status === "approved" ? "✓ อนุมัติแล้ว!" : "⏳ รอพี่ดิวอนุมัติ"}
                      </span>
                    </div>
                    <p className="text-slate-600 font-semibold mt-1 italic">"{r.message}"</p>
                    {r.reply && (
                      <p className="text-emerald-700 font-bold mt-1 bg-emerald-50 p-1 rounded-lg border border-emerald-200">
                        👑 พี่ดิว: {r.reply}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
