"use client";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 32, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Words slide up out of a mask, staggered. `serif` words render in italic serif. */
export function SplitText({
  text,
  className = "",
  delay = 0,
  serif = [],
  as: Tag = "h2",
  immediate = false,
  hold = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  serif?: string[];
  as?: "h1" | "h2" | "h3" | "p";
  immediate?: boolean;
  /** with `immediate`: keep the words hidden until this turns false */
  hold?: boolean;
}) {
  const words = text.split(" ");
  const M = motion[Tag];
  return (
    <M className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${serif.includes(w.replace(/[.,!?]/g, "")) ? "serif-i" : ""}`}
            initial={{ y: "110%", filter: "blur(8px)" }}
            {...(immediate ? { animate: hold ? { y: "110%", filter: "blur(8px)" } : { y: 0, filter: "blur(0px)" } } : { whileInView: { y: 0, filter: "blur(0px)" }, viewport: { once: true, margin: "-60px" } })}
            transition={{ duration: 1, delay: delay + i * 0.07, ease }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

export function SectionHead({ label, title, serif }: { label: string; title: string; serif?: string[] }) {
  return (
    <div className="mb-8 md:mb-16">
      <Reveal>
        <p className="label mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-amber" />
          {label}
        </p>
      </Reveal>
      <SplitText text={title} serif={serif} className="display text-[clamp(2.5rem,7vw,6.5rem)]" />
    </div>
  );
}
