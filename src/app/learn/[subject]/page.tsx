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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gradeContent } from "@/lib/mock-data";
import type { Grade } from "@/types";
import { useState } from "react";

const subjectMeta: Record<string, { name: string; icon: any; color: string; bg: string }> = {
  math: { name: "Math", icon: Calculator, color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
  reading: { name: "Reading", icon: BookOpen, color: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
  grammar: { name: "Grammar", icon: PenTool, color: "from-green-400 to-emerald-500", bg: "bg-green-50" },
  english: { name: "English", icon: MessageCircle, color: "from-purple-400 to-violet-500", bg: "bg-purple-50" },
};

// Simple practice questions per subject (demo)
const practiceQuestions: Record<string, { q: string; a: string; opts: string[] }[]> = {
  math: [
    { q: "What is 6 × 7?", a: "42", opts: ["36", "42", "48", "40"] },
    { q: "What is 15 + 28?", a: "43", opts: ["42", "43", "44", "41"] },
    { q: "What is 56 ÷ 8?", a: "7", opts: ["6", "7", "8", "9"] },
    { q: "What is 9 × 9?", a: "81", opts: ["72", "81", "90", "18"] },
  ],
  reading: [
    { q: "What is the main idea of a story usually found?", a: "In the beginning or repeated throughout", opts: ["Only at the end", "In the beginning or repeated throughout", "In the pictures", "In the title only"] },
    { q: "Context clues help you figure out:", a: "The meaning of unknown words", opts: ["The author's age", "The meaning of unknown words", "How long the book is", "The page numbers"] },
    { q: "A character is:", a: "A person or animal in the story", opts: ["The place the story happens", "A person or animal in the story", "The problem in the story", "The title"] },
  ],
  grammar: [
    { q: "Which word is a noun?", a: "teacher", opts: ["run", "teacher", "quickly", "happy"] },
    { q: "Which sentence is correct?", a: "The dogs are barking.", opts: ["The dogs is barking.", "The dogs are barking.", "The dogs be barking.", "The dogs barking."] },
    { q: "An adjective describes a:", a: "noun", opts: ["verb", "noun", "adverb", "punctuation"] },
    { q: "Which needs an apostrophe?", a: "The dog's bone", opts: ["The dogs bone", "The dog's bone", "The dogs' are running", "dogs run"] },
  ],
  english: [
    { q: "A synonym for 'happy' is:", a: "joyful", opts: ["sad", "joyful", "angry", "tired"] },
    { q: "An antonym for 'hot' is:", a: "cold", opts: ["warm", "cold", "spicy", "bright"] },
    { q: "Which is a complete sentence?", a: "The cat sat on the mat.", opts: ["Sitting on the mat", "The cat sat on the mat.", "The cat", "On the mat"] },
    { q: "Poetry often uses:", a: "rhyme and rhythm", opts: ["only facts", "rhyme and rhythm", "long paragraphs", "no punctuation"] },
  ],
};

export default function SubjectLessonPage() {
  const params = useParams();
  const subject = (params.subject as string)?.toLowerCase() || "math";
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const meta = subjectMeta[subject] || subjectMeta.math;
  const topics = gradeContent[grade]?.[subject as keyof typeof gradeContent[Grade]] || [];
  const questions = practiceQuestions[subject] || practiceQuestions.math;

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);

  const Icon = meta.icon;
  const currentQ = questions[qIndex];

  const startPractice = (topic: string) => {
    setActiveTopic(topic);
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const answer = (selected: string) => {
    if (feedback) return;
    const ok = selected === currentQ.a;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (qIndex < questions.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  // Practice finished
  if (finished && activeTopic) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800">Lesson Complete!</h2>
          <p className="mt-2 text-slate-600">{activeTopic}</p>
          <p className="mt-4 text-4xl font-bold text-blue-600">{score} / {questions.length}</p>
          <p className="text-sm text-slate-500">Great work!</p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => startPractice(activeTopic)} className="flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white">
              Try Again
            </button>
            <button onClick={() => setActiveTopic(null)} className="flex-1 rounded-xl border py-3 font-semibold">
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Practice mode
  if (activeTopic && currentQ) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>{activeTopic}</span>
            <span>Question {qIndex + 1} / {questions.length}</span>
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
          <button onClick={() => setActiveTopic(null)} className="mt-6 w-full text-center text-sm text-slate-400 hover:underline">
            Exit Practice
          </button>
        </div>
      </div>
    );
  }

  // Topic list
  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

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
              Grade {grade} · {topics.length} topics
            </p>
          </div>
        </div>

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
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white", meta.color.includes("blue") ? "bg-blue-500" : meta.color.includes("pink") ? "bg-pink-500" : meta.color.includes("green") ? "bg-green-500" : "bg-purple-500")}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{topic}</p>
                <p className="text-sm text-slate-500">Practice questions available</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
                <Play className="h-3.5 w-3.5" /> Start
              </div>
            </button>
          ))}
        </div>

        {topics.length === 0 && (
          <p className="py-12 text-center text-slate-400">No topics found for this grade yet.</p>
        )}

        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center">
          <Star className="mx-auto mb-2 h-8 w-8 text-amber-400" />
          <p className="font-medium text-slate-700">Want more practice?</p>
          <p className="mt-1 text-sm text-slate-500">
            Try the <Link href="/games" className="text-blue-600 underline">Games</Link> or ask the{" "}
            <Link href="/ai-tutor" className="text-blue-600 underline">AI Tutor</Link> for help!
          </p>
        </div>
      </div>
    </div>
  );
}
