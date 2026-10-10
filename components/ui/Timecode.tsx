"use client";
import { useEffect, useRef } from "react";
import { timecode } from "@/lib/utils";

/** Live ticking timecode — writes straight to the DOM so it never re-renders React. */
export default function Timecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 66 && ref.current) {
        last = now;
        ref.current.textContent = timecode((now - start) / 1000);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref} className={`tabular-nums ${className}`}>00:00:00:00</span>;
}
