"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Star, BookOpen, Calculator, PenTool, CheckCircle2, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";

const BADGES = [
  { id: "first-quest", name: "First Quest", emoji: "🏅", desc: "Complete your first adventure" },
  { id: "math-master", name: "Math Master", emoji: "🔢", desc: "Solve the Math Challenge" },
  { id: "word-wizard", name: "Word Wizard", emoji: "📖", desc: "Complete the Reading Quest" },
  { id: "grammar-guardian", name: "Grammar Guardian", emoji: "✏️", desc: "Fix the Grammar Bridge" },
  { id: "story-star", name: "Story Star", emoji: "⭐", desc: "Finish the English Tower" },
  { id: "adventure-hero", name: "Adventure Hero", emoji: "🏆", desc: "Complete a full adventure" },
];

const quests = [
  {
    id: "math",
    name: "Math Challenge",
    icon: Calculator,
    color: "from-purple-500 to-indigo-600",
    description: "Solve the ancient number puzzles to cross the bridge.",
    badge: "math-master",
    question: "What is 8 × 7?",
    answer: "56",
    options: ["54", "56", "64", "48"],
  },
  {
    id: "reading",
    name: "Reading Quest",
    icon: BookOpen,
    color: "from-pink-500 to-rose-600",
    description: "Read the scroll and answer the guardian's question.",
    badge: "word-wizard",
    question: "In the story, what did the hero use to open the gate?",
    answer: "A golden key",
    options: ["A magic sword", "A golden key", "A secret password", "A map"],
  },
  {
    id: "grammar",
    name: "Grammar Bridge",
    icon: PenTool,
    color: "from-green-500 to-emerald-600",
    description: "Fix the broken sentences to repair the bridge.",
    badge: "grammar-guardian",
    question: "Which sentence is correct?",
    answer: "The dragons are sleeping.",
    options: ["The dragons is sleeping.", "The dragons are sleeping.", "The dragons be sleeping.", "The dragons sleeping."],
  },
  {
    id: "english",
    name: "English Tower",
    icon: Star,
    color: "from-amber-500 to-orange-600",
    description: "Choose the best word to complete the prophecy.",
    badge: "story-star",
    question: "The brave knight felt _____ as he approached the dragon.",
    answer: "courageous",
    options: ["courageous", "courage", "courageously", "couraging"],
  },
];

const STORAGE_BADGES = "kidlearn_badges";

