"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import Icon from "./Icon";

const topics = [
  "Bug report",
  "Feature request",
  "Question",
  "Permissions / privacy",
  "Something else",
];

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "handoff" }
  | { kind: "error"; message: string };

export default function SupportForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }

      // Server has no mail provider configured (or it failed) — hand the
      // message to the visitor's own mail app, pre-filled.
      if (result.fallback === "mailto") {
        const href =
          `mailto:${result.to}` +
          `?subject=${encodeURIComponent(result.subject)}` +
          `&body=${encodeURIComponent(result.body)}`;
        window.location.href = href;
        setStatus({ kind: "handoff" });
        return;
      }

      setStatus({
        kind: "error",
        message: result.error ?? "That didn't go through. Try again?",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Couldn't reach the server. Check your connection and retry.",
      });
    }
  }

  const sending = status.kind === "sending";

  // The submit button's label changes width when it changes text. Measure
  // the old and new widths and let the button spring between them, rather
  // than jumping (the transition lives on .btn in globals.css).
  const submitRef = useRef<HTMLButtonElement>(null);
  const lastWidth = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = submitRef.current;
    if (!el) return;
    const from = lastWidth.current;
    el.style.inlineSize = "";
    const to = el.getBoundingClientRect().width;
    if (from !== null && Math.abs(from - to) > 0.5) {
      el.style.transition = "none";
      el.style.inlineSize = `${from}px`;
      void el.offsetWidth; // flush, so the next write animates
      el.style.transition = "";
      el.style.inlineSize = `${to}px`;
    }
    lastWidth.current = to;
  }, [sending]);

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <label className="field">
          <span className="field__label">Your name</span>
          <input
            className="field__input"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            placeholder="Alex Rivera"
          />
        </label>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="field__input"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="form__row">
        <label className="field">
          <span className="field__label">What&apos;s this about?</span>
          <select className="field__input" name="topic" defaultValue="Question">
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">
            macOS version <span className="field__hint">optional</span>
          </span>
          <input
            className="field__input"
            name="macos"
            type="text"
            maxLength={60}
            placeholder="15.5"
          />
        </label>
      </div>

      <label className="field">
        <span className="field__label">Message</span>
        <textarea
          className="field__input field__input--area"
          name="message"
          required
          rows={7}
          maxLength={5000}
          placeholder="What happened, what you expected, and — for bugs — which feature was switched on."
        />
      </label>

      {/* honeypot — hidden from people, catches bots */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form__foot">
        <button
          ref={submitRef}
          className="btn btn--primary"
          type="submit"
          disabled={sending}
          onTransitionEnd={(e) => {
            if (e.propertyName === "inline-size" || e.propertyName === "width") {
              e.currentTarget.style.inlineSize = "";
            }
          }}
        >
          <span className="btn__label" key={sending ? "sending" : "idle"}>
            {sending ? "Sending…" : "Send message"}
            {!sending && <Icon name="arrow" size={16} />}
          </span>
        </button>

        <p className="form__note">
          Goes straight to{" "}
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
        </p>
      </div>

      <div className="form__status" role="status" aria-live="polite">
        {status.kind === "sent" && (
          <p className="notice notice--good">
            <Icon name="check" size={16} />
            Sent. You&apos;ll get a reply at the address you gave, usually
            within a day or two.
          </p>
        )}

        {status.kind === "handoff" && (
          <p className="notice">
            <Icon name="mail" size={16} />
            Your mail app should have opened with the message ready to send. If
            it didn&apos;t, email{" "}
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>{" "}
            directly.
          </p>
        )}

        {status.kind === "error" && (
          <p className="notice notice--bad">
            <Icon name="bell" size={16} />
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
