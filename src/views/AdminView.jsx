import React, { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import { isFirebaseConfigured, database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { sound } from "../utils/audio";
import UpdateLogModal from "../components/UpdateLogModal";
import { WARDROBE_ITEMS } from "../constants/gameData";
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
  EyeOff,
  Scroll,
  Trash2,
  Activity,
  Heart,
  Droplets,
  Package,
  Wrench,
  Radio,
  Send,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sliders,
  DollarSign
} from "lucide-react";

export default function AdminView({ onNavigateToPlayer }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("heaven_admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Active GM Tab
  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'players' | 'requests' | 'broadcasts' | 'diagnostics'

  // Player Management State
  const [playersList, setPlayersList] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("all"); // 'all' หรือ 'username'
  const [targetHamster, setTargetHamster] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState(WARDROBE_ITEMS[0]?.id || "hat_frog");

  // VIP Diamond Requests State
  const [diamondRequests, setDiamondRequests] = useState([]);
  const [reqFilter, setReqFilter] = useState("all");

  // Real-time Global Events State
  const [globalEvents, setGlobalEvents] = useState({
    seedRain: { active: false, timestamp: 0 },
    serverFever: { active: false, expiresAt: 0 },
  });

  // Edit custom stats inputs
  const [editCoins, setEditCoins] = useState(0);
  const [editDiamonds, setEditDiamonds] = useState(0);
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
  const [isUpdateLogOpen, setIsUpdateLogOpen] = useState(false);

  // Subscribe to diamond requests
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = adminService.subscribeDiamondRequests((list) => {
      setDiamondRequests(list);
    });
    return () => unsub();
  }, [isAuthenticated]);

  // Subscribe to real-time global events (Seed Rain & Fever)
  useEffect(() => {
    if (!isAuthenticated || !isFirebaseConfigured() || !database) return;
    const globalRef = ref(database, "global_events");
    const unsub = onValue(globalRef, (snap) => {
      const val = snap.val();
      if (val) {
        setGlobalEvents({
          seedRain: val.seedRainEvent || { active: false, timestamp: 0 },
          serverFever: val.serverFever || { active: false, expiresAt: 0 },
        });
      }
    });
    return () => unsub();
  }, [isAuthenticated]);

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
        setEditDiamonds(hamster.diamonds || 0);
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
    setTimeout(() => setFeedback(""), 4500);
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
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 font-bold"
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
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              เข้าสู่ระบบ GM
            </button>

            <button
              type="button"
              onClick={onNavigateToPlayer}
              className="w-full py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าผู้เล่น</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. แดชบอร์ด GM Master Suite
  const isCloud = isFirebaseConfigured();
  const filteredPlayers = playersList.filter((p) =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.hamsterName && p.hamsterName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingRequestsCount = diamondRequests.filter((r) => r.status !== "approved" && r.status !== "rejected").length;
  const isSeedRainActive = Boolean(globalEvents.seedRain?.active && Date.now() - (globalEvents.seedRain?.timestamp || 0) < 25000);
  const isServerFeverActive = Boolean(globalEvents.serverFever?.active && (globalEvents.serverFever?.expiresAt || 0) > Date.now());
  const feverMinutesLeft = isServerFeverActive ? Math.ceil(((globalEvents.serverFever?.expiresAt || 0) - Date.now()) / 60000) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Itim',sans-serif] p-3 sm:p-6 pb-24 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-4">
        {/* ============================================================
            TOP HEADER GM
        ============================================================ */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-400 flex items-center space-x-2">
                <span>Heaven GM Master Suite</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-black">
                  v8.5 PRO
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
                  {isCloud ? "🟢 Firebase RTDB: Connected" : "🟡 Local Offline"}
                </span>
                <span>ผู้เล่นในระบบ: <strong className="text-amber-200">{playersList.length} คน</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => setIsUpdateLogOpen(true)}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border border-amber-500/40 cursor-pointer"
              title="ประวัติการอัปเดต"
            >
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Update Log</span>
            </button>

            <button
              onClick={onNavigateToPlayer}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border border-slate-700 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>หน้าผู้เล่น</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-rose-950/50 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="ออกจากระบบ GM"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <UpdateLogModal
          isOpen={isUpdateLogOpen}
          onClose={() => setIsUpdateLogOpen(false)}
        />

        {/* Feedback Alert Toast */}
        {feedback && (
          <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-100 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg animate-slide-in-down">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-300" />
            <span>{feedback}</span>
          </div>
        )}

        {/* ============================================================
            SERVER KPI CARDS BAR (LIVE SERVER OVERVIEW)
        ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Total Players */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase">
              <span>ผู้เล่นทั้งหมด</span>
              <Users className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-300 mt-1">
              {playersList.length} <span className="text-xs text-slate-400 font-bold">คน</span>
            </div>
          </div>

          {/* 2. Pending Requests */}
          <div className={`rounded-2xl p-3 flex flex-col justify-between border transition-all ${
            pendingRequestsCount > 0
              ? "bg-cyan-950/70 border-cyan-500/70 animate-pulse"
              : "bg-slate-900/90 border-slate-800"
          }`}>
            <div className="flex items-center justify-between text-cyan-300 text-[10px] font-black uppercase">
              <span>คำขอเพชรใหม่</span>
              <img src="/assets/icons/icon_diamond.png" alt="Diamond" className="w-3.5 h-3.5 object-contain pixel-art" />
            </div>
            <div className="text-lg font-black text-cyan-300 mt-1">
              {pendingRequestsCount} <span className="text-xs font-bold">รายการรอ</span>
            </div>
          </div>

          {/* 3. Seed Rain Live Status */}
          <div className={`rounded-2xl p-3 flex flex-col justify-between border transition-all ${
            isSeedRainActive
              ? "bg-amber-950/80 border-amber-500 shadow-md animate-pulse"
              : "bg-slate-900/90 border-slate-800"
          }`}>
            <div className="flex items-center justify-between text-amber-300 text-[10px] font-black uppercase">
              <span>ฝนทานตะวัน</span>
              <CloudRain className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs font-black ${isSeedRainActive ? "text-amber-300" : "text-slate-400"}`}>
                {isSeedRainActive ? "🌧️ กำลังตก" : "☀️ ปิดอยู่"}
              </span>
              {isSeedRainActive ? (
                <button
                  onClick={async () => {
                    await adminService.stopSeedRain();
                    triggerFeedback("หยุด Event ฝนเมล็ดทานตะวันทันทีเรียบร้อย!");
                  }}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-[9px] rounded-lg active:scale-95 cursor-pointer shadow-xs"
                >
                  🛑 ปิดฝน
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await adminService.triggerSeedRain(25);
                    triggerFeedback("โปรยฝนทานตะวัน 25 วินาทีเรียบร้อย!");
                  }}
                  className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[9px] rounded-lg active:scale-95 cursor-pointer shadow-xs"
                >
                  🌧️ โปรย
                </button>
              )}
            </div>
          </div>

          {/* 4. Server Fever Live Status */}
          <div className={`rounded-2xl p-3 flex flex-col justify-between border transition-all ${
            isServerFeverActive
              ? "bg-orange-950/80 border-orange-500 shadow-md animate-pulse"
              : "bg-slate-900/90 border-slate-800"
          }`}>
            <div className="flex items-center justify-between text-orange-300 text-[10px] font-black uppercase">
              <span>Server Fever</span>
              <Flame className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs font-black ${isServerFeverActive ? "text-yellow-300" : "text-slate-400"}`}>
                {isServerFeverActive ? `🔥 x2 (${feverMinutesLeft}น.)` : "⏸️ ปิดอยู่"}
              </span>
              {isServerFeverActive && (
                <button
                  onClick={async () => {
                    await adminService.stopServerFever();
                    triggerFeedback("ปิด Server Fever Time เรียบร้อย!");
                  }}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-rose-300 font-black text-[9px] rounded-lg active:scale-95 cursor-pointer border border-rose-500/30"
                >
                  ปิด
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            NAVIGATION TABS (TAB BAR)
        ============================================================ */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900/95 border border-slate-800 rounded-2xl overflow-x-auto shadow-inner">
          {/* Tab 1: Server Events & Economy */}
          <button
            onClick={() => { sound.playClick(); setActiveTab("events"); }}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "events"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Flame className="w-3.5 h-3.5 flex-shrink-0" />
            <span>⚡ อีเวนต์ & เศรษฐกิจ</span>
          </button>

          {/* Tab 2: Players Manager */}
          <button
            onClick={() => { sound.playClick(); setActiveTab("players"); }}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "players"
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>👥 จัดการผู้เล่น</span>
            <span className="bg-slate-950/40 text-[9px] px-1.5 rounded-full font-black ml-1">
              {playersList.length}
            </span>
          </button>

          {/* Tab 3: VIP Diamond Requests */}
          <button
            onClick={() => { sound.playClick(); setActiveTab("requests"); }}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <img src="/assets/icons/icon_diamond.png" alt="Diamond" className="w-3.5 h-3.5 object-contain pixel-art flex-shrink-0" />
            <span>คำขอเพชร</span>
            {pendingRequestsCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* Tab 4: Announcements & Speech */}
          <button
            onClick={() => { sound.playClick(); setActiveTab("broadcasts"); }}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "broadcasts"
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Bell className="w-3.5 h-3.5 flex-shrink-0" />
            <span>📢 ประกาศ & บอลลูน</span>
          </button>

          {/* Tab 5: System Diagnostics */}
          <button
            onClick={() => { sound.playClick(); setActiveTab("diagnostics"); }}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "diagnostics"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
            <span>🛠️ เครื่องมือระบบ</span>
          </button>
        </div>

        {/* ============================================================
            TAB 1: ⚡ SERVER EVENTS & ECONOMY (ควบคุมอีเวนต์ & ฝนทานตะวัน)
        ============================================================ */}
        {activeTab === "events" && (
          <div className="space-y-4 animate-fade-in">
            {/* Panel 1: Seed Rain Master Control */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <CloudRain className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    ระบบฝนเมล็ดทานตะวัน (Seed Rain Control)
                  </h3>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isSeedRainActive
                    ? "bg-amber-950 text-amber-300 border-amber-600 animate-pulse"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {isSeedRainActive ? "🌧️ ฝนกำลังตกทั่วเซิร์ฟเวอร์" : "☀️ ปิดอยู่ (ไม่มีฝน)"}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                สั่งโปรยฝนเมล็ดทานตะวันจากท้องฟ้าลงสู่กรงของผู้เล่นทุกคน ผู้เล่นสามารถแตะเพื่อเก็บเหรียญ (+5 ต่อเม็ด) มีระบบหมดอายุอัตโนมัติ 25 วินาทีเพื่อไม่ให้ค้างตอนเข้าเกมใหม่
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={async () => {
                    await adminService.triggerSeedRain(25);
                    triggerFeedback("เปิด Event ฝนเมล็ดทานตะวัน (25 วินาที) ให้ทุกคนเรียบร้อย! 🌧️🌻");
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <CloudRain className="w-4 h-4" />
                  <span>โปรยฝนเมล็ดทานตะวัน (25 วินาที)</span>
                </button>

                <button
                  onClick={async () => {
                    await adminService.stopSeedRain();
                    triggerFeedback("หยุด/ปิด Event ฝนเมล็ดทานตะวันทันทีเรียบร้อย! 🛑");
                  }}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>🛑 ปิดฝนทานตะวันทันที (Stop Rain Now)</span>
                </button>
              </div>
            </section>

            {/* Panel 2: Server Fever Time Master */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h3 className="text-xs font-black text-orange-400 uppercase tracking-wider">
                    Server Fever Time (คูณ 2 เหรียญ & EXP ทั่วเซิร์ฟเวอร์)
                  </h3>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isServerFeverActive
                    ? "bg-orange-950 text-orange-300 border-orange-500 animate-pulse"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {isServerFeverActive ? `🔥 คูณ 2 กำลังทำงาน (เหลือ ${feverMinutesLeft} นาที)` : "⏸️ ปิดอยู่"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={async () => {
                    await adminService.triggerServerFever(15);
                    triggerFeedback("เปิด Golden Fever Time 15 นาทีเรียบร้อย! 🔥");
                  }}
                  className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-slate-950 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>เปิด 15 นาที</span>
                </button>

                <button
                  onClick={async () => {
                    await adminService.triggerServerFever(30);
                    triggerFeedback("เปิด Golden Fever Time 30 นาทีเรียบร้อย! 🔥");
                  }}
                  className="p-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 text-slate-950 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>เปิด 30 นาที</span>
                </button>

                <button
                  onClick={async () => {
                    await adminService.triggerServerFever(60);
                    triggerFeedback("เปิด Golden Fever Time 1 ชั่วโมงเรียบร้อย! 🔥");
                  }}
                  className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 text-slate-950 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Star className="w-4 h-4" />
                  <span>เปิด 1 ชั่วโมง</span>
                </button>

                <button
                  onClick={async () => {
                    await adminService.stopServerFever();
                    triggerFeedback("ปิด Server Fever Time เรียบร้อย!");
                  }}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ปิด Fever Time</span>
                </button>
              </div>
            </section>

            {/* Panel 3: Mystery Box Drops & Airdrops */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-800 pb-2">
                <Gift className="w-4 h-4" />
                <span>ดรอปกล่องสมบัติปริศนา & แจกอั่งเปา (Airdrops & Economy)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Drop Mystery Box */}
                <button
                  onClick={async () => {
                    await adminService.dropMysteryBox(selectedTarget);
                    triggerFeedback(
                      selectedTarget === "all"
                        ? "ดรอปกล่องสมบัติปริศนาลงกรงผู้เล่นทุกคนแล้ว! 🎁✨"
                        : `ดรอปกล่องสมบัติปริศนาลงกรงของ @${selectedTarget} แล้ว! 🎁`
                    );
                  }}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  <img src="/assets/icons/icon_gift.png" alt="Gift" className="w-4 h-4 object-contain pixel-art" />
                  <span>
                    {selectedTarget === "all"
                      ? "ดรอปกล่องสมบัติให้ทุกคน 🎁"
                      : `ดรอปกล่องสมบัติให้ @${selectedTarget}`}
                  </span>
                </button>

                {/* Mass Coins 500 */}
                <button
                  onClick={async () => {
                    await adminService.massAddCoins(500);
                    triggerFeedback("แจกอั่งเปา +500 เหรียญให้ทุกคนสำเร็จ! 🌻");
                  }}
                  className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <img src="/assets/icons/icon_seed.png" alt="Seeds" className="w-4 h-4 object-contain pixel-art" />
                  <span>แจกอั่งเปา +500 🌻 ทุกคน</span>
                </button>

                {/* Mass Diamonds 100 */}
                <button
                  onClick={async () => {
                    await adminService.massAddDiamonds(100);
                    triggerFeedback("พี่ดิวเสกเพชร +100 💎 ให้ทุกคนสำเร็จ!");
                  }}
                  className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 text-white rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <img src="/assets/icons/icon_diamond.png" alt="Diamond" className="w-4 h-4 object-contain pixel-art" />
                  <span>แจกเพชร +100 💎 ทุกคน</span>
                </button>
              </div>

              {/* Emergency Clear All Global Events */}
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={async () => {
                    await adminService.clearAllGlobalEvents();
                    triggerFeedback("ล้างอีเวนต์ค้างในระบบทั้งหมดเรียบร้อยแล้ว (ฝน, กล่อง, บอลลูน)! 🧹");
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
                  title="แก้ปัญหาอีเวนต์ฝนหรือกล่องค้างตอนเข้าเกม"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>🧹 ล้างอีเวนต์ค้างทั้งหมดในเซิร์ฟเวอร์ (Reset Global Events)</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================
            TAB 2: 👥 PLAYER MANAGER (จัดการและตรวจสอบผู้เล่น)
        ============================================================ */}
        {activeTab === "players" && (
          <div className="space-y-4 animate-fade-in">
            {/* Player Target Selector */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-4 h-4" />
                  <span>เลือกเป้าหมายที่ต้องการสั่งการ (Target Player)</span>
                </h3>

                {/* Search Bar */}
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

              {/* Player Chips */}
              <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedTarget("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                    selectedTarget === "all"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-105"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  }`}
                >
                  <span>🌐 ทุกคนในเซิร์ฟเวอร์ (Broadcast)</span>
                </button>

                {filteredPlayers.map((player) => (
                  <button
                    key={player.username}
                    onClick={() => setSelectedTarget(player.username)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      selectedTarget === player.username
                        ? "bg-amber-400 text-amber-950 font-black shadow-md scale-105"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <span>🐹</span>
                    <span>{player.hamsterName}</span>
                    <span className="text-[10px] opacity-75 font-normal">(@{player.username})</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Inspect Selected Player */}
            {selectedTarget !== "all" && (
              <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-black text-amber-400 flex items-center space-x-2">
                    <span>🐹 ข้อมูลสดของ @{selectedTarget}</span>
                    {targetHamster?.pass?.hasGoldPass && (
                      <span className="bg-amber-500/20 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center space-x-1">
                        <span>GOLD PASS</span>
                        <img src="/assets/icons/icon_star.png" alt="Star" className="w-3 h-3 object-contain pixel-art inline" />
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      adminService.getPlayerHamster(selectedTarget).then((h) => {
                        setTargetHamster(h);
                        triggerFeedback("รีเฟรชข้อมูลผู้เล่นสดเรียบร้อย!");
                      });
                    }}
                    className="text-xs text-slate-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>รีเฟรชข้อมูล</span>
                  </button>
                </div>

                {loadingPlayer ? (
                  <div className="text-center py-6 text-xs text-slate-400">กำลังโหลดข้อมูลแฮมสเตอร์...</div>
                ) : targetHamster ? (
                  <>
                    {/* Player Quick Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-bold">ชื่อน้อง / เลเวล</div>
                        <div className="font-black text-amber-300 mt-0.5">
                          {targetHamster.name || "น้องเฮเว่น"} (Lv. {targetHamster.level || 1})
                        </div>
                      </div>
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-bold">เหรียญทานตะวัน</div>
                        <div className="font-black text-yellow-400 mt-0.5 flex items-center space-x-1">
                          <img src="/assets/icons/icon_seed.png" alt="Seeds" className="w-3.5 h-3.5 object-contain pixel-art inline" />
                          <span>{(targetHamster.coins || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-bold">เพชร VIP</div>
                        <div className="font-black text-cyan-300 mt-0.5 flex items-center space-x-1">
                          <img src="/assets/icons/icon_diamond.png" alt="Diamond" className="w-3.5 h-3.5 object-contain pixel-art inline" />
                          <span>{(targetHamster.diamonds || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-bold">สถานะ / อึในกรง</div>
                        <div className="font-black text-indigo-300 mt-0.5 flex items-center space-x-1">
                          <span>{targetHamster.isSleeping ? "💤 นอนหลับ" : "☀️ ตื่นอยู่"}</span>
                          <span className="flex items-center text-amber-200">
                            <span>({targetHamster.poopCount || 0}</span>
                            <img src="/assets/icons/icon_poop.png" alt="Poop" className="w-3.5 h-3.5 object-contain pixel-art inline ml-0.5" />
                            <span>)</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Cheat Presets */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        <span>คำสั่งบูสต์ด่วน (One-Click Quick Cheats)</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <button
                          onClick={async () => {
                            await adminService.quickBoostPlayer(selectedTarget, "coins_10k");
                            triggerFeedback(`เสก +10,000 🌻 ให้ @${selectedTarget} เรียบร้อย!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-black active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>+10,000 🌻</span>
                        </button>

                        <button
                          onClick={async () => {
                            await adminService.quickBoostPlayer(selectedTarget, "coins_100k");
                            triggerFeedback(`เสก +100,000 🌻 ให้ @${selectedTarget} เรียบร้อย!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 rounded-xl font-black active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>+100,000 🌻</span>
                        </button>

                        <button
                          onClick={async () => {
                            await adminService.quickBoostPlayer(selectedTarget, "diamonds_1k");
                            triggerFeedback(`เสก +1,000 💎 ให้ @${selectedTarget} เรียบร้อย!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl font-black active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>+1,000 💎</span>
                        </button>

                        <button
                          onClick={async () => {
                            await adminService.quickBoostPlayer(selectedTarget, "max_vitals");
                            triggerFeedback(`ฟื้นฟูค่าสถานะทั้งหมด 100% ให้ @${selectedTarget} เรียบร้อย!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-black active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Heart className="w-3 h-3 text-pink-400" />
                          <span>ฟื้นฟูเต็ม 100% (Max All Vitals)</span>
                        </button>

                        <button
                          onClick={async () => {
                            await adminService.quickBoostPlayer(selectedTarget, "clean_poop");
                            triggerFeedback(`ล้างอึในกรงให้ @${selectedTarget} สะอาดเรียบร้อย!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl font-black active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>🧹 ล้างอึในกรง (0 ก้อน)</span>
                        </button>

                        <button
                          onClick={async () => {
                            await adminService.quickBoostPlayer(selectedTarget, "level_plus_5");
                            triggerFeedback(`เพิ่มเลเวล +5 ให้ @${selectedTarget} เรียบร้อย!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl font-black active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>🚀 เลเวล +5</span>
                        </button>

                        <button
                          onClick={async () => {
                            await adminService.unlockGoldPass(selectedTarget);
                            triggerFeedback(`ปลดล็อค Gold Pass ให้ @${selectedTarget} สำเร็จ!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 rounded-xl font-black active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>มอบ Gold Pass ฟรี</span>
                        </button>

                        <button
                          onClick={async () => {
                            await adminService.unlockAllWardrobe(selectedTarget);
                            triggerFeedback(`ปลดล็อคตู้เสื้อผ้าทุกชุดให้ @${selectedTarget} สำเร็จ!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>เสกเสื้อผ้าครบทุกชุด</span>
                        </button>
                      </div>
                    </div>

                    {/* Direct Stat Overwrite Form */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-300 flex items-center space-x-1">
                          <Sliders className="w-3.5 h-3.5 text-amber-400" />
                          <span>ปรับแต่งค่าตัวเลขโดยละเอียด (Direct Numeric Overwrite)</span>
                        </span>
                        <button
                          onClick={async () => {
                            await adminService.updatePlayerHamster(selectedTarget, {
                              coins: Number(editCoins),
                              diamonds: Number(editDiamonds),
                              level: Number(editLevel),
                              hunger: Number(editHunger),
                              happiness: Number(editHappiness),
                              cleanliness: Number(editCleanliness),
                              energy: Number(editEnergy),
                            });
                            triggerFeedback(`บันทึกค่าตัวเลขทั้งหมดของ @${selectedTarget} เรียบร้อย!`);
                            const updated = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(updated);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          บันทึกค่าตัวเลขทั้งหมด
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
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
                          <label className="text-[10px] text-cyan-400 font-bold block mb-1">เพชรพรีเมียม (Diamonds 💎)</label>
                          <input
                            type="number"
                            value={editDiamonds}
                            onChange={(e) => setEditDiamonds(e.target.value)}
                            className="w-full bg-slate-900 border border-cyan-700/60 rounded-lg px-2.5 py-1 text-cyan-300 font-bold"
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

                    {/* Direct Item Gifter */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="text-[11px] font-black text-purple-400 uppercase tracking-wider flex items-center space-x-1">
                        <Package className="w-3.5 h-3.5" />
                        <span>เสกไอเทมเฉพาะชิ้นส่งตรงเข้ากระเป๋า (Item Gifter)</span>
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={selectedWardrobeItem}
                          onChange={(e) => setSelectedWardrobeItem(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                        >
                          {WARDROBE_ITEMS.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.category})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={async () => {
                            await adminService.grantItemToPlayer(selectedTarget, selectedWardrobeItem);
                            triggerFeedback(`เสกไอเทม '${selectedWardrobeItem}' ให้ @${selectedTarget} เรียบร้อย!`);
                            const h = await adminService.getPlayerHamster(selectedTarget);
                            setTargetHamster(h);
                          }}
                          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          เสกไอเทมนี้ 🎁
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-bold">
                        พื้นที่จัดการขั้นสูง (Danger Operations):
                      </span>
                      <button
                        onClick={async () => {
                          if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ/รีเซ็ตข้อมูลของ @${selectedTarget}?`)) {
                            await adminService.deletePlayerAccount(selectedTarget);
                            triggerFeedback(`ลบ/รีเซ็ตข้อมูลของ @${selectedTarget} เรียบร้อยแล้ว!`);
                            await loadRoster();
                            setSelectedTarget("all");
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl border border-rose-800/80 transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>ลบ/รีเซ็ตข้อมูลบัญชีผู้เล่นนี้</span>
                      </button>
                    </div>
                  </>
                ) : null}
              </section>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: 💎 VIP DIAMOND REQUESTS (รายการคำขออ้อนขอเพชร)
        ============================================================ */}
        {activeTab === "requests" && (
          <div className="space-y-4 animate-fade-in">
            {(() => {
              const pendingCount = diamondRequests.filter((r) => r.status !== "approved" && r.status !== "rejected").length;
              const approvedCount = diamondRequests.filter((r) => r.status === "approved").length;
              const rejectedCount = diamondRequests.filter((r) => r.status === "rejected").length;

              const filteredRequests = diamondRequests.filter((r) => {
                if (reqFilter === "pending") return r.status !== "approved" && r.status !== "rejected";
                if (reqFilter === "approved") return r.status === "approved";
                if (reqFilter === "rejected") return r.status === "rejected";
                return true;
              });

              return (
                <section className="bg-slate-900/90 border border-cyan-800/60 rounded-3xl p-4 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-900/50 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <img src="/assets/icons/icon_diamond.png" alt="Diamond" className="w-4 h-4 object-contain pixel-art inline" />
                        <span>คำขออ้อนขอเพชรจากผู้เล่น (VIP Diamond Requests)</span>
                      </h3>
                      <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {diamondRequests.length} รายการ
                      </span>
                    </div>

                    {/* Quick Action: ล้างรายการที่เสร็จแล้ว */}
                    {(approvedCount > 0 || rejectedCount > 0) && (
                      <button
                        type="button"
                        onClick={async () => {
                          await adminService.clearProcessedDiamondRequests();
                          triggerFeedback("ล้างรายการคำขอที่อนุมัติ/ยกเลิกแล้วทั้งหมดเรียบร้อย!");
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-[10px] rounded-xl border border-rose-500/30 transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400" />
                        <span>ล้างรายการที่เสร็จแล้ว ({approvedCount + rejectedCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {[
                      { id: "all", label: `ทั้งหมด (${diamondRequests.length})` },
                      { id: "pending", label: `⏳ รอดิวอนุมัติ (${pendingCount})` },
                      { id: "approved", label: `✓ อนุมัติแล้ว (${approvedCount})` },
                      { id: "rejected", label: `❌ ยกเลิก/ปฏิเสธ (${rejectedCount})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setReqFilter(tab.id)}
                        className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          reqFilter === tab.id
                            ? "bg-cyan-500 text-slate-950 font-black shadow-xs"
                            : "bg-slate-800 hover:bg-slate-750 text-slate-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Requests List */}
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 font-bold bg-slate-950/60 rounded-2xl border border-slate-800">
                      {reqFilter === "pending"
                        ? "✨ ไม่มีคำขอเพชรรออนุมัติในขณะนี้ ทุกคนได้รับเพชรครบถ้วนแล้ว!"
                        : "ไม่พบรายการคำขอในหมวดหมู่นี้"}
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {filteredRequests.map((req) => {
                        const isPending = req.status !== "approved" && req.status !== "rejected";
                        const isApproved = req.status === "approved";
                        const isRejected = req.status === "rejected";

                        return (
                          <div
                            key={req.id}
                            className={`bg-slate-950/80 border rounded-2xl p-3 text-xs flex flex-col space-y-2 transition-all ${
                              isPending
                                ? "border-cyan-800/80 shadow-xs"
                                : isApproved
                                ? "border-emerald-800/40 opacity-80"
                                : "border-rose-900/40 opacity-70"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-black text-cyan-300">@{req.username}</span>
                                <span className="text-[10px] text-slate-400">({req.hamsterName})</span>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                <span className="font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full text-[11px] flex items-center space-x-1">
                                  <span>ขอ +{req.amount}</span>
                                  <img src="/assets/icons/icon_diamond.png" alt="Diamond" className="w-3 h-3 object-contain pixel-art inline" />
                                </span>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    await adminService.deleteDiamondRequest(req.id);
                                    triggerFeedback(`ลบรายการคำขอของ @${req.username} เรียบร้อย 🗑️`);
                                  }}
                                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="ลบรายการนี้ทิ้ง"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-slate-300 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                              "{req.message}"
                            </p>

                            {req.reply && (
                              <div className={`text-[11px] p-2 rounded-xl border flex items-center space-x-1 ${
                                isApproved
                                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
                                  : "bg-rose-950/40 text-rose-300 border-rose-800/40"
                              }`}>
                                <img src="/assets/icons/icon_crown.png" alt="Admin" className="w-3 h-3 object-contain pixel-art inline flex-shrink-0" />
                                <span className="font-black">ตอบกลับ: </span>
                                <span>{req.reply}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800/80">
                              <span className={`text-[10px] font-bold flex items-center space-x-1 ${
                                isApproved
                                  ? "text-emerald-400"
                                  : isRejected
                                  ? "text-rose-400"
                                  : "text-amber-400"
                              }`}>
                                <span>สถานะ:</span>
                                <span>
                                  {isApproved
                                    ? "✓ อนุมัติแล้ว"
                                    : isRejected
                                    ? "❌ ปฏิเสธ/ยกเลิกแล้ว"
                                    : "⏳ รอดิวอนุมัติ"}
                                </span>
                              </span>

                              <div className="flex flex-wrap items-center gap-1.5">
                                {isPending ? (
                                  <>
                                    {[req.amount || 100, 500, 1000].map((amt) => (
                                      <button
                                        key={amt}
                                        type="button"
                                        onClick={async () => {
                                          await adminService.approveDiamondRequest(req.id, req.username, amt);
                                          triggerFeedback(`อนุมัติแจก +${amt} 💎 ให้ @${req.username} แล้ว!`);
                                        }}
                                        className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 text-white font-black text-[10px] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
                                      >
                                        <span>อนุมัติ +{amt}</span>
                                        <img src="/assets/icons/icon_diamond.png" alt="Diamond" className="w-3 h-3 object-contain pixel-art inline" />
                                      </button>
                                    ))}

                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await adminService.rejectDiamondRequest(req.id, req.username);
                                        triggerFeedback(`ยกเลิก/ปฏิเสธคำขอของ @${req.username} แล้ว ❌`);
                                      }}
                                      className="px-2 py-1 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 font-bold text-[10px] rounded-xl transition-all active:scale-95 cursor-pointer border border-slate-700"
                                    >
                                      ปฏิเสธ ✕
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await adminService.deleteDiamondRequest(req.id);
                                      triggerFeedback(`ล้างรายการคำขอของ @${req.username} เรียบร้อย 🗑️`);
                                    }}
                                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-rose-300 text-[10px] rounded-lg border border-slate-700 transition-colors"
                                  >
                                    ลบประวัติ 🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })()}
          </div>
        )}

        {/* ============================================================
            TAB 4: 📢 ANNOUNCEMENTS & SPEECH (สื่อสารและบอลลูน)
        ============================================================ */}
        {activeTab === "broadcasts" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
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

                {/* Preset speech chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    "พี่ดิวมาตรวจกรงแล้วน้า! 🐹👑",
                    "อย่าลืมให้อาหารและลูบหัวผมด้วยนะค้าบ 🥣💖",
                    "วันนี้น้องเฮเว่นน่ารักที่สุดในโลก! ✨",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSpeechText(preset)}
                      className="text-[9px] bg-slate-800 hover:bg-slate-750 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
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
                className="mt-3 w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
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

              <div className="space-y-2 mt-3">
                <button
                  onClick={async () => {
                    if (announceMessage.trim()) {
                      await adminService.sendAnnouncement(selectedTarget, announceTitle, announceMessage);
                      triggerFeedback("ยิง Pop-up แจ้งเตือนกลางจอสำเร็จ! 📢");
                      setAnnounceMessage("");
                    }
                  }}
                  disabled={!announceMessage.trim()}
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xs rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  ยิง Pop-up แจ้งเตือน 📢
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await adminService.clearAnnouncement();
                    triggerFeedback("ลบและยกเลิกประกาศสากลเรียบร้อยแล้ว!");
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 font-black text-xs rounded-xl transition-all border border-rose-500/30 flex items-center justify-center space-x-1 active:scale-95 cursor-pointer"
                >
                  <span>❌ ลบ/ยกเลิกประกาศสากล (แก้บัคค้าง)</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================
            TAB 5: 🛠️ DIAGNOSTICS & SYSTEM TOOLS (เครื่องมือระบบ & วินิจฉัย)
        ============================================================ */}
        {activeTab === "diagnostics" && (
          <div className="space-y-4 animate-fade-in">
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-800 pb-2">
                <Wrench className="w-4 h-4" />
                <span>การวินิจฉัยและเครื่องมือช่วยเหลือระบบ (System Health & Utilities)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Database Connectivity */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="font-black text-amber-300 flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>สถานะการเชื่อมต่อฐานข้อมูล (Database Sync)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {isCloud
                      ? "เชื่อมต่อกับ Firebase Realtime Database แบบ Real-time ผู้เล่นทุกคนจะได้รับข้อมูลอีเวนต์และคำสั่งพร้อมกันทันที"
                      : "ทำงานในโหมด Local Storage ออฟไลน์ การเปลี่ยนแปลงจะมีผลเฉพาะเครื่องที่เปิดอยู่"}
                  </p>
                  <div className="pt-1">
                    <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                      isCloud ? "bg-emerald-950 text-emerald-300 border border-emerald-700" : "bg-blue-950 text-blue-300 border border-blue-700"
                    }`}>
                      {isCloud ? "LIVE CLOUD SYNC" : "OFFLINE FALLBACK"}
                    </span>
                  </div>
                </div>

                {/* Stale Event Cleaner */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="font-black text-rose-300 flex items-center space-x-1.5">
                    <RotateCcw className="w-4 h-4 text-rose-400" />
                    <span>ล้างอีเวนต์ตกค้าง (Emergency Event Wipe)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    หากผู้เล่นพบปัญหาฝนเมล็ดทานตะวันขึ้นแจ้งเตือนทุกครั้งที่เข้าเกมใหม่ หรือกล่องสมบัติค้าง ให้กดปุ่มนี้เพื่อล้างสถานะสากลทั้งหมดให้สะอาดหมดจด
                  </p>
                  <button
                    onClick={async () => {
                      await adminService.clearAllGlobalEvents();
                      triggerFeedback("ล้างอีเวนต์ตกค้างในระบบทั้งหมดเรียบร้อยแล้ว! 🧹");
                    }}
                    className="w-full mt-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    🧹 ล้างอีเวนต์ค้างทั้งหมดทันที
                  </button>
                </div>
              </div>

              {/* Roster Sync */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">
                  ต้องการตรวจสอบรายชื่อผู้เล่นที่เพิ่งลงทะเบียนใหม่?
                </span>
                <button
                  onClick={async () => {
                    await loadRoster();
                    triggerFeedback("ซิงค์และรีเฟรชรายชื่อผู้เล่นในระบบสำเร็จ!");
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-black rounded-xl border border-slate-700 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ซิงค์รายชื่อผู้เล่นสด</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
