import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { endpoints } from "../api/endpoints";
import {
  getApiMessage,
  normalizeApiError,
  unwrapApiResponse,
} from "../api/response";
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function AdminBooksPage() {
  const { requestWithAuth } = useAuth();
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("info");

  async function loadBooks() {
    setIsLoading(true);

    try {
      const response = await apiClient.get(endpoints.books.all);
      setBooks(unwrapApiResponse(response) || []);
    } catch (error) {
      setMessage(normalizeApiError(error));
      setMessageTone("error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function beginEdit(book) {
    setEditingBookId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      price: String(book.price),
      category: book.category,
      description: book.description,
      stock: String(book.stock),
    });
  }

  function cancelEdit() {
    setEditingBookId(null);
    setForm(initialForm);
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!editingBookId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await requestWithAuth("put", endpoints.books.update(editingBookId), {
        data: {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
      });

      setMessage(getApiMessage(response, "Book updated successfully."));
      setMessageTone("success");
      cancelEdit();
      await loadBooks();
    } catch (error) {
      setMessage(normalizeApiError(error));
      setMessageTone("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(bookId) {
    try {
      const response = await requestWithAuth("delete", endpoints.books.remove(bookId));
      setMessage(getApiMessage(response, "Book deleted successfully."));
      setMessageTone("success");
      if (editingBookId === bookId) {
        cancelEdit();
      }
      await loadBooks();
    } catch (error) {
      setMessage(normalizeApiError(error));
      setMessageTone("error");
    }
  }

  async function handleLoadSamples() {
    try {
      const response = await requestWithAuth("post", endpoints.books.load, {
        data: {},
      });
      setMessage(getApiMessage(response, "Sample books loaded successfully."));
      setMessageTone("success");
      await loadBooks();
    } catch (error) {
      setMessage(normalizeApiError(error));
      setMessageTone("error");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Books"
        subtitle="Review the catalog, update book details, and remove outdated titles when needed."
      />

      <AdminSectionNav />

      {message ? <Alert tone={messageTone}>{message}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                Inventory
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                Current catalog
              </h2>
            </div>
              <Button type="button" variant="ghost" onClick={handleLoadSamples}>
              Load Starter Collection
              </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-[1.3rem] bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {books.map((book, index) => (
                <article
                  key={book.id}
                  className="animate-fade-up rounded-[1.3rem] border border-slate-200 bg-white/85 p-5 dark:border-slate-800 dark:bg-slate-950/50"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                          {book.category}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          Stock {book.stock}
                        </span>
                      </div>
                      <h3 className="text-xl font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                        {book.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{book.author}</p>
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {book.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {formatCurrency(book.price)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => beginEdit(book)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(book.id)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-5 self-start">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Edit Panel
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                {editingBookId ? `Editing #${editingBookId}` : "Choose a book"}
              </h2>
            </div>
            {editingBookId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            ) : null}
          </div>

          {editingBookId ? (
            <form className="space-y-4" onSubmit={handleSave}>
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
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</span>
                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </label>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-slate-300 px-4 py-6 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Select a title from the catalog to update pricing, stock, category, or description details.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
