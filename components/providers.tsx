"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { ModalProvider } from "@/components/modal-provider";
import { ContactModal } from "@/components/ui/contact-modal";
import { CompanyModal } from "@/components/ui/company-modal";
import { DealModal } from "@/components/ui/deal-modal";
import { TaskModal } from "@/components/ui/task-modal";
import { useModal } from "@/components/modal-provider";

function ModalWrapper() {
  const {
    isContactModalOpen,
    isCompanyModalOpen,
    isTaskModalOpen,
    editingContact,
    editingCompany,
    editingTask,
    closeContactModal,
    closeCompanyModal,
    closeTaskModal,
  } = useModal();

  return (
    <>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        contact={editingContact || undefined}
      />
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={closeCompanyModal}
        company={editingCompany || undefined}
      />
      <DealModal />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        task={editingTask || undefined}
        onSave={() => window.location.reload()}
      />
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ModalProvider>
            {children}
            <ModalWrapper />
          </ModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
