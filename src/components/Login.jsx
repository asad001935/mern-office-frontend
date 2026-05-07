import { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi } from "../api/authApi";
import Loader from "./Loader";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await loginApi(email, password);
      const user = res.data;

      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(res.message || "Login successful");

      if (user.role === "Admin") navigate("/dashboard");
      else if (user.role === "Employee") navigate("/employee");
      else if (user.role === "officeBoy") navigate("/office-boy");
      else navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to login. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader text="Logging you in..." />}
      <div className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
        <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <section className="bg-slate-950 p-8 text-white sm:p-10">
              <div className="flex h-full min-h-[360px] flex-col justify-between">
                <div>
                  <div className="mb-8 inline-flex items-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white">
                    Office Food Ordering System
                  </div>

                  <h1 className="max-w-lg text-4xl font-bold leading-tight sm:text-5xl">
                    Smart food ordering for modern workplaces.
                  </h1>

                  <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                    Manage restaurants, employees, office deliveries, and food
                    orders from one centralized platform built for efficiency
                    and simplicity.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white">Fast</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Quick order creation
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white">Secure</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Protected role-based access
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white">Organized</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Centralized management system
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-6 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  Sign in
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Use the account created by the system admin.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </span>
                  <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:bg-white dark:border-slate-600 dark:bg-slate-800 dark:focus-within:bg-slate-700">
                    <Mail
                      size={18}
                      className="text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-transparent text-sm outline-none dark:text-white dark:placeholder:text-slate-500"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </span>
                  <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:bg-white dark:border-slate-600 dark:bg-slate-800 dark:focus-within:bg-slate-700">
                    <Lock
                      size={18}
                      className="text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm outline-none dark:text-white dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  <LogIn size={18} />
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
