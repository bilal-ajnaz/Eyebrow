import DownloadButton from "./DownloadButton";
import { site, appStoreReady } from "@/lib/site";
import Icon from "./Icon";
import Magnetic from "./Magnetic";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />

      <div className="shell hero__inner">
        <span className="hero__badge">
          <Icon name="sparkle" size={14} />
          Free. Pro is one purchase, not a subscription.
        </span>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__wordmark">{site.name}</span>
        </h1>

        <p className="hero__tagline">{site.tagline}</p>

        <p className="hero__lede">
          Eyebrow turns the dead black bar at the top of your Mac into a live
          control centre — now playing, system HUDs, a drag-and-drop shelf,
          clipboard history, screenshots, call controls and seventeen widgets.
          It stays out of the way until it&nbsp;has something to say.
        </p>

        <div className="hero__actions">
          <Magnetic>
            <DownloadButton />
          </Magnetic>
          <a className="textlink" href="#how">
            See what it does ›
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
    </section>
  );
}
