"use client";

import { useEffect, useState } from "react";
import { Activity, User, Phone, Mail, Building2 } from "lucide-react";

interface ActivityData {
  id: string;
  type:
    | "contact_created"
    | "company_created"
    | "contact_updated"
    | "company_updated";
  title: string;
  description: string;
  timestamp: string;
  entityType: "contact" | "company";
  entityName: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const [contactsRes, companiesRes] = await Promise.all([
        fetch("/api/contacts"),
        fetch("/api/companies"),
      ]);

      const contacts = await contactsRes.json();
      const companies = await companiesRes.json();

      const activityList: ActivityData[] = [];

      // Generate activities from contacts
      if (Array.isArray(contacts)) {
        contacts.forEach(
          (contact: { id: string; name: string; createdAt: string }) => {
            activityList.push({
              id: `contact-${contact.id}`,
              type: "contact_created",
              title: "New Contact Added",
              description: `${contact.name} was added to the CRM`,
              timestamp: contact.createdAt,
              entityType: "contact",
              entityName: contact.name,
            });
          },
        );
      }

      // Generate activities from companies
      if (Array.isArray(companies)) {
        companies.forEach(
          (company: { id: string; name: string; createdAt: string }) => {
            activityList.push({
              id: `company-${company.id}`,
              type: "company_created",
              title: "New Company Added",
              description: `${company.name} was registered in the system`,
              timestamp: company.createdAt,
              entityType: "company",
              entityName: company.name,
            });
          },
        );
      } // Sort by timestamp (newest first)
      activityList.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setActivities(activityList.slice(0, 20)); // Show last 20 activities
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "contact_created":
      case "contact_updated":
        return User;
      case "company_created":
      case "company_updated":
        return Building2;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "contact_created":
      case "contact_updated":
        return "bg-blue-500";
      case "company_created":
      case "company_updated":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="w-7 h-7" />
            Activities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all your CRM activities and interactions
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Loading..." : `${activities.length} activities`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading activities...
              </p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Activities Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start adding contacts and companies to see activities here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {activity.entityType}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.entityName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-blue-200 dark:border-gray-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Call Activities
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Coming soon
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track and log phone calls with your contacts and prospects.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-green-200 dark:border-gray-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Email Activities
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Coming soon
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor and track email communications with your network.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-purple-200 dark:border-gray-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Meeting Activities
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Coming soon
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Schedule, track and follow up on meetings and appointments.
          </p>
        </div>
      </div>
    </div>
  );
}
