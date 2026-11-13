// A real animated loading indicator, replacing plain "Loading..." text.
export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
      <div className="h-6 w-6 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
