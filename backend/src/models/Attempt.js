const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
    audioUrl: { type: String, required: true },
    transcript: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);
