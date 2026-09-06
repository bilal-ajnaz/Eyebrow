"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type Act = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** closed-notch footprint, in px */
  w: number;
  h: number;
};

const acts: Act[] = [
  {
    id: "idle",
    label: "Idle",
    title: "Most of the time, it does nothing",
    body: "Eyebrow stays the size of your notch and stays quiet. No badge, no bounce, no widget begging to be looked at.",
    w: 190,
    h: 34,
  },
  {
    id: "music",
    label: "Now Playing",
    title: "Then a track starts",
    body: "Artwork, title and a colour-matched spectrogram slide out. Scrub, skip, shuffle — Apple Music, Spotify, YouTube Music or anything using system Now Playing.",
    w: 360,
    h: 58,
  },
  {
    id: "hud",
    label: "HUD",
    title: "Volume stops covering your work",
    body: "Eyebrow replaces the macOS volume, brightness and keyboard-backlight HUDs with one that lives where your eyes already are.",
    w: 292,
    h: 44,
  },
  {
    id: "battery",
    label: "Battery",
    title: "You plug in",
    body: "Charge state, percentage and power-source changes appear for a second, then leave. Bluetooth device batteries too.",
    w: 268,
    h: 42,
  },
  {
    id: "download",
    label: "Downloads",
    title: "A download starts",
    body: "Safari, Chrome, Firefox, Arc and Brave report live progress into the notch, with the source app's icon and no Downloads window.",
    w: 320,
    h: 50,
  },
  {
    id: "call",
    label: "Calls",
    title: "A meeting begins",
    body: "Zoom, Google Meet and Microsoft Teams are detected automatically. Mute, camera and leave, always in the same place.",
    w: 336,
    h: 52,
  },
  {
    id: "shelf",
    label: "Shelf",
    title: "You drag a file up",
    body: "The Shelf catches it and holds it. Drag it back out into any app, any window, any Space. Quick Share is one tap away.",
    w: 348,
    h: 76,
  },
  {
    id: "widgets",
    label: "Widgets",
    title: "And when you want everything",
    body: "Hover, and the notch opens into your own layout — sixteen widgets in three sizes, plus tabs for the shelf, clipboard, screenshots, audio and weather.",
    w: 430,
    h: 148,
  },
];

function ActContent({ id }: { id: string }) {
  switch (id) {
    case "music":
      return (
        <div className="nx nx--music">
          <div className="nx__art" aria-hidden="true" />
          <div className="nx__meta">
            <span className="nx__title">Bad Decisions</span>
            <span className="nx__sub">Two Door Cinema Club</span>
          </div>
          <div className="nx__bars" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <i key={i} style={{ animationDelay: `${i * 110}ms` }} />
            ))}
          </div>
        </div>
      );
    case "hud":
      return (
        <div className="nx nx--hud">
          <Icon name="speaker" size={16} />
          <div className="nx__track" aria-hidden="true">
            <div className="nx__fill" style={{ inlineSize: "62%" }} />
          </div>
          <span className="nx__num num">62</span>
        </div>
      );
    case "battery":
      return (
        <div className="nx nx--battery">
          <span className="nx__pill">
            <Icon name="bolt" size={13} />
            Charging
          </span>
          <div className="nx__batt" aria-hidden="true">
            <span style={{ inlineSize: "84%" }} />
          </div>
          <span className="nx__num num">84%</span>
        </div>
      );
    case "download":
      return (
        <div className="nx nx--download">
          <div className="nx__app" aria-hidden="true">
            <Icon name="globe" size={15} />
          </div>
          <div className="nx__meta">
            <span className="nx__title">Xcode_16.4.xip</span>
            <div className="nx__track" aria-hidden="true">
              <div className="nx__fill" style={{ inlineSize: "68%" }} />
            </div>
          </div>
          <span className="nx__num num">68%</span>
        </div>
      );
    case "call":
      return (
        <div className="nx nx--call">
          <span className="nx__pill nx__pill--live">
            <i className="nx__dot" aria-hidden="true" />
            Zoom · <span className="num">12:04</span>
          </span>
          <div className="nx__controls">
            <span className="nx__ctl nx__ctl--danger" title="Muted">
              <Icon name="mic" size={14} />
            </span>
            <span className="nx__ctl" title="Camera">
              <Icon name="camera" size={14} />
            </span>
            <span className="nx__ctl nx__ctl--leave" title="Leave">
              <Icon name="phone" size={14} />
            </span>
          </div>
        </div>
      );
    case "shelf":
      return (
        <div className="nx nx--shelf">
          <span className="nx__label">Shelf · 3 items</span>
          <div className="nx__chips">
            <span className="nx__chip">Brief.pdf</span>
            <span className="nx__chip">Hero@2x.png</span>
            <span className="nx__chip nx__chip--drop">Drop here</span>
          </div>
        </div>
      );
    case "widgets":
      return (
        <div className="nx nx--widgets">
          <div className="nx__tabs" aria-hidden="true">
            {["Home", "Shelf", "Clipboard", "Widgets"].map((t, i) => (
              <span key={t} data-on={i === 3}>
                {t}
              </span>
            ))}
          </div>
          <div className="nx__grid">
            <div className="nx__w nx__w--wide">
              <span className="nx__wnum num">9:41</span>
              <span className="nx__wlabel">Fri 6 Sep</span>
            </div>
            <div className="nx__w">
              <Icon name="cloud" size={15} />
              <span className="nx__wlabel num">18°</span>
            </div>
            <div className="nx__w">
              <Icon name="battery" size={15} />
              <span className="nx__wlabel num">84%</span>
            </div>
            <div className="nx__w nx__w--wide">
              <Icon name="calendar" size={15} />
              <span className="nx__wlabel">Standup · 10:00</span>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="nx nx--idle">
          <i className="nx__lens" aria-hidden="true" />
        </div>
      );
  }
}

export default function NotchStage() {
  const [active, setActive] = useState(0);
  const actRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = actRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActive(index);
          }
        }
      },
      // whichever act is crossing the middle of the viewport wins
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const current = acts[active];

  return (
    <section className="stage" id="how" aria-label="What Eyebrow does, as you scroll">
      <div className="stage__pin">
        <div className="stage__bezel" aria-hidden="true" />
        <div
          className="notch"
          data-act={current.id}
          style={
            {
              "--notch-w": `${current.w}px`,
              "--notch-h": `${current.h}px`,
            } as React.CSSProperties
          }
        >
          <div className="notch__inner" key={current.id}>
            <ActContent id={current.id} />
          </div>
        </div>

        <ol className="stage__ticks" aria-hidden="true">
          {acts.map((a, i) => (
            <li key={a.id} data-on={i === active}>
              <span>{a.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="stage__acts">
        {acts.map((a, i) => (
          <article
            key={a.id}
            className="act"
            id={`act-${i + 1}`}
            data-index={i}
            ref={(el) => {
              actRefs.current[i] = el;
            }}
          >
            <div className="act__copy" data-on={i === active}>
              <span className="act__step num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="act__title">{a.title}</h3>
              <p className="act__body">{a.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
