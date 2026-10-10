"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGo } from "@/components/Transitions";
import { motion, useSpring, useTransform, type MotionValue, type PanInfo } from "motion/react";
import { projects, type Project } from "@/content/data";

const CYCLE = 4200; // ms each card stays in front
const cards = projects.slice(0, 4);

// slot 0 = front, 1 = right, 2 = left, 3 = tucked behind
const SLOTS = [
  { x: 0, y: 0, r: 0, s: 1, o: 1, z: 4 },
  { x: 178, y: 20, r: 8, s: 0.88, o: 1, z: 3 },
  { x: -178, y: 28, r: -8, s: 0.88, o: 1, z: 2 },
  { x: 0, y: -26, r: 0, s: 0.74, o: 0.45, z: 1 },
];

/** A real project: its poster always, and the real video playing (muted) while the card is in front. */
function ReelCard({ p, idx, active, cycleKey }: { p: Project; idx: number; active: boolean; cycleKey: number }) {
  const [playing, setPlaying] = useState(false);
  const vref = useRef<HTMLVideoElement>(null);

  // The <video> stays mounted and buffered the whole time, so when a card comes to the front it
  // starts instantly (no network wait, no remount). Only the front card plays; the rest stay paused.
  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active, cycleKey]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px]" style={{ background: `linear-gradient(165deg, ${p.hue[0]}, ${p.hue[1]})` }}>
      {p.poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.poster} alt="" decoding="async" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      )}
      {p.video && (
        <video
          ref={vref}
          src={p.video}
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing && active ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* story progress segments */}
      <div className="absolute left-3 right-3 top-3 flex gap-1">
        {cards.map((_, s) => (
          <div key={s} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            {active && s === idx ? (
              <motion.div key={cycleKey} className="h-full origin-left bg-white" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: CYCLE / 1000, ease: "linear" }} />
            ) : (
              <div className="h-full bg-white" style={{ transform: `scaleX(${s < idx ? 1 : 0})`, transformOrigin: "left" }} />
            )}
          </div>
        ))}
      </div>

      {/* title */}
      <div className="absolute inset-x-4 bottom-4">
        <span className="label mb-1 block !text-white/80">{p.category}</span>
        <h3 className="text-[17px] font-semibold leading-tight tracking-tight">{p.title}</h3>
        {p.client && <p className="mt-0.5 text-xs text-white/70">{p.client}</p>}
      </div>
    </div>
  );
}

export default function HeroCards({ tiltX, tiltY, running, ready = true }: { tiltX: MotionValue<number>; tiltY: MotionValue<number>; running: boolean; ready?: boolean }) {
  const router = useRouter();
  const go$ = useGo();
  const [front, setFront] = useState(0);
  const [reduce, setReduce] = useState(false);
  const n = cards.length;

  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  useEffect(() => cards.forEach((c) => router.prefetch(`/work/${c.slug}`)), [router]);

  const go = useCallback((dir: number) => setFront((f) => (f + dir + n) % n), [n]);

  useEffect(() => {
    if (reduce || !running || !ready) return;
    const id = setTimeout(() => go(1), CYCLE);
    return () => clearTimeout(id);
  }, [front, reduce, running, ready, go]);

  const rotY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-14, 14]), { stiffness: 90, damping: 18 });
  const rotX = useSpring(useTransform(tiltY, [-0.5, 0.5], [10, -10]), { stiffness: 90, damping: 18 });

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
  };

  return (
    <div
      className="relative h-[300px] w-full sm:h-[390px] lg:h-[480px]"
      style={{ perspective: 1400 }}
    >
      <div className="absolute left-1/2 top-1/2 h-[480px] w-[580px] -translate-x-1/2 -translate-y-1/2 scale-[.58] sm:scale-[.8] lg:scale-100">
        <motion.div className="h-full w-full" style={{ rotateX: rotX, rotateY: rotY }}>
          <motion.div className="h-full w-full" animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            {cards.map((p, i) => {
              const slot = SLOTS[(i - front + n) % n];
              const isFront = slot === SLOTS[0];
              return (
                <motion.div
                  key={p.slug}
                  role="button"
                  tabIndex={0}
                  aria-label={isFront ? `Open ${p.title}` : `Bring ${p.title} to front`}
                  data-cursor={isFront ? "view" : undefined}
                  className="glass glass-static absolute left-1/2 top-1/2 -ml-[115px] -mt-[205px] aspect-[9/16] w-[230px] touch-pan-y select-none rounded-[30px] p-1.5"
                  style={{ zIndex: slot.z }}
                  initial={{ opacity: 0, y: 120, scale: 0.8 }}
                  animate={ready ? { x: slot.x, y: slot.y, rotate: slot.r, scale: slot.s, opacity: slot.o } : { x: slot.x, y: 120, rotate: slot.r, scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 17, mass: 0.9, opacity: { duration: 0.5 } }}
                  whileHover={isFront ? { scale: 1.03 } : { y: slot.y - 12 }}
                  drag={isFront ? "x" : false}
                  dragSnapToOrigin
                  dragElastic={0.45}
                  onDragEnd={onDragEnd}
                  onTap={() => (isFront ? go$(`/work/${p.slug}`) : setFront(i))}
                  onKeyDown={(e) => e.key === "Enter" && (isFront ? go$(`/work/${p.slug}`) : setFront(i))}
                >
                  <ReelCard p={p} idx={i} active={isFront && running && ready && !reduce} cycleKey={front} />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
