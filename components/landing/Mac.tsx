import type { CSSProperties, ReactNode } from "react";

/* A MacBook for a capture to live in: the notch hangs from the top bezel over the
   menu bar, on a wallpaper, so it reads as part of a Mac rather than a picture on
   the page. `notch` is the capture's share of the screen's width. `top` shows only
   the top of the display, fading out, for closed notches and narrow cards. */
export default function Mac({
  children,
  notch = 0.64,
  top = false,
  className,
}: {
  children: ReactNode;
  notch?: number;
  top?: boolean;
  className?: string;
}) {
  // When the notch takes most of the bar, only the Apple menu and the clock still fit.
  const roomy = notch <= 0.7;
  return (
    <div className={["mac", top && "mac--top", className].filter(Boolean).join(" ")} style={{ "--notch": notch } as CSSProperties}>
      <div className="mac__lid">
        <div className="mac__screen">
          <div className="mac__menubar" aria-hidden="true">
            <span className="mac__menus">
              <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              {roomy && (
                <>
                  <b>Finder</b>
                  <span>File</span>
                </>
              )}
            </span>
            <span className="mac__status">
              {roomy && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" focusable="false">
                  <path d="M3 9.5a13 13 0 0 1 18 0M6.5 13a8 8 0 0 1 11 0M10 16.5a3 3 0 0 1 4 0" />
                </svg>
              )}
              <span>{roomy ? "Fri 9:41" : "9:41"}</span>
            </span>
          </div>
          <div className="mac__notch">{children}</div>
        </div>
      </div>
      {!top && <div className="mac__base" aria-hidden="true" />}
    </div>
  );
}
