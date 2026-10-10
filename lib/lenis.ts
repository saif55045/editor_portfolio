import type Lenis from "lenis";

// Shared handle so modals / route transitions can pause or reset smooth scrolling.
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;
