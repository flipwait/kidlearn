"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Grade } from "@/types";
import { BookOpen, UserPlus, Users, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const { loginAsParent, loginAsChild, children, addChild, user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"select" | "add-child">("select");
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<Grade>(3);

  // If already logged in, redirect
  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleParentLogin = () => {
    loginAsParent();
    router.push("/dashboard");
  };

  const handleChildLogin = (id: string) => {
    loginAsChild(id);
    router.push("/dashboard");
  };

  const handleAddChild = () => {
    if (!newName.trim()) return;
    addChild(newName.trim(), newGrade);
    setNewName("");
    setMode("select");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-3xl shadow-lg">
            📚
          </div>
          <h1 className="text-2xl font-bold text-slate-900">KidLearn</h1>
          <p className="text-slate-500">Learning for Grades 2–10</p>
        </div>

        {mode === "select" ? (
          <>
            <button
              onClick={handleParentLogin}
              className="mb-4 flex w-full items-center gap-3 rounded-2xl border-2 border-slate-200 p-4 text-left transition hover:border-teal-400 hover:bg-teal-50"
            >
              <div className="rounded-xl bg-teal-100 p-3">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Parent / Guardian</p>
                <p className="text-sm text-slate-500">View progress & manage kids</p>
              </div>
            </button>

            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-slate-600">Or continue as a child:</p>
              <div className="space-y-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleChildLogin(child.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border-2 border-slate-200 p-3 text-left transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-slate-800">{child.name}</p>
                      <p className="text-sm text-slate-500">Grade {child.grade}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMode("add-child")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              <UserPlus className="h-4 w-4" />
              Add another child
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Add a Child</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Child's name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Grade</label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(Number(e.target.value) as Grade)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMode("select")}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                className="flex-1 rounded-xl bg-blue-500 py-3 font-medium text-white hover:bg-blue-600"
              >
                Add Child
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo mode — data is stored in your browser. Unlimited children supported.
        </p>
      </div>
    </div>
  );
}
