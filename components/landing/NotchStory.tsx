"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Shot from "./Shot";
import { site } from "@/lib/site";

/* Screens 1 to 3 as one pinned stage with one notch in it. The notch hangs
   under the bar in the hero, slides left for the feature wheel, then right for
   the tabs, where its tab row turns into a column. Everything is driven by how
   far the page has scrolled through the section, so it moves with the scroll.
   Windows too short to pin show the three screens one after another. */

const items = [
  { id: "home", label: "Home", src: "open-home-calendar.png", hue: 18, body: "The song, the weather and your next meeting, with Join.", alt: "Home with the calendar card: a week strip, today's events and a Join button" },
  { id: "shelf", label: "Shelf", src: "open-shelf.png", hue: 268, body: "Drop files on the notch to hold them for later, or AirDrop them from there.", alt: "The Shelf holding three files, with an AirDrop target on the left" },
  { id: "clipboard", label: "Clipboard", src: "open-clipboard.png", hue: 160, body: "Text, links, colours and images you copied, one ⇧ ⌘ C away.", alt: "Clipboard history with filters and copied text, a pinned link, a colour, an image and a file" },
  { id: "widgets", label: "Widgets", src: "widgets-day.png", hue: 225, body: "Clock, calendar, reminders, battery and weather, laid out your way.", alt: "A widget page: time and weather, today's calendar, reminders, battery, clock and weather" },
  { id: "screenshot", label: "Screenshots", src: "open-screenshot.png", hue: 335, body: "Each one lands here first: copy it, mark it up, pull the text out or save it.", alt: "A fresh screenshot in the notch with Copy, Annotate, Text and Save" },
  { id: "claude", label: "Claude Code", src: "open-claude-approval.png", hue: 40, body: "When a session wants to run a command, Allow and Deny appear up top.", alt: "Claude Code in eyebrow-website asks to run npm run build, with Deny and Allow buttons" },
  { id: "meeting", label: "Meetings", src: "open-meeting-reminder.png", hue: 255, body: "A reminder drops down before the meeting starts, with the link to join.", alt: "A meeting reminder for Design Review with a Join button" },
  { id: "call", label: "Calls", src: "open-call-tab.png", hue: 150, body: "Mute, camera and leave for the call you are on.", alt: "The call tab with Mute, Camera and Leave" },
  { id: "notes", label: "Notes", src: "open-notes-composer.png", hue: 80, body: "Write a line in the notch and it saves to Notes.", alt: "A new note being typed in the notch" },
  { id: "weather", label: "Weather", src: "open-weather.png", hue: 205, body: "Now, and the next few hours.", alt: "The weather tab: temperature, conditions and an hourly forecast" },
  { id: "audio", label: "Audio", src: "open-audio.png", hue: 300, body: "Volume, the output device and the microphone, in one place.", alt: "The audio tab: volume, output devices and input" },
] as const;

const N = items.length;

/* The tabs, cut from the captures (1280 × 483 at 2×): centres across the top,
   then down the side once vertical tabs are on. The live-activity dot sits at
   the far right of the row and at the top of the column. */
const IW = 1280;
const IH = 483;
const ROW = { x: 103.5, y: 32, step: 76 };
const COL = { x: 101.5, y: 265.5, step: 59.6 };
const LIVE = { row: { x: 867, y: 32 }, col: { x: 101.5, y: 203.5 } };
/* The four free tabs, then more that only appear once the tabs are down the side,
   where the column scrolls to show there's room for as many as you like. */
const tabIcons = ["home", "shelf", "clipboard", "widgets", "audio", "weather", "call"] as const;
const ROW_TABS = 4;
// The part of the column inside the notch, in capture px; icons fade out at its ends.
const COL_TOP = 178;
const COL_BOTTOM = 468;
const tabBases = ["home", "shelf", "clipboard", "widgets"] as const;

