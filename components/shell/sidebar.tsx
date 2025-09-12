"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  Activity,
  CheckSquare,
  BarChart3,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";

const NavItem = ({
  href,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}) => {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-neutral-100 relative",
        active &&
          "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100",
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 transition-colors",
          active
            ? "text-indigo-600"
            : "text-neutral-500 group-hover:text-neutral-700",
        )}
      />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
          {badge}
        </span>
      )}
      {active && <ChevronRight className="w-4 h-4 text-indigo-500" />}
    </Link>
  );
};

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-neutral-200/60 lg:bg-neutral-50/30 lg:backdrop-blur-sm">
      <div className="h-16 px-6 flex items-center border-b border-neutral-200/60 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">CRM</h1>
            <p className="text-xs text-neutral-500 -mt-0.5">Professional</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-6">
          <NavItem href="/dashboard" label="Dashboard" icon={LayoutDashboard} />
        </div>

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            CRM
          </p>
          <NavItem href="/contacts" label="Contacts" icon={Users} badge="24" />
          <NavItem
            href="/companies"
            label="Companies"
            icon={Building2}
            badge="8"
          />
          <NavItem href="/deals" label="Deals" icon={Target} badge="12" />
        </div>

        <div className="space-y-1 mt-6">
          <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Work
          </p>
          <NavItem
            href="/activities"
            label="Activities"
            icon={Activity}
            badge="5"
          />
          <NavItem href="/tasks" label="Tasks" icon={CheckSquare} badge="7" />
        </div>

        <div className="space-y-1 mt-6">
          <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Insights
          </p>
          <NavItem href="/reports" label="Reports" icon={BarChart3} />
        </div>
      </nav>

      <div className="p-4 border-t border-neutral-200/60 bg-white">
        <NavItem href="/settings" label="Settings" icon={Settings} />
      </div>
    </aside>
  );
}
