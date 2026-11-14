// Renders the real, deterministic word-level comparison computed by the
// AI service (via Python's difflib) — not an LLM guess. Each word of the
// target text is colored by whether it was actually said.
export default function WordDiffDisplay({ wordDiff, extraWords }) {
  if (!wordDiff || wordDiff.length === 0) return null;

  const statusStyles = {
    correct: "text-green-700 bg-green-50",
    different: "text-amber-700 bg-amber-50",
    missing: "text-red-600 bg-red-50 line-through",
  };

  return (
    <div>
      <p className="text-sm text-slate-400 mb-2">Word-level accuracy:</p>
      <div className="flex flex-wrap gap-1.5 bg-slate-50 rounded-md p-3">
        {wordDiff.map((item, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded text-sm ${statusStyles[item.status]}`}
            title={item.status}
          >
            {item.word}
          </span>
        ))}
      </div>

      <div className="flex gap-4 mt-2 text-xs text-slate-400">
        <Legend color="bg-green-50 text-green-700" label="Said correctly" />
        <Legend color="bg-amber-50 text-amber-700" label="Said differently" />
        <Legend color="bg-red-50 text-red-600" label="Missed entirely" />
      </div>

      {extraWords && extraWords.length > 0 && (
        <p className="text-xs text-slate-400 mt-2">
          Extra words you said: <span className="italic">{extraWords.join(", ")}</span>
        </p>
      )}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-2.5 h-2.5 rounded-sm ${color.split(" ")[0]}`} />
      {label}
    </span>
  );
}
