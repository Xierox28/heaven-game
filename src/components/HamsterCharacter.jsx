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
          3. HAMSTER BODY + WARDROBE LAYERS (EXACT 16:9 PROPORTIONAL FIT)
      ============================================================ */}
      <div
        onClick={handleHamsterClick}
        className={`relative cursor-pointer transition-all duration-300 active:scale-95 group ${animClass}`}
        title="กดที่น้องเพื่อลูบหัว"
      >
        {/* เงาใต้น้อง */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-7 bg-amber-950/20 rounded-full blur-sm pointer-events-none"></div>

        {/* กล่องบรรจุตัวน้อง 16:9 อัตราส่วนตรงกับภาพ 1024x576 เป๊ะๆ */}
        <div className="relative w-64 sm:w-72 aspect-[16/9] flex items-center justify-center">
          <img
            src="/assets/heaven-hamster.png"
            alt="Nong Heaven Hamster"
            className={`w-full h-full object-contain pixel-art filter drop-shadow-md transition-all duration-500 ${tintClass} ${sleepTint}`}
            draggable="false"
          />

          {/* แก้มแดง (Blush) ตรงตำแหน่งแก้มทั้งสองข้าง */}
          <div className="absolute top-[64%] left-[34%] w-4 h-2.5 bg-pink-400/50 rounded-full blur-[2px] pointer-events-none"></div>
          <div className="absolute top-[66%] left-[59%] w-4 h-2.5 bg-pink-400/50 rounded-full blur-[2px] pointer-events-none"></div>

          {/* ดวงตาตอนหลับ (Sleeping Eyes) ทับตาจริงพอดิบพอดี */}
          {isSleeping && (
            <>
              <div className="absolute top-[60.5%] left-[40.5%] w-3.5 h-1 border-b-2 border-slate-700 rounded-full pointer-events-none"></div>
              <div className="absolute top-[62.5%] left-[52.5%] w-3.5 h-1 border-b-2 border-slate-700 rounded-full pointer-events-none"></div>
            </>
          )}

          {/* ดวงตาตอนป่วย (Sick Eyes) */}
          {mood === "sick" && !isSleeping && (
            <>
              <div className="absolute top-[57%] left-[41%] text-[10px] font-black text-slate-800 pointer-events-none">×</div>
              <div className="absolute top-[59%] left-[53%] text-[10px] font-black text-slate-800 pointer-events-none">×</div>
            </>
          )}

          {/* คิ้วตอนโกรธ (Angry Eyebrows) */}
          {mood === "angry" && !isSleeping && (
            <>
              <div className="absolute top-[55%] left-[39%] w-4 h-1 bg-slate-800 rounded-full rotate-[20deg] pointer-events-none"></div>
              <div className="absolute top-[57%] left-[51%] w-4 h-1 bg-slate-800 rounded-full rotate-[-20deg] pointer-events-none"></div>
            </>
          )}

          {/* ============================================================
              4. WARDROBE LAYERS (สวมใส่ชุดและไอเทม Pixel Art ของแท้ตรงตำแหน่ง)
          ============================================================ */}

          {/* OUTFIT: ผ้าคลุมฮีโร่สีแดง (พาดจากไหล่ขวาไปด้านหลังลำตัว) */}
          {equipped.outfit === "cape_hero" && (
            <div className="absolute top-[34%] left-[58%] w-14 sm:w-16 z-10 pointer-events-none filter drop-shadow-md rotate-[-6deg]">
              <img
                src="/assets/wardrobe/cape_hero.png"
                alt="Cape Hero"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* OUTFIT: CLOUD PAJAMAS (Season 1 Gold Pass Master) */}
          {equipped.outfit === "cloud_pajamas" && (
            <div className="absolute top-[67%] left-[48%] -translate-x-1/2 w-28 sm:w-32 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/cloud_pajamas.png"
                alt="Cloud Pajamas"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* OUTFIT: HOODIE SPECIAL */}
          {equipped.outfit === "hoodie_special" && (
            <div className="absolute top-[67%] left-[48%] -translate-x-1/2 w-28 sm:w-32 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/hoodie_special.png"
                alt="Special Hoodie"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* OUTFIT: CUTE BIB (ผ้ากันเปื้อนลายดาวใต้คาง) */}
          {equipped.outfit === "cute_bib" && (
            <div className="absolute top-[66%] left-[47.7%] -translate-x-1/2 w-16 sm:w-18 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/cute_bib.png"
                alt="Cute Bib"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* ACCESSORY: RED BOW (โบว์แดงน่ารัก) */}
          {equipped.accessory === "red_bow" && (
            <div className="absolute top-[67%] left-[47.7%] -translate-x-1/2 w-14 sm:w-16 z-20 pointer-events-none filter drop-shadow-sm animate-pulse">
              <img
                src="/assets/wardrobe/red_bow.png"
                alt="Red Bow"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* ACCESSORY: BELL COLLAR (กระดิ่งทอง) */}
          {equipped.accessory === "bell_collar" && (
            <div className="absolute top-[66%] left-[47.7%] -translate-x-1/2 w-14 sm:w-16 z-20 pointer-events-none filter drop-shadow-sm animate-bounce">
              <img
                src="/assets/wardrobe/bell_collar.png"
                alt="Bell Collar"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* ACCESSORY: STAR BADGE (เข็มกลัดดาวประกาย) */}
          {equipped.accessory === "star_badge" && (
            <div className="absolute top-[66%] left-[36%] w-8 sm:w-9 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/star_badge.png"
                alt="Star Badge"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* HAT: FROG HAT (หมวกกบน้อยตาโต สวมบนหัวตรงกะโหลกระหว่างหู) */}
          {equipped.hat === "frog_hat" && (
            <div className="absolute top-[12%] left-[47.5%] -translate-x-1/2 w-18 sm:w-20 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/frog_hat.png"
                alt="Frog Hat"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* HAT: FLOWER CROWN (มงกุฎดอกไม้ สวมบนหน้าผากระหว่างสองหู) */}
          {equipped.hat === "flower_crown" && (
            <div className="absolute top-[32%] left-[47.5%] -translate-x-1/2 w-20 sm:w-22 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/flower_crown.png"
                alt="Flower Crown"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* HAT: PARTY HAT (หมวกปาร์ตี้เอียงน่ารักบนหัว) */}
          {equipped.hat === "party_hat" && (
            <div className="absolute top-[3%] left-[47.5%] -translate-x-1/2 w-12 sm:w-14 z-20 pointer-events-none filter drop-shadow-sm rotate-[6deg]">
              <img
                src="/assets/wardrobe/party_hat.png"
                alt="Party Hat"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* HAT: UNICORN HAT (หมวกยูนิคอร์นสายรุ้ง) */}
          {equipped.hat === "unicorn_hat" && (
            <div className="absolute top-[3%] left-[47.5%] -translate-x-1/2 w-16 sm:w-18 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/unicorn_hat.png"
                alt="Unicorn Hat"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* HAT: SUNGLASSES (แว่นกันแดด สวมตรงตาทั้งสองข้าง) */}
          {equipped.hat === "sunglasses" && (
            <div className="absolute top-[57%] left-[47.7%] -translate-x-1/2 w-16 sm:w-18 z-20 pointer-events-none filter drop-shadow-sm">
              <img
                src="/assets/wardrobe/sunglasses.png"
                alt="Sunglasses"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* HAT: STAR GLASSES (แว่นดาว สวมตรงตาทั้งสองข้าง) */}
          {equipped.hat === "star_glasses" && (
            <div className="absolute top-[53%] left-[47.7%] -translate-x-1/2 w-18 sm:w-20 z-20 pointer-events-none filter drop-shadow-sm animate-pulse">
              <img
                src="/assets/wardrobe/star_glasses.png"
                alt="Star Glasses"
                className="w-full h-auto object-contain pixel-art"
              />
            </div>
          )}

          {/* Eating bowl */}
          {isEating && (
            <div className="absolute top-[68%] left-[50%] z-20 pointer-events-none animate-bounce flex items-center">
              <span className="text-2xl sm:text-3xl">🥣</span>
              <span className="absolute -top-1.5 -right-1 text-xs">✨</span>
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
