"use client";

import { useEffect, useRef, useState } from "react";
import { Glyph, OpenNotch, Ring, type NotchTab } from "./NotchWidgets";

type Act = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** set when this act opens the notch; the footprint itself is the stylesheet's */
  tab?: NotchTab;
};

const acts: Act[] = [
  {
    id: "idle",
    label: "Idle",
    title: "Most of the time, it does nothing",
    body: "Eyebrow stays the size of your notch and stays quiet. No badge, no bounce, no widget begging to be looked at.",
  },
  {
    id: "music",
    label: "Now Playing",
    title: "Then a track starts",
    body: "Artwork, title and a colour-matched spectrogram slide out. Scrub, skip, shuffle — Apple Music, Spotify, YouTube Music or anything using system Now Playing.",
  },
  {
    id: "hud",
    label: "HUD",
    title: "Volume stops covering your work",
    body: "Eyebrow shows volume changes in a HUD that lives where your eyes already are.",
  },
  {
    id: "battery",
    label: "Battery",
    title: "You plug in",
    body: "Charge state, percentage and power-source changes appear for a second, then leave. Bluetooth device batteries too.",
  },
  {
    id: "download",
    label: "Downloads",
    title: "A download starts",
    body: "Safari, Chrome, Firefox, Arc and Brave report live progress into the notch, with the source app's icon and no Downloads window.",
  },
  {
    id: "call",
    label: "Calls",
    title: "A meeting begins",
    body: "Zoom, Google Meet and Microsoft Teams are detected automatically. Mute, camera and leave, always in the same place.",
  },
  {
    id: "shelf",
    label: "Shelf",
    title: "You drag a file up",
    body: "The Shelf catches it and holds it. Drag it back out into any app, any window, any Space. Quick Share is one tap away.",
    tab: "shelf",
  },
  {
    id: "widgets",
    label: "Widgets",
    title: "And when you want everything",
    body: "Hover, and the notch opens into your own layout — fifteen widgets in three sizes, plus tabs for the shelf, clipboard, screenshots, audio and weather.",
    tab: "widgets",
  },
];

/* The closed notch never grows downward: a live activity widens it, and
   puts what it has to say either side of the hardware. `la__gap` is the
   hardware itself, so nothing is ever drawn under the camera. */
function ActContent({ act }: { act: Act }) {
  if (act.tab) return <OpenNotch tab={act.tab} />;

  switch (act.id) {
    case "music":
      return (
        <div className="la la--music">
          <span className="la__sq la__art" aria-hidden="true" />
          <span className="la__mid">
            <span className="la__wing la__tinted">Bad Decisions</span>
            <span className="la__gap" />
            <span className="la__wing la__wing--end la__tinted">
              <span className="la__clip">Two Door Cinema Club</span>
            </span>
          </span>
          <span className="la__sq la__bars" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </span>
        </div>
      );
    case "hud":
      return (
        <div className="la la--hud">
          <span className="la__wing">
            <Glyph n="speaker" s={17} />
            <span className="la__name">Volume</span>
          </span>
          <span className="la__gap" />
          <span className="la__wing la__wing--end">
            <span className="la__track" aria-hidden="true">
              <i style={{ inlineSize: "75%" }} />
            </span>
            <span className="la__pct num">75%</span>
          </span>
        </div>
      );
    case "battery":
      return (
        <div className="la la--battery">
          <span className="la__mid">
            <span className="la__wing">Charging · 84%</span>
            <span className="la__gap" />
            <span className="la__wing la__wing--end">
              <span className="la__cell" aria-hidden="true">
                <i style={{ inlineSize: "84%" }} />
                <Glyph n="bolt" s={11} />
              </span>
            </span>
          </span>
        </div>
      );
    case "download":
      return (
        <div className="la la--download">
          <span className="la__sq la__app" aria-hidden="true">
            <Glyph n="compass" s={15} />
          </span>
          <span className="la__mid">
            <span className="la__gap la__file">Xcode_16.4.xip</span>
          </span>
          <span className="la__sq">
            <Ring side={22} lw={2} p={0.68} tint="accent" />
          </span>
        </div>
      );
    case "call":
      return (
        <div className="la la--call">
          <span className="la__sq la__live" aria-hidden="true">
            <i />
          </span>
          <span className="la__mid">
            <span className="la__gap la__file">
              <Glyph n="phone" s={10} c="wg-g--positive" />
              Zoom
            </span>
          </span>
          <span className="la__sq la__muted" title="Muted">
            <Glyph n="micSlash" s={13} />
          </span>
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
  const open = Boolean(current.tab);

  return (
    <section className="stage" id="how" aria-label="What Eyebrow does, as you scroll">
      <div className="stage__pin">
        <div className="stage__frame">
          <div className="stage__screen">
            <div className="stage__menubar" aria-hidden="true">
              <span className="stage__menus">
                <b>Finder</b>
                <span>File</span>
              </span>
              <span className="stage__status">
                <i className="stage__cell" />
                <span className="num">Sun 11 Oct 8:36</span>
              </span>
            </div>
            <div className="notch-shell" data-open={open}>
              <div className="notch" data-act={current.id} data-open={open}>
                <div className="notch__glow" aria-hidden="true" />
                <div className="notch__inner" key={current.id}>
                  <ActContent act={current} />
                </div>
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
