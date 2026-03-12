import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const highlights = [
  {
    title: "Smart Discovery",
    description:
      "Search by title, filter by category, and inspect live details before you commit.",
  },
  {
    title: "Fast Cart Flow",
    description:
      "Add books directly from the catalog with quantity controls and clear shopping feedback.",
  },
  {
    title: "Role-Based Access",
    description:
      "User and admin journeys stay separate, with protected flows where they actually matter.",
  },
];

const quickFacts = [
  { value: "100+", label: "Titles ready to explore" },
  { value: "Fast", label: "Smooth browsing and checkout flow" },
  { value: "Clean", label: "Responsive shopping experience" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="animate-fade-up space-y-5">
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              Virtual Book Store
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Find your next favorite book in a store designed to keep things simple.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                Browse popular titles, compare details at a glance, and move from
                discovery to checkout through an interface that feels quick,
                polished, and easy to trust.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/books">
                <Button>Explore Books</Button>
              </Link>
              <Link to="/auth">
                <Button variant="ghost">Login / Register</Button>
              </Link>
            </div>
          </div>

          <div className="animate-fade-up-delay-1 grid gap-3 sm:grid-cols-3">
            {quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-[1.35rem] border border-white/70 bg-white/70 px-4 py-4 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70"
              >
                <p className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
                  {fact.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up-delay-2">
          <div className="animate-float-slow rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_25px_80px_-38px_rgba(15,23,42,0.75)]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Featured Experience
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                    Designed for momentum
                  </h2>
                </div>
                <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-950">
                  Live
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white/8 px-4 py-4">
                  <p className="text-sm font-semibold text-white">Browse collection</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Use search and category filters to narrow the collection in seconds.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/8 px-4 py-4">
                  <p className="text-sm font-semibold text-white">Inspect details</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Spotlight panels reveal price, stock, and description without leaving the page.
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-4 text-slate-950">
                  <p className="text-sm font-black uppercase tracking-[0.15em]">
                    Ready when you are
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Save books to your cart, choose a payment option, and review your latest orders with ease.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item, index) => (
          <Card
            key={item.title}
            className={`space-y-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-30px_rgba(15,23,42,0.35)] ${
              index === 1 ? "bg-emerald-50/70 dark:bg-emerald-950/30" : ""
            }`}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              0{index + 1}
            </p>
            <h3 className="text-xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4 bg-white/80 dark:bg-slate-900/70">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
            Why readers stay
          </p>
          <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
            A bookstore should feel inviting before the first click.
          </h3>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            The homepage now introduces the store with clear value, strong visual rhythm,
            and direct next steps so visitors can start browsing immediately.
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/70 bg-white/70 px-5 py-5 backdrop-blur transition duration-300 hover:border-emerald-200 hover:bg-white dark:border-slate-800/70 dark:bg-slate-900/70 dark:hover:border-emerald-800 dark:hover:bg-slate-900">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Catalog
            </p>
            <p className="mt-3 text-lg font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Browse titles with clear pricing and availability
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/70 bg-white/70 px-5 py-5 backdrop-blur transition duration-300 hover:border-amber-200 hover:bg-white dark:border-slate-800/70 dark:bg-slate-900/70 dark:hover:border-amber-800 dark:hover:bg-slate-900">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              Account
            </p>
            <p className="mt-3 text-lg font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Save your cart and view your recent orders anytime
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/70 bg-white/70 px-5 py-5 backdrop-blur transition duration-300 hover:border-sky-200 hover:bg-white dark:border-slate-800/70 dark:bg-slate-900/70 dark:hover:border-sky-800 dark:hover:bg-slate-900">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              Experience
            </p>
            <p className="mt-3 text-lg font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Smooth layouts, subtle motion, and quick actions
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/70 bg-white/70 px-5 py-5 backdrop-blur transition duration-300 hover:border-slate-300 hover:bg-white dark:border-slate-800/70 dark:bg-slate-900/70 dark:hover:border-slate-700 dark:hover:bg-slate-900">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
              Admin
            </p>
            <p className="mt-3 text-lg font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Keep the catalog fresh and manage inventory with confidence
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
