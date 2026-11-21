import React, { useState, useEffect } from "react";
import { Heart, Sparkles, MessageCircle } from "lucide-react";
import { WARDROBE_ITEMS, HAMSTER_BREEDS, PERSONALITIES, BUDDY_PETS } from "../constants/gameData";

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

  // v6.0 Hamster Interactive Trick Animations
  if (state.trickState?.type === "toss_seed") {
    animClass = "animate-bounce";
  } else if (state.trickState?.type === "tickle") {
    animClass = "animate-tickle-roll";
  } else if (state.trickState?.type === "spin_wings") {
    animClass = "animate-spin-360";
  }

  const tintClass = MOOD_TINT[mood] || "";
  const sleepTint = isSleeping ? "brightness-70 saturate-50" : "";
  const floorOffset = state.currentFloor === 2 ? "-translate-y-10 sm:-translate-y-14" : "translate-y-0";

  return (
    <div className={`relative flex flex-col items-center justify-center select-none pt-2 transition-transform duration-500 ease-out ${floorOffset}`}>
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
          3. HAMSTER BODY + BREED + GROWTH STAGE (EXACT 16:9 FIT)
      ============================================================ */}
      {(() => {
        const breedId = state.breed || "winter_white";
        const breedImg = `/assets/breeds/${breedId}.png`;
        const level = state.level || 1;
        const stage = level >= 25 ? "adult" : level >= 10 ? "junior" : "baby";
        const stageScale = stage === "adult" ? "scale-[1.06]" : stage === "junior" ? "scale-100" : "scale-[0.88]";
        const personalityId = state.personality || "affectionate";
        const pDef = PERSONALITIES.find((p) => p.id === personalityId);

        return (
          <div
            onClick={handleHamsterClick}
            className={`relative cursor-pointer transition-all duration-300 active:scale-95 group pointer-events-auto select-none ${animClass} ${stageScale}`}
            title="กดที่น้องเพื่อลูบหัว"
          >
            {/* เงาใต้น้อง */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-7 bg-amber-950/20 rounded-full blur-sm pointer-events-none"></div>

            {/* กล่องบรรจุตัวน้อง 16:9 อัตราส่วนตรงกับภาพ 1024x576 เป๊ะๆ */}
            <div className="relative w-64 sm:w-72 aspect-[16/9] flex items-center justify-center">
            {/* ============================================================
                4. WARDROBE LAYERS (แยกปีกไว้ข้างหลังตัวน้องอย่างเด็ดขาด)
            ============================================================ */}
            {(() => {
              const rawEquipped = Array.isArray(equipped)
                ? equipped
                : Object.values(equipped || {}).filter(Boolean);

              const offsets = state.wardrobeOffsets || {};
              const wingsList = rawEquipped.filter((id) => WARDROBE_ITEMS.find((w) => w.id === id)?.type === "wings");
              const frontList = rawEquipped.filter((id) => WARDROBE_ITEMS.find((w) => w.id === id)?.type !== "wings");

              const layerOrder = { outfit: 1, accessory: 2, hat: 3 };
              frontList.sort((a, b) => {
                const typeA = WARDROBE_ITEMS.find((w) => w.id === a)?.type || "outfit";
                const typeB = WARDROBE_ITEMS.find((w) => w.id === b)?.type || "outfit";
                return (layerOrder[typeA] || 1) - (layerOrder[typeB] || 1);
              });

              return (
                <>
                  {/* 🪽 WINGS LAYER — อยู่ข้างหลังตัวน้องอย่างเด็ดขาด (z-0) ไม่บังหน้า/หู */}
                  {wingsList.map((itemId) => {
                    const itemDef = WARDROBE_ITEMS.find((w) => w.id === itemId);
                    const offset = offsets[itemId] || { x: 0, y: 0, scale: 1.15 };
                    return (
                      <img
                        key={itemId}
                        src={`/assets/wardrobe/${itemId}.png`}
                        alt={itemId}
                        className="absolute inset-0 w-full h-full object-contain pixel-art pointer-events-none filter drop-shadow-sm select-none z-0 animate-wing-flap"
                        style={{
                          transform: `translate(${offset.x || 0}%, ${(offset.y || 0) - 6}%) scale(${offset.scale || 1.15})`,
                          transformOrigin: "50% 55%",
                          transition: "transform 0.15s ease-out",
                        }}
                        draggable="false"
                      />
                    );
                  })}

                  {/* 🐹 HAMSTER BODY — อยู่หน้าปีก (relative z-10) */}
                  <img
                    src={breedImg}
                    onError={(e) => { e.currentTarget.src = "/assets/heaven-hamster.png"; }}
                    alt="Hamster Character"
                    className={`relative z-10 w-full h-full object-contain pixel-art filter drop-shadow-md transition-all duration-500 ${tintClass} ${sleepTint}`}
                    draggable="false"
                  />

                  {/* แก้มแดง (Blush) ตรงตำแหน่งแก้มทั้งสองข้าง (z-15) */}
                  <div className="absolute top-[64%] left-[34%] z-15 w-4 h-2.5 bg-pink-400/50 rounded-full blur-[2px] pointer-events-none"></div>
                  <div className="absolute top-[66%] left-[59%] z-15 w-4 h-2.5 bg-pink-400/50 rounded-full blur-[2px] pointer-events-none"></div>

                  {/* Personality Icon Floater (z-25) ชิดข้างหัวน้อง ไม่ลอยออกไปบังปุ่มด้านข้าง */}
                  {pDef && !isSleeping && (
                    <div className="absolute top-2 right-12 z-25 pointer-events-none text-xs bg-white/90 border border-amber-300 rounded-full w-5 h-5 flex items-center justify-center shadow-xs animate-bounce">
                      {pDef.icon}
                    </div>
                  )}

                  {/* ดวงตาตอนหลับ (Sleeping Eyes) (z-15) */}
                  {isSleeping && (
                    <>
                      <div className="absolute top-[60.5%] left-[40.5%] z-15 w-3.5 h-1 border-b-2 border-slate-700 rounded-full pointer-events-none"></div>
                      <div className="absolute top-[62.5%] left-[52.5%] z-15 w-3.5 h-1 border-b-2 border-slate-700 rounded-full pointer-events-none"></div>
                    </>
                  )}

                  {/* ดวงตาตอนป่วย (Sick Eyes) (z-15) */}
                  {mood === "sick" && !isSleeping && (
                    <>
                      <div className="absolute top-[57%] left-[41%] z-15 text-[10px] font-black text-slate-800 pointer-events-none">×</div>
                      <div className="absolute top-[59%] left-[53%] z-15 text-[10px] font-black text-slate-800 pointer-events-none">×</div>
                    </>
                  )}

                  {/* คิ้วตอนโกรธ (Angry Eyebrows) (z-15) */}
                  {mood === "angry" && !isSleeping && (
                    <>
                      <div className="absolute top-[55%] left-[39%] z-15 w-4 h-1 bg-slate-800 rounded-full rotate-[20deg] pointer-events-none"></div>
                      <div className="absolute top-[57%] left-[51%] z-15 w-4 h-1 bg-slate-800 rounded-full rotate-[-20deg] pointer-events-none"></div>
                    </>
                  )}

                  {/* 👗 FRONT WARDROBE — หมวก, แว่น, โบว์, เสื้อผ้า (z-20 / z-25) อยู่หน้าตัวน้อง */}
                  {frontList.map((itemId) => {
                    const itemDef = WARDROBE_ITEMS.find((w) => w.id === itemId);
                    const isAccessory = itemDef?.type === "accessory";
                    const isHat = itemDef?.type === "hat";
                    const zClass = isHat ? "z-25" : isAccessory ? "z-20" : "z-16";
                    let anim = "";
                    if (itemId === "bell_collar") anim = "animate-bounce";
                    else if (itemId === "star_glasses") anim = "animate-pulse";
                    const offset = offsets[itemId] || { x: 0, y: 0, scale: 1.0 };

                    return (
                      <img
                        key={itemId}
                        src={`/assets/wardrobe/${itemId}.png`}
                        alt={itemId}
                        className={`absolute inset-0 w-full h-full object-contain pixel-art pointer-events-none filter drop-shadow-sm select-none ${zClass} ${anim}`}
                        style={{
                          transform: `translate(${offset.x || 0}%, ${offset.y || 0}%) scale(${offset.scale || 1.0})`,
                          transformOrigin: isHat ? "50% 25%" : isAccessory ? "50% 70%" : "50% 50%",
                          transition: "transform 0.15s ease-out",
                        }}
                        draggable="false"
                      />
                    );
                  })}
                </>
              );
            })()}

          {/* Eating bowl */}
          {isEating && (
            <div className="absolute top-[68%] left-[50%] z-20 pointer-events-none animate-bounce flex items-center">
              <span className="text-2xl sm:text-3xl">🥣</span>
              <span className="absolute -top-1.5 -right-1 text-xs">✨</span>
            </div>
          )}

          {/* v6.0 Flying Seed on Toss Seed Trick */}
          {state.trickState?.type === "toss_seed" && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-seed-toss">
              <img src="/assets/props/flying_seed.png" alt="Flying Seed" className="w-8 h-8 object-contain pixel-art drop-shadow-md" />
            </div>
          )}

          {/* v6.0 Mini Buddy Pet ROAMING across cage */}
          {(() => {
            const buddyDef = BUDDY_PETS.find((b) => b.id === state.equippedBuddy);
            if (!buddyDef) return null;
            return (
              <div className="absolute -bottom-2 z-35 pointer-events-none flex flex-col items-center animate-buddy-roam" style={{ right: "12%" }}>
                <div className="animate-cute-bounce flex flex-col items-center">
                  <img
                    src={buddyDef.image}
                    alt={buddyDef.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain pixel-art drop-shadow-md select-none"
                  />
                  <span className="text-[8px] font-black bg-white/90 text-slate-800 px-1 rounded-full border border-amber-300 shadow-2xs mt-0.5">
                    {buddyDef.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* v5.0 Active Buff Badge */}
          {state.activeBuffs?.doubleCoinUntil > Date.now() && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-35 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-md animate-pulse border border-yellow-200 flex items-center space-x-1">
              <span>🔥 บัฟเหรียญ x2</span>
            </div>
          )}
        </div>
      </div>
    );
  })()}

      {/* Hint label & Growth stage badge */}
      {(() => {
        const level = state.level || 1;
        const stageBadge = level >= 25 ? "👑 วัยโตเต็มวัย" : level >= 10 ? "🏃 วัยรุ่น" : "🍼 วัยเบบี้";
        const breedDef = HAMSTER_BREEDS.find((b) => b.id === state.breed);
        const pDef = PERSONALITIES.find((p) => p.id === state.personality);

        return (
          <div className="mt-2 pointer-events-none flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-300 font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                {stageBadge}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                {breedDef?.name?.split(" ")[0] || "วินเทอร์ไวท์"}
              </span>
              {pDef && (
                <span className="text-[10px] bg-pink-100 text-pink-900 border border-pink-300 font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  {pDef.icon} {pDef.name}
                </span>
              )}
            </div>
            <p className="text-xs text-amber-900 font-bold bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-xs inline-block border border-amber-200">
              {isSleeping ? "💤 น้องกำลังหลับสบาย... พลังงานกำลังฟื้นฟู" : "👆 กดที่ตัวน้องเพื่อลูบหัวเล่นด้วยกัน"}
            </p>
          </div>
        );
      })()}
    </div>
  );
}
