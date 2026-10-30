import "./features.css";
import type { Metadata } from "next";
import { Features, Tabs, Widgets } from "@/components/Sections";
import { features, widgets, tabs } from "@/lib/features";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features",
  description: `Every ${site.name} feature, widget and notch tab: Now Playing, HUDs, the Shelf, clipboard history, screenshots, call controls, Claude Code and more. Free, with a one-time Pro upgrade.`,
};

const jumps = [
  { href: "#features", label: "Features", count: features.length },
  { href: "#widgets", label: "Widgets", count: widgets.length },
  { href: "#tabs", label: "Tabs", count: tabs.length },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="page-head" aria-labelledby="features-title">
        <div className="wrap">
          <h1 id="features-title">Twenty-four things you were opening an app for.</h1>
          <p>
            Turn on what you want, ignore the rest. Everything here not marked
            Pro is in the free app, and nothing here phones home. Pro raises a
            few ceilings and adds a few extras.
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
