"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Building2,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DashboardData {
  contacts: number;
  companies: number;
  deals: number;
  tasks: number;
  recentContacts: number;
  recentCompanies: number;
  recentDeals: number;
  totalValue: number;
  avgDealValue: number;
  conversionRate: number;
  completedTasks: number;
  overdueTasks: number;
}

interface SalesData {
  month: string;
  revenue: number;
  deals: number;
  leads: number;
}

interface DealStageData {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface ActivityData {
  day: string;
  calls: number;
  meetings: number;
  emails: number;
}

const MetricCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "blue",
  subtitle,
  loading = false,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "orange" | "red" | "purple" | "indigo";
  subtitle?: string;
  loading?: boolean;
}) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-600",
      light: "bg-blue-50",
      border: "border-blue-200",
    },
    green: {
      bg: "from-emerald-500 to-emerald-600",
      text: "text-emerald-600",
      light: "bg-emerald-50",
      border: "border-emerald-200",
    },
    orange: {
      bg: "from-orange-500 to-orange-600",
      text: "text-orange-600",
      light: "bg-orange-50",
      border: "border-orange-200",
    },
    red: {
      bg: "from-red-500 to-red-600",
      text: "text-red-600",
      light: "bg-red-50",
      border: "border-red-200",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      text: "text-purple-600",
      light: "bg-purple-50",
      border: "border-purple-200",
    },
    indigo: {
      bg: "from-indigo-500 to-indigo-600",
      text: "text-indigo-600",
      light: "bg-indigo-50",
      border: "border-indigo-200",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-lg ${colors.light} ${colors.border} border`}
            >
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
              ) : (
                value
              )}
            </h3>
            {change && !loading && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  trend === "up"
                    ? "bg-emerald-100 text-emerald-700"
                    : trend === "down"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
                {change}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl p-6 border border-gray-200/60 shadow-sm ${className}`}
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    contacts: 0,
    companies: 0,
    deals: 0,
    tasks: 0,
    recentContacts: 0,
    recentCompanies: 0,
    recentDeals: 0,
    totalValue: 0,
    avgDealValue: 0,
    conversionRate: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts (in a real app, this would come from APIs)
  const salesData: SalesData[] = [
    { month: "Jan", revenue: 125000, deals: 8, leads: 45 },
    { month: "Feb", revenue: 180000, deals: 12, leads: 52 },
    { month: "Mar", revenue: 220000, deals: 15, leads: 48 },
    { month: "Apr", revenue: 195000, deals: 11, leads: 55 },
    { month: "May", revenue: 280000, deals: 18, leads: 62 },
    { month: "Jun", revenue: 320000, deals: 22, leads: 58 },
  ];

  const dealStageData: DealStageData[] = [
    { name: "Lead", value: 425000, count: 12, color: "#3B82F6" },
    { name: "Qualified", value: 275000, count: 8, color: "#10B981" },
    { name: "Proposal", value: 190000, count: 5, color: "#F59E0B" },
    { name: "Negotiation", value: 315000, count: 6, color: "#EF4444" },
    { name: "Closed Won", value: 350000, count: 4, color: "#8B5CF6" },
  ];

  const activityData: ActivityData[] = [
    { day: "Mon", calls: 12, meetings: 8, emails: 25 },
    { day: "Tue", calls: 15, meetings: 6, emails: 32 },
    { day: "Wed", calls: 8, meetings: 12, emails: 18 },
    { day: "Thu", calls: 18, meetings: 9, emails: 28 },
    { day: "Fri", calls: 14, meetings: 11, emails: 22 },
    { day: "Sat", calls: 5, meetings: 2, emails: 8 },
    { day: "Sun", calls: 3, meetings: 1, emails: 5 },
  ];

  const fetchDashboardData = async () => {
    try {
      const [contactsRes, companiesRes, dealsRes, tasksRes] = await Promise.all(
        [
          fetch("/api/contacts"),
          fetch("/api/companies"),
          fetch("/api/deals"),
          fetch("/api/tasks"),
        ],
      );

      const contactsData = await contactsRes.json();
      const companiesData = await companiesRes.json();
      const dealsData = await dealsRes.json();
      const tasksData = await tasksRes.json();

      // Extract arrays from API response
      const contactsArray = Array.isArray(contactsData.contacts)
        ? contactsData.contacts
        : [];
      const companiesArray = Array.isArray(companiesData.companies)
        ? companiesData.companies
        : [];
      const dealsArray = Array.isArray(dealsData.deals) ? dealsData.deals : [];
      const tasksArray = Array.isArray(tasksData.tasks) ? tasksData.tasks : [];

      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentContacts = contactsArray.filter(
        (contact: { createdAt: string }) =>
          new Date(contact.createdAt) > lastWeek,
      ).length;

      const recentCompanies = companiesArray.filter(
        (company: { createdAt: string }) =>
          new Date(company.createdAt) > lastWeek,
      ).length;

      const recentDeals = dealsArray.filter(
        (deal: { createdAt: string }) => new Date(deal.createdAt) > lastWeek,
      ).length;

      const totalValue = dealsArray.reduce(
        (sum: number, deal: { amount: number }) => sum + (deal.amount || 0),
        0,
      );

      const avgDealValue =
        dealsArray.length > 0 ? totalValue / dealsArray.length : 0;

      const completedTasks = tasksArray.filter(
        (task: { completedAt: string | null }) => task.completedAt,
      ).length;

      const overdueTasks = tasksArray.filter(
        (task: { dueAt: string; completedAt: string | null }) =>
          !task.completedAt && new Date(task.dueAt) < now,
      ).length;

      setData({
        contacts: contactsArray.length,
        companies: companiesArray.length,
        deals: dealsArray.length,
        tasks: tasksArray.length,
        recentContacts,
        recentCompanies,
        recentDeals,
        totalValue,
        avgDealValue,
        conversionRate:
          dealsArray.length > 0
            ? (completedTasks / tasksArray.length) * 100
            : 0,
        completedTasks,
        overdueTasks,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here&apos;s what&apos;s happening with your
                business today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${(data.totalValue / 1000).toFixed(0)}K`}
            change="+12.5%"
            trend="up"
            icon={DollarSign}
            color="green"
            subtitle="This month"
            loading={loading}
          />
          <MetricCard
            title="Active Deals"
            value={data.deals.toString()}
            change="+8.2%"
            trend="up"
            icon={Target}
            color="blue"
            subtitle={`Avg: $${(data.avgDealValue / 1000).toFixed(0)}K`}
            loading={loading}
          />
          <MetricCard
            title="Total Contacts"
            value={data.contacts.toString()}
            change="+5.1%"
            trend="up"
            icon={Users}
            color="purple"
            subtitle={`${data.recentContacts} new this week`}
            loading={loading}
          />
          <MetricCard
            title="Companies"
            value={data.companies.toString()}
            change="+3.8%"
            trend="up"
            icon={Building2}
            color="indigo"
            subtitle={`${data.recentCompanies} new this week`}
            loading={loading}
          />
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Completed Tasks"
            value={data.completedTasks.toString()}
            change="+15.3%"
            trend="up"
            icon={CheckCircle}
            color="green"
            subtitle={`${data.tasks - data.completedTasks} remaining`}
            loading={loading}
          />
          <MetricCard
            title="Overdue Tasks"
            value={data.overdueTasks.toString()}
            change="-8.7%"
            trend="down"
            icon={AlertCircle}
            color="red"
            subtitle="Needs attention"
            loading={loading}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${data.conversionRate.toFixed(1)}%`}
            change="+2.1%"
            trend="up"
            icon={TrendingUp}
            color="orange"
            subtitle="Lead to deal"
            loading={loading}
          />
          <MetricCard
            title="Recent Activity"
            value={data.recentDeals.toString()}
            change="+18.5%"
            trend="up"
            icon={Activity}
            color="blue"
            subtitle="New deals this week"
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <ChartCard title="Revenue Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deal Pipeline */}
          <ChartCard title="Deal Pipeline">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dealStageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {dealStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Value",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Activity Overview */}
          <ChartCard title="Weekly Activity">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="day"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="calls" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="meetings" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="emails" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recent Performance */}
          <ChartCard title="Performance Metrics">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Deals Closed
                  </span>
                </div>
                <span className="text-sm font-semibold text-blue-600">87%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Response Rate
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  94%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Follow-up Rate
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-600">
                  76%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Client Satisfaction
                  </span>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  92%
                </span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
