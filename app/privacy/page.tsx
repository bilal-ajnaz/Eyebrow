import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Eyebrow stores on your Mac, the three optional features that contact a third party, and what we never collect. No account, no analytics, no ads.",
};

const EFFECTIVE = "7 September 2026";

/** Every outbound request the app can make, and what triggers it. */
const outbound = [
  {
    service: "Open-Meteo",
    sent: "Your approximate coordinates, at roughly kilometre accuracy",
    when: "Every 30 minutes while Weather is switched on",
    off: "Settings › Weather, or deny Location access",
  },
  {
    service: "Apple (geocoding)",
    sent: "The same coordinates, to turn them into a place name",
    when: "Once per location change, while Weather is switched on",
    off: "Settings › Weather, or deny Location access",
  },
  {
    service: "LRCLIB",
    sent: "The title and artist of the track playing",
    when: "On track change, while Lyrics is switched on",
    off: "Settings › Media › Lyrics",
  },
  {
    service: "ESPN",
    sent: "Nothing about you — a request for public scoreboard data",
    when: "While sports in Live Widgets is switched on",
    off: "Settings › Widgets › Live Widgets",
  },
  {
    service: "Your media app's artwork host",
    sent: "Nothing about you — a request for the artwork image your media app points at",
    when: "While playing something whose artwork is a remote URL",
    off: "Applies only to sources that supply remote artwork",
  },
  {
    service: "LottieFiles",
    sent: "Nothing about you — a request for a default animation file",
    when: "When a visualiser has no local animation file",
    off: "Choose a visualiser with a local file",
  },
  {
    service: "GitHub Pages",
    sent: "Nothing about you — a request for the update feed",
    when: "On update checks",
    off: "Settings › General › automatic update checks",
  },
];

const local = [
  ["Clipboard history", "Text, links, images, screenshots, colours and files you copied, kept for the retention period you chose (7, 30 or 365 days)."],
  ["Shelf items", "Files you dragged into the notch, held in the app's own storage until you remove them or drag them out."],
  ["Screenshots", "Captures intercepted before they reach your desktop, until you save, copy or dismiss them."],
  ["Calendar and Reminders", "Read from macOS to display your day. Never copied anywhere else."],
  ["Notifications", "Held in the notch during Focus and shown back to you as a digest."],
  ["Transcription", "Speech is transcribed by Apple's on-device recogniser. Audio never leaves your Mac and is not written to disk."],
  ["Browser tabs and messages", "Read from the apps you allow, shown in the notch, never stored or transmitted."],
  ["Settings", "Your preferences, stored in the app's own settings on your Mac."],
];

const permissions = [
  ["Calendar and Reminders", "To show your events and reminders."],
  ["Microphone and Speech Recognition", "For on-device transcription."],
  ["Accessibility", "To replace the system HUDs and read mute state in call apps."],
  ["Screen Recording", "To intercept screenshots before they reach the desktop."],
  ["Notifications", "To hold notifications during Focus."],
  ["Location", "To fetch weather for where you are."],
  ["Bluetooth", "To read the battery level of connected devices."],
  ["Contacts", "To show names alongside messages."],
];

export default function PrivacyPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <span className="eyebrow-label">Legal</span>
          <h1 className="page-head__title">Privacy Policy</h1>
          <p className="section-lede">
            Written to be read, not to protect us. It says exactly what Eyebrow
            stores, what it sends, and when.
          </p>
          <p className="page-head__meta num">Effective {EFFECTIVE}</p>
        </div>
      </section>

      <section className="section prose-section">
        <div className="shell prose">
          <div className="callout">
            <span className="callout__icon">
              <Icon name="lock" size={20} />
            </span>
            <div>
              <h2 className="callout__title">The short version</h2>
              <p>
                Eyebrow has no account, no sign-in, no analytics, no
                advertising and no tracking. We do not run a server that
                receives your data, so there is nothing for us to collect,
                sell or hand over. We cannot see your clipboard, your files,
                your calendar or your screen.
              </p>
              <p>
                Three optional features contact a third party, because they
                cannot work otherwise: <strong>Weather</strong>,{" "}
                <strong>Lyrics</strong> and <strong>sports scores</strong> in
                Live Widgets. Each is listed in full below, and each can be
                switched off.
              </p>
            </div>
          </div>

          <h2>What we collect about you</h2>
          <p>
            Nothing. Eyebrow does not create an account, assign you an
            identifier, or send us usage statistics, crash reports or
            diagnostics. There is no telemetry in the app.
          </p>

          <h2>What stays on your Mac</h2>
          <p>
            All of the following is read and stored locally, in the app&apos;s
            own storage on your machine. None of it is uploaded, and none of it
            is readable by us.
          </p>
          <dl className="deflist">
            {local.map(([term, body]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>

          <h2 id="third-parties">What leaves your Mac, and exactly when</h2>
          <p>
            These are every outbound request Eyebrow can make. Where a row says
            &ldquo;nothing about you&rdquo;, the request carries no personal
            data — though, as with any web request, the service receives your
            IP address. We receive none of it.
          </p>

          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">What is sent</th>
                  <th scope="col">When</th>
                  <th scope="col">How to stop it</th>
                </tr>
              </thead>
              <tbody>
                {outbound.map((row) => (
                  <tr key={row.service}>
                    <th scope="row">{row.service}</th>
                    <td>{row.sent}</td>
                    <td>{row.when}</td>
                    <td>{row.off}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Each of these services has its own privacy policy, and their
            handling of a request is theirs, not ours. Open-Meteo receives no
            identifier alongside the coordinates, and Eyebrow sends no API key
            or account with any of these requests.
          </p>

          <h2>Permissions, and why each is asked for</h2>
          <p>
            macOS asks before granting any of these, and Eyebrow only requests
            one when you switch on the feature that needs it. Every one is
            optional, and you can revoke any of them in System Settings ›
            Privacy &amp; Security at any time. Revoking a permission disables
            the feature that used it and nothing else.
          </p>
          <dl className="deflist">
            {permissions.map(([term, body]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>

          <h2>Keeping and deleting your data</h2>
          <p>
            Clipboard history is kept for the period you choose in Settings —
            7, 30 or 365 days — and older items are removed automatically. You
            can clear the history at any time. Shelf items stay until you
            remove them, and screenshots are discarded once you dismiss them.
          </p>
          <p>
            Because everything is local, deleting Eyebrow deletes your data
            with it. There is no copy of it anywhere else, and no request you
            need to send us to have it erased.
          </p>

          <h2>Children</h2>
          <p>
            Eyebrow is a general-purpose utility and is not directed at
            children under 13. It collects no personal information from anyone,
            children included.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If a future version of Eyebrow changes what it sends or stores,
            this page is updated before that version ships, and the effective
            date at the top changes with it. Material changes will also be
            noted in the app&apos;s release notes.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about any of this, including anything you think is
            inaccurate, go to{" "}
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. A
            person reads it. You can also use the{" "}
            <Link href="/support">support page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
