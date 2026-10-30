import type { CSSProperties } from "react";

/* One of the app's own renders, at its natural size (w, in CSS px) and
   shrinking with the column. The PNGs are @2x, so width/height are 2 × w. */
export default function Shot({
  src,
  w,
  width,
  height,
  alt,
  priority = false,
}: {
  src: string;
  w: number;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
}) {
  const style = { "--w": `${w}px`, "--ar": `${width} / ${height}` } as CSSProperties;
  return (
    <div className="shot" style={style}>
      <img
        src={`/landing/${src}`}
        width={width}
        height={height}
        alt={alt}
        {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
      />
    </div>
  );
}
