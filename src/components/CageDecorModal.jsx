import React, { useState } from "react";
import { X, Sparkles, Gift, Home, Check, Lock, ArrowRight, RotateCw } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../utils/audio";
import { FURNITURE_ITEMS, MYSTERY_BOXES } from "../constants/furnitureData";

export default function CageDecorModal({
  isOpen,
  onClose,
  coins,
  userLevel,
  furniture = {},
  onBuy,
  onEquip,
  onOpenBox,
}) {
  const [activeTab, setActiveTab] = useState("shop"); // "shop" | "gacha"
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [unboxResult, setUnboxResult] = useState(null);

  if (!isOpen) return null;

  const equipped = furniture.equipped || {};
  const inventory = furniture.inventory || ["default_grid"];

  // กรองเฟอร์นิเจอร์ตามหมวดหมู่
  const filteredItems = selectedCategory === "all"
    ? FURNITURE_ITEMS
    : FURNITURE_ITEMS.filter((item) => item.category === selectedCategory);

  const handleOpenGacha = (boxId) => {
    if (isOpeningBox) return;
    setIsOpeningBox(true);
    sound.playClick();

    // จำลองแอนิเมชันเปิดกล่องลุ้นของรางวัล 1.8 วินาที
    setTimeout(() => {
      const res = onOpenBox ? onOpenBox(boxId) : { success: false };
      setIsOpeningBox(false);

      if (res && res.success) {
        setUnboxResult(res);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }, 1800);
  };

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case "epic":
        return <span className="bg-purple-100 text-purple-700 border border-purple-300 text-[9px] font-black px-1.5 py-0.5 rounded-full">✨ EPIC</span>;
      case "rare":
        return <span className="bg-sky-100 text-sky-700 border border-sky-300 text-[9px] font-black px-1.5 py-0.5 rounded-full">⭐ RARE</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 border border-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">COMMON</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-800 flex flex-col max-h-[90vh]">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อและยอดเหรียญ */}
        <div className="flex items-center justify-between mb-3 pr-8">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🏡</span>
            <div>
              <h3 className="text-lg font-black text-amber-950 leading-tight">
                ตกแต่งกรง & กล่องสุ่ม
              </h3>
              <p className="text-[11px] text-amber-800">
                ติดตั้งเฟอร์นิเจอร์เพื่อรับบัฟพิเศษรอบกรง
              </p>
            </div>
          </div>
          <div className="bg-amber-200/90 border border-amber-400 px-3 py-1 rounded-xl flex items-center space-x-1 font-black text-amber-950 text-xs shadow-xs">
            <span>🌻</span>
            <span>{coins}</span>
          </div>
        </div>

        {/* 2 เมนูหลัก: ร้านค้า & ตู้สุ่มนำโชค */}
        <div className="flex bg-amber-200/60 p-1 rounded-2xl mb-3 border border-amber-300">
          <button
            onClick={() => {
              setActiveTab("shop");
              setUnboxResult(null);
            }}
            className={`flex-1 py-1.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === "shop"
                ? "bg-white text-amber-950 shadow-sm"
                : "text-amber-800 hover:text-amber-950"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>ร้านเฟอร์นิเจอร์ & ของในกรง</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("gacha");
              setUnboxResult(null);
            }}
            className={`flex-1 py-1.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === "gacha"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                : "text-amber-800 hover:text-amber-950"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>กล่องสุ่มนำโชค 🎁</span>
          </button>
        </div>

        {/* ============================================================
            TAB 1: ร้านค้าเฟอร์นิเจอร์ (FURNITURE SHOP & CLOSET)
        ============================================================ */}
        {activeTab === "shop" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* ตัวกรองหมวดหมู่ */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px] font-bold">
              {[
                { id: "all", label: "ทั้งหมด" },
                { id: "house", label: "🏡 บ้าน/เตียง" },
                { id: "toy", label: "🎠 ของเล่น" },
                { id: "wallpaper", label: "🖼️ ลายผนัง" },
                { id: "rug", label: "🧶 พรมพื้น" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-white/80 text-amber-900 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* รายการเฟอร์นิเจอร์ในกรง */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mt-1">
              {filteredItems.map((item) => {
                const isOwned = inventory.includes(item.id);
                const isEquipped = equipped[item.category] === item.id;
                const isLocked = !isOwned && userLevel < item.reqLevel;

                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isEquipped
                        ? "bg-amber-100/90 border-amber-400 shadow-xs"
                        : isOwned
                        ? "bg-white border-amber-200"
                        : isLocked
                        ? "bg-slate-100 border-slate-200 opacity-60"
                        : "bg-white/90 border-amber-200 hover:border-amber-300"
                    }`}
                  >
                    {/* ไอคอนและรายละเอียด */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-inner">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-black text-xs text-amber-950">
                            {item.name}
                          </span>
                          {getRarityBadge(item.rarity)}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          {item.desc}
                        </p>
                        {/* บัฟพิเศษ */}
                        <div className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block border border-emerald-200 mt-0.5">
                          {item.perkDesc}
                        </div>
                      </div>
                    </div>

                    {/* ปุ่มแอ็กชัน */}
                    <div className="flex items-center ml-2">
                      {isEquipped ? (
                        <button
                          onClick={() => onEquip(item.category, item.id)}
                          className="px-2.5 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center space-x-1 hover:bg-amber-600 active:scale-95"
                          title="กดเพื่อถอดออก"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>ใช้งานอยู่</span>
                        </button>
                      ) : isOwned ? (
                        <button
                          onClick={() => onEquip(item.category, item.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black shadow-xs hover:from-emerald-600 hover:to-teal-600 active:scale-95"
                        >
                          สวมใส่
                        </button>
                      ) : isLocked ? (
                        <div className="px-2.5 py-1 bg-slate-200 text-slate-500 rounded-xl text-[10px] font-bold flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Lv.{item.reqLevel}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onBuy(item.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-black shadow-xs hover:from-amber-600 hover:to-orange-600 active:scale-95 flex items-center space-x-1"
                        >
                          <span>🌻</span>
                          <span>{item.cost}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: กล่องสุ่มนำโชค (MYSTERY BOX GACHA)
        ============================================================ */}
        {activeTab === "gacha" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* ผลการเปิดกล่องสุ่ม */}
            {unboxResult ? (
              <div className="bg-white rounded-3xl p-5 border-4 border-amber-300 text-center shadow-lg my-auto animate-cute-bounce">
                <div className="text-5xl my-2">
                  {unboxResult.item.icon}
                </div>
                <div className="mb-2">
                  {getRarityBadge(unboxResult.item.rarity)}
                </div>
                <h4 className="font-black text-lg text-amber-950">
                  {unboxResult.item.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  {unboxResult.item.desc}
                </p>
                <div className="my-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black py-1.5 px-3 rounded-xl inline-block">
                  บัฟ: {unboxResult.item.perkDesc}
                </div>

                {unboxResult.isDuplicate && (
                  <p className="text-[11px] text-amber-800 font-bold bg-amber-100 p-2 rounded-xl mb-3 border border-amber-200">
                    🔄 คุณมีไอเทมชิ้นนี้แล้ว! ได้รับเงินชดเชย +{unboxResult.refund} 🌻
                  </p>
                )}

                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => {
                      if (!unboxResult.isDuplicate) {
                        onEquip(unboxResult.item.category, unboxResult.item.id);
                      }
                      setUnboxResult(null);
                    }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black text-xs shadow-md hover:from-emerald-600 hover:to-teal-600 active:scale-95"
                  >
                    {!unboxResult.isDuplicate ? "ติดตั้งในกรงทันที ✨" : "ตกลง"}
                  </button>
                  <button
                    onClick={() => setUnboxResult(null)}
                    className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-black text-xs hover:bg-slate-300 active:scale-95"
                  >
                    กลับ
                  </button>
                </div>
              </div>
            ) : isOpeningBox ? (
              /* หน้าแอนิเมชันเปิดกล่องกำลังลุ้น */
              <div className="flex flex-col items-center justify-center my-auto py-8">
                <div className="relative text-7xl animate-bounce">
                  🎁
                  <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 fill-yellow-300 animate-spin" />
                </div>
                <h4 className="font-black text-base text-amber-950 mt-4 animate-pulse">
                  กำลังเปิดกล่องสุ่มนำโชค... ลุ้นรางวัลใหญ่! 🌟
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  ขอให้ได้ชิ้นระดับ Epic สาธุ!
                </p>
              </div>
            ) : (
              /* รายการกล่องสุ่ม 2 แบบ */
              <div className="space-y-3 my-auto">
                {MYSTERY_BOXES.map((box) => (
                  <div
                    key={box.id}
                    className={`p-4 rounded-3xl border-2 bg-gradient-to-r ${box.color} flex items-center justify-between shadow-md transition-transform hover:scale-[1.02]`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl filter drop-shadow">
                        {box.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-amber-950">
                          {box.name}
                        </h4>
                        <p className="text-[10px] text-amber-900 line-clamp-1 mt-0.5">
                          {box.desc}
                        </p>
                        <span className="text-[9px] font-black text-amber-950/80 bg-white/60 px-2 py-0.5 rounded-full inline-block mt-1">
                          📊 {box.ratesText}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenGacha(box.id)}
                      disabled={coins < box.cost}
                      className={`px-3.5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center space-x-1 ${
                        coins >= box.cost
                          ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 active:scale-95 cursor-pointer"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <span>🌻</span>
                      <span>{box.cost}</span>
                    </button>
                  </div>
                ))}

                <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 text-center text-xs text-amber-800">
                  <span className="font-black text-amber-950">💡 ทริค:</span> หากสุ่มได้เฟอร์นิเจอร์ชิ้นที่มีอยู่แล้วในกระเป๋า ระบบจะคืนเงินปลอบใจให้ <span className="font-black text-orange-600">40%</span> ของราคากล่องทันที!
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
