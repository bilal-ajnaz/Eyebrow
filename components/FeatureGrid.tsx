"use client";

import { useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { features } from "@/lib/features";

const ALL = "All";
const groups = [ALL, ...Array.from(new Set(features.map((f) => f.group)))];

function countFor(group: string) {
  return group === ALL
    ? features.length
    : features.filter((f) => f.group === group).length;
}

/**
 * The feature cards behind a row of tag chips. Picking a chip narrows the
 * grid to that area; the cards re-enter with the usual staggered reveal.
 */
export default function FeatureGrid() {
  const [group, setGroup] = useState(ALL);
  const shown =
    group === ALL ? features : features.filter((f) => f.group === group);

  return (
    <>
      <div className="filter" role="group" aria-label="Filter features by area">
        {groups.map((g) => (
          <button
            key={g}
            type="button"
            className="filter__chip"
            aria-pressed={group === g}
            onClick={() => setGroup(g)}
          >
            {g}
            <span className="filter__count num">{countFor(g)}</span>
          </button>
        ))}
      </div>

      {/* keyed on the group so every card re-mounts and re-reveals */}
      <div className="grid grid--3" key={group}>
        {shown.map((f, i) => (
          <Reveal key={f.title} as="article" delay={(i % 3) * 60}>
            <div className="card">
              <span className="card__icon">
                <Icon name={f.icon} size={26} />
              </span>
              <span className="card__group">{f.group}</span>
              <h3 className="card__title">{f.title}</h3>
              <p className="card__body">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="filter__status" role="status" aria-live="polite">
        {group === ALL
          ? `Showing all ${features.length} features`
          : `Showing ${shown.length} ${group} features`}
      </p>
    </>
  );
}
