"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import { createTeam } from "@/services/team.services";

export default function CreateTeamPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Team name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createTeam({
        name: name.trim(),
        description: description.trim(),
      });

      router.push("/teams");
    } catch (err: any) {
      console.error("Failed to create team:", err);

      setError(
        err.response?.data?.error ||
          "Failed to create team."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Create Team
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a team for your project.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {error && (
              <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Team Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Engineering"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="What does this team work on?"
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/teams")}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}