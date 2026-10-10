"use client";
import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { projects } from "@/content/data";
import { SectionHead, Reveal } from "@/components/motion/Reveal";
import { TLink } from "@/components/Transitions";

/** Real before/after: the actual "raw vs edit" reel, playing muted in a phone frame while it is on screen. */
export default function Grade() {
  const p = projects.find((x) => x.slug === "before-after-edit");
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(frame, { amount: 0.4 });

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  if (!p?.video) return null;
  return (
    <section id="grade" className="section">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_auto] lg:gap-24">
        <div>
          <SectionHead label="Before → After" title="Raw footage is just the start." serif={["start."]} />
          <Reveal>
            <p className="max-w-md text-lg text-mist">
              Same take, two versions. On the left, the footage as it was shot. On the right, the finished edit with pacing, animated captions, motion graphics and sound.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TLink href={`/work/${p.slug}`} data-cursor="view" className="rounded-full bg-snow px-6 py-3.5 font-medium text-void">See the breakdown →</TLink>
            </div>
          </Reveal>
        </div>

        <Reveal y={50} className="mx-auto lg:mx-0">
          <div ref={frame} className="glass-lite relative aspect-[4/5] w-[min(82vw,400px)] rounded-[36px] p-2">
            <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-graphite">
              <video ref={video} src={p.video} poster={p.poster} muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full scale-[1.07] object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
