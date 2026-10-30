"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Shot from "./Shot";

const views = [
  {
    id: "home",
    label: "Home",
    src: "open-home-calendar.png",
    alt: "Home with the calendar card: a week strip, today's events and a Join button",
    body: "The song, your week and the next meeting, with Join.",
  },
  {
    id: "shelf",
    label: "Shelf",
    src: "open-shelf.png",
    alt: "The Shelf holding several files, with an AirDrop target on the left",
    body: "Drop files on the notch to hold them for later, or AirDrop them from there.",
  },
  {
    id: "clipboard",
    label: "Clipboard",
    src: "open-clipboard.png",
    alt: "Clipboard history with filters and copied text, a pinned link, a colour, an image and a file",
    body: "Text, links, colours and images you copied, one ⇧ ⌘ C away.",
  },
  {
    id: "screenshot",
    label: "Screenshots",
    src: "open-screenshot.png",
    alt: "A fresh screenshot in the notch with Copy, Annotate, Text and Save",
    body: "Each one lands here first: copy it, mark it up, pull the text out or save it.",
  },
  {
    id: "notes",
    label: "Notes",
    src: "open-notes-composer.png",
    alt: "A new note being typed in the notch",
    body: "Write a line in the notch and it saves to Notes.",
  },
];

const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

/* Wide and tall enough to pin the stage; below this the tabs alone switch views. */
const PIN = "(min-width: 60rem) and (min-height: 40rem), (min-width: 40rem) and (min-height: 48rem)";

/* The open notch beside a vertical tab list. Where the window allows, the
   section is tall and the stage pins while the page scrolls past it: each
   stretch of scroll is one view, so scrolling plays through the notch the way
   pointing at it does. The band behind tints to the view (data-view in
   site.css). Without JavaScript the tabs stay hidden and every panel shows,
   one under the other. */
export default function OpenTabs({ intro }: { intro: React.ReactNode }) {
  const [on, setOn] = useState(0);
  const [pinned, setPinned] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  // While a tab click scrolls the page, the steps it passes don't take over.
  const jumping = useRef(false);

  useEffect(() => {
    const media = window.matchMedia(PIN);
    const sync = () => setPinned(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // The step under the middle of the window is the view on show.
  useEffect(() => {
    if (!pinned) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (jumping.current) return;
        for (const e of entries) {
          if (e.isIntersecting) setOn(steps.current.indexOf(e.target as HTMLDivElement));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [pinned]);

  const go = (i: number) => {
    setOn(i);
    tabs.current[i]?.focus({ preventScroll: true });
    const step = steps.current[i];
    if (!pinned || !step) return;
    // Land a little way into the step, so the view holds when the scroll stops.
    const top = window.scrollY + step.getBoundingClientRect().top - window.innerHeight / 2 + step.offsetHeight * 0.2;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    jumping.current = true;
    const done = () => {
      jumping.current = false;
      window.removeEventListener("scrollend", done);
    };
    window.addEventListener("scrollend", done);
    window.setTimeout(done, 1200);
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  const onKey = (i: number) => (e: KeyboardEvent) => {
    const step = keys[e.key];
    if (step) {
      e.preventDefault();
      go((i + step + views.length) % views.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(views.length - 1);
    }
  };

  return (
    <section
      className="open"
      id="open"
      aria-labelledby="open-title"
      data-view={views[on].id}
      data-pinned={pinned}
      style={{ "--steps": views.length } as CSSProperties}
    >
      <div className="open__stage">
        <div className="wrap grid open__grid">
          <div className="section-head">
            {intro}
            <div className="tabs" role="tablist" aria-label="Open notch views" aria-orientation="vertical">
              {views.map((v, i) => (
                <button
                  key={v.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  className="tab"
                  type="button"
                  role="tab"
                  id={`tab-${v.id}`}
                  aria-controls={`panel-${v.id}`}
                  aria-selected={i === on}
                  tabIndex={i === on ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={onKey(i)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div className="open__panels">
            {views.map((v, i) => (
              <div
                key={v.id}
                className="panel"
                role="tabpanel"
                id={`panel-${v.id}`}
                aria-labelledby={`tab-${v.id}`}
                data-on={i === on}
              >
                <figure className="edge">
                  <Shot src={v.src} w={640} width={1280} height={468} alt={v.alt} />
                  <figcaption>
                    <b>{v.label}</b>
                    {v.body}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
      {pinned && (
        <div className="open__steps" aria-hidden="true">
          {views.map((v, i) => (
            <div
              key={v.id}
              ref={(el) => {
                steps.current[i] = el;
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
