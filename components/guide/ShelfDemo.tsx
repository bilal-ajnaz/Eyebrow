"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import Notch from "./Notch";

type Kind = "doc" | "image" | "text" | "deck" | "sheet";
/* A file lies on the demo's screen (x, y in % of it) or anywhere on the page (x, y in page px). */
type Spot = { on: "screen" | "page"; x: number; y: number; r: number };

/* Where each file starts, in % of the screen: strewn around the notch the way
   a desktop gets. A refresh puts them back here. */
const files: { id: string; name: string; kind: Kind; shelf?: boolean; at: Spot }[] = [
  { id: "plan", name: "Launch Plan.pdf", kind: "doc", shelf: true, at: { on: "screen", x: 20, y: 64, r: -4 } },
  { id: "art", name: "Hero Artwork.png", kind: "image", at: { on: "screen", x: 17, y: 30, r: -9 } },
  { id: "notes", name: "Release Notes.txt", kind: "text", at: { on: "screen", x: 83, y: 26, r: 7 } },
  { id: "deck", name: "Pitch Deck.key", kind: "deck", at: { on: "screen", x: 33, y: 60, r: 5 } },
  { id: "budget", name: "Budget.xlsx", kind: "sheet", at: { on: "screen", x: 72, y: 58, r: -6 } },
  { id: "press", name: "Press Kit.pdf", kind: "doc", at: { on: "screen", x: 52, y: 64, r: 3 } },
];

/* On a phone the screen is upright and the notch fills its top, so the pile sits below it. */
const narrowAt: Record<string, Spot> = {
  plan: { on: "screen", x: 50, y: 62, r: -3 },
  art: { on: "screen", x: 19, y: 60, r: -8 },
  notes: { on: "screen", x: 81, y: 62, r: 6 },
  deck: { on: "screen", x: 22, y: 86, r: 5 },
  budget: { on: "screen", x: 79, y: 86, r: -6 },
  press: { on: "screen", x: 50, y: 78, r: 3 },
};

type Id = string;
type Zone = "shelf" | "airdrop" | "screen" | "page";

