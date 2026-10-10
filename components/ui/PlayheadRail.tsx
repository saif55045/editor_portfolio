"use client";
import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { timecode } from "@/lib/utils";

const TOTAL_SECONDS = 90; // the "runtime" of the site

const marks = [
  { id: "top", t: "V1" },
  { id: "reel", t: "REEL" },
  { id: "work", t: "WORK" },
  { id: "grade", t: "GRADE" },
  { id: "process", t: "PROC" },
  { id: "tools", t: "TOOLS" },
  { id: "about", t: "ABOUT" },
  { id: "contact", t: "EXPORT" },
];

/** Fixed timeline: playhead position = scroll progress; timecode = progress × runtime. */
export default function PlayheadRail() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const top = useTransform(p, [0, 1], ["0%", "100%"]);
  const tc = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (tc.current) tc.current.textContent = timecode(v * TOTAL_SECONDS);
  });

  return (
    <>
      {/* desktop: vertical rail */}
      <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-[52vh] -translate-y-1/2 lg:block" aria-hidden>
        <div className="relative h-full w-px bg-white/15">
          <motion.div style={{ top }} className="absolute -left-[5px] flex -translate-y-1/2 items-center">
            <span className="h-[11px] w-[11px] rotate-45 rounded-[2px] bg-amber shadow-[0_0_18px_3px_rgba(255,179,64,0.6)]" />
          </motion.div>
          <motion.div style={{ height: top }} className="absolute left-0 top-0 w-px bg-amber/70" />
        </div>
        <span ref={tc} className="label absolute -left-[88px] bottom-full mb-4 !text-amber">00:00:00:00</span>
      </div>
      {/* mobile: thin top progress bar */}
      <motion.div style={{ scaleX: p }} className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-amber lg:hidden" aria-hidden />
    </>
  );
}

export { marks };
