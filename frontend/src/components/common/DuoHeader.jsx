import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Gem, Heart, Volume2, VolumeX, Plus } from "lucide-react";
import { useGamification } from "../../context/GamificationContext";
import { useAuth } from "../../hooks/useAuth";

export default function DuoHeader({ currentLang, onLangChange, availableLangs = [] }) {
  const { user } = useAuth();
  const { streak, gems, hearts, maxHearts, soundActive, toggleSound, refillHearts } =
    useGamification();

  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const flagMap = {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
    hi: "🇮🇳",
  };

  const langNames = {
    en: "English",
    es: "Español",
    fr: "Français",
    hi: "हिन्दी",
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-2 border-duo-gray px-4 py-2.5 flex items-center justify-between">
        {/* Left: Language Selector */}
        <div className="flex items-center gap-2">
          {availableLangs.length > 0 ? (
            <div className="flex items-center gap-1 bg-slate-50 border-2 border-duo-gray rounded-2xl px-2.5 py-1">
              <span className="text-lg">{flagMap[currentLang] || "🌐"}</span>
              <select
                value={currentLang}
                onChange={(e) => onLangChange && onLangChange(e.target.value)}
                className="bg-transparent text-xs font-black uppercase text-duo-dark focus:outline-none cursor-pointer"
              >
                <option value="">All Languages</option>
                {availableLangs.map((lang) => (
                  <option key={lang} value={lang}>
                    {flagMap[lang] || ""} {langNames[lang] || lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-black text-sm text-amber-500 tracking-wide">
              <span>🐧</span>
              <span className="hidden sm:inline">DUOSPEECH</span>
            </div>
          )}
        </div>

        {/* Right: Gamification Badges */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundActive ? "Mute sounds" : "Enable sounds"}
            className="p-1.5 rounded-xl text-slate-400 hover:text-duo-dark hover:bg-slate-100 transition"
          >
            {soundActive ? <Volume2 className="w-5 h-5 text-duo-blue" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Streak Badge */}
          <button
            onClick={() => setShowStreakModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl hover:bg-orange-50 transition group"
            title="Current Streak"
          >
            <Flame className="w-6 h-6 text-duo-orange fill-duo-orange animate-bounce-short" />
            <span className="font-black text-sm text-duo-orange">{streak}</span>
          </button>

          {/* Gems Badge */}
          <Link
            to="/shop"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl hover:bg-blue-50 transition"
            title="Gems (Click for Shop)"
          >
            <Gem className="w-5 h-5 text-duo-blue fill-duo-blue" />
            <span className="font-black text-sm text-duo-blue">{gems}</span>
          </Link>

          {/* Hearts Badge */}
          <button
            onClick={() => setShowHeartModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl hover:bg-red-50 transition"
            title="Hearts (Health)"
          >
            <Heart
              className={`w-5 h-5 ${
                hearts > 0 ? "text-duo-red fill-duo-red" : "text-slate-300 fill-slate-200"
              }`}
            />
            <span
              className={`font-black text-sm ${hearts > 0 ? "text-duo-red" : "text-slate-400"}`}
            >
              {hearts}
            </span>
            {hearts < maxHearts && (
              <span className="bg-duo-red text-white text-[10px] rounded-full p-0.5">
                <Plus className="w-2.5 h-2.5" />
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hearts Modal */}
      {showHeartModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-duo-gray max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-duo-red fill-duo-red animate-pulse" />
            </div>

            <h3 className="text-xl font-black text-duo-dark">Hearts Keep You Practicing!</h3>
            <p className="text-sm text-duo-neutral font-medium">
              You have <strong className="text-duo-red">{hearts} of 5</strong> hearts remaining.
              Hearts protect your speech lessons.
            </p>

            <div className="flex justify-center gap-2 py-2">
              {[...Array(maxHearts)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-7 h-7 ${
                    i < hearts ? "text-duo-red fill-duo-red" : "text-slate-200 fill-slate-100"
                  }`}
                />
              ))}
            </div>

            <div className="space-y-2 pt-2">
              {hearts < maxHearts ? (
                <button
                  onClick={() => {
                    refillHearts();
                    setShowHeartModal(false);
                  }}
                  className="w-full btn-duo-green"
                >
                  Refill to Full (50 Gems)
                </button>
              ) : (
                <div className="bg-green-50 text-duo-green-dark text-xs font-bold py-2 rounded-xl">
                  Your hearts are fully charged!
                </div>
              )}

              <button
                onClick={() => setShowHeartModal(false)}
                className="w-full btn-duo-gray"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-duo-gray max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
              <Flame className="w-10 h-10 text-duo-orange fill-duo-orange animate-bounce-short" />
            </div>

            <h3 className="text-xl font-black text-duo-dark">{streak} Day Streak!</h3>
            <p className="text-sm text-duo-neutral font-medium">
              You are building a lifelong speech habit! Practice every day to keep your flame glowing.
            </p>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 flex items-center justify-between text-left">
              <div>
                <p className="text-xs font-black uppercase text-duo-orange">Habit Tracker</p>
                <p className="text-xs text-duo-dark font-bold">1 speech lesson daily keeps fluency sharp</p>
              </div>
              <span className="text-2xl">🔥</span>
            </div>

            <button
              onClick={() => setShowStreakModal(false)}
              className="w-full btn-duo-orange"
            >
              Keep It Up!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
