"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Clock, Play, Pause, CheckCircle2, Plus } from "lucide-react";
import type { Assignment } from "@/types";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AssignmentsPage() {
  const { user, children, assignments, addAssignment, tickAssignment, completeAssignment } = useAuth();
  const [runningId, setRunningId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [title, setTitle] = useState("");
  const [mins, setMins] = useState(15);
  const [type, setType] = useState<Assignment["type"]>("reading");
  const [forUser, setForUser] = useState(user?.id || "");

  useEffect(() => {
    if (user?.id && !forUser) setForUser(user.id);
  }, [user, forUser]);

  useEffect(() => {
    if (!runningId) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      tickAssignment(runningId, 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [runningId, tickAssignment]);

  const mine =
    user?.role === "parent"
      ? assignments
      : assignments.filter((a) => a.userId === user?.id);

  const canComplete = (a: Assignment) =>
    a.elapsedSeconds >= a.requiredMinutes * 60 * 0.9; // 90% of required time

  const create = () => {
    if (!title.trim() || !forUser) return;
    addAssignment({
      userId: forUser,
      title: title.trim(),
      type,
      requiredMinutes: mins,
    });
    setTitle("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-teal-600 hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Assignments</h1>
        <p className="mb-6 text-slate-500">
          Progress stays at zero until the timer meets the required time and you mark complete.
        </p>

        {/* Create (parent or self) */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
            <Plus className="h-4 w-4" /> New assignment
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read chapter + 10 HF words"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Assignment["type"])}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="reading">Reading</option>
              <option value="game">Reading game</option>
              <option value="printable">Printable</option>
              <option value="story">Story creator</option>
              <option value="practice">General practice</option>
            </select>
            <div>
              <label className="text-xs text-slate-500">Required minutes</label>
              <input
                type="number"
                min={5}
                max={120}
                value={mins}
                onChange={(e) => setMins(Number(e.target.value) || 15)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            {user?.role === "parent" && (
              <div>
                <label className="text-xs text-slate-500">For student</label>
                <select
                  value={forUser}
                  onChange={(e) => setForUser(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button
            onClick={create}
            className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Create assignment
          </button>
        </div>

        <div className="space-y-3">
          {mine.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
              No assignments yet. Create one above — progress will stay empty until completed with the timer.
            </p>
          )}
          {mine.map((a) => {
            const requiredSec = a.requiredMinutes * 60;
            const pct = Math.min(100, Math.round((a.elapsedSeconds / requiredSec) * 100));
            const running = runningId === a.id;
            const student = children.find((c) => c.id === a.userId);
            return (
              <div
                key={a.id}
                className={`rounded-xl border bg-white p-5 ${a.completed ? "border-green-200 bg-green-50/50" : "border-slate-200"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{a.title}</p>
                    <p className="text-sm text-slate-500">
                      {a.type} · {a.requiredMinutes} min required
                      {user?.role === "parent" && student ? ` · ${student.name}` : ""}
                    </p>
                  </div>
                  {a.completed ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      <CheckCircle2 className="h-4 w-4" /> Done
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRunningId(running ? null : a.id)}
                        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white ${running ? "bg-amber-500" : "bg-teal-600"}`}
                      >
                        {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Start timer</>}
                      </button>
                      <button
                        onClick={() => completeAssignment(a.id)}
                        disabled={!canComplete(a)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium disabled:opacity-40"
                        title={canComplete(a) ? "Mark complete" : "Need ~90% of required time"}
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(a.elapsedSeconds)} / {a.requiredMinutes}:00
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${a.completed ? "bg-green-500" : "bg-teal-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
