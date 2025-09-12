"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Building, User, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
}

interface Task {
  id?: string;
  title: string;
  dueAt?: string | null;
  companyId?: string | null;
  contactId?: string | null;
  dealId?: string | null;
}

interface Company {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  companyId?: string;
}

interface Deal {
  id: string;
  title: string;
  companyId?: string;
}

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    dueAt: "",
    companyId: "",
    contactId: "",
    dealId: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (task) {
        setFormData({
          title: task.title || "",
          dueAt: task.dueAt ? task.dueAt.split("T")[0] : "",
          companyId: task.companyId || "",
          contactId: task.contactId || "",
          dealId: task.dealId || "",
        });
      } else {
        setFormData({
          title: "",
          dueAt: "",
          companyId: "",
          contactId: "",
          dealId: "",
        });
      }
    }
  }, [isOpen, task]);

  useEffect(() => {
    if (formData.companyId) {
      const companyContacts = contacts.filter(
        (contact) => contact.companyId === formData.companyId,
      );
      setFilteredContacts(companyContacts);

      const companyDeals = deals.filter(
        (deal) => deal.companyId === formData.companyId,
      );
      setFilteredDeals(companyDeals);

      // Reset contact and deal if they don't belong to the selected company
      if (
        formData.contactId &&
        !companyContacts.find((c) => c.id === formData.contactId)
      ) {
        setFormData((prev) => ({ ...prev, contactId: "" }));
      }
      if (
        formData.dealId &&
        !companyDeals.find((d) => d.id === formData.dealId)
      ) {
        setFormData((prev) => ({ ...prev, dealId: "" }));
      }
    } else {
      setFilteredContacts(contacts);
      setFilteredDeals(deals);
    }
  }, [
    formData.companyId,
    contacts,
    deals,
    formData.contactId,
    formData.dealId,
  ]);

  const fetchData = async () => {
    try {
      const [companiesRes, contactsRes, dealsRes] = await Promise.all([
        fetch("/api/companies"),
        fetch("/api/contacts"),
        fetch("/api/deals"),
      ]);

      const [companiesData, contactsData, dealsData] = await Promise.all([
        companiesRes.json(),
        contactsRes.json(),
        dealsRes.json(),
      ]);

      setCompanies(companiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        dueAt: formData.dueAt ? new Date(formData.dueAt).toISOString() : null,
        companyId: formData.companyId || null,
        contactId: formData.contactId || null,
        dealId: formData.dealId || null,
      };

      const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const savedTask = await response.json();
        onSave(savedTask);
        onClose();
      } else {
        console.error("Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? "Edit Task" : "New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueAt}
                onChange={(e) =>
                  setFormData({ ...formData, dueAt: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Company
              </label>
              <select
                value={formData.companyId}
                onChange={(e) =>
                  setFormData({ ...formData, companyId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Contact
              </label>
              <select
                value={formData.contactId}
                onChange={(e) =>
                  setFormData({ ...formData, contactId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!formData.companyId}
              >
                <option value="">Select a contact</option>
                {filteredContacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </option>
                ))}
              </select>
              {!formData.companyId && (
                <p className="text-sm text-gray-500 mt-1">
                  Select a company first to filter contacts
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Related Deal
              </label>
              <select
                value={formData.dealId}
                onChange={(e) =>
                  setFormData({ ...formData, dealId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!formData.companyId}
              >
                <option value="">Select a deal</option>
                {filteredDeals.map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.title}
                  </option>
                ))}
              </select>
              {!formData.companyId && (
                <p className="text-sm text-gray-500 mt-1">
                  Select a company first to filter deals
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
