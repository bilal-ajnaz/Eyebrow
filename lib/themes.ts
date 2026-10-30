/* The app's themes (Eyebrow-App/tools/themes), each with the page colour the
   site takes on when it is chosen. `paper` mirrors --color-paper for that
   theme in site.css; the full palettes live there under :root[data-theme]. */
export const themes = [
  { id: "default", name: "Default", src: "theme-default.png", w: 1280, h: 483, paper: "oklch(0.33 0.045 252)", alt: "Home in the Default theme" },
  { id: "retro", name: "Retro", src: "theme-retro.png", w: 1280, h: 483, paper: "oklch(0.17 0.012 70)", alt: "Home in the Retro theme, amber phosphor on black" },
  { id: "neon", name: "Neon", src: "theme-neon.png", w: 1280, h: 483, paper: "oklch(0.17 0.05 300)", alt: "Home in the Neon theme, pink and cyan glow" },
  { id: "midnight", name: "Midnight", src: "theme-midnight.png", w: 1280, h: 483, paper: "oklch(0.2 0.06 285)", alt: "Home in the Midnight theme, violet and rounded" },
  { id: "liquid-glass", name: "Liquid Glass", src: "theme-liquid-glass.png", w: 1280, h: 483, paper: "oklch(0.3 0.07 240)", alt: "Home in the Liquid Glass theme, translucent tiles" },
  { id: "mono", name: "B&W", src: "theme-mono.png", w: 1280, h: 483, paper: "oklch(0.16 0 0)", alt: "Home in the black-and-white theme" },
  { id: "compact", name: "Compact", src: "theme-compact.png", w: 1166, h: 447, paper: "oklch(0.3 0.04 252)", alt: "Home in the Compact theme, a smaller open notch" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

export const THEME_KEY = "eyebrow-site-theme";

/* Runs in <head> before first paint, so a chosen theme never flashes Default. */
export const themeBootScript = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("${THEME_KEY}");if(t&&t!=="default")document.documentElement.dataset.theme=t}catch(e){}`;
