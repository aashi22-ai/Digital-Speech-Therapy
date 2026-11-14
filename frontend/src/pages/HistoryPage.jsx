import React, { useEffect, useState } from "react";
import { LineChart, Calendar, Sparkles, Award } from "lucide-react";
import { getAttemptsByUser } from "../services/attemptService";
import { useAuth } from "../hooks/useAuth";
import DuoSidebar from "../components/common/DuoSidebar";
import DuoHeader from "../components/common/DuoHeader";
import DuoMascot from "../components/mascot/DuoMascot";
import ScoreTrendChart from "../components/progress/ScoreTrendChart";

export default function HistoryPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setError("");
    getAttemptsByUser(user._id)
      .then(setAttempts)
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load your history.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row select-none">
      <DuoSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <DuoHeader />

        <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                Speech Analytics
              </span>
              <h1 className="text-2xl font-black">Practice History & Stats</h1>
              <p className="text-xs font-bold text-white/90">
                Track your pronunciation and fluency growth over time.
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              📈
            </div>
          </div>

          {/* Score Trend Chart Card */}
          {attempts.length > 0 && (
            <div className="bg-white border-2 border-duo-gray rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-duo-purple" />
                <h3 className="text-sm font-black text-duo-dark uppercase tracking-wider">
                  Fluency Trend
                </h3>
              </div>
              <ScoreTrendChart attempts={attempts} />
            </div>
          )}

          {/* History List */}
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-duo-neutral">
              All Attempts ({attempts.length})
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-3">
                <DuoMascot mood="thinking" size="md" message="Loading your practice history..." />
              </div>
            ) : attempts.length === 0 ? (
              <div className="border-2 border-duo-gray rounded-3xl p-8 text-center space-y-3">
                <DuoMascot mood="idle" size="sm" className="justify-center" />
                <p className="font-bold text-duo-dark">No speech attempts yet!</p>
                <p className="text-xs text-duo-neutral">
                  Jump on the learning path and practice your first sentence.
                </p>
              </div>
            ) : (
              attempts.map((a) => (
                <div
                  key={a._id}
                  className="bg-white border-2 border-duo-gray rounded-3xl p-4 shadow-xs hover:border-slate-300 transition space-y-2"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-black text-base text-duo-dark">{a.exerciseTitle}</p>
                      <p className="text-[11px] font-bold text-duo-neutral flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(a.createdAt).toLocaleString()}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-50 text-amber-900 border border-yellow-200 rounded-2xl px-2.5 py-1 text-center">
                        <p className="text-xs font-black">
                          {a.pronunciationScore !== null ? Math.round(a.pronunciationScore) : "—"}%
                        </p>
                        <p className="text-[9px] font-black uppercase text-amber-800">Acc</p>
                      </div>

                      <div className="bg-blue-50 text-duo-blue-dark border border-blue-200 rounded-2xl px-2.5 py-1 text-center">
                        <p className="text-xs font-black">
                          {a.fluencyScore !== null ? Math.round(a.fluencyScore) : "—"}%
                        </p>
                        <p className="text-[9px] font-black uppercase text-duo-blue">Flu</p>
                      </div>
                    </div>
                  </div>

                  {a.transcript && (
                    <div className="bg-slate-50 rounded-2xl p-2.5 border border-duo-gray text-xs font-bold text-duo-dark italic">
                      "{a.transcript}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
