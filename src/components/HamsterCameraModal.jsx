import React, { useState, useRef } from "react";
import { X, Camera, Download, Share2, Sparkles, Heart, Check, Palette } from "lucide-react";
import { sound, haptic } from "../utils/audio";
import { MANSION_THEMES, WARDROBE_ITEMS, BUDDY_PETS } from "../constants/gameData";

const POLAROID_FRAMES = [
  { id: "classic", name: "คลาสสิก", borderClass: "bg-amber-50 border-amber-200/80 text-amber-950", accent: "bg-amber-400" },
  { id: "pastel_pink", name: "พาสเทลสตอเบอรี่", borderClass: "bg-pink-50 border-pink-200 text-rose-950", accent: "bg-pink-400" },
  { id: "wood_cottage", name: "ไม้คอทเทจ", borderClass: "bg-amber-100/90 border-amber-300 text-amber-950", accent: "bg-amber-600" },
  { id: "cyber_aurora", name: "นีออนออโรร่า", borderClass: "bg-slate-900 border-cyan-400/60 text-cyan-200", accent: "bg-cyan-400" },
];

const PHOTO_STICKERS = [
  { id: "star", text: "⭐ Super Star", icon: "⭐" },
  { id: "love", text: "💖 So Cute!", icon: "💖" },
  { id: "sunflower", text: "🌻 Nom Nom", icon: "🌻" },
  { id: "angel", text: "🪽 Angelic", icon: "🪽" },
  { id: "king", text: "👑 Sultan Hamster", icon: "👑" },
];

