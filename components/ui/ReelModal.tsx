"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/lib/store";
import { getLenis } from "@/lib/lenis";
import { REEL_SRC } from "@/content/media";

/** Simple cinema modal: appears and disappears quickly, with a clear Close button. Esc closes. */
export default function ReelModal() {
  const { reelOpen, setReelOpen } = useStore();

  useEffect(() => {
    if (!reelOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setReelOpen(false);
    window.addEventListener("keydown", onKey);
    getLenis()?.stop(); // freeze the page behind the modal
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.documentElement.style.overflow = "";
    };
  }, [reelOpen, setReelOpen]);

  return (
    <AnimatePresence>
      {reelOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          className="fixed inset-0 z-[110] flex flex-col bg-void"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="h-[10vh] shrink-0 bg-black" />
          <div className="relative min-h-0 flex-1">
            {REEL_SRC ? (
              <video src={REEL_SRC} className="h-full w-full object-contain" controls autoPlay playsInline />
            ) : (
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <p className="label mb-3">No reel connected yet</p>
                  <p className="serif-i text-3xl text-mist">Drop <span className="font-mono text-base not-italic text-amber">reel.mp4</span> into /public and set REEL_SRC in content/media.ts</p>
                </div>
              </div>
            )}
          </div>
          <div className="h-[10vh] shrink-0 bg-black" />
          <button onClick={() => setReelOpen(false)} className="glass glass-static label absolute right-5 top-5 rounded-full px-4 py-2 !text-snow" autoFocus>
            Close · Esc
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
