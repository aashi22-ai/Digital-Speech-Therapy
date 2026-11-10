const mongoose = require("mongoose");

const wordDiffItemSchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    status: { type: String, enum: ["correct", "different", "missing"], required: true },
  },
  { _id: false }
);

const scoreSchema = new mongoose.Schema(
  {
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attempt",
      required: true,
      unique: true,
    },
    pronunciationScore: { type: Number, min: 0, max: 100, required: true },
    fluencyScore: { type: Number, min: 0, max: 100, required: true },
    aiFeedback: { type: String, required: true },
    // Real, deterministic word-by-word comparison (computed in the AI
    // service via difflib) — not LLM-generated, so it's always accurate
    // to what was actually transcribed.
    wordDiff: { type: [wordDiffItemSchema], default: [] },
    extraWords: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
