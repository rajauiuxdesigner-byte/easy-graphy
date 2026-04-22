"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addClient } from "@/lib/db";
import Header from "@/components/Layout/Header";
import ClientForm from "@/components/Client/ClientForm";
import toast from "react-hot-toast";

export default function NewClientPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addClient(user.uid, data);
      toast.success("Client added successfully");
      router.push("/clients");
    } catch (error) {
      toast.error("Failed to add client");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Add New Client" />
      <div className="p-4 pb-24">
        <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </>
  );
}
