"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClient, updateClient } from "@/lib/db";
import Header from "@/components/Layout/Header";
import ClientForm from "@/components/Client/ClientForm";
import toast from "react-hot-toast";

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getClient(id);
        setInitialData(data);
      } catch (error) {
        toast.error("Client not found");
        router.push("/clients");
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateClient(id, data);
      toast.success("Client updated successfully");
      router.push(`/clients/${id}`);
    } catch (error) {
      toast.error("Failed to update client");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData) return <div className="p-8 text-center">Loading...</div>;

  return (
    <>
      <Header title="Edit Client" />
      <div className="p-4 pb-24">
        <ClientForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </>
  );
}
