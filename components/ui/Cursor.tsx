"use client";
import { useEffect, useRef } from "react";
import { useStore, type CursorVariant } from "@/lib/store";
import { sfx } from "@/lib/sound";

const SIZES: Record<CursorVariant, number> = { default: 12, link: 44, play: 84, drag: 84, view: 84 };
const LABELS: Record<CursorVariant, string> = { default: "", link: "", play: "PLAY", drag: "DRAG", view: "VIEW" };

/**
 * Mounted in the root layout so it exists on every route.
 * A requestAnimationFrame loop eases toward the pointer with a time-corrected lerp
 * (fast enough to feel instant, smooth enough to hide dropped frames).
 * No blend modes — they force a full-page composite every frame.
 */
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const variant = useStore((s) => s.cursor);
  const customLabel = useStore((s) => s.cursorLabel);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const node = el.current!;
    const { setCursor } = useStore.getState();
    let tx = -100, ty = -100, x = -100, y = -100;
    let raf = 0, last = 0, shown = false;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-dt * 38); // ~ 25ms time constant
      x += (tx - x) * k;
      y += (ty - y) * k;
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) { shown = true; x = tx; y = ty; node.style.opacity = "1"; }
      kick();
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, input, textarea, select, video[controls]");
      const v = (target?.dataset.cursor as CursorVariant) || (target ? "link" : "default");
      const label = target?.dataset.cursorLabel ?? "";
      const s = useStore.getState();
      if (s.cursor !== v || s.cursorLabel !== label) setCursor(v, label);
      if (target && !target.dataset.cursor && s.cursor !== "link") sfx.hover();
    };
    const leave = () => { node.style.opacity = "0"; shown = false; };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", sfx.click);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", sfx.click);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  const size = SIZES[variant];
  const label = customLabel || LABELS[variant];
  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[300] hidden opacity-0 will-change-transform [@media(pointer:fine)]:block"
      style={{ transition: "opacity .2s" }}
    >
      <div
        className="flex items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,.35),0_4px_18px_rgba(0,0,0,.35)]"
        style={{
          width: size,
          height: size,
          opacity: variant === "default" ? 1 : 0.92,
          transition: "width .3s cubic-bezier(.22,1,.36,1), height .3s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {label && <span className="font-mono text-[10px] font-medium tracking-widest text-black">{label}</span>}
      </div>
    </div>
  );
}
