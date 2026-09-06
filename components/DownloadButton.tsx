import { site, appStoreReady } from "@/lib/site";
import Icon from "./Icon";

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
        <Icon name="bolt" size={16} />
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
      <Icon name="bolt" size={16} />
      {label}
    </a>
  );
}
