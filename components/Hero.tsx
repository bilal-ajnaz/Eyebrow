import DownloadButton from "./DownloadButton";
import { site, appStoreReady } from "@/lib/site";
import Icon from "./Icon";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell hero__inner">
        <span className="hero__badge">
          <Icon name="sparkle" size={13} />
          Free. Every feature. No subscription.
        </span>

        <h1 id="hero-title" className="hero__title">
          Your notch,
          <br />
          finally doing something.
        </h1>

        <p className="hero__lede">
          Eyebrow turns the dead black bar at the top of your Mac into a live
          control centre — now playing, system HUDs, a drag-and-drop shelf,
          clipboard history, screenshots, call controls and sixteen widgets.
          It stays out of the way until it&nbsp;has something to say.
        </p>

        <div className="hero__actions">
          <DownloadButton />
          <a className="btn btn--ghost" href="#how">
            See what it does
            <Icon name="arrow" size={16} />
          </a>
        </div>

        <p className="btn-note">
          {appStoreReady
            ? `${site.minMacOS} or later · Apple silicon and Intel`
            : `${site.minMacOS} or later · Apple silicon and Intel · App Store listing goes live shortly`}
        </p>

        <ul className="hero__facts">
          <li>
            <Icon name="lock" size={15} />
            No account, no tracking
          </li>
          <li>
            <Icon name="display" size={15} />
            Works without a notch, too
          </li>
          <li>
            <Icon name="gear" size={15} />
            Every feature is optional
          </li>
        </ul>
      </div>

      <div className="hero__glow" aria-hidden="true" />
    </section>
  );
}
