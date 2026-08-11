"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import { getTeams } from "@/services/team.services";
import { Team } from "@/types/team";

export default function TeamsPage() {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        console.error("Failed to load teams:", err);
        setError("Failed to load teams.");
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Teams
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your project teams
            </p>
          </div>

          <button
            onClick={() => router.push("/teams/create")}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={17} />
            Create Team
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading teams...
          </p>
        ) : teams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Users
              className="mx-auto text-slate-400"
              size={32}
            />

            <h2 className="mt-3 font-semibold text-slate-800">
              No teams yet
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create your first team to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Users size={21} />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  {team.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {team.description || "No description provided."}
                </p>

                <button
                  onClick={() =>
                    router.push(`/board?teamId=${team.id}`)
                  }
                  className="mt-5 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View Team →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}