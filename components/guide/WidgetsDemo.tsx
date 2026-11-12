"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import Icon from "@/components/Icon";
import Notch from "./Notch";

type WId = "timeWeather" | "reminders" | "calendar" | "battery" | "clock" | "weather" | "music" | "timer" | "notes" | "stayAwake" | "batteries" | "system" | "builds" | "colour";
type Size = "s" | "m" | "l";
type Item = { id: WId; size: Size };

/* The app's grid: square cells, six across and two down. Small is one cell,
   medium two across, large two each way, and a page is packed in order, each
   widget into the first free slot scanning column by column (WidgetModels.swift).
   The Day page packs to exactly the layout in the screenshots. */
const COLS = 6;
const ROWS = 2;
const span: Record<Size, [number, number]> = { s: [1, 1], m: [2, 1], l: [2, 2] };

const startPages: { id: string; label: string; items: Item[] }[] = [
  {
    id: "day",
    label: "Day",
    items: [
      { id: "timeWeather", size: "m" },
      { id: "reminders", size: "m" },
      { id: "calendar", size: "l" },
      { id: "battery", size: "s" },
      { id: "clock", size: "s" },
      { id: "weather", size: "s" },
    ],
  },
  {
    id: "focus",
    label: "Focus",
    items: [
      { id: "music", size: "m" },
      { id: "timer", size: "m" },
      { id: "notes", size: "l" },
      { id: "stayAwake", size: "s" },
      { id: "batteries", size: "s" },
    ],
  },
  {
    id: "work",
    label: "Work",
    items: [
      { id: "system", size: "l" },
      { id: "builds", size: "l" },
      { id: "colour", size: "l" },
    ],
  },
];

const names: Record<WId, string> = {
  timeWeather: "Time & Weather", reminders: "Reminders", calendar: "Calendar", battery: "Battery", clock: "Clock",
  weather: "Weather", music: "Now Playing", timer: "Timer", notes: "Notes", stayAwake: "Stay Awake", batteries: "Batteries",
  system: "System Monitor", builds: "Builds", colour: "Colour Picker",
};
type Device = { name: string; icon: string; level: number; charging?: boolean } | null;
const devices: Device[] = [
  { name: "MacBook Pro", icon: "laptop", level: 98 },
  { name: "Magic Keyboard", icon: "keyboard", level: 88 },
  { name: "Magic Mouse", icon: "mouse", level: 62, charging: true },
  null,
];
type Note = { title: string; preview: string; pinned?: boolean };
const startNotes: Note[] = [
  { title: "Launch day checklist", preview: "• Record the walkthrough video", pinned: true },
  { title: "Wi-Fi at the studio", preview: "Network: Studio-5G", pinned: true },
  { title: "Standup", preview: "Shipped the colour picker. Next: Builds" },
  { title: "Gift ideas", preview: "Noise-cancelling headphones" },
  { title: "Books to read", preview: "The Design of Everyday Things" },
];
type Run = { repo: string; branch: string; status: "success" | "failure" | "running"; local?: boolean };
const swatches = ["#FF6B4A", "#F5B45C", "#F7DD72", "#8CCB88", "#6CC8C0", "#5B9BDE", "#B78CF0", "#F28CB8"];
const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };
const sizeName: Record<Size, string> = { s: "small", m: "medium", l: "large" };

type Placed = Item & { col: number; row: number };

