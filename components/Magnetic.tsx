"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** how far the child follows the pointer, as a fraction of the offset */
  strength?: number;
};

/**
 * Wraps a button so it leans toward a nearby mouse pointer and springs
 * back when the pointer leaves. The wrapper carries a padded halo, so the
 * pull starts just before the pointer actually reaches the button.
 * Touch pointers and reduced-motion users get a plain button.
 */
export default function Magnetic({ children, strength = 0.3 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(event: React.PointerEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  return (
    <span
      ref={ref}
      className="magnetic"
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </span>
  );
}
