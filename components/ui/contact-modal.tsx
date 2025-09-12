"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, User, Mail, Phone, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  companyId: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: ContactFormData & { id: string };
}

export function ContactModal({ isOpen, onClose, contact }: ContactModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      companyId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const url = contact ? `/api/contacts/${contact.id}` : "/api/contacts";
      const method = contact ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <h2 className="text-xl font-bold text-neutral-900">
              {contact ? "Edit Contact" : "New Contact"}
            </h2>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Title
              </label>
              <input
                {...register("jobTitle")}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Software Engineer"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1"
              >
                {mutation.isPending
                  ? "Saving..."
                  : contact
                    ? "Update"
                    : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
