import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import {
  getApiMessage,
  normalizeApiError,
  unwrapApiResponse,
} from "../api/response";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/useAuth";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

function formatPaymentMethod(method) {
  if (method === "cod") {
    return "Cash on Delivery";
  }
  if (method === "upi") {
    return "Mock UPI";
  }
  if (method === "card") {
    return "Mock Card";
  }
  return method || "Unknown";
}

export default function OrdersPage() {
  const location = useLocation();
  const { requestWithAuth } = useAuth();
  const initialMessage = location.state?.message || "";
  const receipt = location.state?.receipt || null;
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(initialMessage);
  const [messageTone, setMessageTone] = useState(initialMessage ? "success" : "info");

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);

      try {
        const response = await requestWithAuth("get", endpoints.orders.all);
        const nextOrders = unwrapApiResponse(response) || [];
        setOrders(nextOrders);

        if (!initialMessage) {
          setMessage(getApiMessage(response, ""));
          setMessageTone("info");
        }
      } catch (error) {
        setMessage(normalizeApiError(error));
        setMessageTone("error");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [initialMessage, requestWithAuth]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Order History"
        subtitle="Track your recent purchases, review payment details, and revisit order totals anytime."
      />

      {receipt ? (
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-9 w-9 text-emerald-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Payment complete
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                    Your order is confirmed
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-300">
                Your payment details have been captured and your order is on its way to processing.
              </p>
            </div>

            <div className="space-y-4 px-6 py-8 sm:px-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Transaction ID
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                    {receipt.transactionId}
                  </p>
                </div>
                <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Payment Method
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatPaymentMethod(receipt.paymentMethod)}
                  </p>
                </div>
                <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Amount
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(receipt.amount)}
                  </p>
                </div>
                <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Completed At
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatDate(receipt.paidAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.15rem] border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                Order reference: {receipt.orderId ? `#${receipt.orderId}` : "Generated"}.
                Status: {receipt.status === "success" ? "Paid" : "Cash to be collected on delivery"}.
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {message ? <Alert tone={messageTone}>{message}</Alert> : null}

      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="space-y-4">
              <div className="h-8 w-48 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-5 w-32 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-20 animate-pulse rounded-[1.2rem] bg-slate-100 dark:bg-slate-800" />
            </Card>
          ))
        ) : orders.length === 0 ? (
          <Card className="space-y-3">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">No orders yet.</p>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Once you checkout from the cart, the placed orders will appear here with
              their line items and totals.
            </p>
          </Card>
        ) : (
          orders.map((order, index) => (
            <Card
              key={order.orderId}
              className="animate-fade-up space-y-5"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                    Order #{order.orderId}
                  </p>
                  <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                    {formatCurrency(order.totalCost)}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Placed on {formatDate(order.orderDate)}
                  </p>
                </div>

                <span className="self-start rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                  {order.status}
                </span>
              </div>

              <div className="grid gap-3">
                {order.items.map((item) => (
                  <div
                    key={`${order.orderId}-${item.bookId}`}
                    className="rounded-[1.2rem] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-black tracking-[-0.02em] text-slate-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Unit {formatCurrency(item.unitPrice)} | Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
