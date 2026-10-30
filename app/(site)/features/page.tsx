import "./features.css";
import "./guide.css";
import type { Metadata } from "next";
import { Features, Tabs, Widgets } from "@/components/Sections";
import { features, widgets, tabs } from "@/lib/features";
import { site } from "@/lib/site";
import ShelfDemo from "@/components/guide/ShelfDemo";
import ClipboardDemo from "@/components/guide/ClipboardDemo";
import WidgetsDemo from "@/components/guide/WidgetsDemo";
import ScreenshotDemo from "@/components/guide/ScreenshotDemo";

export const metadata: Metadata = {
  title: "Features",
  description: `Every ${site.name} feature, widget and notch tab: Now Playing, HUDs, the Shelf, clipboard history, screenshots, call controls, Claude Code and more. Free, with a one-time Pro upgrade.`,
};

const demos = [
  {
    id: "try-shelf",
    title: "Shelf",
    // Full width, so the notch can be shown at the size it really is on your screen.
    wide: true,
    body: "Drag files onto the notch to hold them while you work, then drag them out wherever they’re going. AirDrop sits on the left of the Shelf.",
    steps: ["Drag a file up into the Shelf.", "Drag it back out and drop it anywhere, even off the screen and onto this page.", "Drop one on AirDrop."],
    note: "In the app you drag real files from Finder and other apps, and AirDrop sends them to your devices.",
    Demo: ShelfDemo,
  },
  {
    id: "try-clipboard",
    title: "Clipboard",
    body: "Everything you copy is kept in the notch: text, links, colours, images and files. Pick one to copy it again, and pin the ones you reach for.",
    steps: ["Write something in the box, select it and press ⌘ C.", "Watch it land in the notch, and pin the clips you want to keep at the front.", "Click a clip to copy it, then press ⌘ V in the box to paste it."],
    note: "In the app it keeps what you copy anywhere on your Mac, images and files included.",
    Demo: ClipboardDemo,
  },
  {
    id: "try-widgets",
    title: "Widgets",
    body: "Pages of widgets in small, medium and large: clock, calendar, reminders, battery, weather, timers, Now Playing and more. The free app has one page; Pro has up to four.",
    steps: ["Press the pencil, then drag a widget to move it.", "Pull a widget’s bottom-right corner to make it small, medium or large.", "Switch pages with the dots on the right."],
    note: "The app has more widgets to choose from than the ten here.",
    Demo: WidgetsDemo,
  },
  {
    id: "try-screenshots",
    title: "Screenshots",
    body: "A new screenshot lands in the notch first. From there you can copy it, mark it up, pull the text out of it or save it.",
    steps: ["Press the shutter in the middle of the screen.", "Watch the shot fly up into the notch, then click it to zoom in.", "Annotate it, read its text, then copy or save it."],
    note: "In the app, the screenshots you take on your Mac land in the notch the same way.",
    Demo: ScreenshotDemo,
  },
];

const jumps = [
  { href: "#try", label: "Try it", count: demos.length },
  { href: "#features", label: "Features", count: features.length },
  { href: "#widgets", label: "Widgets", count: widgets.length },
  { href: "#tabs", label: "Tabs", count: tabs.length },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="page-head" aria-labelledby="features-title">
        <div className="wrap">
          <p className="kicker">The complete feature guide</p>
          <h1 id="features-title">Try the notch before you download it.</h1>
          <p>
            The Shelf, the clipboard, widgets and screenshots work right here on
            the page. Below them is every feature, widget and tab in the app.
            Anything not marked Pro is in the free app.
          </p>
          <nav className="feat-jumps" aria-label="On this page">
            <ul>
              {jumps.map((j) => (
                <li key={j.href}>
                  <a className="feat-jump" href={j.href}>
                    {j.label}
                    <span className="num">{j.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div id="try" className="try">
        {demos.map(({ id, title, body, steps, note, wide, Demo }, i) => (
          <section key={id} id={id} className="try__item" aria-labelledby={`${id}-title`}>
            <div className={`wrap try__grid${wide ? " try__grid--wide" : ""}`}>
              <div className="try__text">
                <p className="try__num num">0{i + 1}</p>
                <h2 id={`${id}-title`}>{title}</h2>
                <p>{body}</p>
                <ol className="try__steps">
                  {steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
                {/* The demos are drawn in the browser; say so, so nobody takes them for the app itself. */}
                <p className="try__note">
                  <b>A preview, not the real notch.</b> It’s drawn in your browser to show how it works, so it looks and behaves a little differently from the app. {note}
                </p>
              </div>
              <div className="try__demo">
                <Demo />
              </div>
            </div>
          </section>
        ))}
      </div>

      <Features />
      <Widgets />
      <Tabs />

      <section className="feat-close wrap" aria-labelledby="feat-close-title">
        <div className="grid feat-close__grid">
          <div className="feat-close__head">
            <h2 id="feat-close-title">
              Free to use. Pro is {site.pro.price || "one purchase"}, once.
            </h2>
            <p>No subscription and no account.</p>
          </div>
          <div className="feat-close__act">
            <a className="btn" href={site.appStoreUrl}>Download on the Mac App Store</a>
            <a className="textlink" href="/#price">See what Pro adds</a>
          </div>
        </div>
      </section>
    </>
  );
}
