"use client";

import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Printer,
  Sparkles,
  MessageSquare,
  Settings,
  Clock,
  Target,
  FileText,
  Headphones,
  ChevronRight,
  Users,
  Map,
  ScanLine,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Reading", href: "/learn/reading" },
  { icon: Gamepad2, label: "Reading Games", href: "/games" },
  { icon: Printer, label: "Printables", href: "/printables" },
  { icon: Sparkles, label: "Story Creator", href: "/create" },
  { icon: MessageSquare, label: "AI Tutor", href: "/ai-tutor" },
  { icon: Headphones, label: "Reading Coach", href: "/reading-coach" },
  { icon: FileText, label: "Word Bank", href: "/words" },
  { icon: Target, label: "Assignments", href: "/assignments" },
  { icon: Map, label: "Adventure", href: "/adventure" },
  { icon: ScanLine, label: "Scanner", href: "/scanner" },
  { icon: Trophy, label: "Challenges", href: "/challenges" },
  { icon: Users, label: "Parent", href: "/parent" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const modules = [
  { href: "/learn/reading", title: "Reading", desc: "Short stories by grade level", icon: "📖", accent: "border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40" },
  { href: "/games", title: "Reading Games", desc: "Learn HFW & spelling through play", icon: "🎮", accent: "border-violet-200 dark:border-violet-800 bg-violet-50/80 dark:bg-violet-950/40" },
  { href: "/printables", title: "Printables", desc: "Worksheets, puzzles, AI sheets", icon: "🖨️", accent: "border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40" },
  { href: "/create", title: "Story Creator", desc: "AI stories with your word lists", icon: "✨", accent: "border-pink-200 dark:border-pink-800 bg-pink-50/80 dark:bg-pink-950/40" },
  { href: "/ai-tutor", title: "AI Tutor", desc: "Help with stuck words & passages", icon: "🤖", accent: "border-teal-200 dark:border-teal-800 bg-teal-50/80 dark:bg-teal-950/40" },
  { href: "/reading-coach", title: "Reading Coach", desc: "Read aloud · accuracy & pace", icon: "🎤", accent: "border-rose-200 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/40" },
  { href: "/words", title: "Word Bank", desc: "High-frequency & spelling lists", icon: "🔤", accent: "border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/40" },
  { href: "/assignments", title: "Assignments", desc: "Timed practice that counts", icon: "⏱️", accent: "border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40" },
  { href: "/adventure", title: "Adventure", desc: "Quest map with reading challenges", icon: "🗺️", accent: "border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40" },
  { href: "/scanner", title: "Document Scanner", desc: "Turn school pages into practice", icon: "📷", accent: "border-cyan-200 dark:border-cyan-800 bg-cyan-50/80 dark:bg-cyan-950/40" },
  { href: "/challenges", title: "Weekly Challenges", desc: "Family goals & progress", icon: "🏆", accent: "border-yellow-200 dark:border-yellow-800 bg-yellow-50/80 dark:bg-yellow-950/40" },
  { href: "/parent", title: "Parent View", desc: "Progress, goals, oversight", icon: "👨‍👩‍👧", accent: "border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40" },
];

export function ProDashboard() {
  const { user, getProgressForUser, assignments } = useAuth();
  const pathname = usePathname();
  const name = user?.name || "Student";
  const grade = user?.grade;
  const progress = user ? getProgressForUser(user.id) : { completed: 0, totalMinutes: 0, assignments: [] };
  const myOpen = assignments.filter((a) => a.userId === user?.id && !a.completed);
  const myDone = assignments.filter((a) => a.userId === user?.id && a.completed);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900 text-white">
        <div className="flex items-center gap-3 border-b border-slate-800 p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">KidLearn</h1>
            <p className="text-[11px] text-slate-400">Reading · Words · Growth</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-teal-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3 text-xs text-slate-500">
          {user?.role === "child" ? `Signed in as student` : `Parent account`}
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-6 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {name}
              {grade ? (
                <span className="ml-2 text-base font-medium text-slate-500 dark:text-slate-400">
                  Grade {grade}
                </span>
              ) : null}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Progress stays at zero until timed assignments are completed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Assignments completed</p>
            <p className="mt-1 text-3xl font-bold">{myDone.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Time practiced</p>
            <p className="mt-1 text-3xl font-bold">
              {progress.totalMinutes}
              <span className="text-lg font-medium text-slate-500"> min</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Open assignments</p>
            <p className="mt-1 text-3xl font-bold">{myOpen.length}</p>
            <Link href="/assignments" className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400">
              Manage assignments →
            </Link>
          </div>
        </div>

        {/* All modules */}
        <h2 className="mb-4 text-lg font-semibold">All tools</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={cn(
                "group flex items-start gap-4 rounded-xl border p-4 transition hover:shadow-md",
                m.accent
              )}
            >
              <span className="text-2xl">{m.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{m.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{m.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
