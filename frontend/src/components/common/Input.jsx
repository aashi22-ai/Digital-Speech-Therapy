// Consistent form input with an optional inline error message, so every
// form doesn't need to hand-roll its own border/error styling.
export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-slate-600 mb-1">{label}</label>
      )}
      <input
        className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition
          ${error ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-slate-500"}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
