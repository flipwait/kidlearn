"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import type { Grade } from "@/types";
import { UserPlus, Users, LogOut, Trash2, ArrowRight, Lock } from "lucide-react";

function LoginContent() {
  const { loginAsParent, loginAsChild, children, addChild, user, logout, clearAllData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isManage = searchParams.get("manage") === "1";

  const [mode, setMode] = useState<"select" | "add-child" | "pin">("select");
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<Grade>(3);
  const [newPin, setNewPin] = useState("");
  const [pinChildId, setPinChildId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (user && !isManage) {
      router.replace(user.role === "parent" ? "/parent" : "/dashboard");
    }
  }, [user, isManage, router]);

  const handleParentLogin = () => {
    loginAsParent();
    router.push("/parent");
  };

  const startChildLogin = (id: string) => {
    const child = children.find((c) => c.id === id);
    if (child?.pin) {
      setPinChildId(id);
      setPinInput("");
      setPinError("");
      setMode("pin");
    } else {
      loginAsChild(id);
      router.push("/dashboard");
    }
  };

  const submitPin = () => {
    if (!pinChildId) return;
    const ok = loginAsChild(pinChildId, pinInput);
    if (ok) {
      router.push("/dashboard");
    } else {
      setPinError("Wrong PIN. Try again.");
      setPinInput("");
    }
  };

  const handleAddChild = () => {
    if (!newName.trim()) return;
    const pin = newPin.trim() || "0000";
    if (!/^\d{4}$/.test(pin)) {
      alert("PIN must be 4 digits");
      return;
    }
    addChild(newName.trim(), newGrade, pin);
    setNewName("");
    setNewPin("");
    setNewGrade(3);
    setMode("select");
  };

  const handleClearAll = () => {
    if (confirm("Erase all kids, progress, and assignments so everyone starts fresh?")) {
      clearAllData();
      window.location.href = "/login";
    }
  };

  if (mode === "pin") {
    const child = children.find((c) => c.id === pinChildId);
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <img src={child?.avatar} alt="" className="mx-auto mb-3 h-16 w-16 rounded-full" />
            <h2 className="text-xl font-bold text-slate-900">{child?.name}</h2>
            <p className="text-sm text-slate-500">Enter your 4-digit PIN</p>
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => e.key === "Enter" && submitPin()}
            autoFocus
            className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl tracking-[0.5em] focus:border-teal-500 focus:outline-none"
            placeholder="••••"
          />
          {pinError && <p className="mb-2 text-center text-sm text-red-500">{pinError}</p>}
          <button
            onClick={submitPin}
            disabled={pinInput.length !== 4}
            className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            Log in
          </button>
          <button onClick={() => setMode("select")} className="mt-3 w-full text-sm text-slate-500 hover:underline">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-2xl font-bold text-white shadow-lg shadow-violet-500/30">
            T
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TutorMe</h1>
          <p className="text-slate-500">{isManage ? "Manage users" : "Each student has their own login"}</p>
        </div>

        {mode === "select" ? (
          <>
            <button
              onClick={handleParentLogin}
              className="mb-4 flex w-full items-center gap-3 rounded-xl border-2 border-slate-200 p-4 text-left transition hover:border-teal-400 hover:bg-teal-50"
            >
              <div className="rounded-lg bg-teal-100 p-3">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">Parent / Guardian</p>
                <p className="text-sm text-slate-500">Progress, assignments & goals</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300" />
            </button>

            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-slate-600">
                {children.length > 0 ? "Student login:" : "No students yet — add one below"}
              </p>
              <div className="space-y-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => startChildLogin(child.id)}
                    className="flex w-full items-center gap-3 rounded-xl border-2 border-slate-200 p-3 text-left transition hover:border-teal-400 hover:bg-teal-50"
                  >
                    <img src={child.avatar} alt={child.name} className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{child.name}</p>
                      <p className="text-sm text-slate-500">Grade {child.grade} · PIN login</p>
                    </div>
                    <Lock className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setNewName("");
                setNewPin("");
                setNewGrade(3);
                setMode("add-child");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-medium text-white hover:bg-teal-700"
            >
              <UserPlus className="h-4 w-4" />
              Add a student
            </button>

            {(isManage || user) && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { logout(); router.push("/login"); }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Start fresh
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Add a student</h2>
            <p className="text-sm text-slate-500">Each student gets their own name, grade, and 4-digit PIN.</p>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Student name"
                autoFocus
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Grade</label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(Number(e.target.value) as Grade)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">4-digit PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="e.g. 1234"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 tracking-widest focus:border-teal-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">Student will enter this PIN to log in</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMode("select")} className="flex-1 rounded-xl border border-slate-200 py-3 font-medium text-slate-600">
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                disabled={!newName.trim() || newPin.length !== 4}
                className="flex-1 rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                Add Student
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Data stays in this browser. Each student logs in with their own PIN.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
