import React, { useState, useEffect, useRef } from "react";
import { X, Play, RotateCw, Trophy, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../utils/audio";

export default function MiniGameWheel({ isOpen, onClose, onFinish }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [taps, setTaps] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [hasClaimed, setHasClaimed] = useState(false);

  const tapsRef = useRef(0);
  const endTimeRef = useRef(0);

  // เมื่อเปิดหรือปิด Modal ให้รีเซ็ตค่าเสมอเพื่อป้องกันบัครับของรางวัลค้าง
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setGameResult(null);
      setTaps(0);
      setTimeLeft(10);
      setHasClaimed(false);
      tapsRef.current = 0;
    }
  }, [isOpen]);

  // ระบบนาฬิกานับถอยหลัง 10 วินาทีแบบแม่นยำตามเวลาจริง (Wall-clock Time)
  // ไม่ผูกกับ taps ทำให้เวลานับลดลงคงที่ 10 วินาทีแน่นอน แม้ผู้เล่นจะรัวนิ้วถี่แค่ไหนก็ตาม
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = endTimeRef.current - now;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setTimeLeft(remainingSec);

      if (remainingMs <= 0) {
        clearInterval(interval);
        setIsPlaying(false);
        setTimeLeft(0);

        const finalTaps = tapsRef.current;
        const earnedCoins = Math.max(5, Math.floor(finalTaps * 0.8));
        const earnedExp = Math.max(10, Math.floor(finalTaps * 1.2));

        setGameResult({ coins: earnedCoins, exp: earnedExp, taps: finalTaps });
        setHasClaimed(false);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        sound.playLevelUp();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const handleStart = () => {
    tapsRef.current = 0;
    setTaps(0);
    setWheelRotation(0);
    setGameResult(null);
    setHasClaimed(false);
    setTimeLeft(10);
    endTimeRef.current = Date.now() + 10000;
    setIsPlaying(true);
    sound.playClick();
  };

  const handleTap = () => {
    if (!isPlaying) return;
    tapsRef.current += 1;
    setTaps(tapsRef.current);
    setWheelRotation((prev) => prev + 35);
    sound.playClick();
  };

  const handleClaim = () => {
    // ป้องกันการกดรับรางวัลซ้ำ หรือรับรัวๆ
    if (!gameResult || hasClaimed) return;
    setHasClaimed(true);

    if (onFinish) {
      onFinish(gameResult.coins, gameResult.exp);
    }

    // ล้างผลลัพธ์ทันที เพื่อให้ครั้งต่อไปต้องเริ่มเล่นใหม่
    setGameResult(null);
    setTaps(0);
    setTimeLeft(10);
    tapsRef.current = 0;
    onClose();
  };

  const handleClose = () => {
    setIsPlaying(false);
    setGameResult(null);
    setTaps(0);
    setTimeLeft(10);
    setHasClaimed(false);
    tapsRef.current = 0;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 to-orange-50 border-4 border-amber-300 rounded-3xl p-5 shadow-2xl text-slate-800 text-center font-['Itim',sans-serif]">
        {/* ปิดหน้าต่าง */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="mb-3">
          <span className="text-3xl">🎡</span>
          <h3 className="text-lg font-black text-amber-900 mt-1">มินิเกม ปั่นวงล้อ 10 วินาที!</h3>
          <p className="text-xs text-amber-700">รัวนิ้วให้ไวที่สุด เพื่อสะสมเมล็ดทานตะวันและ EXP</p>
        </div>

        {/* ผลลัพธ์เมื่อเล่นจบ */}
        {gameResult ? (
          <div className="bg-white/90 rounded-2xl p-4 border-2 border-amber-200 mb-4 shadow-sm animate-cute-bounce">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-1 drop-shadow" />
            <h4 className="font-black text-base text-amber-900">สุดยอดมากก! ปั่นไป {gameResult.taps} ครั้ง</h4>
            <div className="flex items-center justify-center space-x-4 my-3">
              <div className="bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 flex items-center space-x-1 font-black text-amber-900 text-sm">
                <span>🌻</span>
                <span>+{gameResult.coins} เหรียญ</span>
              </div>
              <div className="bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-300 flex items-center space-x-1 font-black text-orange-900 text-sm">
                <span>🌟</span>
                <span>+{gameResult.exp} EXP</span>
              </div>
            </div>
            <button
              onClick={handleClaim}
              disabled={hasClaimed}
              className={`w-full py-2.5 rounded-xl font-black text-sm shadow-md transition-all ${
                hasClaimed
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 active:scale-95"
              }`}
            >
              {hasClaimed ? "รับรางวัลเรียบร้อยแล้ว ✨" : "รับรางวัลเข้ากระเป๋า 🎉"}
            </button>
          </div>
        ) : (
          <>
            {/* ตัวจำลองวงล้อแฮมสเตอร์หมุน */}
            <div className="relative w-40 h-40 mx-auto my-3 flex items-center justify-center">
              {/* ขาตั้งวงล้อ */}
              <div className="absolute bottom-0 w-24 h-4 bg-amber-700 rounded-t-lg"></div>
              <div className="absolute bottom-2 w-3 h-20 bg-amber-600"></div>

              {/* กงล้อหมุน */}
              <div
                className="w-36 h-36 rounded-full border-8 border-dashed border-amber-500 bg-amber-100/50 flex items-center justify-center shadow-inner transition-transform"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transitionDuration: isPlaying ? "80ms" : "300ms",
                }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-xs font-bold text-amber-900 shadow">
                  ⚙️
                </div>
              </div>

              {/* น้องแฮมสเตอร์วิ่งอยู่ข้างในวงล้อ */}
              <div className="absolute bottom-6 pointer-events-none">
                <img
                  src="/assets/heaven-hamster.png"
                  alt="Running"
                  className={`w-16 h-12 object-contain pixel-art ${
                    isPlaying ? "animate-bounce" : ""
                  }`}
                />
              </div>
            </div>

            {/* แถบเวลาและจำนวนแต้ม */}
            <div className="flex items-center justify-around bg-white/80 rounded-2xl p-2.5 mb-4 border border-amber-200">
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500">เวลาที่เหลือ</div>
                <div className={`text-xl font-black ${timeLeft <= 3 ? "text-rose-600 animate-pulse" : "text-amber-900"}`}>
                  ⏱️ {timeLeft}s
                </div>
              </div>
              <div className="w-px h-8 bg-amber-200"></div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500">จำนวนครั้งที่ปั่น</div>
                <div className="text-xl font-black text-orange-600">
                  ⚡ {taps} ครั้ง
                </div>
              </div>
            </div>

            {/* ปุ่มกดเล่น / ปุ่มรัวนิ้ว */}
            {!isPlaying ? (
              <button
                onClick={handleStart}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black text-base shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>เริ่มปั่นวงล้อเลย!</span>
              </button>
            ) : (
              <button
                onClick={handleTap}
                className="w-full py-5 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white rounded-2xl font-black text-xl shadow-xl active:scale-90 transition-transform flex items-center justify-center space-x-2 animate-pulse select-none cursor-pointer"
              >
                <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <span>รัวนิ้วตรงนี้เล้ยยย! 💨</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
