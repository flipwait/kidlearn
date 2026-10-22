"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ArrowLeft,
  Headphones,
  Sparkles,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";
import { useState } from "react";
import { booksForGrade, type ReadingBook } from "@/lib/grade-content";
import { mathQuestionsForGrade, mathTopicsForGrade } from "@/lib/math-by-grade";
import { AppShell } from "@/components/app-shell";

export default function SubjectLessonPage() {
  const params = useParams();
  const subject = (params.subject as string)?.toLowerCase() || "reading";
  const { user } = useAuth();
  const grade = (user?.grade || 3) as Grade;

  const [activeBook, setActiveBook] = useState<ReadingBook | null>(null);
  const [mathMode, setMathMode] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [bookMode, setBookMode] = useState<"read" | "quiz">("read");

  const gradeBooks = booksForGrade(grade);
  const mathQs = mathQuestionsForGrade(grade);
  const mathTopics = mathTopicsForGrade(grade);

  const currentBookQ = activeBook && bookMode === "quiz" ? activeBook.questions[qIndex] : null;
  const currentMathQ = mathMode ? mathQs[qIndex] : null;

  const openBook = (book: ReadingBook) => {
    setActiveBook(book);
    setBookMode("read");
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const startMath = () => {
    setMathMode(true);
    setActiveBook(null);
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const answer = (selected: string, correct: string, total: number) => {
    if (feedback) return;
    const ok = selected === correct;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (qIndex < total - 1) setQIndex((i) => i + 1);
      else setFinished(true);
    }, 750);
  };

  // ---- Finished ----
  if (finished) {
    const total = mathMode ? mathQs.length : activeBook?.questions.length || 0;
    return (
      <AppShell>
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold">Great work!</h2>
          <p className="mt-2 text-slate-500">
            {mathMode ? `Math · Grade ${grade}` : activeBook?.title}
          </p>
          <p className="mt-4 text-3xl font-bold text-violet-600">
            {score} / {total}
          </p>
          <div className="mt-8 flex w-full gap-3">
            <button
              onClick={() => {
                setQIndex(0);
                setScore(0);
                setFinished(false);
                if (mathMode) setMathMode(true);
                else setBookMode("read");
              }}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-semibold text-white"
            >
              Try again
            </button>
            <button
              onClick={() => {
                setFinished(false);
                setMathMode(false);
                setActiveBook(null);
              }}
              className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold dark:border-slate-700"
            >
              Back
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ---- Math quiz (answers only revealed after pick via feedback, never in question) ----
  if (mathMode && currentMathQ) {
    return (
      <AppShell title={`Math · Grade ${grade}`} subtitle="Choose the correct answer">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>Question {qIndex + 1}</span>
            <span>
              {qIndex + 1} / {mathQs.length}
            </span>
          </div>
          <h2 className="mb-8 text-center text-xl font-bold sm:text-2xl">{currentMathQ.q}</h2>
          <div className="space-y-3">
            {currentMathQ.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt, currentMathQ.a, mathQs.length)}
                disabled={!!feedback}
                className={cn(
                  "w-full rounded-xl border-2 px-5 py-4 text-left text-lg font-medium transition",
                  feedback && opt === currentMathQ.a && "border-green-500 bg-green-50 dark:bg-green-950",
                  feedback === "wrong" && opt !== currentMathQ.a && "opacity-40",
                  !feedback && "border-slate-200 hover:border-violet-400 dark:border-slate-700"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback === "wrong" && (
            <p className="mt-4 text-center text-sm text-slate-500">
              Correct answer: <strong>{currentMathQ.a}</strong>
            </p>
          )}
          <button onClick={() => setMathMode(false)} className="mt-6 w-full text-sm text-slate-400 hover:underline">
            Exit
          </button>
        </div>
      </AppShell>
    );
  }

  // ---- Read book ----
  if (activeBook && bookMode === "read") {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl">
          <button onClick={() => setActiveBook(null)} className="mb-4 text-sm font-medium text-violet-600 hover:underline">
            ← Library
          </button>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mb-3 text-5xl">{activeBook.emoji}</div>
              <h1 className="text-2xl font-bold">{activeBook.title}</h1>
              <p className="text-sm text-slate-500">{activeBook.level}</p>
            </div>
            <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
              {activeBook.text}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setBookMode("quiz");
                  setQIndex(0);
                  setScore(0);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-semibold text-white"
              >
                <CheckCircle2 className="h-5 w-5" /> Questions
              </button>
              <Link
                href="/reading-coach"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold dark:border-slate-700"
              >
                <Headphones className="h-5 w-5" /> Reading Coach
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ---- Book quiz ----
  if (activeBook && bookMode === "quiz" && currentBookQ) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>{activeBook.title}</span>
            <span>
              {qIndex + 1} / {activeBook.questions.length}
            </span>
          </div>
          <h2 className="mb-8 text-center text-xl font-bold">{currentBookQ.q}</h2>
          <div className="space-y-3">
            {currentBookQ.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt, currentBookQ.a, activeBook.questions.length)}
                disabled={!!feedback}
                className={cn(
                  "w-full rounded-xl border-2 px-5 py-4 text-left font-medium transition",
                  feedback && opt === currentBookQ.a && "border-green-500 bg-green-50 dark:bg-green-950",
                  feedback === "wrong" && opt !== currentBookQ.a && "opacity-40",
                  !feedback && "border-slate-200 hover:border-violet-400 dark:border-slate-700"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <button onClick={() => setActiveBook(null)} className="mt-6 w-full text-sm text-slate-400 hover:underline">
            Exit
          </button>
        </div>
      </AppShell>
    );
  }

  // ---- Math hub ----
  if (subject === "math") {
    return (
      <AppShell title="Math" subtitle={`Grade ${grade} topics — practice without spoilers`}>
        <div className="mb-6 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-5 dark:border-emerald-800">
          <h2 className="mb-2 font-semibold">This grade covers</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {mathTopics.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-emerald-600">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={startMath}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/20 sm:w-auto sm:px-10"
        >
          <Calculator className="h-5 w-5" /> Start Grade {grade} practice
        </button>
        <p className="mt-3 text-sm text-slate-500">
          Questions match Grade {grade}. Answers stay hidden until you choose.
        </p>
      </AppShell>
    );
  }

  // ---- Reading library ----
  return (
    <AppShell title="Reading" subtitle={`Short stories for Grade ${grade}`}>
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <BookMarked className="h-5 w-5 text-violet-600" /> Story library
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {gradeBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => openBook(book)}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm transition hover:border-violet-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="text-4xl">{book.emoji}</div>
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-xs text-slate-500">{book.level}</p>
                <p className="mt-2 text-sm font-medium text-violet-600">Read →</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/create"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white"
        >
          <Sparkles className="h-4 w-4" /> Create with AI
        </Link>
        <Link
          href="/reading-coach"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
        >
          <Headphones className="h-4 w-4" /> Reading Coach
        </Link>
        <Link
          href="/games"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
        >
          Reading Games
        </Link>
      </div>
    </AppShell>
  );
}
