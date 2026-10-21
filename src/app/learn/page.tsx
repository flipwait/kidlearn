"use client";

import Link from "next/link";
import { BookOpen, Gamepad2, Printer, Sparkles } from "lucide-react";

const cards = [
  { href: "/learn/reading", title: "Reading", desc: "Books, passages & comprehension", icon: BookOpen, color: "bg-blue-50 border-blue-100" },
  { href: "/games", title: "Reading Games", desc: "Word games and practice", icon: Gamepad2, color: "bg-purple-50 border-purple-100" },
  { href: "/printables", title: "Printable Materials", desc: "Worksheets, puzzles, crosswords", icon: Printer, color: "bg-amber-50 border-amber-100" },
  { href: "/create", title: "Story Creator", desc: "AI stories with your word lists", icon: Sparkles, color: "bg-pink-50 border-pink-100" },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-teal-600 hover:underline">← Dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Lessons</h1>
        <p className="mb-8 text-slate-500">Reading-focused practice for every student</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className={`flex items-start gap-4 rounded-xl border p-6 transition hover:shadow-md ${c.color}`}>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <c.icon className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{c.title}</p>
                <p className="text-sm text-slate-500">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
