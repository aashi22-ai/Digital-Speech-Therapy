import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Check,
  Lock,
  Gift,
  BookOpen,
  Volume2,
  Sparkles,
  Trophy,
  X,
  MessageCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useGamification } from "../../context/GamificationContext";
import { playClickSound } from "../../utils/soundEffects";
import DuoMascot from "../mascot/DuoMascot";

export default function LearningPath({ exercises = [], currentLanguage = "en" }) {
  const navigate = useNavigate();
  const { isExerciseCompleted, unlockedChests, claimChest } = useGamification();

  const [activeModalExercise, setActiveModalExercise] = useState(null);
  const [guidebookUnit, setGuidebookUnit] = useState(null);

  // Play pronunciation sample inside guidebook
  const handleGuidebookSpeak = (text, lang) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const langMap = { en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", hi: "hi-IN" };
    utt.lang = langMap[lang || currentLanguage] || "en-US";
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  };

  // Structured Duo Speech Units & Language Tutorials
  const units = [
    {
      unitNumber: 1,
      title: "Foundations & Greetings",
      description: "Master essential hellos, goodbyes, polite phrases, and vowel clarity.",
      color: "from-amber-400 via-yellow-400 to-amber-500",
      accent: "bg-duo-yellow",
      matchCategory: (ex) => ex.category === "greetings" || ex.difficulty === "beginner",
      guidebook: {
        title: "Unit 1: First Words & Essential Greetings",
        tips: [
          "Open Vowels: Keep your throat relaxed and jaw slightly lowered so vowel sounds resonate cleanly.",
          "Polite Intonation: Use a gentle rising pitch at the start of greetings to sound welcoming and friendly.",
          "Diaphragmatic Breathing: Inhale through the nose from the stomach before speaking.",
        ],
        vocab: [
          { native: "Hello / Good morning", phonetic: "heh-LOH / good MOR-ning", meaning: "Greeting" },
          { native: "Please & Thank you", phonetic: "pleez & thank yoo", meaning: "Politeness" },
          { native: "Yes / No", phonetic: "yes / noh", meaning: "Affirmation" },
        ],
      },
    },
    {
      unitNumber: 2,
      title: "Introductions & Social Flow",
      description: "Introduce yourself, share your name and origin, and break the ice.",
      color: "from-blue-500 to-cyan-600",
      accent: "bg-duo-blue",
      matchCategory: (ex) => ex.category === "introductions",
      guidebook: {
        title: "Unit 2: Introductions & Meeting People",
        tips: [
          "Clear Consonant Releases: Pronounce final consonants (like 't', 'd', 's') without swallowing them.",
          "Name Emphasis: Pause briefly right before saying your name so the listener hears it distinctly.",
          "Eye Contact & Posture: Stand or sit tall with shoulders back to allow maximum lung capacity.",
        ],
        vocab: [
          { native: "My name is...", phonetic: "my naym iz...", meaning: "Self-introduction" },
          { native: "Nice to meet you", phonetic: "nys too meet yoo", meaning: "Social greeting" },
          { native: "Where are you from?", phonetic: "wear ahr yoo frum?", meaning: "Asking origin" },
        ],
      },
    },
    {
      unitNumber: 3,
      title: "Cafe, Dining & Ordering",
      description: "Order drinks and food confidently, ask for recommendations, and request the bill.",
      color: "from-amber-500 to-orange-600",
      accent: "bg-duo-orange",
      matchCategory: (ex) => ex.category === "cafe-dining",
      guidebook: {
        title: "Unit 3: Ordering Food & Drinks Like a Local",
        tips: [
          "Polite Requests: Use conditional phrasing ('I would like...', 'Could we please have...').",
          "Rhythm of Lists: When naming multiple items (coffee, water, dessert), rise slightly on items and drop on the last.",
          "Clear Plurals: Emphasize plural endings so your server understands exact quantities.",
        ],
        vocab: [
          { native: "Coffee with milk", phonetic: "KOF-ee with milk", meaning: "Drink order" },
          { native: "The bill, please", phonetic: "thuh bil, pleez", meaning: "Payment request" },
          { native: "A glass of water", phonetic: "uh glas uv WAH-ter", meaning: "Beverage request" },
        ],
      },
    },
    {
      unitNumber: 4,
      title: "Directions & City Travel",
      description: "Ask for locations, understand landmarks, and navigate transport seamlessly.",
      color: "from-indigo-500 to-purple-600",
      accent: "bg-duo-purple",
      matchCategory: (ex) => ex.category === "directions",
      guidebook: {
        title: "Unit 4: Asking for Directions & Navigation",
        tips: [
          "Excuse Me: Always begin inquiries with a polite attention phrase ('Excuse me', 'Disculpe', 'Pardon').",
          "Directional Words: Emphasize key terms (straight ahead, left, right, subway station).",
          "Confirmation: Repeat back the key direction to ensure you understood properly.",
        ],
        vocab: [
          { native: "Where is the subway?", phonetic: "wear iz thuh SUB-way?", meaning: "Transport query" },
          { native: "Turn left / right", phonetic: "turn left / ryt", meaning: "Direction" },
          { native: "Near here", phonetic: "neer heer", meaning: "Proximity" },
        ],
      },
    },
    {
      unitNumber: 5,
      title: "Interactive Conversations",
      description: "Practice real two-way dialogues where Duo asks questions and you reply.",
      color: "from-pink-500 to-rose-600",
      accent: "bg-pink-500",
      matchCategory: (ex) => ex.category === "conversation" || ex.type === "dialogue",
      guidebook: {
        title: "Unit 5: Real-Life Dialogue & Conversational Pacing",
        tips: [
          "Listen Before Speaking: Absorb the partner's audio prompt completely before clicking record.",
          "Conversational Pacing: Speak naturally at 110–130 words per minute without rushing.",
          "Sentence Melody: End statements with a confident downward tone.",
        ],
        vocab: [
          { native: "What are your plans?", phonetic: "wut ahr yoor planz?", meaning: "Casual inquiry" },
          { native: "I am going to visit...", phonetic: "eye am GOH-ing too VIZ-it...", meaning: "Stating plans" },
          { native: "Sounds wonderful!", phonetic: "sowndz WUN-der-ful!", meaning: "Enthusiastic response" },
        ],
      },
    },
    {
      unitNumber: 6,
      title: "Tongue Twisters & Articulation Masters",
      description: "Challenge yourself with tricky consonants, rapid transitions, and phonetic agility.",
      color: "from-purple-600 to-violet-700",
      accent: "bg-purple-600",
      matchCategory: (ex) => ex.category === "tongue-twisters",
      guidebook: {
        title: "Unit 6: Articulation Drills & Tongue Twisters",
        tips: [
          "Half Speed First: Speak the tongue twister at 50% speed with exaggerated lip/tongue movement.",
          "Consonant Precision: Crisp, clean releases of bilabials (P, B) and sibilants (S, SH).",
          "Accelerate on Pass: Only speed up once you achieve 90%+ word accuracy.",
        ],
        vocab: [
          { native: "She sells seashells", phonetic: "shee selz SEE-shelz", meaning: "Sibilant drill" },
          { native: "Rubber baby buggy", phonetic: "RUB-er BAY-bee BUG-ee", meaning: "Bilabial drill" },
          { native: "Peter Piper", phonetic: "PEE-ter PY-per", meaning: "Plosive consonant drill" },
        ],
      },
    },
  ];

  // Distribute exercises into units
  const unitExercises = units.map((u, uIdx) => {
    let matched = exercises.filter(u.matchCategory);
    if (matched.length === 0) {
      const sliceSize = Math.max(2, Math.ceil(exercises.length / units.length));
      matched = exercises.slice(uIdx * sliceSize, (uIdx + 1) * sliceSize);
    }
    return matched;
  });

  let firstUnlockedFound = false;

  const handleChestClick = (uIdx) => {
    playClickSound();
    if (!unlockedChests.includes(uIdx)) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      claimChest(uIdx);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {units.map((unit, uIdx) => {
        const exercisesInUnit = unitExercises[uIdx] || [];
        if (exercisesInUnit.length === 0) return null;
        const isChestClaimed = unlockedChests.includes(uIdx);

        return (
          <section key={unit.unitNumber} className="mb-14">
            {/* Unit Header Card */}
            <div
              className={`rounded-3xl p-5 mb-8 text-white bg-gradient-to-r ${unit.color} shadow-md flex items-center justify-between`}
            >
              <div className="space-y-1 max-w-[75%]">
                <p className="text-xs font-black uppercase tracking-widest text-white/80">
                  Unit {unit.unitNumber}
                </p>
                <h2 className="text-xl font-black">{unit.title}</h2>
                <p className="text-xs text-white/90 font-medium leading-relaxed">
                  {unit.description}
                </p>
              </div>

              {/* Guidebook Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setGuidebookUnit(unit);
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-xs border-2 border-white/40 rounded-2xl p-3 flex flex-col items-center gap-1 transition active:scale-95 text-center shadow-xs"
                title="View Language Guidebook & Tutorial"
              >
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-[10px] font-black uppercase tracking-wider">Guide</span>
              </button>
            </div>

            {/* Stepping Stones Snake Path */}
            <div className="flex flex-col items-center gap-6 relative">
              {exercisesInUnit.map((ex, exIdx) => {
                const completed = isExerciseCompleted(ex._id);
                const isCurrent = !completed && !firstUnlockedFound;
                if (isCurrent) firstUnlockedFound = true;

                const offsetPattern = [
                  "translate-x-0",
                  "translate-x-12 sm:translate-x-16",
                  "translate-x-0",
                  "-translate-x-12 sm:-translate-x-16",
                ];
                const offsetClass = offsetPattern[exIdx % offsetPattern.length];

                return (
                  <div
                    key={ex._id}
                    className={`relative flex flex-col items-center ${offsetClass} transition-transform duration-200`}
                  >
                    {/* Active Mascot Pointer Badge */}
                    {isCurrent && (
                      <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce-short">
                        <div className="bg-duo-yellow text-slate-900 text-xs font-black px-3 py-1 rounded-xl shadow-md border-b-2 border-duo-yellow-dark uppercase tracking-wider flex items-center gap-1">
                          {ex.type === "dialogue" && <MessageCircle className="w-3.5 h-3.5" />}
                          <span>START +15 XP</span>
                        </div>
                        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-duo-yellow" />
                      </div>
                    )}

                    {/* Stepping Stone Node Button */}
                    <button
                      onClick={() => {
                        playClickSound();
                        setActiveModalExercise(ex);
                      }}
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all border-b-6 active:border-b-0 active:translate-y-2 select-none shadow-md ${
                        completed
                          ? "bg-amber-400 border-amber-600 text-slate-900 hover:brightness-105"
                          : isCurrent
                          ? "bg-duo-yellow border-duo-yellow-dark text-slate-900 ring-8 ring-duo-yellow/30 animate-pulse-glow hover:brightness-105"
                          : "bg-duo-yellow border-duo-yellow-dark text-slate-900 hover:brightness-105"
                      }`}
                      title={ex.title}
                    >
                      {completed ? (
                        <Check className="w-8 h-8 stroke-[3.5] text-white" />
                      ) : ex.type === "dialogue" ? (
                        <MessageCircle className="w-8 h-8 fill-slate-900 text-slate-900" />
                      ) : isCurrent ? (
                        <Star className="w-8 h-8 fill-slate-900 text-slate-900" />
                      ) : (
                        <Star className="w-7 h-7 fill-slate-900/80 text-slate-900/80" />
                      )}

                      {/* Completed 3 Stars overlay */}
                      {completed && (
                        <div className="absolute -bottom-2 flex gap-0.5 bg-white border border-duo-yellow-dark rounded-full px-1.5 py-0.5 shadow-xs">
                          <Star className="w-3 h-3 fill-duo-yellow text-duo-yellow" />
                          <Star className="w-3 h-3 fill-duo-yellow text-duo-yellow" />
                          <Star className="w-3 h-3 fill-duo-yellow text-duo-yellow" />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Unit Milestone Gift Chest */}
              <div className="relative my-4 flex flex-col items-center">
                <button
                  onClick={() => handleChestClick(uIdx)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition border-b-4 active:border-b-0 active:translate-y-1 shadow-md ${
                    isChestClaimed
                      ? "bg-slate-100 border-slate-300 text-slate-400"
                      : "bg-duo-yellow border-duo-yellow-dark text-white hover:scale-105 animate-bounce-short"
                  }`}
                  title={isChestClaimed ? "Chest already claimed" : "Open Unit Reward Chest!"}
                >
                  <Gift className="w-8 h-8" />
                </button>
                <span className="text-[11px] font-black uppercase text-duo-neutral mt-1">
                  {isChestClaimed ? "Claimed" : "Bonus Chest"}
                </span>
              </div>
            </div>
          </section>
        );
      })}

      {/* Lesson Details Popup Modal */}
      {activeModalExercise && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-duo-gray max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveModalExercise(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-duo-dark p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-duo-yellow-light">
              <span className="text-3xl">
                {activeModalExercise.type === "dialogue" ? "💬" : "🐧"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-duo-blue-light text-duo-blue-dark px-2.5 py-0.5 rounded-full">
                {activeModalExercise.type === "dialogue" ? "Conversation" : activeModalExercise.difficulty} · {activeModalExercise.language.toUpperCase()}
              </span>
              <h3 className="text-xl font-black text-duo-dark mt-2">
                {activeModalExercise.title}
              </h3>
            </div>

            {/* Conversation Partner Question Preview */}
            {activeModalExercise.dialoguePrompt && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-left text-xs">
                <span className="font-black text-duo-orange uppercase">Partner asks:</span>
                <p className="font-bold text-duo-dark mt-0.5">{activeModalExercise.dialoguePrompt}</p>
              </div>
            )}

            <div className="bg-slate-50 border-2 border-duo-gray rounded-2xl p-3 text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                Your Target Response:
              </p>
              <p className="text-sm font-bold text-duo-dark italic">
                "{activeModalExercise.targetText}"
              </p>
              {activeModalExercise.translation && (
                <p className="text-xs text-slate-500 mt-1">
                  🇬🇧 "{activeModalExercise.translation}"
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl py-1.5 px-3">
              <Sparkles className="w-4 h-4 text-duo-yellow fill-duo-yellow" />
              <span className="text-xs font-black text-yellow-800">Reward: +15 XP & 10 Gems</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  navigate(`/exercise/${activeModalExercise._id}`);
                }}
                className="w-full btn-duo-yellow text-base font-black"
              >
                START LESSON
              </button>

              <button
                onClick={() => setActiveModalExercise(null)}
                className="w-full btn-duo-gray"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Language Tutorial Guidebook Modal */}
      {guidebookUnit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-duo-gray max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setGuidebookUnit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-duo-dark p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-duo-blue-light flex items-center justify-center text-2xl">
                📖
              </div>
              <div>
                <p className="text-xs font-black uppercase text-duo-blue">Language Tutorial & Guide</p>
                <h3 className="text-lg font-black text-duo-dark">{guidebookUnit.guidebook.title}</h3>
              </div>
            </div>

            {/* Pronunciation & Grammar Masterclass Tips */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-duo-neutral">
                Pronunciation Masterclass Tips
              </h4>
              {guidebookUnit.guidebook.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-duo-gray rounded-2xl p-3 text-xs leading-relaxed text-duo-dark font-medium"
                >
                  <span className="font-black text-duo-green mr-1.5">Rule {idx + 1}:</span>
                  {tip}
                </div>
              ))}
            </div>

            {/* Key Vocabulary Table with Audio Listen */}
            {guidebookUnit.guidebook.vocab && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-duo-neutral">
                  Key Vocabulary & Phrases
                </h4>
                <div className="divide-y border border-duo-gray rounded-2xl overflow-hidden bg-slate-50">
                  {guidebookUnit.guidebook.vocab.map((v, vIdx) => (
                    <div key={vIdx} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-black text-duo-dark">{v.native}</p>
                        <p className="text-[10px] text-duo-neutral font-medium">
                          {v.phonetic} · <span className="text-slate-500 italic">{v.meaning}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleGuidebookSpeak(v.native, currentLanguage)}
                        className="p-1.5 bg-white border border-duo-gray rounded-xl hover:bg-slate-100 transition text-duo-blue"
                        title="Listen to native audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setGuidebookUnit(null)}
              className="w-full btn-duo-green mt-3"
            >
              Start Practicing!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
