"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Building2,
  Target,
  Activity,
  Settings,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/modal-provider";

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords: string[];
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { openContactModal, openCompanyModal } = useModal();

  const commands: Command[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      description: "View overview and analytics",
      icon: BarChart3,
      action: () => router.push("/dashboard"),
      keywords: ["dashboard", "home", "overview", "analytics"],
    },
    {
      id: "contacts",
      label: "Contacts",
      description: "Manage customer contacts",
      icon: Users,
      action: () => router.push("/contacts"),
      keywords: ["contacts", "people", "customers", "clients"],
    },
    {
      id: "companies",
      label: "Companies",
      description: "Manage company accounts",
      icon: Building2,
      action: () => router.push("/companies"),
      keywords: ["companies", "organizations", "accounts", "business"],
    },
    {
      id: "deals",
      label: "Deals",
      description: "Track sales opportunities",
      icon: Target,
      action: () => router.push("/deals"),
      keywords: ["deals", "opportunities", "sales", "pipeline"],
    },
    {
      id: "activities",
      label: "Activities",
      description: "View recent activities",
      icon: Activity,
      action: () => router.push("/activities"),
      keywords: ["activities", "timeline", "history", "events"],
    },
    {
      id: "settings",
      label: "Settings",
      description: "Configure your workspace",
      icon: Settings,
      action: () => router.push("/settings"),
      keywords: ["settings", "preferences", "configuration", "options"],
    },
    {
      id: "new-contact",
      label: "New Contact",
      description: "Add a new contact",
      icon: UserPlus,
      action: () => {
        openContactModal();
        setIsOpen(false);
      },
      keywords: ["new", "add", "create", "contact", "person"],
    },
    {
      id: "new-company",
      label: "New Company",
      description: "Add a new company",
      icon: Building2,
      action: () => {
        openCompanyModal();
        setIsOpen(false);
      },
      keywords: ["new", "add", "create", "company", "organization"],
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query.toLowerCase()),
      ) || command.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommand = (command: Command) => {
    command.action();
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center p-4 pt-[20vh]">
        <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          <div className="flex items-center border-b border-neutral-200 px-4">
            <Search className="w-5 h-5 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 px-4 py-4 text-lg bg-transparent outline-none placeholder:text-neutral-400"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-neutral-500 bg-neutral-100 rounded border">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-neutral-500">
                No commands found for &quot;{query}&quot;
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((command) => (
                  <button
                    key={command.id}
                    onClick={() => handleCommand(command)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                      "hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none",
                    )}
                  >
                    <div className="p-2 rounded-lg bg-neutral-50">
                      <command.icon className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-neutral-900">
                        {command.label}
                      </div>
                      {command.description && (
                        <div className="text-sm text-neutral-500 truncate">
                          {command.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
            <div className="flex items-center justify-between">
              <span>Navigate with ↑↓ • Select with ↵</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded border text-[10px]">
                  ⌘K
                </kbd>
                <span>to open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
