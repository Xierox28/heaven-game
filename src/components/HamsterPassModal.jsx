import React, { useState } from "react";
import { X, Sparkles, Trophy, Calendar, Check, Lock, Star, ChevronRight, Award } from "lucide-react";
import { PASS_LEVELS, DAILY_QUEST_DEFS, DAILY_STREAK_REWARDS } from "../constants/passData";
import { sound } from "../utils/audio";

export default function HamsterPassModal({
  isOpen,
  onClose,
  gameState,
  onClaimFreePass,
  onClaimGoldPass,
  onUnlockGoldPass,
  onClaimQuest,
  onClaimDailyStreak,
}) {
  const [activeTab, setActiveTab] = useState("pass"); // 'pass' | 'quests' | 'streak'

  if (!isOpen) return null;

  const pass = gameState.pass || {
    exp: 0,
    hasGoldPass: false,
    claimedFree: [],
    claimedGold: [],
    dailyProgress: {},
    claimedQuests: [],
  };

  const streak = gameState.streak || {
    days: 0,
    lastClaimDate: null,
    claimedDays: [],
  };

  const todayStr = new Date().toDateString();
  const canClaimStreakToday = streak.lastClaimDate !== todayStr;

  // Calculate current Pass Level based on pass.exp
  let currentPassLevel = 1;
  for (let i = 0; i < PASS_LEVELS.length; i++) {
    if (pass.exp >= PASS_LEVELS[i].requiredExp) {
      currentPassLevel = PASS_LEVELS[i].level;
    }
  }

  const nextPassTarget = PASS_LEVELS.find((p) => p.level === currentPassLevel + 1);
  const passExpProgress = nextPassTarget
    ? Math.min(100, Math.round((pass.exp / nextPassTarget.requiredExp) * 100))
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-800 flex flex-col max-h-[90vh] animate-slide-in-down">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>SEASON 1: CLOUD WONDERLAND</span>
          </div>
          <h3 className="text-lg font-black text-amber-950">Hamster Pass & เควสต์ประจำวัน</h3>
          <p className="text-[11px] text-amber-800">
            ทำภารกิจเพื่อสะสม Pass EXP และปลดล็อคชุดลิมิเต็ดประจำสัปดาห์!
          </p>
        </div>

        {/* 3 Tabs เมนู */}
        <div className="flex bg-amber-200/70 p-1 rounded-2xl border border-amber-300/80 mb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab("pass")}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeTab === "pass"
                ? "bg-amber-500 text-white shadow-xs font-black"
                : "text-amber-950 hover:bg-amber-200/60"
            }`}
          >
            <span>🎟️ Hamster Pass</span>
          </button>

          <button
            onClick={() => setActiveTab("quests")}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeTab === "quests"
                ? "bg-amber-500 text-white shadow-xs font-black"
                : "text-amber-950 hover:bg-amber-200/60"
            }`}
          >
            <span>📋 เควสต์รายวัน</span>
          </button>

          <button
            onClick={() => setActiveTab("streak")}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeTab === "streak"
                ? "bg-amber-500 text-white shadow-xs font-black"
                : "text-amber-950 hover:bg-amber-200/60"
            }`}
          >
            <span>📅 เช็คชื่อ 7 วัน</span>
            {canClaimStreakToday && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* ============================================================
            TAB 1: HAMSTER PASS (Battle Pass 2 แถว)
        ============================================================ */}
        {activeTab === "pass" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 animate-fade-in">
            {/* Pass Progress Header */}
            <div className="bg-white/90 p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-2.5 py-0.5 rounded-lg shadow-xs">
                    Pass Lv. {currentPassLevel} / 10
                  </span>
                  <span className="text-xs font-bold text-slate-700">{pass.exp} EXP</span>
                </div>
                {nextPassTarget && (
                  <span className="text-[10px] text-slate-500 font-bold">
                    เป้าหมายถัดไป: {nextPassTarget.requiredExp} EXP
                  </span>
                )}
              </div>
              <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${passExpProgress}%` }}
                ></div>
              </div>

              {/* Gold Pass Unlock Banner */}
              {!pass.hasGoldPass ? (
                <div className="mt-3 p-2.5 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 rounded-xl border border-amber-400 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-xs text-amber-950 flex items-center">
                      <Star className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-600" />
                      <span>อัปเกรดเป็น Gold Pass</span>
                    </h4>
                    <p className="text-[10px] text-amber-800">
                      ปลดล็อคแถวพรีเมียม + ชุดนอนปุยเมฆ ☁️
                    </p>
                  </div>
                  <button
                    onClick={onUnlockGoldPass}
                    disabled={gameState.coins < 200}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs shadow-sm transition-all active:scale-95 flex items-center space-x-1 ${
                      gameState.coins >= 200
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span>200</span>
                    <span>🌻 ซื้อ</span>
                  </button>
                </div>
              ) : (
                <div className="mt-2 text-center py-1 bg-amber-200/80 rounded-xl border border-amber-300 text-xs font-black text-amber-950 flex items-center justify-center space-x-1">
                  <span>✨ คุณได้เป็นเจ้าของ Gold Pass เรียบร้อยแล้ว! ✨</span>
                </div>
              )}
            </div>

            {/* List of 10 Pass Levels */}
            <div className="space-y-2">
              {PASS_LEVELS.map((item) => {
                const isLevelReached = pass.exp >= item.requiredExp;
                const isFreeClaimed = (pass.claimedFree || []).includes(item.level);
                const isGoldClaimed = (pass.claimedGold || []).includes(item.level);

                return (
                  <div
                    key={item.level}
                    className={`p-2.5 rounded-2xl border-2 transition-all ${
                      isLevelReached
                        ? "bg-white/95 border-amber-300 shadow-xs"
                        : "bg-slate-100/80 border-slate-200 opacity-75"
                    }`}
                  >
                    {/* Level Number & Required EXP */}
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-amber-100">
                      <span className="font-black text-xs text-amber-950 flex items-center">
                        <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] mr-1.5 font-black">
                          {item.level}
                        </span>
                        <span>ระดับที่ {item.level}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">
                        ต้องการ {item.requiredExp} EXP
                      </span>
                    </div>

                    {/* Row 1: Free Reward */}
                    <div className="flex items-center justify-between p-1.5 bg-amber-50/60 rounded-xl mb-1.5 border border-amber-200/60">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{item.freeReward.icon}</span>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500">FREE REWARD</div>
                          <div className="text-xs font-black text-slate-800">{item.freeReward.name}</div>
                        </div>
                      </div>
                      <div>
                        {isFreeClaimed ? (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-lg flex items-center">
                            <Check className="w-3 h-3 mr-0.5" /> รับแล้ว
                          </span>
                        ) : isLevelReached ? (
                          <button
                            onClick={() => onClaimFreePass(item.level, item.freeReward)}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-xs active:scale-95 transition-all"
                          >
                            รับรางวัล
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">🔒 ล็อค</span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Gold Reward */}
                    <div className={`flex items-center justify-between p-1.5 rounded-xl border ${
                      pass.hasGoldPass
                        ? "bg-gradient-to-r from-yellow-50 to-amber-100 border-amber-300"
                        : "bg-slate-100 border-slate-200 opacity-60"
                    }`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{item.goldReward.icon}</span>
                        <div>
                          <div className="text-[10px] font-black text-amber-700 flex items-center">
                            <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-500" />
                            <span>GOLD EXCLUSIVE</span>
                          </div>
                          <div className="text-xs font-black text-amber-950">{item.goldReward.name}</div>
                        </div>
                      </div>
                      <div>
                        {!pass.hasGoldPass ? (
                          <span className="text-[10px] font-black text-amber-800 flex items-center">
                            <Lock className="w-2.5 h-2.5 mr-0.5" /> ต้องมี Gold
                          </span>
                        ) : isGoldClaimed ? (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-lg flex items-center">
                            <Check className="w-3 h-3 mr-0.5" /> รับแล้ว
                          </span>
                        ) : isLevelReached ? (
                          <button
                            onClick={() => onClaimGoldPass(item.level, item.goldReward)}
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 text-amber-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-xs active:scale-95 transition-all"
                          >
                            รับรางวัล
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">🔒 ล็อค</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: DAILY QUESTS (เควสต์ประจำวัน)
        ============================================================ */}
        {activeTab === "quests" && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 animate-fade-in">
            <div className="bg-amber-100/70 p-2.5 rounded-2xl border border-amber-200 text-center mb-1">
              <p className="text-xs font-bold text-amber-900">
                ทำภารกิจรายวันเพื่อรับ Pass EXP เพิ่มขึ้น และเหรียญทานตะวันพิเศษ!
              </p>
            </div>

            {DAILY_QUEST_DEFS.map((quest) => {
              const currentProgress = pass.dailyProgress?.[quest.id] || 0;
              const isCompleted = currentProgress >= quest.target;
              const isClaimed = (pass.claimedQuests || []).includes(quest.id);

              return (
                <div
                  key={quest.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                    isClaimed
                      ? "bg-slate-100 border-slate-200 opacity-60"
                      : isCompleted
                      ? "bg-emerald-50 border-emerald-300 shadow-xs"
                      : "bg-white/95 border-amber-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl bg-amber-100 rounded-2xl w-11 h-11 flex items-center justify-center shadow-xs">
                      {quest.icon}
                    </span>
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                        {quest.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{quest.desc}</p>
                      <div className="flex items-center space-x-2 mt-1 text-[10px] font-bold">
                        <span className="text-amber-700">+{quest.passExpReward} Pass EXP</span>
                        <span className="text-yellow-600">+{quest.coinsReward} 🌻</span>
                        <span className="text-slate-400">({Math.min(quest.target, currentProgress)}/{quest.target})</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isClaimed ? (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2.5 py-1 rounded-xl flex items-center">
                        <Check className="w-3 h-3 mr-0.5" /> รับแล้ว
                      </span>
                    ) : isCompleted ? (
                      <button
                        onClick={() => onClaimQuest(quest.id, quest.passExpReward, quest.coinsReward)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-md active:scale-95 transition-all"
                      >
                        รับรางวัล!
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-xl">
                        ยังไม่เสร็จ
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================
            TAB 3: 7-DAY LOGIN STREAK (เช็คชื่อ 7 วัน)
        ============================================================ */}
        {activeTab === "streak" && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 p-3 rounded-2xl border-2 border-purple-300 text-center shadow-xs">
              <span className="text-2xl">🦄</span>
              <h4 className="font-black text-xs sm:text-sm text-purple-950 mt-0.5">
                เช็คชื่อต่อเนื่อง 7 วัน รับ "หมวกยูนิคอร์นสายรุ้ง" ฟรี!
              </h4>
              <p className="text-[10px] text-purple-800 mt-0.5 font-bold">
                สะสมวันเช็คชื่อต่อเนื่องแล้ว: {streak.days} / 7 วัน
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DAILY_STREAK_REWARDS.map((item) => {
                const isClaimed = (streak.claimedDays || []).includes(item.day);
                const isCurrentDay = streak.days + 1 === item.day;
                const isDay7 = item.day === 7;

                return (
                  <div
                    key={item.day}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                      isDay7 ? "col-span-2 bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 border-purple-400 shadow-sm" : ""
                    } ${
                      isClaimed
                        ? "bg-slate-100 border-slate-200 opacity-60"
                        : isCurrentDay && canClaimStreakToday
                        ? "bg-white border-amber-400 shadow-md animate-cute-bounce"
                        : "bg-white/90 border-amber-200"
                    }`}
                  >
                    <div className="text-[10px] font-black text-amber-800 uppercase mb-0.5">
                      วันที่ {item.day}
                    </div>
                    <div className="text-3xl my-1">{item.icon}</div>
                    <div className="text-xs font-black text-slate-800 leading-tight mb-2">
                      {item.name}
                    </div>

                    <div>
                      {isClaimed ? (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-lg inline-flex items-center">
                          <Check className="w-2.5 h-2.5 mr-0.5" /> รับแล้ว
                        </span>
                      ) : isCurrentDay && canClaimStreakToday ? (
                        <button
                          onClick={() => onClaimDailyStreak(item)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-3 py-1 rounded-xl shadow-xs active:scale-95 transition-all"
                        >
                          รับรางวัลวันนี้!
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.day <= streak.days ? "รับแล้ว" : "รอวันถัดไป"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
