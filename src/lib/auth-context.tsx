"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Grade, Assignment } from "@/types";

interface AuthContextType {
  user: User | null;
  children: User[];
  isLoading: boolean;
  loginAsParent: () => void;
  loginAsChild: (childId: string, pin?: string) => boolean;
  logout: () => void;
  addChild: (name: string, grade: Grade, pin: string) => void;
  switchChild: (childId: string) => void;
  clearAllData: () => void;
  assignments: Assignment[];
  addAssignment: (a: Omit<Assignment, "id" | "elapsedSeconds" | "completed" | "createdAt">) => void;
  tickAssignment: (id: string, seconds: number) => void;
  completeAssignment: (id: string) => void;
  getProgressForUser: (userId: string) => { completed: number; totalMinutes: number; assignments: Assignment[] };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "kidlearn_auth";
const ASSIGNMENTS_KEY = "kidlearn_assignments";

export function clearAllKidLearnData() {
  if (typeof window === "undefined") return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith("kidlearn"))
    .forEach((k) => localStorage.removeItem(k));
}

const defaultParent: User = {
  id: "parent-1",
  name: "Parent",
  role: "parent",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Parent",
};

export function AuthProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [familyChildren, setFamilyChildren] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user ?? null);
        setFamilyChildren(Array.isArray(parsed.children) ? parsed.children : []);
      }
      const a = localStorage.getItem(ASSIGNMENTS_KEY);
      if (a) setAssignments(JSON.parse(a));
    } catch (e) {
      console.error("Failed to load auth", e);
    }
    setIsLoading(false);
  }, []);

  const persist = (u: User | null, kids: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, children: kids }));
  };

  const persistAssignments = (list: Assignment[]) => {
    setAssignments(list);
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(list));
  };

  const loginAsParent = () => {
    const parent = { ...defaultParent };
    setUser(parent);
    persist(parent, familyChildren);
  };

  /** Returns false if PIN is wrong */
  const loginAsChild = (childId: string, pin?: string): boolean => {
    const child = familyChildren.find((c) => c.id === childId);
    if (!child) return false;
    // Require PIN only when provided attempt from login screen (pin argument passed)
    // undefined pin = trusted switch from parent session / menu
    if (pin !== undefined && child.pin && pin !== child.pin) return false;
    setUser(child);
    persist(child, familyChildren);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addChild = (name: string, grade: Grade, pin: string) => {
    const newChild: User = {
      id: `child-${Date.now()}`,
      name: name.trim(),
      role: "child",
      grade,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      coins: 0,
      streak: 0,
      parentId: defaultParent.id,
      pin: pin.trim() || "0000",
    };
    const updated = [...familyChildren, newChild];
    setFamilyChildren(updated);
    persist(user, updated);
  };

  const switchChild = (childId: string) => {
    loginAsChild(childId);
  };

  const clearAllData = () => {
    clearAllKidLearnData();
    setUser(null);
    setFamilyChildren([]);
    setAssignments([]);
  };

  const addAssignment = (a: Omit<Assignment, "id" | "elapsedSeconds" | "completed" | "createdAt">) => {
    const item: Assignment = {
      ...a,
      id: `asg-${Date.now()}`,
      elapsedSeconds: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persistAssignments([item, ...assignments]);
  };

  const tickAssignment = (id: string, seconds: number) => {
    persistAssignments(
      assignments.map((x) =>
        x.id === id ? { ...x, elapsedSeconds: x.elapsedSeconds + seconds } : x
      )
    );
  };

  const completeAssignment = (id: string) => {
    persistAssignments(
      assignments.map((x) =>
        x.id === id
          ? { ...x, completed: true, completedAt: new Date().toISOString() }
          : x
      )
    );
  };

  const getProgressForUser = (userId: string) => {
    const list = assignments.filter((a) => a.userId === userId);
    const completed = list.filter((a) => a.completed).length;
    const totalMinutes = Math.round(
      list.reduce((s, a) => s + a.elapsedSeconds, 0) / 60
    );
    return { completed, totalMinutes, assignments: list };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        children: familyChildren,
        isLoading,
        loginAsParent,
        loginAsChild,
        logout,
        addChild,
        switchChild,
        clearAllData,
        assignments,
        addAssignment,
        tickAssignment,
        completeAssignment,
        getProgressForUser,
      }}
    >
      {reactChildren}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
