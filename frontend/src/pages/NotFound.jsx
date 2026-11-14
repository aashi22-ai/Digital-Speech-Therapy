import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-slate-800">Page not found</h1>
        <p className="text-sm text-slate-500">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="text-sm text-slate-800 underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
