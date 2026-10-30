"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DownloadButton from "./DownloadButton";

const links = [
  { href: "/#open", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/#price", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/support#faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

/** Above this the links sit in the island; keep in step with globals.css. */
const WIDE = "(min-width: 861px)";

export default function Nav() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // a new page closes the menu
  useEffect(() => setOpen(false), [pathname]);

  // so does Escape, a tap anywhere else, or the window growing past it
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia(WIDE);
    const onWide = () => wide.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header className="nav" data-condensed={condensed} ref={headerRef}>
      <nav className="nav__bar" aria-label="Primary">
        <div className="nav__island">
          <Link href="/" className="nav__brand">
            <Image
              src="/icon-256.png"
              alt=""
              width={26}
              height={26}
              className="nav__mark"
              priority
            />
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

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav__bars" aria-hidden="true" />
          </button>
        </div>

        {/* The same links, for windows too narrow to hold them in the
            island. A sibling of the island, so its glass has the page
            behind it to refract rather than the island. */}
        <ul className="nav__menu" id="nav-menu" hidden={!open}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
