import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Flame,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  type: "tasks" | "progress" | "completed" | "priority";
};

const icons = {
  tasks: ClipboardList,
  progress: Clock3,
  completed: CheckCircle2,
  priority: Flame,
};

export default function StatCard({
  title,
  value,
  type,
}: StatCardProps) {
  const Icon = icons[type];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}