export default function ProgressStats({ progress }) {
  if (!progress) return null;

  const { totalAttempts, averageScore, lastPracticed } = progress;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <StatCard label="Total attempts" value={totalAttempts} />
      <StatCard label="Average score" value={totalAttempts > 0 ? Math.round(averageScore) : "—"} />
      <StatCard
        label="Last practiced"
        value={lastPracticed ? new Date(lastPracticed).toLocaleDateString() : "Never"}
        small
      />
    </div>
  );
}

function StatCard({ label, value, small }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
      <p className={small ? "text-sm font-semibold text-slate-800" : "text-2xl font-semibold text-slate-800"}>
        {value}
      </p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
