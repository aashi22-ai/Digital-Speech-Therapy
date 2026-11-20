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
  const currentProgress = await Progress.findOne({ userId: req.user._id });

  // Fetch all registered users from the database
  const users = await User.find({}, "name email createdAt").lean();
  const allProgress = await Progress.find({}).lean();

  const progressMap = {};
  allProgress.forEach((p) => {
    if (p.userId) {
      progressMap[p.userId.toString()] = p;
    }
  });

  const avatarPool = ["🦊", "🐻", "🦁", "🐼", "🐨", "🐯", "🐰", "🐶", "🐱", "🦉", "🦄", "🐸"];
  const getAvatar = (user, isUser) => {
    if (isUser) return "🐧";
    let hash = 0;
    const str = user._id ? user._id.toString() : user.name || "";
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % avatarPool.length;
    }
    return avatarPool[hash];
  };

  const players = users.map((u) => {
    const isUser = u._id.toString() === req.user._id.toString();
    const prog = progressMap[u._id.toString()];
    const xp = prog?.weeklyXp || prog?.xp || 0;

    return {
      userId: u._id,
      name: isUser ? `${u.name} (You)` : u.name,
      avatar: getAvatar(u, isUser),
      xp,
      isUser,
      createdAt: u.createdAt,
    };
  });

  // Sort by weekly XP descending, then earlier registered users
  players.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const ranked = players.map((player, idx) => ({
    ...player,
    rank: idx + 1,
    inPromotionZone: idx < 3,
    inDemotionZone: players.length > 5 && idx >= players.length - 2,
  }));

  const userPlayer = ranked.find((p) => p.isUser);

  res.json({
    league: currentProgress?.league || "Bronze",
    players: ranked,
    userRank: userPlayer?.rank || 1,
    totalPlayers: ranked.length,
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
