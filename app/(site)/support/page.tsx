import type { Metadata } from "next";
import SupportForm from "@/components/SupportForm";
import { faqs } from "@/lib/features";
import { site } from "@/lib/site";
import "./support.css";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with ${site.name}: report a bug, request a feature, or ask a question. Messages reach a real person.`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const before = [
  {
    title: "Check the feature is switched on",
    body: "Almost everything in Eyebrow is off until you enable it. Open Settings from the notch and look at the pane for the feature you're expecting.",
  },
  {
    title: "Check the permission was granted",
    body: "Mute, camera and leave during a call need Accessibility. Screenshot interception needs access to the folder your screenshots are saved to. Transcription needs Microphone and Speech Recognition. macOS only asks once.",
  },
  {
    title: "Check the display",
    body: "If the notch is on the wrong screen, set a preferred display, turn on all displays, or let it follow the screen you're working on.",
  },
];

export default function SupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="page-head">
        <div className="wrap">
          <h1>Something not working?</h1>
          <p>
            Eyebrow is free, but support isn&apos;t automated. Send a message
            and a person reads it, or write to{" "}
            <a className="textlink" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </p>
        </div>
      </section>

      <section className="help" id="bug">
        <div className="wrap grid help__grid">
          <div className="help__aside">
            <h3 className="help__h">Worth trying first</h3>
            <ol className="help__checks">
              {before.map((b) => (
                <li key={b.title}>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </li>
              ))}
            </ol>

            <div className="help__note" id="feature">
              <h3 className="help__h">Requesting a feature?</h3>
              <p>
                Say what you&apos;re trying to get done, not just the control
                you want. It&apos;s the difference between a feature that
                ships and one that sits in a list.
              </p>
            </div>

            <div className="help__note">
              <h3 className="help__h">Reporting a bug?</h3>
              <p>
                Include your macOS version, which feature was on, and what you
                expected instead. If it involves a specific app, like Zoom,
                Spotify or Chrome, name it.
              </p>
            </div>
          </div>

          <div className="help__main">
            <h2 className="help__h help__h--lg">Send a message</h2>
            <SupportForm />
          </div>
        </div>
      </section>

      <section className="faq" id="faq" aria-labelledby="faq-title">
        <div className="wrap grid faq__grid">
          <div className="section-head faq__head">
            <h2 id="faq-title">The things people ask.</h2>
          </div>
          <div className="faq__list">
            {faqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
