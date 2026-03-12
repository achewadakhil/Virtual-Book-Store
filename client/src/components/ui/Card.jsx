export default function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-[1.5rem] border border-white/70 bg-white/72 p-6 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur ${className}`.trim()}
    >
      {children}
    </section>
  );
}
