import React, { useState } from "react";
import { X, Sparkles, Check, ShoppingBag, Shirt, Heart, Smile } from "lucide-react";
import { WARDROBE_ITEMS, HAMSTER_BREEDS, PERSONALITIES } from "../constants/gameData";

export default function WardrobeModal({
  isOpen,
  onClose,
  coins,
  userLevel = 1,
  inventory = [],
  equipped = {},
  wardrobeOffsets = {},
  currentBreed = "winter_white",
  unlockedBreeds = ["winter_white"],
  currentPersonality = "affectionate",
  onBuyItem,
  onToggleEquip,
  onAdjustOffset,
  onResetOffset,
  onSelectBreed,
  onBuyBreed,
  onSelectPersonality,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'hat' | 'accessory' | 'outfit' | 'breed'
  const [adjustingItemId, setAdjustingItemId] = useState(null);

  if (!isOpen) return null;

  const rawEquippedList = Array.isArray(equipped)
    ? equipped
    : Object.values(equipped || {}).filter(Boolean);

  const filteredItems = activeTab === "all"
    ? WARDROBE_ITEMS
    : WARDROBE_ITEMS.filter((i) => i.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 border-4 border-purple-300 rounded-3xl p-5 shadow-2xl text-slate-800">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-200 hover:bg-purple-300 text-purple-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="text-center mb-3">
          <span className="text-3xl">👗</span>
          <h3 className="text-lg font-black text-purple-900 mt-1">ร้านค้าแฟชั่น & ตู้เสื้อผ้า</h3>
          <p className="text-xs text-purple-700">แต่งตัวให้น้องเฮเว่น (สวมใส่ได้หลายชิ้นพร้อมกันตามใจชอบ)</p>

          {/* จำนวนเหรียญคงเหลือ */}
          <div className="inline-flex items-center space-x-1 bg-amber-200/90 px-3 py-1 rounded-full text-xs font-black text-amber-900 mt-2 border border-amber-300">
            <span>🌻 มีอยู่:</span>
            <span>{coins} เมล็ดทานตะวัน</span>
          </div>
        </div>

        {/* Tabs แยกประเภท */}
        <div className="flex bg-white/70 p-1 rounded-2xl border border-purple-200 mb-3 text-xs font-bold text-slate-600">
          {[
            { id: "all", label: "ทั้งหมด" },
            { id: "hat", label: "หมวก/แว่น 🐸" },
            { id: "accessory", label: "โบว์/คอ 🎀" },
            { id: "outfit", label: "ชุดฮู้ดดี้ 🧥" },
            { id: "breed", label: "สายพันธุ์ & นิสัย 🐹" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-purple-500 text-white shadow-xs font-black"
                  : "hover:bg-purple-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 🎯 แถบปรับขยับตำแหน่งและขนาดของชิ้นที่สวมใส่อยู่ (Interactive Costume Adjuster) */}
        {rawEquippedList.length > 0 && (
          <div className="mb-3 bg-purple-100/90 border border-purple-300 rounded-2xl p-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" /> ปรับขยับตำแหน่งชิ้นที่ใส่ ({rawEquippedList.length})
              </span>
              <button
                onClick={() => setAdjustingItemId(adjustingItemId ? null : rawEquippedList[0])}
                className="text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-0.5 rounded-lg active:scale-95 shadow-2xs"
              >
                {adjustingItemId ? "ปิดแถบปรับ ✕" : "🎯 ปรับตำแหน่ง & ขนาด"}
              </button>
            </div>

            {adjustingItemId && (
              <div className="mt-2 pt-2 border-t border-purple-200/80 space-y-2">
                {/* เลือกชิ้นที่จะปรับ */}
                <div className="flex flex-wrap gap-1">
                  {rawEquippedList.map((id) => {
                    const def = WARDROBE_ITEMS.find((w) => w.id === id);
                    return (
                      <button
                        key={id}
                        onClick={() => setAdjustingItemId(id)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-black transition-all ${
                          adjustingItemId === id
                            ? "bg-purple-700 text-white shadow-xs"
                            : "bg-white/90 text-purple-800 border border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        {def?.icon} {def?.name || id}
                      </button>
                    );
                  })}
                </div>

                {/* ปุ่มควบคุมทิศทางและสเกล */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 bg-white/85 p-2 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-bold text-slate-600 mr-0.5">เลื่อน:</span>
                    <button
                      onClick={() => onAdjustOffset && onAdjustOffset(adjustingItemId, -2, 0, 0)}
                      className="w-7 h-7 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs font-black text-purple-900 flex items-center justify-center active:scale-90"
                      title="เลื่อนซ้าย"
                    >
                      ⬅️
                    </button>
                    <button
                      onClick={() => onAdjustOffset && onAdjustOffset(adjustingItemId, 2, 0, 0)}
                      className="w-7 h-7 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs font-black text-purple-900 flex items-center justify-center active:scale-90"
                      title="เลื่อนขวา"
                    >
                      ➡️
                    </button>
                    <button
                      onClick={() => onAdjustOffset && onAdjustOffset(adjustingItemId, 0, -2, 0)}
                      className="w-7 h-7 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs font-black text-purple-900 flex items-center justify-center active:scale-90"
                      title="เลื่อนขึ้น"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => onAdjustOffset && onAdjustOffset(adjustingItemId, 0, 2, 0)}
                      className="w-7 h-7 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs font-black text-purple-900 flex items-center justify-center active:scale-90"
                      title="เลื่อนลง"
                    >
                      ⬇️
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-bold text-slate-600 mr-0.5">ขนาด:</span>
                    <button
                      onClick={() => onAdjustOffset && onAdjustOffset(adjustingItemId, 0, 0, -0.1)}
                      className="w-7 h-7 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs font-black text-purple-900 flex items-center justify-center active:scale-90"
                      title="ย่อขนาด"
                    >
                      ➖
                    </button>
                    <span className="text-[11px] font-black text-purple-900 min-w-8 text-center">
                      {Math.round(((wardrobeOffsets?.[adjustingItemId]?.scale) || 1.0) * 100)}%
                    </span>
                    <button
                      onClick={() => onAdjustOffset && onAdjustOffset(adjustingItemId, 0, 0, 0.1)}
                      className="w-7 h-7 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs font-black text-purple-900 flex items-center justify-center active:scale-90"
                      title="ขยายขนาด"
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => onResetOffset && onResetOffset(adjustingItemId)}
                      className="ml-1 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg font-bold active:scale-90"
                      title="คืนค่าตำแหน่งเดิม"
                    >
                      🔄 คืนค่า
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* รายการสินค้าในตู้ / สายพันธุ์ & นิสัย */}
        {activeTab === "breed" ? (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* ส่วนที่ 1: เลือกสายพันธุ์แฮมสเตอร์ */}
            <div>
              <h4 className="text-xs font-black text-purple-900 mb-2 flex items-center">
                <span>🐹 เลือกสายพันธุ์ & สีขน (Cosmetic สวยงาม)</span>
              </h4>
              <div className="space-y-2">
                {HAMSTER_BREEDS.map((b) => {
                  const isOwned = unlockedBreeds.includes(b.id);
                  const isCurrent = currentBreed === b.id;
                  const canAfford = coins >= b.cost;
                  const meetsLevel = userLevel >= b.reqLevel;

                  return (
                    <div
                      key={b.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                        isCurrent
                          ? "bg-purple-100/95 border-purple-500 shadow-sm"
                          : isOwned
                          ? "bg-white/95 border-slate-200"
                          : "bg-amber-50/85 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-xs border border-purple-100 overflow-hidden p-1 flex-shrink-0">
                          <img
                            src={b.thumb}
                            alt={b.name}
                            className="w-full h-full object-contain pixel-art drop-shadow-xs"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h5 className="font-black text-sm text-slate-900">{b.name}</h5>
                            <span className="text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded-full font-bold">
                              {b.tag}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center">
                                <Check className="w-2.5 h-2.5 mr-0.5" /> ใช้อยู่
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{b.desc}</p>
                          {!isOwned && b.reqLevel > 1 && (
                            <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
                              🔒 ปลดล็อคที่เลเวล {b.reqLevel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-2 flex-shrink-0">
                        {isOwned ? (
                          <button
                            onClick={() => onSelectBreed && onSelectBreed(b.id)}
                            disabled={isCurrent}
                            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                              isCurrent
                                ? "bg-slate-200 text-slate-400 cursor-default"
                                : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                            }`}
                          >
                            {isCurrent ? "ใช้อยู่" : "เลือกใช้"}
                          </button>
                        ) : (
                          <button
                            onClick={() => onBuyBreed && onBuyBreed(b.id)}
                            disabled={!canAfford || !meetsLevel}
                            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center space-x-1 ${
                              canAfford && meetsLevel
                                ? "bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-sm"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <span>{b.cost}</span>
                            <span>🌻 ปลดล็อค</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ส่วนที่ 2: เลือกนิสัยประจำตัว */}
            <div className="pt-2 border-t border-purple-200">
              <h4 className="text-xs font-black text-purple-900 mb-2 flex items-center">
                <span>🎭 เลือกนิสัยประจำตัว (Personalities)</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {PERSONALITIES.map((p) => {
                  const isCurrent = currentPersonality === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectPersonality && onSelectPersonality(p.id)}
                      className={`p-2.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between ${
                        isCurrent
                          ? "bg-purple-100/90 border-purple-500 shadow-sm"
                          : "bg-white/90 border-purple-100 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xl">{p.icon}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                            ✓ ใช้อยู่
                          </span>
                        )}
                      </div>
                      <h6 className="font-black text-xs text-slate-900">{p.name}</h6>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{p.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isOwned = inventory.includes(item.id);
              const isEquipped = Array.isArray(equipped)
                ? equipped.includes(item.id)
                : (equipped?.[item.type] === item.id || Object.values(equipped || {}).includes(item.id));
              const canAfford = coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                    isEquipped
                      ? "bg-purple-100/90 border-purple-400 shadow-sm"
                      : isOwned
                      ? "bg-white/90 border-slate-200"
                      : "bg-amber-50/80 border-amber-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-xs border border-purple-100 overflow-hidden p-1.5 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain pixel-art drop-shadow-xs"
                        />
                      ) : (
                        <span className="text-3xl">{item.icon}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 flex items-center">
                        {item.name}
                        {isEquipped && (
                          <span className="ml-1.5 text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center">
                            <Check className="w-2.5 h-2.5 mr-0.5" /> ใส่อยู่
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <div className="ml-2 flex-shrink-0">
                    {isOwned ? (
                      <button
                        onClick={() => onToggleEquip(item.type, item.id)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                          isEquipped
                            ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                        }`}
                      >
                        {isEquipped ? "ถอดออก" : "สวมใส่"}
                      </button>
                    ) : (
                      <button
                        onClick={() => onBuyItem(item.id)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center space-x-1 ${
                          canAfford
                            ? "bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-sm"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <span>{item.cost}</span>
                        <span>🌻 ซื้อ</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
