import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Trophy,
  Target,
  Sparkles,
  Filter,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { getExercises, getCategories, getLanguages } from "../services/exerciseService";
import { useAuth } from "../hooks/useAuth";
import { useGamification } from "../context/GamificationContext";
import DuoSidebar from "../components/common/DuoSidebar";
import DuoHeader from "../components/common/DuoHeader";
import LearningPath from "../components/path/LearningPath";
import DuoMascot from "../components/mascot/DuoMascot";

export default function Dashboard() {
  const { user } = useAuth();
  const { streak, dailyQuests, league } = useGamification();

  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    Promise.all([getExercises(), getCategories(), getLanguages()])
      .then(([exercisesData, categoriesData, languagesData]) => {
        setExercises(exercisesData || []);
        setCategories(categoriesData || []);
        setLanguages(languagesData || []);
      })
      .catch((err) => {
        console.error("Could not load exercises", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Filter exercises
  const filteredExercises = exercises.filter((ex) => {
    if (selectedLanguage && ex.language !== selectedLanguage) return false;
    if (selectedDifficulty && ex.difficulty !== selectedDifficulty) return false;
    if (selectedCategory && ex.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row select-none">
      {/* Duo Speech Sidebar Navigation */}
      <DuoSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <DuoHeader
          currentLang={selectedLanguage}
          onLangChange={setSelectedLanguage}
          availableLangs={languages}
        />

        <div className="max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Center Column: The Duo Speech Learning Path (The Snake) */}
          <div className="lg:col-span-2">
            {/* Quick Filters Pill Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-2">
              <button
                onClick={() => {
                  setSelectedDifficulty("");
                  setSelectedCategory("");
                }}
                className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border-2 transition whitespace-nowrap ${
                  !selectedDifficulty && !selectedCategory
                    ? "bg-duo-yellow text-slate-900 border-duo-yellow-dark"
                    : "bg-slate-50 text-duo-dark border-duo-gray hover:bg-slate-100"
                }`}
              >
                All Levels
              </button>
              <button
                onClick={() => setSelectedDifficulty("beginner")}
                className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border-2 transition whitespace-nowrap ${
                  selectedDifficulty === "beginner"
                    ? "bg-duo-yellow text-slate-900 border-duo-yellow-dark"
                    : "bg-slate-50 text-duo-dark border-duo-gray hover:bg-slate-100"
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setSelectedDifficulty("intermediate")}
                className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border-2 transition whitespace-nowrap ${
                  selectedDifficulty === "intermediate"
                    ? "bg-duo-yellow text-slate-900 border-duo-yellow-dark"
                    : "bg-slate-50 text-duo-dark border-duo-gray hover:bg-slate-100"
                }`}
              >
                Intermediate
              </button>
              <button
                onClick={() => setSelectedDifficulty("advanced")}
                className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border-2 transition whitespace-nowrap ${
                  selectedDifficulty === "advanced"
                    ? "bg-duo-yellow text-slate-900 border-duo-yellow-dark"
                    : "bg-slate-50 text-duo-dark border-duo-gray hover:bg-slate-100"
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setSelectedCategory("tongue-twisters")}
                className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border-2 transition whitespace-nowrap ${
                  selectedCategory === "tongue-twisters"
                    ? "bg-duo-purple text-white border-duo-purple-dark"
                    : "bg-slate-50 text-duo-dark border-duo-gray hover:bg-slate-100"
                }`}
              >
                Tongue Twisters
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <DuoMascot mood="thinking" size="md" message="Loading your speech path..." />
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="card-duo text-center py-10 space-y-3">
                <DuoMascot mood="idle" size="sm" className="justify-center" />
                <p className="font-black text-duo-dark text-lg">No exercises for this filter</p>
                <button
                  onClick={() => {
                    setSelectedLanguage("");
                    setSelectedDifficulty("");
                    setSelectedCategory("");
                  }}
                  className="btn-duo-green mx-auto text-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <LearningPath
                exercises={filteredExercises}
                currentLanguage={selectedLanguage || "en"}
              />
            )}
          </div>

          {/* Right Column: Duo Speech Widgets (Quests, League, Mascot encouragement) */}
          <div className="space-y-5 hidden lg:block">
            {/* Daily Streak Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-duo-orange fill-duo-orange animate-bounce-short" />
                  <span className="text-xs font-black uppercase text-duo-orange tracking-wider">
                    Speech Habit
                  </span>
                </div>
                <span className="text-sm font-black text-duo-dark">{streak} Days</span>
              </div>
              <p className="text-xs font-bold text-duo-dark">
                Practicing just 2 minutes every day produces lasting speech improvements!
              </p>
            </div>

            {/* Daily Quests Mini Widget */}
            <div className="bg-white border-2 border-duo-gray rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-duo-orange" />
                  <h3 className="text-sm font-black text-duo-dark uppercase tracking-wider">
                    Daily Quests
                  </h3>
                </div>
                <Link
                  to="/quests"
                  className="text-xs font-black uppercase text-duo-blue hover:underline flex items-center"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mini quest item 1 */}
              <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 border border-duo-gray">
                <div className="flex justify-between text-xs font-bold text-duo-dark">
                  <span>Complete 2 lessons</span>
                  <span className="text-duo-neutral">
                    {Math.min(2, dailyQuests.lessonsDone)}/2
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-duo-yellow h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (dailyQuests.lessonsDone / 2) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Mini quest item 2 */}
              <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 border border-duo-gray">
                <div className="flex justify-between text-xs font-bold text-duo-dark">
                  <span>Earn 30 XP</span>
                  <span className="text-duo-neutral">
                    {Math.min(30, dailyQuests.dailyXp)}/30 XP
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-duo-yellow h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (dailyQuests.dailyXp / 30) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* League Leaderboard Mini Widget */}
            <div className="bg-white border-2 border-duo-gray rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-duo-yellow fill-duo-yellow" />
                  <h3 className="text-sm font-black text-duo-dark uppercase tracking-wider">
                    {league || "Bronze"} League
                  </h3>
                </div>
                <Link
                  to="/leaderboard"
                  className="text-xs font-black uppercase text-duo-blue hover:underline flex items-center"
                >
                  Ranks <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-duo-neutral font-medium">
                You are currently in the promotion race! Complete lessons to stay in the top 3.
              </p>
              <Link to="/leaderboard" className="btn-duo-yellow text-xs py-2 w-full">
                View Tournament Table
              </Link>
            </div>

            {/* Mascot Widget */}
            <div className="pt-2">
              <DuoMascot
                mood="idle"
                size="sm"
                message="Choose a lesson on your path to start speaking!"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
