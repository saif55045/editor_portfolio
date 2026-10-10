"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { projects } from "@/content/data";
import { SectionHead, Reveal } from "@/components/motion/Reveal";
import { TLink } from "@/components/Transitions";
import { cancelPreview, queuePreview } from "@/lib/previewQueue";

/**
 * Real before/after reel, loaded in two steps:
 *  1. the tiny preview loads in line with the other previews and plays right away,
 *  2. when the section is near the screen, the full reel buffers in the background and
 *     replaces the preview at the end of a loop, so the visitor never sees a stall.
 */
export default function Grade() {
  const p = projects.find((x) => x.slug === "before-after-edit");
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const swapped = useRef(false);
  const inView = useInView(frame, { amount: 0.4 });
  const near = useInView(frame, { margin: "800px", once: true });
  const [fullReady, setFullReady] = useState(false);

  const previewSrc = p?.preview ?? p?.video;
  const fullSrc = p?.video;

  // 1) preview joins the sequential loading line
  useEffect(() => {
    const v = video.current;
    if (!v || !previewSrc) return;
    queuePreview(v, previewSrc);
    return () => cancelPreview(v);
  }, [previewSrc]);

  // 2) once the section is close, buffer the full reel off-screen
  useEffect(() => {
    if (!near || !p?.preview || !fullSrc) return;
    const f = document.createElement("video");
    f.preload = "auto";
    f.muted = true;
    const ok = () => setFullReady(true);
    f.addEventListener("canplaythrough", ok, { once: true });
    f.src = fullSrc;
    return () => {
      f.removeEventListener("canplaythrough", ok);
      f.removeAttribute("src");
      f.load();
    };
  }, [near, p?.preview, fullSrc]);

  const swapToFull = (playNow: boolean) => {
    const v = video.current;
    if (!v || !fullSrc || swapped.current) return;
    swapped.current = true;
    v.src = fullSrc;
    v.load();
    if (playNow) v.play().catch(() => {});
  };

  // play only while on screen; if the full reel is ready while the section is off-screen, swap silently
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else {
      v.pause();
      if (fullReady) swapToFull(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, fullReady]);

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
              <video
                ref={video}
                poster={p.poster}
                muted
                loop
                playsInline
                preload="none"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  // full reel is ready: switch at the end of the preview loop so there is no visible jump
                  if (fullReady && !swapped.current && v.duration && v.currentTime >= v.duration - 0.3) swapToFull(true);
                }}
                className="absolute inset-0 h-full w-full scale-[1.07] object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
