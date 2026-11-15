import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Zap, Target, Waves, Flame, ArrowRight, Award, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";
import { useGamification } from "../context/GamificationContext";
import { playFanfareSound, playClickSound } from "../utils/soundEffects";
import DuoMascot from "../components/mascot/DuoMascot";
import WordDiffDisplay from "../components/progress/WordDiffDisplay";

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { streak } = useGamification();

  useEffect(() => {
    // Duolingo Confetti Blast & Fanfare Chime on complete
    playFanfareSound();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.5 },
    });
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 select-none">
        <div className="text-center space-y-4 max-w-sm">
          <DuoMascot mood="idle" size="md" className="justify-center" />
          <h2 className="text-xl font-black text-duo-dark">No recent speech result</h2>
          <button onClick={() => navigate("/dashboard")} className="btn-duo-yellow w-full">
            Back to Learning Path
          </button>
        </div>
      </div>
    );
  }

  const { attempt, score } = state;
  const pScore = Math.round(score?.pronunciationScore || 0);
  const fScore = Math.round(score?.fluencyScore || 0);
  const combined = Math.round((pScore + fScore) / 2);
  const xpEarned = combined >= 90 ? 25 : combined >= 75 ? 15 : 10;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-6 select-none">
      <div className="max-w-xl mx-auto w-full space-y-6 pt-4">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <DuoMascot mood="cheering" size="lg" className="justify-center" />
          <h1 className="text-3xl sm:text-4xl font-black text-duo-dark">
            Lesson Complete!
          </h1>
          <p className="text-sm font-bold text-duo-neutral">
            You practiced your speech with AI clarity and rhythm!
          </p>
        </div>

        {/* Reward Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* XP Card */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-4 text-center space-y-1 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-duo-yellow/30 text-duo-yellow-dark flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5 fill-duo-yellow-dark" />
            </div>
            <p className="text-2xl font-black text-duo-dark">+{xpEarned}</p>
            <p className="text-[11px] font-black uppercase text-yellow-800">TOTAL XP</p>
          </div>

          {/* Pronunciation Card */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4 text-center space-y-1 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-duo-yellow/30 text-amber-900 flex items-center justify-center mx-auto">
              <Target className="w-5 h-5 text-amber-900" />
            </div>
            <p className="text-2xl font-black text-duo-dark">{pScore}%</p>
            <p className="text-[11px] font-black uppercase text-amber-800">ACCURACY</p>
          </div>

          {/* Fluency Card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-4 text-center space-y-1 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-duo-blue/20 text-duo-blue-dark flex items-center justify-center mx-auto">
              <Waves className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-duo-dark">{fScore}%</p>
            <p className="text-[11px] font-black uppercase text-duo-blue-dark">FLUENCY</p>
          </div>
        </div>

        {/* Streak Celebration Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-3xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xs">
              <Flame className="w-7 h-7 text-duo-orange fill-duo-orange animate-bounce-short" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-duo-orange tracking-wider">
                Daily Streak Alive
              </p>
              <p className="text-sm font-black text-duo-dark">
                {streak} Day Streak! Keep practicing daily!
              </p>
            </div>
          </div>
          <span className="text-2xl">🔥</span>
        </div>

        {/* What We Heard (ASR Transcript) */}
        <div className="bg-slate-50 border-2 border-duo-gray rounded-3xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-duo-neutral">
            <MessageSquare className="w-4 h-4 text-duo-blue" />
            <span>What We Heard (faster-whisper ASR):</span>
          </div>
          <p className="text-sm font-bold text-duo-dark italic bg-white p-3 rounded-2xl border border-duo-gray">
            "{attempt.transcript || "No speech detected"}"
          </p>

          {/* Word Accuracy Diff */}
          <WordDiffDisplay wordDiff={score?.wordDiff} extraWords={score?.extraWords} />
        </div>

        {/* Gemini AI Feedback Note */}
        {score?.aiFeedback && (
          <div className="bg-blue-50/70 border-2 border-blue-100 rounded-3xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-duo-blue">
              <Award className="w-4 h-4" />
              <span>Speech Therapist AI Feedback:</span>
            </div>
            <p className="text-xs font-bold text-duo-dark leading-relaxed">
              {score.aiFeedback}
            </p>
          </div>
        )}
      </div>

      {/* Continue Button Footer */}
      <footer className="max-w-xl mx-auto w-full pt-4 pb-2">
        <button
          onClick={() => {
            playClickSound();
            navigate("/dashboard");
          }}
          className="w-full btn-duo-yellow text-base py-4 font-black"
        >
          <span>CONTINUE TO LEARNING PATH</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
