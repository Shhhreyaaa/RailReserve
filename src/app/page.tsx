"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Loader } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none">
      <div className="flex flex-col items-center gap-2">
        <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
        <span className="text-sm text-slate-400 font-semibold">Loading RailReserve...</span>
      </div>
    </div>
  );
}
