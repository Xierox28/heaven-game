import React, { useState } from "react";
import { X, User, Crown, Sparkles, Check, Award, Trophy } from "lucide-react";
import { PLAYER_AVATARS, PLAYER_TITLES } from "../constants/gameData";
import { sound } from "../utils/audio";

export default function PlayerProfileModal({ state, isOpen, onClose, onSave }) {
  const [selectedAvatar, setSelectedAvatar] = useState(() => state?.playerAvatar || "avatar_hamster_classic");
  const [selectedTitle, setSelectedTitle] = useState(() => state?.playerTitle || "เด็กเส้นแอดมินดิว 💎");
  const [customTitleInput, setCustomTitleInput] = useState("");

  if (!isOpen) return null;

  const level = state?.level || 1;
  const currentAvatarDef = PLAYER_AVATARS.find((a) => a.id === selectedAvatar) || PLAYER_AVATARS[0];
  const allAvailableTitles = Array.from(new Set([...(state?.unlockedTitles || []), ...PLAYER_TITLES]));

  const handleSave = () => {
    sound.playLevelUp();
    onSave(selectedAvatar, selectedTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-['Itim',sans-serif]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-300 rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center shadow-md text-xl">
              👤
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
                โปรไฟล์ & ฉายาผู้พิทักษ์
              </h2>
              <p className="text-[11px] font-bold text-amber-800">
                ปรับแต่งรูปโปรไฟล์ Avatar และฉายาประจำตัว
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Preview */}
        <div className="my-3 p-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-2xl text-slate-950 border-2 border-white shadow-md flex items-center space-x-3.5">
          <div className="relative w-14 h-14 bg-white rounded-2xl p-1 shadow-inner border-2 border-amber-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={currentAvatarDef.image}
              alt={currentAvatarDef.name}
              className="w-full h-full object-contain pixel-art drop-shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-sm font-black text-white drop-shadow-xs truncate">
                {state?.name || "น้องเฮเว่น"}
              </span>
              {state?.prestige?.rank > 0 && (
                <span className="text-[10px] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full border border-amber-600 shadow-xs animate-pulse">
                  ★{state.prestige.rank} จุติ
                </span>
              )}
              <span className="text-[10px] bg-slate-950/80 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-400">
                Lv.{level}
              </span>
            </div>
            <div className="text-xs font-black text-amber-950 bg-white/90 px-2 py-0.5 rounded-lg border border-white/60 inline-flex items-center space-x-1 mt-1">
              <img
                src="/assets/icons/icon_crown.png"
                alt="Title"
                className="w-3.5 h-3.5 object-contain pixel-art inline"
              />
              <span>{selectedTitle}</span>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-black text-amber-950 mb-2 flex items-center space-x-1">
              <span>🖼️ เลือกรูปโปรไฟล์ Avatar Pixel Art:</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PLAYER_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => { sound.playClick(); setSelectedAvatar(av.id); }}
                  className={`p-1.5 bg-white rounded-2xl border-2 transition-all flex flex-col items-center cursor-pointer ${
                    selectedAvatar === av.id
                      ? "border-amber-500 ring-2 ring-amber-400 ring-offset-1 scale-105 shadow-md"
                      : "border-amber-200 hover:border-amber-400"
                  }`}
                  title={av.name}
                >
                  <img
                    src={av.image}
                    alt={av.name}
                    className="w-10 h-10 object-contain pixel-art drop-shadow-xs"
                  />
                  <span className="text-[8px] font-black text-amber-900 truncate w-full text-center mt-1">
                    {av.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Selector */}
          <div>
            <label className="text-xs font-black text-amber-950 mb-2 flex items-center space-x-1">
              <img
                src="/assets/icons/icon_crown.png"
                alt="Crown"
                className="w-4 h-4 object-contain pixel-art inline"
              />
              <span>เลือกฉายาประจำตัว (Title):</span>
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {allAvailableTitles.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { sound.playClick(); setSelectedTitle(t); }}
                  className={`w-full p-2 rounded-xl text-left text-xs font-black border transition-all flex items-center justify-between cursor-pointer ${
                    selectedTitle === t
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-white hover:bg-amber-50 border-amber-200 text-amber-950"
                  }`}
                >
                  <span>{t}</span>
                  {selectedTitle === t && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              ))}
            </div>

            {/* Custom Title Input */}
            <div className="mt-2.5 pt-2 border-t border-amber-200/80">
              <label className="text-[11px] font-black text-amber-900 block mb-1">
                ✏️ หรือพิมพ์ฉายาตามใจชอบ:
              </label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  maxLength={28}
                  value={customTitleInput}
                  onChange={(e) => setCustomTitleInput(e.target.value)}
                  placeholder="เช่น คนรักแฮมสเตอร์เบอร์ 1 ✨..."
                  className="flex-1 bg-white border border-amber-300 rounded-xl px-2.5 py-1 text-xs text-amber-950 font-bold focus:outline-hidden focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customTitleInput.trim()) {
                      sound.playClick();
                      setSelectedTitle(customTitleInput.trim());
                    }
                  }}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  ใช้
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-3 border-t border-amber-200 mt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>บันทึกโปรไฟล์ & ฉายา</span>
          </button>
        </div>
      </div>
    </div>
  );
}
