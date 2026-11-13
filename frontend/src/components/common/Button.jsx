// A single, consistent button style used everywhere instead of each
// page repeating its own Tailwind classes (and drifting over time).
export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const base = "rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-slate-800 text-white hover:bg-slate-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-slate-500 underline hover:text-slate-700",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
