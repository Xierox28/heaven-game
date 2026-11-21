import React, { useState } from "react";
import { X, Sparkles, Check, ShoppingBag, Shirt } from "lucide-react";
import { WARDROBE_ITEMS } from "../constants/gameData";

export default function WardrobeModal({
  isOpen,
  onClose,
  coins,
  inventory = [],
  equipped = {},
  onBuyItem,
  onToggleEquip,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'hat' | 'accessory' | 'outfit'

  if (!isOpen) return null;

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
          <p className="text-xs text-purple-700">แต่งตัวให้น้องเฮเว่นน่ารักที่สุดในสามโลก</p>

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

        {/* รายการสินค้าในตู้ */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isOwned = inventory.includes(item.id);
            const isEquipped = equipped[item.type] === item.id;
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
      </div>
    </div>
  );
}
