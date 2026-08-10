"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/context/Authcontext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      login(data.token, data.user);

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Login to your Sprint Board
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black p-2 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="font-medium text-slate-900 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
}