import React, { useState, useEffect } from "react";
import { Heart, Sparkles, MessageCircle } from "lucide-react";

// Mood → animation class map
const MOOD_ANIMATIONS = {
  excited:  "animate-excited-dance",
  happy:    "animate-cute-bounce",
  neutral:  "animate-cute-breathe",
  sad:      "animate-sad-droop",
  angry:    "animate-angry-shake",
  sick:     "animate-sick-wobble",
  eating:   "animate-eat-munch",
  petting:  "animate-pet-shimmer",
  sleeping: "animate-sleep-breathe",
  dirty:    "animate-cute-breathe",
};

// Mood → overlay color / effect
const MOOD_TINT = {
  sad:    "sepia-[0.3] brightness-90 saturate-75",
  angry:  "hue-rotate-[-20deg] saturate-150",
  sick:   "sepia-[0.5] brightness-85",
  dirty:  "brightness-90 sepia-[0.3]",
};

export default function HamsterCharacter({ state, onPet }) {
  const { isSleeping, actionState, cleanliness, poopCount, equipped = {}, speechBubble, mood = "happy" } = state;

  const [petHearts, setPetHearts] = useState([]);
  const [floatingStars, setFloatingStars] = useState([]);
  const [tears, setTears] = useState([]);
  const [angryPuffs, setAngryPuffs] = useState([]);
  const [bubbleVisible, setBubbleVisible] = useState(true);

  // ---- Speech Bubble visibility ----
  useEffect(() => {
    if (!speechBubble?.text) return;
    setBubbleVisible(true);
    const t = setTimeout(() => setBubbleVisible(false), speechBubble.duration || 6000);
    return () => clearTimeout(t);
  }, [speechBubble?.timestamp, speechBubble?.text]);

  // ---- Mood-based ambient particles ----
  useEffect(() => {
    if (mood === "sad" && !isSleeping) {
      const interval = setInterval(() => {
        const tear = { id: Date.now() + Math.random(), x: 38 + Math.random() * 20 };
        setTears((prev) => [...prev.slice(-3), tear]);
        setTimeout(() => setTears((prev) => prev.filter((t) => t.id !== tear.id)), 1000);
      }, 1500);
      return () => clearInterval(interval);
    }
    if (mood === "angry" && !isSleeping) {
      const interval = setInterval(() => {
        const puff = { id: Date.now() + Math.random(), side: Math.random() > 0.5 ? "left" : "right" };
        setAngryPuffs((prev) => [...prev.slice(-3), puff]);
        setTimeout(() => setAngryPuffs((prev) => prev.filter((p) => p.id !== puff.id)), 800);
      }, 700);
      return () => clearInterval(interval);
    }
    if (mood === "excited" && !isSleeping) {
      const interval = setInterval(() => {
        const star = { id: Date.now() + Math.random(), x: 20 + Math.random() * 60 };
        setFloatingStars((prev) => [...prev.slice(-5), star]);
        setTimeout(() => setFloatingStars((prev) => prev.filter((s) => s.id !== star.id)), 1200);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [mood, isSleeping]);

  const handleHamsterClick = (e) => {
    if (isSleeping) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const heart = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left + (Math.random() * 20 - 10),
      y: e.clientY - rect.top + (Math.random() * 20 - 10),
    };
    setPetHearts((prev) => [...prev, heart]);
    setTimeout(() => setPetHearts((prev) => prev.filter((h) => h.id !== heart.id)), 1200);
    if (onPet) onPet();
  };

  const isEating = actionState === "eating";
  const isPetting = actionState === "petting";

  let animClass = MOOD_ANIMATIONS[mood] || "animate-cute-breathe";
  if (isSleeping) animClass = "animate-sleep-breathe";
  if (isEating) animClass = "animate-eat-munch";
  if (isPetting) animClass = "animate-pet-shimmer";

  const tintClass = MOOD_TINT[mood] || "";
  const sleepTint = isSleeping ? "brightness-70 saturate-50" : "";

  return (
    <div className="relative flex flex-col items-center justify-center select-none pt-2">
      {/* ============================================================
          1. SPEECH BUBBLE (อยู่เหนือน้องอย่างพอดี คมชัด 100% ไม่ตกขอบ)
      ============================================================ */}
      {bubbleVisible && speechBubble?.text && (
        <div className="relative mb-2 z-30 max-w-[280px] sm:max-w-xs animate-slide-in-down">
          <div className="relative bg-white text-slate-900 font-black text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-xl border-2 border-amber-400 text-center flex items-center space-x-1.5">
            <span className="text-amber-500 text-sm flex-shrink-0">💬</span>
            <span className="leading-snug block flex-1 text-slate-950 font-extrabold">{speechBubble.text}</span>
          </div>
          {/* Speech bubble tail pointing down */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-amber-400"></div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-white"></div>
        </div>
      )}

      {/* ============================================================
          2. MOOD PARTICLES — Zzz / Tears / Angry Puffs / Stars
      ============================================================ */}
      {isSleeping && (
        <div className="absolute top-2 right-8 z-20 pointer-events-none space-y-0">
          {["Z", "z", "z"].map((z, i) => (
            <div
              key={i}
              className="text-indigo-400 font-black leading-none animate-[floatZzz_2.5s_ease-in-out_infinite]"
              style={{ fontSize: `${18 - i * 4}px`, animationDelay: `${i * 0.7}s` }}
            >
              {z}
            </div>
          ))}
        </div>
      )}

      {tears.map((tear) => (
        <div
          key={tear.id}
          className="absolute z-25 pointer-events-none text-sky-400 text-xs animate-[floatTear_1s_ease-in_forwards]"
          style={{ left: `${tear.x}%`, top: "60%" }}
        >
          💧
        </div>
      ))}

      {angryPuffs.map((puff) => (
        <div
          key={puff.id}
          className="absolute z-25 pointer-events-none animate-[floatAngryPuff_0.8s_ease-out_forwards]"
          style={{ [puff.side]: "-8px", top: "20%" }}
        >
          <span className="text-red-500 font-black text-sm">💢</span>
        </div>
      ))}

      {floatingStars.map((star) => (
        <div
          key={star.id}
          className="absolute z-25 pointer-events-none animate-[floatStar_1.2s_ease-out_forwards] text-yellow-400"
          style={{ left: `${star.x}%`, top: "20%" }}
        >
          ✨
        </div>
      ))}

      {petHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute z-40 pointer-events-none animate-[floatHeart_1.2s_ease-out_forwards]"
          style={{ left: heart.x, top: heart.y }}
        >
          <Heart className="w-5 h-5 fill-pink-500 stroke-pink-700 drop-shadow" />
        </div>
      ))}

      {(mood === "dirty" || cleanliness < 45 || poopCount > 1) && !isSleeping && (
        <div className="absolute top-6 left-2 z-20 flex items-center space-x-0.5 animate-wiggle pointer-events-none">
          <span className="text-lg">🪰</span>
          <span className="text-[10px] bg-amber-900 text-amber-100 px-2 py-0.5 rounded-full font-black shadow-xs">
            มอมแมม~
          </span>
        </div>
      )}

      {(mood === "happy" || mood === "excited") && !isSleeping && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none text-yellow-500 animate-pulse-glow">
          <Sparkles className="w-5 h-5 fill-amber-400" />
        </div>
      )}

      {/* ============================================================
          3. HAMSTER BODY + WARDROBE LAYERS
      ============================================================ */}
      <div
        onClick={handleHamsterClick}
        className={`relative cursor-pointer transition-all duration-300 active:scale-90 group ${animClass}`}
        title="กดที่น้องเพื่อลูบหัว"
      >
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-44 h-8 bg-amber-950/20 rounded-full blur-sm pointer-events-none"></div>

        <div className="relative w-52 h-36 sm:w-60 sm:h-40 flex items-center justify-center">
          <img
            src="/assets/heaven-hamster.png"
            alt="Nong Heaven Hamster"
            className={`w-full h-full object-contain pixel-art filter drop-shadow-md transition-all duration-500 ${tintClass} ${sleepTint}`}
            draggable="false"
          />

          {/* Blush */}
          <div className="absolute top-[50%] left-[33%] w-5 h-3 bg-pink-400/50 rounded-full blur-[2px] pointer-events-none"></div>
          <div className="absolute top-[48%] right-[31%] w-5 h-3 bg-pink-400/50 rounded-full blur-[2px] pointer-events-none"></div>

          {/* Eyes */}
          {isSleeping && (
            <div className="absolute top-[43%] left-0 right-0 flex justify-center gap-9 pointer-events-none">
              <div className="w-4 h-1 border-b-2 border-slate-700 rounded-full"></div>
              <div className="w-4 h-1 border-b-2 border-slate-700 rounded-full"></div>
            </div>
          )}

          {mood === "sick" && !isSleeping && (
            <div className="absolute top-[40%] left-0 right-0 flex justify-center gap-8 pointer-events-none">
              <div className="text-[12px] font-black text-slate-800">×</div>
              <div className="text-[12px] font-black text-slate-800">×</div>
            </div>
          )}

          {mood === "angry" && !isSleeping && (
            <div className="absolute top-[32%] left-0 right-0 flex justify-center gap-7 pointer-events-none">
              <div className="w-5 h-1 bg-slate-800 rounded-full rotate-[20deg]"></div>
              <div className="w-5 h-1 bg-slate-800 rounded-full rotate-[-20deg]"></div>
            </div>
          )}

          {/* ---- WARDROBE LAYERS ---- */}

          {/* OUTFIT: CLOUD PAJAMAS (Season 1 Gold Pass Master) */}
          {equipped.outfit === "cloud_pajamas" && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-44 z-10 pointer-events-none filter drop-shadow">
              <div className="bg-gradient-to-r from-sky-200 via-indigo-100 to-sky-200 border-2 border-white rounded-3xl h-12 flex items-center justify-around px-2 shadow-inner">
                <span className="text-xs">☁️</span>
                <span className="text-[9px] font-black text-sky-800 tracking-wider uppercase bg-white/70 px-2 py-0.5 rounded-full">
                  CLOUD 💤
                </span>
                <span className="text-xs">☁️</span>
              </div>
            </div>
          )}

          {/* OUTFIT: HOODIE */}
          {equipped.outfit === "hoodie_special" && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-40 z-10 pointer-events-none filter drop-shadow">
              <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 border-2 border-white rounded-3xl h-11 flex items-center justify-around px-3 shadow-inner">
                <span className="text-[9px] font-black text-white tracking-widest uppercase bg-white/40 px-2 py-0.5 rounded-full">HEAVEN ♡</span>
              </div>
            </div>
          )}

          {equipped.outfit === "cute_bib" && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="bg-yellow-200 border-2 border-amber-400 text-amber-800 text-xs px-3 py-1 rounded-b-2xl shadow-sm flex items-center space-x-1">
                <span>⭐</span><span className="font-bold text-[9px]">BABY</span>
              </div>
            </div>
          )}

          {equipped.outfit === "cape_hero" && (
            <div className="absolute top-8 -left-1 z-0 pointer-events-none rotate-12">
              <div className="w-10 h-16 bg-rose-500 rounded-b-2xl shadow-md border-r-2 border-rose-700"></div>
            </div>
          )}

          {/* ACCESSORY */}
          {equipped.accessory === "red_bow" && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-2xl animate-pulse filter drop-shadow">🎀</div>
          )}
          {equipped.accessory === "bell_collar" && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-5 h-5 flex items-center justify-center">
              <div className="bg-amber-400 border border-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow animate-bounce">🔔</div>
            </div>
          )}
          {equipped.accessory === "star_badge" && (
            <div className="absolute bottom-7 left-[35%] z-10 pointer-events-none text-yellow-400 text-lg drop-shadow">⭐</div>
          )}

          {/* HAT: UNICORN HAT (7-Day Streak Master) */}
          {equipped.hat === "unicorn_hat" && (
            <div className="absolute -top-7 left-[45%] -translate-x-1/2 z-20 pointer-events-none filter drop-shadow-md flex flex-col items-center">
              {/* Magic Horn */}
              <div className="w-3 h-6 bg-gradient-to-t from-yellow-300 via-pink-400 to-indigo-400 rounded-t-full border border-yellow-500 rotate-[12deg] shadow-xs"></div>
              {/* Ears with flowers */}
              <div className="flex space-x-4 -mt-2">
                <span className="text-xs">🌸</span>
                <span className="text-xs">🦄</span>
                <span className="text-xs">🌸</span>
              </div>
            </div>
          )}

          {/* HAT: STAR GLASSES (Gold Pass) */}
          {equipped.hat === "star_glasses" && (
            <div className="absolute top-[41%] left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center space-x-1 filter drop-shadow animate-pulse">
              <span className="text-xl">⭐</span>
              <div className="w-2 h-0.5 bg-yellow-600"></div>
              <span className="text-xl">⭐</span>
            </div>
          )}

          {equipped.hat === "frog_hat" && (
            <div className="absolute -top-5 left-[44%] -translate-x-1/2 z-20 pointer-events-none filter drop-shadow-md">
              <div className="flex flex-col items-center">
                <div className="flex space-x-3 mb-[-5px]">
                  {[0, 1].map((i) => (
                    <div key={i} className="w-4 h-4 bg-emerald-500 rounded-full border border-emerald-700 flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-20 h-7 bg-emerald-400 border-2 border-emerald-600 rounded-t-full shadow-sm"></div>
              </div>
            </div>
          )}

          {equipped.hat === "sunglasses" && (
            <div className="absolute top-[41%] left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center space-x-1 filter drop-shadow">
              <div className="w-7 h-4 bg-slate-900 rounded-sm border border-slate-600 shadow-sm"></div>
              <div className="w-2 h-0.5 bg-slate-800"></div>
              <div className="w-7 h-4 bg-slate-900 rounded-sm border border-slate-600 shadow-sm"></div>
            </div>
          )}

          {equipped.hat === "flower_crown" && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-base whitespace-nowrap">🌸🌼🌺🌸</div>
          )}

          {equipped.hat === "party_hat" && (
            <div className="absolute -top-7 left-[46%] -translate-x-1/2 z-20 pointer-events-none text-3xl rotate-12">🎉</div>
          )}

          {/* Eating bowl */}
          {isEating && (
            <div className="absolute bottom-0 right-6 z-20 pointer-events-none animate-bounce flex items-center">
              <span className="text-3xl">🥣</span>
              <span className="absolute -top-2 -right-1 text-xs">✨</span>
            </div>
          )}
        </div>
      </div>

      {/* Hint label */}
      <div className="mt-2 pointer-events-none">
        <p className="text-xs text-amber-900 font-bold bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-xs inline-block border border-amber-200">
          {isSleeping ? "💤 น้องกำลังหลับสบาย... พลังงานกำลังฟื้นฟู" : "👆 กดที่ตัวน้องเพื่อลูบหัวเล่นด้วยกัน"}
        </p>
      </div>
    </div>
  );
}
