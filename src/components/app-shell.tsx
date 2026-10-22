"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Printer,
  Sparkles,
  MessageSquare,
  Settings,
  Target,
  FileText,
  Headphones,
  Users,
  Map,
  ScanLine,
  Trophy,
  Calculator,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Reading", href: "/learn/reading" },
  { icon: Calculator, label: "Math", href: "/learn/math" },
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

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const Nav = (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/40 to-fuchsia-50/30 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/90">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm text-white">
            T
          </span>
          TutorMe
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[min(100%,18rem)] flex-col bg-slate-900 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold">
                  T
                </span>
                <div>
                  <p className="font-bold">TutorMe</p>
                  <p className="text-[11px] text-slate-400">Learn · Play · Grow</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            {Nav}
            <p className="border-t border-slate-800 p-3 text-xs text-slate-500">
              {user?.name || "Guest"}
              {user?.grade ? ` · Grade ${user.grade}` : ""}
            </p>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-slate-800 bg-slate-900 text-white md:flex">
        <div className="flex items-center gap-3 border-b border-slate-800 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold shadow-lg shadow-violet-500/30">
            T
          </span>
          <div>
            <h1 className="text-lg font-bold tracking-tight">TutorMe</h1>
            <p className="text-[11px] text-slate-400">Learn · Play · Grow</p>
          </div>
        </div>
        {Nav}
        <div className="border-t border-slate-800 p-3 text-xs text-slate-500">
          {user?.role === "child" ? "Student" : user?.role === "parent" ? "Parent" : "Account"}
        </div>
      </aside>

      {/* Main */}
      <div className="md:ml-64">
        <header className="mb-0 hidden items-center justify-between gap-4 px-6 pt-6 md:flex md:px-8">
          <div>
            {title && <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        {/* Mobile page title */}
        {(title || subtitle) && (
          <div className="px-4 pt-4 md:hidden">
            {title && <h1 className="text-xl font-bold">{title}</h1>}
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        )}
        <div className="p-4 md:p-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}
