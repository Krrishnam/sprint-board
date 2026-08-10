"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import {
    getTasks,
    updateTask,
    deleteTask,
} from "@/services/task.service";

import {
    Task,
    UpdateTaskRequest,
} from "@/types/task";

import TaskFilters from "@/components/task/TaskFilter";
import TaskTable from "@/components/task/TaskTable";
import EditTaskModal from "@/components/task/EditTaskModel";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("all");
    const [priorityFilter, setPriorityFilter] =
        useState("all");

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    const [deletingId, setDeletingId] =
        useState<string | null>(null);

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error(
                "Failed to load tasks:",
                error
            );

            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const filteredTasks = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        const normalize = (value: string | undefined) =>
            (value ?? "")
                .toLowerCase()
                .replace(/\s+/g, "_");

        return tasks.filter((task) => {
            const taskStatus = normalize(task.status);
            const taskPriority = normalize(task.priority);

            const matchesSearch =
                searchText === "" ||
                (task.title ?? "")
                    .toLowerCase()
                    .includes(searchText) ||
                (task.task_number ?? "")
                    .toLowerCase()
                    .includes(searchText) ||
                (task.description ?? "")
                    .toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                taskStatus === normalize(statusFilter);

            const matchesPriority =
                priorityFilter === "all" ||
                taskPriority === normalize(priorityFilter);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
    ]);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            await deleteTask(id);

            setTasks((previous) =>
                previous.filter(
                    (task) => task.id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete task:",
                error
            );

            alert("Failed to delete task");
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdate = async (
        id: string,
        data: UpdateTaskRequest
    ) => {
        try {
            const updated = await updateTask(
                id,
                data
            );

            setTasks((previous) =>
                previous.map((task) =>
                    task.id === id
                        ? {
                            ...task,
                            ...updated,
                        }
                        : task
                )
            );

            setEditingTask(null);
        } catch (error) {
            console.error(
                "Failed to update task:",
                error
            );

            alert("Failed to update task");
        }
    };

    return (
        <ProtectedRoute>
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Tasks
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage all your sprint tasks
                    </p>
                </div>

                <button
                    onClick={loadTasks}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Refresh
                </button>
            </div>

            <TaskFilters
                search={search}
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                onSearchChange={setSearch}
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
            />

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-xl bg-white p-10 text-center text-slate-500">
                    Loading tasks...
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <h2 className="font-semibold text-slate-700">
                        No tasks found
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                <TaskTable
                    tasks={filteredTasks}
                    deletingId={deletingId}
                    onEdit={setEditingTask}
                    onDelete={handleDelete}
                />
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() =>
                        setEditingTask(null)
                    }
                    onSave={handleUpdate}
                />
            )}
        </main>
        </ProtectedRoute>
    );
}