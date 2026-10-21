"use client";

import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Calculator,
  BookOpen,
  PenTool,
  MessageCircle,
  CheckCircle2,
  Play,
  ArrowLeft,
  Star,
  Headphones,
  Sparkles,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gradeContent } from "@/lib/mock-data";
import type { Grade } from "@/types";
import { useState } from "react";
import {
  booksForGrade,
  readingPracticeQuestions,
  grammarQuestions,
  vocabQuestions,
  type ReadingBook,
} from "@/lib/grade-content";

const subjectMeta: Record<string, { name: string; icon: any; color: string; bg: string }> = {
  math: { name: "Math", icon: Calculator, color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
  reading: { name: "Reading", icon: BookOpen, color: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
  grammar: { name: "Grammar", icon: PenTool, color: "from-green-400 to-emerald-500", bg: "bg-green-50" },
  english: { name: "English", icon: MessageCircle, color: "from-purple-400 to-violet-500", bg: "bg-purple-50" },
};

// Reading library – books/passages by approximate grade band
export default function SubjectLessonPage() {
  const params = useParams();
  const subject = (params.subject as string)?.toLowerCase() || "math";
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const meta = subjectMeta[subject] || subjectMeta.math;
  const topics = gradeContent[grade]?.[subject as keyof typeof gradeContent[Grade]] || [];
  const questions =
    subject === "reading"
      ? readingPracticeQuestions(grade)
      : subject === "grammar"
      ? grammarQuestions(grade)
      : subject === "english"
      ? vocabQuestions(grade)
      : readingPracticeQuestions(grade);

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeBook, setActiveBook] = useState<ReadingBook | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [bookMode, setBookMode] = useState<"read" | "quiz">("read");

  const Icon = meta.icon;
  const currentQ = activeBook && bookMode === "quiz"
    ? activeBook.questions[qIndex]
    : questions[qIndex];

  const gradeBooks = booksForGrade(grade);

  const startPractice = (topic: string) => {
    setActiveTopic(topic);
    setActiveBook(null);
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const openBook = (book: ReadingBook) => {
    setActiveBook(book);
    setActiveTopic(null);
    setBookMode("read");
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const answer = (selected: string) => {
    if (feedback || !currentQ) return;
    const ok = selected === currentQ.a;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    const total = activeBook ? activeBook.questions.length : questions.length;
    setTimeout(() => {
      setFeedback(null);
      if (qIndex < total - 1) {
        setQIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  // Finished quiz
  if (finished) {
    const total = activeBook ? activeBook.questions.length : questions.length;
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800">
            {activeBook ? "Book Complete!" : "Lesson Complete!"}
          </h2>
          <p className="mt-2 text-slate-600">{activeBook?.title || activeTopic}</p>
          <p className="mt-4 text-4xl font-bold text-blue-600">{score} / {total}</p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                if (activeBook) {
                  setBookMode("read");
                  setQIndex(0);
                  setScore(0);
                  setFinished(false);
                } else {
                  startPractice(activeTopic!);
                }
              }}
              className="flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white"
            >
              {activeBook ? "Read Again" : "Try Again"}
            </button>
            <button
              onClick={() => { setActiveTopic(null); setActiveBook(null); setFinished(false); }}
              className="flex-1 rounded-xl border py-3 font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reading a book
  if (activeBook && bookMode === "read") {
    return (
      <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <button onClick={() => setActiveBook(null)} className="mb-4 text-sm font-medium text-blue-600 hover:underline">
            ← Back to library
          </button>
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mb-3 text-5xl">{activeBook.emoji}</div>
              <h1 className="text-2xl font-bold text-slate-800">{activeBook.title}</h1>
              <p className="text-sm text-slate-500">{activeBook.author} · {activeBook.level}</p>
            </div>
            <div className="prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-slate-700">
              {activeBook.text}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => { setBookMode("quiz"); setQIndex(0); setScore(0); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 py-3 font-semibold text-white hover:bg-pink-600"
              >
                <CheckCircle2 className="h-5 w-5" /> Answer Questions
              </button>
              <Link
                href="/reading-coach"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Headphones className="h-5 w-5" /> Practice with AI Coach
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz mode (book or topic)
  if ((activeTopic || (activeBook && bookMode === "quiz")) && currentQ) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>{activeBook?.title || activeTopic}</span>
            <span>
              Question {qIndex + 1} / {activeBook ? activeBook.questions.length : questions.length}
            </span>
          </div>
          <h2 className="mb-8 text-center text-xl font-bold text-slate-800">{currentQ.q}</h2>
          <div className="space-y-3">
            {currentQ.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className={cn(
                  "w-full rounded-2xl border-2 py-4 text-left px-5 font-medium transition",
                  feedback && opt === currentQ.a
                    ? "border-green-500 bg-green-50 text-green-800"
                    : feedback === "wrong"
                    ? "border-red-100 bg-red-50 text-red-300"
                    : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                )}
              >
                {opt}
                {feedback && opt === currentQ.a && <CheckCircle2 className="ml-2 inline h-5 w-5 text-green-600" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setActiveTopic(null); setActiveBook(null); }}
            className="mt-6 w-full text-center text-sm text-slate-400 hover:underline"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Main subject view
  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> All Subjects
        </Link>

        <div className="mt-6 mb-8 flex items-center gap-4">
          <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", meta.color)}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className={cn("text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
              {meta.name}
            </h1>
            <p className={cn(isKid ? "text-blue-600" : "text-slate-500")}>
              Content level: Grade {grade}
              {user?.name ? ` · ${user.name}` : ""}
            </p>
          </div>
        </div>

        {/* READING LIBRARY – only for reading subject */}
        {subject === "reading" && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <BookMarked className="h-5 w-5 text-pink-500" />
              Book Library
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Choose a book to read, then answer questions or practice with the AI Reading Coach.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {gradeBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => openBook(book)}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                    isKid ? "border-pink-100 bg-white" : "border-slate-200 bg-white"
                  )}
                >
                  <div className="text-4xl">{book.emoji}</div>
                  <div>
                    <p className="font-semibold text-slate-800">{book.title}</p>
                    <p className="text-xs text-slate-500">{book.level} · {book.author}</p>
                    <p className="mt-2 text-sm text-pink-600 font-medium">Read now →</p>
                  </div>
                </button>
              ))}
            </div>
            {gradeBooks.length === 0 && (
              <p className="text-sm text-slate-400">No books matched this grade yet.</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/create"
                className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600"
              >
                <Sparkles className="h-4 w-4" /> Create a new story with AI
              </Link>
              <Link
                href="/reading-coach"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Headphones className="h-4 w-4" /> AI Reading Coach
              </Link>
            </div>
          </section>
        )}

        {/* Topics / Skills */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            {subject === "reading" ? "Reading Skills Practice" : "Topics"}
          </h2>
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <button
                key={topic}
                onClick={() => startPractice(topic)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  isKid ? "border-blue-100 bg-white" : "border-slate-200 bg-white"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
                  subject === "math" ? "bg-blue-500" :
                  subject === "reading" ? "bg-pink-500" :
                  subject === "grammar" ? "bg-green-500" : "bg-purple-500"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{topic}</p>
                  <p className="text-sm text-slate-500">Practice questions</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
                  <Play className="h-3.5 w-3.5" /> Start
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
