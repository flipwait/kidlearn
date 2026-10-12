"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Grade } from "@/types";

interface AuthContextType {
  user: User | null;
  children: User[];
  isLoading: boolean;
  loginAsParent: () => void;
  loginAsChild: (childId: string) => void;
  logout: () => void;
  addChild: (name: string, grade: Grade) => void;
  switchChild: (childId: string) => void;
  clearAllData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "kidlearn_auth";

/** Remove every KidLearn key so a family truly starts fresh */
export function clearAllKidLearnData() {
  if (typeof window === "undefined") return;
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("kidlearn"));
  keys.forEach((k) => localStorage.removeItem(k));
  // also common feature keys
  ["openai_key", "ai_tutor", "reading_coach"].forEach((k) => {
    // keep openai_key? User might want to keep API key. Only clear learning data.
  });
  // Clear learning-related only; leave openai_key alone
  [
    STORAGE_KEY,
    "kidlearn_badges",
    "kidlearn_weekly_progress",
    "kidlearn_parent_goals",
    "kidlearn_helper",
    "kidlearn_words",
    "kidlearn_adventure_best",
    "kidlearn_read_books",
    "kidlearn_games_won",
    "kidlearn_created_story",
    "kidlearn_coach_used",
    "kidlearn_scanned",
  ].forEach((k) => localStorage.removeItem(k));
  // Avatar configs per user
  Object.keys(localStorage)
    .filter((k) => k.startsWith("kidlearn_avatar"))
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user ?? null);
        setFamilyChildren(Array.isArray(parsed.children) ? parsed.children : []);
      }
      // No saved data → empty family (fresh start)
    } catch (e) {
      console.error("Failed to load auth", e);
    }
    setIsLoading(false);
  }, []);

  const persist = (u: User | null, kids: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, children: kids }));
  };

  const loginAsParent = () => {
    const parent = { ...defaultParent };
    setUser(parent);
    persist(parent, familyChildren);
  };

  const loginAsChild = (childId: string) => {
    const child = familyChildren.find((c) => c.id === childId);
    if (!child) return; // no demo fallback
    setUser(child);
    persist(child, familyChildren);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addChild = (name: string, grade: Grade) => {
    const newChild: User = {
      id: `child-${Date.now()}`,
      name: name.trim(),
      role: "child",
      grade,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      coins: 0,
      streak: 0,
      parentId: defaultParent.id,
    };
    const updated = [...familyChildren, newChild];
    setFamilyChildren(updated);
    // Stay on manage screen; don't force login
    persist(user, updated);
  };

  const switchChild = (childId: string) => {
    loginAsChild(childId);
  };

  const clearAllData = () => {
    clearAllKidLearnData();
    setUser(null);
    setFamilyChildren([]);
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
