"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

/* Real renders from the app (Eyebrow Design System › screenshots), at 2×.
   Notch shots are trimmed to the notch with a clear background, so each
   one hangs from the top edge of its tile the way it hangs from a screen. */
type Shot = { src: string; w: number; h: number; alt: string };

const shots = {
  clipboard: { src: "/shots/open-clipboard.png", w: 1280, h: 468, alt: "Clipboard history open in the notch, with filters for text, links, images, colours and files" },
  screenshot: { src: "/shots/open-screenshot.png", w: 1280, h: 468, alt: "A screenshot caught in the notch, with Copy, Annotate, Text and Save" },
  widgets: { src: "/shots/widgets-day.png", w: 1280, h: 468, alt: "The Widgets tab: time and weather, calendar, reminders, battery, clock and weather widgets" },
  floating: { src: "/shots/floating-shelf.png", w: 496, h: 264, alt: "The floating shelf beside the pointer, holding three files" },
  sneak: { src: "/shots/closed-sneak-peek.png", w: 536, h: 126, alt: "Sneak Peek: the new track's title and artist under the closed notch" },
  mic: { src: "/shots/closed-hud-mic-muted.png", w: 396, h: 133, alt: "The closed notch showing Mic muted" },
} satisfies Record<string, Shot>;

const themes: { name: string; src: string }[] = [
  { name: "Default", src: "/shots/theme-default.png" },
  { name: "Midnight", src: "/shots/theme-midnight.png" },
  { name: "Neon", src: "/shots/theme-neon.png" },
  { name: "Retro", src: "/shots/theme-retro.png" },
  { name: "Mono", src: "/shots/theme-mono.png" },
];

/** The rest, named in one line, so the page doesn't have to show them all. */
const more = [
  "Now Playing",
  "Lyrics",
  "Volume HUD",
  "Battery",
  "System stats",
  "Stay Awake",
  "Timers",
  "Downloads",
  "Calendar",
  "Weather",
  "Audio switching",
  "Transcription",
  "Browser tabs",
  "Call controls",
];

function Shot({ shot, sizes }: { shot: Shot; sizes: string }) {
  return (
    <Image
      className="bento__shot"
      src={shot.src}
      alt={shot.alt}
      width={shot.w / 2}
      height={shot.h / 2}
      sizes={sizes}
    />
  );
}

function Themes() {
  const [pick, setPick] = useState(0);

  return (
    <>
      <div className="bento__stack">
        {themes.map((t, i) => (
          <Image
            key={t.name}
            className="bento__shot"
            src={t.src}
            alt={i === pick ? `Home in the ${t.name} theme, with music playing` : ""}
            aria-hidden={i !== pick}
            data-on={i === pick}
            width={640}
            height={241.5}
            sizes="(max-width: 900px) 92vw, 680px"
          />
        ))}
      </div>
      <div className="bento__chips" role="group" aria-label="Pick a theme">
        {themes.map((t, i) => (
          <button
            key={t.name}
            type="button"
            className="filter__chip"
            aria-pressed={i === pick}
            onClick={() => setPick(i)}
          >
            {t.name}
          </button>
        ))}
      </div>
    </>
  );
}

/**
 * Everything the demo above doesn't play, on one screen: a bento of real
 * renders, then the rest named in a line and a door to the full list.
 */
export default function Showcase() {
  const wide = "(max-width: 900px) 92vw, 540px";

  return (
    <section className="section" id="features">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow-label">Everything else</span>
          <h2 className="section-title">
            Small jobs,
            <br />
            <span className="section-title__muted">
              done where you&apos;re already looking.
            </span>
          </h2>
        </Reveal>

        <div className="bento">
          <Reveal className="bento__cell bento__cell--half">
            <article className="bento__card">
              <Shot shot={shots.clipboard} sizes={wide} />
              <div className="bento__copy">
                <h3>Clipboard history</h3>
                <p>
                  Text, links, images, colours and files, filtered by type and
                  searchable. <kbd>⇧</kbd><kbd>⌘</kbd><kbd>C</kbd> from anywhere.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal className="bento__cell bento__cell--half" delay={60}>
            <article className="bento__card">
              <Shot shot={shots.screenshot} sizes={wide} />
              <div className="bento__copy">
                <h3>Screenshots, caught</h3>
                <p>
                  <kbd>⇧</kbd><kbd>⌘</kbd><kbd>4</kbd> lands in the notch, not
                  on your desktop. Copy, annotate, pull the text out, or save.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal className="bento__cell bento__cell--wide">
            <article className="bento__card">
              <Shot shot={shots.widgets} sizes="(max-width: 900px) 92vw, 720px" />
              <div className="bento__copy">
                <h3>Eighteen widgets, three sizes</h3>
                <p>
                  Build your own layout, or start from Minimal, Productivity,
                  Media or Complete.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal className="bento__cell bento__cell--narrow" delay={60}>
            <article className="bento__card bento__card--center">
              <Shot shot={shots.floating} sizes="(max-width: 900px) 70vw, 248px" />
              <div className="bento__copy">
                <h3>
                  Floating shelf <span className="card__pro">Pro</span>
                </h3>
                <p>
                  Shake a file while you drag it, and a shelf appears beside
                  the pointer.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal className="bento__cell bento__cell--wide bento__cell--tall">
            <article className="bento__card">
              <Themes />
              <div className="bento__copy">
                <h3>
                  Themes <span className="card__pro">Pro</span>
                </h3>
                <p>Make the notch yours, down to the HUD colours.</p>
              </div>
            </article>
          </Reveal>

          <Reveal className="bento__cell bento__cell--narrow" delay={60}>
            <article className="bento__card bento__card--center">
              <Shot shot={shots.sneak} sizes="(max-width: 900px) 70vw, 268px" />
              <div className="bento__copy">
                <h3>Sneak Peek</h3>
                <p>A new track slides under the notch, then gets out of the way.</p>
              </div>
            </article>
          </Reveal>

          <Reveal className="bento__cell bento__cell--narrow" delay={120}>
            <article className="bento__card bento__card--center">
              <Shot shot={shots.mic} sizes="(max-width: 900px) 60vw, 198px" />
              <div className="bento__copy">
                <h3>Mic kill switch</h3>
                <p>One shortcut mutes the microphone in every app.</p>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal>
          <div className="bento__more">
            <p>
              <span className="bento__more-lead">Also in the notch:</span>{" "}
              {more.join(" · ")}.
            </p>
            <Link className="btn" href="/features">
              All 24 features
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
