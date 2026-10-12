"use client";

import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Printer, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradeContent } from "@/lib/mock-data";
import type { Grade } from "@/types";

export default function PrintPackPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;
  const content = gradeContent[grade];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50 print:hidden"><ThemeToggle /></div>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="print:hidden">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>
          <h1 className={cn("mt-4 text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
            Weekly Printable Pack
          </h1>
          <p className={cn("mb-6", isKid ? "text-blue-600" : "text-slate-500")}>
            Grade {grade} · Print or save as PDF
          </p>
          <button
            onClick={handlePrint}
            className="mb-8 flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-600"
          >
            <Printer className="h-5 w-5" /> Print / Save as PDF
          </button>
        </div>

        {/* Printable content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none">
          <div className="mb-6 border-b pb-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800">KidLearn Weekly Pack</h2>
            <p className="text-slate-500">Grade {grade} · {user?.name || "Student"}</p>
            <p className="text-sm text-slate-400">{new Date().toLocaleDateString()}</p>
          </div>

          <section className="mb-8">
            <h3 className="mb-3 text-lg font-bold text-slate-800">📚 This Week&apos;s Topics</h3>
            <div className="grid grid-cols-2 gap-4">
              {(["math", "reading", "grammar", "english"] as const).map((subj) => (
                <div key={subj} className="rounded-xl border border-slate-100 p-3">
                  <p className="font-semibold capitalize text-slate-700">{subj}</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                    {(content?.[subj] || []).slice(0, 3).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-lg font-bold text-slate-800">🔢 Quick Math Practice</h3>
            <div className="grid grid-cols-2 gap-3 text-slate-700">
              {grade <= 3 ? (
                <>
                  <p>7 + 8 = ______</p>
                  <p>12 − 5 = ______</p>
                  <p>4 × 3 = ______</p>
                  <p>9 + 6 = ______</p>
                  <p>15 − 9 = ______</p>
                  <p>5 × 2 = ______</p>
                </>
              ) : (
                <>
                  <p>8 × 7 = ______</p>
                  <p>56 ÷ 8 = ______</p>
                  <p>3/4 of 20 = ______</p>
                  <p>15% of 80 = ______</p>
                  <p>9² = ______</p>
                  <p>144 ÷ 12 = ______</p>
                </>
              )}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-lg font-bold text-slate-800">✏️ Grammar</h3>
            <p className="mb-2 text-sm text-slate-600">Circle the correct sentence:</p>
            <ol className="list-inside list-decimal space-y-2 text-slate-700">
              <li>a) The dogs is running. &nbsp; b) The dogs are running.</li>
              <li>a) She walked to school yesterday. &nbsp; b) She walk to school yesterday.</li>
              <li>a) Wow that was fun! &nbsp; b) Wow, that was fun!</li>
            </ol>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-lg font-bold text-slate-800">📖 Reading Response</h3>
            <p className="mb-2 text-sm text-slate-600">
              After reading a book from the library or an AI story, write 2–3 sentences about what happened:
            </p>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-b border-slate-200 pb-4" />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-bold text-slate-800">🔤 High-Frequency Words Practice</h3>
            <p className="mb-2 text-sm text-slate-600">Write each word 2 times:</p>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              {["said", "could", "would", "there", "their", "about", "where", "should"].map((w) => (
                <p key={w}><strong>{w}</strong> _______________ _______________</p>
              ))}
            </div>
          </section>

          <p className="mt-8 text-center text-xs text-slate-400">
            Generated by KidLearn · Practice a little every day!
          </p>
        </div>
      </div>
    </div>
  );
}
