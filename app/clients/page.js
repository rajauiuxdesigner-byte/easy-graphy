"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getClients } from "@/lib/db";
import Link from "next/link";
import Header from "@/components/Layout/Header";
import ClientCard from "@/components/Client/ClientCard";
import { Search, Plus } from "lucide-react";

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadClients();
  }, [user]);

  const loadClients = async () => {
    try {
      const data = await getClients(user.uid);
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.phone.includes(search);
    const matchesFilter = filter === "All" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Header title="Clients" />
      <div className="p-4 space-y-4">
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <ClientCard key={client.id} client={client} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No clients found.
              </div>
            )}
          </div>
        )}

        <Link 
          href="/clients/new"
          className="fixed bottom-20 right-4 w-14 h-14 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-700 transition-colors z-40 max-w-md mx-auto xl:absolute"
          style={{ right: 'max(1rem, calc(50% - 13rem))' }}
        >
          <Plus className="w-6 h-6" />
        </Link>

      </div>
    </>
  );
}
