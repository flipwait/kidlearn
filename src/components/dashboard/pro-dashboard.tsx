"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/app-shell";

const modules = [
  { href: "/learn/reading", title: "Reading", desc: "Stories by grade level", icon: "📖", accent: "from-blue-500/15 to-indigo-500/10 border-blue-200/60 dark:border-blue-800" },
  { href: "/learn/math", title: "Math", desc: "Grade-level practice", icon: "🔢", accent: "from-emerald-500/15 to-teal-500/10 border-emerald-200/60 dark:border-emerald-800" },
  { href: "/games", title: "Reading Games", desc: "HFW & spelling play", icon: "🎮", accent: "from-violet-500/15 to-fuchsia-500/10 border-violet-200/60 dark:border-violet-800" },
  { href: "/printables", title: "Printables", desc: "Worksheets & puzzles", icon: "🖨️", accent: "from-amber-500/15 to-orange-500/10 border-amber-200/60 dark:border-amber-800" },
  { href: "/create", title: "Story Creator", desc: "AI stories with your words", icon: "✨", accent: "from-pink-500/15 to-rose-500/10 border-pink-200/60 dark:border-pink-800" },
  { href: "/ai-tutor", title: "AI Tutor", desc: "Stuck words & passages", icon: "🤖", accent: "from-cyan-500/15 to-sky-500/10 border-cyan-200/60 dark:border-cyan-800" },
  { href: "/reading-coach", title: "Reading Coach", desc: "Read aloud feedback", icon: "🎤", accent: "from-rose-500/15 to-red-500/10 border-rose-200/60 dark:border-rose-800" },
  { href: "/words", title: "Word Bank", desc: "HFW & spelling lists", icon: "🔤", accent: "from-sky-500/15 to-blue-500/10 border-sky-200/60 dark:border-sky-800" },
  { href: "/assignments", title: "Assignments", desc: "Timed practice", icon: "⏱️", accent: "from-slate-500/10 to-slate-400/10 border-slate-200 dark:border-slate-700" },
  { href: "/adventure", title: "Adventure", desc: "Quest map challenges", icon: "🗺️", accent: "from-indigo-500/15 to-violet-500/10 border-indigo-200/60 dark:border-indigo-800" },
  { href: "/scanner", title: "Scanner", desc: "School pages → practice", icon: "📷", accent: "from-teal-500/15 to-emerald-500/10 border-teal-200/60 dark:border-teal-800" },
  { href: "/challenges", title: "Challenges", desc: "Weekly family goals", icon: "🏆", accent: "from-yellow-500/15 to-amber-500/10 border-yellow-200/60 dark:border-yellow-800" },
];

export function ProDashboard() {
  const { user, getProgressForUser, assignments } = useAuth();
  const name = user?.name || "Student";
  const grade = user?.grade;
  const progress = user ? getProgressForUser(user.id) : { completed: 0, totalMinutes: 0, assignments: [] };
  const myOpen = assignments.filter((a) => a.userId === user?.id && !a.completed);
  const myDone = assignments.filter((a) => a.userId === user?.id && a.completed);

  return (
    <AppShell
      title={`Hi, ${name}`}
      subtitle={
        grade
          ? `Grade ${grade} · Progress counts when timed assignments are completed`
          : "Progress counts when timed assignments are completed"
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Completed", value: myDone.length },
          { label: "Minutes practiced", value: progress.totalMinutes },
          { label: "Open assignments", value: myOpen.length, href: "/assignments" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-1 text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {s.value}
            </p>
            {s.href && (
              <Link href={s.href} className="text-xs font-medium text-violet-600 hover:underline dark:text-violet-400">
                View →
              </Link>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Explore</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={cn(
              "group flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition hover:scale-[1.01] hover:shadow-md",
              m.accent
            )}
          >
            <span className="text-2xl">{m.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{m.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{m.desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
