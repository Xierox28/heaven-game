import React, { useState, useEffect } from "react";
import { X, Trophy, Crown, Medal, Award, Flame, Sparkles } from "lucide-react";
import { ref, get, onValue } from "firebase/database";
import { database, isFirebaseConfigured } from "../firebaseConfig";

export default function LeaderboardModal({ isOpen, onClose, currentUsername }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    if (isFirebaseConfigured() && database) {
      const lbRef = ref(database, "leaderboard");
      const unsub = onValue(lbRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list = Object.keys(val).map((user) => ({
            username: user,
            ...val[user],
          }));
          // Sort by Level DESC, then Coins DESC, then Exp DESC
          list.sort((a, b) => {
            if ((b.level || 1) !== (a.level || 1)) {
              return (b.level || 1) - (a.level || 1);
            }
            return (b.coins || 0) - (a.coins || 0);
          });
          setLeaderboard(list);
        } else {
          setLeaderboard([]);
        }
        setLoading(false);
      }, () => setLoading(false));

      return () => unsub();
    } else {
      // Local fallback mock
      try {
        const stored = localStorage.getItem("heaven_local_leaderboard_v1");
        if (stored) {
          setLeaderboard(JSON.parse(stored));
        } else {
          setLeaderboard([
            { username: currentUsername || "you", hamsterName: "น้องเฮเว่น", level: 2, coins: 62, stats: { totalFed: 5 } },
            { username: "alice_hammy", hamsterName: "ชูการ์", level: 5, coins: 340, stats: { totalFed: 32 } },
            { username: "bob_master", hamsterName: "โมจิ", level: 4, coins: 180, stats: { totalFed: 20 } },
          ]);
        }
      } catch {}
      setLoading(false);
    }
  }, [isOpen, currentUsername]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-100 border-4 border-amber-300 rounded-3xl p-5 shadow-2xl text-slate-800 flex flex-col max-h-[85vh] animate-slide-in-down">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-2xl shadow-md border-2 border-white mb-1">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-black text-amber-950">
            ตารางอันดับผู้เลี้ยงแฮมสเตอร์ (Leaderboard)
          </h3>
          <p className="text-xs text-amber-800 font-semibold">
            อันดับวัดจากเลเวลและความสุขของน้องเฮเว่นทั่วโลก! 🌍✨
          </p>
        </div>

        {/* รายการอันดับ */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="text-center py-8 text-xs font-bold text-amber-800">
              กำลังโหลดข้อมูลอันดับสด... 🐹
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-xs font-bold text-amber-800">
              ยังไม่มีผู้เล่นในตารางอันดับ เป็นคนแรกที่เริ่มเล่นเลย!
            </div>
          ) : (
            leaderboard.map((player, index) => {
              const isCurrentUser = player.username === currentUsername;
              const rank = index + 1;

              return (
                <div
                  key={player.username}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all ${
                    rank === 1
                      ? "bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-amber-400 shadow-sm"
                      : rank === 2
                      ? "bg-slate-100/90 border-slate-300 shadow-xs"
                      : rank === 3
                      ? "bg-orange-100/80 border-orange-300 shadow-xs"
                      : isCurrentUser
                      ? "bg-amber-50 border-amber-300"
                      : "bg-white/80 border-amber-200/60"
                  }`}
                >
                  {/* Rank badge + Avatar */}
                  <div className="flex items-center space-x-2.5">
                    {/* อันดับ 1, 2, 3 หรือเลขทั่วไป */}
                    <div className="w-7 text-center font-black">
                      {rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-xs text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                          #{rank}
                        </span>
                      )}
                    </div>

                    {/* รูปแฮมสเตอร์ตัวจิ๋ว */}
                    <div className="w-9 h-9 bg-amber-200 rounded-xl flex items-center justify-center text-lg shadow-xs border border-amber-300 flex-shrink-0">
                      🐹
                    </div>

                    {/* ชื่อผู้เล่นและแฮมสเตอร์ */}
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-black text-xs text-slate-900 leading-tight">
                          {player.hamsterName || "น้องเฮเว่น"}
                        </span>
                        {isCurrentUser && (
                          <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                            คุณ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        ผู้ดูแล: @{player.username}
                      </div>
                    </div>
                  </div>

                  {/* เลเวลและเหรียญ */}
                  <div className="text-right flex flex-col items-end">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Lv. {player.level || 1}</span>
                    </span>
                    <span className="text-[10px] text-amber-900 font-black mt-0.5 flex items-center">
                      <span className="mr-0.5">🌻</span>
                      <span>{player.coins || 0}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ข้อความให้กำลังใจท้ายการ์ด */}
        <div className="mt-3 pt-2 border-t border-amber-200 text-center">
          <p className="text-[11px] font-bold text-amber-800">
            ⭐ ให้อาหารและลูบหัวน้องบ่อยๆ เพื่อเพิ่มเลเวลขึ้นสู่อันดับ 1!
          </p>
        </div>
      </div>
    </div>
  );
}
