import { useId } from "react";

/**
 * The app's widget tiles, redrawn for the web from
 * Eyebrow/components/Widgets/WidgetRenderer.swift. Every number here is the
 * point size the app uses; the CSS multiplies it by --u (one app point), so
 * a tile scales with whatever holds it.
 */

export type WidgetKind =
  | "timeWeather"
  | "music"
  | "battery"
  | "weather"
  | "calendar"
  | "reminders"
  | "memory"
  | "timer"
  | "clipboard"
  | "transcribe"
  | "aiUsage"
  | "browserTabs";

export type WidgetSize = "s" | "m" | "l";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
type Kids = { children?: React.ReactNode };

/* --- sample data ---------------------------------------------------- */

const now = { time: "8:36", meridiem: "AM", greeting: "good morning" };
const weather = { temp: "31°", condition: "Partly Cloudy" };
const track = { title: "Bad Decisions", artist: "Two Door Cinema Club" };

const events = [
  { title: "Supplier call", time: "10:00 AM", tint: "a" },
  { title: "Quarterly planning", time: "11:30 AM", tint: "b" },
  { title: "Dinner", time: "7:30 PM", tint: "c" },
];

const reminders = [
  "Send invoices to Al Noor",
  "Renew trade licence",
  "Call the bank",
  "Book flights",
];

const clips = [
  { kind: "text", text: "Meeting moved to 4 pm", age: "2 min. ago" },
  { kind: "link", text: "https://developer.apple.com", age: "15 min. ago" },
  { kind: "color", text: "#3D8BFF", age: "1 hr. ago" },
  { kind: "text", text: "AE07 0331 2345 6789 0123 456", age: "2 hr. ago" },
] as const;

const hours = [
  { time: "9 AM", glyph: "sun", temp: "32°" },
  { time: "10 AM", glyph: "cloudSun", temp: "33°" },
  { time: "11 AM", glyph: "cloud", temp: "34°" },
];

// A figure with no limit to measure against keeps its row but shows no fill.
const limits = [
  { label: "Context window", detail: "83%", p: 0.83 },
  { label: "5-hour window", detail: "72%", p: 0.72 },
  { label: "Last 7 days", detail: "26.8M tokens", p: 0 },
];

// Fixed levels, so the server and the browser draw the same waveform.
const levels = [
  9, 7, 10, 4, 6, 3, 8, 10, 5, 3, 7, 9, 4, 6, 10, 8, 3, 5, 9, 7, 4, 8, 10, 6,
  3, 7, 9, 5, 8, 4, 10, 6, 9, 10,
];

