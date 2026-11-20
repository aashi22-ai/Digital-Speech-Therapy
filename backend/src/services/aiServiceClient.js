const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

let rawAiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
if (rawAiUrl && !rawAiUrl.startsWith("http://") && !rawAiUrl.startsWith("https://")) {
  rawAiUrl = `https://${rawAiUrl}`;
}
const AI_SERVICE_URL = rawAiUrl.replace(/\/+$/, "");

const transcribeAudio = async (audioFilePath, language) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(audioFilePath));
  if (language) form.append("language", language);

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/transcribe`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 25000,
    });

    return response.data.transcript || "";
  } catch (err) {
    console.error("Transcription error from AI service:", err.message);
    throw new Error("Could not transcribe speech. Please ensure the AI service is running.");
  }
};

const analyzeSpeech = async (transcript, targetText, language) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/ai/analyze`,
      {
        transcript: transcript || "",
        target_text: targetText,
        language: language || "en",
      },
      { timeout: 30000 }
    );

    return response.data;
  } catch (err) {
    console.warn("AI service analyze call failed, using deterministic scoring fallback:", err.message);

    // Deterministic fallback using word comparison
    const targetWords = targetText
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    const saidWords = (transcript || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    let matchCount = 0;
    const wordDiff = targetWords.map((tw) => {
      const isMatch = saidWords.includes(tw);
      if (isMatch) matchCount++;
      return { word: tw, status: isMatch ? "correct" : "missing" };
    });

    if (saidWords.length === 0 || matchCount === 0) {
      return {
        pronunciation_score: 0,
        fluency_score: 0,
        feedback:
          "No speech detected. Please check that your microphone is unmuted, tap Retry, and speak clearly.",
        word_diff: wordDiff,
        extra_words: [],
      };
    }

    const pScore = Math.min(100, Math.round((matchCount / Math.max(1, targetWords.length)) * 100));
    const fScore = Math.max(10, Math.min(100, Math.round(pScore * 0.95)));

    return {
      pronunciation_score: pScore,
      fluency_score: fScore,
      feedback:
        pScore >= 80
          ? "Clear articulation and strong rhythm! Your pronunciation was easy to follow."
          : "Keep practicing! Slow down slightly and articulate each sound with relaxed breath.",
      word_diff: wordDiff,
      extra_words: [],
    };
  }
};

module.exports = { transcribeAudio, analyzeSpeech };
