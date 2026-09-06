"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DownloadButton from "./DownloadButton";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#widgets", label: "Widgets" },
  { href: "/#faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

export default function Nav() {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav" data-condensed={condensed}>
      <nav className="nav__island" aria-label="Primary">
        <Link href="/" className="nav__brand">
          <span className="nav__mark" aria-hidden="true" />
          Eyebrow
        </Link>

        <ul className="nav__links">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <span className="nav__cta">
          <DownloadButton label="Get it free" />
        </span>
      </nav>
    </header>
  );
}
