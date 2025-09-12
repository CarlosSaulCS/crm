"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  ChevronDown,
  UserPlus,
  Building2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/command-palette";
import { useModal } from "@/components/modal-provider";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { openContactModal, openCompanyModal } = useModal();
  const [showNewDropdown, setShowNewDropdown] = useState(false);

  return (
    <>
      <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts, companies, deals..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 cursor-pointer"
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setShowNewDropdown(!showNewDropdown)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {showNewDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={() => {
                    openContactModal();
                    setShowNewDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-white"
                >
                  <UserPlus className="w-4 h-4" />
                  New Contact
                </button>
                <button
                  onClick={() => {
                    openCompanyModal();
                    setShowNewDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-white"
                >
                  <Building2 className="w-4 h-4" />
                  New Company
                </button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Bell className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {showNewDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNewDropdown(false)}
        />
      )}

      <CommandPalette />
    </>
  );
}
