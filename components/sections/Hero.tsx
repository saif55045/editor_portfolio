"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue } from "motion/react";
import { profile } from "@/content/data";
import { SplitText } from "@/components/motion/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import Timecode from "@/components/ui/Timecode";
import HeroCards from "./HeroCards";
import { useStore } from "@/lib/store";
import { REEL_SRC } from "@/content/media";

let warmEl: HTMLVideoElement | null = null;
function warmReel() {
  if (warmEl || !REEL_SRC) return;
  warmEl = document.createElement("video");
  warmEl.preload = "auto";
  warmEl.muted = true;
  warmEl.src = REEL_SRC;
}

const LightLeak = dynamic(() => import("@/components/canvas/LightLeak"), { ssr: false });

const blobs = [
  { c: "#7c6cff", s: "46vw", x: ["-8%", "6%", "-8%"], y: ["-6%", "10%", "-6%"], pos: "left-[-8%] top-[-12%]", d: 18 },
  { c: "#ff5c8a", s: "40vw", x: ["4%", "-8%", "4%"], y: ["8%", "-6%", "8%"], pos: "right-[-10%] top-[10%]", d: 22 },
  { c: "#3dd9f5", s: "34vw", x: ["-5%", "8%", "-5%"], y: ["6%", "-10%", "6%"], pos: "left-[20%] bottom-[-18%]", d: 20 },
  { c: "#ffb340", s: "22vw", x: ["0%", "-10%", "0%"], y: ["0%", "8%", "0%"], pos: "right-[18%] bottom-[2%]", d: 16 },
];

/** WebGL background only when the device can take it; the CSS aurora is always underneath as fallback. */
function canRunWebGL() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (mem !== undefined && mem < 4) {
    console.info("[hero] WebGL background skipped: low device memory");
    return false;
  }
  try {
    if (document.createElement("canvas").getContext("webgl2")) return true;
  } catch {}
  console.info("[hero] WebGL background skipped: WebGL2 unavailable");
  return false;
}

export default function Hero() {
  const setReelOpen = useStore((s) => s.setReelOpen);
  const intro = useStore((s) => s.intro);
  const section = useRef<HTMLElement>(null);
  const [gl, setGl] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const [active, setActive] = useState(true);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    if (!canRunWebGL()) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = idle(() => setGl(true));
    return () => (window.cancelIdleCallback ?? clearTimeout)(id as number);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: intro ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      ref={section}
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-[var(--gutter)] pb-14 pt-28"
      onPointerMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* Layer 1: CSS aurora — instant first paint and the no-WebGL fallback */}
      <div className="absolute inset-0 -z-10 bg-void" aria-hidden>
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full opacity-[0.38] blur-[110px] ${b.pos}`}
            style={{ width: b.s, height: b.s, background: b.c }}
            animate={{ x: b.x, y: b.y }}
            transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {/* Layer 2: WebGL light-leak shader, crossfades in after its first frame */}
        {gl && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: glReady ? 1 : 0 }} transition={{ duration: 1.4 }}>
            <LightLeak active={active} eventSource={section} onReady={() => setGlReady(true)} onFail={() => { console.info("[hero] WebGL background failed, using CSS aurora"); setGl(false); }} />
          </motion.div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#050507_92%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
      </div>

      <div className="wrap grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
        {/* ---------- copy + CTAs, all inside the first screen ---------- */}
        <div>
          <motion.p {...rise(0.05)} className="label mb-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-rose" style={{ animation: "pulse-rec 1.2s infinite" }} />
            REC · <span className="hidden sm:inline">{profile.role} ·</span> <Timecode />
          </motion.p>

          <h1 className="sr-only">{profile.name} — {profile.role}</h1>
          <div className="text-[clamp(4.2rem,min(17vw,19vh),11.5rem)] leading-[0.9]" aria-hidden>
            <SplitText as="p" text="Saif" immediate hold={!intro} delay={0.05} className="display text-snow" />
            <SplitText as="p" text="Ullah" serif={["Ullah"]} immediate hold={!intro} delay={0.2} className="name-sweep display !font-normal !tracking-[-0.03em] -mt-[0.04em]" />
          </div>

          <motion.p {...rise(0.55)} className="mt-6 max-w-lg text-lg text-mist md:text-xl">
            I cut <span className="serif-i text-snow">scroll-stopping</span> stories — Reels, TikToks &amp; Shorts built on a hook, a rhythm, and a reason to watch till the end.
          </motion.p>

          <motion.div {...rise(0.75)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <button onClick={() => setReelOpen(true)} onPointerEnter={warmReel} onFocus={warmReel} onTouchStart={warmReel} data-cursor="play" className="group flex items-center gap-3 rounded-full bg-snow py-2.5 pl-2.5 pr-6 text-base font-medium text-void shadow-[0_10px_40px_-10px_rgba(255,179,64,.6)] transition-shadow hover:shadow-[0_10px_50px_-5px_rgba(255,179,64,.85)]">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-void text-snow transition-transform group-hover:scale-110">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden><path d="M3 1.5v11l9-5.5z" /></svg>
                </span>
                Watch reel
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="#work" className="glass inline-block rounded-full px-6 py-[18px] text-base font-medium">View work ↓</a>
            </Magnetic>
          </motion.div>
          <motion.p {...rise(0.9)} className="label mt-6 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#32d74b]" />{profile.availability}</motion.p>
        </div>

        {/* ---------- animated reel stack ---------- */}
        <div className="min-w-0 lg:pr-8">
          <HeroCards tiltX={mx} tiltY={my} running={active} ready={intro} />
        </div>
      </div>
    </section>
  );
}
