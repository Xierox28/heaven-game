import React, { useState } from "react";
import {
  X,
  UserPlus,
  LogIn,
  Sparkles,
  User,
  Lock,
  Heart,
  AlertCircle,
  RefreshCw,
  Cloud,
  LogOut,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { authService } from "../services/authService";
import { gameStateService } from "../services/gameStateService";

export default function AuthModal({ isOpen, onClose, currentUser, gameState, onSuccess }) {
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hamsterName, setHamsterName] = useState("น้องเฮเว่น");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [cloudActionLoading, setCloudActionLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
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

  const handleForceCloudReload = async () => {
    setError("");
    setSuccessMsg("");
    setCloudActionLoading(true);
    try {
      const result = await gameStateService.forceCloudReload();
      if (result) {
        setSuccessMsg(`✅ ซิงก์ข้อมูลจากคลาวด์สำเร็จ! (เลเวล ${result.level}, ${result.coins.toLocaleString()} เมล็ด)`);
      } else {
        setError("ไม่สามารถดึงข้อมูลจากคลาวด์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อคลาวด์");
    } finally {
      setCloudActionLoading(false);
    }
  };

  const handleSaveCurrentToCloud = async () => {
    setError("");
    setSuccessMsg("");
    setCloudActionLoading(true);
    try {
      const ok = await gameStateService.saveCurrentToCloud();
      if (ok) {
        setSuccessMsg("✅ สำรองข้อมูลความก้าวหน้าขึ้นเซิร์ฟเวอร์เรียบร้อยแล้ว!");
      } else {
        setError("ไม่สามารถบันทึกข้อมูลขึ้นคลาวด์ได้");
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setCloudActionLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setSuccessMsg("ออกจากระบบเรียบร้อยแล้ว สลับเป็นโหมด Guest");
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-300 rounded-3xl p-6 shadow-2xl text-slate-800 animate-slide-in-down">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================
            CASE A: ผู้เล่นเข้าสู่ระบบอยู่แล้ว (PROFILE & CLOUD SYNC)
            ======================================================== */}
        {currentUser ? (
          <div className="space-y-4">
            {/* ส่วนหัวแสดงโปรไฟล์ */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-white mb-2">
                🐹
              </div>
              <h3 className="text-lg font-black text-amber-950 flex items-center justify-center space-x-1.5">
                <span>{gameState?.name || currentUser.hamsterName || "น้องเฮเว่น"}</span>
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Lv. {gameState?.level || 1}
                </span>
              </h3>
              <p className="text-xs font-bold text-amber-700 mt-0.5">
                บัญชีผู้เล่น: <span className="text-amber-950 font-black">@{currentUser.username}</span>
              </p>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>เชื่อมต่อเซิร์ฟเวอร์คลาวด์ Realtime ☁️</span>
              </div>
            </div>

            {/* กล่องสรุปสถิติล่าสุด */}
            <div className="bg-white/80 border-2 border-amber-200 rounded-2xl p-3 shadow-inner grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <img src="/assets/icons/icon_seed.png" alt="Seeds" className="w-5 h-5 object-contain pixel-art" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">เมล็ดทานตะวัน</div>
                  <div className="font-black text-amber-900 truncate max-w-[100px]">
                    {(gameState?.coins || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <img src="/assets/icons/icon_diamond.png" alt="Diamonds" className="w-5 h-5 object-contain pixel-art" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">เพชรพรีเมียม</div>
                  <div className="font-black text-cyan-600 truncate max-w-[100px]">
                    {(gameState?.diamonds || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="col-span-2 pt-1 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-bold">ฉายา:</span>
                <span className="font-black text-amber-800 truncate max-w-[190px]">
                  {gameState?.playerTitle || "เด็กเส้นแอดมินดิว 💎"}
                </span>
              </div>
            </div>

            {/* ข้อความแจ้งเตือนสถานะ */}
            {successMsg && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 animate-fade-in">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}
            {error && (
              <div className="bg-rose-100 border border-rose-300 text-rose-800 p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* ปุ่มคำสั่งจัดการคลาวด์ */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={cloudActionLoading}
                onClick={handleForceCloudReload}
                className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${cloudActionLoading ? "animate-spin" : ""}`} />
                <span>🔄 ซิงก์ดึงข้อมูลจาก Cloud (โหลดเซฟล่าสุด)</span>
              </button>

              <button
                type="button"
                disabled={cloudActionLoading}
                onClick={handleSaveCurrentToCloud}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-black text-xs shadow-xs transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>☁️ สำรองข้อมูลขึ้นเซิร์ฟเวอร์ทันที</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ (สลับเป็น Guest)</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             CASE B: ผู้เล่นยังไม่ได้เข้าสู่ระบบ (LOGIN / REGISTER FORM)
             ======================================================== */
          <div>
            {/* หัวข้อ */}
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-white mb-2">
                🐹
              </div>
              <h3 className="text-lg font-black text-amber-950">
                {tab === "login" ? "เข้าสู่ระบบเพื่อเลี้ยงน้อง" : "สมัครสมาชิกสร้างบ้านใหม่"}
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                ล็อกอินเครื่องไหนก็ได้ ข้อมูลเลเวล เหรียญ และของตกแต่งจะตามไปด้วยทุกที่! ☁️
              </p>
            </div>

            {/* Tab สลับ Login / Register */}
            <div className="flex bg-amber-200/60 p-1 rounded-2xl border border-amber-300/60 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setTab("login"); setError(""); setSuccessMsg(""); }}
                className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
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
                onClick={() => { setTab("register"); setError(""); setSuccessMsg(""); }}
                className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
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
                  placeholder="เช่น dewkung, somchai, player1"
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
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {loading
                    ? "กำลังซิงก์ดึงข้อมูลจาก Cloud... ☁️"
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
                  className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  เล่นต่อในฐานะ Guest ชั่วคราว (ไม่ล็อกอิน)
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
