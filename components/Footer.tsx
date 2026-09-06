import Link from "next/link";
import { site } from "@/lib/site";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <span className="nav__mark" aria-hidden="true" />
          <div>
            <p className="footer__name">{site.name}</p>
            <p className="footer__tag">{site.tagline}</p>
          </div>
        </div>

        <nav className="footer__cols" aria-label="Footer">
          <div>
            <h2>Product</h2>
            <ul>
              <li><Link href="/#how">How it works</Link></li>
              <li><Link href="/#features">Features</Link></li>
              <li><Link href="/#widgets">Widgets</Link></li>
              <li><Link href="/#pricing">Price</Link></li>
            </ul>
          </div>
          <div>
            <h2>Help</h2>
            <ul>
              <li><Link href="/support">Support</Link></li>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><Link href="/support#bug">Report a bug</Link></li>
              <li><Link href="/support#feature">Request a feature</Link></li>
            </ul>
          </div>
          <div>
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${site.supportEmail}`}>
                  <Icon name="mail" size={14} />
                  {site.supportEmail}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="shell footer__base">
        <p>
          © {new Date().getFullYear()} {site.name}. Free, and staying that way.
        </p>
        <p>{site.minMacOS} or later</p>
      </div>
    </footer>
  );
}
