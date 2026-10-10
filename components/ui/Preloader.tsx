"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/lib/store";

// Plays on every page load / refresh, but not again when navigating back to home client-side.
let played = false;

/** Countdown leader, ~1.3s, skippable by click. The hero reveals as the curtain lifts. */
export default function Preloader() {
  const [n, setN] = useState<number | null>(null);
  const [decided, setDecided] = useState(false); // until the effect runs, keep a solid cover so the page never flashes
  const setIntro = useStore((s) => s.setIntro);

  useEffect(() => {
    if (played || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntro(true);
      setDecided(true);
      return;
    }
    played = true;
    setDecided(true);
    setN(3);
    const timers = [
      setTimeout(() => setN(2), 420),
      setTimeout(() => setN(1), 840),
      setTimeout(() => setN(0), 1260),
    ];
    return () => timers.forEach(clearTimeout);
  }, [setIntro]);

  useEffect(() => {
    if (n === 0) setIntro(true);
  }, [n, setIntro]);

  return (
    <>
    {!decided && (
      <div className="leader-cover fixed inset-0 z-[120] bg-void" />
    )}
    <AnimatePresence>
      {n !== null && n > 0 && (
        <motion.div
          key="leader"
          onClick={() => setN(0)}
          className="fixed inset-0 z-[120] grid place-items-center bg-void"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative grid h-[min(70vw,360px)] w-[min(70vw,360px)] place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-white/20" fill="none" stroke="currentColor" strokeWidth="0.4">
              <circle cx="50" cy="50" r="48" />
              <circle cx="50" cy="50" r="40" />
              <path d="M50 0V100M0 50H100" />
            </svg>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={n}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.25 }}
                className="display text-[clamp(6rem,22vw,12rem)] text-snow"
              >
                {n}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="label absolute bottom-8">Saif Ullah — Reel · click to skip</p>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
