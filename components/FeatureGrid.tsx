"use client";

import { useState } from "react";
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
 * The features as an index: one ruled row each, numbered in the order the
 * app lists them, behind a row of area filters. The number stays with the
 * feature when the list is narrowed, so "No. 14" means the same thing in
 * every view.
 */
export default function FeatureGrid() {
  const [group, setGroup] = useState(ALL);
  const shown = features
    .map((f, i) => ({ ...f, n: i + 1 }))
    .filter((f) => group === ALL || f.group === group);

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

      {/* keyed on the group so every row re-mounts and re-reveals */}
      <ol className="index" key={group}>
        {shown.map((f, i) => (
          <Reveal key={f.title} as="li" delay={Math.min(i, 8) * 30}>
            <span className="index__n num">{String(f.n).padStart(2, "0")}</span>
            <h3 className="index__title">{f.title}</h3>
            <p className="index__body">{f.body}</p>
            <span className="index__tags">
              <span>{f.group}</span>
              {f.pro && <span className="index__pro">Pro</span>}
              {f.soon && (
                <span className="soon">
                  {f.soon === "update" ? "Update soon" : "Coming soon"}
                </span>
              )}
            </span>
          </Reveal>
        ))}
      </ol>

      <p className="filter__status" role="status" aria-live="polite">
        {group === ALL
          ? `Showing all ${features.length} features`
          : `Showing ${shown.length} ${group} features`}
      </p>
    </>
  );
}
