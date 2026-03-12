import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import { getApiMessage, normalizeApiError, unwrapApiResponse } from "../api/response";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

const paymentMethods = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay at your doorstep when the order arrives.",
  },
  {
    id: "upi",
    label: "Mock UPI",
    description: "Simulate an instant UPI payment confirmation.",
  },
  {
    id: "card",
    label: "Mock Card",
    description: "Simulate a debit or credit card transaction.",
  },
];

function createTransactionId() {
  return `TXN-${Date.now().toString().slice(-8)}`;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function CartPage() {
  const navigate = useNavigate();
  const { requestWithAuth } = useAuth();
  const {
    cart,
    cartMessage,
    clearCart,
    decreaseItem,
    isCartLoading,
    refreshCart,
    removeItem,
    setCartMessage,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [paymentStage, setPaymentStage] = useState("idle");

  async function handleDecrease(bookId) {
    try {
      await decreaseItem(bookId);
    } catch (error) {
      setCartMessage(normalizeApiError(error));
    }
  }

  async function handleRemove(bookId) {
    try {
      await removeItem(bookId);
    } catch (error) {
      setCartMessage(normalizeApiError(error));
    }
  }

  async function handleClearCart() {
    try {
      await clearCart();
    } catch (error) {
      setCartMessage(normalizeApiError(error));
    }
  }

  async function handleCheckout() {
    if (!selectedPayment) {
      setCartMessage("Choose a payment method before placing the order.");
      return;
    }

    setIsCheckingOut(true);

    try {
      setPaymentStage(selectedPayment === "cod" ? "confirming" : "processing");

      if (selectedPayment !== "cod") {
        await wait(1400);
      }

      const response = await requestWithAuth("post", endpoints.orders.checkout, {
        data: {},
      });
      const placedOrder = unwrapApiResponse(response);
      await refreshCart();
      const receipt = {
        transactionId: createTransactionId(),
        paymentMethod: selectedPayment,
        amount: cart.total,
        paidAt: new Date().toISOString(),
        orderId: placedOrder?.orderId || null,
        status: selectedPayment === "cod" ? "pending_collection" : "success",
      };
      navigate("/orders", {
        state: {
          message:
            getApiMessage(response, "Order placed successfully.") +
            (placedOrder?.orderId ? ` Order #${placedOrder.orderId} is confirmed.` : ""),
          receipt,
        },
      });
    } catch (error) {
      setCartMessage(normalizeApiError(error));
    } finally {
      setPaymentStage("idle");
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Cart"
        subtitle="Review selected books, adjust quantities, and prepare for checkout."
      />

      {cartMessage ? <Alert tone="info">{cartMessage}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Cart Lines
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                Editable order draft
              </h2>
            </div>

            {cart.items.length > 0 ? (
              <button
                type="button"
                onClick={handleClearCart}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Clear cart
              </button>
            ) : null}
          </div>

          {isCartLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-[1.35rem] bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : cart.items.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Your cart is empty.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Browse the catalog and add a few titles to see totals and cart actions here.
              </p>
              <Link to="/books" className="mt-5 inline-flex">
                <Button>Browse Books</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <article
                  key={item.bookId}
                  className="animate-fade-up rounded-[1.35rem] border border-slate-200 bg-white/80 p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-32px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950/50"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <span>Unit {formatCurrency(item.unitPrice)}</span>
                        <span>Qty {item.quantity}</span>
                        <span>Subtotal {formatCurrency(item.subtotal)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item.bookId)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        Decrease
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.bookId)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-5 self-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              Summary
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
              Cart snapshot
            </h2>
          </div>

          <div className="rounded-[1.4rem] bg-slate-950 px-5 py-5 text-white">
            <div className="flex items-center justify-between py-2 text-sm text-slate-300">
              <span>Items</span>
              <span className="font-semibold text-white">{cart.items.length}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm text-slate-300">
              <span>Total quantity</span>
              <span className="font-semibold text-white">
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="mt-3 border-t border-white/10 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                Current total
              </p>
              <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-amber-300">
                {formatCurrency(cart.total)}
              </p>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-dashed border-slate-300 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Confirm your order here, choose a payment option, and head straight to your order summary.
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                Payment Method
              </p>
              <h3 className="mt-2 text-lg font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                Choose how you want to pay
              </h3>
            </div>

            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`cursor-pointer rounded-[1.15rem] border px-4 py-4 transition ${
                    selectedPayment === method.id
                      ? "border-emerald-300 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/30"
                      : "border-slate-200 bg-white/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="mt-1 h-4 w-4 accent-emerald-700"
                    />
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{method.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {paymentStage !== "idle" ? (
              <Alert tone="info">
                {paymentStage === "processing"
                  ? "Processing payment..."
                  : "Confirming order with cash on delivery..."}
              </Alert>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCheckout}
              disabled={cart.items.length === 0 || isCheckingOut}
            >
              {isCheckingOut ? "Placing Order..." : "Checkout Now"}
            </Button>
            <Link to="/orders" className="inline-flex">
              <Button variant="ghost">View Orders</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
