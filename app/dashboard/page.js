"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getClients } from "@/lib/db";
import Header from "@/components/Layout/Header";
import StatCard from "@/components/Dashboard/StatCard";
import ClientCard from "@/components/Client/ClientCard";
import { IndianRupee, Users, Clock } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const data = await getClients(user.uid);
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = clients.reduce((sum, client) => sum + (client.advancePaid || 0) + (client.status === "Paid" ? client.remainingAmount : 0), 0);
  const totalPending = clients.reduce((sum, client) => sum + (client.remainingAmount || 0), 0);
  const recentClients = clients.slice(0, 5); // Show top 5 recent

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-4 space-y-6">
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              <StatCard 
                title="Total Earnings" 
                value={`₹${totalEarnings.toLocaleString('en-IN')}`}
                icon={IndianRupee} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                title="Pending Payments" 
                value={`₹${totalPending.toLocaleString('en-IN')}`}
                icon={Clock} 
              />
              <StatCard 
                title="Total Clients" 
                value={clients.length.toString()}
                icon={Users} 
              />
            </div>

            <div className="pt-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Clients</h2>
              {recentClients.length > 0 ? (
                <div className="space-y-3">
                  {recentClients.map(client => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  No clients yet. Add one from the Clients tab.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
