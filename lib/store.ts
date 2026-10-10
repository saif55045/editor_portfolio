import { create } from "zustand";

export type CursorVariant = "default" | "play" | "drag" | "view" | "link";

type State = {
  cursor: CursorVariant;
  cursorLabel: string;
  setCursor: (v: CursorVariant, label?: string) => void;
  sound: boolean;
  setSound: (on: boolean) => void;
  reelOpen: boolean;
  setReelOpen: (open: boolean) => void;
  /** true once the countdown leader has finished (or was skipped) — hero content waits for it */
  intro: boolean;
  setIntro: (v: boolean) => void;
};

export const useStore = create<State>((set) => ({
  cursor: "default",
  cursorLabel: "",
  setCursor: (cursor, cursorLabel = "") => set({ cursor, cursorLabel }),
  sound: false,
  setSound: (sound) => set({ sound }),
  reelOpen: false,
  setReelOpen: (reelOpen) => set({ reelOpen }),
  intro: false,
  setIntro: (intro) => set({ intro }),
}));
