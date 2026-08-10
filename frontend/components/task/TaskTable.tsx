"use client";

import { Task, TaskStatus } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
  deletingId: string | null;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusLabel: Record<TaskStatus, string> = {
  todo: "Todo",
  committed: "Committed",
  active: "Active",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

export default function TaskTable({
  tasks,
  deletingId,
  onEdit,
  onDelete,
}: TaskTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Task
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Priority
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Story Points
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Assignee
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task,index) => (
              <tr
                key={`${task.id || task.task_number || "task"}-${index}`}
                className="border-b last:border-0 hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p className="text-xs text-slate-400">
                    {task.task_number}
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {task.title ?? "Untitled Task"}
                  </p>

                  {task.description && (
                    <p className="mt-1 max-w-md truncate text-sm text-slate-500">
                      {task.description}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {statusLabel[task.status]}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm font-medium capitalize text-slate-700">
                    {task.priority}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {task.story_points}
                </td>

                <td className="px-5 py-4">
                  {task.assignee?.name ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                        {task.assignee.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="text-sm text-slate-700">
                        {task.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">
                      Unassigned
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === task.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}