import React, { useState, useEffect } from "react";
import { X, Sprout, Droplets, Sparkles, ChefHat, Clock, Plus, Flame, Check } from "lucide-react";
import { GARDEN_CROPS, COOKING_RECIPES } from "../constants/gameData";
import { sound } from "../utils/audio";

export default function HamsterGardenModal({ state, isOpen, onClose, onPlant, onWater, onHarvest, onCook, onInstantHarvest }) {
  const [activeTab, setActiveTab] = useState("garden"); // 'garden' | 'kitchen'
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const plots = state?.gardenPlots || [
    { id: 0, cropId: null, plantedAt: 0, watered: false },
    { id: 1, cropId: null, plantedAt: 0, watered: false },
    { id: 2, cropId: null, plantedAt: 0, watered: false },
    { id: 3, cropId: null, plantedAt: 0, watered: false },
  ];
  const pantry = state?.pantry || { basil_leaf: 0, chili_pepper: 0, fresh_strawberry: 0 };
  const coins = state?.coins || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 to-orange-50/70 border-4 border-amber-300 rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <div>
              <h2 className="text-lg font-black text-amber-950">สวนผัก & ห้องครัวแฮมสเตอร์</h2>
              <p className="text-[11px] font-bold text-amber-800">ปลูกผักออร์แกนิก ปรุงข้าวกะเพราไข่ดาวแสนอร่อย</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 mt-3 bg-amber-200/60 rounded-2xl">
          <button
            onClick={() => { sound.playClick(); setActiveTab("garden"); }}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "garden" ? "bg-white text-emerald-800 shadow-md scale-[1.02]" : "text-amber-900 hover:bg-white/40"
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>สวนผักหลังบ้าน (4 แปลง)</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab("kitchen"); }}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "kitchen" ? "bg-white text-orange-800 shadow-md scale-[1.02]" : "text-amber-900 hover:bg-white/40"
            }`}
          >
            <ChefHat className="w-4 h-4 text-orange-600" />
            <span>ห้องครัวปรุงอาหาร</span>
          </button>
        </div>

        {/* Pantry Quick Ribbon */}
        <div className="flex flex-wrap items-center justify-around gap-2 py-2 px-3 my-2 bg-white/90 rounded-2xl border border-amber-200 shadow-xs text-xs font-black text-amber-950">
          <div className="flex items-center space-x-1">
            <span className="text-base">🌿</span>
            <span>กะเพรา: <span className="text-emerald-700">{pantry.basil_leaf || 0}</span></span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-base">🌶️</span>
            <span>พริก: <span className="text-red-700">{pantry.chili_pepper || 0}</span></span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-base">🍓</span>
            <span>เบอร์รี: <span className="text-pink-700">{pantry.fresh_strawberry || 0}</span></span>
          </div>
          <div className="flex items-center space-x-1 bg-cyan-100 border border-cyan-300 px-2 py-0.5 rounded-full text-cyan-900">
            <span>💎</span>
            <span>{state?.diamonds || 0} เม็ด</span>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: GARDEN PLOTS
        ========================================================================= */}
        {activeTab === "garden" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="grid grid-cols-2 gap-3">
              {plots.map((plot) => {
                const crop = plot.cropId ? GARDEN_CROPS.find((c) => c.id === plot.cropId) : null;
                const elapsedSec = plot.plantedAt ? (now - plot.plantedAt) / 1000 : 0;
                const isWatered = plot.watered;
                // รดน้ำช่วยลดเวลาลง 25%
                const effectiveGrowTime = crop ? (isWatered ? crop.growTime * 0.75 : crop.growTime) : 0;
                const progress = crop ? Math.min(100, (elapsedSec / effectiveGrowTime) * 100) : 0;
                const isReady = crop && progress >= 100;
                const remainingSec = crop ? Math.max(0, Math.ceil(effectiveGrowTime - elapsedSec)) : 0;

                return (
                  <div
                    key={plot.id}
                    className="relative bg-white/95 rounded-2xl border-2 border-amber-200 p-3 shadow-sm flex flex-col items-center justify-between min-h-[160px]"
                  >
                    <div className="w-full flex items-center justify-between text-[11px] font-black text-amber-800">
                      <span>แปลงที่ #{plot.id + 1}</span>
                      {crop && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isReady ? "bg-emerald-100 text-emerald-800 animate-pulse" : "bg-amber-100 text-amber-900"
                        }`}>
                          {isReady ? "พร้อมเก็บเกี่ยว!" : `${remainingSec}s`}
                        </span>
                      )}
                    </div>

                    {/* Plot Visual */}
                    <div className="relative my-2 w-20 h-20 flex items-center justify-center">
                      <img
                        src="/assets/garden/soil_empty.png"
                        alt="Soil"
                        className="absolute inset-0 w-full h-full object-contain pixel-art drop-shadow-xs"
                      />
                      {!crop ? (
                        <span className="relative z-10 text-2xl text-amber-600/60 font-black">+</span>
                      ) : isReady ? (
                        <img
                          src={crop.image}
                          alt={crop.name}
                          className="relative z-10 w-16 h-16 object-contain pixel-art animate-bounce drop-shadow-md"
                        />
                      ) : (
                        <img
                          src="/assets/garden/soil_sprout.png"
                          alt="Sprout"
                          className="relative z-10 w-14 h-14 object-contain pixel-art drop-shadow-xs animate-wiggle"
                        />
                      )}

                      {/* Water Drop Badge */}
                      {crop && isWatered && (
                        <div className="absolute top-0 right-0 z-20 bg-sky-100 border border-sky-300 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-xs">
                          💧
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {crop && (
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 mb-2">
                        <div
                          className={`h-full transition-all duration-500 ${isReady ? "bg-emerald-500" : "bg-amber-400"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {/* Plot Action Buttons */}
                    {!crop ? (
                      <button
                        onClick={() => setSelectedPlot(plot.id)}
                        className="w-full py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>เลือกปลูกพืช</span>
                      </button>
                    ) : isReady ? (
                      <button
                        onClick={() => { sound.playLevelUp(); onHarvest(plot.id); }}
                        className="w-full py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1 animate-bounce"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>เก็บเกี่ยว!</span>
                      </button>
                    ) : (
                      <div className="w-full space-y-1">
                        <button
                          disabled={isWatered}
                          onClick={() => { sound.playClean(); onWater(plot.id); }}
                          className={`w-full py-1 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1 ${
                            isWatered
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-sky-400 hover:bg-sky-500 text-white active:scale-95 shadow-sm"
                          }`}
                        >
                          <Droplets className="w-3.5 h-3.5" />
                          <span>{isWatered ? "รดน้ำแล้ว 💧" : "รดน้ำเร่งโต"}</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onInstantHarvest) onInstantHarvest(plot.id);
                          }}
                          className="w-full py-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-black text-[10px] rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
                          title="ใช้ 5 เพชรเพื่อเร่งโตทันที"
                        >
                          <span>⚡ เร่งโต (5 💎)</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Seed Selection Tray (When user clicks a plot to plant) */}
            {selectedPlot !== null && (
              <div className="bg-white rounded-2xl border-2 border-emerald-300 p-3 shadow-lg animate-slide-in-up">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-950">เลือกพืชที่จะปลูกในแปลง #{selectedPlot + 1}:</span>
                  <button onClick={() => setSelectedPlot(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                    ยกเลิก
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {GARDEN_CROPS.map((crop) => (
                    <button
                      key={crop.id}
                      disabled={coins < crop.seedCost}
                      onClick={() => {
                        onPlant(selectedPlot, crop.id);
                        setSelectedPlot(null);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        coins >= crop.seedCost
                          ? "bg-emerald-50/70 hover:bg-emerald-100 border-emerald-300 active:scale-95"
                          : "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <img src={crop.image} alt={crop.name} className="w-9 h-9 object-contain pixel-art flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-black text-slate-900 truncate">{crop.name}</div>
                        <div className="text-[10px] font-extrabold text-amber-700 flex items-center space-x-1">
                          <span>🌻 {crop.seedCost}</span>
                          <span className="text-slate-400">•</span>
                          <span>⏳ {crop.growTime}s</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: COOKING KITCHEN
        ========================================================================= */}
        {activeTab === "kitchen" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="bg-orange-100/70 border border-orange-300 rounded-2xl p-3 text-xs font-extrabold text-orange-950 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-600 flex-shrink-0 animate-pulse" />
              <span>นำผลผลิตจากสวนผักมาปรุงเมนูพิเศษให้น้องเฮเว่นกินฟรี พร้อมรับบัฟสุดโหด!</span>
            </div>

            {COOKING_RECIPES.map((rec) => {
              const canCook = Object.entries(rec.reqIngredients).every(
                ([item, count]) => (pantry[item] || 0) >= count
              );

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl border-2 border-orange-200 p-3 shadow-sm flex items-center space-x-3"
                >
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-16 h-16 object-contain pixel-art bg-orange-50 rounded-xl p-1 border border-orange-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">{rec.name}</h3>
                    <p className="text-[10px] text-slate-600 font-bold leading-tight my-1">{rec.desc}</p>
                    {/* Ingredients needed */}
                    <div className="flex items-center space-x-2 text-[10px] font-black">
                      {Object.entries(rec.reqIngredients).map(([item, count]) => {
                        const hasEnough = (pantry[item] || 0) >= count;
                        const label = item === "basil_leaf" ? "🌿 ใบกะเพรา" : item === "chili_pepper" ? "🌶️ พริก" : "🍓 สตรอว์เบอร์รี";
                        return (
                          <span
                            key={item}
                            className={`px-1.5 py-0.5 rounded-md ${
                              hasEnough ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {label}: {pantry[item] || 0}/{count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    disabled={!canCook}
                    onClick={() => { sound.playLevelUp(); onCook(rec); }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center space-x-1 shadow-sm transition-all flex-shrink-0 ${
                      canCook
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white active:scale-95 shadow-md animate-pulse"
                        : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>{canCook ? "ปรุงทันที!" : "ขาดวัตถุดิบ"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
