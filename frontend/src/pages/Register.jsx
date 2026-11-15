import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";
import { registerUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import DuoMascot from "../components/mascot/DuoMascot";
import { playClickSound } from "../utils/soundEffects";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password verification criteria
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMatch = confirmPassword.length > 0 && confirmPassword === password;
  const hasMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const strengthScore =
    (hasMinLength ? 1 : 0) + (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0);

  const validate = () => {
    const errors = {};
    if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!EMAIL_REGEX.test(email.trim())) errors.email = "Enter a valid email address";
    if (!hasMinLength) errors.password = "Password must be at least 6 characters";
    if (!hasLetter || !hasNumber) errors.password = "Password must include both letters and numbers";
    if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
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
      const { user, token } = await registerUser(
        name.trim(),
        email.trim(),
        password,
        confirmPassword
      );
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 select-none">
      <div className="w-full max-w-sm space-y-6">
        {/* Mascot & Brand Header */}
        <div className="text-center space-y-2">
          <DuoMascot
            mood="cheering"
            size="md"
            className="justify-center"
            message="Join Duospeech! Start your AI speech journey."
          />
          <h1 className="text-2xl sm:text-3xl font-black text-duo-dark tracking-tight">
            Create your profile
          </h1>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border-2 border-duo-gray rounded-3xl p-6 shadow-sm space-y-3.5"
        >
          {serverError && (
            <div className="bg-red-50 border-2 border-red-200 text-duo-red text-xs font-bold p-3 rounded-2xl">
              {serverError}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-duo-neutral mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl px-4 py-2.5 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-blue"
            />
            {fieldErrors.name && (
              <p className="text-xs text-duo-red font-bold mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-duo-neutral mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl px-4 py-2.5 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-blue"
            />
            {fieldErrors.email && (
              <p className="text-xs text-duo-red font-bold mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input with Show/Hide & Live Verification */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black uppercase text-duo-neutral">
                Password
              </label>
              {password && (
                <span className="text-[10px] font-black uppercase tracking-wider text-duo-neutral">
                  {strengthScore === 3
                    ? "Strong"
                    : strengthScore === 2
                    ? "Good"
                    : "Weak"}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl px-4 py-2.5 pr-11 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-blue"
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

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-1.5 space-y-1.5">
                <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      strengthScore >= 1
                        ? strengthScore === 1
                          ? "bg-red-400"
                          : strengthScore === 2
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      strengthScore >= 2
                        ? strengthScore === 2
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      strengthScore === 3 ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                </div>

                {/* Verification checklist pills */}
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                  <span
                    className={`flex items-center gap-0.5 ${
                      hasMinLength ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {hasMinLength ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-3 h-3 inline-block">•</span>}
                    6+ chars
                  </span>
                  <span
                    className={`flex items-center gap-0.5 ${
                      hasLetter && hasNumber ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {hasLetter && hasNumber ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className="w-3 h-3 inline-block">•</span>
                    )}
                    Letters & numbers
                  </span>
                </div>
              </div>
            )}

            {fieldErrors.password && (
              <p className="text-xs text-duo-red font-bold mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password with Live Verification */}
          <div>
            <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-50 border-2 rounded-2xl px-4 py-2.5 pr-11 text-sm font-bold text-duo-dark focus:outline-none transition ${
                  hasMatch
                    ? "border-emerald-400 bg-emerald-50/20"
                    : hasMismatch
                    ? "border-red-300 bg-red-50/20"
                    : "border-duo-gray focus:border-duo-blue"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-duo-dark transition"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Verification Status */}
            {confirmPassword.length > 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold">
                {hasMatch ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Passwords match verified
                  </span>
                ) : (
                  <span className="text-duo-red flex items-center gap-1">
                    <X className="w-3.5 h-3.5 stroke-[3]" /> Passwords do not match
                  </span>
                )}
              </div>
            )}

            {fieldErrors.confirmPassword && (
              <p className="text-xs text-duo-red font-bold mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-duo-yellow text-slate-900 font-black text-sm py-3.5 mt-2 shadow-sm"
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs font-black uppercase tracking-wider text-duo-blue hover:underline"
            >
              Have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
