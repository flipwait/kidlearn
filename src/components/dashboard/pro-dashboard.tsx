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
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Reading", href: "/learn/reading" },
  { icon: Gamepad2, label: "Reading Games", href: "/games" },
  { icon: Printer, label: "Printables", href: "/printables" },
  { icon: Sparkles, label: "Story Creator", href: "/create" },
  { icon: MessageSquare, label: "AI Tutor", href: "/ai-tutor" },
  { icon: Headphones, label: "Reading Coach", href: "/reading-coach" },
  { icon: FileText, label: "Word Bank", href: "/words" },
  { icon: Target, label: "My Assignments", href: "/assignments" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function ProDashboard() {
  const { user, getProgressForUser, assignments } = useAuth();
  const name = user?.name || "Student";
  const grade = user?.grade;
  const progress = user ? getProgressForUser(user.id) : { completed: 0, totalMinutes: 0, assignments: [] };
  const myOpen = assignments.filter((a) => a.userId === user?.id && !a.completed);
  const myDone = assignments.filter((a) => a.userId === user?.id && a.completed);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-slate-900 text-white">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">KidLearn</h1>
            <p className="text-xs text-slate-400">Reading · Practice · Grow</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {user?.role === "parent" && (
          <div className="border-t border-slate-700 p-3">
            <Link href="/parent" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-teal-300 hover:bg-slate-800">
              Parent Dashboard →
            </Link>
          </div>
        )}
      </aside>

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Hello, {name}
              {grade ? ` · Grade ${grade}` : ""}
            </h1>
            <p className="text-slate-500">Progress stays empty until you finish timed assignments.</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        {/* Progress — empty until work is done */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Assignments completed</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{myDone.length}</p>
            <p className="text-xs text-slate-400">Starts at 0 until you finish work</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Time practiced</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{progress.totalMinutes}<span className="text-lg font-medium"> min</span></p>
            <p className="text-xs text-slate-400">Tracked by the assignment timer</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Open assignments</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{myOpen.length}</p>
            <Link href="/assignments" className="text-xs font-medium text-teal-600 hover:underline">View assignments →</Link>
          </div>
        </div>

        {/* Quick links */}
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Learn</h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/learn/reading", title: "Reading", desc: "Passages & books", icon: "📖", color: "bg-blue-50 border-blue-100" },
            { href: "/games", title: "Reading Games", desc: "Fun word practice", icon: "🎮", color: "bg-purple-50 border-purple-100" },
            { href: "/printables", title: "Printables", desc: "Worksheets & puzzles", icon: "🖨️", color: "bg-amber-50 border-amber-100" },
            { href: "/create", title: "Story Creator", desc: "AI stories with your words", icon: "✨", color: "bg-pink-50 border-pink-100" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={cn("flex items-start gap-3 rounded-xl border p-5 transition hover:shadow-md", c.color)}
            >
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="font-semibold text-slate-800">{c.title}</p>
                <p className="text-sm text-slate-500">{c.desc}</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-slate-300" />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Link href="/ai-tutor" className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              <h3 className="font-semibold text-slate-900">AI Tutor</h3>
            </div>
            <p className="text-sm text-slate-500">
              Help with reading passages, stuck words, sounding out, and practice questions.
            </p>
          </Link>
          <Link href="/assignments" className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              <h3 className="font-semibold text-slate-900">Timed assignments</h3>
            </div>
            <p className="text-sm text-slate-500">
              Start the timer, work for the required time, then mark complete. Progress only counts when done.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
