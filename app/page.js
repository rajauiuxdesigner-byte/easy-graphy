"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Camera } from "lucide-react";
import LoginButton from "@/components/Auth/LoginButton";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-brand-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="bg-brand-100 dark:bg-brand-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Camera className="w-10 h-10 text-brand-600 dark:text-brand-100" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Easygrapher</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Manage your photography clients, track payments, and deliver faster.
        </p>
        
        <LoginButton />
      </div>
    </div>
  );
}
