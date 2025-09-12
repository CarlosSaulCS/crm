"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Target,
  DollarSign,
  Calendar,
  TrendingUp,
  User,
  CheckCircle,
} from "lucide-react";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

interface Deal extends Record<string, unknown> {
  id: string;
  title: string;
  amount: number;
  status: string;
  closeDate: string | null;
  company?: {
    id: string;
    name: string;
  } | null;
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  stage?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch("/api/deals");
      const data = await response.json();
      const dealsArray = Array.isArray(data) ? data : [];
      setDeals(dealsArray);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "title" as keyof Deal,
      header: "Deal",
      sortable: true,
      render: (value: unknown, row: Deal) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            {String(value).charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{String(value)}</div>
            <div className="text-sm text-gray-500">
              {row.company?.name || "No company"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "amount" as keyof Deal,
      header: "Value",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-green-600">
            ${typeof value === "number" ? value.toLocaleString() : "0"}
          </span>
        </div>
      ),
    },
    {
      key: "status" as keyof Deal,
      header: "Status",
      sortable: true,
      render: (value: unknown) => {
        const status = String(value || "OPEN");
        const statusColors = {
          OPEN: "bg-blue-100 text-blue-800",
          WON: "bg-green-100 text-green-800",
          LOST: "bg-red-100 text-red-800",
          PENDING: "bg-yellow-100 text-yellow-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.OPEN}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "contact" as keyof Deal,
      header: "Contact",
      sortable: false,
      render: (value: unknown, row: Deal) => (
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
      key: "closeDate" as keyof Deal,
      header: "Close Date",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">
            {value ? new Date(String(value)).toLocaleDateString() : "Not set"}
          </span>
        </div>
      ),
    },
    {
      key: "stage" as keyof Deal,
      header: "Stage",
      sortable: false,
      render: (value: unknown, row: Deal) => (
        <div className="flex items-center gap-2">
          {row.stage ? (
            <>
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-gray-900">{row.stage.name}</span>
            </>
          ) : (
            <span className="text-gray-500">No stage</span>
          )}
        </div>
      ),
    },
  ];

  const handleEdit = (deal: Deal) => {
    console.log("Edit deal:", deal);
  };

  const handleDelete = (deal: Deal) => {
    console.log("Delete deal:", deal);
  };

  const handleView = (deal: Deal) => {
    console.log("View deal:", deal);
  };

  // Calculate summary stats
  const totalValue = deals.reduce(
    (sum: number, deal: Deal) => sum + (deal.amount || 0),
    0,
  );
  const openDeals = deals.filter((deal: Deal) => deal.status === "OPEN").length;
  const wonDeals = deals.filter((deal: Deal) => deal.status === "WON").length;
  const lostDeals = deals.filter((deal: Deal) => deal.status === "LOST").length;
  const winRate =
    wonDeals + lostDeals > 0
      ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">
            Manage your sales opportunities and pipeline
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pipeline Value
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Open Deals</p>
              <p className="text-2xl font-bold text-gray-900">{openDeals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">{winRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <AdvancedDataTable
        data={deals}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        searchPlaceholder="Search deals by title, company, or status..."
        exportFilename="deals"
      />
    </div>
  );
}
