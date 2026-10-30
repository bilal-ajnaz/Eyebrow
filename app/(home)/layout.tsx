import "./home.css";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = baseMetadata;
export const viewport = baseViewport;

/* The home page has its own root layout: its own fonts, header and footer,
   and only home.css, so its class names never meet globals.css. Moving to
   /features and the other pages is a full page load. */
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        {/* Before first paint, so the tab switcher never flashes every panel. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@600&f[]=switzer@400,600&display=swap"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>

        <header className="bar">
          <div className="wrap bar__in">
            <a className="mark" href="#top" aria-label={`${site.name}, back to the top`}>
              <img src="/landing/icon-256.png" width={256} height={256} alt="" />
              <span>{site.name}</span>
            </a>
            <div className="bar__end">
              <a className="bar__link" href="/features">Features</a>
              <a className="bar__link" href="#price">Price</a>
              <a className="btn btn--quiet" href={site.appStoreUrl}>
                Download
              </a>
            </div>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="foot">
          <div className="wrap foot__in">
            <a className="mark" href="#top" aria-label={`${site.name}, back to the top`}>
              <img src="/landing/icon-256.png" width={256} height={256} alt="" loading="lazy" />
              <span>{site.name}</span>
            </a>
            <nav aria-label="Footer">
              <ul>
                <li><a href="/features">Features</a></li>
                <li><a href="/compare">Compare</a></li>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/support">Support</a></li>
                <li><a href={site.appStoreUrl}>App Store</a></li>
              </ul>
            </nav>
            <p className="foot__small">
              © 2026 {site.name}. Screens are the app’s own renders, with sample music and events.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
