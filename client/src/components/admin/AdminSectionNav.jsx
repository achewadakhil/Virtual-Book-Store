import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/add-book", label: "Add Book" },
  { to: "/admin/books", label: "Manage Books" },
];

export default function AdminSectionNav() {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Admin sections">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            [
              "rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5",
              isActive
                ? "bg-slate-950 text-white"
                : "bg-white/85 text-slate-700 hover:bg-white",
            ].join(" ")
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
