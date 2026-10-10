"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { categories, projects, type Project } from "@/content/data";
import { SectionHead } from "@/components/motion/Reveal";
import { TLink } from "@/components/Transitions";
import { cn } from "@/lib/utils";
import { cancelPreview, loadNow, queuePreview } from "@/lib/previewQueue";

const spring = { stiffness: 170, damping: 19, mass: 0.7 };

function Card({ p, i }: { p: Project; i: number }) {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  // pointer position drives motion values + CSS variables — never React state, so hovering never re-renders
  const rx = useSpring(useMotionValue(0), spring);
  const ry = useSpring(useMotionValue(0), spring);

  // previews load one at a time, in gallery order
  useEffect(() => {
    const v = vid.current;
    const src = p.preview ?? p.video;
    if (!v || !src) return;
    queuePreview(v, src);
    return () => cancelPreview(v);
  }, [p.preview, p.video]);

  const move = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    box.current!.style.setProperty("--x", nx.toFixed(3));
    box.current!.style.setProperty("--y", ny.toFixed(3));
    ry.set((nx - 0.5) * 16);
    rx.set(-(ny - 0.5) * 16);
    const v = vid.current;
    if (v && v.duration) v.currentTime = nx * v.duration; // mouse X scrubs the clip
  };
  const leave = () => {
    ry.set(0);
    rx.set(0);
    box.current!.style.setProperty("--x", "0.5");
    box.current!.style.setProperty("--y", "0.5");
    vid.current?.pause();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="w-[min(72vw,300px)] shrink-0 snap-start"
      style={{ perspective: 900 }}
    >
      <div ref={box} style={{ ["--x" as string]: 0.5, ["--y" as string]: 0.5 }} onPointerMove={move} onPointerLeave={leave} onPointerEnter={() => { const v = vid.current; const src = p.preview ?? p.video; if (!v || !src) return; loadNow(v, src); v.play().catch(() => {}); }}>
        <TLink href={`/work/${p.slug}`} data-cursor="view" className="group block" prefetch>
          <motion.div
            style={{ rotateX: rx, rotateY: ry }}
            whileHover={{ y: -12, scale: 1.025 }}
            transition={{ type: "spring", ...spring }}
            className="glass-lite aspect-[9/16] rounded-[28px] p-1.5 will-change-transform"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[22px]">
              {/* poster: slow zoom on hover */}
              <div
                className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.12]"
                style={{ background: `linear-gradient(160deg, ${p.hue[0]}, ${p.hue[1]})` }}
              />
              {p.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.poster} alt="" decoding="async" fetchPriority={i < 4 ? "high" : "auto"} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.12]" />
              )}
              {(p.preview ?? p.video) && (
                <video ref={vid} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15 transition-opacity duration-500 group-hover:from-black/85" />
              {/* light that follows the pointer */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at calc(var(--x) * 100%) calc(var(--y) * 100%), rgba(255,255,255,.3), transparent 45%)" }}
              />
              <span className="label absolute left-4 top-4 !text-white/85">{p.category}</span>
              {(p.year || p.metrics.find((m) => m.label === "Length")?.value) && <span className="label absolute right-4 top-4 !text-white/85">{p.year || p.metrics.find((m) => m.label === "Length")?.value}</span>}

              <div className="absolute bottom-4 left-4 right-4">
                <div className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-7">
                  <h3 className="text-xl font-semibold leading-tight tracking-tight">{p.title}</h3>
                  {p.client && <p className="mt-1 text-sm text-white/70">{p.client}</p>}
                </div>
                <span className="absolute bottom-3 left-0 translate-y-3 text-sm font-medium opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  View project →
                </span>
                <div className="mt-3 h-[2px] w-full overflow-hidden rounded bg-white/20">
                  <div className="h-full bg-amber" style={{ width: "calc(var(--x) * 100%)", transition: "width .12s linear" }} />
                </div>
              </div>
            </div>
          </motion.div>
        </TLink>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const list = projects.filter((p) => filter === "All" || p.category === filter);
  const chips = categories.filter((c) => c === "All" || projects.some((p) => p.category === c));
  const router = useRouter();
  useEffect(() => projects.forEach((p) => router.prefetch(`/work/${p.slug}`)), [router]);

  return (
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead label="V2 · Media bin" title="Selected work, cut for the feed." serif={["feed"]} />
        {chips.length > 2 && <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {chips.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={cn("relative rounded-full px-5 py-2.5 text-sm transition-colors", filter === c ? "text-void" : "glass text-mist hover:text-snow")}
            >
              {filter === c && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-snow" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>}
      </div>

      <div
        data-cursor="drag"
        className="no-scrollbar -mx-[var(--gutter)] flex snap-x scroll-px-[var(--gutter)] gap-5 overflow-x-auto px-[var(--gutter)] pb-10 pt-4"
        tabIndex={0}
        aria-label="Project gallery, scroll horizontally"
      >
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => <Card key={p.slug} p={p} i={i} />)}
        </AnimatePresence>
        {list.length === 0 && <p className="label py-20">Nothing here yet.</p>}
      </div>
    </section>
  );
}
