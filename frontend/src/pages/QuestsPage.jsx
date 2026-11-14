import React from "react";
import { Target, Gift, Check, Sparkles, Award } from "lucide-react";
import confetti from "canvas-confetti";
import DuoSidebar from "../components/common/DuoSidebar";
import DuoHeader from "../components/common/DuoHeader";
import DuoMascot from "../components/mascot/DuoMascot";
import { useGamification } from "../context/GamificationContext";
import { playChestSound, playClickSound } from "../utils/soundEffects";

export default function QuestsPage() {
  const { dailyQuests, claimQuestReward } = useGamification();

  const quests = [
    {
      id: "quest-lessons",
      title: "Vocal Warmup",
      description: "Complete 2 speech therapy exercises today",
      current: Math.min(2, dailyQuests.lessonsDone),
      target: 2,
      rewardGems: 20,
      icon: "🎙️",
    },
    {
      id: "quest-accuracy",
      title: "Precision Speaker",
      description: "Score 80%+ pronunciation accuracy on any exercise",
      current: dailyQuests.targetAccuracyHit ? 1 : 0,
      target: 1,
      rewardGems: 25,
      icon: "🎯",
    },
    {
      id: "quest-xp",
      title: "Daily XP Goal",
      description: "Earn 30 speech experience points today",
      current: Math.min(30, dailyQuests.dailyXp),
      target: 30,
      rewardGems: 30,
      icon: "⚡",
    },
  ];

  const handleClaim = (quest) => {
    playClickSound();
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.6 },
    });
    claimQuestReward(quest.id, quest.rewardGems);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row select-none">
      <DuoSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <DuoHeader />

        <main className="max-w-xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                Daily Goals
              </span>
              <h1 className="text-2xl font-black">Daily Speech Quests</h1>
              <p className="text-xs font-bold text-white/90">
                Complete quests daily to earn gems and boost speaking fluency!
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🎯
            </div>
          </div>

          {/* Quests List */}
          <div className="space-y-4">
            {quests.map((quest) => {
              const isFinished = quest.current >= quest.target;
              const isClaimed = dailyQuests.claimed.includes(quest.id);
              const progressPct = Math.round((quest.current / quest.target) * 100);

              return (
                <div
                  key={quest.id}
                  className="bg-white border-2 border-duo-gray rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-xs border border-duo-gray">
                      {quest.icon}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-duo-dark">{quest.title}</h3>
                        <span className="text-xs font-black text-duo-neutral">
                          {quest.current}/{quest.target}
                        </span>
                      </div>
                      <p className="text-xs text-duo-neutral font-medium">{quest.description}</p>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-duo-orange h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Claim Button / Status */}
                  <div className="shrink-0 w-full sm:w-auto">
                    {isClaimed ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-800 px-4 py-2 bg-yellow-50 rounded-2xl border border-duo-yellow-light">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Claimed</span>
                      </div>
                    ) : isFinished ? (
                      <button
                        onClick={() => handleClaim(quest)}
                        className="w-full sm:w-auto btn-duo-yellow text-slate-900 font-black text-xs py-2 px-4 animate-bounce-short"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Claim +{quest.rewardGems} 💎</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-400 px-4 py-2 bg-slate-50 rounded-2xl border border-duo-gray">
                        <Gift className="w-4 h-4" />
                        <span>+{quest.rewardGems} Gems</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Badge Challenge */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-xs border border-purple-200">
              🏅
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-duo-purple">
                Monthly Challenge
              </span>
              <h4 className="text-sm font-black text-duo-dark">Echo's Voice Marathon</h4>
              <p className="text-xs text-duo-neutral font-medium">
                Complete speech practice throughout the month to unlock the Golden Echo Badge.
              </p>
            </div>
          </div>

          {/* Mascot Guidance */}
          <DuoMascot
            mood="idle"
            size="sm"
            message="Consistency is key in speech therapy! Small daily practices produce lasting fluency."
          />
        </main>
      </div>
    </div>
  );
}
