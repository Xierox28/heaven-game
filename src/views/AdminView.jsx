import React, { useState, useEffect } from "react";
import { gameStateService } from "../services/gameStateService";
import { isFirebaseConfigured, firebaseConfig } from "../firebaseConfig";
import { sound } from "../utils/audio";
import { WARDROBE_ITEMS } from "../constants/gameData";
import {
  Shield,
  KeyRound,
  Coins,
  Sparkles,
  Zap,
  Gift,
  MessageSquare,
  Bell,
  CloudRain,
  RotateCcw,
  LogOut,
  ArrowLeft,
  Heart,
  Utensils,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminView({ onNavigateToPlayer }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("heaven_admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [gameState, setGameState] = useState(gameStateService.currentState);

  // Input states สำหรับคำสั่ง GM
  const [speechText, setSpeechText] = useState("");
  const [announceTitle, setAnnounceTitle] = useState("🔔 ข้อความด่วนจากพระเจ้า!");
  const [announceMessage, setAnnounceMessage] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");

  // ฟังการอัปเดตแบบ Real-time
  useEffect(() => {
    const unsubscribe = gameStateService.subscribe((state) => {
      setGameState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  const triggerFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(""), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem("heaven_admin_auth", "true");
      setPasswordError("");
      sound.playLevelUp();
    } else {
      setPasswordError("รหัสผ่านไม่ถูกต้อง! (รหัสเริ่มต้นคือ: 1234)");
      sound.playPrank();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("heaven_admin_auth");
  };

  // 1. หน้าล็อกอิน GM
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-['Itim',sans-serif]">
        <div className="w-full max-w-sm bg-slate-800/90 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl text-white backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-amber-300">แผงควบคุม GM & Admin</h2>
            <p className="text-xs text-slate-400 mt-1">
              ระบบควบคุมเกม Heaven แบบ Real-time ผ่าน Firebase
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                รหัสผ่าน GM (ค่าเริ่มต้น: 1234)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ใส่รหัสผ่าน..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-rose-400 mt-1 font-bold">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-sm shadow-md transition-all active:scale-95"
            >
              เข้าสู่ระบบ GM
            </button>

            <button
              type="button"
              onClick={onNavigateToPlayer}
              className="w-full py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าผู้เล่น</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. แดชบอร์ด GM ควบคุม Real-time
  const isCloud = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Itim',sans-serif] p-3 sm:p-6 pb-16 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-4">
        {/* ============================================================================== */}
        {/* HEADER GM */}
        {/* ============================================================================== */}
        <header className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-400 flex items-center space-x-2">
                <span>Heaven GM Control Panel</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span
                  className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCloud
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-blue-950 text-blue-400 border border-blue-800"
                  }`}
                >
                  {isCloud ? "🟢 Firebase RTDB: Connected" : "🟡 Local Sync Mode"}
                </span>
                <span>Node: <code className="text-amber-200">heaven_game</code></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateToPlayer}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">หน้าผู้เล่น</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-rose-950/50 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-xl text-xs font-bold transition-all"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="bg-emerald-900/80 border border-emerald-500 text-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-md animate-cute-bounce">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* ============================================================================== */}
        {/* DASHBOARD: สถานะปัจจุบันของน้องเฮเว่น (Real-time Mirror) */}
        {/* ============================================================================== */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>🐹 สดจากในกรง (Real-time Live Status)</span>
            <span className="text-[11px] text-amber-400 font-bold">
              อัปเดต: {new Date(gameState.lastUpdated || Date.now()).toLocaleTimeString()}
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold">เลเวล & EXP</div>
              <div className="text-base font-black text-amber-300">
                Lv. {gameState.level} ({gameState.exp}/{gameState.maxExp})
              </div>
            </div>
            <div className="bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold">เมล็ดทานตะวัน</div>
              <div className="text-base font-black text-yellow-400">
                🌻 {gameState.coins} เหรียญ
              </div>
            </div>
            <div className="bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold">สถานะตื่น/หลับ</div>
              <div className="text-base font-black text-indigo-300">
                {gameState.isSleeping ? "💤 กำลังหลับ" : "☀️ กำลังตื่น"}
              </div>
            </div>
            <div className="bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold">ก้อนอึในกรง</div>
              <div className="text-base font-black text-amber-500">
                💩 {gameState.poopCount} ก้อน
              </div>
            </div>
          </div>

          {/* แถบค่าพลัง 4 ด้าน */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-amber-950/40 border border-amber-900/60 p-2 rounded-xl">
              <span className="text-slate-400 text-[10px] block">ความหิว</span>
              <span className="font-black text-amber-400">{gameState.hunger}%</span>
            </div>
            <div className="bg-rose-950/40 border border-rose-900/60 p-2 rounded-xl">
              <span className="text-slate-400 text-[10px] block">ความสุข</span>
              <span className="font-black text-rose-400">{gameState.happiness}%</span>
            </div>
            <div className="bg-sky-950/40 border border-sky-900/60 p-2 rounded-xl">
              <span className="text-slate-400 text-[10px] block">ความสะอาด</span>
              <span className="font-black text-sky-400">{gameState.cleanliness}%</span>
            </div>
            <div className="bg-indigo-950/40 border border-indigo-900/60 p-2 rounded-xl">
              <span className="text-slate-400 text-[10px] block">พลังงาน</span>
              <span className="font-black text-indigo-400">{gameState.energy}%</span>
            </div>
          </div>

          {/* เครื่องแต่งกายที่สวมใส่อยู่ */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">ชุดที่ใส่อยู่:</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-amber-200">
              หมวก: {gameState.equipped?.hat || "ไม่ได้ใส่"}
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-pink-200">
              เครื่องประดับ: {gameState.equipped?.accessory || "ไม่ได้ใส่"}
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-purple-200">
              ชุด: {gameState.equipped?.outfit || "ไม่ได้ใส่"}
            </span>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* GM COMMANDS: เมล็ดทานตะวัน, EXP, ฟื้นฟู, แกล้ง */}
        {/* ============================================================================== */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>คำสั่งด่วน GM (Quick Actions)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* +100 เหรียญ */}
            <button
              onClick={() => {
                gameStateService.adminAddCoins(100);
                triggerFeedback("ส่ง +100 เหรียญให้ผู้เล่นเรียบร้อย!");
              }}
              className="py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>🌻 +100 เหรียญ</span>
            </button>

            {/* +1000 เหรียญ */}
            <button
              onClick={() => {
                gameStateService.adminAddCoins(1000);
                triggerFeedback("ส่ง +1,000 เหรียญมหาศาลให้ผู้เล่น!");
              }}
              className="py-2.5 px-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>💰 +1000 เหรียญ</span>
            </button>

            {/* +100 EXP */}
            <button
              onClick={() => {
                gameStateService.adminAddExp(100);
                triggerFeedback("เพิ่ม +100 EXP ให้ผู้เล่น!");
              }}
              className="py-2.5 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-indigo-300 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>🌟 +100 EXP</span>
            </button>

            {/* อัปเลเวลทันที */}
            <button
              onClick={() => {
                gameStateService.adminLevelUp();
                triggerFeedback(`อัปเลเวลเป็น Lv.${gameState.level + 1} ทันที!`);
              }}
              className="py-2.5 px-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>🚀 อัปเลเวลทันที</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {/* ฟื้นฟูเต็ม 100% */}
            <button
              onClick={() => {
                gameStateService.adminHealAll();
                triggerFeedback("ฟื้นฟูพลัง 100% เต็มทุกหลอด!");
              }}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>ฟื้นฟูเต็ม 100% ทุกหลอด</span>
            </button>

            {/* ปุ่มแกล้ง (เสกอึ 3 ก้อน) */}
            <button
              onClick={() => {
                gameStateService.adminPrank();
                triggerFeedback("แกล้งเสกอึ 3 ก้อน และลดความสะอาดเรียบร้อย!");
              }}
              className="py-2.5 px-3 bg-rose-800/80 hover:bg-rose-700 text-rose-100 border border-rose-600 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>💩 เสกอึ 3 ก้อน (แกล้งน้อง)</span>
            </button>

            {/* Event ฝนเมล็ดทานตะวัน */}
            <button
              onClick={() => {
                gameStateService.adminTriggerSeedRain();
                triggerFeedback("เปิด Event ฝนเมล็ดทานตะวันบนหน้าจอผู้เล่น!");
              }}
              className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <CloudRain className="w-4 h-4" />
              <span>โปรยฝนเมล็ดทานตะวัน!</span>
            </button>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* GM GIFT: ส่งไอเทมลับเข้าตู้เสื้อผ้าผู้เล่นโดยตรง */}
        {/* ============================================================================== */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Gift className="w-4 h-4 text-pink-400" />
            <span>ส่งไอเทมลับเข้าตู้เสื้อผ้าผู้เล่น (Secret Drop)</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                gameStateService.adminGiveSecretItem("hoodie_special");
                triggerFeedback("ส่ง 'ชุดฮู้ดดี้พิเศษ (Special Hoodie)' เข้าตู้เสื้อผ้าผู้เล่นเรียบร้อย!");
              }}
              className="py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 active:scale-95 transition-all shadow-sm"
            >
              <span>🧥 ส่ง 'ชุดฮู้ดดี้พิเศษ'</span>
            </button>

            <button
              onClick={() => {
                gameStateService.adminGiveSecretItem("sunglasses");
                triggerFeedback("ส่ง 'แว่นกันแดดสุดเท่' เข้าตู้เสื้อผ้าผู้เล่น!");
              }}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <span>🕶️ ส่ง 'แว่นกันแดดสุดเท่'</span>
            </button>

            <button
              onClick={() => {
                gameStateService.adminGiveSecretItem("cape_hero");
                triggerFeedback("ส่ง 'ผ้าคลุมฮีโร่' ให้ผู้เล่น!");
              }}
              className="py-2 px-3 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 rounded-xl font-bold text-xs flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <span>🦸 ส่ง 'ผ้าคลุมฮีโร่'</span>
            </button>
          </div>
        </section>

        {/* ============================================================================== */}
        {/* GM COMMUNICATION: สั่งให้น้องพูด (Speech Bubble) & ส่ง Pop-up กลางจอ */}
        {/* ============================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* สั่งให้น้องเฮเว่นพูด (ขึ้น Speech Bubble สดๆ บนหัวน้อง) */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>สั่งให้น้องเฮเว่นพูด (Speech Bubble)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-2">
                ข้อความจะปรากฏขึ้นบนหัวน้องเฮเว่นบนหน้าจอผู้เล่นทันที!
              </p>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="พิมพ์สิ่งที่อยากให้น้องเฮเว่นพูดสดๆ..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
              />
            </div>
            <button
              onClick={() => {
                if (speechText.trim()) {
                  gameStateService.adminSendSpeech(speechText);
                  triggerFeedback("ส่งข้อความขึ้นบนหัวน้องเรียบร้อย!");
                  setSpeechText("");
                }
              }}
              disabled={!speechText.trim()}
              className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 shadow-sm"
            >
              ส่งคำพูดขึ้นหน้าจอน้อง 🐹💬
            </button>
          </section>

          {/* ส่ง Pop-up ประกาศพิเศษกลางจอผู้เล่น */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Bell className="w-4 h-4" />
                <span>ส่ง Pop-up แจ้งเตือนพิเศษกลางจอ</span>
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={announceTitle}
                  onChange={(e) => setAnnounceTitle(e.target.value)}
                  placeholder="หัวข้อประกาศ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-400"
                />
                <textarea
                  value={announceMessage}
                  onChange={(e) => setAnnounceMessage(e.target.value)}
                  placeholder="รายละเอียดข้อความที่ต้องการแจ้งเตือน..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-400"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (announceMessage.trim()) {
                  gameStateService.adminSendAnnouncement(announceTitle, announceMessage);
                  triggerFeedback("ส่ง Pop-up แจ้งเตือนกลางจอผู้เล่นสำเร็จ!");
                  setAnnounceMessage("");
                }
              }}
              disabled={!announceMessage.trim()}
              className="mt-3 w-full py-2 bg-rose-500 hover:bg-rose-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xs rounded-xl transition-all active:scale-95 shadow-sm"
            >
              ยิง Pop-up แจ้งเตือนทันที 📢
            </button>
          </section>
        </div>

        {/* ============================================================================== */}
        {/* DANGER ZONE: RESET GAME */}
        {/* ============================================================================== */}
        <section className="bg-rose-950/20 border border-rose-900/40 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-rose-400">รีเซ็ตสถานะเกมทั้งหมด (Factory Reset)</h4>
            <p className="text-[11px] text-slate-400">
              ล้างค่าสถานะกลับเป็นค่าเริ่มต้น (Lv.1, เหรียญ 60, ตู้เสื้อผ้าเริ่มต้น)
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตเกมกลับสู่ค่าเริ่มต้น?")) {
                gameStateService.adminResetGame();
                triggerFeedback("รีเซ็ตสถานะเกมกลับสู่ค่าเริ่มต้นแล้ว!");
              }
            }}
            className="px-3 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตเกม</span>
          </button>
        </section>
      </div>
    </div>
  );
}
