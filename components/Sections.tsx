import Icon from "./Icon";
import Reveal from "./Reveal";
import DownloadButton from "./DownloadButton";
import { features, widgets, tabs, faqs } from "@/lib/features";
import { site } from "@/lib/site";

export function Features() {
  return (
    <section className="section" id="features">
      <div className="shell">
        <Reveal>
          <span className="eyebrow-label">Everything it does</span>
          <h2 className="section-title">
            Twenty things you were opening an app for.
          </h2>
          <p className="section-lede">
            Turn on what you want, ignore the rest. Nothing here is a paid tier
            and nothing here phones home.
          </p>
        </Reveal>

        <div className="grid grid--3">
          {features.map((f, i) => (
            <Reveal key={f.title} as="article" delay={(i % 3) * 60}>
              <div className="card">
                <span className="card__icon">
                  <Icon name={f.icon} />
                </span>
                <span className="card__group">{f.group}</span>
                <h3 className="card__title">{f.title}</h3>
                <p className="card__body">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Tabs() {
  return (
    <section className="section section--alt" id="tabs">
      <div className="shell">
        <div className="split">
          <Reveal>
            <span className="eyebrow-label">Tabs</span>
            <h2 className="section-title">Open it, and it&apos;s yours.</h2>
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
            <ul className="tablist">
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
        <Reveal>
          <span className="eyebrow-label">Widgets</span>
          <h2 className="section-title">Sixteen widgets, three sizes.</h2>
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
                  <Icon name={w.icon} size={17} />
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
    <section className="section section--alt" id="privacy">
      <div className="shell">
        <Reveal>
          <div className="panel">
            <span className="panel__icon">
              <Icon name="lock" size={22} />
            </span>
            <h2 className="section-title">Nothing leaves your Mac.</h2>
            <p className="section-lede">
              There is no account, no sign-in and no server. Transcription runs
              on Apple&apos;s on-device speech recognition. Your clipboard,
              shelf, screenshots, calendar and held notifications are read and
              stored locally, and every permission is asked for only when you
              switch on the feature that needs it.
            </p>
            <ul className="chips">
              <li>No account</li>
              <li>No telemetry</li>
              <li>No ads</li>
              <li>On-device transcription</li>
              <li>Local storage only</li>
              <li>Revoke any permission, any time</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="shell">
        <Reveal>
          <div className="price">
            <span className="eyebrow-label">Price</span>
            <p className="price__figure num">Free</p>
            <h2 className="price__title">
              All of it. Not a trial, not a tier, not a teaser.
            </h2>
            <p className="section-lede price__lede">
              Every feature on this page ships in the free app. No subscription,
              no in-app purchase, no watermark, no ads, no upsell inside the
              notch. If it saves you a few seconds a day, that&apos;s the point.
            </p>
            <div className="price__actions">
              <DownloadButton />
              <a className="btn btn--ghost" href="/support">
                <Icon name="mail" size={16} />
                Talk to a human
              </a>
            </div>
            <p className="btn-note">
              {site.minMacOS} or later. Updates are free too.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section section--alt" id="faq">
      <div className="shell">
        <Reveal>
          <span className="eyebrow-label">Questions</span>
          <h2 className="section-title">The things people ask.</h2>
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
