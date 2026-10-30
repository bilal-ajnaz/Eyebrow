import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";

/* Shared by both root layouts: the home page and the rest of the site. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "macOS notch app",
    "Dynamic Island for Mac",
    "MacBook notch",
    "notch widgets",
    "clipboard manager macOS",
    "free Mac app",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
  },
};

export const baseViewport: Viewport = {
  themeColor: "#24374c",
  colorScheme: "dark",
};