/* --- glyphs: the in-notch icon set, filled like the app's ----------- */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const glyphs: Record<string, React.ReactNode> = {
  house: <path d="M12 3.1 2.6 11.2a.6.6 0 0 0 .4 1.05H5V19a1.5 1.5 0 0 0 1.5 1.5H10V15h4v5.5h3.5A1.5 1.5 0 0 0 19 19v-6.75h2a.6.6 0 0 0 .4-1.05Z" />,
  tray: <path fillRule="evenodd" d="M6.1 4.5h11.8a1.6 1.6 0 0 1 1.55 1.2L21.9 14v4a2.5 2.5 0 0 1-2.5 2.5H4.6A2.5 2.5 0 0 1 2.1 18v-4l2.45-8.3A1.6 1.6 0 0 1 6.1 4.5Zm.5 2.2-1.9 6.5h3.6a1 1 0 0 1 .95.7 2.9 2.9 0 0 0 5.5 0 1 1 0 0 1 .95-.7h3.6l-1.9-6.5Z" />,
  clipboard: <><path opacity="0.55" d="M11 2.4h4.9l4.3 4.3v8.5a1.7 1.7 0 0 1-1.7 1.7H17v-6.6l-5.1-5.1H9.3V4.1A1.7 1.7 0 0 1 11 2.4Z" /><path d="M5.5 6.8h5.6l4.3 4.3v8.8a1.7 1.7 0 0 1-1.7 1.7H5.5a1.7 1.7 0 0 1-1.7-1.7V8.5a1.7 1.7 0 0 1 1.7-1.7Z" /></>,
  group: <><rect x="2.5" y="5" width="8.6" height="14" rx="2.2" /><rect x="12.9" y="5" width="8.6" height="6.1" rx="2.2" /><rect x="12.9" y="12.9" width="8.6" height="6.1" rx="2.2" /></>,
  pencil: <path d="M15.4 4.1a2.1 2.1 0 0 1 3 0l1.5 1.5a2.1 2.1 0 0 1 0 3L9 19.5l-4.9 1.4a.5.5 0 0 1-.6-.6L4.9 15.4Z" />,
  gear: <><circle cx="12" cy="12" r="8.3" fill="none" stroke="currentColor" strokeWidth="3.4" strokeDasharray="3.4 3.12" /><circle cx="12" cy="12" r="5.1" fill="none" stroke="currentColor" strokeWidth="3.6" /></>,
  webcam: <><circle {...stroke} strokeWidth="1.9" cx="12" cy="9.4" r="6.5" /><circle cx="12" cy="9.4" r="2.6" /><path {...stroke} strokeWidth="1.9" d="M12 16.2v4.4M7.8 20.8h8.4" /></>,
  speaker: <><path d="M3 9.2h3.2l4.6-3.9a.7.7 0 0 1 1.2.5v12.4a.7.7 0 0 1-1.2.5l-4.6-3.9H3a1 1 0 0 1-1-1v-3.6a1 1 0 0 1 1-1Z" /><path {...stroke} strokeWidth="1.8" d="M15.2 9.3a3.8 3.8 0 0 1 0 5.4M18 6.8a7.4 7.4 0 0 1 0 10.4" /></>,
  laptop: <><rect {...stroke} strokeWidth="1.8" x="5" y="5.5" width="14" height="9.5" rx="1.6" /><path d="M2.2 17h19.6v.6a1.4 1.4 0 0 1-1.4 1.4H3.6a1.4 1.4 0 0 1-1.4-1.4Z" /></>,
  compass: <><circle {...stroke} strokeWidth="1.8" cx="12" cy="12" r="8.6" /><path d="M15.9 8.1 13.3 13.3 8.1 15.9l2.6-5.2Z" /></>,
  refresh: <><path {...stroke} strokeWidth="2.2" d="M19.4 12a7.4 7.4 0 1 1-2.2-5.3" /><path {...stroke} strokeWidth="2.2" d="M17.7 2.8v4.3h-4.3" /></>,
  share: <><path {...stroke} strokeWidth="1.7" d="M12 14.5V3.6M8.4 6.8 12 3.2l3.6 3.6" /><path {...stroke} strokeWidth="1.7" d="M8.2 9.8H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1.2" /></>,
  trayDown: <><path {...stroke} strokeWidth="1.8" opacity="0.62" d="M12 2.6v8.2M8.6 7.6 12 11l3.4-3.4" /><path d="M3 15.2 5.3 10.4a1.4 1.4 0 0 1 1.3-.8h1.2v1.8H7l-1.5 3.2h3.2a.9.9 0 0 1 .85.6 2.6 2.6 0 0 0 4.9 0 .9.9 0 0 1 .85-.6h3.2L17 11.4h-.8V9.6h1.2a1.4 1.4 0 0 1 1.3.8L21 15.2v3.6a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 18.8Z" /></>,
  phone: <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 13l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />,
  micSlash: <><rect x="9.2" y="2.5" width="5.6" height="11" rx="2.8" /><path {...stroke} strokeWidth="1.8" d="M5.8 11a6.2 6.2 0 0 0 12.4 0M12 17.4v3.4" /><path {...stroke} strokeWidth="2.1" d="M4.2 3.6 19.8 20.4" /></>,
  sun: <><circle cx="12" cy="12" r="4.4" /><path {...stroke} strokeWidth="1.9" d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" /></>,
  cloud: <path d="M7.4 19.5a4.4 4.4 0 0 1-.5-8.77 5.6 5.6 0 0 1 10.6 1.4 3.75 3.75 0 0 1-.4 7.37Z" />,
  heart: <path {...stroke} strokeWidth="2" d="M12 20.2s-7.6-4.5-7.6-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.6 2.7c0 5.7-7.6 10.2-7.6 10.2Z" />,
  calendar: <><rect {...stroke} strokeWidth="2" x="3.4" y="4.6" width="17.2" height="15.6" rx="3" /><path d="M3.4 7.6a3 3 0 0 1 3-3h11.2a3 3 0 0 1 3 3v2H3.4Z" /><path {...stroke} strokeWidth="1.7" d="M7.6 13.4h.1M12 13.4h.1M16.4 13.4h.1M7.6 16.6h.1M12 16.6h.1M16.4 16.6h.1" /></>,
  checkCircle: <><circle {...stroke} strokeWidth="2" cx="12" cy="12" r="8.6" /><path {...stroke} strokeWidth="2" d="m8.2 12.4 2.6 2.6 5-5.6" /></>,
  note: <path d="M9.2 5.4a1 1 0 0 1 .8-1l7.6-1.7a1 1 0 0 1 1.2 1v10.9a3 3 0 1 1-1.8-2.75V7.3l-6 1.35v8.1a3 3 0 1 1-1.8-2.75Z" />,
  cloudSun: <><g opacity="0.55"><circle cx="15.6" cy="8.4" r="3.4" /><path {...stroke} strokeWidth="1.7" d="M15.6 2.2v1.3M21.8 8.4h-1.3M20 4l-.9.9M11.2 4l.9.9M20 12.8l-.9-.9" /></g><path d="M7.4 20.5a4.4 4.4 0 0 1-.5-8.77 5.6 5.6 0 0 1 10.6 1.4 3.75 3.75 0 0 1-.4 7.37Z" /></>,
  bolt: <path d="M13.6 1.8 4.4 13.3a.6.6 0 0 0 .5 1h5.4l-1.4 7.5a.4.4 0 0 0 .7.3l9.2-11.4a.6.6 0 0 0-.5-1h-5.4l1.4-7.6a.4.4 0 0 0-.7-.3Z" />,
  pause: <><rect x="5.5" y="4.5" width="4.6" height="15" rx="1.5" /><rect x="13.9" y="4.5" width="4.6" height="15" rx="1.5" /></>,
  backward: <><path d="M11.6 6.3v11.4a.8.8 0 0 1-1.27.65L2.4 12.65a.8.8 0 0 1 0-1.3l7.93-5.7a.8.8 0 0 1 1.27.65Z" /><path d="M22 6.3v11.4a.8.8 0 0 1-1.27.65l-7.93-5.7a.8.8 0 0 1 0-1.3l7.93-5.7A.8.8 0 0 1 22 6.3Z" /></>,
  forward: <g transform="matrix(-1 0 0 1 24 0)"><path d="M11.6 6.3v11.4a.8.8 0 0 1-1.27.65L2.4 12.65a.8.8 0 0 1 0-1.3l7.93-5.7a.8.8 0 0 1 1.27.65Z" /><path d="M22 6.3v11.4a.8.8 0 0 1-1.27.65l-7.93-5.7a.8.8 0 0 1 0-1.3l7.93-5.7A.8.8 0 0 1 22 6.3Z" /></g>,
  list: <><circle cx="4.6" cy="6.5" r="1.7" /><circle cx="4.6" cy="12" r="1.7" /><circle cx="4.6" cy="17.5" r="1.7" /><rect x="8.6" y="5.2" width="13" height="2.6" rx="1.3" /><rect x="8.6" y="10.7" width="13" height="2.6" rx="1.3" /><rect x="8.6" y="16.2" width="13" height="2.6" rx="1.3" /></>,
  memory: <><rect {...stroke} x="2.8" y="6" width="18.4" height="11" rx="2.6" /><path {...stroke} strokeWidth="1.6" d="M7 17v2.6M10.3 17v2.6M13.7 17v2.6M17 17v2.6" /></>,
  reset: <><path {...stroke} strokeWidth="2.3" d="M5.6 8.2A7.9 7.9 0 1 1 4.1 12.6" /><path {...stroke} strokeWidth="2.3" d="M5.4 3.4v5h5" /></>,
  copy: <><path {...stroke} d="M9.3 4.8h3.2l3 3V15a1.6 1.6 0 0 1-1.6 1.6H9.3A1.6 1.6 0 0 1 7.7 15V6.4a1.6 1.6 0 0 1 1.6-1.6Z" transform="translate(4.5 -1.6)" /><path {...stroke} d="M8.6 6.4H6A1.7 1.7 0 0 0 4.3 8.1v10.8A1.7 1.7 0 0 0 6 20.6h7.6a1.7 1.7 0 0 0 1.7-1.7v-.6" /><path {...stroke} strokeWidth="1.6" d="M7.2 12.4h4M7.2 15.6h4" /></>,
  doc: <><path {...stroke} strokeWidth="1.8" d="M7.2 3h6.3l4.5 4.5v11.3A2.2 2.2 0 0 1 15.8 21H7.2A2.2 2.2 0 0 1 5 18.8V5.2A2.2 2.2 0 0 1 7.2 3Z" /><path {...stroke} strokeWidth="1.8" d="M8.6 12h6.8M8.6 15.4h6.8M8.6 8.6h3" /></>,
  link: <g {...stroke} strokeWidth="2.1" transform="rotate(-45 12 12)"><rect x="1.6" y="8.6" width="11.4" height="6.8" rx="3.4" /><rect x="11" y="8.6" width="11.4" height="6.8" rx="3.4" /></g>,
  wave: <><path {...stroke} strokeWidth="2.1" d="M2.6 9.5v5M6.2 5.2v13.6M9.8 8v8M13.4 3v10" /><rect x="16.2" y="10" width="4.4" height="7.4" rx="2.2" /><path {...stroke} strokeWidth="1.6" d="M14.4 15a4 4 0 0 0 8 0M18.4 19v2.2" /></>,
  stop: <rect x="5" y="5" width="14" height="14" rx="2.6" />,
  chip: <><path fillRule="evenodd" d="M8.4 5h7.2A3.4 3.4 0 0 1 19 8.4v7.2a3.4 3.4 0 0 1-3.4 3.4H8.4A3.4 3.4 0 0 1 5 15.6V8.4A3.4 3.4 0 0 1 8.4 5Zm1.3 3.5a1.2 1.2 0 0 0-1.2 1.2v4.6a1.2 1.2 0 0 0 1.2 1.2h4.6a1.2 1.2 0 0 0 1.2-1.2V9.7a1.2 1.2 0 0 0-1.2-1.2Z" /><path {...stroke} strokeWidth="1.7" d="M9 2.4v1.4M12 2.4v1.4M15 2.4v1.4M9 20.2v1.4M12 20.2v1.4M15 20.2v1.4M2.4 9h1.4M2.4 12h1.4M2.4 15h1.4M20.2 9h1.4M20.2 12h1.4M20.2 15h1.4" /></>,
};

