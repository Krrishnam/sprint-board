import { Users } from "lucide-react";
import { Team } from "@/types/team";

interface TeamPreviewProps {
  team: Team;
}

export default function TeamPreview({ team }: TeamPreviewProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Users size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-800">
          {team.name}
        </h3>

        <p className="mt-1 truncate text-xs text-slate-400">
          {team.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}