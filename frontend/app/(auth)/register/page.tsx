"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
      });

      // Registration successful
      // User must login separately
      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Registration failed. Please try again."
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
            Create your account
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create an account to start using SprintBoard
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          {/* Register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black p-2 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-medium text-slate-900 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}