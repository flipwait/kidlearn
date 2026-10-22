"use client";

import { useEffect, useState } from "react";

export function Confetti({ show, onDone }: { show: boolean; onDone?: () => void }) {
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; rot: number }[]>([]);

  useEffect(() => {
    if (!show) return;
    const colors = ["#f472b6", "#a78bfa", "#34d399", "#fbbf24", "#60a5fa", "#fb7185", "#c084fc"];
    const next = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.4,
      rot: Math.random() * 360,
    }));
    setPieces(next);
    const t = setTimeout(() => {
      setPieces([]);
      onDone?.();
    }, 2200);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 h-3 w-3 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall 2s ease-in forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.value = 0.15;
      osc.start(ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch {}
}

export function playClickSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.value = 0.08;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}
