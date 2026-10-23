"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DownloadButton from "./DownloadButton";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#widgets", label: "Widgets" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/support", label: "Support" },
];

/** What the notch says on pages that aren't the home page. */
const pageLabels: Record<string, string> = {
  "/support": "Support",
  "/privacy": "Privacy",
  "/compare": "Compare",
};

/** Above this the links sit in the bar; keep in step with globals.css. */
const WIDE = "(min-width: 1021px)";

type Live = { n: string; label: string } | null;

/** The time, as the menu bar would show it. Client-only, so the server
    never renders a time that is already wrong. */
function useClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setNow(format.format(new Date()).replace(/,/g, ""));
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

/**
 * The page's own notch. On the home page it does what Eyebrow does: nothing
 * at the top, then, as each numbered section crosses the middle of the
 * window, a live activity with its number and name either side of the
 * hardware. Elsewhere it names the page.
 */
function useLive(pathname: string): Live {
  const [live, setLive] = useState<Live>(null);

  useEffect(() => {
    if (pageLabels[pathname]) {
      setLive({ n: "", label: pageLabels[pathname] });
      return;
    }
    setLive(null);

    const marks = Array.from(
      document.querySelectorAll<HTMLElement>("main [data-notch]"),
    );
    if (!marks.length) return;

    const showing = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) showing.add(el);
          else showing.delete(el);
        }
        // the last section in document order that holds the middle line
        const current = marks.filter((m) => showing.has(m)).pop();
        setLive(
          current
            ? { n: current.dataset.n ?? "", label: current.dataset.notch ?? "" }
            : null,
        );
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    marks.forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, [pathname]);

  return live;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const live = useLive(pathname);
  const clock = useClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
    <header
      className="nav"
      data-scrolled={scrolled}
      data-open={open}
      ref={headerRef}
    >
      {/* A Mac menu bar: the app and its menus on the left, status on the
          right, and the notch between them. */}
      <nav className="nav__bar" aria-label="Primary">
        <div className="nav__menus">
          <Link href="/" className="nav__brand">
            <Image
              src="/icon-256.png"
              alt=""
              width={22}
              height={22}
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
        </div>

        <div className="nav__notch" data-live={live !== null} aria-hidden="true">
          <span className="nav__wing nav__wing--start">
            <span className="num" key={`n-${live?.n}`}>
              {live?.n}
            </span>
          </span>
          <span className="nav__hw" />
          <span className="nav__wing nav__wing--end">
            <span key={`l-${live?.label}`}>{live?.label}</span>
          </span>
        </div>

        <div className="nav__status">
          <span className="nav__clock num" suppressHydrationWarning>
            {clock}
          </span>
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
      </nav>

      {/* The same links, for windows too narrow to hold them in the bar. */}
      <ul className="nav__menu" id="nav-menu" hidden={!open}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
