"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Mac from "./Mac";
import Shot from "./Shot";
import { site } from "@/lib/site";

/* Screens 1 to 3 as one pinned stage with one notch in it. The notch hangs
   under the bar in the hero, slides into a Mac for the feature strip, then into
   another Mac for the tabs, where its tab row turns into a column. Everything is driven by how
   far the page has scrolled through the section, so it moves with the scroll.
   Windows too short to pin show the three screens one after another. */

const items = [
  { id: "home", h: 468, label: "Home", src: "open-home-calendar.png", hue: 18, body: "The song, the weather and your next meeting, with Join.", alt: "Home with the calendar card: a week strip, today's events and a Join button" },
  { id: "shelf", h: 468, label: "Shelf", src: "open-shelf.png", hue: 268, body: "Drop files on the notch to hold them for later, or AirDrop them from there.", alt: "The Shelf holding three files, with an AirDrop target on the left" },
  { id: "clipboard", h: 468, label: "Clipboard", src: "open-clipboard.png", hue: 160, body: "Text, links, colours and images you copied, one ⇧ ⌘ C away.", alt: "Clipboard history with filters and copied text, a pinned link, a colour, an image and a file" },
  { id: "widgets", h: 468, label: "Widgets", src: "widgets-day.png", hue: 225, body: "Clock, calendar, reminders, battery and weather, laid out your way.", alt: "A widget page: time and weather, today's calendar, reminders, battery, clock and weather" },
  { id: "screenshot", h: 468, label: "Screenshots", src: "open-screenshot.png", hue: 335, body: "Each one lands here first: copy it, mark it up, pull the text out or save it.", alt: "A fresh screenshot in the notch with Copy, Annotate, Text and Save" },
  { id: "claude", h: 432, label: "Claude Code", src: "open-claude-approval.png", hue: 40, body: "When a session wants to run a command, Allow and Deny appear up top.", alt: "Claude Code in eyebrow-website asks to run npm run build, with Deny and Allow buttons" },
  { id: "meeting", h: 374, label: "Meetings", src: "open-meeting-reminder.png", hue: 255, body: "A reminder drops down before the meeting starts, with the link to join.", alt: "A meeting reminder for Design Review with a Join button" },
  { id: "call", h: 256, label: "Calls", src: "open-call-tab.png", hue: 150, body: "Mute, camera and leave for the call you are on.", alt: "The call tab with Mute, Camera and Leave" },
  { id: "notes", h: 468, label: "Notes", src: "open-notes-composer.png", hue: 80, body: "The Notes widget: bold, lists, links and images, all kept on your Mac.", alt: "A note being edited in the notch, with a formatting toolbar and a bulleted list" },
  { id: "colour", h: 478, label: "Colour picker", src: "open-colour-picker.png", hue: 20, body: "The colour picker widget: pick off the screen, check contrast, copy.", alt: "The colour picker: a shade square, a hue slider, contrast grades on white and black, and HEX, RGB and HSL values" },
  { id: "builds", h: 468, label: "Builds", src: "open-builds.png", hue: 250, body: "The Builds widget: did the pipeline pass on GitHub or GitLab?", alt: "Builds: GitHub and GitLab runs, one running and one failed, with All, GitHub, GitLab and Local filters" },
  { id: "weather", h: 468, label: "Weather", src: "open-weather.png", hue: 205, body: "Now, and the next few hours.", alt: "The weather tab: temperature, conditions and an hourly forecast" },
  { id: "audio", h: 412, label: "Audio", src: "open-audio.png", hue: 300, body: "Volume, the output device and the microphone, in one place.", alt: "The audio tab: volume, output devices and input" },
] as const;

const N = items.length;

/* Each capture is as tall as its view needs (the call is short, Home is tall),
   and the notch's body ends PAD px above the capture's bottom edge. Between two
   features the notch takes a height in between, so it grows and shrinks with the
   scroll. The body is inset SIDE px from the capture's edges, its corners R px. */
