"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type Act = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** notch footprint for this act, in px */
  w: number;
  h: number;
};

const acts: Act[] = [
  {
    id: "idle",
    label: "Idle",
    title: "Most of the time, it does nothing",
    body: "Eyebrow stays the size of your notch and stays quiet. No badge, no bounce, no widget begging to be looked at.",
    w: 200,
    h: 34,
  },
  {
    id: "music",
    label: "Now Playing",
    title: "Then a track starts",
    body: "Artwork, title and a colour-matched spectrogram slide out. Scrub, skip, shuffle — Apple Music, Spotify, YouTube Music or anything using system Now Playing.",
    w: 384,
    h: 64,
  },
  {
    id: "hud",
    label: "HUD",
    title: "Volume stops covering your work",
    body: "Eyebrow replaces the macOS volume, brightness and keyboard-backlight HUDs with one that lives where your eyes already are.",
    w: 300,
    h: 56,
  },
  {
    id: "battery",
    label: "Battery",
    title: "You plug in",
    body: "Charge state, percentage and power-source changes appear for a second, then leave. Bluetooth device batteries too.",
    w: 284,
    h: 56,
  },
  {
    id: "download",
    label: "Downloads",
    title: "A download starts",
    body: "Safari, Chrome, Firefox, Arc and Brave report live progress into the notch, with the source app's icon and no Downloads window.",
    w: 336,
    h: 56,
  },
  {
    id: "call",
    label: "Calls",
    title: "A meeting begins",
    body: "Zoom, Google Meet and Microsoft Teams are detected automatically. Mute, camera and leave, always in the same place.",
    w: 344,
    h: 56,
  },
  {
    id: "shelf",
    label: "Shelf",
    title: "You drag a file up",
    body: "The Shelf catches it and holds it. Drag it back out into any app, any window, any Space. Quick Share is one tap away.",
    w: 372,
    h: 84,
  },
  {
    id: "widgets",
    label: "Widgets",
    title: "And when you want everything",
    body: "Hover, and the notch opens into your own layout — sixteen widgets in three sizes, plus tabs for the shelf, clipboard, screenshots, audio and weather.",
    w: 600,
    h: 196,
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
            {[0, 1, 2, 3].map((i) => (
              <i key={i} style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        </div>
      );
    case "hud":
      return (
        <div className="nx nx--hud">
          <Icon name="speaker" size={17} />
          <div className="nx__track" aria-hidden="true">
            <div className="nx__fill" style={{ inlineSize: "62%" }} />
          </div>
          <span className="nx__num num">62</span>
        </div>
      );
    case "battery":
      return (
        <div className="nx nx--battery">
          <span className="nx__bolt">
            <Icon name="bolt" size={16} />
          </span>
          <span className="nx__title">Charging</span>
          <div className="nx__track" aria-hidden="true">
            <div className="nx__fill" style={{ inlineSize: "84%" }} />
          </div>
          <span className="nx__num num">84%</span>
        </div>
      );
    case "download":
      return (
        <div className="nx nx--download">
          <Icon name="download" size={16} />
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
          <i className="nx__dot" aria-hidden="true" />
          <span className="nx__title">Zoom</span>
          <span className="nx__sub num">12:04</span>
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
          <div className="nx__head">
            <Icon name="tray" size={15} />
            <span className="nx__title">Shelf</span>
            <span className="nx__sub">2 items · drag out</span>
          </div>
          <div className="nx__chips">
            <span className="nx__chip">Brief.pdf</span>
            <span className="nx__chip">Hero@2x.png</span>
            <span className="nx__chip nx__chip--drop">Drop</span>
          </div>
        </div>
      );
    case "widgets":
      return (
        <div className="nx nx--surface">
          <div className="nx__tile nx__lead">
            <div className="nx__art nx__art--lg" aria-hidden="true" />
            <div className="nx__leadmeta">
              <div className="nx__meta">
                <span className="nx__title">Bad Decisions</span>
                <span className="nx__sub">Two Door Cinema Club</span>
              </div>
              <div className="nx__scrub" aria-hidden="true">
                <span className="num">1:12</span>
                <div className="nx__track">
                  <div className="nx__fill" />
                </div>
                <span className="num">3:21</span>
              </div>
              <div className="nx__transport" aria-hidden="true">
                <span className="nx__tbtn">
                  <Icon name="previous" size={16} />
                </span>
                <span className="nx__tbtn nx__tbtn--main">
                  <Icon name="pause" size={18} />
                </span>
                <span className="nx__tbtn">
                  <Icon name="next" size={16} />
                </span>
              </div>
            </div>
          </div>
          <div className="nx__side">
            <div className="nx__tile">
              <Icon name="cloud" size={16} />
              <span className="nx__big num">18°</span>
              <span className="nx__sub">Cloudy</span>
            </div>
            <div className="nx__tile">
              <span className="nx__bolt">
                <Icon name="battery" size={16} />
              </span>
              <span className="nx__big num">84%</span>
              <span className="nx__sub">Charging</span>
            </div>
            <div className="nx__tile nx__tile--wide">
              <Icon name="calendar" size={16} />
              <div className="nx__meta">
                <span className="nx__title">Standup</span>
                <span className="nx__sub num">10:00 – 10:15 · Zoom</span>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      // idle: exactly the hardware, nothing drawn inside it
      return null;
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
  // the corner follows the height, as it does in the app
  const radius = Math.round(Math.max(14, Math.min(34, current.h * 0.42)));

  return (
    <section className="stage" id="how" aria-label="What Eyebrow does, as you scroll">
      <div className="stage__pin">
        <div className="stage__frame">
          <div className="stage__screen">
            <div className="stage__menubar" aria-hidden="true" />
            <div
              className="notch"
              data-act={current.id}
              style={
                {
                  "--notch-w": `${current.w}px`,
                  "--notch-h": `${current.h}px`,
                  "--notch-r": `${radius}px`,
                } as React.CSSProperties
              }
            >
              <div className="notch__glow" aria-hidden="true" />
              <div className="notch__inner" key={current.id}>
                <ActContent id={current.id} />
              </div>
            </div>
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
              <h3 className="act__title">{a.title}.</h3>
              <p className="act__body">{a.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
