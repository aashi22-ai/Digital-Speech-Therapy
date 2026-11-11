const asyncHandler = require("express-async-handler");
const Exercise = require("../models/Exercise");

// GET /api/exercises?type=&difficulty=&category=&language=
const getExercises = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.language) filter.language = req.query.language;

  const exercises = await Exercise.find(filter).sort({ createdAt: 1 });
  res.json(exercises);
});

// GET /api/exercises/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Exercise.distinct("category");
  res.json(categories.sort());
});

// GET /api/exercises/languages
const getLanguages = asyncHandler(async (req, res) => {
  const languages = await Exercise.distinct("language");
  res.json(languages.sort());
});

// GET /api/exercises/:id
const getExerciseById = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    res.status(404);
    throw new Error("Exercise not found");
  }
  res.json(exercise);
});

// POST /api/exercises (admin only)
const createExercise = asyncHandler(async (req, res) => {
  const { title, type, category, language, targetText, difficulty } = req.body;

  if (!title || !targetText) {
    res.status(400);
    throw new Error("Title and target text are required");
  }

  const exercise = await Exercise.create({
    title: title.trim(),
    type: type || "sentence",
    category: category?.trim() || "general",
    language: language?.trim() || "en",
    targetText: targetText.trim(),
    difficulty: difficulty || "beginner",
  });

  res.status(201).json(exercise);
});

// DELETE /api/exercises/:id (admin only)
const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    res.status(404);
    throw new Error("Exercise not found");
  }

  await exercise.deleteOne();
  res.json({ message: "Exercise deleted" });
});

module.exports = {
  getExercises,
  getExerciseById,
  getCategories,
  getLanguages,
  createExercise,
  deleteExercise,
};
