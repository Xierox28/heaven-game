import React, { useState } from "react";
import { X, UserPlus, LogIn, Sparkles, User, Lock, Heart, AlertCircle } from "lucide-react";
import { authService } from "../services/authService";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hamsterName, setHamsterName] = useState("น้องเฮเว่น");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "register") {
        const user = await authService.register(username, password, hamsterName);
        if (onSuccess) onSuccess(user);
        onClose();
      } else {
        const user = await authService.login(username, password);
        if (onSuccess) onSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-300 rounded-3xl p-6 shadow-2xl text-slate-800 animate-slide-in-down">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-white mb-2">
            🐹
          </div>
          <h3 className="text-lg font-black text-amber-950">
            {tab === "login" ? "เข้าสู่ระบบเพื่อเลี้ยงน้อง" : "สมัครสมาชิกสร้างบ้านใหม่"}
          </h3>
          <p className="text-xs text-amber-800 mt-0.5">
            แยกบัญชีผู้เล่น ข้อมูลน้องแฮมสเตอร์และตู้เสื้อผ้าจะบันทึกเฉพาะของคุณ!
          </p>
        </div>

        {/* Tab สลับ Login / Register */}
        <div className="flex bg-amber-200/60 p-1 rounded-2xl border border-amber-300/60 mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              tab === "login"
                ? "bg-amber-500 text-white shadow-xs font-black"
                : "text-amber-900 hover:bg-amber-200/50"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              tab === "register"
                ? "bg-amber-500 text-white shadow-xs font-black"
                : "text-amber-900 hover:bg-amber-200/50"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>สมัครสมาชิก</span>
          </button>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-amber-700" />
              <span>ชื่อผู้ใช้ (Username)</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="เช่น dew, somchai, heaven123"
              className="w-full bg-white border-2 border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-hidden focus:border-amber-500 shadow-inner"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center">
              <Lock className="w-3.5 h-3.5 mr-1 text-amber-700" />
              <span>รหัสผ่าน (Password)</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่านอย่างน้อย 4 ตัวอักษร"
              className="w-full bg-white border-2 border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-hidden focus:border-amber-500 shadow-inner"
            />
          </div>

          {/* Hamster Name (Register only) */}
          {tab === "register" && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center">
                <Heart className="w-3.5 h-3.5 mr-1 text-rose-500" />
                <span>ตั้งชื่อน้องแฮมสเตอร์ของคุณ</span>
              </label>
              <input
                type="text"
                value={hamsterName}
                onChange={(e) => setHamsterName(e.target.value)}
                placeholder="เช่น น้องเฮเว่น, โมจิ, พุดดิ้ง"
                className="w-full bg-white border-2 border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-hidden focus:border-amber-500 shadow-inner"
              />
            </div>
          )}

          {/* ข้อความ Error */}
          {error && (
            <div className="bg-rose-100 border border-rose-300 text-rose-800 p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* ปุ่มส่งฟอร์ม */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {loading
                ? "กำลังดำเนินการ..."
                : tab === "login"
                ? "เข้าสู่ระบบและเริ่มเล่น"
                : "สร้างบัญชีและรับน้องแฮมสเตอร์"}
            </span>
          </button>

          {/* ปุ่มเล่นชั่วคราว */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-bold text-amber-700 hover:underline"
            >
              เล่นต่อในฐานะ Guest ชั่วคราว (ไม่ล็อกอิน)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
