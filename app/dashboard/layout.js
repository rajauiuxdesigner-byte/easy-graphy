"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BottomNav from "@/components/Layout/BottomNav";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // or a full page spinner
  }

  return (
    <>
      <main className="max-w-md mx-auto w-full min-h-screen pb-20">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
