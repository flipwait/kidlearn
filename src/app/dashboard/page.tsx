"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { KidDashboard } from "@/components/dashboard/kid-dashboard";
import { ProDashboard } from "@/components/dashboard/pro-dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const isKidMode = resolvedTheme === "kid" || theme === "kid";

  return (
    <div className={isKidMode ? "kid-mode" : ""}>
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      {isKidMode ? <KidDashboard /> : <ProDashboard />}
    </div>
  );
}
