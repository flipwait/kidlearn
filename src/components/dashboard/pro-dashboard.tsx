"use client";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  Bell,
  TrendingUp,
  Target,
  Clock,
  Flame,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "@/components/user-menu";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: BookOpen, label: "Lessons", href: "/learn" },
  { icon: ClipboardList, label: "Challenges", href: "/challenges" },
  { icon: BarChart3, label: "Parent View", href: "/parent" },
  { icon: FolderOpen, label: "Word Bank", href: "/words" },
  { icon: MessageSquare, label: "AI Tutor", href: "/ai-tutor" },
  { icon: Calendar, label: "Adventure", href: "/adventure" },
  { icon: FileText, label: "Print Pack", href: "/print-pack" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const subjects = [
  { name: "Math", mastery: 72, status: "Strong", color: "bg-teal-500", href: "/learn/math" },
  { name: "Reading", mastery: 65, status: "Good", color: "bg-blue-500", href: "/learn/reading" },
  { name: "Grammar", mastery: 58, status: "Developing", color: "bg-purple-500", href: "/learn/grammar" },
  { name: "English", mastery: 70, status: "Strong", color: "bg-emerald-500", href: "/learn/english" },
];

export function ProDashboard() {
  const { user } = useAuth();
  const name = user?.name || "User";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-slate-900 text-white">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Scholaris</h1>
            <p className="text-xs text-slate-400">Learn · Grow · Achieve</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-teal-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="m-4 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">👑</span>
            <span className="text-sm font-semibold">Premium Plan</span>
          </div>
          <p className="mb-3 text-xs text-teal-100">
            Access advanced resources and analytics.
          </p>
          <button className="w-full rounded-lg bg-white py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50">
            Upgrade Now
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Good morning, {name} 👋
            </h1>
            <p className="text-slate-500">
              Here&apos;s your learning overview for today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-teal-600" />}
            label="Overall Progress"
            value="68%"
            sub="Up 12% from last week"
          />
          <StatCard
            icon={<Target className="h-5 w-5 text-blue-600" />}
            label="Goal Progress"
            value="75%"
            sub="15% above your weekly goal"
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-indigo-600" />}
            label="Lessons Completed"
            value="24"
            sub="6 more than last week"
          />
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            label="Study Streak"
            value="12 days"
            sub="Keep it going!"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Recent Activity</h2>
              <Link href="/learn" className="text-sm text-teal-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Completed: Quadratic Equations",
                  subject: "Math · Lesson Quiz",
                  time: "100%",
                  status: "done",
                },
                {
                  title: "Read: The Power of Habits",
                  subject: "Reading · Article",
                  time: "May 18, 2025",
                  status: "done",
                },
                {
                  title: "Submitted: Essay – Personal Reflection",
                  subject: "English · Assignment",
                  time: "May 17, 2025",
                  status: "done",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    {item.time}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                      ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Spent */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Time Spent This Week</h2>
              <Link href="/parent" className="text-sm text-teal-600 hover:underline">
                View Report
              </Link>
            </div>
            <div className="mb-4 text-center">
              <p className="text-3xl font-bold text-slate-900">14h 32m</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
            <div className="space-y-3">
              {[
                { name: "Math", time: "5h 15m", pct: 36, color: "bg-teal-500" },
                { name: "Reading", time: "3h 45m", pct: 26, color: "bg-blue-500" },
                { name: "Grammar", time: "2h 50m", pct: 20, color: "bg-purple-500" },
                { name: "English", time: "2h 42m", pct: 18, color: "bg-emerald-500" },
              ].map((s) => (
                <div key={s.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600">{s.name}</span>
                    <span className="text-slate-500">
                      {s.time} ({s.pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", s.color)}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Mastery */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Subject Mastery</h2>
            <Link href="/learn" className="text-sm text-teal-600 hover:underline">
              View All Subjects
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="rounded-lg border border-slate-100 p-4 transition hover:border-teal-300 hover:bg-teal-50/50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <span className="text-sm font-semibold text-slate-600">
                    {s.mastery}%
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", s.color)}
                    style={{ width: `${s.mastery}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{s.status}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-slate-50 p-2">{icon}</div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
  );
}
