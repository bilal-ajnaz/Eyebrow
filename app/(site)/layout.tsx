import "./site.css";
import Link from "next/link";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = baseMetadata;
export const viewport = baseViewport;

/* Every page shares this layout: the black bar, the footer and site.css.
   Each inner page adds its own stylesheet beside its page.tsx. */
const links = [
  { href: "/features", label: "Features" },
  { href: "/compare", label: "Compare" },
  { href: "/#price", label: "Price" },
  { href: "/support#faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];
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
            <Link className="mark" href="/" aria-label={`${site.name}, home`}>
              <img src="/landing/icon-256.png" width={256} height={256} alt="" />
              <span>{site.name}</span>
            </Link>
            <nav className="bar__nav" aria-label="Primary">
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link className="bar__link" href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a className="btn btn--quiet bar__cta" href={site.appStoreUrl}>
              Download
            </a>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="foot">
          <div className="wrap foot__in">
            <Link className="mark" href="/" aria-label={`${site.name}, home`}>
              <img src="/landing/icon-256.png" width={256} height={256} alt="" loading="lazy" />
              <span>{site.name}</span>
            </Link>
            <nav aria-label="Footer">
              <ul>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/compare">Compare</Link></li>
                <li><Link href="/support#faq">FAQ</Link></li>
                <li><Link href="/support">Support</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
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
