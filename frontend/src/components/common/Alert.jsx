// A small banner for errors/success messages, replacing bare <p> tags
// scattered across pages with inconsistent styling.
export default function Alert({ type = "error", children }) {
  if (!children) return null;

  const styles = {
    error: "bg-red-50 text-red-600 border border-red-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    info: "bg-slate-50 text-slate-600 border border-slate-200",
  };

  return (
    <div className={`text-sm rounded-md px-3 py-2 ${styles[type]}`} role="alert">
      {children}
    </div>
  );
}
