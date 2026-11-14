import React, { useEffect, useState } from "react";
import { Plus, Trash2, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { getExercises, createExercise, deleteExercise } from "../services/exerciseService";
import DuoSidebar from "../components/common/DuoSidebar";
import DuoHeader from "../components/common/DuoHeader";

const emptyForm = {
  title: "",
  type: "sentence",
  category: "general",
  language: "en",
  targetText: "",
  difficulty: "beginner",
};

export default function AdminPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadExercises = () => {
    setLoading(true);
    getExercises()
      .then(setExercises)
      .catch((err) => setError(err.response?.data?.message || "Could not load exercises."))
      .finally(() => setLoading(false));
  };

  useEffect(loadExercises, []);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.targetText.trim()) {
      setError("Title and target text are required.");
      return;
    }

    setCreating(true);
    try {
      await createExercise(form);
      setSuccess("Exercise created successfully!");
      setForm(emptyForm);
      loadExercises();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create exercise.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteExercise(id);
      setExercises((prev) => prev.filter((ex) => ex._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete exercise.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row select-none">
      <DuoSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <DuoHeader />

        <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                Administration
              </span>
              <h1 className="text-2xl font-black">Speech Curriculum Admin</h1>
              <p className="text-xs font-bold text-white/90">
                Add, manage, and curate speech therapy exercises.
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🛡️
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-duo-red text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-yellow-50 border-2 border-yellow-200 text-amber-900 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          {/* New Exercise Form */}
          <form
            onSubmit={handleCreate}
            className="bg-white border-2 border-duo-gray rounded-3xl p-6 shadow-xs space-y-4"
          >
            <h2 className="text-base font-black text-duo-dark uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-600" />
              <span>Add New Speech Exercise</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange("title")}
                  placeholder="e.g. Vowel Clarity Practice"
                  className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl p-3 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-yellow-dark"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
                    Difficulty
                  </label>
                  <select
                    value={form.difficulty}
                    onChange={handleChange("difficulty")}
                    className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl p-3 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-green"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={handleChange("category")}
                    placeholder="e.g. greetings"
                    className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl p-3 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
                    Language
                  </label>
                  <select
                    value={form.language}
                    onChange={handleChange("language")}
                    className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl p-3 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-green"
                  >
                    <option value="en">English (en)</option>
                    <option value="es">Spanish (es)</option>
                    <option value="fr">French (fr)</option>
                    <option value="hi">Hindi (hi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-duo-neutral mb-1">
                  Target Speech Phrase
                </label>
                <textarea
                  value={form.targetText}
                  onChange={handleChange("targetText")}
                  rows={2}
                  placeholder="The exact sentence or paragraph to be pronounced..."
                  className="w-full bg-slate-50 border-2 border-duo-gray rounded-2xl p-3 text-sm font-bold text-duo-dark focus:outline-none focus:border-duo-green"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full btn-duo-yellow text-slate-900 font-black text-sm py-3"
              >
                {creating ? "CREATING..." : "ADD EXERCISE"}
              </button>
            </div>
          </form>

          {/* Existing Exercises */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase text-duo-neutral tracking-wider">
              Existing Curriculum ({exercises.length})
            </h3>

            <div className="space-y-2">
              {exercises.map((ex) => (
                <div
                  key={ex._id}
                  className="bg-white border-2 border-duo-gray rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-duo-dark truncate">{ex.title}</p>
                    <p className="text-xs text-duo-neutral font-medium truncate">
                      {ex.difficulty} · {ex.category} · {ex.language.toUpperCase()} — "{ex.targetText}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(ex._id)}
                    className="text-slate-400 hover:text-duo-red p-2 rounded-xl transition"
                    title="Delete exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
