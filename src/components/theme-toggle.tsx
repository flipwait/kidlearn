"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isKid = theme === "kid";

  return (
    <button
      onClick={() => setTheme(isKid ? "professional" : "kid")}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all",
        isKid
          ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600"
          : "bg-slate-800 text-white hover:bg-slate-700"
      )}
    >
      {isKid ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Pro Mode</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span>Kid Mode</span>
        </>
      )}
    </button>
  );
}