/** `s` is the box side in app points. */
export function Glyph({ n, s, c = "" }: { n: string; s: number; c?: string }) {
  return (
    <svg
      className={`wg-g ${c}`}
      style={{ "--s": s } as Vars}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[n]}
    </svg>
  );
}

/* --- stacks and text, named for what they are in the Swift source --- */

function V({ g = 0, c = "", children }: Kids & { g?: number; c?: string }) {
  return (
    <div className={`wg-v ${c}`} style={{ "--g": g } as Vars}>
      {children}
    </div>
  );
}

function H({ g = 0, c = "", children }: Kids & { g?: number; c?: string }) {
  return (
    <div className={`wg-h ${c}`} style={{ "--g": g } as Vars}>
      {children}
    </div>
  );
}

const Sp = () => <span className="wg-sp" />;

function T({ s = 10, c = "", children }: Kids & { s?: number; c?: string }) {
  return (
    <span className={`wg-t ${c}`} style={{ "--s": s } as Vars}>
      {children}
    </span>
  );
}

/** The kicker at the top of a tile: brand gradient, sentence case. */
const Label = ({ s = 10, children }: Kids & { s?: number }) => (
  <T s={s} c="wg-t--label">{children}</T>
);

/** The quiet line under a tile's main value. */
const Cap = ({ s = 10, children }: Kids & { s?: number }) => (
  <T s={s} c="wg-t--cap">{children}</T>
);

