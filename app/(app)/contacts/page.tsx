"use client";

import { useEffect, useState } from "react";
import { Plus, Mail, Phone, Building2, Calendar } from "lucide-react";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

interface Contact extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  company: {
    name: string;
  };
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      const contactsArray = Array.isArray(data.contacts) ? data.contacts : [];
      setContacts(contactsArray);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "name" as keyof Contact,
      header: "Name",
      sortable: true,
      render: (value: unknown, row: Contact) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {String(value).charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{String(value)}</div>
            <div className="text-sm text-gray-500">{row.position}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email" as keyof Contact,
      header: "Email",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <a
            href={`mailto:${String(value)}`}
            className="text-blue-600 hover:underline"
          >
            {String(value)}
          </a>
        </div>
      ),
    },
    {
      key: "phone" as keyof Contact,
      header: "Phone",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <a
            href={`tel:${String(value)}`}
            className="text-gray-700 hover:text-blue-600"
          >
            {String(value)}
          </a>
        </div>
      ),
    },
    {
      key: "company" as keyof Contact,
      header: "Company",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">
            {(value as { name: string })?.name || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt" as keyof Contact,
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

  const handleEdit = (contact: Contact) => {
    console.log("Edit contact:", contact);
    // TODO: Open edit modal
  };

  const handleDelete = (contact: Contact) => {
    console.log("Delete contact:", contact);
    // TODO: Show confirmation dialog
  };

  const handleView = (contact: Contact) => {
    console.log("View contact:", contact);
    // TODO: Open contact detail view
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">
            Manage your contact database and relationships
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Contacts
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Companies</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  new Set(contacts.map((c) => c.company?.name).filter(Boolean))
                    .size
                }
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
              <p className="text-2xl font-bold text-gray-900">
                {
                  contacts.filter((c) => {
                    const created = new Date(c.createdAt);
                    const now = new Date();
                    return (
                      created.getMonth() === now.getMonth() &&
                      created.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Data Table */}
      <AdvancedDataTable
        data={contacts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        searchPlaceholder="Search contacts by name, email, or company..."
        exportFilename="contacts"
      />
    </div>
  );
}
