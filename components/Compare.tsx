"use client";

import { useState } from "react";
import Icon from "./Icon";
import {
  apps,
  eyebrow,
  groups,
  rows,
  type App,
  type Cell,
  type Mark,
} from "@/lib/compare";

const markLabel: Record<Mark, string> = {
  yes: "Yes",
  partial: "Limited",
  no: "Not listed",
  unknown: "Not stated",
};

function cellOf(app: App, row: string): Cell {
  const cell = app.cells[row] ?? "unknown";
  return typeof cell === "string" ? { mark: cell } : cell;
}

/** A tick, an amber half, a dash or a question mark, with its words for screen readers. */
function MarkGlyph({ mark }: { mark: Mark }) {
  return (
    <span className={`cmp-mark cmp-mark--${mark}`} aria-label={markLabel[mark]} role="img">
      {mark === "yes" && (
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {mark === "partial" && (
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 3a5 5 0 0 1 0 10Z" fill="currentColor" />
        </svg>
      )}
      {mark === "no" && (
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M4.5 8h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {mark === "unknown" && <span aria-hidden="true">?</span>}
    </span>
  );
}

function CellView({ cell, compact = false }: { cell: Cell; compact?: boolean }) {
  return (
    <div className="cmp-cell" title={compact ? cell.note : undefined}>
      <MarkGlyph mark={cell.mark} />
      {!compact && (cell.note || cell.pro || cell.soon) && (
        <span className="cmp-cell__note">
          {cell.pro && <span className="card__pro">Pro</span>}
          {cell.soon && <span className="soon">Coming soon</span>}
          {cell.note}
        </span>
      )}
    </div>
  );
}

/** The app's mark: initials on a tinted tile, not the vendor's own artwork. */
function Monogram({ app, size }: { app: App; size?: number }) {
  // without a size the tile takes it from CSS, so the picker can shrink it on phones
  const sized = (size ? { "--size": `${size}px` } : {}) as React.CSSProperties;
  if (app.id === "eyebrow") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/icon-256.png" alt="" width={size ?? 52} height={size ?? 52} className="cmp-mono cmp-mono--img" style={sized} />
    );
  }
  return (
    <span
      className="cmp-mono"
      style={{ ...sized, "--hue": app.hue } as React.CSSProperties}
      aria-hidden="true"
    >
      {app.initials}
    </span>
  );
}

export default function Compare() {
  const [picked, setPicked] = useState<string>(apps[0].id);
  const [all, setAll] = useState(false);
  const other = apps.find((a) => a.id === picked) ?? apps[0];

  const pick = (id: string) => {
    setPicked(id);
    setAll(false);
  };

  // what Eyebrow ships that the picked app doesn't, as a one-line verdict
  const edge = rows.filter(
    (r) => cellOf(eyebrow, r.id).mark === "yes" && !cellOf(eyebrow, r.id).soon && cellOf(other, r.id).mark === "no",
  ).length;

  return (
    <>
      <div className="cmp-picker" role="group" aria-label="Pick an app to compare with Eyebrow">
        {apps.map((app) => (
          <button
            key={app.id}
            type="button"
            className="cmp-pick"
            aria-pressed={!all && app.id === picked}
            onClick={() => pick(app.id)}
          >
            <Monogram app={app} />
            <span className="cmp-pick__name">{app.name}</span>
            <span className="cmp-pick__price num">{app.price}</span>
          </button>
        ))}
      </div>

      <div className="cmp-modes">
        <button
          type="button"
          className="filter__chip"
          aria-pressed={!all}
          onClick={() => setAll(false)}
        >
          Eyebrow vs {other.name}
        </button>
        <button
          type="button"
          className="filter__chip"
          aria-pressed={all}
          onClick={() => setAll(true)}
        >
          Every app at once
        </button>
      </div>

      <p className="cmp-legend">
        <span><MarkGlyph mark="yes" /> Ships today</span>
        <span><MarkGlyph mark="partial" /> Limited or partial</span>
        <span><MarkGlyph mark="no" /> Not listed by the developer</span>
        <span><MarkGlyph mark="unknown" /> Unclear</span>
      </p>

      {all ? (
        <div className="cmp-scroll" tabIndex={0} role="region" aria-label="Every app compared">
          <table className="cmp-table cmp-table--all">
            <thead>
              <tr>
                <th scope="col" className="cmp-table__feature">Feature</th>
                {[eyebrow, ...apps].map((app) => (
                  <th
                    key={app.id}
                    scope="col"
                    className={app.id === "eyebrow" ? "cmp-col--us" : app.id === picked ? "cmp-col--lit" : undefined}
                  >
                    <button
                      type="button"
                      className="cmp-colhead"
                      onClick={() => app.id !== "eyebrow" && setPicked(app.id)}
                      disabled={app.id === "eyebrow"}
                    >
                      <Monogram app={app} size={30} />
                      <span>{app.name}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group}>
                <tr className="cmp-group">
                  <th scope="rowgroup" colSpan={apps.length + 2}>{group}</th>
                </tr>
                {rows
                  .filter((r) => r.group === group)
                  .map((row) => (
                    <tr key={row.id}>
                      <th scope="row" className="cmp-table__feature">{row.label}</th>
                      {[eyebrow, ...apps].map((app) => (
                        <td
                          key={app.id}
                          className={app.id === "eyebrow" ? "cmp-col--us" : app.id === picked ? "cmp-col--lit" : undefined}
                        >
                          <CellView cell={cellOf(app, row.id)} compact />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            ))}
          </table>
        </div>
      ) : (
        <div className="cmp-duel">
          <div className="cmp-summary">
            {[eyebrow, other].map((app) => (
              <div key={app.id} className={`cmp-summary__app${app.id === "eyebrow" ? " cmp-summary__app--us" : ""}`}>
                <Monogram app={app} size={44} />
                <div>
                  <p className="cmp-summary__name">{app.name}</p>
                  <p className="cmp-summary__price num">{app.price}</p>
                  <p className="cmp-summary__model">{app.model}</p>
                </div>
              </div>
            ))}
            <p className="cmp-summary__verdict">
              {edge > 0
                ? `${edge} feature${edge === 1 ? "" : "s"} in Eyebrow that ${other.name} doesn't list.`
                : `${other.name} covers a lot of the same ground. The price and the details below are where they differ.`}
            </p>
          </div>

          <table className="cmp-table cmp-table--duel">
            <thead>
              <tr>
                <th scope="col" className="cmp-table__feature">Feature</th>
                <th scope="col" className="cmp-col--us">Eyebrow</th>
                <th scope="col" className="cmp-col--lit">{other.name}</th>
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group}>
                <tr className="cmp-group">
                  <th scope="rowgroup" colSpan={3}>{group}</th>
                </tr>
                {rows
                  .filter((r) => r.group === group)
                  .map((row) => (
                    <tr key={row.id}>
                      <th scope="row" className="cmp-table__feature">{row.label}</th>
                      <td className="cmp-col--us"><CellView cell={cellOf(eyebrow, row.id)} /></td>
                      <td className="cmp-col--lit"><CellView cell={cellOf(other, row.id)} /></td>
                    </tr>
                  ))}
              </tbody>
            ))}
          </table>

          {other.sources.length > 0 && (
            <p className="cmp-sources">
              <Icon name="globe" size={14} />
              <span>
                {other.name} details from{" "}
                {other.sources.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && (i === other.sources.length - 1 ? " and " : ", ")}
                    <a href={s.url} target="_blank" rel="noreferrer noopener">{s.label}</a>
                  </span>
                ))}
                .
              </span>
            </p>
          )}
        </div>
      )}
    </>
  );
}
