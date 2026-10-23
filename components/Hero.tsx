import DownloadButton from "./DownloadButton";
import { site, appStoreReady } from "@/lib/site";
import Magnetic from "./Magnetic";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell">
        <p className="hero__kicker">
          <span>A notch app for macOS</span>
          <span className="hero__new">
            New in 4.0 — Face Unlock, the Live tab, Teleprompter and Notes
          </span>
        </p>

        <h1 id="hero-title" className="hero__title">
          Your notch,
          <br />
          finally doing <em>something.</em>
        </h1>

        <div className="hero__foot">
          <p className="hero__lede">
            {site.name} turns the dead black bar at the top of your Mac into a
            live control centre — now playing, system HUDs, a drag-and-drop
            shelf, clipboard history, screenshots, call controls and eighteen
            widgets. It stays out of the way until it&nbsp;has something to
            say.
          </p>

          <div className="hero__act">
            <div className="hero__actions">
              <Magnetic>
                <DownloadButton />
              </Magnetic>
              <a className="textlink" href="#how">
                Watch it work ↓
              </a>
            </div>
            <dl className="hero__facts">
              <div>
                <dt>Price</dt>
                <dd>Free · Pro is one-time</dd>
              </div>
              <div>
                <dt>Needs</dt>
                <dd>
                  {site.minMacOS} or later
                  {appStoreReady ? "" : " · listing goes live shortly"}
                </dd>
              </div>
              <div>
                <dt>Account</dt>
                <dd>None. No tracking.</dd>
              </div>
              <div>
                <dt>No notch?</dt>
                <dd>Works without one, too</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
