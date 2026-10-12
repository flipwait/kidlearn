"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Grade } from "@/types";
import { children as mockChildren, parentUser, currentChild } from "@/lib/mock-data";

interface AuthContextType {
  user: User | null;
  children: User[];
  isLoading: boolean;
  loginAsParent: () => void;
  loginAsChild: (childId: string) => void;
  logout: () => void;
  addChild: (name: string, grade: Grade) => void;
  switchChild: (childId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "kidlearn_auth";

export function AuthProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [familyChildren, setFamilyChildren] = useState<User[]>(mockChildren);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        if (parsed.children) setFamilyChildren(parsed.children);
      }
    } catch (e) {
      console.error("Failed to load auth", e);
    }
    setIsLoading(false);
  }, []);

  const persist = (u: User | null, kids: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, children: kids }));
  };

  const loginAsParent = () => {
    setUser(parentUser);
    persist(parentUser, familyChildren);
  };

  const loginAsChild = (childId: string) => {
    const child = familyChildren.find((c) => c.id === childId) || currentChild;
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
      name,
      role: "child",
      grade,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      coins: 0,
      streak: 0,
      parentId: parentUser.id,
    };
    const updated = [...familyChildren, newChild];
    setFamilyChildren(updated);
    persist(user, updated);
  };

  const switchChild = (childId: string) => {
    loginAsChild(childId);
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
