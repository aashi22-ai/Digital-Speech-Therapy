import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `text-sm ${location.pathname === path ? "text-slate-800 font-medium" : "text-slate-500"} hover:text-slate-800 transition`;

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200">
      <Link to="/dashboard" className="font-semibold text-slate-800">
        Digital Speech Therapy
      </Link>

      <nav className="flex items-center gap-5">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/history" className={linkClass("/history")}>
          History
        </Link>
        {user?.isAdmin && (
          <Link to="/admin" className={linkClass("/admin")}>
            Admin
          </Link>
        )}
        {user && <span className="text-sm text-slate-400">Hi, {user.name}</span>}
        <button onClick={logout} className="text-sm text-slate-500 underline hover:text-slate-800">
          Log out
        </button>
      </nav>
    </header>
  );
}
