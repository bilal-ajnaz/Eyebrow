"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import Notch from "./Notch";

type Clip = { id: number; text: string; kind: "text" | "link" | "color"; pinned?: boolean };

const kindOf = (t: string): Clip["kind"] =>
  /^#[0-9a-f]{3,8}$/i.test(t) ? "color" : /^https?:\/\//i.test(t) ? "link" : "text";

/* Clipboard history: copy anything you write in the box (select it and press
   ⌘ C) and it lands in the notch. Click a clip to copy it again, onto your
   real clipboard, then paste with ⌘ V. The pin keeps a clip at the front. */
export default function ClipboardDemo() {
  const [clips, setClips] = useState<Clip[]>([
    { id: 1, text: "https://apps.apple.com/app/id6808540516", kind: "link", pinned: true },
    { id: 4, text: "#7DE3C4", kind: "color" },
    { id: 3, text: "Ship the 4.6 build after the review", kind: "text" },
    { id: 2, text: "https://eyebrow-notch.vercel.app", kind: "link" },
  ]);
  const [picked, setPicked] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [said, setSaid] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);
  const next = useRef(5);

  const add = (raw: string) => {
    const text = raw.trim().slice(0, 200);
    if (!text) return;
    setClips((c) => {
      const keep = c.filter((x) => x.text !== text);
      const pinned = keep.filter((x) => x.pinned);
      const rest = keep.filter((x) => !x.pinned);
      return [...pinned, { id: next.current++, text, kind: kindOf(text) }, ...rest].slice(0, 8);
    });
    setSaid(`Copied “${text.slice(0, 40)}${text.length > 40 ? "…" : ""}”. It’s in the notch now.`);
  };

  // A real copy in the box (⌘ C on a selection) is caught here.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onCopy = () => add(el.value.slice(el.selectionStart, el.selectionEnd));
    el.addEventListener("copy", onCopy);
    el.addEventListener("cut", onCopy);
    return () => {
      el.removeEventListener("copy", onCopy);
      el.removeEventListener("cut", onCopy);
    };
  }, []);

  // Picking a clip copies it, as the app does; ⌘ V pastes it wherever you like.
  const pick = (c: Clip) => {
    setPicked(c.id);
    navigator.clipboard?.writeText(c.text).then(
      () => setSaid("Copied. Click in the box and press ⌘ V to paste it."),
      () => setSaid("This browser didn’t let the page copy. Select the text and press ⌘ C instead."),
    );
  };

  // Pinned clips sit at the front and stay there; the rest are newest first.
  const pin = (id: number) => {
    setClips((list) => {
      const next = list.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c));
      return [...next.filter((c) => c.pinned), ...next.filter((c) => !c.pinned).sort((a, b) => b.id - a.id)];
    });
    const c = clips.find((x) => x.id === id);
    if (c) setSaid(c.pinned ? "Unpinned." : "Pinned. It stays at the front.");
  };

  return (
    <div className="demo cb">
      <Notch tab="clipboard" label="Clipboard history, open in the notch">
        <div className="cb-filters" aria-hidden="true">
          <span className="cb-pill cb-pill--on">All {clips.length}</span>
          <span className="cb-pill">Texts</span>
          <span className="cb-pill">Links</span>
          <span className="cb-pill">Colors</span>
        </div>
        <ul className="cb-row" aria-label="Clipboard history">
          {clips.map((c) => (
            <li key={c.id} className="cb-item">
              <button
                type="button"
                className={`cb-clip cb-clip--${c.kind}`}
                data-picked={c.id === picked}
                style={c.kind === "color" ? { background: c.text } : undefined}
                onClick={() => pick(c)}
                aria-label={`Copy ${c.text}`}
              >
                {c.kind !== "color" && <Icon name={c.kind === "link" ? "link" : "file"} size={14} />}
                <span className="cb-clip__text">{c.text}</span>
                {c.id === picked && <span className="cb-copied" aria-hidden="true">Copied</span>}
              </button>
              <button type="button" className="cb-pin" aria-pressed={!!c.pinned} onClick={() => pin(c.id)} aria-label={c.pinned ? `Unpin ${c.text}` : `Pin ${c.text}`}>
                <Icon name="pin" size={12} />
              </button>
            </li>
          ))}
        </ul>
      </Notch>

      <label className="visually-hidden" htmlFor="cb-box">Write here, copy, and paste from the notch</label>
      <textarea
        ref={box}
        id="cb-box"
        className="cb-box"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          // The copy event covers ⌘ C too; this is a backstop where a browser doesn't send one.
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
            const el = e.currentTarget;
            add(el.value.slice(el.selectionStart, el.selectionEnd));
          }
        }}
        rows={3}
        placeholder="Write something, select it and press ⌘ C. Click a clip in the notch to copy it, then ⌘ V to paste it here."
      />
      <p className="visually-hidden" aria-live="polite">{said}</p>
    </div>
  );
}
