"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Save, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

const SKIN = ["#FCD7B6", "#E0AC69", "#8D5524", "#FFDBAC", "#C68642"];
const HAIR = ["#1a1a1a", "#4a3728", "#b5651d", "#d4a017", "#e8e8e8", "#c0392b", "#8e44ad"];
const SHIRT = ["#3b82f6", "#ec4899", "#22c55e", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];
const PETS = ["none", "🐶", "🐱", "🐰", "🦊", "🐼", "🦄", "🐸"];
const HATS = ["none", "🎩", "👑", "🎓", "🧢", "🌸", "⭐"];
const ACCESSORIES = ["none", "👓", "🕶️", "🎀", "💎"];

export type AvatarConfig = {
  skin: string;
  hair: string;
  shirt: string;
  pet: string;
  hat: string;
  accessory: string;
};

const DEFAULT: AvatarConfig = {
  skin: SKIN[0],
  hair: HAIR[0],
  shirt: SHIRT[0],
  pet: "none",
  hat: "none",
  accessory: "none",
};

const STORAGE = "kidlearn_avatar";

export default function AvatarPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const [cfg, setCfg] = useState<AvatarConfig>(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const key = `${STORAGE}_${user?.id || "default"}`;
      const s = localStorage.getItem(key);
      if (s) setCfg(JSON.parse(s));
    } catch {}
  }, [user?.id]);

  const update = (key: keyof AvatarConfig, val: string) => {
    setCfg((c) => ({ ...c, [key]: val }));
  };

  const randomize = () => {
    setCfg({
      skin: SKIN[Math.floor(Math.random() * SKIN.length)],
      hair: HAIR[Math.floor(Math.random() * HAIR.length)],
      shirt: SHIRT[Math.floor(Math.random() * SHIRT.length)],
      pet: PETS[Math.floor(Math.random() * PETS.length)],
      hat: HATS[Math.floor(Math.random() * HATS.length)],
      accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)],
    });
  };

  const save = () => {
    const key = `${STORAGE}_${user?.id || "default"}`;
    localStorage.setItem(key, JSON.stringify(cfg));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>
        <h1 className={cn("mt-4 text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>Avatar Customizer</h1>
        <p className={cn("mb-8", isKid ? "text-blue-600" : "text-slate-500")}>Make your hero look unique!</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Preview */}
          <div className="flex flex-col items-center rounded-3xl bg-white p-8 shadow-sm">
            <div className="relative mb-4">
              <div
                className="flex h-32 w-32 items-center justify-center rounded-full text-5xl shadow-lg"
                style={{ backgroundColor: cfg.skin }}
              >
                😊
              </div>
              {/* Hair overlay approximation */}
              <div
                className="absolute -top-2 left-1/2 h-10 w-24 -translate-x-1/2 rounded-t-full"
                style={{ backgroundColor: cfg.hair }}
              />
              {cfg.hat !== "none" && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">{cfg.hat}</div>
              )}
              {cfg.accessory !== "none" && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 text-2xl">{cfg.accessory}</div>
              )}
              {/* Shirt */}
              <div
                className="mx-auto -mt-2 h-16 w-28 rounded-b-3xl"
                style={{ backgroundColor: cfg.shirt }}
              />
              {cfg.pet !== "none" && (
                <div className="absolute -bottom-2 -right-4 text-4xl">{cfg.pet}</div>
              )}
            </div>
            <p className="font-semibold text-slate-800">{user?.name || "Hero"}</p>
            <p className="text-sm text-slate-500">Grade {user?.grade || 3}</p>
          </div>

          {/* Controls */}
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            {[
              { label: "Skin", key: "skin" as const, opts: SKIN, type: "color" },
              { label: "Hair", key: "hair" as const, opts: HAIR, type: "color" },
              { label: "Shirt", key: "shirt" as const, opts: SHIRT, type: "color" },
              { label: "Hat", key: "hat" as const, opts: HATS, type: "emoji" },
              { label: "Glasses", key: "accessory" as const, opts: ACCESSORIES, type: "emoji" },
              { label: "Pet", key: "pet" as const, opts: PETS, type: "emoji" },
            ].map((row) => (
              <div key={row.key}>
                <p className="mb-1.5 text-sm font-medium text-slate-600">{row.label}</p>
                <div className="flex flex-wrap gap-2">
                  {row.opts.map((o) => (
                    <button
                      key={o}
                      onClick={() => update(row.key, o)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-lg transition",
                        cfg[row.key] === o ? "border-blue-500 scale-110" : "border-transparent"
                      )}
                      style={row.type === "color" ? { backgroundColor: o } : undefined}
                    >
                      {row.type === "emoji" ? (o === "none" ? "∅" : o) : null}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button onClick={randomize} className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium">
                <Shuffle className="h-4 w-4" /> Random
              </button>
              <button onClick={save} className={cn("flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white", isKid ? "bg-blue-500" : "bg-teal-600")}>
                <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
