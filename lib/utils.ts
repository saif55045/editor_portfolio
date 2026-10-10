export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const pad = (n: number, l = 2) => String(Math.floor(n)).padStart(l, "0");

/** seconds -> HH:MM:SS:FF at 30fps */
export function timecode(totalSeconds: number, fps = 30) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const f = Math.floor((s % 1) * fps);
  return `${pad(h)}:${pad(m)}:${pad(sec)}:${pad(f)}`;
}
