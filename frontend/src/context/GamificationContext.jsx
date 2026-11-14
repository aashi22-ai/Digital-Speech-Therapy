import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import {
  isSoundEnabled,
  setSoundEnabled,
  playChestSound,
  playClickSound,
  playSuccessSound,
} from "../utils/soundEffects";

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const { user } = useAuth();

  const [xp, setXp] = useState(0);
  const [weeklyXp, setWeeklyXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [hearts, setHearts] = useState(5);
  const [maxHearts] = useState(5);
  const [gems, setGems] = useState(150);
  const [league, setLeague] = useState("Bronze");
  const [completedExercises, setCompletedExercises] = useState([]);
  const [unlockedChests, setUnlockedChests] = useState([]);
  const [soundActive, setSoundActive] = useState(isSoundEnabled());

  // Daily quests state
  const [dailyQuests, setDailyQuests] = useState({
    lessonsDone: 0,
    targetAccuracyHit: false,
    dailyXp: 0,
    claimed: [],
  });

  // Load progress from backend whenever user is authenticated
  useEffect(() => {
    if (!user) return;

    api
      .get(`/progress/${user._id}`)
      .then((res) => {
        const data = res.data;
        if (data) {
          if (typeof data.xp === "number") setXp(data.xp);
          if (typeof data.weeklyXp === "number") setWeeklyXp(data.weeklyXp);
          if (typeof data.streak === "number") setStreak(data.streak);
          if (typeof data.hearts === "number") setHearts(data.hearts);
          if (typeof data.gems === "number") setGems(data.gems);
          if (data.league) setLeague(data.league);
          if (Array.isArray(data.completedExercises)) {
            setCompletedExercises(data.completedExercises.map((e) => (e._id ? e._id : e)));
          }
          if (Array.isArray(data.unlockedChests)) {
            setUnlockedChests(data.unlockedChests);
          }
        }
      })
      .catch(() => {
        // Fallback to local storage if network or offline
        const local = localStorage.getItem(`duo_prog_${user._id}`);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setXp(parsed.xp || 0);
            setStreak(parsed.streak || 1);
            setHearts(parsed.hearts ?? 5);
            setGems(parsed.gems || 150);
            setCompletedExercises(parsed.completedExercises || []);
            setUnlockedChests(parsed.unlockedChests || []);
          } catch (e) {
            // ignore
          }
        }
      });

    // Load daily quests
    const questData = localStorage.getItem(`duo_quests_${user._id}`);
    if (questData) {
      try {
        setDailyQuests(JSON.parse(questData));
      } catch (e) {}
    }
  }, [user]);

  // Persist locally as backup
  useEffect(() => {
    if (!user) return;
    const backup = {
      xp,
      weeklyXp,
      streak,
      hearts,
      gems,
      completedExercises,
      unlockedChests,
    };
    localStorage.setItem(`duo_prog_${user._id}`, JSON.stringify(backup));
  }, [user, xp, weeklyXp, streak, hearts, gems, completedExercises, unlockedChests]);

  // Handle reward when an attempt is completed
  const applyAttemptReward = ({
    xpEarned = 15,
    pronunciationScore = 80,
    fluencyScore = 80,
    exerciseId,
  }) => {
    const combined = (pronunciationScore + fluencyScore) / 2;
    setXp((prev) => prev + xpEarned);
    setWeeklyXp((prev) => prev + xpEarned);

    // Hearts check
    if (combined < 50) {
      setHearts((prev) => Math.max(0, prev - 1));
    } else if (combined >= 85) {
      setHearts((prev) => Math.min(maxHearts, prev + 1));
    }

    // Gems reward
    const gemBonus = combined >= 80 ? 15 : 5;
    setGems((prev) => prev + gemBonus);

    // Mark exercise completed if score >= 60
    if (exerciseId && combined >= 60) {
      setCompletedExercises((prev) => {
        if (!prev.includes(exerciseId)) {
          return [...prev, exerciseId];
        }
        return prev;
      });
    }

    // Update daily quests
    setDailyQuests((prev) => {
      const updated = {
        ...prev,
        lessonsDone: prev.lessonsDone + 1,
        targetAccuracyHit: prev.targetAccuracyHit || combined >= 80,
        dailyXp: prev.dailyXp + xpEarned,
      };
      if (user) {
        localStorage.setItem(`duo_quests_${user._id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const refillHearts = async () => {
    try {
      const res = await api.post("/progress/refill-hearts");
      setHearts(res.data.hearts);
      setGems(res.data.gems);
    } catch {
      // Local fallback
      setHearts(maxHearts);
      setGems((prev) => Math.max(0, prev - 50));
    }
    playSuccessSound();
  };

  const claimChest = async (unitIndex) => {
    if (unlockedChests.includes(unitIndex)) return;
    try {
      const res = await api.post("/progress/claim-chest", { unitIndex });
      setGems(res.data.progress.gems);
      setXp(res.data.progress.xp);
      setUnlockedChests(res.data.progress.unlockedChests);
    } catch {
      // Local fallback
      const gemsReward = 45;
      setGems((prev) => prev + gemsReward);
      setXp((prev) => prev + 25);
      setUnlockedChests((prev) => [...prev, unitIndex]);
    }
    playChestSound();
  };

  const buyShopItem = async (itemId) => {
    try {
      const res = await api.post("/progress/shop-buy", { itemId });
      setGems(res.data.gems);
      if (itemId === "refill-hearts") setHearts(maxHearts);
    } catch (err) {
      // Local fallback
      const costs = { "refill-hearts": 50, "streak-freeze": 100, "double-xp": 80 };
      const cost = costs[itemId] || 50;
      if (gems >= cost) {
        setGems((prev) => prev - cost);
        if (itemId === "refill-hearts") setHearts(maxHearts);
      } else {
        throw new Error("Not enough gems!");
      }
    }
    playSuccessSound();
  };

  const claimQuestReward = (questId, rewardGems = 20) => {
    if (dailyQuests.claimed.includes(questId)) return;
    setGems((prev) => prev + rewardGems);
    setDailyQuests((prev) => {
      const updated = {
        ...prev,
        claimed: [...prev.claimed, questId],
      };
      if (user) {
        localStorage.setItem(`duo_quests_${user._id}`, JSON.stringify(updated));
      }
      return updated;
    });
    playChestSound();
  };

  const isExerciseCompleted = (id) => {
    if (!id) return false;
    return completedExercises.some((cId) => cId?.toString() === id.toString());
  };

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        weeklyXp,
        streak,
        hearts,
        maxHearts,
        gems,
        league,
        completedExercises,
        unlockedChests,
        dailyQuests,
        soundActive,
        toggleSound,
        applyAttemptReward,
        refillHearts,
        claimChest,
        buyShopItem,
        claimQuestReward,
        isExerciseCompleted,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return ctx;
}
