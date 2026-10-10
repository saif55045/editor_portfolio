"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { process } from "@/content/data";
import { Reveal, SectionHead } from "@/components/motion/Reveal";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="section">
      <div className="wrap">
        <SectionHead label="The workflow" title="Five steps from raw to scroll-stopping." serif={["scroll-stopping"]} />
        <div ref={ref} className="relative grid gap-5 md:pl-14">
          <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-white/10 md:block" aria-hidden>
            <motion.div style={{ height: line }} className="w-px bg-amber shadow-[0_0_12px_rgba(255,179,64,.7)]" />
          </div>
          {process.map((s, i) => (
            <Reveal key={s.n} delay={0.05}>
              <article className="glass relative grid gap-4 rounded-[28px] p-7 md:grid-cols-[120px_1fr_2fr] md:items-center md:p-9">
                <span className="absolute -left-[46px] top-1/2 hidden h-3 w-3 -translate-y-1/2 rotate-45 rounded-[2px] bg-amber md:block" aria-hidden />
                <span className="label !text-amber">{s.n} / 0{process.length}</span>
                <h3 className="display text-4xl md:text-5xl">{s.title}</h3>
                <p className="text-lg text-mist">{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
