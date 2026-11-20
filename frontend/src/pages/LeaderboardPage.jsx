import React, { useEffect, useState } from "react";
import { Trophy, ChevronUp, ChevronDown, Sparkles, Shield } from "lucide-react";
import DuoSidebar from "../components/common/DuoSidebar";
import DuoHeader from "../components/common/DuoHeader";
import DuoMascot from "../components/mascot/DuoMascot";
import { useGamification } from "../context/GamificationContext";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { weeklyXp, league } = useGamification();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/progress/leaderboard")
      .then((res) => {
        setLeaderboardData(res.data);
      })
      .catch(() => {
        // Offline / fallback displaying the active user
        const userTotal = weeklyXp || 0;
        setLeaderboardData({
          league: league || "Bronze",
          players: [
            {
              rank: 1,
              name: (user?.name || "You") + " (You)",
              avatar: "🐧",
              xp: userTotal,
              isUser: true,
            },
          ],
          daysRemaining: 3,
        });
      })
      .finally(() => setLoading(false));
  }, [user, weeklyXp, league]);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <DuoSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <DuoHeader />

        <main className="max-w-xl mx-auto w-full px-4 py-6 space-y-6">
          {/* League Banner */}
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                Weekly Tournament
              </span>
              <h1 className="text-2xl font-black">{leaderboardData?.league || "Bronze"} League</h1>
              <p className="text-xs font-bold text-white/90">
                Top 3 speech learners advance to the next league!
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🏆
            </div>
          </div>

          {/* Promotion Zone Explainer */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 flex items-center gap-2 text-xs font-bold text-amber-900">
            <ChevronUp className="w-5 h-5 text-amber-600 stroke-[3]" />
            <span>Promotion Zone: Ranks 1 to 3 earn promotion this Sunday!</span>
          </div>

          {/* Leaderboard Table */}
          <div className="border-2 border-duo-gray rounded-3xl overflow-hidden shadow-xs divide-y-2 divide-duo-gray">
            {loading ? (
              <div className="p-8 text-center text-duo-neutral font-bold text-sm">
                Loading league standings...
              </div>
            ) : leaderboardData?.players?.length > 0 ? (
              leaderboardData.players.map((player) => {
                const isPromo = player.rank <= 3;
                const isUser = player.isUser;

                return (
                  <div
                    key={player.userId || player.rank}
                    className={`flex items-center justify-between p-4 transition ${
                      isUser
                        ? "bg-yellow-50/80 font-black border-l-6 border-l-duo-yellow"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Rank indicator */}
                      <div className="w-7 text-center">
                        {player.rank === 1 ? (
                          <span className="text-xl">🥇</span>
                        ) : player.rank === 2 ? (
                          <span className="text-xl">🥈</span>
                        ) : player.rank === 3 ? (
                          <span className="text-xl">🥉</span>
                        ) : (
                          <span className="text-sm font-black text-duo-neutral">
                            {player.rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-xs border border-duo-gray">
                        {player.avatar}
                      </div>

                      {/* Name */}
                      <div>
                        <p
                          className={`text-sm ${
                            isUser ? "font-black text-amber-900" : "font-bold text-duo-dark"
                          }`}
                        >
                          {player.name}
                        </p>
                        {isPromo && (
                          <span className="text-[10px] font-black uppercase text-amber-700 flex items-center gap-0.5">
                            <ChevronUp className="w-3 h-3 stroke-[3]" /> Promoted
                          </span>
                        )}
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <span className="text-sm font-black text-duo-dark">{player.xp}</span>
                      <span className="text-[10px] font-black uppercase text-duo-neutral ml-1">
                        XP
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-duo-neutral font-bold text-sm">
                No registered learners found yet. Complete speech exercises to claim the #1 spot!
              </div>
            )}
          </div>

          {/* Mascot Coaching Tip */}
          <div className="pt-2">
            <DuoMascot
              mood="cheering"
              size="sm"
              message="Complete more speech lessons to climb higher in the league!"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
