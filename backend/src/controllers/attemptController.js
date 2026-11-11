const asyncHandler = require("express-async-handler");
const Exercise = require("../models/Exercise");
const Attempt = require("../models/Attempt");
const Score = require("../models/Score");
const Progress = require("../models/Progress");
const { transcribeAudio, analyzeSpeech } = require("../services/aiServiceClient");

// POST /api/attempts (multipart form-data: audio file + exerciseId)
// Orchestrates: save audio -> transcribe (ASR, language-aware) ->
// analyze (LLM + real word-diff) -> save results.
const createAttempt = asyncHandler(async (req, res) => {
  const { exerciseId } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("No audio file was uploaded");
  }
  if (!exerciseId) {
    res.status(400);
    throw new Error("exerciseId is required");
  }

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    res.status(404);
    throw new Error("Exercise not found");
  }

  const attempt = await Attempt.create({
    userId: req.user._id,
    exerciseId: exercise._id,
    audioUrl: req.file.path,
  });

  let transcript = "";
  try {
    transcript = await transcribeAudio(req.file.path, exercise.language);
  } catch (err) {
    console.warn("Primary ASR failed, checking for browser transcript fallback:", err.message);
    if (req.body.clientTranscript && req.body.clientTranscript.trim()) {
      transcript = req.body.clientTranscript.trim();
    } else {
      console.warn("ASR failed and no client transcript available, analyzing recording as quiet:", err.message);
      transcript = "";
    }
  }

  // If Whisper returned empty (e.g. low microphone gain) but browser speech rec captured words:
  if (!transcript && req.body.clientTranscript && req.body.clientTranscript.trim()) {
    transcript = req.body.clientTranscript.trim();
  }

  attempt.transcript = transcript;
  await attempt.save();

  const analysis = await analyzeSpeech(transcript, exercise.targetText, exercise.language);

  const score = await Score.create({
    attemptId: attempt._id,
    pronunciationScore: analysis.pronunciation_score,
    fluencyScore: analysis.fluency_score,
    aiFeedback: analysis.feedback,
    wordDiff: analysis.word_diff || [],
    extraWords: analysis.extra_words || [],
  });

  const combinedScore = (analysis.pronunciation_score + analysis.fluency_score) / 2;
  let progress = await Progress.findOne({ userId: req.user._id });

  // Calculate XP earned (Duolingo style)
  let xpEarned = 10;
  if (analysis.pronunciation_score >= 80) xpEarned += 5;
  if (combinedScore >= 90) xpEarned += 5;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  if (!progress) {
    progress = await Progress.create({
      userId: req.user._id,
      totalAttempts: 1,
      averageScore: combinedScore,
      lastPracticed: now,
      xp: xpEarned,
      weeklyXp: xpEarned,
      streak: 1,
      lastStreakDate: now,
      gems: 155,
      hearts: combinedScore < 50 ? 4 : 5,
      completedExercises: [exercise._id],
    });
  } else {
    const newTotal = progress.totalAttempts + 1;
    progress.averageScore =
      (progress.averageScore * progress.totalAttempts + combinedScore) / newTotal;
    progress.totalAttempts = newTotal;
    progress.lastPracticed = now;

    // XP update
    progress.xp = (progress.xp || 0) + xpEarned;
    progress.weeklyXp = (progress.weeklyXp || 0) + xpEarned;

    // Streak logic
    if (progress.lastStreakDate) {
      const lastStr = new Date(progress.lastStreakDate).toISOString().split("T")[0];
      const diffMs = new Date(todayStr).getTime() - new Date(lastStr).getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        progress.streak = (progress.streak || 0) + 1;
        progress.lastStreakDate = now;
      } else if (diffDays > 1) {
        // Missed a day
        if (progress.streakFreezes && progress.streakFreezes > 0) {
          progress.streakFreezes -= 1;
          progress.lastStreakDate = now;
        } else {
          progress.streak = 1;
          progress.lastStreakDate = now;
        }
      }
    } else {
      progress.streak = 1;
      progress.lastStreakDate = now;
    }

    // Hearts calculation
    if (combinedScore < 50) {
      progress.hearts = Math.max(0, (progress.hearts ?? 5) - 1);
    } else if (combinedScore >= 85 && (progress.hearts ?? 5) < 5) {
      progress.hearts = Math.min(5, (progress.hearts ?? 5) + 1);
    }

    // Gems reward
    const gemsAwarded = combinedScore >= 80 ? 15 : 5;
    progress.gems = (progress.gems || 0) + gemsAwarded;

    // Completed exercises set
    if (!progress.completedExercises) progress.completedExercises = [];
    if (!progress.completedExercises.some((id) => id.toString() === exercise._id.toString())) {
      progress.completedExercises.push(exercise._id);
    }

    await progress.save();
  }

  res.status(201).json({
    attempt,
    score,
    gamification: {
      xpEarned,
      totalXp: progress.xp,
      streak: progress.streak,
      hearts: progress.hearts,
      gems: progress.gems,
      completedCount: progress.completedExercises.length,
    },
  });
});

// GET /api/attempts/:id
const getAttemptById = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.id);
  if (!attempt || attempt.userId.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Attempt not found");
  }
  const score = await Score.findOne({ attemptId: attempt._id });
  res.json({ attempt, score });
});

// GET /api/attempts/user/:userId
const getAttemptsByUser = asyncHandler(async (req, res) => {
  if (req.params.userId !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view these attempts");
  }

  const attempts = await Attempt.find({ userId: req.params.userId })
    .populate("exerciseId", "title difficulty")
    .sort({ createdAt: -1 });

  const attemptIds = attempts.map((a) => a._id);
  const scores = await Score.find({ attemptId: { $in: attemptIds } });
  const scoreByAttemptId = new Map(scores.map((s) => [s.attemptId.toString(), s]));

  const combined = attempts.map((attempt) => {
    const score = scoreByAttemptId.get(attempt._id.toString());
    return {
      _id: attempt._id,
      exerciseTitle: attempt.exerciseId?.title || "Deleted exercise",
      difficulty: attempt.exerciseId?.difficulty || null,
      transcript: attempt.transcript,
      createdAt: attempt.createdAt,
      pronunciationScore: score?.pronunciationScore ?? null,
      fluencyScore: score?.fluencyScore ?? null,
    };
  });

  res.json(combined);
});

module.exports = { createAttempt, getAttemptById, getAttemptsByUser };
