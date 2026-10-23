import type { Metadata } from "next";
import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";
import Reveal from "@/components/Reveal";
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
      <section className="page-head">
        <div className="shell section-head">
          <span className="eyebrow-label">Features</span>
          <h1 className="page-head__title">
            Twenty-four things
            <br />
            <span className="section-title__muted">
              you were opening an app for.
            </span>
          </h1>
          <p className="section-lede">
            Turn on what you want, ignore the rest. Everything here not
            marked Pro is in the free app, and nothing here phones home. Pro
            raises a few ceilings and adds a few extras. Anything marked
            Coming soon arrives in the next update.
          </p>
          <nav className="filter" aria-label="On this page">
            {jumps.map((j) => (
              <a key={j.href} className="filter__chip" href={j.href}>
                {j.label}
                <span className="filter__count num">{j.count}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <Features bare />
      <Widgets />
      <Tabs />

      <section className="section">
        <div className="shell">
          <Reveal className="price">
            <span className="eyebrow-label">Eyebrow</span>
            <h2 className="section-title price__title">
              Free to use. Pro is {site.pro.price || "one purchase"}, once.
            </h2>
            <p className="section-lede price__lede">
              No subscription and no account. Turn on what you want and
              ignore the rest.
            </p>
            <div className="price__actions">
              <DownloadButton />
              <Link className="btn btn--ghost" href="/#pricing">
                See what Pro adds
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
