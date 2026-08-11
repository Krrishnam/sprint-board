"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Users } from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import { deleteTeam, getTeam } from "@/services/team.services";
import { Team } from "@/types/team";

export default function TeamDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await getTeam(id);
        setTeam(data);
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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteTeam(id);

      router.push("/teams");
    } catch (err: any) {
      console.error("Failed to delete team:", err);

      setError(
        err.response?.data?.error ||
          "Failed to delete team."
      );

      setDeleting(false);
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

  if (error || !team) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-slate-50 p-6 md:p-8">
          <button
            onClick={() => router.push("/teams")}
            className="mb-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Teams
          </button>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error || "Team not found."}
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl">

          {/* Back */}

          <button
            onClick={() => router.push("/teams")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Teams
          </button>

          {/* Header */}

          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {team.name}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {team.description || "No description provided."}
                </p>
              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  router.push(`/teams/${team.id}/edit`)
                }
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>

          {/* Information */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Team Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Team Name
                </p>

                <p className="mt-2 text-sm font-medium text-slate-800">
                  {team.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Team ID
                </p>

                <p className="mt-2 break-all text-sm text-slate-600">
                  {team.id}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {team.description || "No description provided."}
                </p>
              </div>

            </div>

          </section>

        </div>
      </main>
    </ProtectedRoute>
  );
}