import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ScoreTrendChart({ attempts }) {
  const scored = attempts
    .filter((a) => a.pronunciationScore !== null && a.fluencyScore !== null)
    .slice()
    .reverse()
    .map((a, index) => ({
      name: `#${index + 1}`,
      Pronunciation: Math.round(a.pronunciationScore),
      Fluency: Math.round(a.fluencyScore),
    }));

  if (scored.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-sm text-slate-400 mb-6">
        Complete a few exercises to see your progress trend here.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <p className="text-sm font-medium text-slate-700 mb-2">Score trend</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={scored}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="Pronunciation" stroke="#1e293b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Fluency" stroke="#0ea5e9" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
