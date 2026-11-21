import React, { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import { isFirebaseConfigured } from "../firebaseConfig";
import { sound } from "../utils/audio";
import {
  Shield,
  KeyRound,
  Users,
  Search,
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
  CheckCircle2,
  AlertCircle,
  Star,
  Flame,
  Lock,
  Moon,
  Sun,
  Crown,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminView({ onNavigateToPlayer }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("heaven_admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Player Management State
  const [playersList, setPlayersList] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("all"); // 'all' หรือ 'username'
  const [targetHamster, setTargetHamster] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPlayer, setLoadingPlayer] = useState(false);

  // Edit custom stats inputs
  const [editCoins, setEditCoins] = useState(0);
  const [editLevel, setEditLevel] = useState(1);
  const [editHunger, setEditHunger] = useState(100);
  const [editHappiness, setEditHappiness] = useState(100);
  const [editCleanliness, setEditCleanliness] = useState(100);
  const [editEnergy, setEditEnergy] = useState(100);

  // Communication inputs
  const [speechText, setSpeechText] = useState("");
  const [announceTitle, setAnnounceTitle] = useState("🔔 ข้อความด่วนจาก GM!");
  const [announceMessage, setAnnounceMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  // Load players roster
  const loadRoster = async () => {
    const list = await adminService.getAllPlayers();
    setPlayersList(list);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRoster();
    }
  }, [isAuthenticated]);

  // Load selected player's hamster
  useEffect(() => {
    if (!isAuthenticated || selectedTarget === "all") {
      setTargetHamster(null);
      return;
    }

    setLoadingPlayer(true);
    adminService.getPlayerHamster(selectedTarget).then((hamster) => {
      setTargetHamster(hamster);
      if (hamster) {
        setEditCoins(hamster.coins || 0);
        setEditLevel(hamster.level || 1);
        setEditHunger(hamster.hunger ?? 80);
        setEditHappiness(hamster.happiness ?? 85);
        setEditCleanliness(hamster.cleanliness ?? 75);
        setEditEnergy(hamster.energy ?? 90);
      }
      setLoadingPlayer(false);
    });
  }, [selectedTarget, isAuthenticated]);

  const triggerFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 4000);
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
        <div className="w-full max-w-sm bg-slate-800/95 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-amber-300">แผงควบคุม GM & แอดมิน</h2>
            <p className="text-xs text-slate-400 mt-1">
              ระบบดูแลและควบคุมผู้เล่นทุกคนแบบ Real-time
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

  // 2. แดชบอร์ด GM
  const isCloud = isFirebaseConfigured();
  const filteredPlayers = playersList.filter((p) =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.hamsterName && p.hamsterName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Itim',sans-serif] p-3 sm:p-6 pb-20 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-4">
        {/* ============================================================
            HEADER GM
        ============================================================ */}
        <header className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-400 flex items-center space-x-2">
                <span>Heaven Multi-Player GM Suite</span>
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
                  {isCloud ? "🟢 Firebase RTDB: Connected" : "🟡 Local Mode"}
                </span>
                <span>ผู้เล่นในระบบ: <strong className="text-amber-200">{playersList.length} คน</strong></span>
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

        {/* Feedback Banner */}
        {feedback && (
          <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-100 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg animate-slide-in-down">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-300" />
            <span>{feedback}</span>
          </div>
        )}

        {/* ============================================================
            👥 PLAYER ROSTER & SELECTOR (เลือกผู้เล่น หรือทุกคน)
        ============================================================ */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>เลือกเป้าหมายที่ต้องการสั่งการ (Target Player)</span>
            </h3>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อผู้เล่น..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          {/* Quick Target Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Option: Broadcast to All */}
            <button
              onClick={() => setSelectedTarget("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                selectedTarget === "all"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-105"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <span>🌐 ทุกคนในเซิร์ฟเวอร์ (Broadcast)</span>
            </button>

            {/* Registered Players Chips */}
            {filteredPlayers.map((player) => (
              <button
                key={player.username}
                onClick={() => setSelectedTarget(player.username)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  selectedTarget === player.username
                    ? "bg-indigo-600 text-white border border-indigo-400 shadow-md scale-105"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80"
                }`}
              >
                <span>🐹 @{player.username}</span>
                <span className="text-[10px] text-slate-400">({player.hamsterName})</span>
              </button>
            ))}
          </div>
        </section>

        {/* ============================================================
            📊 INSPECT & EDIT SPECIFIC PLAYER (ถ้าเลือกคนใดคนหนึ่ง)
        ============================================================ */}
        {selectedTarget !== "all" && (
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-amber-400 flex items-center space-x-2">
                <span>🐹 ตรวจสอบและแก้ไขข้อมูลของ @{selectedTarget}</span>
                {targetHamster?.pass?.hasGoldPass && (
                  <span className="bg-amber-500/20 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/40">
                    GOLD PASS OWNER ⭐
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  adminService.getPlayerHamster(selectedTarget).then((h) => {
                    setTargetHamster(h);
                    triggerFeedback("รีเฟรชข้อมูลสดเรียบร้อย!");
                  });
                }}
                className="text-[11px] text-slate-400 hover:text-amber-300 underline"
              >
                รีเฟรชข้อมูล
              </button>
            </div>

            {loadingPlayer ? (
              <div className="text-center py-6 text-xs text-slate-400">กำลังโหลดข้อมูลแฮมสเตอร์...</div>
            ) : targetHamster ? (
              <>
                {/* 1. Quick Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">ชื่อน้อง / เลเวล</div>
                    <div className="font-black text-amber-300 mt-0.5">
                      {targetHamster.name || "น้องเฮเว่น"} (Lv. {targetHamster.level || 1})
                    </div>
                  </div>
                  <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">เหรียญทานตะวัน</div>
                    <div className="font-black text-yellow-400 mt-0.5">
                      🌻 {targetHamster.coins || 0}
                    </div>
                  </div>
                  <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">สถานะ / อึในกรง</div>
                    <div className="font-black text-indigo-300 mt-0.5">
                      {targetHamster.isSleeping ? "💤 นอนหลับ" : "☀️ ตื่นอยู่"} ({targetHamster.poopCount || 0} 💩)
                    </div>
                  </div>
                  <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">ตู้เสื้อผ้าที่มี</div>
                    <div className="font-black text-purple-300 mt-0.5">
                      {(targetHamster.inventory || []).length} ชิ้น
                    </div>
                  </div>
                </div>

                {/* 2. Direct Stat Overwrite Form */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-slate-300 flex items-center justify-between">
                    <span>⚡ ปรับแต่งค่าสถานะตัวเลขสด (Direct Edit & Overwrite)</span>
                    <button
                      onClick={async () => {
                        await adminService.updatePlayerHamster(selectedTarget, {
                          coins: Number(editCoins),
                          level: Number(editLevel),
                          hunger: Number(editHunger),
                          happiness: Number(editHappiness),
                          cleanliness: Number(editCleanliness),
                          energy: Number(editEnergy),
                        });
                        triggerFeedback(`บันทึกการแก้ไขค่าสถานะของ @${selectedTarget} เรียบร้อย!`);
                        const updated = await adminService.getPlayerHamster(selectedTarget);
                        setTargetHamster(updated);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-xl shadow-xs transition-all active:scale-95"
                    >
                      บันทึกค่าตัวเลขทั้งหมด
                    </button>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">เหรียญทานตะวัน (Coins)</label>
                      <input
                        type="number"
                        value={editCoins}
                        onChange={(e) => setEditCoins(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">ระดับเลเวล (Level)</label>
                      <input
                        type="number"
                        value={editLevel}
                        onChange={(e) => setEditLevel(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">ความหิว (0-100%)</label>
                      <input
                        type="number"
                        value={editHunger}
                        onChange={(e) => setEditHunger(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">ความสุข (0-100%)</label>
                      <input
                        type="number"
                        value={editHappiness}
                        onChange={(e) => setEditHappiness(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">ความสะอาด (0-100%)</label>
                      <input
                        type="number"
                        value={editCleanliness}
                        onChange={(e) => setEditCleanliness(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">พลังงาน (0-100%)</label>
                      <input
                        type="number"
                        value={editEnergy}
                        onChange={(e) => setEditEnergy(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Special Gifts & Moderation Buttons */}
                <div className="space-y-2">
                  <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                    🎁 ไอเทมพิเศษและคำสั่งจัดการเฉพาะผู้เล่น
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {/* ปลดล็อค Gold Pass */}
                    <button
                      onClick={async () => {
                        await adminService.unlockGoldPass(selectedTarget);
                        triggerFeedback(`ปลดล็อค Gold Pass ให้ @${selectedTarget} เรียบร้อย!`);
                        const h = await adminService.getPlayerHamster(selectedTarget);
                        setTargetHamster(h);
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black rounded-xl shadow-xs active:scale-95 transition-all flex items-center space-x-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-slate-950" />
                      <span>มอบ Gold Pass ฟรี</span>
                    </button>

                    {/* เสกตู้เสื้อผ้าทุกชิ้น */}
                    <button
                      onClick={async () => {
                        await adminService.unlockAllWardrobe(selectedTarget);
                        triggerFeedback(`ปลดล็อคเสื้อผ้าทุกชุดในเกมให้ @${selectedTarget} สำเร็จ!`);
                        const h = await adminService.getPlayerHamster(selectedTarget);
                        setTargetHamster(h);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow-xs active:scale-95 transition-all flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ปลดล็อคตู้เสื้อผ้าครบทุกชุด (All Items)</span>
                    </button>

                    {/* เสกอึ 5 ก้อน */}
                    <button
                      onClick={async () => {
                        sound.playPrank();
                        await adminService.updatePlayerHamster(selectedTarget, {
                          poopCount: 5,
                          cleanliness: 10,
                          speechBubble: {
                            text: "แงงงง! GM แกล้งปล่อยอึ 5 ก้อนเต็มกรงเลย ช่วยเก็บทีงับ 💩🥺",
                            timestamp: Date.now(),
                            duration: 5000,
                          },
                        });
                        triggerFeedback(`แกล้งเสกอึ 5 ก้อนใส่กรง @${selectedTarget} แล้ว!`);
                        const h = await adminService.getPlayerHamster(selectedTarget);
                        setTargetHamster(h);
                      }}
                      className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold rounded-xl active:scale-95 transition-all"
                    >
                      💩 เสกอึ 5 ก้อน (แกล้งน้อง)
                    </button>

                    {/* สั่งนอนหลับ / ปลุก */}
                    <button
                      onClick={async () => {
                        sound.playClick();
                        const nextSleep = !targetHamster.isSleeping;
                        await adminService.updatePlayerHamster(selectedTarget, {
                          isSleeping: nextSleep,
                          actionState: nextSleep ? "sleeping" : "idle",
                          speechBubble: {
                            text: nextSleep ? "GM บังคับปิดไฟนอนแล้วงับ ฟี้~ 💤" : "GM เปิดไฟปลุกน้องแล้ว ☀️",
                            timestamp: Date.now(),
                            duration: 3000,
                          },
                        });
                        triggerFeedback(`สั่งเปลี่ยนสถานะนอน/ตื่นของ @${selectedTarget} แล้ว!`);
                        const h = await adminService.getPlayerHamster(selectedTarget);
                        setTargetHamster(h);
                      }}
                      className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 font-bold rounded-xl active:scale-95 transition-all"
                    >
                      {targetHamster.isSleeping ? "☀️ บังคับปลุกน้อง" : "💤 บังคับสั่งน้องนอน"}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </section>
        )}

        {/* ============================================================
            📢 COMMUNICATION: สั่งให้น้องพูด (Whisper/Broadcast) & Pop-up
        ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* สั่งให้น้องพูด (Speech Bubble) */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>
                  {selectedTarget === "all"
                    ? "📢 ประกาศบนหัวน้องของทุกคน (Broadcast Speech)"
                    : `💬 กระซิบบนหัวน้องของ @${selectedTarget} (Whisper)`}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-2">
                {selectedTarget === "all"
                  ? "ข้อความจะไปขึ้น Speech Bubble บนหัวน้องเฮเว่นของทุกคนที่เปิดเกมอยู่"
                  : `ข้อความจะไปขึ้นบนหัวน้องของ @${selectedTarget} คนเดียวเท่านั้น`}
              </p>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="พิมพ์ข้อความที่ต้องการให้ขึ้นบนหัวน้อง..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
              />
            </div>
            <button
              onClick={async () => {
                if (speechText.trim()) {
                  await adminService.sendSpeech(selectedTarget, speechText);
                  triggerFeedback(
                    selectedTarget === "all"
                      ? "ส่งคำพูดประกาศทั่วเซิร์ฟเวอร์เรียบร้อย!"
                      : `ส่งข้อความกระซิบถึง @${selectedTarget} เรียบร้อย!`
                  );
                  setSpeechText("");
                }
              }}
              disabled={!speechText.trim()}
              className="mt-3 w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 shadow-sm"
            >
              ส่งข้อความทันที 🐹💬
            </button>
          </section>

          {/* ส่ง Pop-up ประกาศพิเศษกลางจอ */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Bell className="w-4 h-4" />
                <span>
                  {selectedTarget === "all"
                    ? "📢 ส่ง Pop-up กลางจอทุกคนทั่วเซิร์ฟเวอร์"
                    : `🔔 ส่ง Pop-up ให้ @${selectedTarget} คนเดียว`}
                </span>
              </h3>
              <div className="space-y-2 mt-2">
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
                  placeholder="รายละเอียดประกาศพิเศษ..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-400"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                if (announceMessage.trim()) {
                  await adminService.sendAnnouncement(selectedTarget, announceTitle, announceMessage);
                  triggerFeedback("ยิง Pop-up แจ้งเตือนกลางจอสำเร็จ!");
                  setAnnounceMessage("");
                }
              }}
              disabled={!announceMessage.trim()}
              className="mt-3 w-full py-2.5 bg-rose-500 hover:bg-rose-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xs rounded-xl transition-all active:scale-95 shadow-sm"
            >
              ยิง Pop-up แจ้งเตือน 📢
            </button>
          </section>
        </div>

        {/* ============================================================
            🌐 SERVER-WIDE ACTIONS (คำสั่งระดับเซิร์ฟเวอร์)
        ============================================================ */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>คำสั่งอีเวนต์เซิร์ฟเวอร์ (Server-wide Broadcasts)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Event ฝนเมล็ดทานตะวัน */}
            <button
              onClick={async () => {
                await adminService.triggerSeedRain();
                triggerFeedback("เปิด Event ฝนเมล็ดทานตะวันให้ผู้เล่นทุกคนแล้ว!");
              }}
              className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-sm"
            >
              <CloudRain className="w-4 h-4" />
              <span>โปรยฝนเมล็ดทานตะวันให้ทุกคน</span>
            </button>

            {/* แจกอั่งเปา 100 เหรียญทุกคน */}
            <button
              onClick={async () => {
                await adminService.massAddCoins(100);
                triggerFeedback("แจกอั่งเปา +100 เหรียญให้ผู้เล่นทุกคนสำเร็จ!");
              }}
              className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 text-slate-950 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-sm"
            >
              <Coins className="w-4 h-4" />
              <span>แจกอั่งเปา +100 🌻 ให้ทุกคน</span>
            </button>

            {/* แจกอั่งเปา 500 เหรียญทุกคน */}
            <button
              onClick={async () => {
                await adminService.massAddCoins(500);
                triggerFeedback("แจกอั่งเปา +500 เหรียญมหาศาลให้ทุกคนสำเร็จ!");
              }}
              className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-sm"
            >
              <Gift className="w-4 h-4" />
              <span>แจกอั่งเปา +500 🌻 ก้อนโต</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
