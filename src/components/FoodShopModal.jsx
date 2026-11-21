import React from "react";
import { X, Utensils, Award } from "lucide-react";
import { FOOD_ITEMS } from "../constants/gameData";

export default function FoodShopModal({ isOpen, onClose, coins, userLevel, onSelectFood }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 to-orange-50 border-4 border-amber-300 rounded-3xl p-5 shadow-2xl text-slate-800">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อร้าน */}
        <div className="text-center mb-4">
          <span className="text-3xl">🍓</span>
          <h3 className="text-lg font-black text-amber-900 mt-1">ร้านค้าอาหารพรีเมียม</h3>
          <p className="text-xs text-amber-700">เลือกซื้อของอร่อยที่มีประโยชน์ให้น้องเฮเว่น</p>

          {/* จำนวนเหรียญคงเหลือ */}
          <div className="inline-flex items-center space-x-1 bg-amber-200/80 px-3 py-1 rounded-full text-xs font-black text-amber-900 mt-2 border border-amber-300">
            <span>🌻 กระเป๋า:</span>
            <span>{coins} เมล็ดทานตะวัน</span>
          </div>
        </div>

        {/* รายการอาหาร */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {FOOD_ITEMS.map((food) => {
            const isUnlocked = userLevel >= food.reqLevel;
            const canAfford = coins >= food.cost;

            return (
              <div
                key={food.id}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  isUnlocked
                    ? "bg-white/90 border-amber-200 hover:border-amber-400 hover:shadow-xs"
                    : "bg-slate-100 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl bg-amber-100 rounded-2xl w-12 h-12 flex items-center justify-center shadow-xs">
                    {food.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-amber-950 flex items-center">
                      {food.name}
                      {food.cost === 0 && (
                        <span className="ml-1.5 text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                          ฟรี
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{food.desc}</p>
                    <div className="flex items-center space-x-2 mt-1 text-[10px] font-bold">
                      <span className="text-amber-700">🥣 +{food.hunger}%</span>
                      <span className="text-rose-600">💖 +{food.happiness}%</span>
                      <span className="text-indigo-600">🌟 +{food.exp} EXP</span>
                    </div>
                  </div>
                </div>

                <div className="ml-2 flex-shrink-0">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          onSelectFood(food);
                          onClose();
                        }
                      }}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                        canAfford
                          ? "bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-sm"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {food.cost > 0 ? (
                        <span className="flex items-center space-x-1">
                          <span>{food.cost}</span>
                          <span>🌻</span>
                        </span>
                      ) : (
                        "เลือก"
                      )}
                    </button>
                  ) : (
                    <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-1 rounded-lg">
                      Lv. {food.reqLevel}
                    </span>
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
