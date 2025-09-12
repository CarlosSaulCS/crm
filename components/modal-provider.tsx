"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  employees: number;
  revenue?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Deal {
  id: string;
  title: string;
  amount: string;
  status: string;
  closeDate: string;
  companyId?: string;
  contactId?: string;
  stageId?: string;
}

interface Task {
  id: string;
  title: string;
  dueAt?: string | null;
  completedAt?: string | null;
  companyId?: string | null;
  contactId?: string | null;
  dealId?: string | null;
}

interface ModalContextType {
  isContactModalOpen: boolean;
  isCompanyModalOpen: boolean;
  isDealModalOpen: boolean;
  isTaskModalOpen: boolean;
  editingContact: Contact | null;
  editingCompany: Company | null;
  editingDeal: Deal | null;
  editingTask: Task | null;
  openContactModal: (contact?: Contact) => void;
  closeContactModal: () => void;
  openCompanyModal: (company?: Company) => void;
  closeCompanyModal: () => void;
  openDealModal: (deal?: Deal) => void;
  closeDealModal: () => void;
  openTaskModal: (task?: Task) => void;
  closeTaskModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openContactModal = (contact?: Contact) => {
    setEditingContact(contact || null);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  const openCompanyModal = (company?: Company) => {
    setEditingCompany(company || null);
    setIsCompanyModalOpen(true);
  };

  const closeCompanyModal = () => {
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
  };

  const openDealModal = (deal?: Deal) => {
    setEditingDeal(deal || null);
    setIsDealModalOpen(true);
  };

  const closeDealModal = () => {
    setIsDealModalOpen(false);
    setEditingDeal(null);
  };

  const openTaskModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isContactModalOpen,
        isCompanyModalOpen,
        isDealModalOpen,
        isTaskModalOpen,
        editingContact,
        editingCompany,
        editingDeal,
        editingTask,
        openContactModal,
        closeContactModal,
        openCompanyModal,
        closeCompanyModal,
        openDealModal,
        closeDealModal,
        openTaskModal,
        closeTaskModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
