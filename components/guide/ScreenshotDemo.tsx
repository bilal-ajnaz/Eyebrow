"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Icon from "@/components/Icon";

const W = 640;
const H = 380;

const lines = ["Launch checklist", "Press emails go out Thursday", "Product Hunt on Tuesday at 08:01", "Offer codes: 500 ready"];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

/* Screenshots: the "screen" is an SVG, so the shutter in its middle can turn it
   into a real PNG (SVG → canvas). The corners close in like a viewfinder, the
   shot shrinks up into the notch at the top of the screen, and the notch opens
   with it. Click the preview to zoom in; Annotate draws on it, Text pulls the
   words out, Copy and Save hand over the image itself. */
export default function ScreenshotDemo() {
  const screen = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const thumb = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("Ship it");
  const [shot, setShot] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "framing" | "flying">("idle");
  const [open, setOpen] = useState(false);
  const [landed, setLanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [mode, setMode] = useState<"view" | "annotate" | "text">("view");
  const [said, setSaid] = useState("");
  const drawing = useRef(false);

  const words = [...lines, note].filter(Boolean);

  const render = async () => {
    const el = svg.current;
    if (!el) return null;
    const xml = new XMLSerializer().serializeToString(el);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
    const img = new Image();
    img.src = url;
    await img.decode().catch(() => {});
    const c = document.createElement("canvas");
    c.width = W * 2;
    c.height = H * 2;
    c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    return c.toDataURL("image/png");
  };

  const capture = async () => {
    if (stage !== "idle") return;
    const png = await render();
    if (!png) return;
    const calm = reduced();

    // The corners close in and the screen flashes.
    setStage("framing");
    setLanded(false);
    if (!calm) await wait(420);

    // The notch opens and the shot travels up into its preview.
    setShot(png);
    setOpen(true);
    setStage("flying");
    if (!calm) await wait(260);
    const from = screen.current?.getBoundingClientRect();
    const to = thumb.current?.getBoundingClientRect();
    const fly = screen.current?.querySelector<HTMLImageElement>(".ss-fly");
    if (fly && from && to && !calm) {
      fly.src = png;
      const anim = fly.animate(
        [
          { transform: "translate(0, 0) scale(1)", borderRadius: "0px", opacity: 1 },
          { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})`, borderRadius: "40px", opacity: 1 },
        ],
        { duration: 620, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
      );
      await anim.finished.catch(() => {});
      anim.cancel();
    }
    setLanded(true);
    setStage("idle");
    setMode("view");
    setSaid("Screenshot taken. It’s waiting in the notch.");
  };

  // The zoomed preview draws the shot into a canvas, so annotations become part of the image.
  useEffect(() => {
    if (!zoomed || !shot) return;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const img = new Image();
    img.onload = () => {
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = shot;
  }, [zoomed, shot]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (zoomed && !d.open) d.showModal();
    if (!zoomed && d.open) d.close();
  }, [zoomed]);

  const commit = () => {
    if (canvas.current) setShot(canvas.current.toDataURL("image/png"));
  };

  const point = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const penDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (mode !== "annotate") return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = point(e);
    ctx.strokeStyle = "#7DE3C4";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const penMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d");
    const p = point(e);
    ctx?.lineTo(p.x, p.y);
    ctx?.stroke();
  };
  const penUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    commit();
  };

  const blob = async () => (shot ? await (await fetch(shot)).blob() : null);

  const copy = async () => {
    const b = await blob();
    if (!b) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": b })]);
      setSaid("Copied the screenshot. Paste it anywhere.");
    } catch {
      setSaid("This browser won’t let the page copy images. Save works.");
    }
  };

  const save = () => {
    if (!shot) return;
    const a = document.createElement("a");
    a.href = shot;
    a.download = "Eyebrow screenshot.png";
    a.click();
    setSaid("Saved as Eyebrow screenshot.png.");
  };

  const copyText = () => {
    navigator.clipboard?.writeText(words.join("\n")).catch(() => {});
    setSaid("Copied the text from the screenshot.");
  };

  const dismiss = () => {
    setOpen(false);
    setLanded(false);
    setSaid("The notch closed. Press the shutter for another.");
  };

  const actions = (
    <div className="ss-actions">
      <button type="button" onClick={copy} disabled={!shot}><Icon name="copy" size={15} /><span>Copy</span></button>
      <button type="button" onClick={() => { setZoomed(true); setMode("annotate"); }} disabled={!shot} aria-pressed={zoomed && mode === "annotate"}><Icon name="pencil" size={15} /><span>Annotate</span></button>
      <button type="button" onClick={() => { setZoomed(true); setMode("text"); }} disabled={!shot} aria-pressed={zoomed && mode === "text"}><Icon name="text" size={15} /><span>Text</span></button>
      <button type="button" onClick={save} disabled={!shot}><Icon name="save" size={15} /><span>Save</span></button>
    </div>
  );

  return (
    <div className="demo ss">
      <div className="ss-screen" ref={screen} data-stage={stage}>
        <svg ref={svg} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`A desktop with a note: ${words.join(", ")}`}>
          <defs>
            <linearGradient id="ss-wall" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1d3557" />
              <stop offset="0.55" stopColor="#3a2f6b" />
              <stop offset="1" stopColor="#7a3a5a" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#ss-wall)" />
          <g transform="translate(120 82)">
            <rect width="400" height="250" rx="14" fill="#fbfaf7" />
            <rect width="400" height="34" rx="14" fill="#ecebe6" />
            <rect y="20" width="400" height="14" fill="#ecebe6" />
            <circle cx="20" cy="17" r="6" fill="#ff5f57" />
            <circle cx="40" cy="17" r="6" fill="#febc2e" />
            <circle cx="60" cy="17" r="6" fill="#28c840" />
            <text x="28" y="78" fontFamily="-apple-system, system-ui, Helvetica, Arial, sans-serif" fontSize="24" fontWeight="700" fill="#1b1b1f">{lines[0]}</text>
            {lines.slice(1).map((l, i) => (
              <text key={l} x="28" y={118 + i * 30} fontFamily="-apple-system, system-ui, Helvetica, Arial, sans-serif" fontSize="16" fill="#3b3b44">• {l}</text>
            ))}
            <text x="28" y="218" fontFamily="-apple-system, system-ui, Helvetica, Arial, sans-serif" fontSize="16" fontWeight="700" fill="#1f7a5c">{note ? `• ${note}` : ""}</text>
          </g>
        </svg>

        {/* The viewfinder corners and the flash. */}
        <div className="ss-frame" aria-hidden="true"><i /><i /><i /><i /></div>
        <img className="ss-fly" alt="" aria-hidden="true" />

        <button type="button" className="ss-shutter" onClick={capture} aria-label="Take a screenshot" disabled={stage !== "idle"}>
          <Icon name="camera" size={24} />
        </button>

        {/* The notch at the top of this screen: closed until a screenshot lands in it. */}
        <div className="ss-island" data-open={open} role="group" aria-label="The notch, with the screenshot">
          <div className="ss-island__in">
            <div className="ss-island__head">
              <p><Icon name="camera" size={13} /> Screenshot</p>
              <button type="button" className="ss-dismiss" onClick={dismiss} aria-label="Close the notch">
                <Icon name="plus" size={14} />
              </button>
            </div>
            <div className="ss-island__body">
              <button ref={thumb} type="button" className="ss-thumb" data-landed={landed} onClick={() => { setZoomed(true); setMode("view"); }} disabled={!shot} aria-label="Zoom into the screenshot">
                {shot && <img src={shot} alt="" />}
              </button>
              {actions}
            </div>
          </div>
        </div>
      </div>

      <label className="ss-note">
        <span>Write on the screen, then press the shutter</span>
        <input value={note} maxLength={36} onChange={(e) => setNote(e.target.value)} />
      </label>

      <p className="demo__said" aria-live="polite">{said || "Press the shutter in the middle of the screen."}</p>

      <dialog ref={dialog} className="ss-zoom" onClose={() => setZoomed(false)} aria-label="Screenshot preview">
        <div className="ss-zoom__bar">
          <p>{mode === "annotate" ? "Draw on the screenshot" : mode === "text" ? "Text found in the screenshot" : "Screenshot"}</p>
          <button type="button" className="ss-close" onClick={() => setZoomed(false)}>Done</button>
        </div>
        <div className="ss-zoom__stage" data-mode={mode}>
          <canvas
            ref={canvas}
            className="ss-canvas"
            onPointerDown={penDown}
            onPointerMove={penMove}
            onPointerUp={penUp}
            onPointerCancel={penUp}
            aria-label="The screenshot"
            role="img"
          />
          {mode === "text" && (
            <div className="ss-text">
              <ul>{words.map((w) => <li key={w}>{w}</li>)}</ul>
              <button type="button" className="btn btn--quiet" onClick={copyText}>Copy text</button>
            </div>
          )}
        </div>
        {actions}
      </dialog>
    </div>
  );
}
