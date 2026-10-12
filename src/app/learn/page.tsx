"use client";

import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  PenTool,
  MessageCircle,
  Headphones,
  Camera,
  Gamepad2,
  Map,
} from "lucide-react";
import { gradeContent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";


const subjects = [
  {
    name: "Math",
    description: "Grade-level math practice with interactive problems",
    icon: Calculator,
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    href: "/learn/math",
    key: "math" as const,
  },
  {
    name: "Reading",
    description: "Passages, comprehension, and fluency practice",
    icon: BookOpen,
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    href: "/learn/reading",
    key: "reading" as const,
  },
  {
    name: "Grammar",
    description: "Parts of speech, punctuation, and sentence structure",
    icon: PenTool,
    color: "from-green-400 to-emerald-500",
    bg: "bg-green-50",
    href: "/learn/grammar",
    key: "grammar" as const,
  },
  {
    name: "English",
    description: "Vocabulary, writing, and language skills",
    icon: MessageCircle,
    color: "from-purple-400 to-violet-500",
    bg: "bg-purple-50",
    href: "/learn/english",
    key: "english" as const,
  },
];

const quickActions = [
  {
    name: "AI Reading Coach",
    description: "Practice reading aloud with real-time feedback",
    icon: Headphones,
    href: "/reading-coach",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Document Scanner",
    description: "Turn school pages into custom worksheets",
    icon: Camera,
    href: "/scanner",
    color: "bg-teal-100 text-teal-600",
  },
  {
    name: "Games",
    description: "Fun math, reading & English games",
    icon: Gamepad2,
    href: "/games",
    color: "bg-amber-100 text-amber-600",
  },
  {
    name: "Adventure Mode",
    description: "Story quests that mix all subjects",
    icon: Map,
    href: "/adventure",
    color: "bg-cyan-100 text-cyan-600",
  },
];

export default function LearnPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;
  const content = gradeContent[grade];


  return (
    <div
      className={cn(
        "min-h-screen",
        isKid
          ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50"
          : "bg-slate-50"
      )}
    >
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-4 mb-2 flex flex-wrap items-center gap-3">
          <h1
            className={cn(
              "text-3xl font-bold",
              isKid ? "text-blue-900" : "text-slate-900"
            )}
          >
            My Lessons
          </h1>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-semibold",
              isKid ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"
            )}
          >
            Grade {grade}
          </span>
        </div>
        <p className={cn("mb-8", isKid ? "text-blue-600" : "text-slate-500")}>
          Grade-level content for Math, Reading, Grammar & English
        </p>

        {/* Subject Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {subjects.map((subject) => (
            <Link
              key={subject.name}
              href={subject.href}
              className={cn(
                "group rounded-2xl border p-6 shadow-sm transition hover:shadow-md",
                isKid
                  ? "border-blue-100 bg-white hover:-translate-y-1"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                    subject.color
                  )}
                >
                  <subject.icon className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                {subject.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{subject.description}</p>

              <ul className="mt-4 space-y-1">
                {content[subject.key].slice(0, 3).map((topic) => (
                  <li
                    key={topic}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    {topic}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-medium text-blue-600 group-hover:underline">
                Start learning →
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <h2
          className={cn(
            "mb-4 text-xl font-bold",
            isKid ? "text-blue-900" : "text-slate-900"
          )}
        >
          More Ways to Learn
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4 transition hover:shadow-md",
                isKid
                  ? "border-blue-100 bg-white"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className={cn("rounded-lg p-2", action.color)}>
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{action.name}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
