import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { sound } from "../utils/audio";

export default function SeedRainOverlay({ isActive, onCollect, onEnd }) {
  const [seeds, setSeeds] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setSeeds([]);
      return;
    }

    // สร้างเมล็ดฝนตกต่อเนื่องเป็นเวลา 15 วินาที
    const interval = setInterval(() => {
      const newSeed = {
        id: Date.now() + Math.random(),
        left: Math.random() * 85 + 5, // 5% - 90% ของหน้าจอ
        speed: 3 + Math.random() * 2,  // 3s - 5s
        size: 28 + Math.random() * 16,
        collected: false,
      };
      setSeeds((prev) => [...prev.slice(-30), newSeed]);
    }, 450);

    const endTimer = setTimeout(() => {
      if (onEnd) onEnd();
    }, 16000);

    return () => {
      clearInterval(interval);
      clearTimeout(endTimer);
    };
  }, [isActive]);

  const handleSeedClick = (id) => {
    setSeeds((prev) =>
      prev.map((s) => (s.id === id ? { ...s, collected: true } : s))
    );
    if (onCollect) onCollect();
  };

  if (!isActive && seeds.length === 0) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {/* Banner แจ้งเตือนอีเวนต์ฝนตก */}
      {isActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-auto bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-full shadow-lg border-2 border-white flex items-center space-x-2 animate-bounce">
          <img
            src="/assets/icons/icon_seed.png"
            alt="Seeds"
            className="w-5 h-5 object-contain pixel-art animate-spin"
          />
          <span className="text-xs sm:text-sm">ฝนเมล็ดทานตะวัน! รีบแตะเพื่อเก็บเหรียญ (+5)!</span>
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* เมล็ดทานตะวันที่กำลังตกลงมา */}
      {seeds.map((seed) => {
        if (seed.collected) return null;
        return (
          <div
            key={seed.id}
            onClick={() => handleSeedClick(seed.id)}
            className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-125 active:scale-90 select-none animate-[fallDown_linear_forwards]"
            style={{
              left: `${seed.left}%`,
              animationDuration: `${seed.speed}s`,
              fontSize: `${seed.size}px`,
            }}
          >
            <div className="filter drop-shadow-md transform -rotate-12 hover:rotate-12 transition-transform">
              <img
                src="/assets/icons/icon_seed.png"
                alt="Seed"
                className="w-8 h-8 object-contain pixel-art drop-shadow"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
