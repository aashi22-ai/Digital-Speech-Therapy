// Consistent dropdown styling to match Input/Button, used for the
// difficulty/category filters on the dashboard.
export default function Select({ label, className = "", children, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs text-slate-500 mb-1">{label}</label>}
      <select
        className={`border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white outline-none focus:border-slate-500 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
