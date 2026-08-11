"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getTeams } from "@/services/team.services";
import { Team } from "@/types/team";
import TeamPreview from "@/components/dashboard/TeamPreview";

import StatCard from "@/components/dashboard/StatCard";

import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import { useAuth } from "@/context/Authcontext";
import { getTasks } from "@/services/task.service";
import { Task } from "@/types/task";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [taskData, teamData] = await Promise.all([
        getTasks(),
        getTeams(),
      ]);

      setTasks(taskData);
      setTeams(teamData);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalTasks = tasks.length;

  const inProgressTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === "in_progress" ||
          task.status === "active"
      ).length,
    [tasks]
  );

  const completedTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === "done"
      ).length,
    [tasks]
  );

  const highPriorityTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.priority === "high" ||
          task.priority === "critical"
      ).length,
    [tasks]
  );

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        if (!a.created_at || !b.created_at) {
          return 0;
        }

        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      })
      .slice(0, 5);
  }, [tasks]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">

        {/* Header */}

        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-1 text-slate-500">
              Overview of your sprint tasks
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Statistics */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Tasks"
            value={loading ? "..." : totalTasks}
            type="tasks"
          />

          <StatCard
            title="In Progress"
            value={loading ? "..." : inProgressTasks}
            type="progress"
          />

          <StatCard
            title="Completed"
            value={loading ? "..." : completedTasks}
            type="completed"
          />

          <StatCard
            title="High Priority"
            value={loading ? "..." : highPriorityTasks}
            type="priority"
          />
        </div>

        {/* Recent Tasks */}

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-7 py-6">
            <h2 className="text-xl font-bold text-slate-900">
              Recent Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest sprint tasks
            </p>
          </div>

          {loading ? (
            <div className="px-7 py-10 text-center text-slate-500">
              Loading tasks...
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="px-7 py-10 text-center">
              <p className="font-medium text-slate-700">
                No tasks yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first task to get started.
              </p>
            </div>
          ) : (
            <div>
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between border-b border-slate-100 px-7 py-5 last:border-b-0"
                >
                  <div>
                    <p className="text-sm text-slate-400">
                      {task.task_number}
                    </p>

                    <h3 className="mt-1 font-medium text-slate-900">
                      {task.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">
                      {formatStatus(task.status)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {formatPriority(task.priority)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Teams */}

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-7 py-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Teams
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your project teams
              </p>
            </div>

            <button
              onClick={() => router.push("/teams")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </button>

          </div>

          {loading ? (
            <div className="px-7 py-10 text-center text-slate-500">
              Loading teams...
            </div>
          ) : teams.length === 0 ? (
            <div className="px-7 py-10 text-center">

              <p className="font-medium text-slate-700">
                No teams yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create a team to start organizing your projects.
              </p>

              <button
                onClick={() => router.push("/teams/create")}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Create Team
              </button>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {teams.slice(0, 4).map((team) => (
                <button
                  key={team.id}
                  onClick={() =>
                    router.push(`/teams/${team.id}`)
                  }
                  className="block w-full text-left transition hover:bg-slate-50"
                >
                  <TeamPreview team={team} />
                </button>
              ))}

              <div className="p-4">
                <button
                  onClick={() => router.push("/teams/create")}
                  className="w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  + Create New Team
                </button>
              </div>

            </div>
          )}

        </section>

        {/* Quick Actions */}

        <div className="mt-6 flex gap-3">

          <button
            onClick={() => {
              const sprintId = tasks.find(
                (task) => task.sprint_id
              )?.sprint_id;

              if (!sprintId) {
                alert("No sprint is associated with your tasks.");
                return;
              }

              router.push(`/board?sprintId=${sprintId}`);
            }}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Open Sprint Board
          </button>

          <button
            onClick={() => router.push("/tasks")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            View All Tasks
          </button>

          <button
            onClick={() => router.push("/teams")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            View Teams
          </button>

        </div>

      </main>
    </ProtectedRoute>
  );
}

function formatStatus(status: string) {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPriority(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}