const PAD = 8;
const SIDE = 38;
const R = 60;
const heightAt = (p: number) => {
  const i = clamp(Math.floor(p), 0, N - 1);
  const j = Math.min(N - 1, i + 1);
  return lerp(items[i].h, items[j].h, clamp(p - i));
};
/* A capture cut off at `cut` px (capture px), with the notch's rounded bottom corners. */
const cutPath = (unit: number, cut: number) => {
  const w = IW * unit;
  const s = SIDE * unit;
  const r = R * unit;
  const y = (cut - PAD) * unit;
  const f = (n: number) => n.toFixed(2);
  return `path("M0 0 H${f(w)} V${f(y - r)} H${f(w - s)} A${f(r)} ${f(r)} 0 0 1 ${f(w - s - r)} ${f(y)} H${f(s + r)} A${f(r)} ${f(r)} 0 0 1 ${f(s)} ${f(y - r)} H0 Z")`;
};

/* Between the hero and the features the notch doesn't slide across the page over
   both headlines. It closes into a pill at the top of the screen, a drop of it
   drips off and falls into the Mac, and the notch opens again from a pill there.
   PW × PH is the closed pill, in capture px; the stretches are shares of the intro. */
const PW = 400;
const PH = 64;
const CLOSE = 0.3;
const OPEN = 0.72;
/* The notch's own outline at `shut` (0 open, 1 a pill), as a clip on the 1280 × 483 box. */
const shapeClip = (unit: number, h: number, shut: number) => {
  const m = ease(shut);
  const side = lerp(SIDE, (IW - PW) / 2, m) * unit;
  const bottom = lerp(IH - (h - PAD), IH - PH, m) * unit;
  const r = lerp(R, PH / 2, m) * unit;
  const f = (n: number) => n.toFixed(2);
  return `inset(0px ${f(side)}px ${f(bottom)}px ${f(side)}px round 0px 0px ${f(r)}px ${f(r)}px)`;
};

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
  const track = useRef<HTMLDivElement>(null);
  const stride = useRef(0);
  const icons = useRef<(HTMLImageElement | null)[]>([]);
  const live = useRef<HTMLImageElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const drop = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const rim = useRef<HTMLDivElement>(null);
  const shots = useRef<(HTMLImageElement | null)[]>([]);
  const slots = useRef<Record<string, Rect>>({});
  const base = useRef(640);
  const pinned = useRef(false);
  const still = useRef(false);
  const ink = useRef<HTMLDivElement>(null);
  const goo = useRef<SVGSVGElement>(null);
  const gooTop = useRef<SVGRectElement>(null);
  const gooBot = useRef<SVGRectElement>(null);
  const gooDrop = useRef<SVGEllipseElement>(null);
  const gooEdge = useRef<SVGPathElement>(null);
  const gooTail = useRef<SVGCircleElement>(null);
  const [view, setView] = useState<View>({ phase: "hero", on: 0, turned: false });
  const viewRef = useRef(view);

  const measure = useCallback(() => {
    const st = stage.current;
    if (!st) return;
    for (const el of st.querySelectorAll<HTMLElement>("[data-slot]")) {
      slots.current[el.dataset.slot!] = offsetIn(el, st);
    }
    base.current = Math.max(...Object.values(slots.current).map((r) => r.w), 1);
    const [c0, c1] = cards.current;
    if (c0 && c1) stride.current = c1.offsetLeft - c0.offsetLeft;
    if (notch.current) {
      notch.current.style.width = `${base.current}px`;
      notch.current.style.setProperty("--u", `${base.current / IW}px`);
      notch.current.dataset.ready = "";
    }
  }, []);

  /* The drop, g from 0 to 1: it swells out of the hero's pill and pinches off, falls in an
     arc, stretched along the way it's going, and splashes into the pill in the Mac. The
     goo filter melts the shapes together while they touch, which makes the neck. */
  const drip = useCallback((a: Rect, b: Rect, g: number) => {
    const top = gooTop.current;
    const bot = gooBot.current;
    const dot = gooDrop.current;
    if (!top || !bot || !dot) return;
    const A = { x: a.x + a.w / 2, y: a.y, w: (PW * a.w) / IW, h: (PH * a.w) / IW };
    const B = { x: b.x + b.w / 2, y: b.y, w: (PW * b.w) / IW, h: (PH * b.w) / IW };
    const swell = ease(clamp(g / 0.28));
    const fall = clamp((g - 0.28) / 0.56);
    const land = clamp((g - 0.74) / 0.26);
    const pill = (el: SVGRectElement, P: typeof A, kw: number, kh: number) => {
      const w = Math.max(0, P.w * kw);
      const h = Math.max(0, P.h * kh);
      // Square along the top edge: the rect starts above it by its own radius.
      el.setAttribute("x", (P.x - w / 2).toFixed(2));
      el.setAttribute("y", (P.y - h / 2).toFixed(2));
      el.setAttribute("width", w.toFixed(2));
      el.setAttribute("height", (h * 1.5).toFixed(2));
      el.setAttribute("rx", (Math.min(w, h) / 2).toFixed(2));
    };
    // The hero's pill gives itself up to the drop, then is gone.
    const drain = (1 - swell * 0.5) * (1 - ease(clamp(fall / 0.3)));
    pill(top, A, lerp(0.55, 1, drain), drain);
    // The Mac's pill fills as the drop lands, overshooting sideways like a splash.
    const fill = ease(land);
    const splash = Math.sin(land * Math.PI);
    pill(bot, B, fill * (1 + 0.18 * splash), fill * (1 - 0.12 * splash));
    const r0 = A.h * 0.75;
    const r1 = B.h * 0.75;
    const y0 = A.y + A.h * 0.9 + r0;
    const y1 = B.y + B.h * 0.55;
    let x = A.x;
    let y = lerp(A.y + A.h * 0.35, y0, swell);
    let r = lerp(r0 * 0.45, r0, swell);
    let sx = 1;
    let sy = 1 + 0.25 * swell * (1 - fall);
    let ang = 0;
    if (fall > 0) {
      // It drops straight off, drifts across on the way down, and comes in from above.
      const at = (f: number) => ({ x: lerp(A.x, B.x, ease(clamp(f))), y: lerp(y0, y1, clamp(f) ** 1.6) });
      ({ x, y } = at(fall));
      r = lerp(r0, r1, fall) * (1 - ease(land));
      const ahead = at(fall + 0.02);
      const behind = at(fall - 0.02);
      const vx = ahead.x - behind.x;
      const vy = ahead.y - behind.y + 0.01;
      // Stretched along the way it's going, the faster the more.
      sy = 1 + 0.3 * clamp(Math.hypot(vx, vy) / Math.max(1, (y1 - y0) * 0.08)) * (1 - land);
      sx = 1 / Math.sqrt(sy);
      ang = (Math.atan2(vy, vx) * 180) / Math.PI - 90;
    }
    // A smaller drop trails behind, and the goo pulls the two into a teardrop.
    const tail = gooTail.current;
    if (tail) {
      const k = fall > 0 && land < 1 ? Math.sin(Math.min(1, fall * 1.4) * Math.PI) * (1 - ease(land)) : 0;
      const q = fall > 0 ? { x: lerp(A.x, B.x, ease(clamp(fall - 0.035))), y: lerp(y0, y1, clamp(fall - 0.035) ** 1.6) } : { x, y };
      tail.setAttribute("r", (r0 * 0.62 * k).toFixed(2));
      tail.setAttribute("cx", q.x.toFixed(2));
      tail.setAttribute("cy", q.y.toFixed(2));
    }
    // The bezel strip just above the Mac's screen stays clear, so the drop goes in behind the
    // edge and the pill it fills hangs square from it, like the notch does.
    const edge = gooEdge.current;
    if (edge) {
      const w = B.w * 1.6;
      const h = B.h * 0.75;
      edge.setAttribute("d", `M-1e5 -1e5H1e5V1e5H-1e5Z M${(B.x - w / 2).toFixed(2)} ${(B.y - h).toFixed(2)}h${w.toFixed(2)}v${h.toFixed(2)}h${(-w).toFixed(2)}Z`);
    }
    dot.setAttribute("rx", (r * sx).toFixed(2));
    dot.setAttribute("ry", (r * sy).toFixed(2));
    dot.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${ang.toFixed(2)})`);
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

    // The notch's height follows the scroll from one feature's height to the next.
    const dh = heightAt(p);

    // The notch: hero slot → (a drop) → feature slot → tabs slot.
    const { hero, feat, tabs } = slots.current;
    const n = notch.current;
    if (hero && feat && tabs && n && drop.current) {
      const place = (r: Rect) => `translate3d(${r.x}px, ${r.y}px, 0) scale(${r.w / base.current})`;
      let shut = 0;
      let dripping = false;
      if (t < AT.move) {
        // With reduced motion there's no drop: it closes, and opens again in the Mac.
        const close = still.current ? 0.5 : CLOSE;
        const open = still.current ? 0.5 : OPEN;
        const inB = intro >= (close + open) / 2;
        n.style.transform = place(inB ? feat : hero);
        shut = inB ? 1 - clamp((intro - open) / (1 - open)) : clamp(intro / close);
        dripping = !still.current && intro > close - 0.004 && intro < open + 0.004;
        n.style.visibility = intro > close && intro < open && !still.current ? "hidden" : "";
        drop.current.style.clipPath = shut > 0.001 ? shapeClip(base.current / IW, inB ? dh : IH, shut) : "";
        if (dripping) drip(hero, feat, clamp((intro - close) / (open - close)));
      } else {
        const m = ease(move);
        n.style.transform = place({ x: lerp(feat.x, tabs.x, m), y: lerp(feat.y, tabs.y, m), w: lerp(feat.w, tabs.w, m) });
        n.style.visibility = "";
        drop.current.style.clipPath = "";
      }
      // The capture goes dark as the notch closes, so the pill it ends as is plain black.
      if (ink.current) ink.current.style.opacity = String(clamp(ease(shut) * 1.7));
      if (goo.current) goo.current.style.visibility = dripping ? "visible" : "hidden";
    }
    const near = items[clamp(Math.round(p), 0, N - 1)].h;
    drop.current?.style.setProperty("--dh", dh.toFixed(2));
    shots.current.forEach((img, i) => {
      if (img) img.style.clipPath = items[i].h > dh + 0.5 ? cutPath(base.current / IW, dh) : "";
    });

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
    // The body under a shorter capture, and the rim along a cut-off taller one: only while resizing.
    if (body.current) body.current.style.opacity = String(vis.feat);
    if (rim.current) rim.current.style.opacity = String(vis.feat * clamp(Math.abs(dh - near) / 12));
    if (layers.current.hero) layers.current.hero.style.transform = `translate3d(0, ${(vis.hero - 1) * 48}px, 0)`;
    // The strip: a straight row of cards sliding sideways, the current one in the middle.
    if (track.current) track.current.style.transform = `translate3d(${(1 - vis.feat) * 48 - p * stride.current}px, 0, 0)`;
    cards.current.forEach((c, i) => {
      if (!c) return;
      c.style.opacity = String(1 - clamp(Math.abs(i - p) * 0.3, 0, 0.6));
    });

    // The colour behind the strip, and the wallpaper in its Mac, flow from one feature's hue into the next.
    st.style.setProperty("--h1", hueAt(p).toFixed(1));
    st.style.setProperty("--h2", hueAt(Math.min(N - 1, p + 1.2)).toFixed(1));
    if (bg.current) {
      bg.current.style.opacity = String(vis.feat);
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
  }, [drip]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      still.current = motion.matches;
    };
    onMotion();
    motion.addEventListener("change", onMotion);
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
    // And whenever anything on a screen changes size without the window doing so, so the notch still lands in its Mac.
    const ro = new ResizeObserver(() => onResize());
    stage.current?.querySelectorAll(".story__layer > *").forEach((el) => ro.observe(el));
    return () => {
      ro.disconnect();
      motion.removeEventListener("change", onMotion);
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
              <div className="story__head">
                <p className="kicker">Features</p>
                <h2 id="wheel-title">Everything, one notch.</h2>
                <Link className="story__guide" href="/features">
                  Explore the complete feature guide
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m10.5 8.5 3.5 3.5-3.5 3.5" /></svg>
                </Link>
              </div>
              <Mac className="story__mac">
                <Slot id="feat">
                  <Shot src="open-home-calendar.png" w={640} width={1280} height={468} alt="" />
                </Slot>
              </Mac>
              {/* Too short a window to pin: the features as a row to swipe through. */}
              <ul className="story__list" aria-label="Features">
                {items.map((v) => (
                  <li key={v.id}>
                    <figure className="edge">
                      <Mac top notch={0.78}>
                        <Shot src={v.src} w={640} width={1280} height={v.h} alt={v.alt} />
                      </Mac>
                      <figcaption>
                        <b>{v.label}</b>
                        {v.body}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="strip"
              role="listbox"
              aria-label="Features"
              aria-orientation="horizontal"
              aria-activedescendant={featOn >= 0 && featOn < N ? `strip-${items[featOn].id}` : undefined}
              tabIndex={0}
              onKeyDown={onKey}
            >
              <div ref={track} className="strip__track">
                {items.map((v, i) => (
                  <button
                    key={v.id}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    id={`strip-${v.id}`}
                    type="button"
                    role="option"
                    aria-selected={i === featOn}
                    tabIndex={-1}
                    className="strip__card"
                    style={{ opacity: 1 - Math.min(i * 0.3, 0.6) }}
                    onClick={() => go(i)}
                  >
                    <b>{v.label}</b>
                    <span>{v.body}</span>
                  </button>
                ))}
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
              <Mac className="story__mac">
                <Slot id="tabs">
                  <Shot src="open-vertical-tabs.png" w={640} width={1280} height={483} alt="The notch with its tabs moved into a column down the left side" />
                </Slot>
              </Mac>
            </div>
          </div>

          {/* The drop that carries the notch from the hero into the Mac. */}
          <svg ref={goo} className="story__goo" aria-hidden="true" focusable="false">
            <defs>
              <filter id="story-goo" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="7" />
                <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
              </filter>
              <clipPath id="story-goo-edge">
                <path ref={gooEdge} clipRule="evenodd" d="M-1e5 -1e5H1e5V1e5H-1e5Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#story-goo-edge)">
              <g filter="url(#story-goo)">
                <rect ref={gooTop} />
                <rect ref={gooBot} />
                <ellipse ref={gooDrop} />
                <circle ref={gooTail} />
              </g>
            </g>
          </svg>

          {/* The one notch that travels through all three. */}
          <div ref={notch} className="story__notch" data-phase={view.phase} aria-hidden="true">
            <div ref={drop} className="story__drop">
              <div ref={body} className="story__fill" />
              <img className="story__img" data-on={view.phase === "hero"} src="/landing/open-home.png" alt="" width={1280} height={483} fetchPriority="high" />
              {items.map((v, i) => (
                <img
                  key={v.id}
                  ref={(el) => {
                    shots.current[i] = el;
                  }}
                  className="story__img"
                  data-on={featOn === i}
                  src={`/landing/${v.src}`}
                  alt=""
                  width={1280}
                  height={v.h}
                  loading={i < 2 ? "eager" : "lazy"}
                />
              ))}
              <div ref={rim} className="story__fill story__fill--rim" />
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
              <div ref={ink} className="story__ink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
