"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

interface Task extends Record<string, unknown> {
  id: string;
  title: string;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
  company?: {
    id: string;
    name: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  deal?: {
    id: string;
    title: string;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      const tasksArray = Array.isArray(data) ? data : [];
      setTasks(tasksArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "title" as keyof Task,
      header: "Task",
      sortable: true,
      render: (value: unknown, row: Task) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${row.completedAt ? "bg-green-500" : "bg-blue-500"}`}
          >
            {row.completedAt ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </div>
          <div>
            <div
              className={`font-medium ${row.completedAt ? "line-through text-gray-500" : "text-gray-900"}`}
            >
              {String(value)}
            </div>
            {row.deal && (
              <div className="text-sm text-gray-500">
                Deal: {row.deal.title}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "dueAt" as keyof Task,
      header: "Due Date",
      sortable: true,
      render: (value: unknown, row: Task) => {
        if (!value) return <span className="text-gray-500">No due date</span>;

        const dueDate = new Date(String(value));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isOverdue = dueDate < today && !row.completedAt;
        const isDueToday = dueDate.toDateString() === today.toDateString();

        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span
              className={`${isOverdue ? "text-red-600 font-medium" : isDueToday ? "text-orange-600 font-medium" : "text-gray-700"}`}
            >
              {dueDate.toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      key: "contact" as keyof Task,
      header: "Contact",
      sortable: false,
      render: (value: unknown, row: Task) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">
            {row.contact
              ? `${row.contact.firstName} ${row.contact.lastName}`
              : "No contact"}
          </span>
        </div>
      ),
    },
    {
      key: "company" as keyof Task,
      header: "Company",
      sortable: false,
      render: (value: unknown, row: Task) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">
            {row.company?.name || "No company"}
          </span>
        </div>
      ),
    },
    {
      key: "completedAt" as keyof Task,
      header: "Status",
      sortable: true,
      render: (value: unknown, row: Task) => {
        if (value) {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
          );
        }

        if (row.dueAt) {
          const dueDate = new Date(row.dueAt);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (dueDate < today) {
            return (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Overdue
              </span>
            );
          }

          if (dueDate.toDateString() === today.toDateString()) {
            return (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Due Today
              </span>
            );
          }
        }

        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Open
          </span>
        );
      },
    },
  ];

  const handleEdit = (task: Task) => {
    console.log("Edit task:", task);
  };

  const handleDelete = (task: Task) => {
    console.log("Delete task:", task);
  };

  const handleView = (task: Task) => {
    console.log("View task:", task);
  };

  // Calculate summary stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: Task) => task.completedAt).length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter((task: Task) => {
    if (task.completedAt || !task.dueAt) return false;
    const dueDate = new Date(task.dueAt);
    return dueDate < today;
  }).length;

  const dueTodayTasks = tasks.filter((task: Task) => {
    if (task.completedAt || !task.dueAt) return false;
    const dueDate = new Date(task.dueAt);
    return dueDate.toDateString() === today.toDateString();
  }).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and to-dos efficiently
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedTasks}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {completionRate}% completion rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-200">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {dueTodayTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AdvancedDataTable
        data={tasks}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        searchPlaceholder="Search tasks by title, company, or contact..."
        exportFilename="tasks"
      />
    </div>
  );
}
