const asyncHandler = require("express-async-handler");
const Progress = require("../models/Progress");
const User = require("../models/User");

// GET /api/progress/:userId
const getProgress = asyncHandler(async (req, res) => {
  if (req.params.userId !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this progress");
  }

  let progress = await Progress.findOne({ userId: req.params.userId });

  if (!progress) {
    progress = await Progress.create({
      userId: req.user._id,
      totalAttempts: 0,
      averageScore: 0,
      lastPracticed: null,
      xp: 0,
      weeklyXp: 0,
      streak: 1,
      gems: 150,
      hearts: 5,
      maxHearts: 5,
      league: "Bronze",
      streakFreezes: 1,
      completedExercises: [],
      unlockedChests: [],
    });
  }

  res.json(progress);
});

// POST /api/progress/refill-hearts
const refillHearts = asyncHandler(async (req, res) => {
  let progress = await Progress.findOne({ userId: req.user._id });
  if (!progress) {
    progress = await Progress.create({ userId: req.user._id });
  }

  const cost = 50;
  if (progress.gems >= cost) {
    progress.gems -= cost;
  }
  progress.hearts = progress.maxHearts || 5;
  await progress.save();

  res.json({
    message: "Hearts successfully refilled!",
    hearts: progress.hearts,
    gems: progress.gems,
  });
});

// POST /api/progress/claim-chest
const claimChest = asyncHandler(async (req, res) => {
  const { unitIndex } = req.body;
  if (unitIndex === undefined) {
    res.status(400);
    throw new Error("unitIndex is required");
  }

  let progress = await Progress.findOne({ userId: req.user._id });
  if (!progress) {
    progress = await Progress.create({ userId: req.user._id });
  }

  if (progress.unlockedChests.includes(unitIndex)) {
    return res.status(400).json({ message: "Chest already claimed!" });
  }

  const gemsAwarded = 30 + (unitIndex + 1) * 15;
  const xpAwarded = 25;

  progress.unlockedChests.push(unitIndex);
  progress.gems = (progress.gems || 0) + gemsAwarded;
  progress.xp = (progress.xp || 0) + xpAwarded;
  progress.weeklyXp = (progress.weeklyXp || 0) + xpAwarded;
  await progress.save();

  res.json({
    message: `You unlocked Unit ${unitIndex + 1} Chest!`,
    gemsAwarded,
    xpAwarded,
    progress,
  });
});

// POST /api/progress/shop-buy
const buyShopItem = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  let progress = await Progress.findOne({ userId: req.user._id });
  if (!progress) {
    progress = await Progress.create({ userId: req.user._id });
  }

  const shopItems = {
    "refill-hearts": { cost: 50, name: "Full Heart Refill" },
    "streak-freeze": { cost: 100, name: "Streak Freeze" },
    "double-xp": { cost: 80, name: "Double XP Boost" },
    "speech-champ": { cost: 200, name: "Golden Echo Trophy Badge" },
  };

  const item = shopItems[itemId];
  if (!item) {
    res.status(400);
    throw new Error("Invalid shop item");
  }

  if ((progress.gems || 0) < item.cost) {
    res.status(400);
    throw new Error("Not enough gems! Complete speech exercises to earn more.");
  }

  progress.gems -= item.cost;

  if (itemId === "refill-hearts") {
    progress.hearts = progress.maxHearts || 5;
  } else if (itemId === "streak-freeze") {
    progress.streakFreezes = (progress.streakFreezes || 0) + 1;
  }

  await progress.save();

  res.json({
    message: `Purchased ${item.name}!`,
    gems: progress.gems,
    progress,
  });
});

// GET /api/progress/leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({ userId: req.user._id });
  const userXp = progress?.weeklyXp || progress?.xp || 0;

  // Base cohort of fellow speech learners for lively gamified competition
  const cohort = [
    { name: "Maya Patel", avatar: "🦊", xp: Math.max(340, userXp + 60), isUser: false },
    { name: "David Kim", avatar: "🦉", xp: Math.max(290, userXp + 35), isUser: false },
    { name: "Sophia Chen", avatar: "🐻", xp: Math.max(230, userXp + 15), isUser: false },
    { name: req.user.name + " (You)", avatar: "🎙️", xp: userXp, isUser: true },
    { name: "Liam Watson", avatar: "🦁", xp: Math.max(45, userXp - 25), isUser: false },
    { name: "Elena Rostova", avatar: "🐼", xp: Math.max(30, userXp - 45), isUser: false },
    { name: "Lucas Moreau", avatar: "🐨", xp: Math.max(15, userXp - 60), isUser: false },
    { name: "Aarav Sharma", avatar: "🐯", xp: Math.max(10, userXp - 80), isUser: false },
  ];

  cohort.sort((a, b) => b.xp - a.xp);

  const ranked = cohort.map((player, idx) => ({
    rank: idx + 1,
    ...player,
    inPromotionZone: idx < 3,
    inDemotionZone: idx >= 7,
  }));

  res.json({
    league: progress?.league || "Bronze",
    players: ranked,
    userRank: ranked.find((p) => p.isUser)?.rank || 4,
    daysRemaining: 3,
  });
});

module.exports = {
  getProgress,
  refillHearts,
  claimChest,
  buyShopItem,
  getLeaderboard,
};
