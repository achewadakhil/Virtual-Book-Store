export default function Button({ children, variant = "primary", type = "button", ...props }) {
  const cls =
    variant === "ghost"
      ? "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(4,120,87,0.75)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-[0_18px_36px_-18px_rgba(4,120,87,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-400 disabled:shadow-none";

  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  );
}
