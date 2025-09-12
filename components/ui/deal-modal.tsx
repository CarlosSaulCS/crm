"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/components/modal-provider";
import { useQueryClient } from "@tanstack/react-query";
import { Target, X, DollarSign, Calendar, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DealModal() {
  const { isDealModalOpen, editingDeal, closeDealModal } = useModal();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    status: "OPEN",
    closeDate: "",
    companyId: "",
    contactId: "",
    stageId: "",
  });

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [contacts, setContacts] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  useEffect(() => {
    if (isDealModalOpen) {
      // Fetch companies and contacts for dropdowns
      Promise.all([
        fetch("/api/companies").then((res) => res.json()),
        fetch("/api/contacts").then((res) => res.json()),
      ]).then(([companiesData, contactsData]) => {
        setCompanies(companiesData);
        setContacts(contactsData);
      });

      if (editingDeal) {
        setFormData({
          title: editingDeal.title,
          amount: editingDeal.amount,
          status: editingDeal.status,
          closeDate: editingDeal.closeDate,
          companyId: editingDeal.companyId || "",
          contactId: editingDeal.contactId || "",
          stageId: editingDeal.stageId || "",
        });
      } else {
        setFormData({
          title: "",
          amount: "",
          status: "OPEN",
          closeDate: "",
          companyId: "",
          contactId: "",
          stageId: "",
        });
      }
    }
  }, [isDealModalOpen, editingDeal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingDeal ? `/api/deals/${editingDeal.id}` : "/api/deals";
      const method = editingDeal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save deal");
      }

      queryClient.invalidateQueries({ queryKey: ["deals"] });
      closeDealModal();
    } catch (error) {
      console.error("Error saving deal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isDealModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingDeal ? "Edit Deal" : "New Deal"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {editingDeal
                  ? "Update deal information"
                  : "Create a new sales opportunity"}
              </p>
            </div>
          </div>
          <button
            onClick={closeDealModal}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Enter deal title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="OPEN">Open</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Close Date
            </label>
            <input
              type="date"
              value={formData.closeDate}
              onChange={(e) =>
                setFormData({ ...formData, closeDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Building2 className="w-4 h-4 inline mr-1" />
              Company
            </label>
            <select
              value={formData.companyId}
              onChange={(e) =>
                setFormData({ ...formData, companyId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Contact
            </label>
            <select
              value={formData.contactId}
              onChange={(e) =>
                setFormData({ ...formData, contactId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeDealModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : editingDeal ? "Update" : "Create"} Deal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
