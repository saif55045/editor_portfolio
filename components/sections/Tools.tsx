"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";
import { stats, tools } from "@/content/data";
import { Reveal, SectionHead } from "@/components/motion/Reveal";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v) + suffix) });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function Tools() {
  return (
    <section id="tools" className="section">
      <div className="wrap">
        <SectionHead label="A1 · Toolkit" title="The software behind the cut." serif={["cut"]} />
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="glass rounded-[24px] p-6">
                  <div className="mb-5 flex items-baseline justify-between">
                    <h3 className="text-lg font-medium">{t.name}</h3>
                    <span className="label">{t.level}%</span>
                  </div>
                  {/* waveform-style level bar */}
                  <div className="flex h-8 items-end gap-[3px]" aria-label={`${t.name} proficiency ${t.level}%`}>
                    {Array.from({ length: 28 }).map((_, b) => {
                      const on = b / 28 < t.level / 100;
                      return (
                        <motion.span
                          key={b}
                          className="flex-1 rounded-full"
                          style={{ background: on ? "var(--color-amber)" : "rgba(255,255,255,.1)" }}
                          initial={{ height: "12%" }}
                          whileInView={{ height: `${25 + ((b * 37) % 75)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: b * 0.015 }}
                        />
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div className="glass flex h-full flex-col justify-between rounded-[24px] p-6">
                  <span className="display text-5xl md:text-6xl"><Counter to={s.value} suffix={s.suffix} /></span>
                  <span className="label mt-6 block">{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
