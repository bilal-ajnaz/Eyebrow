"use client";

import { useRef, useState, type KeyboardEvent } from "react";
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

const steps: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

/* A vertical tab list beside the open notch. Without JavaScript the tabs stay
   hidden and every panel shows, one under the other (see .js in home.css). */
export default function OpenTabs({ intro }: { intro: React.ReactNode }) {
  const [on, setOn] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number) => {
    setOn(i);
    tabs.current[i]?.focus({ preventScroll: true });
  };

  const onKey = (i: number) => (e: KeyboardEvent) => {
    const step = steps[e.key];
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
    <div className="grid open__grid">
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
              onClick={() => setOn(i)}
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
  );
}