/** The big figure a tile leads with. */
const Num = ({ s, children }: Kids & { s: number }) => (
  <T s={s} c="wg-t--num">{children}</T>
);

/** A circular gauge with something in the middle. */
export function Ring({
  side,
  lw,
  p,
  tint = "brand",
  children,
}: Kids & {
  side: number;
  lw: number;
  p: number;
  tint?: "brand" | "positive" | "critical" | "accent";
}) {
  const id = `wg${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const c = side / 2;
  const r = (side - lw) / 2;
  return (
    <span className="wg-ring" style={{ "--d": side } as Vars}>
      <svg viewBox={`0 0 ${side} ${side}`} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--brand-mint)" }} />
            <stop offset="1" style={{ stopColor: "var(--brand-blue)" }} />
          </linearGradient>
        </defs>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--notch-track)" strokeWidth={lw} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={tint === "brand" ? `url(#${id})` : `var(--color-${tint})`}
          strokeWidth={lw}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${p * 100} 100`}
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
      <span className="wg-ring__center">{children}</span>
    </span>
  );
}

function Bar({ p, h }: { p: number; h: number }) {
  return (
    <span className="wg-bar" style={{ "--d": h } as Vars}>
      <i style={{ inlineSize: `${p * 100}%` }} />
    </span>
  );
}

function CircleButton({ d, filled, children }: Kids & { d: number; filled?: boolean }) {
  return (
    <span className="wg-cbtn" data-filled={filled} style={{ "--d": d } as Vars}>
      {children}
    </span>
  );
}

/* --- Time & Weather (the good morning card) -------------------------- */

function WeatherInline() {
  return (
    <H g={4} c="wg-fit">
      <Glyph n="cloudSun" s={15} />
      <T s={11} c="wg-t--sb wg-t--2">{weather.temp}</T>
    </H>
  );
}

function TimeWeather({ size }: { size: WidgetSize }) {
  if (size === "s") {
    return (
      <V c="wg-fill">
        {/* the app lets this line shrink to fit a small tile */}
        <Label s={9}>{now.greeting}</Label>
        <Sp />
        <Num s={22}>{now.time}</Num>
        <Cap>Sun 11</Cap>
      </V>
    );
  }
  if (size === "m") {
    return (
      <V c="wg-fill">
        <H g={6}>
          <Label>{now.greeting}</Label>
          <Sp />
          <WeatherInline />
        </H>
        <Sp />
        <H g={6} c="wg-h--base">
          <Num s={28}>{now.time}</Num>
          <Sp />
          <Cap s={11}>Sun, 11 Oct</Cap>
        </H>
      </V>
    );
  }
  return (
    <V c="wg-fill">
      <Label s={12}>{now.greeting}</Label>
      <H g={4} c="wg-h--base wg-fit">
        <Num s={38}>{now.time}</Num>
        <T s={11} c="wg-t--sb wg-t--2">{now.meridiem}</T>
      </H>
      <Cap s={12}>Sunday, 11 October</Cap>
      <Sp />
      <H g={6}>
        <Glyph n="cloudSun" s={25} />
        <Num s={20}>{weather.temp}</Num>
        <Cap s={11}>{weather.condition}</Cap>
      </H>
    </V>
  );
}

/* --- Now Playing ------------------------------------------------------ */

function Music() {
  return (
    <H g={10} c="wg-fill">
      <span className="wg-art" style={{ "--d": 52, "--r": 10 } as Vars} />
      <V c="wg-fill">
        <V g={1}>
          <T s={12} c="wg-t--sb">{track.title}</T>
          <T s={11} c="wg-t--3">{track.artist}</T>
        </V>
        <Sp />
        <H g={4} c="wg-fit wg-nudge">
          <CircleButton d={22}><Glyph n="backward" s={13} /></CircleButton>
          <CircleButton d={24} filled><Glyph n="pause" s={12} /></CircleButton>
          <CircleButton d={22}><Glyph n="forward" s={13} /></CircleButton>
        </H>
      </V>
    </H>
  );
}

/* --- Battery and Weather ---------------------------------------------- */

function Battery({ size }: { size: WidgetSize }) {
  // Status colours carry meaning here, so the ring keeps them.
  const ring = (side: number, lw: number) => (
    <Ring side={side} lw={lw} p={0.15} tint="critical">
      <Glyph n="laptop" s={side * 0.42} c="wg-g--2" />
    </Ring>
  );
  if (size === "s") {
    return (
      <V c="wg-fill">
        {ring(30, 4)}
        <Sp />
        <Num s={22}>15%</Num>
      </V>
    );
  }
  if (size === "m") {
    return (
      <H g={12} c="wg-fill">
        {ring(48, 5)}
        <V>
          <Num s={26}>15%</Num>
          <Cap s={11}>Low Power</Cap>
        </V>
      </H>
    );
  }
  return (
    <V c="wg-fill">
      {ring(58, 6)}
      <Sp />
      <Num s={38}>15%</Num>
      <T s={13} c="wg-t--md wg-t--2">Low Power</T>
      <Cap s={11}>Capacity: 96%</Cap>
    </V>
  );
}

/** The hour-by-hour strip, as in Apple's Weather widget. */
function HourStrip() {
  return (
    <span className="wg-hours">
      {hours.map((hour) => (
        <span key={hour.time}>
          <Cap s={8}>{hour.time}</Cap>
          <Glyph n={hour.glyph} s={13} />
          <T s={10} c="wg-t--sb">{hour.temp}</T>
        </span>
      ))}
    </span>
  );
}

function Weather({ size }: { size: WidgetSize }) {
  const current = (
    <V c={size === "m" ? "wg-col58" : "wg-fill"}>
      <Glyph n="cloudSun" s={size === "m" ? 17 : 20} />
      <Sp />
      <Num s={24}>{weather.temp}</Num>
      <Cap s={size === "m" ? 8 : 10}>{weather.condition}</Cap>
    </V>
  );
  if (size === "s") return current;
  return (
    <H g={8} c="wg-fill wg-h--stretch">
      {current}
      <HourStrip />
    </H>
  );
}

/* --- Calendar ---------------------------------------------------------- */

function EventRow({ event, s }: { event: (typeof events)[number]; s: number }) {
  return (
    <H g={6}>
      <i className="wg-event" data-tint={event.tint} />
      <V c="wg-fill">
        <T s={s} c="wg-t--md">{event.title}</T>
        <T s={s - 2} c="wg-t--3">{event.time}</T>
      </V>
    </H>
  );
}

function Calendar({ size }: { size: WidgetSize }) {
  if (size === "s") {
    return (
      <V c="wg-fill">
        <V c="wg-tight">
          <Label>Sun</Label>
          <Num s={24}>11</Num>
        </V>
        <Sp />
        <H g={4}>
          <i className="wg-dot" data-tint={events[0].tint} />
          <T c="wg-t--md wg-t--2">{events[0].title}</T>
        </H>
      </V>
    );
  }
  if (size === "m") {
    return (
      <H g={10} c="wg-fill wg-h--top">
        <V c="wg-tight">
          <Label>Sun</Label>
          <Num s={28}>11</Num>
        </V>
        <V g={5} c="wg-fill">
          {events.slice(0, 2).map((e) => (
            <EventRow key={e.title} event={e} s={11} />
          ))}
        </V>
      </H>
    );
  }
  return (
    <V g={6} c="wg-fill">
      <H g={5} c="wg-h--base">
        <Num s={24}>11</Num>
        <Label s={12}>Sunday</Label>
      </H>
      {events.map((e) => (
        <EventRow key={e.title} event={e} s={12} />
      ))}
    </V>
  );
}

/* --- Reminders --------------------------------------------------------- */

function ListBadge({ d }: { d: number }) {
  return (
    <span className="wg-badge wg-badge--round" style={{ "--d": d } as Vars}>
      <Glyph n="list" s={d * 0.56} />
    </span>
  );
}

function ReminderRow({ title, s, lines = 1 }: { title: string; s: number; lines?: number }) {
  return (
    <H g={6} c="wg-h--top">
      <i className="wg-check" style={{ "--d": s + 2 } as Vars} />
      <T s={s} c={lines > 1 ? "wg-t--lines2" : ""}>{title}</T>
    </H>
  );
}

function Reminders({ size }: { size: WidgetSize }) {
  const count = reminders.length + 1;
  if (size === "s") {
    return (
      <V g={4} c="wg-fill">
        <H c="wg-h--top">
          <ListBadge d={20} />
          <Sp />
          <Num s={20}>{count}</Num>
        </H>
        <Sp />
        <ReminderRow title={reminders[0]} s={10} lines={2} />
      </V>
    );
  }
  if (size === "m") {
    return (
      <H g={10} c="wg-fill wg-h--top">
        <V c="wg-tall">
          <ListBadge d={22} />
          <Sp />
          <Num s={22}>{count}</Num>
        </V>
        <V g={5} c="wg-fill">
          <Label s={11}>Reminders</Label>
          {reminders.slice(0, 2).map((r) => (
            <ReminderRow key={r} title={r} s={11} />
          ))}
        </V>
      </H>
    );
  }
  return (
    <V g={7} c="wg-fill">
      <H c="wg-h--top">
        <ListBadge d={26} />
        <Sp />
        <Num s={28}>{count}</Num>
      </H>
      <Label s={13}>Reminders</Label>
      {reminders.map((r) => (
        <ReminderRow key={r} title={r} s={12} />
      ))}
    </V>
  );
}

/* --- System Stats ------------------------------------------------------- */

function Memory({ size }: { size: WidgetSize }) {
  const ring = (side: number, lw: number) => (
    <Ring side={side} lw={lw} p={0.68}>
      <Glyph n="memory" s={side * 0.46} c="wg-g--2" />
    </Ring>
  );
  if (size === "s") {
    return (
      <V c="wg-fill">
        {ring(30, 4)}
        <Sp />
        <Num s={22}>11 GB</Num>
      </V>
    );
  }
  if (size === "m") {
    return (
      <H g={10} c="wg-fill">
        {ring(44, 5)}
        <V g={1} c="wg-grow">
          <Label>Memory</Label>
          <Num s={15}>10.9 / 16 GB</Num>
          <Cap>Uptime: 58h 44m</Cap>
        </V>
      </H>
    );
  }
  return (
    <V c="wg-fill">
      {ring(58, 6)}
      <Sp />
      <Label s={12}>Memory</Label>
      <Num s={22}>10.9 / 16 GB</Num>
      <Cap s={11}>Uptime: 58h 44m</Cap>
    </V>
  );
}

/* --- Timer / Focus ------------------------------------------------------ */

function Timer({ size }: { size: WidgetSize }) {
  const progress = 0.42;
  const ring = (side: number, lw: number) => (
    <Ring side={side} lw={lw} p={progress}>
      <Glyph n="pause" s={side * 0.4} />
    </Ring>
  );
  if (size === "s") {
    return (
      <V c="wg-fill">
        {ring(30, 4)}
        <Sp />
        <Num s={20}>14:32</Num>
      </V>
    );
  }
  if (size === "m") {
    return (
      <H g={12} c="wg-fill">
        {ring(48, 5)}
        <V c="wg-grow">
          <Label>Focus</Label>
          <Num s={26}>14:32</Num>
        </V>
        <span className="wg-corner">
          <CircleButton d={22}><Glyph n="reset" s={12} /></CircleButton>
        </span>
      </H>
    );
  }
  return (
    <V c="wg-fill">
      <H c="wg-h--top">
        {ring(58, 6)}
        <Sp />
        <CircleButton d={28}><Glyph n="reset" s={15} /></CircleButton>
      </H>
      <Sp />
      <Label s={12}>Focus</Label>
      <Num s={38}>14:32</Num>
      <span className="wg-pad-top">
        <Bar p={progress} h={5} />
      </span>
    </V>
  );
}

/* --- Clipboard ---------------------------------------------------------- */

function ClipCell({ clip, compact }: { clip: (typeof clips)[number]; compact?: boolean }) {
  if (clip.kind === "color") {
    return (
      <span className="wg-clip" style={{ background: clip.text }}>
        {!compact && <T s={8} c="wg-t--mono wg-t--bold">{clip.text}</T>}
        {!compact && <span className="wg-clip__age">{clip.age}</span>}
      </span>
    );
  }
  return (
    <span className="wg-clip">
      {!compact && <Glyph n={clip.kind === "link" ? "link" : "doc"} s={13} c="wg-g--3" />}
      <T s={9} c="wg-t--lines2">{clip.text}</T>
      {!compact && <span className="wg-clip__age">{clip.age}</span>}
    </span>
  );
}

function ClipPills() {
  return (
    <span className="wg-pills">
      <i data-on="true">All 5</i>
      <i>Texts 2</i>
      <i>Links 1</i>
      <i>Colors 1</i>
      <i>Images 1</i>
    </span>
  );
}

function Clipboard({ size }: { size: WidgetSize }) {
  if (size === "s") {
    return (
      <V g={4} c="wg-fill">
        <H>
          <Glyph n="copy" s={16} />
          <Sp />
          <Cap s={11}>5</Cap>
        </H>
        <Sp />
        <span className="wg-clips wg-clips--one">
          <ClipCell clip={clips[0]} compact />
        </span>
      </V>
    );
  }
  if (size === "m") {
    return (
      <V g={5} c="wg-fill">
        <ClipPills />
        <span className="wg-clips wg-clips--row">
          {clips.map((clip) => (
            <ClipCell key={clip.text} clip={clip} compact />
          ))}
        </span>
      </V>
    );
  }
  return (
    <V g={6} c="wg-fill">
      <ClipPills />
      <span className="wg-clips wg-clips--grid">
        {clips.map((clip) => (
          <ClipCell key={clip.text} clip={clip} />
        ))}
      </span>
    </V>
  );
}

/* --- Transcription ------------------------------------------------------ */

function Waveform({ bars, h }: { bars: number; h: number }) {
  return (
    <span className="wg-wave" style={{ "--d": h } as Vars}>
      {levels.slice(0, bars).map((level, i) => (
        <i key={i} style={{ blockSize: `${level * 10}%` }} />
      ))}
    </span>
  );
}

function TranscribeHeader() {
  return (
    <H g={5}>
      <Glyph n="wave" s={13} c="wg-g--critical" />
      <T s={11} c="wg-t--sb">Transcribe</T>
      <Sp />
      <T s={10} c="wg-t--mono wg-t--3">0:42</T>
    </H>
  );
}

function TranscribeButtons({ h }: { h: number }) {
  return (
    <span className="wg-actions" style={{ "--d": h } as Vars}>
      <i data-kind="stop"><Glyph n="stop" s={12} />Stop</i>
      <i><Glyph n="copy" s={13} />Copy</i>
    </span>
  );
}

function Transcribe({ size }: { size: WidgetSize }) {
  if (size === "s") {
    return (
      <V c="wg-fill">
        <span className="wg-rec"><Glyph n="stop" s={13} /></span>
        <Sp />
        <T s={11} c="wg-t--sb">Transcribe</T>
        <T s={10} c="wg-t--mono wg-t--critical">0:42</T>
      </V>
    );
  }
  if (size === "m") {
    return (
      <V c="wg-fill">
        <TranscribeHeader />
        <Sp />
        <Waveform bars={30} h={12} />
        <Sp />
        <TranscribeButtons h={22} />
      </V>
    );
  }
  return (
    <V g={6} c="wg-fill">
      <TranscribeHeader />
      <Waveform bars={34} h={32} />
      <T s={10} c="wg-t--2 wg-t--lines3">
        So the main thing I wanted to cover today is the rollout plan for next
        week and who owns each part of it
      </T>
      <Sp />
      <TranscribeButtons h={26} />
    </V>
  );
}

/* --- AI Usage ----------------------------------------------------------- */

function AIBadge() {
  return (
    <span className="wg-badge" style={{ "--d": 20 } as Vars}>
      <Glyph n="chip" s={13} />
    </span>
  );
}

function AIHeader() {
  return (
    <H g={6}>
      <AIBadge />
      <V c="wg-grow">
        <T s={11} c="wg-t--sb">Claude Opus 5.5</T>
        <Cap s={9}>Claude Code</Cap>
      </V>
      <i className="wg-dot wg-dot--live" />
    </H>
  );
}

/** `s` is the figure size: the large tile's narrower cells take a point off. */
function AIStats({ s = 13 }: { s?: number }) {
  const cells = [
    ["3.2M", "tokens"],
    ["13", "turns"],
    ["3:36:42", "elapsed"],
  ];
  return (
    <span className="wg-stats">
      {cells.map(([value, label]) => (
        <span key={label}>
          <T s={s} c="wg-t--sb">{value}</T>
          <Cap s={8}>{label}</Cap>
        </span>
      ))}
    </span>
  );
}

function AIUsage({ size }: { size: WidgetSize }) {
  if (size === "s") {
    return (
      <V c="wg-fill">
        <AIBadge />
        <Sp />
        <Num s={22}>3.2M</Num>
        <Cap>tokens</Cap>
      </V>
    );
  }
  if (size === "m") {
    return (
      <V c="wg-fill">
        <AIHeader />
        <Sp />
        <AIStats />
      </V>
    );
  }
  return (
    <V c="wg-fill">
      <AIHeader />
      <Sp />
      <AIStats s={12} />
      <Sp />
      <V g={5} c="wg-wide">
        {limits.map((limit) => (
          <V g={2} key={limit.label} c="wg-wide">
            <H g={4}>
              <T s={8} c="wg-t--md wg-t--3">{limit.label}</T>
              <Sp />
              <T s={8} c="wg-t--md wg-t--3">{limit.detail}</T>
            </H>
            <Bar p={limit.p} h={3} />
          </V>
        ))}
      </V>
    </V>
  );
}

/* --- Browser Tabs -------------------------------------------------------- */

function BrowserTabs() {
  return (
    <V c="wg-fill">
      <H c="wg-h--top">
        <span className="wg-badge" style={{ "--d": 20 } as Vars}>
          <Glyph n="compass" s={13} />
        </span>
        <Sp />
        <span className="wg-refresh"><Glyph n="refresh" s={11} c="wg-g--3" /></span>
      </H>
      <Sp />
      <Num s={22}>12</Num>
      <Cap>Safari tabs</Cap>
    </V>
  );
}

/* --- the tile ------------------------------------------------------------ */

function Content({ kind, size }: { kind: WidgetKind; size: WidgetSize }) {
  switch (kind) {
    case "timeWeather": return <TimeWeather size={size} />;
    case "music":       return <Music />;
    case "battery":     return <Battery size={size} />;
    case "weather":     return <Weather size={size} />;
    case "calendar":    return <Calendar size={size} />;
    case "reminders":   return <Reminders size={size} />;
    case "memory":      return <Memory size={size} />;
    case "timer":       return <Timer size={size} />;
    case "clipboard":   return <Clipboard size={size} />;
    case "transcribe":  return <Transcribe size={size} />;
    case "aiUsage":     return <AIUsage size={size} />;
    case "browserTabs": return <BrowserTabs />;
  }
}

/** One widget on the notch grid: small 1×1, medium 2×1, large 2×2. */
export function WidgetTile({
  kind,
  size,
  extra,
}: {
  kind: WidgetKind;
  size: WidgetSize;
  /** dropped first when the grid has fewer columns to offer */
  extra?: boolean;
}) {
  return (
    <div className="wg" data-kind={kind} data-size={size} data-extra={extra}>
      <Content kind={kind} size={size} />
    </div>
  );
}

/* --- the open notch: header row, then the tab under it ------------------ */

export type NotchTab = "home" | "shelf" | "widgets";

const tabs: { id: string; icon: string; s: number }[] = [
  { id: "home", icon: "house", s: 17 },
  { id: "shelf", icon: "tray", s: 17 },
  { id: "clipboard", icon: "clipboard", s: 17 },
  { id: "widgets", icon: "group", s: 17 },
];

const labels: Record<NotchTab, string> = {
  home:
    "The open notch on its Home tab: what's playing, with artwork, progress and transport controls, beside this week's calendar and today's events.",
  shelf:
    "The open notch on its Shelf tab: an AirDrop target beside an empty shelf that reads Drop files here.",
  widgets:
    "The open notch on its Widgets tab: reminders, battery, AI usage, Safari tabs, memory in use, the weather and the time.",
};

/** A dashed outline with round caps, which a CSS border can't draw. */
function Dashes() {
  return (
    <svg className="nb-dashes" aria-hidden="true" focusable="false">
      <rect width="100%" height="100%" rx="18" />
    </svg>
  );
}

/* --- Home: what's playing, beside the calendar --------------------------
   NotchHomeView.swift: a Now Playing card that takes the room, and a
   232pt calendar card. */

const week = [
  ["Wed", "07"],
  ["Thu", "08"],
  ["Fri", "09"],
  ["Sat", "10"],
  ["Sun", "11"],
  ["Mon", "12"],
  ["Tue", "13"],
  ["Wed", "14"],
];

const agenda = [
  { title: "Supplier call", place: "Zoom", start: "10:00 AM", end: "10:30 AM" },
  { title: "Quarterly planning", place: "Boardroom", start: "11:30 AM", end: "12:30 PM" },
  { title: "Dinner", place: "Marina", start: "7:30 PM", end: "9:00 PM" },
];

function HomeTab() {
  return (
    <div className="nb__body nb-home">
      <div className="nb-card nb-play">
        <span className="nb-play__art">
          <span className="nb-play__app"><Glyph n="note" s={14} /></span>
        </span>
        <div className="nb-play__info">
          <span className="nb-play__title">{track.title}</span>
          <span className="nb-play__artist">{track.artist}</span>
          <span className="nb-play__time">
            <span>1:12</span>
            <span className="wg-bar" style={{ "--d": 4 } as Vars}>
              <i style={{ inlineSize: "35%" }} />
            </span>
            <span>3:26</span>
          </span>
          <span className="nb-play__controls">
            <CircleButton d={32}><Glyph n="heart" s={17} c="wg-g--2" /></CircleButton>
            <CircleButton d={32}><Glyph n="backward" s={20} /></CircleButton>
            <CircleButton d={44} filled><Glyph n="pause" s={19} /></CircleButton>
            <CircleButton d={32}><Glyph n="forward" s={20} /></CircleButton>
            <CircleButton d={32}><Glyph n="speaker" s={18} /></CircleButton>
          </span>
        </div>
      </div>

      <div className="nb-card nb-cal">
        <div className="nb-cal__head">
          <span className="nb-cal__month">October 2026</span>
          <span className="nb-cal__toggle">
            <Glyph n="calendar" s={11} />
            <i />
            <Glyph n="checkCircle" s={11} c="wg-g--3" />
          </span>
        </div>
        <div className="nb-cal__days">
          {week.map(([day, date]) => (
            <span key={date} data-on={date === "11"}>
              <small>{day}</small>
              <b>{date}</b>
            </span>
          ))}
        </div>
        <div className="nb-cal__events">
          {agenda.map((event) => (
            <div key={event.title} className="nb-cal__event">
              <span className="nb-cal__what">
                <b>{event.title}</b>
                <small>{event.place}</small>
              </span>
              <span className="nb-cal__when">
                <b>{event.start}</b>
                <small>{event.end}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShelfTab() {
  return (
    <div className="nb__body nb-shelf">
      <div className="nb-share">
        <Dashes />
        <span className="nb-share__icon"><Glyph n="share" s={20} /></span>
        <span className="nb-share__name">AirDrop</span>
      </div>
      <div className="nb-drop">
        <Dashes />
        <Glyph n="trayDown" s={24} />
        <span className="nb-drop__label">Drop files here</span>
      </div>
    </div>
  );
}

function WidgetsTab() {
  return (
    <div className="nb__body nb__grid">
      <WidgetTile kind="reminders" size="s" extra />
      <WidgetTile kind="battery" size="m" />
      <WidgetTile kind="aiUsage" size="l" />
      <WidgetTile kind="browserTabs" size="s" extra />
      <WidgetTile kind="memory" size="s" extra />
      <WidgetTile kind="weather" size="m" />
      <WidgetTile kind="timeWeather" size="s" extra />
    </div>
  );
}

export function OpenNotch({ tab }: { tab: NotchTab }) {
  return (
    <div className="nb" role="img" aria-label={labels[tab]}>
      <div className="nb__head">
        <div className="nb__tabs">
          {tabs.map((t) => (
            <span key={t.id} className="nb__tab" data-on={t.id === tab}>
              <Glyph n={t.icon} s={t.s} />
            </span>
          ))}
        </div>
        <div className="nb__tools">
          {tab === "widgets" && (
            <span className="nb__tool"><Glyph n="pencil" s={15} /></span>
          )}
          <span className="nb__tool"><Glyph n="webcam" s={16} /></span>
          <span className="nb__tool"><Glyph n="gear" s={16} /></span>
        </div>
      </div>

      {tab === "home" && <HomeTab />}
      {tab === "shelf" && <ShelfTab />}
      {tab === "widgets" && <WidgetsTab />}
    </div>
  );
}
