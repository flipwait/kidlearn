"use client";

import React, { useState, useEffect } from "react";

import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Users, Clock, AlertTriangle, TrendingUp, Brain, BookOpen,
  Calculator, PenTool, MessageCircle, Activity, Target, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { progressData } from "@/lib/mock-data";

export default function ParentPage() {
  const { resolvedTheme } = useTheme();
  const { children: familyChildren, user, getProgressForUser, addAssignment } = useAuth();
  const isKid = resolvedTheme === "kid";
  const kids = familyChildren;

  // Sample richer analytics data
  const weeklyTime = [
    { day: "Mon", emma: 45, liam: 30 },
    { day: "Tue", emma: 60, liam: 40 },
    { day: "Wed", emma: 35, liam: 55 },
    { day: "Thu", emma: 50, liam: 25 },
    { day: "Fri", emma: 70, liam: 45 },
    { day: "Sat", emma: 20, liam: 15 },
    { day: "Sun", emma: 40, liam: 35 },
  ];

  const maxTime = Math.max(...weeklyTime.flatMap((d) => [d.emma, d.liam]));

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>

        <div className="mt-4 mb-8">
          <h1 className={cn("text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
            Parent Dashboard
          </h1>
          <p className={cn(isKid ? "text-blue-600" : "text-slate-500")}>
            Track progress, time, and get AI insights for your children
          </p>
        </div>

        {/* Kids overview cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kids.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="font-medium text-slate-700">No children yet</p>
            <p className="mt-1 text-sm text-slate-500">Add a child from the login screen so progress can show here.</p>
            <Link href="/login?manage=1" className="mt-4 inline-block text-sm font-medium text-teal-600 hover:underline">
              Add a child →
            </Link>
          </div>
        )}
        {kids.map((kid) => {
            const kidProgress = progressData.filter((p) => p.userId === kid.id);
            const avgMastery = kidProgress.length
              ? Math.round(kidProgress.reduce((s, p) => s + p.mastery, 0) / kidProgress.length)
              : kid.grade === 3 ? 78 : 86;
            return (
              <div key={kid.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={kid.avatar} alt={kid.name} className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{kid.name}</p>
                    <p className="text-sm text-slate-500">Grade {kid.grade} · Streak {kid.streak || 0} days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">{avgMastery}%</p>
                    <p className="text-xs text-slate-500">Overall</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                  {["Math", "Reading", "Grammar", "English"].map((subj, i) => {
                    const val = kidProgress[i]?.mastery ?? (60 + i * 8);
                    return (
                      <div key={subj}>
                        <div className="mx-auto mb-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${val}%` }} />
                        </div>
                        <span className="text-slate-500">{subj.slice(0, 4)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-5 text-slate-400">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600">+ Add Child</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Weekly Time Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                <Clock className="h-5 w-5 text-blue-500" /> Time Spent This Week
              </h2>
              <span className="text-sm text-slate-500">Minutes per day</span>
            </div>
            <div className="flex h-48 items-end gap-2">
              {weeklyTime.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end justify-center gap-0.5">
                    <div className="w-3 rounded-t bg-blue-400 transition-all" style={{ height: `${(d.emma / maxTime) * 100}%` }} title={`Emma: ${d.emma}m`} />
                    <div className="w-3 rounded-t bg-teal-400 transition-all" style={{ height: `${(d.liam / maxTime) * 100}%` }} title={`Liam: ${d.liam}m`} />
                  </div>
                  <span className="text-xs text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-6 text-xs">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-400" /> Emma</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-teal-400" /> Liam</span>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Alerts
            </h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="font-medium text-red-800">Emma · Focus time down 22%</p>
                <p className="text-xs text-red-600">Mostly during Math · 2h ago</p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                <p className="font-medium text-orange-800">Liam · 3 incomplete assignments</p>
                <p className="text-xs text-orange-600">Due tomorrow · 5h ago</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="font-medium text-blue-800">Emma · New high-frequency words ready</p>
                <p className="text-xs text-blue-600">From yesterday&apos;s scanner · 1d ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights + Subject Breakdown */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <Brain className="h-5 w-5 text-purple-500" /> AI Insights
            </h2>
            <div className="space-y-3">
              <div className="rounded-xl bg-amber-50 p-4 text-sm">
                <p className="font-medium text-amber-800">Emma is struggling with fractions</p>
                <p className="mt-1 text-amber-700">Accuracy below 60%. Recommend visual models and Fraction Pizza game.</p>
                <Link href="/games" className="mt-2 inline-block text-xs font-medium text-amber-800 underline">Open Games →</Link>
              </div>
              <div className="rounded-xl bg-green-50 p-4 text-sm">
                <p className="font-medium text-green-800">Liam shows strong growth in Reading</p>
                <p className="mt-1 text-green-700">Fluency and comprehension up 18% this month. Great consistency!</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 text-sm">
                <p className="font-medium text-blue-800">Suggestion: Add high-frequency words</p>
                <p className="mt-1 text-blue-700">Both kids would benefit from daily practice of the latest word list.</p>
                <Link href="/words" className="mt-2 inline-block text-xs font-medium text-blue-800 underline">Manage Words →</Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <Target className="h-5 w-5 text-teal-500" /> Subject Mastery Snapshot
            </h2>
            <div className="space-y-4">
              {[
                { name: "Math", icon: Calculator, emma: 72, liam: 81, color: "bg-blue-500" },
                { name: "Reading", icon: BookOpen, emma: 88, liam: 75, color: "bg-pink-500" },
                { name: "Grammar", icon: PenTool, emma: 61, liam: 70, color: "bg-green-500" },
                { name: "English", icon: MessageCircle, emma: 70, liam: 78, color: "bg-purple-500" },
              ].map((s) => (
                <div key={s.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <s.icon className="h-4 w-4 text-slate-400" /> {s.name}
                    </span>
                    <span className="text-slate-500">E {s.emma}% · L {s.liam}%</span>
                  </div>
                  <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-slate-100">
                    <div className={cn("rounded-full", s.color)} style={{ width: `${s.emma}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        {/* Parent Goals */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
            <Target className="h-5 w-5 text-teal-500" /> Parent Goals
          </h2>
          <p className="mb-4 text-sm text-slate-500">Set simple weekly goals for your children. They will appear on the Daily Plan.</p>
          <ParentGoalsEditor />
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Data shown is demo data. In production this connects to real progress tracking.
        </p>
      </div>
    </div>
  );
}

function ParentGoalsEditor() {
  const [goals, setGoals] = useState<string[]>([]);
  const [text, setText] = useState("");
  useEffect(() => {
    try {
      const s = localStorage.getItem("kidlearn_parent_goals");
      if (s) setGoals(JSON.parse(s));
    } catch {}
  }, []);
  const save = (next: string[]) => {
    setGoals(next);
    localStorage.setItem("kidlearn_parent_goals", JSON.stringify(next));
  };
  return (
    <div className="space-y-3">
      {goals.map((g, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
          <span className="flex-1 text-slate-700">{g}</span>
          <button onClick={() => save(goals.filter((_, j) => j !== i))} className="text-red-500 text-xs">Remove</button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Practice fractions 3 times this week"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          onClick={() => { if (text.trim()) { save([...goals, text.trim()]); setText(""); } }}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white"
        >
          Add Goal
        </button>
      </div>
    </div>
  );
}

