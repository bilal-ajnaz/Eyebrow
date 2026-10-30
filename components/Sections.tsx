import Icon from "./Icon";
import FeatureGrid from "./FeatureGrid";
import Shot from "./landing/Shot";
import { widgets, tabs } from "@/lib/features";

/** The full feature list, behind its filter. The page head above it says
    what it is, so its own heading is for screen readers only. */
export function Features() {
  return (
    <section className="feat-all wrap" id="features" aria-labelledby="feat-all-title">
      <h2 id="feat-all-title" className="visually-hidden">All features</h2>
      <FeatureGrid />
    </section>
  );
}

export function Tabs() {
  return (
    <section className="feat-tabs wrap" id="tabs" aria-labelledby="feat-tabs-title">
      <div className="grid feat-tabs__grid">
        <div className="section-head feat-tabs__head">
          <h2 id="feat-tabs-title">Open it, and it&apos;s yours.</h2>
          <p>
            Hover, swipe with two fingers or press a shortcut, and the notch
            opens. Choose which tabs live there, reorder them, rename them, and
            have it remember the one you were last on.
          </p>
          <ul className="feat-keys">
            <li>
              <Icon name="sliders" size={18} />
              <span>
                Vertical tabs, with Pro: a scroll wheel down the side of the
                notch, with a click for every tab, and as many tabs as you like.
              </span>
            </li>
            <li>
              <Icon name="keyboard" size={18} />
              <span>
                <kbd>⇧</kbd>
                <kbd>⌘</kbd>
                <kbd>I</kbd> to open, <kbd>⇧</kbd>
                <kbd>⌘</kbd>
                <kbd>C</kbd> for clipboard, <kbd>⇧</kbd>
                <kbd>⌘</kbd>
                <kbd>H</kbd> for a sneak peek
              </span>
            </li>
            <li>
              <Icon name="display" size={18} />
              <span>
                All displays at once, one you pin, or whichever you&apos;re
                working on
              </span>
            </li>
            <li>
              <Icon name="eye" size={18} />
              <span>
                Hide it on lock screen or during screen recording, and it steps
                aside for full-screen video
              </span>
            </li>
          </ul>
        </div>

        <div className="feat-tabs__side">
          <figure className="edge">
            <Shot
              src="open-home.png"
              w={640}
              width={1280}
              height={483}
              alt="The open notch on Home, with its row of tab icons along the top"
            />
          </figure>
          <ul className="feat-tablist" aria-label="Tabs you can put in the notch">
            {tabs.map((t) => (
              <li key={t.name}>
                <span className="feat-tablist__name">{t.name}</span>
                <span className="feat-tablist__body">{t.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Widgets() {
  return (
    <section className="feat-widgets wrap" id="widgets" aria-labelledby="feat-widgets-title">
      <div className="section-head">
        <h2 id="feat-widgets-title">Eighteen widgets, three sizes.</h2>
        <p>
          Build the layout you actually use, or start from a preset (Minimal,
          Productivity, Media or Complete) and change it later.
        </p>
      </div>

      <ul className="feat-widgets__list">
        {widgets.map((w) => (
          <li key={w.name}>
            <Icon name={w.icon} size={20} />
            <span className="feat-widgets__name">{w.name}</span>
            <span className="feat-widgets__body">{w.body}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
