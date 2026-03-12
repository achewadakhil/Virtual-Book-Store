import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { endpoints } from "../api/endpoints";
import {
  getApiMessage,
  normalizeApiError,
  unwrapApiResponse,
} from "../api/response";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function BooksPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [books, setBooks] = useState([]);
  const [featuredBook, setFeaturedBook] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantityByBook, setQuantityByBook] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeBookId, setActiveBookId] = useState(null);
  const [isAddingBookId, setIsAddingBookId] = useState(null);
  const [feedback, setFeedback] = useState({ tone: "info", message: "" });
  const deferredSearch = useDeferredValue(searchInput.trim());

  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);

      try {
        let response;

        if (deferredSearch) {
          response = await apiClient.get(
            `${endpoints.books.search}?title=${encodeURIComponent(deferredSearch)}`
          );
        } else if (selectedCategory !== "All") {
          response = await apiClient.get(
            `${endpoints.books.category}?category=${encodeURIComponent(selectedCategory)}`
          );
        } else {
          response = await apiClient.get(endpoints.books.all);
        }

        const nextBooks = unwrapApiResponse(response) || [];
        setBooks(nextBooks);

        if (nextBooks.length === 0) {
          setFeaturedBook(null);
          setActiveBookId(null);
          return;
        }

        setActiveBookId((current) => {
          const preservedBook =
            nextBooks.find((book) => book.id === current) || nextBooks[0];
          return preservedBook.id;
        });
      } catch (error) {
        setBooks([]);
        setFeaturedBook(null);
        setFeedback({
          tone: "error",
          message: normalizeApiError(error),
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCatalog();
  }, [deferredSearch, selectedCategory]);

  useEffect(() => {
    async function loadBookDetails() {
      if (!activeBookId) {
        return;
      }

      setIsDetailLoading(true);

      try {
        const response = await apiClient.get(endpoints.books.byId(activeBookId));
        const book = unwrapApiResponse(response);
        setFeaturedBook(book);
      } catch (error) {
        setFeaturedBook(null);
        setFeedback({
          tone: "error",
          message: normalizeApiError(error),
        });
      } finally {
        setIsDetailLoading(false);
      }
    }

    loadBookDetails();
  }, [activeBookId]);

  const availableCategories = ["All", ...new Set(books.map((book) => book.category))];

  async function handleAddToCart(book) {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: "/books" } });
      return;
    }

    const quantity = Math.max(1, quantityByBook[book.id] || 1);
    setIsAddingBookId(book.id);
    setFeedback({ tone: "info", message: "" });

    try {
      const response = await addItem(book.id, quantity);

      setFeedback({
        tone: "success",
        message: getApiMessage(response, "Book added to cart."),
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: normalizeApiError(error),
      });
    } finally {
      setIsAddingBookId(null);
    }
  }

  function updateQuantity(bookId, value) {
    const parsed = Number(value);
    setQuantityByBook((current) => ({
      ...current,
      [bookId]: Number.isNaN(parsed) || parsed < 1 ? 1 : parsed,
    }));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Book Catalog"
        subtitle="Search the collection, browse by category, inspect details, and add books directly to your cart."
      />

      {feedback.message ? (
        <Alert tone={feedback.tone}>{feedback.message}</Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                Discover
              </p>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                Browse the collection
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Search title
                </span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Try Atomic Habits"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Category
                </span>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-[1.25rem] bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No books matched the current search criteria.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {books.map((book) => {
                const isActive = activeBookId === book.id;
                const quantity = quantityByBook[book.id] || 1;

                return (
                  <article
                    key={book.id}
                    className={`rounded-[1.4rem] border p-5 transition ${
                      isActive
                        ? "border-emerald-300 bg-emerald-50/70 shadow-[0_18px_40px_-28px_rgba(5,150,105,0.55)] dark:bg-emerald-950/30 dark:border-emerald-800"
                        : "border-slate-200 bg-white/70 hover:border-emerald-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-emerald-800 dark:hover:bg-slate-900"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveBookId(book.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                            {book.category}
                          </p>
                          <h3 className="mt-2 text-xl font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                            {book.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{book.author}</p>
                        </div>

                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          Stock {book.stock}
                        </div>
                      </div>
                    </button>

                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {book.description}
                    </p>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {formatCurrency(book.price)}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          max={Math.max(1, book.stock)}
                          value={quantity}
                          onChange={(event) => updateQuantity(book.id, event.target.value)}
                          className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                        <Button
                          onClick={() => handleAddToCart(book)}
                          disabled={book.stock < 1 || isAddingBookId === book.id}
                        >
                          {isAddingBookId === book.id ? "Adding..." : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="space-y-5 self-start">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                Detail View
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                Book spotlight
              </h2>
            </div>
            {featuredBook ? (
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-800">
                #{featuredBook.id}
              </span>
            ) : null}
          </div>

          {isDetailLoading ? (
            <div className="space-y-3">
              <div className="h-8 w-2/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-5 w-1/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-28 animate-pulse rounded-[1.2rem] bg-slate-100 dark:bg-slate-800" />
            </div>
          ) : featuredBook ? (
            <div className="space-y-5">
              <div className="space-y-2 rounded-[1.4rem] bg-slate-950 px-5 py-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  {featuredBook.category}
                </p>
                <h3 className="text-2xl font-black tracking-[-0.04em]">
                  {featuredBook.title}
                </h3>
                <p className="text-sm text-slate-300">{featuredBook.author}</p>
                <p className="text-2xl font-black text-amber-300">
                  {formatCurrency(featuredBook.price)}
                </p>
              </div>

              <div className="grid gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Inventory</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {featuredBook.stock} copies
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-[width]"
                    style={{
                      width: `${Math.min(100, Math.max(8, featuredBook.stock * 10))}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {featuredBook.description}
              </p>

              <div className="rounded-[1.25rem] border border-dashed border-slate-300 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Review the summary here before adding the book to your cart or comparing it with another title.
              </div>
            </div>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Select a book to inspect its details.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
