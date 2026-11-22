import React, { useState, useEffect, useRef } from "react";
import { X, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight, Zap, Sparkles } from "lucide-react";
import { sound } from "../utils/audio";
import confetti from "canvas-confetti";

export default function HamsterJumpMiniGame({ state, isOpen, onClose, onFinish }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("start"); // 'start' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [seedsCollected, setSeedsCollected] = useState(0);
  const [highScore, setHighScore] = useState(() => state?.highScores?.hamsterJump || 0);

  // Game internal state ref for requestAnimationFrame loop
  const engineRef = useRef({
    hamster: { x: 150, y: 350, vx: 0, vy: -10, width: 44, height: 32, facing: "right" },
    platforms: [],
    seeds: [],
    cameraY: 0,
    keys: { left: false, right: false },
    score: 0,
    seedsEarned: 0,
    animId: null,
  });

  const hamsterImgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = `/assets/breeds/${state?.breed || "winter_white"}.png`;
    img.onerror = () => {
      img.src = "/assets/breeds/winter_white.png";
    };
    hamsterImgRef.current = img;
  }, [state?.breed]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen || gameState !== "playing") return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        engineRef.current.keys.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        engineRef.current.keys.right = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        engineRef.current.keys.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        engineRef.current.keys.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, gameState]);

  // Start game loop
  const startGame = () => {
    sound.playLevelUp();
    setGameState("playing");
    setScore(0);
    setSeedsCollected(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    // Initialize platforms
    const platforms = [];
    // Base platform
    platforms.push({ x: W / 2 - 40, y: H - 30, w: 80, h: 16, type: "normal" });

    // Generate upward platforms
    for (let y = H - 90; y > -5000; y -= 65 + Math.random() * 25) {
      const type = Math.random() < 0.15 ? "spring" : Math.random() < 0.1 ? "storm" : "normal";
      const w = type === "storm" ? 60 : 70 + Math.random() * 20;
      const x = Math.random() * (W - w);
      platforms.push({ x, y, w, h: 16, type });
    }

    // Generate floating seeds
    const seeds = [];
    for (let i = 0; i < 60; i++) {
      seeds.push({
        x: 20 + Math.random() * (W - 40),
        y: -(i * 80 + Math.random() * 40),
        collected: false,
        isStar: Math.random() < 0.2,
      });
    }

    engineRef.current = {
      hamster: { x: W / 2 - 22, y: H - 80, vx: 0, vy: -11, width: 44, height: 32, facing: "right" },
      platforms,
      seeds,
      cameraY: 0,
      keys: { left: false, right: false },
      score: 0,
      seedsEarned: 0,
      animId: null,
    };

    loop();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const eng = engineRef.current;
    const h = eng.hamster;

    // 1. Controls & Velocity
    const moveSpeed = 4.5;
    if (eng.keys.left) {
      h.vx = -moveSpeed;
      h.facing = "left";
    } else if (eng.keys.right) {
      h.vx = moveSpeed;
      h.facing = "right";
    } else {
      h.vx *= 0.8;
    }

    h.x += h.vx;

    // Screen wrap
    if (h.x + h.width < 0) h.x = W;
    if (h.x > W) h.x = -h.width;

    // Gravity
    h.vy += 0.35; // gravity
    h.y += h.vy;

    // Camera follow (when hamster reaches upper half of screen)
    if (h.y < H * 0.45) {
      const diff = H * 0.45 - h.y;
      h.y = H * 0.45;
      eng.cameraY += diff;
      eng.score = Math.max(eng.score, Math.floor(eng.cameraY / 10));
      setScore(eng.score);

      // Shift platforms & seeds downwards relative to camera
      eng.platforms.forEach((p) => (p.y += diff));
      eng.seeds.forEach((s) => (s.y += diff));

      // Generate new platforms on top as camera moves
      const topPlatformY = Math.min(...eng.platforms.map((p) => p.y));
      if (topPlatformY > -200) {
        for (let ny = topPlatformY - 70; ny > -400; ny -= 70 + Math.random() * 20) {
          const type = Math.random() < 0.15 ? "spring" : Math.random() < 0.1 ? "storm" : "normal";
          const w = 70 + Math.random() * 20;
          const x = Math.random() * (W - w);
          eng.platforms.push({ x, y: ny, w, h: 16, type });
          if (Math.random() < 0.4) {
            eng.seeds.push({
              x: x + w / 2,
              y: ny - 30,
              collected: false,
              isStar: Math.random() < 0.25,
            });
          }
        }
      }
    }

    // 2. Platform Collisions (only when falling downwards)
    if (h.vy > 0) {
      eng.platforms.forEach((p) => {
        if (
          h.x + h.width * 0.8 > p.x &&
          h.x + h.width * 0.2 < p.x + p.w &&
          h.y + h.height >= p.y &&
          h.y + h.height <= p.y + p.h + 8
        ) {
          if (p.type === "storm") {
            // Storm cloud gives a small shock and lower bounce
            sound.playPet();
            h.vy = -6;
          } else if (p.type === "spring") {
            // Super Spring Jump!
            sound.playLevelUp();
            h.vy = -18;
          } else {
            // Normal Cloud bounce
            sound.playClick();
            h.vy = -11.5;
          }
        }
      });
    }

    // 3. Collectible Collisions
    eng.seeds.forEach((s) => {
      if (!s.collected) {
        const dx = h.x + h.width / 2 - s.x;
        const dy = h.y + h.height / 2 - s.y;
        if (Math.hypot(dx, dy) < 25) {
          s.collected = true;
          sound.playCoin();
          const earned = s.isStar ? 5 : 2;
          eng.seedsEarned += earned;
          setSeedsCollected(eng.seedsEarned);
        }
      }
    });

    // 4. Game Over Condition (Hamster fell off bottom of screen)
    if (h.y > H + 40) {
      cancelAnimationFrame(eng.animId);
      setGameState("gameover");
      if (eng.score > highScore) {
        setHighScore(eng.score);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
      }
      return;
    }

    // =========================================================================
    // 5. DRAWING
    // =========================================================================
    // Sky gradient background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, "#BAE6FD"); // Sky blue top
    skyGrad.addColorStop(1, "#FEF3C7"); // Sunset warm cream bottom
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Draw Platforms (Clouds)
    eng.platforms.forEach((p) => {
      if (p.y > -50 && p.y < H + 50) {
        if (p.type === "storm") {
          // Dark Storm Cloud
          ctx.fillStyle = "#475569";
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, p.h, 8);
          ctx.fill();
          ctx.fillStyle = "#F59E0B";
          ctx.font = "12px sans-serif";
          ctx.fillText("⚡", p.x + p.w / 2 - 6, p.y + 13);
        } else if (p.type === "spring") {
          // Golden Spring Cloud
          ctx.fillStyle = "#FEF08A";
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, p.h, 8);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#D97706";
          ctx.font = "12px sans-serif";
          ctx.fillText("🚀", p.x + p.w / 2 - 6, p.y + 13);
        } else {
          // Soft White Cloud
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#93C5FD";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, p.h, 8);
          ctx.fill();
          ctx.stroke();
        }
      }
    });

    // Draw Seeds & Stars
    eng.seeds.forEach((s) => {
      if (!s.collected && s.y > -30 && s.y < H + 30) {
        ctx.font = s.isStar ? "18px sans-serif" : "15px sans-serif";
        ctx.fillText(s.isStar ? "⭐" : "🌻", s.x - 8, s.y + 8);
      }
    });

    // Draw Hamster
    ctx.save();
    if (hamsterImgRef.current && hamsterImgRef.current.complete) {
      if (h.facing === "left") {
        ctx.translate(h.x + h.width, h.y);
        ctx.scale(-1, 1);
        ctx.drawImage(hamsterImgRef.current, 0, 0, h.width, h.height);
      } else {
        ctx.drawImage(hamsterImgRef.current, h.x, h.y, h.width, h.height);
      }
    } else {
      // Fallback Hamster Emoji
      ctx.font = "32px sans-serif";
      ctx.fillText("🐹", h.x, h.y + 24);
    }
    ctx.restore();

    eng.animId = requestAnimationFrame(loop);
  };

  const handleFinishAndClaim = () => {
    sound.playLevelUp();
    if (onFinish) {
      onFinish(engineRef.current.score, engineRef.current.seedsEarned);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 rounded-3xl border-4 border-amber-300 shadow-2xl p-4 flex flex-col items-center overflow-hidden">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-sky-300/60 z-10">
          <div className="flex items-center space-x-1.5">
            <span className="text-xl">🚀</span>
            <span className="font-black text-sm text-sky-950">Hamster Jump</span>
          </div>
          <button
            onClick={() => {
              if (engineRef.current.animId) cancelAnimationFrame(engineRef.current.animId);
              sound.playClick();
              onClose();
            }}
            className="p-1 bg-white/80 hover:bg-white text-sky-950 rounded-full shadow-xs transition-transform active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live In-Game HUD */}
        <div className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-black text-sky-950 z-10">
          <div className="flex items-center space-x-1 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
            <img
              src="/assets/ui/btn_jump.png"
              alt="Height"
              className="w-3.5 h-3.5 object-contain pixel-art inline"
            />
            <span>{score} m</span>
          </div>
          <div className="flex items-center space-x-1 bg-amber-100/90 px-2 py-0.5 rounded-full shadow-xs text-amber-900">
            <img
              src="/assets/icons/icon_seed.png"
              alt="Seeds"
              className="w-3.5 h-3.5 object-contain pixel-art inline"
            />
            <span>+{seedsCollected}</span>
          </div>
          <div className="flex items-center space-x-1 bg-yellow-100/90 px-2 py-0.5 rounded-full shadow-xs text-yellow-900">
            <img
              src="/assets/icons/icon_trophy.png"
              alt="Best"
              className="w-3.5 h-3.5 object-contain pixel-art inline"
            />
            <span>{highScore} m</span>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-inner border-2 border-white/80 bg-sky-200 my-1">
          <canvas ref={canvasRef} width={300} height={400} className="w-full h-full block" />

          {/* START SCREEN OVERLAY */}
          {gameState === "start" && (
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
              <img
                src="/assets/ui/btn_jump.png"
                alt="Jump"
                className="w-14 h-14 object-contain pixel-art animate-bounce mb-2 drop-shadow-lg"
              />
              <h3 className="text-lg font-black text-amber-300 drop-shadow-md">Hamster Jump!</h3>
              <p className="text-xs font-bold text-sky-100 my-2 leading-relaxed flex flex-col items-center">
                <span>กระโดดเหยียบเมฆไต่ระดับขึ้นฟ้า</span>
                <span className="flex items-center space-x-1 mt-0.5">
                  <span>หลบเมฆสายฟ้า</span>
                  <img
                    src="/assets/icons/icon_energy.png"
                    alt="Lightning"
                    className="w-3.5 h-3.5 object-contain pixel-art inline"
                  />
                  <span>เก็บเมล็ดทานตะวัน</span>
                  <img
                    src="/assets/icons/icon_seed.png"
                    alt="Seeds"
                    className="w-3.5 h-3.5 object-contain pixel-art inline"
                  />
                </span>
              </p>
              <button
                onClick={startGame}
                className="mt-3 px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-sm rounded-2xl shadow-lg transform active:scale-95 flex items-center space-x-1.5 animate-pulse"
              >
                <Play className="w-4 h-4 fill-amber-950" />
                <span>เริ่มกระโดดเลย!</span>
              </button>
            </div>
          )}

          {/* GAME OVER OVERLAY */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white animate-fade-in">
              <span className="text-4xl mb-1">🥺🐾</span>
              <h3 className="text-base font-black text-amber-300">ร่วงลงมาแล้ววว!</h3>
              <div className="bg-white/10 rounded-2xl p-3 my-2 w-full max-w-[220px] text-xs font-black space-y-1">
                <div>ความสูงที่ทำได้: <span className="text-sky-300 text-sm">{score} เมตร</span></div>
                <div className="flex items-center justify-center space-x-1">
                  <span>เมล็ดทานตะวันที่เก็บได้:</span>
                  <span className="text-amber-300 text-sm flex items-center">
                    <span>+{seedsCollected}</span>
                    <img
                      src="/assets/icons/icon_seed.png"
                      alt="Seeds"
                      className="w-3.5 h-3.5 object-contain pixel-art inline ml-0.5"
                    />
                  </span>
                </div>
                <div>สถิติสูงสุด: <span className="text-yellow-400">{highScore} เมตร</span></div>
              </div>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={startGame}
                  className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-black text-xs rounded-xl flex items-center space-x-1 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>เล่นอีกรอบ</span>
                </button>
                <button
                  onClick={handleFinishAndClaim}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-all"
                >
                  รับรางวัล & กลับ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Touch Screen On-Screen Buttons (Left & Right) */}
        {gameState === "playing" && (
          <div className="w-full flex items-center justify-between px-2 pt-2">
            <button
              onPointerDown={() => (engineRef.current.keys.left = true)}
              onPointerUp={() => (engineRef.current.keys.left = false)}
              onPointerCancel={() => (engineRef.current.keys.left = false)}
              className="w-20 py-2.5 bg-white/90 active:bg-amber-300 rounded-2xl shadow-md border-2 border-sky-300 text-sky-950 font-black text-xs flex items-center justify-center select-none active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 mr-0.5" />
              <span>ซ้าย</span>
            </button>
            <span className="text-[10px] font-black text-sky-950/70">กดค้างเพื่อเคลื่อนที่</span>
            <button
              onPointerDown={() => (engineRef.current.keys.right = true)}
              onPointerUp={() => (engineRef.current.keys.right = false)}
              onPointerCancel={() => (engineRef.current.keys.right = false)}
              className="w-20 py-2.5 bg-white/90 active:bg-amber-300 rounded-2xl shadow-md border-2 border-sky-300 text-sky-950 font-black text-xs flex items-center justify-center select-none active:scale-90 transition-transform"
            >
              <span>ขวา</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
