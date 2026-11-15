import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Compass,
  Trophy,
  Target,
  ShoppingBag,
  LineChart,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function DuoSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "LEARN",
      path: "/dashboard",
      icon: Compass,
      color: "text-duo-yellow-dark",
      hoverBg: "hover:bg-duo-yellow-light/40",
      activeBg: "bg-duo-yellow-light/80 border-duo-yellow-dark text-amber-900",
    },
    {
      name: "LEADERBOARDS",
      path: "/leaderboard",
      icon: Trophy,
      color: "text-duo-yellow",
      hoverBg: "hover:bg-yellow-50",
      activeBg: "bg-yellow-100/70 border-duo-yellow-dark text-yellow-800",
    },
    {
      name: "QUESTS",
      path: "/quests",
      icon: Target,
      color: "text-duo-orange",
      hoverBg: "hover:bg-orange-50",
      activeBg: "bg-orange-100/70 border-duo-orange-dark text-orange-800",
    },
    {
      name: "SHOP",
      path: "/shop",
      icon: ShoppingBag,
      color: "text-duo-blue",
      hoverBg: "hover:bg-blue-50",
      activeBg: "bg-blue-100/70 border-duo-blue-dark text-blue-800",
    },
    {
      name: "STATS",
      path: "/history",
      icon: LineChart,
      color: "text-duo-purple",
      hoverBg: "hover:bg-purple-50",
      activeBg: "bg-purple-100/70 border-duo-purple-dark text-purple-800",
    },
  ];

  if (user?.isAdmin) {
    navItems.push({
      name: "ADMIN",
      path: "/admin",
      icon: Shield,
      color: "text-duo-red",
      hoverBg: "hover:bg-red-50",
      activeBg: "bg-red-100/70 border-duo-red-dark text-red-800",
    });
  }

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r-2 border-duo-gray h-screen sticky top-0 bg-white p-4 select-none shrink-0">
        <div>
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-4 mb-4 group">
            <div className="w-9 h-9 rounded-xl bg-duo-yellow border border-duo-yellow-dark flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
              <span className="text-xl">🐧</span>
            </div>
            <div>
              <span className="font-black text-2xl tracking-wider text-amber-500 block leading-tight">
                duospeech
              </span>
              <span className="text-[10px] font-black uppercase text-duo-neutral tracking-widest block">
                Speech Therapy AI
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
                    isActive
                      ? `${item.activeBg} border-2`
                      : `border-transparent text-duo-dark ${item.hoverBg}`
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${isActive ? "scale-110" : item.color} transition-transform`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t-2 border-duo-gray pt-4 space-y-2">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-2xl border border-duo-gray">
            <div className="w-8 h-8 rounded-full bg-duo-blue text-white flex items-center justify-center font-black text-xs">
              {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-black text-duo-dark truncate">{user?.name || "Learner"}</p>
              <p className="text-[10px] text-duo-neutral truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-wider text-duo-neutral hover:text-duo-red rounded-xl hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-duo-gray px-2 py-1.5 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-xl transition ${
                isActive ? "text-duo-yellow-dark font-black" : "text-slate-400"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[9px] font-black uppercase tracking-tighter mt-0.5">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