function Thumb({ kind }: { kind: Kind }) {
  return <span className={`sh-thumb sh-thumb--${kind}`} aria-hidden="true"><i /><i /><i /></span>;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const tilt = () => Math.round(Math.random() * 12 - 6);

/* The Shelf: a screen with the notch at the top and files lying about. Drag
   one up into the Shelf, then drag it back out and drop it anywhere: on the
   screen, or anywhere else on this page. AirDrop sits beside the Shelf.
   Pointer events, so a mouse, a pen or a finger all work; a click (or Enter)
   moves a file without dragging. */
export default function ShelfDemo() {
  const [onShelf, setOnShelf] = useState<Id[]>(files.filter((f) => f.shelf).map((f) => f.id));
  const [spots, setSpots] = useState<Record<Id, Spot>>(() => Object.fromEntries(files.map((f) => [f.id, f.at])));
  // The drag lives in a ref and moves the ghost directly, so it keeps up with the pointer
  // without re-rendering the demo on every move; state changes only when it lifts or lands.
  const drag = useRef<{ id: Id; dx: number; dy: number; w: number; h: number; moved: boolean } | null>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const [lifted, setLifted] = useState<Id | null>(null);
  const [over, setOver] = useState<Zone | null>(null);
  const [said, setSaid] = useState("");
  const [mounted, setMounted] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const shelf = useRef<HTMLDivElement>(null);
  const air = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(max-width: 40rem)").matches) setSpots(narrowAt);
  }, []);

  const name = (id: Id) => files.find((f) => f.id === id)!.name;
  const inside = (el: HTMLElement | null, x: number, y: number) => {
    const r = el?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };
  const zoneAt = (x: number, y: number): Zone =>
    inside(air.current, x, y) ? "airdrop" : inside(shelf.current, x, y) ? "shelf" : inside(screen.current, x, y) ? "screen" : "page";

  const toShelf = (id: Id) => {
    setOnShelf((s) => (s.includes(id) ? s : [...s, id]));
    setSaid(`${name(id)} is on the Shelf.`);
  };
  const lay = (id: Id, spot: Spot) => {
    setOnShelf((s) => s.filter((x) => x !== id));
    setSpots((s) => ({ ...s, [id]: spot }));
    setSaid(spot.on === "page" ? `${name(id)} is lying on the page now.` : `${name(id)} is on the desktop.`);
  };

  const down = (id: Id) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    start.current = { x: e.clientX, y: e.clientY };
    drag.current = { id, dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, h: r.height, moved: false };
  };

  const pointer = useRef({ x: 0, y: 0 });
  const place = (x: number, y: number) => {
    pointer.current = { x, y };
    const d = drag.current;
    if (ghost.current && d) ghost.current.style.transform = `translate3d(${x - d.dx}px, ${y - d.dy}px, 0) rotate(-4deg) scale(1.06)`;
  };

  const moveDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 5) {
      d.moved = true;
      setLifted(d.id);
    }
    if (!d.moved) return;
    place(e.clientX, e.clientY);
    const z = zoneAt(e.clientX, e.clientY);
    setOver((o) => (o === z ? o : z));
  };

  const up = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = moveDone();
    if (!d) return;
    const { id } = d;
    if (!d.moved) {
      if (onShelf.includes(id)) lay(id, spots[id]);
      else toShelf(id);
    } else {
      const z = zoneAt(e.clientX, e.clientY);
      // Where the file's centre was let go.
      const cx = e.clientX - d.dx + d.w / 2;
      const cy = e.clientY - d.dy + d.h / 2;
      if (z === "airdrop") setSaid(`AirDrop opens with ${name(id)}, ready to send to a nearby device.`);
      else if (z === "shelf") toShelf(id);
      else if (z === "screen" && screen.current) {
        const r = screen.current.getBoundingClientRect();
        lay(id, { on: "screen", x: clamp(((cx - r.left) / r.width) * 100, 6, 94), y: clamp(((cy - r.top) / r.height) * 100, 10, 90), r: tilt() });
      } else {
        const width = document.documentElement.clientWidth;
        lay(id, { on: "page", x: clamp(cx + window.scrollX, 56, width - 56), y: Math.max(40, cy + window.scrollY), r: tilt() });
      }
    }
  };

  // The ghost mounts when the file lifts; put it under the pointer before it paints.
  useLayoutEffect(() => {
    if (lifted) place(pointer.current.x, pointer.current.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifted]);

  const moveDone = () => {
    const d = drag.current;
    drag.current = null;
    setLifted(null);
    setOver(null);
    return d;
  };
  const cancel = () => {
    moveDone();
  };

  const item = (f: (typeof files)[number], where: "shelf" | "screen" | "page") => {
    const spot = spots[f.id];
    const style =
      where === "screen" ? ({ left: `${spot.x}%`, top: `${spot.y}%`, "--r": `${spot.r}deg` } as CSSProperties)
      : where === "page" ? ({ left: `${spot.x}px`, top: `${spot.y}px`, "--r": `${spot.r}deg` } as CSSProperties)
      : undefined;
    return (
      <li key={f.id} className={where === "shelf" ? undefined : "sh-spot"} style={style} data-lifted={lifted === f.id}>
        <button
          type="button"
          className="sh-file"
          onPointerDown={down(f.id)}
          onPointerMove={moveDrag}
          onPointerUp={up}
          onPointerCancel={cancel}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (where === "shelf") lay(f.id, spots[f.id]);
              else toShelf(f.id);
            }
          }}
          aria-label={`${f.name}, ${where === "shelf" ? "on the Shelf. Press to take it off" : "on the desktop. Press to put it on the Shelf"}`}
        >
          <Thumb kind={f.kind} />
          <span className="sh-file__name">{f.name}</span>
        </button>
      </li>
    );
  };

  const shelved = files.filter((f) => onShelf.includes(f.id));
  const onScreen = files.filter((f) => !onShelf.includes(f.id) && spots[f.id].on === "screen");
  const onPage = files.filter((f) => !onShelf.includes(f.id) && spots[f.id].on === "page");
  const dragged = lifted ? files.find((f) => f.id === lifted) : null;

  return (
    <div className="demo sh">
      <div className="sh-screen" ref={screen} data-over={over === "screen"}>
        <div className="sh-notch">
          <Notch tab="shelf" label="The Shelf, open in the notch">
            <div className="sh-row">
              <div className="sh-zone sh-air" ref={air} data-over={over === "airdrop"}>
                <span className="sh-air__icon" aria-hidden="true"><i /></span>
                AirDrop
              </div>
              <div className="sh-zone sh-shelf" ref={shelf} data-over={over === "shelf"}>
                {shelved.length ? <ul className="sh-files">{shelved.map((f) => item(f, "shelf"))}</ul> : <p className="sh-empty">Drop files here</p>}
              </div>
            </div>
          </Notch>
        </div>
        <ul className="sh-desk" aria-label="Desktop">{onScreen.map((f) => item(f, "screen"))}</ul>
      </div>

      {/* Files dropped outside the screen lie on the page itself, where they were let go. */}
      {mounted && onPage.length > 0 && createPortal(<ul className="sh-loose" aria-label="Files on the page">{onPage.map((f) => item(f, "page"))}</ul>, document.body)}

      {dragged && (
        <div ref={ghost} className="sh-ghost" aria-hidden="true">
          <Thumb kind={dragged.kind} />
          <span className="sh-file__name">{dragged.name}</span>
        </div>
      )}

      <p className="demo__said" aria-live="polite">{said || "Drag a file into the notch, then drag it out anywhere, even off the screen."}</p>
    </div>
  );
}
