"use client";

import {
  TaskPriority,
  TaskStatus,
} from "@/types/task";

interface TaskFiltersProps {
  search: string;
  statusFilter: string;
  priorityFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
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

export default function TaskFilters({
  search,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="all">
            All Statuses
          </option>

          {statusOptions.map((status) => (
            <option
              key={status}
              value={status}
            >
              {statusLabel[status]}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            onPriorityChange(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="all">
            All Priorities
          </option>

          {priorityOptions.map((priority) => (
            <option
              key={priority}
              value={priority}
            >
              {priority.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}