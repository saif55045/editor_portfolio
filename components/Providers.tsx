"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { readSavedSound } from "@/lib/sound";
import { useStore } from "@/lib/store";
import { setLenis } from "@/lib/lenis";
import { TransitionProvider } from "@/components/Transitions";
import { projects } from "@/content/data";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let raf = 0;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, anchors: true });
      setLenis(lenis);
      const loop = (t: number) => {
        lenis!.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    if (window.matchMedia("(pointer: fine)").matches) document.documentElement.classList.add("has-cursor");

    // `next dev` compiles a route the first time it is visited, which makes the first project click slow.
    // Warm it up quietly in the background (a production build is already pre-rendered, so this is dev-only).
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => fetch(`/work/${projects[0].slug}`).catch(() => {}), 2500);
    }

    // remember the sound preference, but never start audio before a user gesture
    if (readSavedSound()) {
      const once = () => {
        useStore.getState().setSound(true);
        window.removeEventListener("pointerdown", once);
      };
      window.addEventListener("pointerdown", once, { once: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
  return <TransitionProvider>{children}</TransitionProvider>;
}
