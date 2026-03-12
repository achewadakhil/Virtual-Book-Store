import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/useAuth";

const initialLoginForm = {
  email: "",
  password: "",
};

const initialRegisterForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    authMessage,
    isAuthenticated,
    isSubmitting,
    login,
    register,
    status,
  } = useAuth();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [localMessage, setLocalMessage] = useState("");
  const [messageTone, setMessageTone] = useState("info");

  const redirectTo = location.state?.from || "/books";

  if (status === "bootstrapping") {
    return (
      <Card className="space-y-3">
        <PageHeader
          title="Account Access"
          subtitle="Checking whether you already have a valid session."
        />
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Please wait while the app verifies your stored access token.
        </p>
      </Card>
    );
  }

  if (status === "authenticated" && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLocalMessage("");

    const result = await login(loginForm);
    if (result.ok) {
      navigate(redirectTo, { replace: true });
      return;
    }

    setMessageTone("error");
    setLocalMessage(result.message || "Unable to login.");
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setLocalMessage("");

    const result = await register(registerForm);
    if (result.ok) {
      setMessageTone("success");
      setLocalMessage(result.message || "Registration successful. Please login.");
      setMode("login");
      setRegisterForm(initialRegisterForm);
      return;
    }

    setMessageTone("error");
    setLocalMessage(result.message || "Unable to register.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Access"
        subtitle="Create an account or sign in to save your cart, place orders, and manage your profile."
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
              <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                Welcome
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">
                Pick up where you left off
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Sign in to manage your cart, complete checkout, and review your latest orders from one place.
              </p>
            </div>

            <div className="space-y-5 px-6 py-8 sm:px-8">
              <div className="inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-100"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mode === "register"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-100"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                >
                  Register
                </button>
              </div>

              {(localMessage || authMessage) && (
                <Alert tone={messageTone}>
                  {localMessage || authMessage}
                </Alert>
              )}

              {mode === "login" ? (
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </label>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</span>
                    <input
                      type="text"
                      value={registerForm.name}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Your full name"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
                    <input
                      type="password"
                      minLength={6}
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="At least 6 characters"
                      required
                    />
                  </label>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-xl font-black tracking-[-0.02em] text-slate-900 dark:text-white">
            Why create an account
          </h3>
          <ul className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <li>Keep your selected books ready in the cart.</li>
            <li>Place orders without losing your shopping progress.</li>
            <li>Review your recent purchases whenever you need them.</li>
            <li>Move between browsing, checkout, and account actions without friction.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
