import type { Metadata } from "next";
import Link from "next/link";
import Compare from "@/components/Compare";
import DownloadButton from "@/components/DownloadButton";
import Reveal from "@/components/Reveal";
import { checked } from "@/lib/compare";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare notch apps",
  description: `How ${site.name} compares with NotchNook, Alcove, The Boring Notch, DynamicLake Pro and other Mac notch apps — features and prices side by side.`,
};

export default function ComparePage() {
  return (
    <>
      <section className="page-head">
        <div className="shell section-head">
          <span className="eyebrow-label">Compare</span>
          <h1 className="page-head__title">
            Pick an app
            <br />
            <span className="section-title__muted">to compare.</span>
          </h1>
          <p className="section-lede">
            Tap any notch app to put it beside Eyebrow. Green means it ships
            today, amber means it&apos;s limited or partial.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <Compare />
          </Reveal>

          <p className="cmp-footnote">
            Checked {checked} against each app&apos;s own website, App Store
            listing or GitHub page. Apps change; if something here is out of
            date, <Link href="/support">tell us</Link> and we&apos;ll fix it.
            Product names belong to their developers.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal className="price">
            <span className="eyebrow-label">Eyebrow</span>
            <h2 className="section-title price__title">
              Free to use. Pro is {site.pro.price || "one purchase"}, once.
            </h2>
            <p className="section-lede price__lede">
              No subscription and no account. Download it from the Mac App
              Store and see for yourself.
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
