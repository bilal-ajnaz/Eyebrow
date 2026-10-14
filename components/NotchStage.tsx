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
  /** an Eyebrow Pro feature */
  pro?: boolean;
  /** not in the released app yet */
  soon?: boolean;
};

/* Most important first: what the notch is for, then what it does for you
   every day, then the moments that come and go. */
const acts: Act[] = [
  {
    id: "idle",
    label: "Idle",
    title: "Most of the time, it does nothing",
    body: "Eyebrow stays the size of your notch and stays quiet. No badge, no bounce, no widget begging to be looked at.",
  },
  {
    id: "home",
    label: "Home",
    title: "Hover, and it opens",
    body: "Home puts what's playing next to your day. Scrub, skip and favourite on one side; this week's calendar, today's events and your reminders on the other.",
    tab: "home",
  },
  {
    id: "music",
    label: "Now Playing",
    title: "Then a track starts",
    body: "Its artwork and a colour-matched spectrogram slide out either side of the notch — Apple Music, Spotify, YouTube Music or anything using system Now Playing.",
  },
  {
    id: "claude",
    label: "Claude Code",
    title: "Claude Code gets to work",
    body: "While a Claude Code session works, its mark turns beside the notch, and it goes amber when Claude needs your permission. With Pro, anything else that's running waits in small notches either side of it, two at most. Click one to swap.",
    soon: true,
  },
  {
    id: "live",
    label: "Live",
    title: "Open any session",
    body: "While something is running, the Live tab sits just right of the notch. Each Claude Code session gets its own page: what you asked, what it's doing, what it said, and a box to send it a quick message without finding the terminal. Calls, music, timers and downloads get a page too.",
    tab: "live",
    pro: true,
    soon: true,
  },
  {
    id: "approve",
    label: "Approvals",
    title: "It asks, and you answer",
    body: "When Claude Code needs permission, the request is right there: the command or the file, with Allow and Deny. Leave it, and Claude Code asks in the terminal as usual.",
    tab: "approve",
    pro: true,
    soon: true,
  },
  {
    id: "widgets",
    label: "Widgets",
    title: "And when you want everything",
    body: "The Widgets tab is your own layout — seventeen widgets in three sizes, alongside tabs for the shelf, clipboard, screenshots, audio and weather.",
    tab: "widgets",
  },
  {
    id: "teleprompter",
    label: "Teleprompter",
    title: "Read your script under the camera",
    body: "Click the Teleprompter widget and your script counts down, then scrolls past a marker right below the camera, so you can read it and still look people in the eye. Set the speed and text size, click to pause, drag to go back a line. It runs in the Live tab, free or Pro.",
    tab: "prompter",
    soon: true,
  },
  {
    id: "notes",
    label: "Notes",
    title: "Jot it down without switching apps",
    body: "Click the Notes widget and the Widgets tab becomes a note. Type a title on the first line, press ⌘↩, and it's saved to the Notes app, in your default folder. Close it halfway and the draft waits for you.",
    tab: "note",
    soon: true,
  },
  {
    id: "vertical",
    label: "Vertical tabs",
    title: "Or turn your tabs on a wheel",
    body: "Switch on vertical tabs and they run down the side of the open notch. Scroll over them and the wheel turns one tab at a time, with a click on the trackpad for each, and add as many tabs as you like.",
    tab: "vertical",
    pro: true,
    soon: true,
  },
  {
    id: "shelf",
    label: "Shelf",
    title: "You drag a file up",
    body: "The Shelf catches it and holds it. Drag it back out into any app, any window, any Space. Quick Share is one tap away.",
    tab: "shelf",
  },
  {
    id: "face",
    label: "Face Unlock",
    title: "It knows it's you",
    body: "When your Mac is locked, Eyebrow recognises your face through the camera and types your password for you. Your password and face data stay encrypted in this Mac's Keychain, never in iCloud. It's a convenience, not extra security, and your password always works.",
    pro: true,
    soon: true,
  },
  {
    id: "call",
    label: "Calls",
    title: "A meeting begins",
    body: "Zoom, Google Meet and Microsoft Teams are detected automatically. Mute, camera and leave, always in the same place.",
  },
  {
    id: "download",
    label: "Downloads",
    title: "A download starts",
    body: "Safari, Chrome, Firefox, Arc and Brave report live progress into the notch, with the source app's icon and no Downloads window.",
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
];

/* Face Unlock: the lock opens once the face is recognised. */
function FaceUnlockActivity() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="la la--face" data-open={open}>
      <span className="la__wing">
        <Glyph n={open ? "lockOpen" : "lock"} s={15} />
      </span>
      <span className="la__gap" />
      <span className="la__wing">
        <Glyph n="faceid" s={19} c="la__faceid" />
      </span>
    </div>
  );
}

/* Claude Code at work, then asking: the glyph turns while it works, and
   both marks go amber when a permission request comes in. */
function ClaudeActivity() {
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setAsking(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="la la--claude" data-asking={asking}>
      <span className="la__sq la__spark" aria-hidden="true">
        <Glyph n="spark" s={18} />
      </span>
      <span className="la__gap" />
      <span className="la__sq" aria-hidden="true">
        {asking ? (
          <span className="la__ask">!</span>
        ) : (
          <span className="la__busy">
            <span className="num">2</span>
          </span>
        )}
      </span>
    </div>
  );
}

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
          <span className="la__gap" />
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
            <Glyph n="compass" s={14} />
          </span>
          <span className="la__mid">
            <span className="la__gap la__file">Xcode_16.4.xip</span>
          </span>
          <span className="la__sq">
            <Ring side={20} lw={2} p={0.68} tint="accent" />
          </span>
        </div>
      );
    case "claude":
      return <ClaudeActivity />;
    case "face":
      return <FaceUnlockActivity />;
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
  const tickRow = useRef<HTMLOListElement | null>(null);

  // The label row fades out at an end only where labels are hidden past it.
  useEffect(() => {
    const row = tickRow.current;
    if (!row) return;
    const measure = () => {
      row.dataset.fadeStart = String(row.scrollLeft > 1);
      row.dataset.fadeEnd = String(row.scrollLeft + row.clientWidth < row.scrollWidth - 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    row.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      row.removeEventListener("scroll", measure);
    };
  }, []);

  // One row of labels: when they don't all fit, keep the current one centred.
  useEffect(() => {
    const row = tickRow.current;
    const tick = row?.children[active] as HTMLElement | undefined;
    if (!row || !tick || row.scrollWidth <= row.clientWidth + 1) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({
      left: tick.offsetLeft - (row.clientWidth - tick.offsetWidth) / 2,
      behavior: still ? "auto" : "smooth",
    });
  }, [active]);

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
              {current.id === "claude" && (
                /* what else is running waits its turn in small notches, one
                   each side: the song next on the right, the download left */
                <>
                  <div className="notch2" aria-hidden="true">
                    <span className="notch2__art" />
                  </div>
                  <div className="notch2 notch2--left" aria-hidden="true">
                    <Ring side={18} lw={2} p={0.68} tint="accent" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="stage__ticks" aria-hidden="true">
          <ol className="stage__ticklist" ref={tickRow}>
            {acts.map((a, i) => (
              <li key={a.id} data-on={i === active}>
                <span>{a.label}</span>
              </li>
            ))}
          </ol>
        </div>
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
                {a.pro && <span className="act__pro">Pro</span>}
                {a.soon && <span className="soon">Coming soon</span>}
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
