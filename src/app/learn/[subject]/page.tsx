"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  BookOpen,
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
import { ThemeToggle } from "@/components/theme-toggle";

export default function SubjectLessonPage() {
  const params = useParams();
  const subject = (params.subject as string)?.toLowerCase() || "reading";
  const { user } = useAuth();
  const grade = (user?.grade || 3) as Grade;

  const [activeBook, setActiveBook] = useState<ReadingBook | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [bookMode, setBookMode] = useState<"read" | "quiz">("read");

  const gradeBooks = booksForGrade(grade);
  const currentQ = activeBook && bookMode === "quiz" ? activeBook.questions[qIndex] : null;

  const openBook = (book: ReadingBook) => {
    setActiveBook(book);
    setBookMode("read");
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const answer = (selected: string) => {
    if (!currentQ || feedback) return;
    const ok = selected === currentQ.a;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (activeBook && qIndex < activeBook.questions.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    }, 700);
  };

  // Redirect non-reading subjects to reading (lessons are reading-focused)
  if (subject !== "reading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="text-center">
          <p className="mb-4 text-slate-600 dark:text-slate-300">Lessons are centered on Reading.</p>
          <Link href="/learn/reading" className="font-medium text-teal-600 hover:underline">
            Go to Reading →
          </Link>
        </div>
      </div>
    );
  }

  if (finished && activeBook) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold">Story complete</h2>
          <p className="mt-2 text-slate-500">{activeBook.title}</p>
          <p className="mt-4 text-3xl font-bold text-teal-600">
            {score} / {activeBook.questions.length}
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                setBookMode("read");
                setQIndex(0);
                setScore(0);
                setFinished(false);
              }}
              className="flex-1 rounded-xl bg-teal-600 py-3 font-semibold text-white"
            >
              Read again
            </button>
            <button
              onClick={() => {
                setActiveBook(null);
                setFinished(false);
              }}
              className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold dark:border-slate-700"
            >
              Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeBook && bookMode === "read") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
        <div className="fixed right-4 top-4 z-50">
          <ThemeToggle />
        </div>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <button onClick={() => setActiveBook(null)} className="mb-4 text-sm font-medium text-teal-600 hover:underline">
            ← Back to library
          </button>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 text-center">
              <div className="mb-3 text-5xl">{activeBook.emoji}</div>
              <h1 className="text-2xl font-bold">{activeBook.title}</h1>
              <p className="text-sm text-slate-500">
                {activeBook.level} · {activeBook.author}
              </p>
            </div>
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {activeBook.text}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setBookMode("quiz");
                  setQIndex(0);
                  setScore(0);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white"
              >
                <CheckCircle2 className="h-5 w-5" /> Answer questions
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
      </div>
    );
  }

  if (activeBook && bookMode === "quiz" && currentQ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>{activeBook.title}</span>
            <span>
              {qIndex + 1} / {activeBook.questions.length}
            </span>
          </div>
          <h2 className="mb-8 text-center text-xl font-bold">{currentQ.q}</h2>
          <div className="space-y-3">
            {currentQ.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className={cn(
                  "w-full rounded-xl border-2 px-5 py-4 text-left font-medium transition",
                  feedback && opt === currentQ.a && "border-green-500 bg-green-50 dark:bg-green-950",
                  feedback === "wrong" && opt !== currentQ.a && "opacity-40",
                  !feedback && "border-slate-200 hover:border-teal-400 dark:border-slate-700"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => setActiveBook(null)}
            className="mt-6 w-full text-center text-sm text-slate-400 hover:underline"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Library
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <div className="mt-6 mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Reading</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Short stories for Grade {grade}
              {user?.name ? ` · ${user.name}` : ""}
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <BookMarked className="h-5 w-5 text-teal-600" />
            Story library
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {gradeBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => openBook(book)}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-4xl">{book.emoji}</div>
                <div>
                  <p className="font-semibold">{book.title}</p>
                  <p className="text-xs text-slate-500">
                    {book.level} · {book.author}
                  </p>
                  <p className="mt-2 text-sm font-medium text-teal-600">Read now →</p>
                </div>
              </button>
            ))}
          </div>
          {gradeBooks.length === 0 && (
            <p className="text-sm text-slate-400">No stories for this grade yet.</p>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Sparkles className="h-4 w-4" /> Create more with AI
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
      </div>
    </div>
  );
}
