"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  PlusCircle,
  KanbanSquare,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Sprint Board",
    href: "/teams",
    icon: KanbanSquare,
  },
  {
    name: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    name: "Create Task",
    href: "/tasks/create",
    icon: PlusCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}

      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            SprintBoard
          </h1>

          <p className="text-xs text-slate-400">
            Team workspace
          </p>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs text-slate-400">
          SprintBoard
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Task management workspace
        </p>
      </div>
    </aside>
  );
}