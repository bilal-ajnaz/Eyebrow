import OpenTabs from "@/components/landing/OpenTabs";
import Shot from "@/components/landing/Shot";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: site.minMacOS,
  description: site.description,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/* Closed-notch moments, each at its true size: their smallness is the point. */
const moments = [
  { src: "closed-music.png", w: 268, px: 536, h: 72, alt: "Album art on the left of the notch, a live waveform on the right", caption: "Now Playing, with a live waveform" },
  { src: "closed-hud-volume.png", w: 198, px: 396, h: 138, alt: "A volume bar drawn under the notch", caption: "Volume, without the big overlay" },
  { src: "closed-battery-charging.png", w: 386, px: 771, h: 72, alt: "Charging, 82%, written across the notch with a battery icon", caption: "Plugged in, with the percentage" },
  { src: "closed-download.png", w: 268, px: 536, h: 72, alt: "A browser icon and a progress ring for a download in progress", caption: "A download and its progress" },
  { src: "closed-timer.png", w: 268, px: 536, h: 72, alt: "A focus timer at 24:59 counting down", caption: "A focus timer counting down" },
  { src: "closed-meeting-countdown.png", w: 268, px: 536, h: 72, alt: "Design Review starting in five minutes", caption: "Design Review in five minutes" },
  { src: "closed-claude-needs-approval.png", w: 268, px: 536, h: 72, alt: "An amber Claude mark with an exclamation point: a session needs permission", caption: "Claude Code waiting on you" },
  { src: "closed-call-muted.png", w: 268, px: 536, h: 72, alt: "A Zoom call with the microphone muted in red", caption: "Muted on a Zoom call" },
];

const themes = [
  { name: "Default", src: "theme-default.png", alt: "Home in the Default theme" },
  { name: "Retro", src: "theme-retro.png", alt: "Home in the Retro theme, amber on black" },
  { name: "Neon", src: "theme-neon.png", alt: "Home in the Neon theme" },
  { name: "Mono", src: "theme-mono.png", alt: "Home in the Mono theme" },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero__notch">
          <Shot
            src="open-home.png"
            w={640}
            width={1280}
            height={483}
            priority
            alt="Eyebrow's open notch: Golden Hour Drive by Nova Lane playing, 29°C, battery at 82% and Design Review next with a Join button"
          />
        </div>
        <div className="wrap grid hero__body">
          <h1 id="hero-title">{site.tagline}</h1>
          <div className="hero__side">
            <p>Music, volume, downloads and Claude Code, right where the notch sits.</p>
            <div className="hero__actions">
              <a className="btn" href={site.appStoreUrl}>Download on the Mac App Store</a>
              <a className="textlink" href="#open">See it open</a>
            </div>
            <p className="hero__note">Free. {site.minMacOS} or later.</p>
          </div>
        </div>
      </section>

      <section className="moments wrap" aria-labelledby="moments-title">
        <figure className="edge moments__idle">
          <Shot src="closed-idle.png" w={198} width={396} height={72} alt="The idle notch: a plain black notch, the same size as the hardware" />
        </figure>
        <div className="section-head moments__head">
          <h2 id="moments-title">Most of the time, it does nothing.</h2>
          <p>Then something happens, and it grows just enough to say so.</p>
        </div>
        <ul className="moments__grid">
          {moments.map((m) => (
            <li key={m.src}>
              <figure className="edge">
                <Shot src={m.src} w={m.w} width={m.px} height={m.h} alt={m.alt} />
                <figcaption>{m.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="open wrap" id="open" aria-labelledby="open-title">
        <OpenTabs
          intro={
            <>
              <h2 id="open-title">Point at the notch and it opens.</h2>
              <p>Move away and it closes again.</p>
            </>
          }
        />
      </section>

      <section className="claude wrap" aria-labelledby="claude-title">
        <div className="grid claude__grid">
          <figure className="edge claude__fig">
            <Shot src="open-claude-approval.png" w={640} width={1280} height={468} alt="Claude Code in eyebrow-website asks to run npm run build, with Deny and Allow buttons" />
            <div className="claude__pair">
              <div>
                <Shot src="closed-claude-working.png" w={268} width={536} height={72} alt="The Claude mark turning inside a ring while a session works" />
                <p>Working: the mark turns</p>
              </div>
              <div>
                <Shot src="closed-claude-needs-approval.png" w={268} width={536} height={72} alt="The Claude mark in amber with an exclamation point" />
                <p>Waiting: it turns amber</p>
              </div>
            </div>
          </figure>
          <div className="section-head">
            <h2 id="claude-title">Claude asks. You answer from the notch.</h2>
            <p>
              When a Claude Code session wants to run a command, Allow and Deny appear up top.
              Answering there comes with {site.pro.name}.
            </p>
          </div>
        </div>
      </section>

      <section className="themes" aria-labelledby="themes-title">
        <div className="wrap section-head">
          <h2 id="themes-title">Make it Retro, Neon or Mono.</h2>
          <p>Pick a theme in Settings › Appearance. Everything stays where it was.</p>
        </div>
        <ul className="rail" tabIndex={0} aria-label="Themes">
          {themes.map((t) => (
            <li key={t.name}>
              <figure className="edge">
                <Shot src={t.src} w={480} width={1280} height={483} alt={t.alt} />
                <figcaption>{t.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="price" id="price" aria-labelledby="price-title">
        <div className="wrap">
          <figure className="edge price__edge">
            <Shot src="closed-stacked-activities.png" w={372} width={744} height={72} alt="Music in the notch, with a timer and a download in small notches either side" />
            <figcaption>With Pro, a timer and a download stack beside the music.</figcaption>
          </figure>
          <h2 id="price-title">{site.pro.price}, once.</h2>
          <p className="price__lede">Eyebrow is free. Pro comes with a three-day trial.</p>
          <div className="grid price__lists">
            <div>
              <h3>Free</h3>
              <ul>
                <li>Now Playing and lyrics</li>
                <li>Volume and battery</li>
                <li>The Shelf and clipboard</li>
                <li>Screenshots and widgets</li>
              </ul>
            </div>
            <div>
              <h3>Pro adds</h3>
              <ul>
                <li>Stacked live activities</li>
                <li>Claude Code approvals</li>
                <li>Meeting reminders</li>
                <li>The floating shelf</li>
              </ul>
            </div>
            <dl className="facts">
              <div><dt>No account</dt><dd>Nothing to sign up for.</dd></div>
              <div><dt>No telemetry</dt><dd>Only weather, lyrics and scores go online.</dd></div>
              <div><dt>About 50&nbsp;MB</dt><dd>Of memory at idle.</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="close wrap" aria-labelledby="close-title">
        <figure className="edge">
          <Shot src="open-home-lyrics.png" w={640} width={1280} height={483} alt="Home with the current lyric under Golden Hour Drive by Nova Lane" />
        </figure>
        <div className="grid close__grid">
          <h2 id="close-title">Free on the Mac App Store.</h2>
          <div className="close__act">
            <a className="btn" href={site.appStoreUrl}>Download on the Mac App Store</a>
            <p className="hero__note">{site.minMacOS} or later. Apple silicon and Intel, notch or not.</p>
          </div>
        </div>
      </section>
    </>
  );
}