/* Packs a page; null when the widgets no longer fit on it. */
function pack(items: Item[]): Placed[] | null {
  const used = Array.from({ length: COLS }, () => Array<boolean>(ROWS).fill(false));
  const out: Placed[] = [];
  for (const it of items) {
    const [w, h] = span[it.size];
    let placed = false;
    for (let c = 0; c <= COLS - w && !placed; c++) {
      for (let r = 0; r <= ROWS - h && !placed; r++) {
        let free = true;
        for (let dc = 0; dc < w; dc++) for (let dr = 0; dr < h; dr++) if (used[c + dc][r + dr]) free = false;
        if (!free) continue;
        for (let dc = 0; dc < w; dc++) for (let dr = 0; dr < h; dr++) used[c + dc][r + dr] = true;
        out.push({ ...it, col: c + 1, row: r + 1 });
        placed = true;
      }
    }
    if (!placed) return null;
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* Widgets: two pages of working widgets laid out like the app's. The pencil
   puts them in edit mode: drag a widget to move it, pull its bottom-right
   corner to resize it, or remove it and add it back. The dots switch pages. */
export default function WidgetsDemo() {
  const [pages, setPages] = useState(startPages);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(false);
  const [gone, setGone] = useState<Record<string, Item[]>>({});
  const [said, setSaid] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [awake, setAwake] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState<number[]>([]);
  const [notes, setNotes] = useState(startNotes);
  const [copied, setCopied] = useState<string | null>(null);
  const [colour, setColour] = useState(swatches[0]);
  const [recent, setRecent] = useState(swatches.slice(0, 6));
  const [built, setBuilt] = useState(false);
  const [dragging, setDragging] = useState<WId | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const cells = useRef<Partial<Record<WId, HTMLLIElement | null>>>({});
  const before = useRef<Partial<Record<WId, { x: number; y: number }>>>({});
  const grab = useRef<{ id: WId; gx: number; gy: number; px: number; py: number; last: WId | null } | null>(null);
  const sizing = useRef<{ id: WId; x: number; y: number; w: number; h: number; step: number; moved: boolean } | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  // The run that's going when the page opens passes a little later.
  useEffect(() => {
    const t = window.setTimeout(() => setBuilt(true), 9000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), 1400);
    return () => window.clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [running]);

  const current = pages[page];
  const placed = pack(current.items) ?? [];
  const layoutKey = placed.map((p) => `${p.id}${p.size}${p.col}${p.row}`).join();

  // When the layout changes, the widgets that moved glide from where they were.
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const p of placed) {
      const el = cells.current[p.id];
      if (!el) continue;
      const was = before.current[p.id];
      const x = el.offsetLeft;
      const y = el.offsetTop;
      if (was && p.id !== grab.current?.id && !reduce && (was.x !== x || was.y !== y)) {
        el.animate([{ transform: `translate(${was.x - x}px, ${was.y - y}px)` }, { transform: "none" }], { duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
      }
      before.current[p.id] = { x, y };
    }
    follow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey, page]);

  const setItems = (items: Item[]) => {
    if (!pack(items)) return false;
    setPages((ps) => ps.map((p, i) => (i === page ? { ...p, items } : p)));
    return true;
  };

  // Keeps the widget being moved under the pointer, even after the grid reflows beneath it.
  const follow = () => {
    const gr = grab.current;
    const el = gr && cells.current[gr.id];
    if (!gr || !el || !grid.current) return;
    const g = grid.current.getBoundingClientRect();
    el.style.transform = `translate(${gr.px - g.left - el.offsetLeft - gr.gx}px, ${gr.py - g.top - el.offsetTop - gr.gy}px)`;
  };

  // Moving: the widget follows the pointer, and the others make room as it passes over them.
  const moveStart = (id: WId) => (e: ReactPointerEvent<HTMLLIElement>) => {
    if (!editing || e.button !== 0 || (e.target as HTMLElement).closest("button, textarea")) return;
    const el = e.currentTarget;
    const g = grid.current!.getBoundingClientRect();
    el.setPointerCapture(e.pointerId);
    grab.current = { id, gx: e.clientX - g.left - el.offsetLeft, gy: e.clientY - g.top - el.offsetTop, px: e.clientX, py: e.clientY, last: null };
    setDragging(id);
  };
  const moveOn = (e: ReactPointerEvent<HTMLLIElement>) => {
    const gr = grab.current;
    if (!gr) return;
    gr.px = e.clientX;
    gr.py = e.clientY;
    follow();
    const target = placed.find((p) => {
      if (p.id === gr.id) return false;
      const r = cells.current[p.id]?.getBoundingClientRect();
      return r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (!target || target.id === gr.last) return;
    gr.last = target.id;
    const items = current.items.filter((x) => x.id !== gr.id);
    const at = items.findIndex((x) => x.id === target.id);
    const from = current.items.findIndex((x) => x.id === gr.id);
    const to = current.items.findIndex((x) => x.id === target.id);
    items.splice(from < to ? at + 1 : at, 0, current.items[from]);
    setItems(items);
  };
  const moveEnd = (e: ReactPointerEvent<HTMLLIElement>) => {
    if (!grab.current) return;
    const el = e.currentTarget;
    const t = el.style.transform;
    el.style.transform = "";
    if (t && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.animate([{ transform: t }, { transform: "none" }], { duration: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    grab.current = null;
    setDragging(null);
    setSaid("Moved.");
  };

  // Resizing: pull the corner a cell's width or height and the widget steps up or down a size.
  const resize = (id: WId, to: Size) => {
    if (current.items.find((x) => x.id === id)?.size === to) return;
    if (setItems(current.items.map((x) => (x.id === id ? { ...x, size: to } : x)))) setSaid(`${names[id]} is ${sizeName[to]} now.`);
    else setSaid(`${names[id]} won’t fit on this page at that size.`);
  };
  const sizeStart = (id: WId, size: Size) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const cell = (grid.current!.clientHeight - 8) / 2;
    const [w, h] = span[size];
    sizing.current = { id, x: e.clientX, y: e.clientY, w, h, step: cell + 8, moved: false };
  };
  const sizeMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const s = sizing.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.hypot(dx, dy) > 4) s.moved = true;
    const cols = Math.max(1, Math.min(2, Math.round(s.w + dx / s.step)));
    const rows = Math.max(1, Math.min(2, Math.round(s.h + dy / s.step)));
    resize(s.id, rows === 2 ? "l" : cols === 2 ? "m" : "s");
  };
  const sizeEnd = (id: WId, size: Size) => () => {
    const s = sizing.current;
    sizing.current = null;
    // A tap on the corner (or Enter) steps through the sizes instead.
    if (s && !s.moved) resize(id, size === "s" ? "m" : size === "m" ? "l" : "s");
  };

  const remove = (id: WId) => {
    const it = current.items.find((x) => x.id === id)!;
    setItems(current.items.filter((x) => x.id !== id));
    setGone((g) => ({ ...g, [current.id]: [...(g[current.id] ?? []), it] }));
  };
  const addBack = (it: Item) => {
    const shrink: Size[] = [it.size, "m", "s"];
    const fit = shrink.find((sz) => pack([...current.items, { ...it, size: sz }]));
    if (!fit) {
      setSaid(`There’s no room for ${names[it.id]} on this page.`);
      return;
    }
    setItems([...current.items, { ...it, size: fit }]);
    setGone((g) => ({ ...g, [current.id]: (g[current.id] ?? []).filter((x) => x.id !== it.id) }));
  };

  const d = now ?? new Date(2026, 9, 25, 10, 25);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const short = d.toLocaleDateString("en-GB", { weekday: "short" });
  const dayMonth = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const hello = d.getHours() < 12 ? "good morning" : d.getHours() < 18 ? "good afternoon" : "good evening";

  const reminders = ["Reply to the App Review team", "Send press kit to Ana", "Record the launch reel", "Book the studio"];
  const open = reminders.filter((_, i) => !done.includes(i));

  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
  };
  const choose = (hex: string) => {
    const h = hex.toUpperCase();
    setColour(h);
    setRecent((r) => [h, ...r.filter((x) => x !== h)].slice(0, 6));
  };
  // The real eyedropper where the browser has one; elsewhere the next sample colour stands in for the screen.
  const pick = async () => {
    const ED = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
    if (ED) {
      try {
        choose((await new ED().open()).sRGBHex);
      } catch {}
      return;
    }
    choose(swatches[(swatches.indexOf(colour) + 1) % swatches.length]);
  };

  // Live-looking readings: they drift with the clock, like the app's once-a-second samples.
  const sec = d.getSeconds();
  const cpu = 9 + ((sec * 37) % 17);
  const gpu = (sec * 13) % 7;
  const net = (((sec * 53) % 29) / 10 + 0.4).toFixed(1);
  const disk = (((sec * 31) % 47) / 10 + 1.2).toFixed(1);
  const readings = [
    { k: "cpu", label: "CPU", value: `${cpu}%`, icon: "cpu" },
    { k: "gpu", label: "GPU", value: `${gpu}%` },
    { k: "mem", label: "Memory", value: "11.7 GB", icon: "memory" },
    { k: "swap", label: "Swap", value: "2.0 GB" },
    { k: "disk", label: "Storage", value: "155.8 GB free" },
    { k: "net", label: "Network", value: `↓ ${net} MB/s`, icon: "globe" },
    { k: "io", label: "Disk I/O", value: `R ${disk} MB/s` },
    { k: "pwr", label: "Power", value: "90%", icon: "battery" },
  ];

  const runs: Run[] = [
    { repo: "eyebrow-website", branch: "main", status: built ? "success" : "running" },
    { repo: "billing-api", branch: "release/2.4", status: "failure" },
    { repo: "design-tokens", branch: "main", status: "success" },
    { repo: "localhost:5173", branch: "Vite", status: "success", local: true },
  ];
  const failing = runs.filter((r) => r.status === "failure").length;
  const buildSummary = failing ? `${failing} failing` : runs.some((r) => r.status === "running") ? "Running" : "All green";
  const rgb = hexToRgb(colour);

  const tile = (w: WId) => {
    switch (w) {
      case "timeWeather":
        return (
          <div className="wd wd-tw">
            <p className="wd-row"><span className="wd-grad wd-x-s">{hello}</span><span className="wd-temp"><Icon name="sun" size={13} /> 29°</span></p>
            <p className="wd-row wd-row--end"><span className="wd-big num">{time}</span><span className="wd-sub wd-x-s">{short}, {dayMonth}</span></p>
          </div>
        );
      case "reminders":
        return (
          <div className="wd wd-rem">
            <div className="wd-rem__side">
              <span className="wd-rem__icon" aria-hidden="true"><Icon name="text" size={14} /></span>
              <span className="wd-big num">{open.length}</span>
            </div>
            <div className="wd-rem__list wd-x-s">
              <p className="wd-grad wd-title">Reminders</p>
              <ul>
                {reminders.map((r, i) => (done.includes(i) ? null : (
                  <li key={r}>
                    <button type="button" className="wd-tick" onClick={() => setDone((x) => [...x, i])} disabled={editing} aria-label={`Complete ${r}`} />
                    <span>{r}</span>
                  </li>
                )))}
              </ul>
              {open.length === 0 && <p className="wd-sub">All done</p>}
            </div>
          </div>
        );
      case "calendar":
        return (
          <div className="wd wd-cal">
            <p className="wd-cal__day"><span className="num">{d.getDate()}</span> <span className="wd-grad">{weekday}</span></p>
            <ul className="wd-events">
              <li style={{ "--c": "#4f8ef7" } as CSSProperties}><b>Design Review</b>10:50 AM</li>
              <li style={{ "--c": "#f0a347" } as CSSProperties}><b>Lunch with Sam</b>12:15 PM</li>
              <li style={{ "--c": "#4f8ef7" } as CSSProperties}><b>Ship 4.6 to App Store</b>1:45 PM</li>
            </ul>
          </div>
        );
      case "battery":
        return (
          <div className="wd wd-s">
            <span className="wd-ring" style={{ "--p": 0.82 } as CSSProperties} aria-hidden="true"><Icon name="display" size={13} /></span>
            <p className="wd-big num">82%</p>
          </div>
        );
      case "weather":
        return (
          <div className="wd wd-s">
            <Icon name="sun" size={18} />
            <p className="wd-big num">29°</p>
            <p className="wd-sub">Mostly Clear</p>
          </div>
        );
      case "clock":
        return (
          <div className="wd wd-s">
            <p className="wd-grad wd-title">{short}</p>
            <p className="wd-big num">{time}</p>
            <p className="wd-sub">{dayMonth}</p>
          </div>
        );
      case "music":
        return (
          <div className="wd wd-music">
            <span className="wd-art" aria-hidden="true" />
            <div className="wd-x-s">
              <p className="wd-title">Golden Hour Drive</p>
              <p className="wd-sub">Nova Lane</p>
              <button type="button" className="wd-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} disabled={editing}>
                <Icon name={playing ? "pause" : "play"} size={14} />
              </button>
            </div>
          </div>
        );
      case "timer":
        return (
          <div className="wd wd-timer">
            <div>
              <p className="wd-grad wd-title">Focus</p>
              <p className="wd-big num">{pad(Math.floor(left / 60))}:{pad(left % 60)}</p>
            </div>
            <div className="wd-actions">
              <button type="button" className="wd-chip" onClick={() => setRunning((r) => !r)} disabled={editing}>{running ? "Pause" : left < 25 * 60 ? "Resume" : "Start"}</button>
              <button type="button" className="wd-chip wd-chip--quiet wd-x-s" onClick={() => { setRunning(false); setLeft(25 * 60); }} disabled={editing}>Reset</button>
            </div>
          </div>
        );
      case "notes":
        // Pinned notes first; a click copies one, formatting and all.
        return (
          <div className="wd wd-notes">
            <div className="wd-head">
              <span className="wd-app wd-app--notes wd-only-s" aria-hidden="true"><Icon name="notes" size={15} /></span>
              <p className="wd-grad wd-title wd-x-s">Notes</p>
              <button type="button" className="wd-btn wd-btn--sm" onClick={() => setNotes((n) => [{ title: "New note", preview: "Bold, lists, links and images" }, ...n])} disabled={editing} aria-label="New note">
                <Icon name="plus" size={13} />
              </button>
            </div>
            <ul className="wd-notes__list wd-x-s">
              {notes.map((n, i) => (
                <li key={`${n.title}${i}`}>
                  <button type="button" onClick={() => copy(`note${i}`, `${n.title}\n${n.preview}`)} disabled={editing}>
                    <b>{n.pinned && <Icon name="pin" size={11} />}{n.title}</b>
                    <span>{copied === `note${i}` ? "Copied" : n.preview}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="wd-notes__count wd-sub">
              <span className="wd-grad wd-title wd-only-s">Notes<br /></span>
              {notes.length} notes
            </p>
          </div>
        );
      case "system":
        return (
          <div className="wd wd-sys">
            <p className="wd-grad wd-title wd-sys__title">System</p>
            <dl className="wd-sys__grid">
              {readings.map((r) => (
                <div key={r.k} data-k={r.k}>
                  <dt>{r.icon && <span className="wd-sys__icon" aria-hidden="true"><Icon name={r.icon} size={12} /></span>}<span className="wd-sys__label">{r.label}</span></dt>
                  <dd className="num">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      case "builds":
        return (
          <div className="wd wd-bld">
            <div className="wd-head">
              <span className="wd-app wd-app--builds wd-only-s" aria-hidden="true"><Icon name="hammer" size={15} /></span>
              <p className="wd-grad wd-title wd-x-s">Builds</p>
              <span className="wd-sub wd-x-s">{buildSummary}</span>
              <span className="wd-bld__badge wd-only-s" data-status={failing ? "failure" : "success"} aria-hidden="true"><Icon name={failing ? "close" : "check"} size={12} /></span>
            </div>
            <ul className="wd-bld__list wd-x-s">
              {runs.map((r) => (
                <li key={r.repo} data-status={r.status}>
                  <i aria-hidden="true" />
                  <b>{r.repo}</b>
                  <span>{r.branch}</span>
                  <span className="visually-hidden">{r.local ? "running locally" : r.status === "success" ? "passed" : r.status === "failure" ? "failed" : "running"}</span>
                </li>
              ))}
            </ul>
            <p className="wd-only-s wd-bld__foot"><span className="wd-grad wd-title">Builds</span><br /><span className="wd-sub">{buildSummary}</span></p>
          </div>
        );
      case "colour":
        return (
          <div className="wd wd-col">
            <span className="wd-col__swatch" style={{ background: colour }} aria-hidden="true" />
            <button type="button" className="wd-btn wd-btn--sm wd-col__pick" onClick={pick} disabled={editing} aria-label="Pick a colour from the screen">
              <Icon name="eyedropper" size={14} />
            </button>
            <div className="wd-col__text">
              <p className="wd-grad wd-title"><span className="wd-col__long">Colour picker</span><span className="wd-col__short">Colour</span></p>
              <button type="button" className="wd-col__hex num" onClick={() => copy("hex", colour)} disabled={editing} aria-label={`Copy ${colour}`}>
                {copied === "hex" ? "Copied" : colour}
              </button>
              <p className="wd-sub wd-col__rgb num">rgb({rgb.join(", ")})</p>
            </div>
            <ul className="wd-col__recent" aria-label="Recent colours">
              {recent.map((c) => (
                <li key={c}>
                  <button type="button" style={{ background: c }} onClick={() => choose(c)} disabled={editing} aria-label={`Use ${c}`} />
                </li>
              ))}
            </ul>
          </div>
        );
      case "batteries":
        // The app's Batteries widget: a ring per device, the Mac first; spare slots are bare tracks.
        return (
          <div className="wd wd-batt">
            <p className="wd-grad wd-title wd-batt__title">Batteries</p>
            <ul className="wd-batt__list">
              {devices.map((dev, i) => (
                <li key={i} className="wd-batt__dev" data-empty={dev ? undefined : "true"}>
                  <span className="wd-batt__ring" style={{ "--p": dev ? dev.level / 100 : 0 } as CSSProperties} data-charging={dev?.charging ? "true" : undefined} aria-hidden="true">
                    {dev && <Icon name={dev.icon} size={14} />}
                  </span>
                  {dev ? (
                    <>
                      <span className="wd-batt__name">{dev.name}</span>
                      <span className="wd-batt__pct num">{dev.level}%</span>
                    </>
                  ) : (
                    <span className="visually-hidden">Empty slot</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case "stayAwake":
        return (
          <div className="wd wd-s">
            <p className="wd-grad wd-title">Awake</p>
            <button type="button" className="wd-switch" role="switch" aria-checked={awake} onClick={() => setAwake((a) => !a)} disabled={editing}>
              <span className="visually-hidden">Stay Awake</span>
            </button>
            <p className="wd-sub">{awake ? "1 hour" : "Off"}</p>
          </div>
        );
    }
  };

  const away = editing ? gone[current.id] ?? [] : [];

  return (
    <div className="demo wg">
      <div className="wg-scroll">
        <Notch
          tab="widgets"
          label="Widgets, open in the notch"
          extra={
            <button type="button" className="nt__edit" aria-pressed={editing} onClick={() => { setEditing((e) => !e); setSaid(""); }}>
              <Icon name="pencil" size={15} />
              <span className="visually-hidden">Edit widgets</span>
              {editing && <span aria-hidden="true">Done</span>}
            </button>
          }
        >
          <div className="wg-stage">
            <ul ref={grid} className="wg-grid" data-editing={editing} aria-label={`${current.label} widgets`}>
              {placed.map((w) => {
                const [cols, rows] = span[w.size];
                return (
                  <li
                    key={w.id}
                    ref={(el) => {
                      cells.current[w.id] = el;
                    }}
                    className="wg-cell"
                    data-size={w.size}
                    data-dragging={dragging === w.id}
                    style={{ gridColumn: `${w.col} / span ${cols}`, gridRow: `${w.row} / span ${rows}` }}
                    onPointerDown={moveStart(w.id)}
                    onPointerMove={moveOn}
                    onPointerUp={moveEnd}
                    onPointerCancel={moveEnd}
                  >
                    {tile(w.id)}
                    {editing && (
                      <>
                        <button type="button" className="wg-remove" onClick={() => remove(w.id)} aria-label={`Remove ${names[w.id]}`}>
                          <Icon name="minus" size={12} />
                        </button>
                        <button
                          type="button"
                          className="wg-resize"
                          aria-label={`Resize ${names[w.id]}, ${sizeName[w.size]} now`}
                          onPointerDown={sizeStart(w.id, w.size)}
                          onPointerMove={sizeMove}
                          onPointerUp={sizeEnd(w.id, w.size)}
                          onPointerCancel={() => (sizing.current = null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              resize(w.id, w.size === "s" ? "m" : w.size === "m" ? "l" : "s");
                            }
                          }}
                        />
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="wg-pages" role="tablist" aria-label="Widget pages" aria-orientation="vertical">
              {pages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`${p.label} page`}
                  className="wg-dot"
                  onClick={() => setPage(i)}
                />
              ))}
            </div>
          </div>
          {away.length > 0 && (
            <div className="wg-shelf">
              {away.map((it) => (
                <button key={it.id} type="button" className="wg-add" onClick={() => addBack(it)}>
                  <Icon name="plus" size={13} /> {names[it.id]}
                </button>
              ))}
            </div>
          )}
        </Notch>
      </div>
      <p className="demo__said" aria-live="polite">
        {said && editing
          ? said
          : editing
            ? "Drag a widget to move it, pull its bottom-right corner to resize it, or remove it. Press Done when you’re finished."
            : "Press the pencil to move and resize widgets. Tick off a reminder, or switch pages with the dots on the right."}
      </p>
    </div>
  );
}
