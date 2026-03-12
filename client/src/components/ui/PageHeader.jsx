export default function PageHeader({ title, subtitle }) {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
