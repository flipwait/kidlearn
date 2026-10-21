"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { BookOpen, PenTool, Star, CheckCircle2, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";
import {
  wordMatchQuestions,
  vocabQuestions,
  grammarQuestions,
  readingPracticeQuestions,
  type Q,
} from "@/lib/grade-content";

const allGames = [
  {
    id: "word-match",
    name: "Word Match",
    description: "Match words to meanings at your grade level",
    icon: BookOpen,
    color: "from-pink-500 to-rose-600",
    getQs: wordMatchQuestions,
  },
  {
    id: "vocab-blast",
    name: "Vocab Blast",
    description: "Pick the best word for the sentence",
    icon: Star,
    color: "from-purple-500 to-violet-600",
    getQs: vocabQuestions,
  },
  {
    id: "grammar-fixer",
    name: "Grammar Fixer",
    description: "Choose the correctly written sentence",
    icon: PenTool,
    color: "from-green-500 to-emerald-600",
    getQs: grammarQuestions,
  },
  {
    id: "reading-skills",
    name: "Reading Skills",
    description: "Comprehension questions for your grade",
    icon: Gamepad2,
    color: "from-blue-500 to-indigo-600",
    getQs: readingPracticeQuestions,
  },
];

export default function GamesPage() {
  const { user } = useAuth();
  const grade = (user?.grade || 3) as Grade;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);

  const game = allGames.find((g) => g.id === activeId);
  const questions: Q[] = game ? game.getQs(grade) : [];
  const current = questions[qIndex];

  const start = (id: string) => {
    setActiveId(id);
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const answer = (opt: string) => {
    if (!current || feedback) return;
    const ok = opt === current.a;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (qIndex < questions.length - 1) setQIndex((i) => i + 1);
      else setFinished(true);
    }, 700);
  };

  if (finished && game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-3 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-slate-900">{game.name} complete</h2>
          <p className="mt-2 text-slate-500">
            Grade {grade} · {score}/{questions.length} correct
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => start(game.id)} className="flex-1 rounded-xl bg-teal-600 py-3 font-semibold text-white">
              Play again
            </button>
            <button onClick={() => setActiveId(null)} className="flex-1 rounded-xl border py-3 font-semibold">
              All games
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeId && current && game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>
              {game.name} · Grade {grade}
            </span>
            <span>
              {qIndex + 1}/{questions.length}
            </span>
          </div>
          <h2 className="mb-6 text-center text-lg font-bold text-slate-900">{current.q}</h2>
          <div className="space-y-3">
            {current.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className={cn(
                  "w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition",
                  feedback && opt === current.a && "border-green-500 bg-green-50",
                  feedback === "wrong" && opt !== current.a && "opacity-40",
                  !feedback && "border-slate-200 hover:border-teal-400"
                )}
              >
                {opt}
                {feedback && opt === current.a && (
                  <CheckCircle2 className="ml-2 inline h-4 w-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
          <button onClick={() => setActiveId(null)} className="mt-6 w-full text-sm text-slate-400 hover:underline">
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-teal-600 hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Reading Games</h1>
        <p className="mb-6 text-slate-500">
          All questions are set for <strong>Grade {grade}</strong>
          {user?.name ? ` (${user.name})` : ""}.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allGames.map((g) => (
            <button
              key={g.id}
              onClick={() => start(g.id)}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-teal-300 hover:shadow-md"
            >
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white", g.color)}>
                <g.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{g.name}</p>
                <p className="text-sm text-slate-500">{g.description}</p>
                <p className="mt-1 text-xs font-medium text-teal-600">Grade {grade} level →</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