export default function AdventurePage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const [started, setStarted] = useState(false);
  const [currentQuest, setCurrentQuest] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [stars, setStars] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BADGES);
      if (saved) setEarnedBadges(JSON.parse(saved));
    } catch {}
  }, []);

  const saveBadge = (id: string) => {
    setEarnedBadges((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(STORAGE_BADGES, JSON.stringify(next));
      setShowBadge(id);
      setTimeout(() => setShowBadge(null), 2500);
      return next;
    });
  };

  const quest = quests[currentQuest];
  const allDone = completed.length === quests.length;

  const handleAnswer = (selected: string) => {
    if (selected === quest.answer) {
      setFeedback("correct");
      setStars((s) => s + 1);
      setCompleted((c) => [...c, quest.id]);
      saveBadge(quest.badge);
      if (completed.length === 0) saveBadge("first-quest");

      setTimeout(() => {
        setFeedback(null);
        if (currentQuest < quests.length - 1) {
          setCurrentQuest((q) => q + 1);
        } else {
          saveBadge("adventure-hero");
        }
      }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 900);
    }
  };

  // Badge popup
  const badgePopup = showBadge && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="animate-bounce rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-3 text-6xl">{BADGES.find((b) => b.id === showBadge)?.emoji}</div>
        <h3 className="text-xl font-bold text-slate-800">Badge Unlocked!</h3>
        <p className="mt-1 font-medium text-purple-600">{BADGES.find((b) => b.id === showBadge)?.name}</p>
        <p className="mt-1 text-sm text-slate-500">{BADGES.find((b) => b.id === showBadge)?.desc}</p>
      </div>
    </div>
  );

  if (!started) {
    return (
      <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" : "bg-slate-50")}>
        {badgePopup}
        <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>
          <div className="mt-10">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-5xl shadow-xl">🗺️</div>
            <h1 className={cn("text-4xl font-bold", isKid ? "text-purple-900" : "text-slate-900")}>Adventure Mode</h1>
            <p className={cn("mx-auto mt-3 max-w-lg text-lg", isKid ? "text-purple-600" : "text-slate-500")}>
              Grade {grade} Hero — Complete quests to earn stars and collect badges!
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quests.map((q) => (
                <div key={q.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className={cn("mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white", q.color)}>
                    <q.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{q.name}</p>
                </div>
              ))}
            </div>

            {/* Badge collection preview */}
            <div className="mt-10 rounded-2xl bg-white p-6 text-left shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                <Award className="h-5 w-5 text-amber-500" /> Your Badges
              </h3>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {BADGES.map((b) => {
                  const unlocked = earnedBadges.includes(b.id);
                  return (
                    <div key={b.id} className={cn("rounded-xl border p-3 text-center", unlocked ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-slate-50 opacity-40")}>
                      <div className="text-2xl">{b.emoji}</div>
                      <p className="mt-1 text-xs font-medium text-slate-700">{b.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => { setStarted(true); setCurrentQuest(0); setCompleted([]); setStars(0); }}
              className={cn("mt-10 rounded-2xl px-12 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105",
                isKid ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-teal-600 hover:bg-teal-700")}
            >
              Begin Your Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (allDone) {
    return (
      <div className={cn("flex min-h-screen flex-col items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-purple-50 to-pink-100" : "bg-slate-50")}>
        {badgePopup}
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mb-4 text-6xl">🏆</div>
          <h2 className="text-3xl font-bold text-slate-800">Quest Complete!</h2>
          <p className="mt-2 text-slate-600">You earned {stars} stars</p>
          <div className="mt-4 flex justify-center gap-1">
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} className="h-8 w-8 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">Amazing work, Grade {grade} hero!</p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => { setStarted(false); setCurrentQuest(0); setCompleted([]); setStars(0); }}
              className="flex-1 rounded-xl bg-purple-500 py-3 font-semibold text-white hover:bg-purple-600">
              Play Again
            </button>
            <Link href="/dashboard" className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" : "bg-slate-50")}>
      {badgePopup}
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Exit Adventure</Link>
          <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {stars} stars
          </div>
        </div>
        <div className="mb-8 flex justify-center gap-2">
          {quests.map((q, i) => (
            <div key={q.id} className={cn("h-2 w-12 rounded-full transition",
              completed.includes(q.id) ? "bg-green-500" : i === currentQuest ? "bg-purple-500" : "bg-slate-200")} />
          ))}
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className={cn("mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", quest.color)}>
            <quest.icon className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{quest.name}</h2>
          <p className="mt-1 text-slate-500">{quest.description}</p>
          <div className="mt-8">
            <p className="mb-4 text-lg font-medium text-slate-800">{quest.question}</p>
            <div className="space-y-3">
              {quest.options.map((opt) => (
                <button key={opt} onClick={() => handleAnswer(opt)} disabled={feedback !== null}
                  className={cn("w-full rounded-2xl border-2 px-5 py-4 text-left font-medium transition",
                    feedback === "correct" && opt === quest.answer ? "border-green-500 bg-green-50 text-green-800" : "border-slate-200 hover:border-purple-300 hover:bg-purple-50")}>
                  {opt}
                  {feedback === "correct" && opt === quest.answer && <CheckCircle2 className="ml-2 inline h-5 w-5 text-green-600" />}
                </button>
              ))}
            </div>
          </div>
          {feedback === "wrong" && <p className="mt-4 text-center text-sm font-medium text-red-500">Not quite — try again!</p>}
        </div>
      </div>
    </div>
  );
}
