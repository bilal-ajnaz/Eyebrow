import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";
import DownloadButton from "./DownloadButton";
import FeatureGrid from "./FeatureGrid";
import Magnetic from "./Magnetic";
import { widgets, tabs, faqs, plans } from "@/lib/features";
import { site } from "@/lib/site";

export function Features() {
  return (
    <section className="section" id="features">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow-label">Everything it does</span>
          <h2 className="section-title">
            Twenty things
            <br />
            <span className="section-title__muted">
              you were opening an app for.
            </span>
          </h2>
          <p className="section-lede">
            Turn on what you want, ignore the rest. Everything here except
            Face Unlock is in the free app, and nothing here phones home. Pro
            raises a few ceilings and adds a few extras.
          </p>
        </Reveal>

        <FeatureGrid />
      </div>
    </section>
  );
}

export function Tabs() {
  return (
    <section className="section" id="tabs">
      <div className="shell">
        <div className="split">
          <Reveal className="section-head section-head--start">
            <span className="eyebrow-label">Tabs</span>
            <h2 className="section-title">
              Open it,
              <br />
              <span className="section-title__muted">and it&apos;s yours.</span>
            </h2>
            <p className="section-lede">
              Hover — or use a two-finger swipe, or a keyboard shortcut — and the
              notch opens. Choose which tabs live there, reorder them, rename
              them, and have it remember the one you were last on.
            </p>
            <ul className="keyline">
              <li>
                <Icon name="keyboard" size={16} />
                <span>
                  <kbd>⇧</kbd>
                  <kbd>⌘</kbd>
                  <kbd>I</kbd> to open, <kbd>⇧</kbd>
                  <kbd>⌘</kbd>
                  <kbd>C</kbd> for clipboard, <kbd>⇧</kbd>
                  <kbd>⌘</kbd>
                  <kbd>H</kbd> for a sneak peek
                </span>
              </li>
              <li>
                <Icon name="display" size={16} />
                <span>
                  All displays at once, one you pin, or whichever you&apos;re
                  working on
                </span>
              </li>
              <li>
                <Icon name="eye" size={16} />
                <span>
                  Hide it on lock screen or during screen recording, and it
                  steps aside for full-screen video
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={80}>
            <ul
              className="tablist"
              tabIndex={0}
              aria-label="Tabs you can put in the notch"
            >
              {tabs.map((t) => (
                <li key={t.name}>
                  <span className="tablist__name">{t.name}</span>
                  <span className="tablist__body">{t.body}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Widgets() {
  return (
    <section className="section" id="widgets">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow-label">Widgets</span>
          <h2 className="section-title">
            Sixteen widgets,
            <br />
            <span className="section-title__muted">three sizes.</span>
          </h2>
          <p className="section-lede">
            Build the layout you actually use, or start from a preset — Minimal,
            Productivity, Media or Complete — and change it later.
          </p>
        </Reveal>

        <div className="grid grid--4">
          {widgets.map((w, i) => (
            <Reveal key={w.name} as="article" delay={(i % 4) * 50}>
              <div className="tile">
                <span className="tile__icon">
                  <Icon name={w.icon} size={18} />
                </span>
                <span className="tile__name">{w.name}</span>
                <span className="tile__body">{w.body}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <section className="section" id="privacy">
      <div className="shell">
        <Reveal>
          <div className="panel">
            <span className="panel__icon">
              <Icon name="lock" size={22} />
            </span>
            <h2 className="section-title">
              No account.
              <br />
              <span className="section-title__muted">No tracking.</span>
            </h2>
            <p className="section-lede">
              There is no sign-in and no server of ours to send anything to.
              Your clipboard, shelf, screenshots and calendar stay on
              your Mac, transcription runs on
              Apple&apos;s on-device recogniser, and every permission is asked
              for only when you switch on the feature that needs it.
            </p>
            <p className="section-lede">
              Three optional features do reach the internet, because they
              can&apos;t work otherwise — Weather, Lyrics and sports scores.
              Rather than gloss over that, the privacy policy lists every
              request the app can make, what it sends, and how to switch it
              off.
            </p>
            <ul className="chips">
              <li>No account</li>
              <li>No telemetry</li>
              <li>No ads</li>
              <li>On-device transcription</li>
              <li>Revoke any permission, any time</li>
            </ul>
            <p className="panel__link">
              <Link className="textlink" href="/privacy">
                Read the privacy policy ›
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Pricing() {
  const proPrice = site.pro.price.length > 0 ? site.pro.price : "One-time";

  return (
    <section className="section" id="pricing">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow-label">Pricing</span>
          <h2 className="section-title">
            Free to use.
            <br />
            <span className="section-title__muted">Pro, if you want more.</span>
          </h2>
          <p className="section-lede">
            The free app is the whole app — not a trial, not a teaser. Pro is
            one purchase, made once inside the app, that raises a couple of
            limits and adds things that did not exist before. No subscription,
            no upsell inside the notch.
          </p>
        </Reveal>

        <div className="plans">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} as="article" delay={i * 80}>
              <div className={`plan plan--${plan.id}`}>
                <span className="plan__name">{plan.name}</span>
                <p className="plan__figure num">
                  {plan.id === "free" ? "Free" : proPrice}
                </p>
                <p className="plan__summary">{plan.summary}</p>
                <ul className="plan__list">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="plan__note">
                  {plan.id === "free"
                    ? `${site.minMacOS} or later. Updates are free too.`
                    : "Bought in the app, under Settings › Pro. Restore Purchases brings it to any Mac signed in to your Apple Account."}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="price__actions">
            <Magnetic>
              <DownloadButton />
            </Magnetic>
            <Magnetic>
              <a className="btn" href="/support">
                <Icon name="mail" size={17} />
                Talk to a human
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow-label">Questions</span>
          <h2 className="section-title">
            The things
            <br />
            <span className="section-title__muted">people ask.</span>
          </h2>
        </Reveal>

        <div className="faq">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <details className="faq__item">
                <summary>
                  {f.q}
                  <span className="faq__plus" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
