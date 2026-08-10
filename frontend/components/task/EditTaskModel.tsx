"use client";

import { useState } from "react";
import {
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskRequest,
} from "@/types/task";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (
    id: string,
    data: UpdateTaskRequest
  ) => Promise<void>;
}

const statusOptions: TaskStatus[] = [
  "todo",
  "committed",
  "active",
  "in_progress",
  "in_review",
  "done",
];

const priorityOptions: TaskPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

const statusLabel: Record<TaskStatus, string> = {
  todo: "Todo",
  committed: "Committed",
  active: "Active",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

export default function EditTaskModal({
  task,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(
    task.title ?? ""
  );

  const [description, setDescription] =
    useState(task.description ?? "");

  const [status, setStatus] =
    useState<TaskStatus>(task.status);

  const [priority, setPriority] =
    useState<TaskPriority>(task.priority);

  const [storyPoints, setStoryPoints] =
    useState(task.story_points);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setSaving(true);

      await onSave(task.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        story_points: storyPoints,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">
              {task.task_number}
            </p>

            <h2 className="text-xl font-bold text-slate-900">
              Edit Task
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as TaskStatus
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {statusLabel[option]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as TaskPriority
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {priorityOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Story Points
            </label>

            <input
              type="number"
              min={0}
              value={storyPoints}
              onChange={(e) =>
                setStoryPoints(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}