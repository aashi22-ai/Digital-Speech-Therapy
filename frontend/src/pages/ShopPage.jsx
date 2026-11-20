import React, { useState } from "react";
import { Gem, Heart, Shield, Zap, Crown, Check, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import DuoSidebar from "../components/common/DuoSidebar";
import DuoHeader from "../components/common/DuoHeader";
import DuoMascot from "../components/mascot/DuoMascot";
import { useGamification } from "../context/GamificationContext";
import { playClickSound, playSuccessSound } from "../utils/soundEffects";

export default function ShopPage() {
  const { gems, hearts, maxHearts, buyShopItem } = useGamification();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inventory, setInventory] = useState({
    streakFreeze: false,
    doubleXp: false,
    trophy: false,
  });

  const shopItems = [
    {
      id: "refill-hearts",
      name: "Full Heart Refill",
      description: "Instantly restore all 5 hearts to continue practicing uninterrupted.",
      cost: 50,
      icon: <Heart className="w-8 h-8 text-duo-red fill-duo-red" />,
      bg: "bg-red-50",
      disabled: hearts >= maxHearts,
      disabledText: "Hearts are already full",
    },
    {
      id: "streak-freeze",
      name: "Streak Freeze",
      description: "Protects your daily streak if you miss a single day of practice.",
      cost: 100,
      icon: <Shield className="w-8 h-8 text-duo-blue fill-duo-blue" />,
      bg: "bg-blue-50",
      disabled: inventory.streakFreeze,
      disabledText: "Equipped (1 active)",
    },
    {
      id: "double-xp",
      name: "Double XP Boost",
      description: "Earn 2x XP for all speech attempts during your next practice session.",
      cost: 80,
      icon: <Zap className="w-8 h-8 text-duo-yellow fill-duo-yellow" />,
      bg: "bg-yellow-50",
      disabled: inventory.doubleXp,
      disabledText: "Active",
    },
    {
      id: "speech-champ",
      name: "Golden Echo Trophy",
      description: "Special badge awarded to speech learners dedicated to mastering articulation.",
      cost: 200,
      icon: <Crown className="w-8 h-8 text-amber-500 fill-amber-400" />,
      bg: "bg-amber-50",
      disabled: inventory.trophy,
      disabledText: "Unlocked",
    },
  ];

  const handlePurchase = async (item) => {
    playClickSound();
    setFeedbackMessage("");
    setErrorMessage("");

    if (gems < item.cost) {
      setErrorMessage("Not enough gems! Practice speech lessons to earn more.");
      return;
    }

    try {
      await buyShopItem(item.id);
      playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
      setFeedbackMessage(`Successfully purchased ${item.name}!`);

      if (item.id === "streak-freeze") setInventory((p) => ({ ...p, streakFreeze: true }));
      if (item.id === "double-xp") setInventory((p) => ({ ...p, doubleXp: true }));
      if (item.id === "speech-champ") setInventory((p) => ({ ...p, trophy: true }));
    } catch (err) {
      setErrorMessage(err.message || "Purchase failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row select-none">
      <DuoSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <DuoHeader />

        <main className="max-w-xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                Duo Speech Store
              </span>
              <h1 className="text-2xl font-black">Speech Shop</h1>
              <p className="text-xs font-bold text-white/90">
                Spend gems earned from lessons on boosts and refills!
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-2 rounded-2xl border border-white/30">
              <Gem className="w-6 h-6 text-white fill-white" />
              <span className="text-lg font-black">{gems}</span>
            </div>
          </div>

          {/* Feedback alerts */}
          {feedbackMessage && (
            <div className="bg-yellow-50 border-2 border-yellow-200 text-amber-900 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 text-duo-red text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Items Grid */}
          <div className="space-y-4">
            {shopItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-duo-gray rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shadow-xs border border-duo-gray shrink-0`}
                  >
                    {item.icon}
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-duo-dark">{item.name}</h3>
                    <p className="text-xs text-duo-neutral font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="shrink-0 w-full sm:w-auto">
                  {item.disabled ? (
                    <button
                      disabled
                      className="w-full sm:w-auto text-xs font-black uppercase text-slate-400 bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200 cursor-not-allowed"
                    >
                      {item.disabledText}
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      className="w-full sm:w-auto btn-duo-blue text-xs py-2.5 px-4 flex items-center justify-center gap-1.5"
                    >
                      <Gem className="w-4 h-4 fill-white" />
                      <span>{item.cost} GEMS</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mascot speech */}
          <DuoMascot
            mood="idle"
            size="sm"
            message="Gems are earned for every speech exercise you complete with high accuracy!"
          />
        </main>
      </div>
    </div>
  );
}
