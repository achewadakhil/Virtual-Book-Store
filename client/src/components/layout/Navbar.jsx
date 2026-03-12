import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import Container from "../ui/Container";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { itemCount } = useCart();
  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/books", label: "Books" },
    { to: "/cart", label: `Cart${itemCount ? ` (${itemCount})` : ""}` },
    { to: "/orders", label: "Orders" },
  ];

  if (isAdmin) {
    links.push({ to: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <NavLink
          to="/"
          className="text-lg font-black tracking-[-0.02em] text-slate-900"
          end
        >
          Virtual Book Store
        </NavLink>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap gap-2" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-emerald-100 text-emerald-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
          </nav>

          {isAuthenticated ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">
                {user?.name || "Account"}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                [
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800",
                ].join(" ")
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </Container>
    </header>
  );
}
