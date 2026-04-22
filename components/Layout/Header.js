"use client";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export default function Header({ title }) {
  const { userData, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
            {userData?.name}
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
