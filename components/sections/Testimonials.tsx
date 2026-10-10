"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { SHOW_TESTIMONIALS, testimonials } from "@/content/data";
import { SectionHead } from "@/components/motion/Reveal";

const AUTO_MS = 6500; // time each testimonial stays before sliding to the next

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const count = testimonials.length;

  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI(((n % count) + count) % count);
  };

  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // keeps sliding on its own; stops while the visitor hovers or focuses inside the panel
  useEffect(() => {
    if (paused || reduce || count < 2) return;
    const id = setTimeout(() => {
      setDir(1);
      setI((v) => (v + 1) % count);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [i, paused, reduce, count]);

  // hidden until there are real testimonials AND SHOW_TESTIMONIALS is switched on (see content/data.ts)
  if (!SHOW_TESTIMONIALS || count === 0) return null;

  const t = testimonials[i];
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(i + 1);
    else if (info.offset.x > 60) go(i - 1);
  };

  return (
    <section id="voices" className="section">
      <div className="wrap">
        <SectionHead label="Voice over" title="What clients say." serif={["say."]} />
        <div
          className="glass glass-static relative overflow-hidden rounded-[36px] p-8 md:p-16"
          data-cursor="drag"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, x: dir * 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -60, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-[220px]"
            >
              <blockquote className="serif-i text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.15] text-snow">
                “{t.highlight ?? t.quote}”
                {t.highlight && <span className="sr-only"> Full review: {t.quote}</span>}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 font-mono text-sm">{t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                )}
                <span>
                  {t.href ? (
                    <a href={t.href} target="_blank" rel="noreferrer" className="block font-medium underline-offset-4 hover:underline">{t.name} ↗</a>
                  ) : (
                    <span className="block font-medium">{t.name}</span>
                  )}
                  {(t.role || t.source) && <span className="label">{[t.role, t.source && `via ${t.source}`].filter(Boolean).join(" · ")}</span>}
                </span>
                {t.result && <span className="label ml-auto hidden rounded-full border border-white/15 px-3 py-1.5 !text-amber sm:inline-block">{t.result}</span>}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          {/* progress dots + arrows */}
          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Testimonials">
              {testimonials.map((_, n) => (
                <button key={n} role="tab" aria-selected={n === i} aria-label={`Testimonial ${n + 1}`} onClick={() => go(n)} className="h-1.5 rounded-full bg-white/20 transition-all" style={{ width: n === i ? 40 : 14, background: n === i ? "var(--color-amber)" : undefined }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(i - 1)} aria-label="Previous" className="glass grid h-11 w-11 place-items-center rounded-full">←</button>
              <button onClick={() => go(i + 1)} aria-label="Next" className="glass grid h-11 w-11 place-items-center rounded-full">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
