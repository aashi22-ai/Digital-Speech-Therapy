import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import DuoMascot from "../components/mascot/DuoMascot";
import { playClickSound, playSuccessSound } from "../utils/soundEffects";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!EMAIL_REGEX.test(email.trim())) errors.email = "Enter a valid email address";
    if (password.length < 6) errors.password = "Password must be at least 6 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { user, token } = await loginUser(email.trim(), password);
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    playSuccessSound();
    const demoUser = {
      _id: "demo-user-1",
      name: "Speech Learner",
      email: "learner@duospeech.com",
      isAdmin: true,
    };
    login(demoUser, "demo-session-token");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 select-none">
      <div className="w-full max-w-sm space-y-6">
        {/* Mascot & Brand Header */}
        <div className="text-center space-y-2">
          <DuoMascot
            mood="idle"
            size="md"
            className="justify-center"
            message="Welcome to Duospeech! Ready for speech practice?"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-duo-dark tracking-tight">
            Log in to Duospeech
          </h1>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border-2 border-duo-gray rounded-3xl p-6 shadow-sm space-y-4"
        >
          {serverError && (
            <div className="bg-red-50 border-2 border-red-200 text-duo-red text-xs font-bold p-3 rounded-2xl">
              {serverError}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl px-4 py-3 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-blue"
            />
            {fieldErrors.email && (
              <p className="text-xs text-duo-red font-bold mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl px-4 py-3 pr-11 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-blue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-duo-dark transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-duo-red font-bold mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-duo-yellow text-slate-900 font-black text-sm py-3.5 mt-2"
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full btn-duo-blue text-xs py-3 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>TRY DEMO / GUEST MODE</span>
          </button>

          <div className="pt-2 text-center">
            <Link
              to="/register"
              className="text-xs font-black uppercase tracking-wider text-duo-blue hover:underline"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