/* Stretches of scroll, in window heights. */
const SEG = { intro: 0.9, wheel: (N - 1) * 0.34, hold: 0.25, move: 0.6, tabs: 0.9, turn: 0.5, climb: 0.7, rest: 0.15 };
const AT = (() => {
  let t = 0;
  const at = {} as Record<keyof typeof SEG, number>;
  for (const k of Object.keys(SEG) as (keyof typeof SEG)[]) {
    at[k] = t;
    t += SEG[k];
  }
  return { ...at, end: t };
})();

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const seg = (t: number, k: keyof typeof SEG) => clamp((t - AT[k]) / SEG[k]);
// A detent at each whole step, like a wheel with notches, but never stopping dead.
const detent = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  return i + 0.55 * ease(f) + 0.45 * f;
};
const lerp = (a: number, b: number, m: number) => a + (b - a) * m;
const hueAt = (p: number) => {
  const i = clamp(Math.floor(p), 0, N - 1);
  const j = Math.min(N - 1, i + 1);
  // The short way round the colour wheel, so pink into orange doesn't pass through green.
  const a = items[i].hue;
  const d = ((items[j].hue - a + 540) % 360) - 180;
  return (a + d * (p - i) + 360) % 360;
};

type Rect = { x: number; y: number; w: number };
type View = { phase: "hero" | "feat" | "tabs"; on: number; turned: boolean };

/* Offsets from the stage, ignoring transforms, so a slot inside a moving layer still measures true. */
function offsetIn(el: HTMLElement, stage: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== stage) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth };
}

function AppleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function Slot({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="story__slot" data-slot={id}>
      {children}
    </div>
  );
}

