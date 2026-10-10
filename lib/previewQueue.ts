/**
 * Loads preview videos ONE AT A TIME, in the order they were queued (hero cards first, then the gallery).
 * Each clip finishes downloading before the next one starts, so none of them fight each other for
 * bandwidth and each can play completely the moment it is shown.
 *
 * - queuePreview(): join the line.
 * - loadNow(): jump the line (e.g. the visitor hovers a card whose clip is not ready yet).
 * - cancelPreview(): leave the line (component unmounted).
 */
type Job = { el: HTMLVideoElement; src: string };

const queue: Job[] = [];
const started = new WeakSet<HTMLVideoElement>();
let current: { el: HTMLVideoElement; finish: () => void } | null = null;
const TIMEOUT_MS = 8000; // never let one slow clip block the rest

function start(el: HTMLVideoElement, src: string): Promise<void> {
  return new Promise((resolve) => {
    if (started.has(el)) return resolve();
    started.add(el);
    let timer = 0;
    const finish = () => {
      window.clearTimeout(timer);
      el.removeEventListener("canplaythrough", finish);
      el.removeEventListener("error", finish);
      if (current?.el === el) current = null;
      resolve();
    };
    el.addEventListener("canplaythrough", finish);
    el.addEventListener("error", finish);
    timer = window.setTimeout(finish, TIMEOUT_MS);
    if (current === null) current = { el, finish };
    el.preload = "auto";
    el.src = src;
    el.load();
  });
}

let pumping = false;
async function pump() {
  if (pumping) return;
  pumping = true;
  while (queue.length) {
    const job = queue.shift()!;
    if (started.has(job.el) || !job.el.isConnected) continue;
    await start(job.el, job.src);
  }
  pumping = false;
}

export function queuePreview(el: HTMLVideoElement, src: string) {
  if (started.has(el)) return;
  queue.push({ el, src });
  void pump();
}

export function loadNow(el: HTMLVideoElement, src: string) {
  if (started.has(el)) return;
  void start(el, src); // starts straight away, in parallel with the line
}

export function cancelPreview(el: HTMLVideoElement) {
  const i = queue.findIndex((j) => j.el === el);
  if (i >= 0) queue.splice(i, 1);
  if (current?.el === el) current.finish(); // let the line move on
}
