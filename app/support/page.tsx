import type { Metadata } from "next";
import SupportForm from "@/components/SupportForm";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with ${site.name} — report a bug, request a feature, or ask a question. Messages reach a real person.`,
};

const before = [
  {
    icon: "gear",
    title: "Check the feature is switched on",
    body: "Almost everything in Eyebrow is off until you enable it. Open Settings from the notch and look at the pane for the feature you're expecting.",
  },
  {
    icon: "lock",
    title: "Check the permission was granted",
    body: "HUD replacement and Zoom mute detection need Accessibility. Screenshot interception needs Screen Recording. Transcription needs Microphone and Speech Recognition. macOS only asks once.",
  },
  {
    icon: "display",
    title: "Check the display",
    body: "If the notch is on the wrong screen, set a preferred display, turn on all displays, or let it follow the screen you're working on.",
  },
];

export default function SupportPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <span className="eyebrow-label">Support</span>
          <h1 className="page-head__title">Something not working?</h1>
          <p className="section-lede">
            Eyebrow is free, but support isn&apos;t automated. Send a message
            and a person reads it — bug reports genuinely do turn into fixes.
          </p>
          <p className="page-head__mail">
            <Icon name="mail" size={16} />
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
          </p>
        </div>
      </section>

      <section className="section" id="bug">
        <div className="shell support">
          <div className="support__aside">
            <Reveal>
              <h2 className="support__h">Worth trying first</h2>
              <ul className="support__list">
                {before.map((b) => (
                  <li key={b.title}>
                    <span className="support__icon">
                      <Icon name={b.icon} size={16} />
                    </span>
                    <div>
                      <p className="support__title">{b.title}</p>
                      <p className="support__body">{b.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="support__box" id="feature">
                <h2 className="support__h">Requesting a feature?</h2>
                <p className="support__body">
                  Say what you&apos;re trying to get done, not just the control
                  you want. It&apos;s the difference between a feature that
                  ships and one that sits in a list.
                </p>
              </div>

              <div className="support__box">
                <h2 className="support__h">Reporting a bug?</h2>
                <p className="support__body">
                  Include your macOS version, which feature was on, and what you
                  expected instead. If it involves a specific app — Zoom,
                  Spotify, Chrome — name it.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="support__main">
            <Reveal delay={80}>
              <div className="support__card">
                <h2 className="support__h support__h--lg">Send a message</h2>
                <SupportForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
