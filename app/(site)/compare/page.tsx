import "./compare.css";
import type { Metadata } from "next";
import Link from "next/link";
import Compare from "@/components/Compare";
import { checked } from "@/lib/compare";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare notch apps",
  description: `How ${site.name} compares with NotchNook, Alcove, The Boring Notch, DynamicLake Pro and other Mac notch apps: features and prices side by side.`,
};

export default function ComparePage() {
  return (
    <>
      <section className="page-head" aria-labelledby="compare-title">
        <div className="wrap">
          <h1 id="compare-title">Pick an app to compare.</h1>
          <p>
            Choose any notch app to put it beside Eyebrow. Green means it ships
            today, amber means it&apos;s limited or partial.
          </p>
        </div>
      </section>

      <section className="cmp-section wrap" aria-label="Comparison">
        <Compare />

        <p className="cmp-footnote">
          Checked {checked} against each app&apos;s own website, App Store
          listing or GitHub page. Apps change; if something here is out of
          date, <Link className="textlink" href="/support">tell us</Link> and
          we&apos;ll fix it. Product names belong to their developers.
        </p>
      </section>

      <section className="cmp-close" aria-labelledby="cmp-close-title">
        <div className="wrap grid cmp-close__grid">
          <div className="section-head cmp-close__head">
            <h2 id="cmp-close-title">
              Free to use. Pro is {site.pro.price || "one purchase"}, once.
            </h2>
            <p>
              No subscription and no account. Download it from the Mac App
              Store and see for yourself.
            </p>
          </div>
          <div className="cmp-close__act">
            <a className="btn" href={site.appStoreUrl}>Download on the Mac App Store</a>
            <Link className="textlink" href="/#price">See what Pro adds</Link>
          </div>
        </div>
      </section>
    </>
  );
}
