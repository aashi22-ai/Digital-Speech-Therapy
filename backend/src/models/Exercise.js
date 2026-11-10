const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["word", "sentence", "paragraph", "dialogue"],
      default: "sentence",
    },
    category: { type: String, default: "general", trim: true },
    language: { type: String, default: "en", trim: true }, // ISO code: en, es, fr, de, hi, ...
    targetText: { type: String, required: true },
    translation: { type: String, default: "", trim: true },
    phonetic: { type: String, default: "", trim: true },
    dialoguePrompt: { type: String, default: "", trim: true }, // Mascot's question in conversation practice
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
