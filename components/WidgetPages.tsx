"use client";

import { useState } from "react";
import Image from "next/image";

/* Widget pages as the app draws them. Between them they show all eighteen
   widgets (Eyebrow Design System › screenshots › widgets). */
const pages = [
  { name: "Your day", src: "/shots/widgets-day.png", alt: "Time and weather, calendar, reminders, battery, clock and weather widgets" },
  { name: "Media and focus", src: "/shots/widgets-media-focus.png", alt: "Now Playing, a focus timer, Stay Awake and System Stats widgets" },
  { name: "Work", src: "/shots/widgets-work.png", alt: "AI Usage, Call Controls, Meeting Alert and Browser Tabs widgets" },
  { name: "Create", src: "/shots/widgets-create.png", alt: "Teleprompter, Notes, Clipboard and Transcription widgets" },
  { name: "All small", src: "/shots/widgets-small.png", alt: "Twelve small widgets on one page" },
];

/** A page picker over real renders of the Widgets tab. */
export default function WidgetPages() {
  const [pick, setPick] = useState(0);

  return (
    <div className="pages">
      <div className="pages__view">
        {pages.map((p, i) => (
          <Image
            key={p.src}
            className="bento__shot"
            src={p.src}
            alt={i === pick ? p.alt : ""}
            aria-hidden={i !== pick}
            data-on={i === pick}
            width={640}
            height={234}
            sizes="(max-width: 900px) 92vw, 860px"
            priority={i === 0}
          />
        ))}
      </div>
      <div className="filter" role="group" aria-label="Pick a widget page">
        {pages.map((p, i) => (
          <button
            key={p.name}
            type="button"
            className="filter__chip"
            aria-pressed={i === pick}
            onClick={() => setPick(i)}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
