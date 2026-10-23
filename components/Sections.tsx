import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";
import DownloadButton from "./DownloadButton";
import FeatureGrid from "./FeatureGrid";
import Magnetic from "./Magnetic";
import { widgets, tabs, faqs, plans } from "@/lib/features";
import { site } from "@/lib/site";

/* Every home section opens the same way: a rule, its number and name on
   the left, the headline on the right. `data-notch` is what the page's
   own notch says while the section holds the middle of the window. */
function Head({
  n,
  label,
  title,
  muted,
  children,
}: {
  n: string;
  label: string;
  title: React.ReactNode;
  muted: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="section-head">
      <span className="eyebrow-label">
        <span className="num">{n}</span>
        {label}
      </span>
      <div className="section-head__main">
        <h2 className="section-title">
          {title} <span className="section-title__muted">{muted}</span>
        </h2>
        {children}
      </div>
    </Reveal>
  );
}

export function Features() {
  return (
    <section className="section" id="features" data-notch="Features" data-n="02">
      <div className="shell">
        <Head
          n="02"
          label="Everything it does"
          title="Twenty-four things"
          muted="you were opening an app for."
        >
          <p className="section-lede">
            Turn on what you want, ignore the rest. Everything here not
            marked Pro is in the free app, and nothing here phones home. Pro
            raises a few ceilings and adds a few extras. Anything marked
            Coming soon arrives in the next update.
          </p>
        </Head>

        <FeatureGrid />
      </div>
    </section>
  );
}

export function Tabs() {
  return (
    <section className="section" id="tabs" data-notch="Tabs" data-n="03">
      <div className="shell">
        <Head n="03" label="Tabs" title="Open it," muted="and it's yours.">
          <p className="section-lede">
            Hover — or use a two-finger swipe, or a keyboard shortcut — and the
            notch opens. Choose which tabs live there, reorder them, rename
            them, and have it remember the one you were last on.
          </p>
        </Head>

        <div className="split">
          <Reveal>
            <ol className="tablist" aria-label="Tabs you can put in the notch">
              {tabs.map((t, i) => (
                <li key={t.name}>
                  <span className="tablist__n num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="tablist__name">{t.name}</span>
                  <span className="tablist__body">{t.body}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={80}>
            <ul className="keyline">
              <li>
                <Icon name="sliders" size={16} />
                <span>
                  Vertical tabs, with Pro: a scroll wheel down the side of the
                  notch, with a click for every tab, and as many tabs as you
                  like.
                </span>
              </li>
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
        </div>
      </div>
    </section>
  );
}

export function Widgets() {
  return (
    <section className="section" id="widgets" data-notch="Widgets" data-n="04">
      <div className="shell">
        <Head n="04" label="Widgets" title="Eighteen widgets," muted="three sizes.">
          <p className="section-lede">
            Build the layout you actually use, or start from a preset — Minimal,
            Productivity, Media or Complete — and change it later.
          </p>
        </Head>

        <Reveal>
          <ul className="specs">
            {widgets.map((w, i) => (
              <li key={w.name} className="spec">
                <span className="spec__top">
                  <Icon name={w.icon} size={16} />
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="spec__name">
                  {w.name}
                  {w.soon && (
                    <span className="soon">
                      {w.soon === "update" ? "Update soon" : "Coming soon"}
                    </span>
                  )}
                </span>
                <span className="spec__body">{w.body}</span>
              </li>
            ))}
            <li className="spec spec--sizes">
              <span className="spec__sizes" aria-hidden="true">
                <i data-s="s" />
                <i data-s="m" />
                <i data-s="l" />
              </span>
              <span className="spec__body">Small, medium and large</span>
            </li>
            <li className="spec spec--presets">
              <span className="spec__name">Four presets</span>
              <span className="spec__body">
                Minimal, Productivity, Media, Complete
              </span>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* What the app can send, from the privacy policy's outbound table. */
const outbound = [
  { what: "Weather", sends: "Approximate coordinates", to: "Open-Meteo, Apple" },
  { what: "Lyrics", sends: "The track's title and artist", to: "LRCLIB" },
  { what: "Sports scores", sends: "Nothing about you", to: "ESPN" },
  { what: "Crypto prices", sends: "Nothing about you · off by default", to: "CoinGecko" },
];

export function Privacy() {
  return (
    <section className="section" id="privacy" data-notch="Privacy" data-n="05">
      <div className="shell">
        <Head n="05" label="Privacy" title="No account." muted="No tracking." />

        <div className="split split--even">
          <Reveal className="prose-cols">
            <p>
              There is no sign-in and no server of ours to send anything to.
              Your clipboard, shelf, screenshots and calendar stay on your Mac,
              transcription runs on Apple&apos;s on-device recogniser, and
              every permission is asked for only when you switch on the
              feature that needs it.
            </p>
            <p>
              A few optional features do reach the internet, because they
              can&apos;t work otherwise. Rather than gloss over that, here is
              the whole list — and the privacy policy has every request in
              full, with how to switch it off.
            </p>
            <p>
              <Link className="textlink" href="/privacy">
                Read the privacy policy ›
              </Link>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <table className="ledger">
              <caption>Everything that leaves your Mac, and only when it&apos;s on</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Sends</th>
                  <th scope="col">To</th>
                </tr>
              </thead>
              <tbody>
                {outbound.map((o) => (
                  <tr key={o.what}>
                    <th scope="row">{o.what}</th>
                    <td>{o.sends}</td>
                    <td>{o.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const proPrice = site.pro.price.length > 0 ? site.pro.price : "One-time";

  return (
    <section className="section" id="pricing" data-notch="Pricing" data-n="06">
      <div className="shell">
        <Head n="06" label="Pricing" title="Free to use." muted="Pro, if you want more.">
          <p className="section-lede">
            The free app is the whole app — not a trial, not a teaser. Pro is
            one purchase, made once inside the app, that raises a couple of
            limits and adds things that did not exist before. No subscription,
            no upsell inside the notch.
          </p>
        </Head>

        <div className="plans">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} as="article" delay={i * 80}>
              <div className={`plan plan--${plan.id}`}>
                <div className="plan__top">
                  <span className="plan__name">{plan.name}</span>
                  <p className="plan__figure num">
                    {plan.id === "free" ? "Free" : proPrice}
                  </p>
                  <p className="plan__summary">{plan.summary}</p>
                </div>
                <ul className="plan__list">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={14} />
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
          <div className="price__actions price__actions--start">
            <Magnetic>
              <DownloadButton />
            </Magnetic>
            <a className="textlink" href="/support">
              Or talk to a human ›
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section" id="faq" data-notch="Questions" data-n="07">
      <div className="shell">
        <Head n="07" label="Questions" title="The things" muted="people ask." />

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
