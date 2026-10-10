const items = ["Hook-first edits", "Animated captions", "Motion graphics", "Sound design", "Kinetic typography", "Reels · TikTok · Shorts"];

/** Slim band of what I do, sliding slowly under the hero. Purely decorative, so hidden from screen readers. */
export default function Ticker() {
  const row = [...items, ...items, ...items];
  return (
    <div className="marquee-scope relative overflow-hidden border-y border-white/10 py-5" aria-hidden>
      <div className="marquee-track flex w-max items-center" style={{ animationDuration: "45s" }}>
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="display text-[clamp(1.25rem,2.4vw,2rem)] text-white/60">{t}</span>
            <span className="mx-8 h-1.5 w-1.5 rotate-45 bg-amber" />
          </span>
        ))}
      </div>
    </div>
  );
}