export default function HamsterCameraModal({ isOpen, onClose, gameState, isDarkMode }) {
  const [selectedFrame, setSelectedFrame] = useState("classic");
  const [selectedSticker, setSelectedSticker] = useState("star");
  const [customCaption, setCustomCaption] = useState(
    () => `${gameState?.name || "น้องเฮเว่น"} • Lv.${gameState?.level || 1} • ${gameState?.playerTitle || "เด็กเส้นแอดมินดิว 💎"}`
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen) return null;

  const frameDef = POLAROID_FRAMES.find((f) => f.id === selectedFrame) || POLAROID_FRAMES[0];
  const stickerDef = PHOTO_STICKERS.find((s) => s.id === selectedSticker);
  const mansionDef = MANSION_THEMES?.find((t) => t.id === gameState?.mansionTheme) || MANSION_THEMES[0];
  const buddyDef = BUDDY_PETS?.find((b) => b.id === gameState?.equippedBuddy);

  // สกัดรายการไอเทมที่สวมใส่
  const rawEquipped = Array.isArray(gameState?.equipped)
    ? gameState.equipped
    : Object.values(gameState?.equipped || {}).filter(Boolean);
  const wingsList = rawEquipped.filter((id) => WARDROBE_ITEMS.find((w) => w.id === id)?.type === "wings");
  const frontList = rawEquipped.filter((id) => WARDROBE_ITEMS.find((w) => w.id === id)?.type !== "wings");

  const todayStr = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleDownload = async () => {
    sound.playClick();
    haptic.burst();
    setIsCapturing(true);

    try {
      // ใช้ Canvas สร้างรูปภาพโพลารอยด์ความละเอียดสูง 800x1000 px
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");

      // 1. วาดกรอบรูปโพลารอยด์
      ctx.fillStyle = selectedFrame === "cyber_aurora" ? "#0f172a" : selectedFrame === "pastel_pink" ? "#fff1f2" : selectedFrame === "wood_cottage" ? "#fef3c7" : "#fffbeb";
      ctx.fillRect(0, 0, 800, 1000);

      // ขอบเส้นนอก
      ctx.strokeStyle = selectedFrame === "cyber_aurora" ? "#06b6d4" : "#fcd34d";
      ctx.lineWidth = 12;
      ctx.strokeRect(20, 20, 760, 960);

      // 2. พื้นหลังช่องใส่รูปภาพ (Photo Window)
      const isNightTheme = selectedFrame === "cyber_aurora" || isDarkMode;
      ctx.fillStyle = isNightTheme ? "#1e1b4b" : "#fef9c3";
      ctx.fillRect(50, 50, 700, 700);

      // วาดตารางกรง
      ctx.strokeStyle = isNightTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
      ctx.lineWidth = 2;
      for (let x = 50; x <= 750; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, 750);
        ctx.stroke();
      }
      for (let y = 50; y <= 750; y += 40) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(750, y);
        ctx.stroke();
      }

      // 3. วาดตัวน้องแฮมสเตอร์
      const breedId = gameState?.breed || "winter_white";
      const hamsterImg = new Image();
      hamsterImg.crossOrigin = "anonymous";
      hamsterImg.src = `/assets/breeds/${breedId}.png`;

      await new Promise((resolve) => {
        hamsterImg.onload = resolve;
        hamsterImg.onerror = resolve;
      });

      // วาดเงาใต้น้อง
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.ellipse(400, 580, 200, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // วาดตัวน้องตรงกลาง
      ctx.drawImage(hamsterImg, 150, 300, 500, 281);

      // 4. วาดป้ายสติกเกอร์ (Sticker)
      if (stickerDef) {
        ctx.save();
        ctx.translate(620, 130);
        ctx.rotate(0.12);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(-90, -25, 180, 50);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(stickerDef.text, 0, 0);
        ctx.restore();
      }

      // 5. เขียนข้อความใต้รูป (Handwritten Polaroid Caption)
      ctx.fillStyle = selectedFrame === "cyber_aurora" ? "#38bdf8" : "#451a03";
      ctx.font = "bold 32px 'Itim', cursive, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(customCaption, 400, 830);

      // วันที่และลายน้ำ
      ctx.fillStyle = selectedFrame === "cyber_aurora" ? "#94a3b8" : "#92400e";
      ctx.font = "bold 20px 'Itim', cursive, sans-serif";
      ctx.fillText(`🗓️ ${todayStr} • สวรรค์ของน้องแฮมสเตอร์ 🐹✨`, 400, 880);

      // แปลง Canvas เป็นไฟล์ดาวน์โหลด
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `hamster-polaroid-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.warn("Capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async () => {
    sound.playClick();
    haptic.tap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `น้องแฮมสเตอร์ของฉัน: ${gameState?.name}`,
          text: `มาดูความน่ารักของน้องแฮมสเตอร์ ${gameState?.name} (Lv. ${gameState?.level}) ใน Heaven Game กัน! 🐹✨`,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950 border-4 border-amber-300 dark:border-amber-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-800 dark:text-slate-100 animate-slide-in-down flex flex-col max-h-[90vh] overflow-y-auto">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 dark:bg-slate-800 hover:bg-amber-300 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold text-sm transition-transform active:scale-90 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center space-x-1.5 bg-amber-200/80 dark:bg-slate-800 text-amber-950 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-xs mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>สตูดิโอภาพถ่ายโพลารอยด์น้องแฮมสเตอร์ 📸</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-300">
            เก็บภาพความทรงจำสุดน่ารัก
          </h3>
        </div>

        {/* ========================================================
            POLAROID PREVIEW CARD
            ======================================================== */}
        <div
          ref={cardRef}
          className={`w-full max-w-[320px] mx-auto rounded-2xl border-4 p-3 shadow-xl transition-all duration-300 ${frameDef.borderClass}`}
        >
          {/* ช่องภาพ (Photo Screen) */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-black/10 shadow-inner flex items-center justify-center bg-gradient-to-b from-amber-100/60 to-orange-100/80 dark:from-indigo-950 dark:to-slate-900">
            {/* กริิดพื้นหลัง */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

            {/* สติกเกอร์ที่เลือก */}
            {stickerDef && (
              <div className="absolute top-2 right-2 z-20 bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md rotate-6 animate-pulse">
                {stickerDef.text}
              </div>
            )}

            {/* ปีกข้างหลัง */}
            {wingsList.map((itemId) => (
              <img
                key={itemId}
                src={`/assets/wardrobe/${itemId}.png`}
                alt="Wings"
                className="absolute z-0 w-36 sm:w-44 object-contain pixel-art drop-shadow-md"
              />
            ))}

            {/* ตัวน้องแฮมสเตอร์ */}
            <img
              src={`/assets/breeds/${gameState?.breed || "winter_white"}.png`}
              alt="Hamster"
              className="relative z-10 w-44 sm:w-52 object-contain pixel-art drop-shadow-md animate-cute-breathe"
            />

            {/* เสื้อผ้า/หมวก ด้านหน้า */}
            {frontList.map((itemId) => (
              <img
                key={itemId}
                src={`/assets/wardrobe/${itemId}.png`}
                alt="Accessory"
                className="absolute z-20 w-44 sm:w-52 object-contain pixel-art pointer-events-none"
              />
            ))}

            {/* เพื่อนคู่หู */}
            {buddyDef && (
              <div className="absolute bottom-3 right-4 z-20 flex flex-col items-center animate-bounce-slow">
                <img src={buddyDef.icon} alt={buddyDef.name} className="w-8 h-8 object-contain pixel-art drop-shadow" />
              </div>
            )}
          </div>

          {/* คำบรรยายใต้รูปโพลารอยด์ */}
          <div className="pt-3 pb-1 text-center">
            <input
              type="text"
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              className="w-full text-center bg-transparent border-b border-amber-300/50 dark:border-slate-700 font-black text-xs sm:text-sm text-amber-950 dark:text-amber-200 focus:outline-hidden focus:border-amber-500 px-1 py-0.5"
              placeholder="พิมพ์ข้อความในรูปภาพ..."
              maxLength={45}
            />
            <div className="text-[10px] text-amber-700 dark:text-slate-400 font-bold mt-1">
              🗓️ {todayStr} • Heaven Game 🐹✨
            </div>
          </div>
        </div>

        {/* ========================================================
            FRAME & STICKER SELECTORS
            ======================================================== */}
        <div className="mt-3 space-y-2">
          {/* เลือกกรอบรูป */}
          <div>
            <div className="text-[11px] font-black text-amber-900 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <Palette className="w-3 h-3 text-amber-600" />
              <span>เลือกสไตล์กรอบรูป:</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {POLAROID_FRAMES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    haptic.tap();
                    setSelectedFrame(f.id);
                  }}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex flex-col items-center space-y-0.5 ${
                    selectedFrame === f.id
                      ? "border-amber-500 bg-amber-500 text-white shadow-xs scale-102"
                      : "border-amber-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${f.accent} border border-white`} />
                  <span className="truncate w-full text-center">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* เลือกสติกเกอร์ */}
          <div>
            <div className="text-[11px] font-black text-amber-900 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>เลือกสติกเกอร์ประดับ:</span>
            </div>
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PHOTO_STICKERS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    haptic.tap();
                    setSelectedSticker(s.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all whitespace-nowrap cursor-pointer ${
                    selectedSticker === s.id
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-amber-200 dark:border-slate-700"
                  }`}
                >
                  {s.icon} {s.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ข้อความดาวน์โหลดสำเร็จ */}
        {downloadSuccess && (
          <div className="mt-2 bg-emerald-100 border border-emerald-300 text-emerald-800 p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>บันทึกภาพถ่ายโพลารอยด์ลงเครื่องเรียบร้อยแล้ว! 🖼️</span>
          </div>
        )}

        {/* ปุ่มคำสั่ง Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 dark:border-slate-800">
          <button
            type="button"
            disabled={isCapturing}
            onClick={handleDownload}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isCapturing ? "กำลังสร้างภาพ..." : "บันทึกภาพ PNG 💾"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์ให้เพื่อนๆ 📲</span>
          </button>
        </div>
      </div>
    </div>
  );
}