export default function NotchStory() {
  const story = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const notch = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const layers = useRef<Record<"hero" | "feat" | "tabs", HTMLDivElement | null>>({ hero: null, feat: null, tabs: null });
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const icons = useRef<(HTMLImageElement | null)[]>([]);
  const live = useRef<HTMLImageElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const slots = useRef<Record<string, Rect>>({});
  const base = useRef(640);
  const pinned = useRef(false);
  const [view, setView] = useState<View>({ phase: "hero", on: 0, turned: false });
  const viewRef = useRef(view);

  const measure = useCallback(() => {
    const st = stage.current;
    if (!st) return;
    for (const el of st.querySelectorAll<HTMLElement>("[data-slot]")) {
      slots.current[el.dataset.slot!] = offsetIn(el, st);
    }
    base.current = Math.max(...Object.values(slots.current).map((r) => r.w), 1);
    if (notch.current) {
      notch.current.style.width = `${base.current}px`;
      notch.current.dataset.ready = "";
    }
  }, []);

  const update = useCallback(() => {
    const s = story.current;
    const st = stage.current;
    if (!s || !st || !pinned.current) return;
    const H = st.offsetHeight || window.innerHeight;
    const t = clamp(-s.getBoundingClientRect().top / H, 0, AT.end);

    const intro = seg(t, "intro");
    const move = seg(t, "move");
    const p = detent(seg(t, "wheel") * (N - 1));
    const k = detent(seg(t, "tabs") * 3);
    const turn = ease(seg(t, "turn"));
    // Once the tabs are down the side, the next scroll turns the column like a wheel.
    const climb = ease(seg(t, "climb")) * (tabIcons.length - ROW_TABS);

    // The notch: hero slot → feature slot → tabs slot.
    const { hero, feat, tabs } = slots.current;
    if (hero && feat && tabs && notch.current) {
      const a = t < AT.move ? hero : feat;
      const b = t < AT.move ? feat : tabs;
      const m = ease(t < AT.move ? intro : move);
      const x = lerp(a.x, b.x, m);
      const y = lerp(a.y, b.y, m);
      const w = lerp(a.w, b.w, m);
      notch.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${w / base.current})`;
    }

    const vis = {
      hero: 1 - clamp(intro / 0.55),
      feat: clamp((intro - 0.45) / 0.55) * (1 - clamp(move / 0.55)),
      tabs: clamp((move - 0.35) / 0.5),
    };
    for (const key of ["hero", "feat", "tabs"] as const) {
      const el = layers.current[key];
      if (!el) continue;
      const v = vis[key];
      el.style.opacity = String(v);
      el.style.visibility = v < 0.01 ? "hidden" : "visible";
      el.style.pointerEvents = v > 0.5 ? "auto" : "none";
    }
    if (layers.current.hero) layers.current.hero.style.transform = `translate3d(0, ${(vis.hero - 1) * 48}px, 0)`;
    const side = layers.current.feat?.querySelector<HTMLElement>(".story__side");
    if (side) side.style.transform = `translate3d(${(1 - vis.feat) * 48}px, 0, 0)`;

    // The drum: each card sits on a cylinder at its distance from the wheel's position.
    cards.current.forEach((c, i) => {
      if (!c) return;
      const d = i - p;
      const a = d * 22;
      c.style.transform = `rotateX(${-a}deg) translateZ(var(--r))`;
      c.style.opacity = String(clamp(1 - Math.abs(a) / 84));
      c.style.visibility = Math.abs(a) > 88 ? "hidden" : "visible";
    });

    // The colour behind the wheel flows from one feature's hue into the next.
    if (bg.current) {
      bg.current.style.opacity = String(vis.feat);
      bg.current.style.setProperty("--h1", hueAt(p).toFixed(1));
      bg.current.style.setProperty("--h2", hueAt(Math.min(N - 1, p + 1.2)).toFixed(1));
      bg.current.style.setProperty("--bx", `${20 + Math.sin(p * 0.9) * 14}%`);
      bg.current.style.setProperty("--by", `${70 + Math.cos(p * 0.7) * 16}%`);
    }

    // The tabs: the selection steps along the row, then the row swings down into a column.
    const unit = base.current / IW;
    const sel = lerp(k, 0, turn);
    const px = (x: number, y: number, size: number) => `translate3d(${x * unit - size / 2}px, ${y * unit - size / 2}px, 0)`;
    const pivot = { x: lerp(ROW.x, COL.x, turn), y: lerp(ROW.y, COL.y, turn) };
    const step = lerp(ROW.step, COL.step, turn);
    const ang = (turn * Math.PI) / 2;
    const at = (i: number) => ({ x: pivot.x + Math.cos(ang) * step * i, y: pivot.y + Math.sin(ang) * step * i - climb * COL.step });
    // Down the side, icons fade at the column's ends instead of spilling out of the notch.
    const edge = (y: number) => lerp(1, clamp((y - COL_TOP) / 34) * clamp((COL_BOTTOM - y) / 34), turn);
    const iconSize = 48 * unit;
    icons.current.forEach((el, i) => {
      if (!el) return;
      const q = at(i);
      const shown = i < ROW_TABS ? 1 : clamp((turn - 0.5) * 2);
      el.style.transform = px(q.x, q.y, iconSize);
      el.style.opacity = String((0.62 + 0.36 * clamp(1 - Math.abs(i - sel))) * shown * edge(q.y));
    });
    if (pill.current) {
      const q = at(sel);
      const w = lerp(74, 72, turn) * unit;
      const h = lerp(38, 42, turn) * unit;
      pill.current.style.width = `${w}px`;
      pill.current.style.height = `${h}px`;
      pill.current.style.transform = `translate3d(${q.x * unit - w / 2}px, ${q.y * unit - h / 2}px, 0)`;
      pill.current.style.opacity = String(edge(q.y));
    }
    if (live.current) {
      const size = 56 * unit;
      const fade = Math.abs(turn - 0.5) * 2;
      const q = turn < 0.5 ? LIVE.row : LIVE.col;
      const y = q.y + (turn < 0.5 ? -turn : 1 - turn) * 40 - (turn < 0.5 ? 0 : climb * COL.step);
      live.current.style.transform = px(q.x, y, size);
      live.current.style.opacity = String(fade * (turn < 0.5 ? 1 : edge(y)));
    }

    const next: View = {
      phase: t < AT.intro + SEG.intro * 0.5 ? "hero" : t < AT.move + SEG.move * 0.5 ? "feat" : "tabs",
      on: t < AT.move + SEG.move * 0.5 ? Math.round(p) : Math.round(k),
      turned: turn > 0.5,
    };
    const prev = viewRef.current;
    if (next.phase !== prev.phase || next.on !== prev.on || next.turned !== prev.turned) {
      // A tick under the finger as each feature clicks into place, where the device allows it.
      if (next.phase === "feat" && prev.phase === "feat" && next.on !== prev.on) {
        const nav = navigator as Navigator & { userActivation?: { hasBeenActive: boolean } };
        if (nav.userActivation?.hasBeenActive !== false) nav.vibrate?.(6);
      }
      viewRef.current = next;
      setView(next);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-height: 30rem)");
    let frame = 0;
    const tick = () => {
      frame = 0;
      update();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      pinned.current = media.matches;
      measure();
      onScroll();
    };
    onResize();
    media.addEventListener("change", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Fonts change the hero's height; measure again once they're in.
    document.fonts?.ready.then(onResize);
    return () => {
      media.removeEventListener("change", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure, update]);

  // Jump the page to a feature on the wheel.
  const go = (i: number) => {
    const s = story.current;
    const st = stage.current;
    if (!s || !st) return;
    const next = clamp(i, 0, N - 1);
    const t = AT.wheel + (next / (N - 1)) * SEG.wheel;
    const top = window.scrollY + s.getBoundingClientRect().top + t * st.offsetHeight + 1;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    go(view.on + d);
  };

  const featOn = view.phase === "feat" ? view.on : view.phase === "hero" ? -1 : N;
  const tabOn = view.turned ? 4 : view.on;

  return (
    <section ref={story} className="story" id="top" aria-label="Eyebrow" style={{ "--len": AT.end } as CSSProperties}>
      <div ref={stage} className="story__stage">
        <div ref={bg} className="story__bg" aria-hidden="true" />
        <div className="story__inner">
          {/* Screen 1 */}
          <div
            ref={(el) => {
              layers.current.hero = el;
            }}
            className="story__layer story__hero"
          >
            <Slot id="hero">
              <Shot src="open-home.png" w={640} width={1280} height={483} priority alt="Eyebrow's open notch: Golden Hour Drive by Nova Lane playing, 29°C, battery at 82% and Design Review next with a Join button" />
            </Slot>
            <div className="wrap story__body">
              <h1 id="hero-title">
                {site.tagline}
                <span className="free">
                  <span className="visually-hidden"> Free.</span>
                  <span className="free__word" aria-hidden="true">Free!</span>
                  <span className="free__burst" aria-hidden="true">
                    {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}
                  </span>
                </span>
              </h1>
              <a className="btn story__download" href={site.appStoreUrl} aria-label="Download Eyebrow on the Mac App Store">
                Download
                <AppleLogo />
              </a>
              <p className="story__note">{site.minMacOS} or later</p>
            </div>
          </div>

          {/* Screen 2 */}
          <div
            ref={(el) => {
              layers.current.feat = el;
            }}
            className="story__layer story__feat"
            id="features"
            aria-labelledby="wheel-title"
          >
            <div className="wrap story__featgrid">
              <div className="story__main">
                <div className="story__head">
                  <p className="kicker">Features</p>
                  <h2 id="wheel-title">Everything, one notch.</h2>
                </div>
                <Slot id="feat">
                  <Shot src="open-home-calendar.png" w={640} width={1280} height={468} alt="" />
                </Slot>
                {/* Too short a window to pin: the features as a row to swipe through. */}
                <ul className="story__list" aria-label="Features">
                  {items.map((v) => (
                    <li key={v.id}>
                      <figure className="edge">
                        <Shot src={v.src} w={640} width={1280} height={468} alt={v.alt} />
                        <figcaption>
                          <b>{v.label}</b>
                          {v.body}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="story__side">
                <div
                  className="drum"
                  role="listbox"
                  aria-label="Features"
                  aria-activedescendant={featOn >= 0 && featOn < N ? `drum-${items[featOn].id}` : undefined}
                  tabIndex={0}
                  onKeyDown={onKey}
                >
                  <div className="drum__axis">
                    {items.map((v, i) => (
                      <button
                        key={v.id}
                        ref={(el) => {
                          cards.current[i] = el;
                        }}
                        id={`drum-${v.id}`}
                        type="button"
                        role="option"
                        aria-selected={i === featOn}
                        tabIndex={-1}
                        className="drum__card"
                        style={{ transform: `rotateX(${-i * 22}deg) translateZ(var(--r))`, opacity: i < 4 ? 1 - (i * 22) / 84 : 0 }}
                        onClick={() => go(i)}
                      >
                        <b>{v.label}</b>
                        <span>{v.body}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Link className="story__guide" href="/features">
                  Explore the complete feature guide
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m10.5 8.5 3.5 3.5-3.5 3.5" /></svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Screen 3 */}
          <div
            ref={(el) => {
              layers.current.tabs = el;
            }}
            className="story__layer story__tabs"
            id="tabs"
            aria-labelledby="tabs-title"
          >
            <div className="wrap story__tabgrid">
              <div className="story__tabtext">
                <p className="kicker">Tabs</p>
                <h2 id="tabs-title">Across the top, or down the side.</h2>
                <div className="story__facts" data-turned={view.turned}>
                  <p className="story__fact" data-for="row">
                    <span className="story__figure num" aria-hidden="true">6</span>
                    <span>
                      <b>Up to 6 tabs across the top</b>
                      Four in the free app, six with {site.pro.name}.
                    </span>
                  </p>
                  <p className="story__fact" data-for="column">
                    <span className="story__figure num" aria-hidden="true">∞</span>
                    <span>
                      <b>No limit down the side</b>
                      Turn on vertical tabs and {site.pro.name} has no limit.
                    </span>
                  </p>
                </div>
              </div>
              <Slot id="tabs">
                <Shot src="open-vertical-tabs.png" w={640} width={1280} height={483} alt="The notch with its tabs moved into a column down the left side" />
              </Slot>
            </div>
          </div>

          {/* The one notch that travels through all three. */}
          <div ref={notch} className="story__notch" data-phase={view.phase} aria-hidden="true">
            <div className="story__drop">
              <img className="story__img" data-on={view.phase === "hero"} src="/landing/open-home.png" alt="" width={1280} height={483} fetchPriority="high" />
              {items.map((v, i) => (
                <img key={v.id} className="story__img" data-on={featOn === i} src={`/landing/${v.src}`} alt="" width={1280} height={468} loading={i < 2 ? "eager" : "lazy"} />
              ))}
              <div className="story__tabsnotch" data-on={view.phase === "tabs"}>
                {[...tabBases, "vertical"].map((b, i) => (
                  <img key={b} className="story__img" data-on={tabOn === i} src={`/landing/story/${b}.png`} alt="" width={1280} height={b === "home" || b === "vertical" ? 483 : 468} loading="lazy" />
                ))}
                <span ref={pill} className="story__pill" />
                {tabIcons.map((n, i) => (
                  <img
                    key={n}
                    ref={(el) => {
                      icons.current[i] = el;
                    }}
                    className="story__icon"
                    src={`/landing/story/tab-${n}.png`}
                    alt=""
                    width={48}
                    height={48}
                  />
                ))}
                <img ref={live} className="story__icon story__icon--live" src="/landing/story/tab-live.png" alt="" width={56} height={56} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
