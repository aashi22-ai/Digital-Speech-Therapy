const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    lastPracticed: { type: Date },
    // Duo Speech gamification mechanics
    xp: { type: Number, default: 0 },
    weeklyXp: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    lastStreakDate: { type: Date },
    gems: { type: Number, default: 150 },
    hearts: { type: Number, default: 5 },
    maxHearts: { type: Number, default: 5 },
    league: { type: String, default: "Bronze" },
    streakFreezes: { type: Number, default: 1 },
    completedExercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
    unlockedChests: { type: [Number], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);

