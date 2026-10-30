"use client";

import { useState } from "react";
import Icon from "./Icon";
import { features } from "@/lib/features";

const ALL = "All";
const groups = [ALL, ...Array.from(new Set(features.map((f) => f.group)))];

function countFor(group: string) {
  return group === ALL
    ? features.length
    : features.filter((f) => f.group === group).length;
}

/**
 * The features under a row of area filters. Picking one narrows the list to
 * that area; the status line under it says so to screen readers.
 */
export default function FeatureGrid() {
  const [group, setGroup] = useState(ALL);
  const shown =
    group === ALL ? features : features.filter((f) => f.group === group);

  return (
    <>
      <div className="feat-filter" role="group" aria-label="Filter features by area">
        {groups.map((g) => (
          <button
            key={g}
            type="button"
            className="feat-filter__btn"
            aria-pressed={group === g}
            onClick={() => setGroup(g)}
          >
            {g}
            <span className="num">{countFor(g)}</span>
          </button>
        ))}
      </div>

      <ul className="feat-list">
        {shown.map((f) => (
          <li key={f.title}>
            <article>
              <p className="feat-list__meta">
                <Icon name={f.icon} size={20} />
                <span>{f.group}</span>
                {f.pro && <span className="feat-list__pro">Pro</span>}
              </p>
              <h3>{f.title}</h3>
              <p className="feat-list__body">{f.body}</p>
            </article>
          </li>
        ))}
      </ul>

      <p className="visually-hidden" role="status" aria-live="polite">
        {group === ALL
          ? `Showing all ${features.length} features`
          : `Showing ${shown.length} ${group} features`}
      </p>
    </>
  );
}
