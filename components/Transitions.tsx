"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { getLenis } from "@/lib/lenis";

const RETURN_KEY = "su-return-y";
const EXIT_MS = 230;

// true once the visitor has navigated client-side at least once (so the very first load doesn't re-animate)
let navigated = false;

const Ctx = createContext<(href: string) => void>(() => {});
export const useGo = () => useContext(Ctx);

/**
 * Simple, visible page change:
 *  1. click  -> the current page fades down (see globals.css `data-leaving`) and a thin amber line shows progress
 *  2. route swaps
 *  3. new page fades/slides in (<PageIn/>)
 * Leaving the home page remembers the exact scroll position, so "back" returns to where you clicked.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearLeaving = useCallback(() => {
    document.documentElement.removeAttribute("data-leaving");
    loadingRef.current = false;
    setLoading(false);
  }, []);

  // After a route swap Lenis must re-measure, otherwise it clamps to the previous (shorter) page.
  // `returnY` is the scroll position saved when the visitor left the home page (null = nothing saved).
  const place = useCallback((returnY: number | null) => {
    const lenis = getLenis();
    lenis?.resize();
    let target: number | HTMLElement = 0;
    if (window.location.hash) {
      target = document.querySelector<HTMLElement>(window.location.hash) ?? 0;
    } else if (window.location.pathname === "/") {
      target = returnY !== null ? returnY : document.getElementById("work") ?? 0; // no saved spot: land on Work
    }
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else if (typeof target === "number") window.scrollTo(0, target);
    else target.scrollIntoView();
  }, []);

  const go = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        router.push(href);
        return;
      }
      navigated = true;
      if (window.location.pathname === "/") {
        try { sessionStorage.setItem(RETURN_KEY, String(Math.round(window.scrollY))); } catch {}
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      document.documentElement.setAttribute("data-leaving", "1");
      loadingRef.current = true;
      setLoading(true);
      timers.current.forEach(clearTimeout);
      timers.current = [
        window.setTimeout(() => router.push(href), EXIT_MS),
        window.setTimeout(clearLeaving, 12000), // safety net
      ];
    },
    [router, clearLeaving],
  );

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    navigated = true; // covers the browser back/forward buttons too
    timers.current.forEach(clearTimeout);
    timers.current = [];
    let saved: number | null = null;
    try {
      const raw = sessionStorage.getItem(RETURN_KEY);
      if (raw !== null && window.location.pathname === "/") {
        saved = Number(raw);
        sessionStorage.removeItem(RETURN_KEY); // used once, so it can't go stale
      }
    } catch {}
    place(saved);
    const t = window.setTimeout(() => place(saved), 120);
    if (loadingRef.current || document.documentElement.hasAttribute("data-leaving")) clearLeaving();
    return () => clearTimeout(t);
  }, [pathname, place, clearLeaving]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[250] h-[3px]" aria-hidden>
        <motion.div
          className="h-full origin-left bg-amber shadow-[0_0_12px_1px_rgba(255,179,64,.8)]"
          initial={false}
          animate={loading ? { scaleX: 0.85, opacity: 1 } : { scaleX: 1, opacity: 0 }}
          transition={loading ? { scaleX: { duration: 6, ease: [0.1, 0.8, 0.2, 1] }, opacity: { duration: 0 } } : { scaleX: { duration: 0.2 }, opacity: { duration: 0.25, delay: 0.15 } }}
          style={{ scaleX: 0 }}
        />
      </div>
    </Ctx.Provider>
  );
}

/** Wrap a page's content so it fades (and optionally slides up) in after a client-side navigation. */
export function PageIn({ children, slide = false, className }: { children: React.ReactNode; slide?: boolean; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={navigated ? { opacity: 0, y: slide ? 32 : 0 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Drop-in replacement for next/link that plays the page transition. */
export function TLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const go = useGo();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(typeof href === "string" ? href : href.pathname ?? "/");
      }}
    />
  );
}
