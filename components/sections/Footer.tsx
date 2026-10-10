"use client";
import { profile } from "@/content/data";

const credits = ["Edited by Saif Ullah", "Color · Sound · Captions","Thanks for watching"];

export default function Footer() {
  const row = [...credits, ...credits];
  return (
    <footer className="relative overflow-hidden border-t border-white/10 pb-10 pt-16">
      <div className="mb-12 flex overflow-hidden" aria-hidden>
        <div className="flex shrink-0 gap-16 whitespace-nowrap pr-16" style={{ animation: "marquee 38s linear infinite", width: "max-content" }}>
          {[...row, ...row].map((c, i) => (
            <span key={i} className="display text-[clamp(3rem,8vw,7rem)] text-white/[0.07]">{c}</span>
          ))}
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-6 px-[var(--gutter)]">
        <p className="label">© {new Date().getFullYear()} {profile.name} · End credits</p>
        <a href="#top" className="glass rounded-full px-5 py-2.5 text-sm">Back to 00:00:00:00 ↑</a>
      </div>
    </footer>
  );
}
