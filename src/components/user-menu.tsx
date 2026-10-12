"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { ChevronDown, Users, LogOut, UserPlus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu({ isKid = false }: { isKid?: boolean }) {
  const { user, children, loginAsParent, loginAsChild, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const handleSwitch = (childId: string) => {
    loginAsChild(childId);
    setOpen(false);
    router.push("/dashboard");
  };

  const handleParent = () => {
    loginAsParent();
    setOpen(false);
    router.push("/parent");
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition",
          isKid
            ? "bg-white shadow-soft hover:bg-blue-50"
            : "bg-slate-100 hover:bg-slate-200"
        )}
      >
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          alt={user.name}
          className="h-7 w-7 rounded-full"
        />
        <span className="hidden sm:inline">{user.name}</span>
        {user.role === "child" && (
          <span className="hidden text-xs text-slate-500 sm:inline">G{user.grade}</span>
        )}
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">
              {user.role === "parent" ? "Parent account" : `Grade ${user.grade} · Child`}
            </p>
          </div>

          {children.length > 0 && (
            <div className="py-1">
              <p className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                Switch to
              </p>
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleSwitch(child.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50",
                    user.id === child.id && "bg-blue-50 font-medium text-blue-700"
                  )}
                >
                  <img src={child.avatar} alt={child.name} className="h-8 w-8 rounded-full" />
                  <div>
                    <p>{child.name}</p>
                    <p className="text-xs text-slate-500">Grade {child.grade}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 py-1">
            {user.role !== "parent" && (
              <button
                onClick={handleParent}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50"
              >
                <Shield className="h-4 w-4 text-slate-500" />
                Parent Dashboard
              </button>
            )}
            <button
              onClick={() => { setOpen(false); router.push("/login"); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50"
            >
              <UserPlus className="h-4 w-4 text-slate-500" />
              Add / Manage Users
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
