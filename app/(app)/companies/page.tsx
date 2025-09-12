"use client";

import { useEffect, useState } from "react";
import { Plus, Building2, Users, Globe, Calendar, MapPin } from "lucide-react";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

interface Company extends Record<string, unknown> {
  id: string;
  name: string;
  industry: string;
  website: string;
  location: string;
  employees: number;
  contacts: { length: number };
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies");
      const data = await response.json();
      const companiesArray = Array.isArray(data.companies)
        ? data.companies
        : [];
      setCompanies(companiesArray);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "name" as keyof Company,
      header: "Company",
      sortable: true,
      render: (value: unknown, row: Company) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            {String(value).charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{String(value)}</div>
            <div className="text-sm text-gray-500">{row.industry}</div>
          </div>
        </div>
      ),
    },
    {
      key: "industry" as keyof Company,
      header: "Industry",
      sortable: true,
      render: (value: unknown) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {String(value)}
        </span>
      ),
    },
    {
      key: "website" as keyof Company,
      header: "Website",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <a
            href={`https://${String(value)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {String(value)}
          </a>
        </div>
      ),
    },
    {
      key: "location" as keyof Company,
      header: "Location",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "employees" as keyof Company,
      header: "Employees",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "contacts" as keyof Company,
      header: "Contacts",
      sortable: true,
      render: (value: unknown) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
          {(value as { length: number })?.length || 0} contacts
        </span>
      ),
    },
    {
      key: "createdAt" as keyof Company,
      header: "Created",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">
            {new Date(String(value)).toLocaleDateString()}
          </span>
        </div>
      ),
    },
  ];

  const handleEdit = (company: Company) => {
    console.log("Edit company:", company);
  };

  const handleDelete = (company: Company) => {
    console.log("Delete company:", company);
  };

  const handleView = (company: Company) => {
    console.log("View company:", company);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage your business relationships and partnerships
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Companies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {companies.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Industries</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(companies.map((c) => c.industry).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {companies
                  .reduce((sum, c) => sum + (c.employees || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-200">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <AdvancedDataTable
        data={companies}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        searchPlaceholder="Search companies by name, industry, or location..."
        exportFilename="companies"
      />
    </div>
  );
}
