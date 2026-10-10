"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useStore } from "@/lib/store";
import { getLenis } from "@/lib/lenis";
import { setSoundEnabled } from "@/lib/sound";

const links = [
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();
  const { sound, setSound } = useStore();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 120 && !menu);
  });
  useEffect(() => setSoundEnabled(sound), [sound]);

  // mobile menu: freeze the page behind it, close on Escape
  useEffect(() => {
    if (!menu) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
    <motion.header
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
      animate={{ y: hidden ? -90 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav aria-label="Primary" className="glass glass-static flex items-center gap-1 rounded-full px-2 py-2 text-sm">
        <a href="#top" className="grid h-9 w-9 place-items-center rounded-full bg-snow font-mono text-xs font-bold text-void" aria-label="Saif Ullah — home">
          SU
        </a>
        <ul className="hidden items-center sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-4 py-2 text-mist transition-colors hover:bg-white/10 hover:text-snow">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-mist hover:text-snow sm:hidden"
        >
          <span className="relative block h-2.5 w-4" aria-hidden>
            <span className={`absolute left-0 h-px w-full bg-current transition-all duration-200 ${menu ? "top-1/2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-full bg-current transition-all duration-200 ${menu ? "top-1/2 -rotate-45" : "bottom-0"}`} />
          </span>
          {menu ? "Close" : "Menu"}
        </button>
        <button
          onClick={() => setSound(!sound)}
          aria-pressed={sound}
          aria-label={sound ? "Turn sound off" : "Turn sound on"}
          className="ml-1 grid h-9 w-9 place-items-center rounded-full text-mist transition-colors hover:bg-white/10 hover:text-snow"
        >
          <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[2px] rounded-full bg-current"
                animate={{ height: sound ? ["30%", "100%", "50%", "90%", "30%"] : "25%" }}
                transition={sound ? { duration: 1.1, repeat: Infinity, delay: i * 0.13 } : { duration: 0.3 }}
                style={{ height: "25%" }}
              />
            ))}
          </span>
        </button>
      </nav>
    </motion.header>

    <AnimatePresence>
      {menu && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col justify-center bg-void/95 px-[var(--gutter)] backdrop-blur-xl sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <nav aria-label="Mobile">
            <ul className="grid gap-1">
              {links.map((l, i) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => { getLenis()?.start(); setMenu(false); }} className="display flex items-baseline gap-4 py-3 text-[clamp(2.5rem,13vw,4rem)] text-snow">
                    <span className="label !text-amber">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

export function SoundHint() {
  const sound = useStore((s) => s.sound);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 4500);
    const h = setTimeout(() => setShow(false), 11000);
    return () => { clearTimeout(t); clearTimeout(h); };
  }, []);
  return (
    <AnimatePresence>
      {show && !sound && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="label glass glass-static fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full px-4 py-2 !text-mist"
        >
          Headphones on? Tap the bars (top) for sound
        </motion.p>
      )}
    </AnimatePresence>
  );
}
