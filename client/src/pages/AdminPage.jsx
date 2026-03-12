import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { endpoints } from "../api/endpoints";
import { normalizeApiError, unwrapApiResponse } from "../api/response";
import AdminSectionNav from "../components/admin/AdminSectionNav";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/useAuth";

export default function AdminPage() {
  const { requestWithAuth } = useAuth();
  const [users, setUsers] = useState([]);
  const [bookCount, setBookCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function bootstrapDashboard() {
      try {
        const [booksResponse, usersResponse] = await Promise.all([
          apiClient.get(endpoints.books.all),
          requestWithAuth("get", endpoints.users.all),
        ]);

        setBookCount((unwrapApiResponse(booksResponse) || []).length);
        setUsers(unwrapApiResponse(usersResponse) || []);
      } catch (error) {
        setMessage(normalizeApiError(error));
      }
    }

    bootstrapDashboard();
  }, [requestWithAuth]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Store Dashboard"
        subtitle="Manage the catalog, review account activity, and keep the bookstore up to date."
      />

      <AdminSectionNav />

      {message ? <Alert tone="error">{message}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Quick Actions
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Run the store from one place
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                Add Book
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Add new arrivals with a focused form built for clean, accurate listings.
              </p>
              <Link to="/admin/add-book" className="mt-4 inline-flex">
                <Button>Add New Book</Button>
              </Link>
            </div>
            <div className="rounded-[1.35rem] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                Manage Books
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Review inventory, update details, or remove titles that no longer belong in the catalog.
              </p>
              <Link to="/admin/books" className="mt-4 inline-flex">
                <Button variant="ghost">Open Inventory</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.35rem] bg-slate-950 px-5 py-5 text-white dark:bg-slate-900">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                Titles Available
              </p>
              <p className="mt-3 text-3xl font-black tracking-[-0.04em]">{bookCount}</p>
            </div>
            <div className="rounded-[1.35rem] bg-white/80 px-5 py-5 dark:bg-slate-950/50">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Registered Users
              </p>
              <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900 dark:text-white">
                {users.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
              Recent Accounts
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Latest customer activity
            </h2>
          </div>

          <div className="grid gap-3">
            {users.slice(0, 6).map((user) => (
              <article
                key={user.id}
                className="rounded-[1.2rem] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {user.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {user.role}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
