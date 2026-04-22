"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClient, updateClient, deleteClient } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Layout/Header";
import StatusBadge from "@/components/Client/StatusBadge";
import { format, differenceInDays } from "date-fns";
import toast from "react-hot-toast";
import { 
  Phone, Calendar, IndianRupee, MessageCircle, 
  CreditCard, Edit, Trash2, Lock, Unlock 
} from "lucide-react";
import Link from "next/link";

export default function ClientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { userData } = useAuth();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const data = await getClient(id);
      setClient(data);
    } catch (error) {
      toast.error("Client not found");
      router.push("/clients");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!confirm("Are you sure you want to mark this as paid?")) return;
    try {
      await updateClient(id, { markAsPaid: true });
      toast.success("Marked as paid");
      loadClient(); // reload data
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteClient(id);
      toast.success("Client deleted");
      router.push("/clients");
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!client) return null;

  const isPending = client.status === "Pending";
  const daysOverdue = client.dueDate ? differenceInDays(new Date(), new Date(client.dueDate)) : 0;
  
  // Smart Features
  const whatsappMsg = encodeURIComponent(
    `Hi ${client.name}, your payment of ₹${client.remainingAmount} for the ${client.eventType} shoot is pending. Please complete the payment to receive your album.`
  );
  const upiLink = userData?.upiId ? 
    `upi://pay?pa=${userData.upiId}&pn=${encodeURIComponent(userData.name)}&am=${client.remainingAmount}&tn=PhotographyPayment` : null;

  return (
    <>
      <Header title="Client Details" />
      <div className="p-4 space-y-4 pb-24">
        
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h2>
            <StatusBadge status={client.status} />
          </div>
          <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">{client.eventType}</p>
          
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4" />
            <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Event: {format(new Date(client.eventDate), "PPP")}</span>
          </div>
        </div>

        {/* Delivery Status */}
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          isPending 
            ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-400" 
            : "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-400"
        }`}>
          {isPending ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
          <div>
            <p className="font-semibold">{isPending ? "Delivery Locked" : "Delivery Unlocked"}</p>
            <p className="text-xs opacity-80">
              {isPending ? "Pending payment must be cleared" : "All payments cleared"}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <IndianRupee className="w-5 h-5" /> Payment Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{client.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Advance Paid</span>
              <span className="font-medium text-green-600 dark:text-green-400">₹{client.advancePaid.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between">
              <span className="font-medium text-gray-900 dark:text-white">Remaining</span>
              <span className={`font-bold ${isPending ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                ₹{client.remainingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          
          {isPending && client.dueDate && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className={`text-sm ${daysOverdue > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                Due Date: {format(new Date(client.dueDate), "PP")}
                {daysOverdue > 0 && ` (${daysOverdue} days overdue)`}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          {isPending && (
            <>
              <button 
                onClick={handleMarkAsPaid}
                className="col-span-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              >
                Mark as Paid
              </button>
              
              <a 
                href={`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${whatsappMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>

              {userData?.upiId ? (
                <a 
                  href={upiLink}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-xl transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium">UPI Link</span>
                </a>
              ) : (
                <Link 
                  href="/settings"
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 text-gray-500 dark:bg-gray-800 rounded-xl text-center"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-medium">Setup UPI in Settings</span>
                </Link>
              )}
            </>
          )}

          <Link
            href={`/clients/${id}/edit`}
            className={`flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!isPending ? 'col-span-1' : ''}`}
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className={`flex items-center justify-center gap-2 p-3 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${!isPending ? 'col-span-1' : ''}`}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>

      </div>
    </>
  );
}
