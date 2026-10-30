import NotchStory from "@/components/landing/NotchStory";
import Shot from "@/components/landing/Shot";
import ThemeRail from "@/components/landing/ThemeRail";
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <NotchStory />

      <ThemeRail />

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

      <section className="close" aria-labelledby="close-title">
        <div className="wrap">
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
        </div>
      </section>
    </>
  );
}
