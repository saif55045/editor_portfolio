// Procedural audio — no asset files. Everything is opt-in and starts only after a user gesture.
let ctx: AudioContext | null = null;
let ambient: { stop: () => void } | null = null;
let enabled = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function blip(freq = 880, dur = 0.08, vol = 0.04) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(freq * 1.5, c.currentTime + dur);
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
}

export const sfx = {
  click: () => blip(740, 0.07),
  hover: () => blip(1200, 0.035, 0.015),
  open: () => blip(520, 0.18, 0.05),
};

function startAmbient() {
  const c = getCtx();
  if (!c || ambient) return;
  const master = c.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(0.05, c.currentTime + 2.5);
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 140;
  lfo.connect(lfoGain).connect(filter.frequency);
  const oscs = [55, 82.41, 110.3, 164.8].map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 ? "triangle" : "sine";
    o.frequency.value = f;
    o.connect(filter);
    o.start();
    return o;
  });
  filter.connect(master).connect(c.destination);
  lfo.start();
  ambient = {
    stop() {
      master.gain.cancelScheduledValues(c.currentTime);
      master.gain.setValueAtTime(master.gain.value, c.currentTime);
      master.gain.linearRampToValueAtTime(0, c.currentTime + 0.8);
      setTimeout(() => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
      }, 900);
    },
  };
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try { localStorage.setItem("su-sound", on ? "1" : "0"); } catch {}
  if (on) {
    startAmbient();
    sfx.open();
  } else if (ambient) {
    ambient.stop();
    ambient = null;
  }
}

export function readSavedSound() {
  try { return localStorage.getItem("su-sound") === "1"; } catch { return false; }
}
