"use client";

import {
  Home,
  BookOpen,
  BarChart3,
  Trophy,
  Shield,
  Settings,
  Star,
  Gamepad2,
  Map,
  Sparkles,
  Gift,
  Heart,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "@/components/user-menu";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard", active: true },
  { icon: BookOpen, label: "My Lessons", href: "/learn" },
  { icon: Sparkles, label: "AI Tutor", href: "/ai-tutor" },
  { icon: Sparkles, label: "Create Stories", href: "/create" },
  { icon: Gamepad2, label: "Games", href: "/games" },
  { icon: BookOpen, label: "Words", href: "/words" },
  { icon: Shield, label: "Parents", href: "/parent" },
  { icon: Settings, label: "Settings", href: "/settings" },
];


const subjects = [
  {
    name: "Math",
    icon: "🔢",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    href: "/learn/math",
  },
  {
    name: "Reading",
    icon: "📚",
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    href: "/learn/reading",
  },
  {
    name: "Grammar",
    icon: "✏️",
    color: "from-green-400 to-emerald-500",
    bg: "bg-green-50",
    href: "/learn/grammar",
  },
  {
    name: "English",
    icon: "💬",
    color: "from-purple-400 to-violet-500",
    bg: "bg-purple-50",
    href: "/learn/english",
  },
  {
    name: "Games",
    icon: "🎮",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    href: "/games",
  },
  {
    name: "Adventure",
    icon: "🗺️",
    color: "from-cyan-400 to-teal-500",
    bg: "bg-cyan-50",
    href: "/adventure",
  },
];

const highFreqWords = [
  "said", "what", "where", "could", "would",
  "should", "there", "their", "here", "about",
];

export function KidDashboard() {
  const { user } = useAuth();
  const name = user?.name || "Friend";
  const grade = user?.grade || 3;
  const coins = user?.coins ?? 0;
  const streak = user?.streak ?? 0;
  const avatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  const grade = user?.grade || 3;
  const coins = user?.coins ?? 0;
  const streak = user?.streak ?? 0;
  const avatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-blue-100 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-400 text-xl shadow-lg">
            ⭐
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-900">KidLearn</h1>
            <p className="text-xs text-blue-500">Kid Mode</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                item.active
                  ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="m-4 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 p-4 text-center">
          <div className="mb-2 text-3xl">🏰</div>
          <p className="text-sm font-semibold text-purple-800">
            Keep going, superstar!
          </p>
          <p className="text-xs text-purple-600">Every step counts.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Hi {name}! <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-blue-600">Ready to learn today?</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700">
              <Coins className="h-4 w-4" />
              {coins}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1.5 text-sm font-semibold text-pink-700">
              <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
              {streak}
            </div>
            <UserMenu isKid />
          </div>
        </header>

        {/* Progress Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl bg-blue-100 p-2">
                <Star className="h-5 w-5 text-blue-500" />
              </div>
              <span className="font-semibold text-slate-700">Today&apos;s Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">3 of 6</p>
            <p className="text-sm text-slate-500">activities</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl bg-pink-100 p-2">
                <Trophy className="h-5 w-5 text-pink-500" />
              </div>
              <span className="font-semibold text-slate-700">Weekly Goal</span>
            </div>
            <p className="text-2xl font-bold text-pink-600">4 of 5</p>
            <p className="text-sm text-slate-500">days</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-pink-100">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-pink-400 to-rose-500" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl bg-amber-100 p-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <span className="font-semibold text-slate-700">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">7 Days</p>
            <p className="text-sm text-slate-500">Amazing!</p>
          </div>
        </div>

        {/* Daily Learning Plan */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-blue-900">Today&apos;s Learning Plan</h2>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">1</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">Math Practice</p>
                  <p className="text-sm text-slate-500">Multiplication basics · 10 minutes</p>
                </div>
                <Link href="/learn/math" className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-medium text-white">Start</Link>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-pink-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">2</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">Reading + AI Coach</p>
                  <p className="text-sm text-slate-500">Read a passage aloud · 10 minutes</p>
                </div>
                <Link href="/reading-coach" className="rounded-full bg-pink-500 px-4 py-1.5 text-sm font-medium text-white">Start</Link>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">3</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">Create a Story</p>
                  <p className="text-sm text-slate-500">Make a unique passage or mini-book with AI</p>
                </div>
                <Link href="/create" className="rounded-full bg-purple-500 px-4 py-1.5 text-sm font-medium text-white">Start</Link>
              </div>
            </div>
          </div>
        </section>

        {/* What do you want to learn */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-blue-900">
            What do you want to learn?
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                href={subject.href}
                className={cn(
                  "card-hover group flex flex-col items-center rounded-3xl p-5 text-center shadow-soft transition-all",
                  subject.bg
                )}
              >
                <div
                  className={cn(
                    "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-lg",
                    subject.color
                  )}
                >
                  {subject.icon}
                </div>
                <span className="font-semibold text-slate-800">
                  {subject.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Daily Quest + High Frequency Words */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-slate-800">Daily Quest</h3>
            </div>
            <p className="mb-3 text-sm text-slate-600">
              Complete 2 lessons to earn 20 coins!
            </p>
            <div className="mb-2 h-3 overflow-hidden rounded-full bg-purple-100">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">1 of 2 completed</span>
              <span className="font-semibold text-purple-600">+20 🪙</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-slate-800">
                  Daily High-Frequency Words
                </h3>
              </div>
              <Link
                href="/words"
                className="text-sm font-medium text-blue-500 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {highFreqWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1.5 text-sm font-medium text-blue-800"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              💡 Practice these words and become a reading star!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
