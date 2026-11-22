import React, { useState, useEffect, useRef } from "react";
import { X, Play, RotateCcw, Trophy, Sparkles, Zap, Flame, Award } from "lucide-react";
import { sound } from "../utils/audio";
import { gameStateService } from "../services/gameStateService";

export default function HamsterWheelModal({ isOpen, onClose, gameState }) {
  const [gameStateMode, setGameStateMode] = useState("idle"); // 'idle' | 'playing' | 'gameover'
  const [timeLeft, setTimeLeft] = useState(25);
  const [rpm, setRpm] = useState(0);
  const [maxRpm, setMaxRpm] = useState(0);
  const [distance, setDistance] = useState(0); // in meters
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [lastPaw, setLastPaw] = useState(null); // 'left' | 'right'
  const [combo, setCombo] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isFever, setIsFever] = useState(false);
  const [seedBursts, setSeedBursts] = useState([]);

  const animFrameRef = useRef(null);
  const timerRef = useRef(null);
  const rpmDecayRef = useRef(null);

  // สถิติสูงสุดเดิม
  const bestRPM = gameState?.highScores?.wheelSprintRPM || 0;
  const bestDist = gameState?.highScores?.wheelSprintDist || 0;

  // เริ่มต้นเกมใหม่
  const startGame = () => {
    sound.playLevelUp();
    setGameStateMode("playing");
    setTimeLeft(25);
    setRpm(0);
    setMaxRpm(0);
    setDistance(0);
    setCoinsEarned(0);
    setLastPaw(null);
    setCombo(0);
    setWheelRotation(0);
    setIsFever(false);
    setSeedBursts([]);
  };

  // Timer Countdown (25s)
  useEffect(() => {
    if (gameStateMode !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStateMode]);

  // RPM Decay & Wheel Rotation Loop
  useEffect(() => {
    if (gameStateMode !== "playing") return;

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setRpm((currRpm) => {
        // ค่อยๆ ลดความเร็วรอบลงอย่างเป็นธรรมชาติ
        const decayRate = currRpm > 500 ? 120 : 75;
        const nextRpm = Math.max(0, currRpm - decayRate * dt);
        setIsFever(nextRpm >= 550);

        // หมุนล้อตาม RPM
        setWheelRotation((prevRot) => (prevRot + nextRpm * dt * 6) % 360);

        // คำนวณระยะทางที่วิ่งได้ (เส้นรอบวงวงล้อ ~0.5 เมตร)
        const distanceStep = (nextRpm / 60) * 0.5 * dt;
        setDistance((prevDist) => Math.round((prevDist + distanceStep) * 10) / 10);

        return nextRpm;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameStateMode]);

  // จบเกม & บันทึกรางวัล
  const handleGameOver = () => {
    setGameStateMode("gameover");
    sound.playLevelUp();

    // บันทึกลงใน Game State Service
    setDistance((finalDist) => {
      setMaxRpm((finalMaxRpm) => {
        setCoinsEarned((finalCoins) => {
          gameStateService.recordWheelScore(finalMaxRpm, Math.round(finalDist), finalCoins);
          return finalCoins;
        });
        return finalMaxRpm;
      });
      return finalDist;
    });
  };

  // แตะอุ้งเท้าซ้าย/ขวา (Paw Tap)
  const handlePawTap = (paw) => {
    if (gameStateMode !== "playing") return;

    sound.playClick();

    const isAlternate = lastPaw && lastPaw !== paw;

    setLastPaw(paw);

    if (isAlternate) {
      // แตะสลับเท้าได้ถูกต้อง! เพิ่มความเร็วรอบและคอมโบ
      const nextCombo = combo + 1;
      setCombo(nextCombo);

      const boost = 55 + Math.min(45, nextCombo * 3);
      setRpm((prevRpm) => {
        const nextRpm = Math.min(999, prevRpm + boost);
        setMaxRpm((prevMax) => Math.max(prevMax, nextRpm));

        // เก็บเมล็ดทานตะวันตามความเร็ว
        if (nextRpm >= 300) {
          const coinGain = nextRpm >= 600 ? 3 : 1;
          setCoinsEarned((c) => c + coinGain);

          // เอฟเฟกต์เมล็ดกระเด็น
          if (Math.random() > 0.4) {
            sound.playCoin();
            const burst = { id: Date.now() + Math.random(), x: 30 + Math.random() * 40 };
            setSeedBursts((b) => [...b.slice(-4), burst]);
            setTimeout(() => setSeedBursts((b) => b.filter((i) => i.id !== burst.id)), 800);
          }
        }

        return nextRpm;
      });
    } else {
      // แตะเท้าซ้ำ! สะดุดเล็กน้อยแต่ไม่ถึงกับหยุด
      setCombo(1);
      setRpm((prevRpm) => {
        const nextRpm = Math.min(999, prevRpm + 25);
        setMaxRpm((prevMax) => Math.max(prevMax, nextRpm));
        return nextRpm;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950 border-4 border-amber-300 dark:border-amber-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-800 dark:text-slate-100 animate-slide-in-down flex flex-col items-center">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 dark:bg-slate-800 hover:bg-amber-300 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold text-sm transition-transform active:scale-90 cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white px-3 py-0.5 rounded-full text-xs font-black shadow-xs mb-1">
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>มินิเกมวิ่งออกกำลังกาย 🏃‍♂️💨</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-300">
            วงล้อวิ่งมหาไว (Hamster Wheel Sprint)
          </h3>
        </div>

        {/* ========================================================
            CASE 1: IDLE / START SCREEN
            ======================================================== */}
        {gameStateMode === "idle" && (
          <div className="w-full flex flex-col items-center py-4 space-y-4 text-center">
            {/* ภาพล้อหมุนน่ารัก */}
            <div className="w-28 h-28 rounded-full border-6 border-dashed border-amber-400 flex items-center justify-center bg-amber-200/50 dark:bg-slate-800/80 shadow-inner animate-[spin_8s_linear_infinite]">
              <span className="text-5xl">🎡</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-slate-300 max-w-xs leading-relaxed">
                แตะปุ่ม <span className="font-black text-orange-600">"อุ้งซ้าย 🐾"</span> และ{" "}
                <span className="font-black text-orange-600">"อุ้งขวา 🐾"</span> สลับจังหวะกันอย่างรวดเร็ว
                เพื่อปั่นรอบ RPM ให้น้องวิ่งสปีดเทอร์โบและเก็บเมล็ดทานตะวัน!
              </p>
            </div>

            {/* สถิติสูงสุดเดิม */}
            <div className="bg-white/80 dark:bg-slate-800/80 border-2 border-amber-200 dark:border-slate-700 rounded-2xl p-2.5 w-full max-w-xs flex justify-around text-xs shadow-inner">
              <div className="flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">RPM สูงสุด</div>
                  <div className="font-black text-amber-900 dark:text-amber-300">{bestRPM} RPM</div>
                </div>
              </div>
              <div className="w-px bg-amber-200 dark:bg-slate-700" />
              <div className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-orange-500" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">ระยะทางไกลสุด</div>
                  <div className="font-black text-orange-800 dark:text-orange-300">{bestDist} เมตร</div>
                </div>
              </div>
            </div>

            {/* ปุ่มเริ่มเล่น */}
            <button
              onClick={startGame}
              className="w-full max-w-xs py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>เริ่มสปรินต์เลย! (25 วินาที)</span>
            </button>
          </div>
        )}

        {/* ========================================================
            CASE 2: PLAYING ACTIVE SPRINT
            ======================================================== */}
        {gameStateMode === "playing" && (
          <div className="w-full flex flex-col items-center space-y-2">
            {/* แถบสถานะด้านบน: เวลา + ระยะทาง + เมล็ดที่เก็บได้ */}
            <div className="w-full flex items-center justify-between px-2 text-xs font-black">
              <div className="bg-rose-500 text-white px-2.5 py-1 rounded-xl shadow-xs flex items-center space-x-1 animate-pulse">
                <span>⏱️</span>
                <span>{timeLeft}s</span>
              </div>

              <div className="bg-amber-400 text-amber-950 px-3 py-1 rounded-xl shadow-xs flex items-center space-x-1">
                <img src="/assets/icons/icon_seed.png" alt="Seeds" className="w-3.5 h-3.5 object-contain pixel-art inline" />
                <span>+{coinsEarned}</span>
              </div>

              <div className="bg-indigo-600 text-white px-2.5 py-1 rounded-xl shadow-xs">
                🏃 {distance} ม.
              </div>
            </div>

            {/* TURBO FEVER BANNER */}
            {isFever && (
              <div className="w-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white text-[11px] font-black py-0.5 rounded-lg flex items-center justify-center space-x-1 animate-bounce shadow-md">
                <Flame className="w-3.5 h-3.5 fill-white animate-spin" />
                <span>🔥 TURBO FEVER! เหรียญกระเด็นคูณ 2! 🔥</span>
              </div>
            )}

            {/* เกจ RPM METER */}
            <div className="w-full bg-black/10 dark:bg-black/30 rounded-xl p-1.5 flex items-center space-x-2">
              <div className="text-[10px] font-black text-amber-900 dark:text-amber-300 w-16 text-right whitespace-nowrap">
                {Math.round(rpm)} RPM
              </div>
              <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    isFever ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-yellow-400 to-amber-500"
                  }`}
                  style={{ width: `${Math.min(100, (rpm / 800) * 100)}%` }}
                />
              </div>
            </div>

            {/* ARENA: วงล้อหมุน และ แฮมสเตอร์วิ่ง */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-1 select-none overflow-hidden">
              {/* ละอองเมล็ดกระเด็น (Seed Bursts) */}
              {seedBursts.map((b) => (
                <div
                  key={b.id}
                  className="absolute z-30 pointer-events-none animate-[floatStar_0.8s_ease-out_forwards]"
                  style={{ left: `${b.x}%`, top: "30%" }}
                >
                  <img src="/assets/icons/icon_seed.png" alt="Seed" className="w-4 h-4 object-contain pixel-art drop-shadow" />
                </div>
              ))}

              {/* ล้อหมุนด้านหลัง (Spinning Wheel Frame) */}
              <div
                className="absolute inset-2 rounded-full border-8 border-dashed border-amber-400 dark:border-amber-500 shadow-xl pointer-events-none"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: "transform 0.05s linear",
                }}
              >
                {/* ซี่ล้อ */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1 bg-amber-300/60 dark:bg-amber-600/60"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-amber-300/60 dark:bg-amber-600/60"></div>
                </div>
              </div>

              {/* ตัวน้องแฮมสเตอร์วิ่งสปรินต์ */}
              <div
                className={`relative z-20 pointer-events-none transition-transform duration-100 ${
                  rpm > 0 ? "animate-cute-bounce" : ""
                }`}
                style={{
                  transform: `translateY(${Math.sin(wheelRotation * 0.1) * 3}px) scale(${1 + (rpm / 3000)})`,
                }}
              >
                <img
                  src={`/assets/breeds/${gameState?.breed || "winter_white"}.png`}
                  alt="Running Hamster"
                  className="w-32 sm:w-36 object-contain pixel-art drop-shadow-md"
                />
              </div>
            </div>

            {/* ป้ายแสดงคอมโบการแตะ */}
            <div className="h-4 text-center">
              {combo > 1 && (
                <div className="text-[10px] font-black text-orange-600 dark:text-orange-400 animate-pulse">
                  ⚡ COMBO x{combo}! แตะสลับเท้าได้ยอดเยี่ยม!
                </div>
              )}
            </div>

            {/* ========================================================
                CONTROLS: ปุ่มแตะอุ้งเท้าซ้าย / อุ้งเท้าขวา (BIG TACTILE BUTTONS)
                ======================================================== */}
            <div className="w-full grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onPointerDown={() => handlePawTap("left")}
                className={`py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base border-4 border-b-6 shadow-md transition-all active:translate-y-1 active:border-b-4 flex flex-col items-center justify-center cursor-pointer select-none ${
                  lastPaw === "left"
                    ? "bg-orange-600 border-orange-700 text-white"
                    : "bg-gradient-to-b from-amber-400 to-orange-500 border-orange-600 text-white hover:from-amber-500"
                }`}
              >
                <span className="text-xl">🐾</span>
                <span>อุ้งซ้าย!</span>
              </button>

              <button
                type="button"
                onPointerDown={() => handlePawTap("right")}
                className={`py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base border-4 border-b-6 shadow-md transition-all active:translate-y-1 active:border-b-4 flex flex-col items-center justify-center cursor-pointer select-none ${
                  lastPaw === "right"
                    ? "bg-orange-600 border-orange-700 text-white"
                    : "bg-gradient-to-b from-amber-400 to-orange-500 border-orange-600 text-white hover:from-amber-500"
                }`}
              >
                <span className="text-xl">🐾</span>
                <span>อุ้งขวา!</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            CASE 3: GAME OVER / RESULTS SCREEN
            ======================================================== */}
        {gameStateMode === "gameover" && (
          <div className="w-full flex flex-col items-center py-3 space-y-3 text-center animate-slide-in-down">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-white">
              🏆
            </div>

            <div className="space-y-0.5">
              <h4 className="text-lg font-black text-amber-950 dark:text-amber-300">
                หมดเวลาสปรินต์แล้วจ้า! 🎉
              </h4>
              <p className="text-xs text-amber-800 dark:text-slate-400 font-bold">
                น้องแฮมสเตอร์ได้ออกกำลังกายเต็มที่ สุขภาพแข็งแรงและมีความสุขสุดๆ!
              </p>
            </div>

            {/* การ์ดสรุปผลคะแนน */}
            <div className="w-full bg-white/90 dark:bg-slate-800 border-2 border-amber-300 dark:border-slate-700 rounded-2xl p-3 shadow-inner grid grid-cols-3 gap-1.5 text-xs">
              <div className="flex flex-col items-center p-1 bg-amber-50 dark:bg-slate-750 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold">RPM สูงสุด</span>
                <span className="font-black text-amber-900 dark:text-amber-300 text-sm">{maxRpm}</span>
              </div>
              <div className="flex flex-col items-center p-1 bg-amber-50 dark:bg-slate-750 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold">ระยะทาง</span>
                <span className="font-black text-orange-800 dark:text-orange-300 text-sm">{distance} ม.</span>
              </div>
              <div className="flex flex-col items-center p-1 bg-amber-50 dark:bg-slate-750 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold">เมล็ดที่ได้รับ</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">+{coinsEarned} 🌻</span>
              </div>
            </div>

            {/* New Record Badge */}
            {maxRpm > bestRPM && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-xs font-black shadow-xs flex items-center space-x-1 animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>NEW RECORD! สถิติรอบ RPM ใหม่ของคุณ! 🌟</span>
              </div>
            )}

            {/* ปุ่ม Actions */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={startGame}
                className="py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white rounded-xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>สปรินต์อีกรอบ ⚡</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>กลับสู่กรง 🏡</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
