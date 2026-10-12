"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Trophy, Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Challenge = {
  id: string;
  title: string;
  desc: string;
  target: number;
  emoji: string;
};

const WEEKLY: Challenge[] = [
  { id: "lessons", title: "Complete 5 lessons", desc: "Any subject practice", target: 5, emoji: "📝" },
  { id: "reading", title: "Read 3 books", desc: "From the Reading library", target: 3, emoji: "📚" },
  { id: "games", title: "Win 4 games", desc: "Any game on the Games page", target: 4, emoji: "🎮" },
  { id: "adventure", title: "Finish 1 adventure", desc: "Complete all 4 lands", target: 1, emoji: "🗺️" },
  { id: "words", title: "Master 5 words", desc: "Mark high-frequency words as mastered", target: 5, emoji: "🔤" },
];

const STORAGE = "kidlearn_weekly_progress";

export default function ChallengesPage() {
  const { resolvedTheme } = useTheme();
  const { children, user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE);
      if (s) setProgress(JSON.parse(s));
    } catch {}
  }, []);

  const bump = (id: string) => {
    setProgress((prev) => {
      const ch = WEEKLY.find((c) => c.id === id);
      if (!ch) return prev;
      const next = { ...prev, [id]: Math.min(ch.target, (prev[id] || 0) + 1) };
      localStorage.setItem(STORAGE, JSON.stringify(next));
      return next;
    });
  };

  const completedCount = WEEKLY.filter((c) => (progress[c.id] || 0) >= c.target).length;

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>
        <div className="mt-4 mb-2 flex items-center gap-3">
          <h1 className={cn("text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
            Weekly Family Challenge
          </h1>
        </div>
        <p className={cn("mb-6", isKid ? "text-blue-600" : "text-slate-500")}>
          This week&apos;s goals · {completedCount}/{WEEKLY.length} done
        </p>

        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-3 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${(completedCount / WEEKLY.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {WEEKLY.map((c) => {
            const done = progress[c.id] || 0;
            const complete = done >= c.target;
            return (
              <div
                key={c.id}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border p-4",
                  complete ? "border-green-200 bg-green-50" : "border-slate-200 bg-white"
                )}
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{c.title}</p>
                  <p className="text-sm text-slate-500">{c.desc}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full transition-all", complete ? "bg-green-500" : "bg-blue-500")}
                      style={{ width: `${Math.min(100, (done / c.target) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{done} / {c.target}</p>
                </div>
                {complete ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <button
                    onClick={() => bump(c.id)}
                    className="rounded-xl bg-blue-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    +1
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {children.length > 1 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
              <Trophy className="h-5 w-5 text-amber-500" /> Family
            </h3>
            <p className="text-sm text-slate-500">
              Challenges are shared for the whole family this week. Work together or cheer each other on!
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {children.map((c) => (
                <span key={c.id} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
