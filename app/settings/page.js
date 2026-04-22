"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Layout/Header";
import { CreditCard, Save } from "lucide-react";

export default function SettingsPage() {
  const { userData, updateUPI } = useAuth();
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData?.upiId) {
      setUpiId(userData.upiId);
    }
  }, [userData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateUPI(upiId);
    setIsSubmitting(false);
  };

  return (
    <>
      <Header title="Settings" />
      <div className="p-4 space-y-6 pb-24">
        
        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-20 h-20 bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userData?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{userData?.email}</p>
        </div>

        {/* UPI Configuration */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
            <CreditCard className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Payment Settings</h3>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your UPI ID
              </label>
              <input
                type="text"
                placeholder="e.g., yourname@okicici"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This will be used to generate dynamic payment links for your clients.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || upiId === userData?.upiId}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
