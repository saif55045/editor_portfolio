"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/data";
import { PORTRAIT_SRC } from "@/content/media";
import { Reveal, SectionHead } from "@/components/motion/Reveal";
import Timecode from "@/components/ui/Timecode";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yi = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section id="about" className="section">
      <div className="wrap" ref={ref}>
        <SectionHead label="The editor" title="Hi, I'm Saif." serif={["Saif."]} />
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div style={{ y }} className="glass glass-static relative aspect-[4/5] overflow-hidden rounded-[36px] p-2">
            <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-graphite">
              {PORTRAIT_SRC ? (
                // eslint-disable-next-line @next/next/no-img-element
                <motion.img src={PORTRAIT_SRC} alt="Saif Ullah in his editing studio" style={{ y: yi, scale: 1.08 }} className="h-full w-full object-cover object-top" />
              ) : (
                <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(124,108,255,.5),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(255,92,138,.4),transparent_55%)]">
                  <span className="display text-[8rem] text-white/80">SU</span>
                </div>
              )}
              {PORTRAIT_SRC && (
                <>
                  {/* viewfinder corners */}
                  {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c) => (
                    <span key={c} aria-hidden className={`pointer-events-none absolute h-6 w-6 border-white/60 ${c}`} />
                  ))}
                  <p className="label pointer-events-none absolute left-9 top-6 flex items-center gap-2 !text-white/85">
                    <span className="h-2 w-2 rounded-full bg-rose" style={{ animation: "pulse-rec 1.2s infinite" }} />
                    REC · <Timecode />
                  </p>
                  {/* lower-third */}
                  <div className="glass glass-static absolute inset-x-6 bottom-8 flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5">
                    <span>
                      <span className="block text-lg font-semibold leading-tight tracking-tight">{profile.name}</span>
                      <span className="label">{profile.role}</span>
                    </span>
                    <span className="label hidden items-center gap-2 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#32d74b]" />Available</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <div className="flex flex-col justify-center gap-8">
            {profile.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}><p className={i === 0 ? "text-2xl leading-snug text-snow md:text-3xl" : "text-lg text-mist"}>{p}</p></Reveal>
            ))}

            <Reveal>
              <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {profile.milestones.map((m) => (
                  <li key={m.text} className="flex gap-6 py-4">
                    <span className="label w-12 shrink-0 pt-0.5 !text-amber">{m.year}</span>
                    <span className="text-mist">{m.text}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
