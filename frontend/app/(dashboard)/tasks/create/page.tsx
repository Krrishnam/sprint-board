"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/services/task.service";
import {
  CreateTaskRequest,
  TaskPriority,
  TaskStatus,
} from "@/types/task";
import api from "@/lib/axios";

type Team = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  team_id: string;
};

type Sprint = {
  id: string;
  name: string;
  project_id: string;
};

export default function CreateTaskPage() {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team_id: "",
    project_id: "",
    sprint_id: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    due_date: "",
  });

  // Load Teams, Projects and Sprints
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [teamsResponse, projectsResponse, sprintsResponse] =
          await Promise.all([
            api.get("/teams"),
            api.get("/projects"),
            api.get("/sprints"),
          ]);

        const teamData = teamsResponse.data;
        const projectData = projectsResponse.data;
        const sprintData = sprintsResponse.data;

        setTeams(
          teamData.map((team: any) => ({
            id: team.id ?? team.ID,
            name: team.name ?? team.Name,
          }))
        );

        setProjects(
          projectData.map((project: any) => ({
            id: project.id ?? project.ID,
            name: project.name ?? project.Name,
            team_id: project.team_id ?? project.TeamID,
          }))
        );

        setSprints(
          sprintData.map((sprint: any) => ({
            id: sprint.id ?? sprint.ID,
            name: sprint.name ?? sprint.Name,
            project_id: sprint.project_id ?? sprint.ProjectID,
          }))
        );
      } catch (err: any) {
        console.error("Failed to load task data:", err);

        setError(
          err?.response?.data?.error ||
            "Failed to load teams, projects and sprints."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Projects belonging to selected Team
  const availableProjects = projects.filter(
    (project) => project.team_id === formData.team_id
  );

  // Sprints belonging to selected Project
  const availableSprints = sprints.filter(
    (sprint) => sprint.project_id === formData.project_id
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "team_id") {
        return {
          ...prev,
          team_id: value,
          project_id: "",
          sprint_id: "",
        };
      }

      if (name === "project_id") {
        return {
          ...prev,
          project_id: value,
          sprint_id: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!formData.team_id) {
      setError("Please select a team.");
      return;
    }

    if (!formData.project_id) {
      setError("Please select a project.");
      return;
    }

    if (!formData.sprint_id) {
      setError("Please select a sprint.");
      return;
    }

    // Get logged-in user
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("User session not found. Please login again.");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch {
      setError("Invalid user session. Please login again.");
      return;
    }

    const userId =
      user.id ??
      user.ID ??
      user.user_id ??
      user.userId;

    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }

    const taskData: CreateTaskRequest = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      project_id: formData.project_id,
      sprint_id: formData.sprint_id,
      created_by_id: userId,
      due_date: formData.due_date || undefined,
    };

    try {
      setLoading(true);

      await createTask(taskData);

      router.push("/tasks");
      router.refresh();
    } catch (err: any) {
      console.error("Create task failed:", err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-8">
        <p className="text-sm text-slate-500">
          Loading teams, projects and sprints...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Task
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new task for your sprint.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Task Title */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Task Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </div>

          {/* Team */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Team
            </label>

            <select
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            >
              <option value="">
                Select team
              </option>

              {teams.map((team) => (
                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Project
            </label>

            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              disabled={!formData.team_id}
              className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {formData.team_id
                  ? "Select project"
                  : "Select team first"}
              </option>

              {availableProjects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sprint */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sprint
            </label>

            <select
              name="sprint_id"
              value={formData.sprint_id}
              onChange={handleChange}
              disabled={!formData.project_id}
              className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {formData.project_id
                  ? "Select sprint"
                  : "Select project first"}
              </option>

              {availableSprints.map((sprint) => (
                <option
                  key={sprint.id}
                  value={sprint.id}
                >
                  {sprint.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="todo">Todo</option>
                <option value="committed">Committed</option>
                <option value="active">Active</option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="in_review">
                  In Review
                </option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

          </div>

          {/* Due Date */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Due Date
            </label>

            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => router.push("/tasks")}
              className="cursor-pointer rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}