"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import { getTeam, updateTeam } from "@/services/team.services";

export default function EditTeamPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const team = await getTeam(id);

        setName(team.name);
        setDescription(team.description);
      } catch (err) {
        console.error("Failed to load team:", err);
        setError("Failed to load team.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTeam();
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Team name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateTeam(id, {
        name: name.trim(),
        description: description.trim(),
      });

      router.push(`/teams/${id}`);
    } catch (err: any) {
      console.error("Failed to update team:", err);

      setError(
        err.response?.data?.error ||
          "Failed to update team."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-slate-50 p-6 md:p-8">
          <p className="text-sm text-slate-500">
            Loading team...
          </p>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-2xl">

          <button
            onClick={() => router.push(`/teams/${id}`)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Team
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Edit Team
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update your team information.
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
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push(`/teams/${id}`)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

        </div>
      </main>
    </ProtectedRoute>
  );
}