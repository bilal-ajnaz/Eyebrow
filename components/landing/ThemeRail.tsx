"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Shot from "./Shot";
import { themes, THEME_KEY, type ThemeId } from "@/lib/themes";

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  const set = () => {
    if (id === "default") delete root.dataset.theme;
    else root.dataset.theme = id;
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  // A cross-fade where the browser can do one, so the whole page changes as one.
  if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(set);
  else set();
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {
    /* private mode: the theme lasts for this page only */
  }
}

/* Screen 4. The themes side by side, and the site is always in the one in the
   middle: scroll the rail, or use the arrows, and the page follows. */
export default function ThemeRail() {
  const rail = useRef<HTMLUListElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [near, setNear] = useState(0);
  const nearRef = useRef(0);
  const applied = useRef<ThemeId>("default");

  const centre = useCallback((i: number, smooth: boolean) => {
    const c = cards.current[i];
    const el = rail.current;
    if (!c || !el) return;
    const motion = smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: motion ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;

    // Start on the theme the site is already in.
    const current = (document.documentElement.dataset.theme as ThemeId | undefined) ?? "default";
    const start = Math.max(0, themes.findIndex((t) => t.id === current));
    applied.current = current;
    nearRef.current = start;
    setNear(start);
    centre(start, false);

    let frame = 0;
    let settle = 0;
    const measure = () => {
      frame = 0;
      const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best !== nearRef.current) {
        nearRef.current = best;
        setNear(best);
      }
    };
    // The site switches once the rail comes to rest, not on every card that flicks past.
    const settled = () => {
      settle = 0;
      measure();
      const id = themes[nearRef.current].id;
      if (id !== applied.current) {
        applied.current = id;
        applyTheme(id);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      window.clearTimeout(settle);
      settle = window.setTimeout(settled, 160);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [centre]);

  const bring = (i: number) => centre(Math.max(0, Math.min(themes.length - 1, i)), true);

  return (
    <section className="themes" id="themes" aria-labelledby="themes-title">
      <div className="wrap themes__head">
        <div className="section-head">
          <p className="kicker">Themes</p>
          <h2 id="themes-title">Dress the notch. Then the whole site.</h2>
          <p>Whichever theme is in the middle, this site wears it. In the app they’re in Settings › Appearance.</p>
        </div>
        <div className="themes__controls">
          <p className="themes__now">
            <span aria-live="polite">This site is in <b>{themes[near].name}</b></span>
            {/* Always there, hidden on Default, so the line never changes length and nothing shifts. */}
            <span className="themes__back" data-hidden={near === 0}>
              <button type="button" className="textlink themes__reset" onClick={() => bring(0)} tabIndex={near === 0 ? -1 : undefined} aria-hidden={near === 0 || undefined}>
                Back to Default
              </button>
            </span>
          </p>
          <div className="themes__arrows">
            <button type="button" className="themes__arrow" onClick={() => bring(near - 1)} disabled={near === 0} aria-label="Previous theme">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14.5 6-6 6 6 6" /></svg>
            </button>
            <button type="button" className="themes__arrow" onClick={() => bring(near + 1)} disabled={near === themes.length - 1} aria-label="Next theme">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9.5 6 6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </div>

      <ul className="rail themes__rail" ref={rail} tabIndex={0} aria-label="Themes">
        {themes.map((t, i) => (
          <li
            key={t.id}
            ref={(el) => {
              cards.current[i] = el;
            }}
            data-near={i === near}
          >
            <button type="button" className="themes__card" aria-current={i === near ? "true" : undefined} onClick={() => bring(i)}>
              <span className="edge themes__shot">
                <Shot src={t.src} w={480} width={t.w} height={t.h} alt={t.alt} />
              </span>
              <span className="themes__name">{t.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
