"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Activity,
} from "lucide-react";

interface ReportData {
  totalContacts: number;
  totalCompanies: number;
  recentContacts: number;
  recentCompanies: number;
  contactGrowth: number;
  companyGrowth: number;
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData>({
    totalContacts: 0,
    totalCompanies: 0,
    recentContacts: 0,
    recentCompanies: 0,
    contactGrowth: 0,
    companyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [contactsRes, companiesRes] = await Promise.all([
        fetch("/api/contacts"),
        fetch("/api/companies"),
      ]);

      const contacts = await contactsRes.json();
      const companies = await companiesRes.json();

      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentContacts = Array.isArray(contacts)
        ? contacts.filter(
            (contact: { createdAt: string }) =>
              new Date(contact.createdAt) > lastWeek,
          ).length
        : 0;

      const recentCompanies = Array.isArray(companies)
        ? companies.filter(
            (company: { createdAt: string }) =>
              new Date(company.createdAt) > lastWeek,
          ).length
        : 0;

      setData({
        totalContacts: Array.isArray(contacts) ? contacts.length : 0,
        totalCompanies: Array.isArray(companies) ? companies.length : 0,
        recentContacts,
        recentCompanies,
        contactGrowth:
          Array.isArray(contacts) && contacts.length > 0
            ? (recentContacts / contacts.length) * 100
            : 0,
        companyGrowth:
          Array.isArray(companies) && companies.length > 0
            ? (recentCompanies / companies.length) * 100
            : 0,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive business insights and performance metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Contact Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total contacts and growth
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : data.totalContacts}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Loading..." : `+${data.recentContacts} this week`}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                {loading ? "..." : `${data.contactGrowth.toFixed(1)}% growth`}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Company Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total companies and performance
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : data.totalCompanies}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Loading..." : `+${data.recentCompanies} this week`}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                {loading ? "..." : `${data.companyGrowth.toFixed(1)}% growth`}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Revenue Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estimated business value
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $
              {loading ? "..." : (data.totalCompanies * 25000).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Estimated total value
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                Pipeline growth
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Activity Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recent activity summary
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : data.recentContacts + data.recentCompanies}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              New entries this week
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Active growth
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Growth Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overall business growth
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading
                ? "..."
                : `${((data.contactGrowth + data.companyGrowth) / 2).toFixed(1)}%`}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Average growth rate
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-teal-600 dark:text-teal-400">
                Positive trend
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Database Summary
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total CRM entries
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : data.totalContacts + data.totalCompanies}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total records in system
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-indigo-600 dark:text-indigo-400">
                Fully operational
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {loading ? "Loading Analytics..." : "Live CRM Analytics"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {loading
              ? "Fetching your latest business data and generating insights..."
              : `Your CRM now contains ${data.totalContacts} contacts and ${data.totalCompanies} companies. Analytics are updated in real-time based on your database.`}
          </p>
        </div>
      </div>
    </div>
  );
}
