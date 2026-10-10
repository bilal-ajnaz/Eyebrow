import { site, appStoreReady } from "@/lib/site";

type Props = { variant?: "primary" | "ghost"; label?: string };

export default function DownloadButton({
  variant = "primary",
  label = "Download on the App Store",
}: Props) {
  const className = `btn btn--${variant}`;

  if (!appStoreReady) {
    return (
      <span
        className={className}
        aria-disabled="true"
        title="The App Store listing goes live shortly."
      >
        {label} — coming shortly
      </span>
    );
  }

  return (
    <a
      className={className}
      href={site.appStoreUrl}
      target="_blank"
      rel="noreferrer noopener"
    >
      {label}
    </a>
  );
}
