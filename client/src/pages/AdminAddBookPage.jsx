import { useState } from "react";
import { endpoints } from "../api/endpoints";
import { getApiMessage, normalizeApiError } from "../api/response";
import AdminSectionNav from "../components/admin/AdminSectionNav";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/useAuth";

const initialForm = {
  title: "",
  author: "",
  price: "",
  category: "",
  description: "",
  stock: "",
};

export default function AdminAddBookPage() {
  const { requestWithAuth } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await requestWithAuth("post", endpoints.books.add, {
        data: {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
      });

      setMessage(getApiMessage(response, "Book added successfully."));
      setMessageTone("success");
      setForm(initialForm);
    } catch (error) {
      setMessage(normalizeApiError(error));
      setMessageTone("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Book"
        subtitle="Add a new title with clear pricing, category, stock, and description details."
      />

      <AdminSectionNav />

      {message ? <Alert tone={messageTone}>{message}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              New Catalog Entry
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Publish a new title
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Author</span>
                <input
                  type="text"
                  value={form.author}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, author: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Category</span>
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Price</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Stock</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stock: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</span>
              <textarea
                rows={7}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </label>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Book"}
            </Button>
          </form>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              Helpful reminders
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Keep every listing shopper-ready
            </h2>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-lg font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                Write for clarity
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Clear titles, accurate stock, and strong descriptions help customers decide faster.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-lg font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                Review after publishing
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Use the Manage Books page to adjust pricing, update stock, or refine descriptions later.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
