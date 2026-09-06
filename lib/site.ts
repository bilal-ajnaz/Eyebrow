export const site = {
  name: "Eyebrow",
  tagline: "Your notch, finally doing something.",
  description:
    "Eyebrow turns the notch on your Mac into a live control centre — now playing, HUDs, a drag-and-drop shelf, clipboard history, screenshots, call controls and widgets. No account, no tracking. Free.",
  url: "https://eyebrow.app",
  supportEmail: "bilalibnajnaz@gmail.com",
  minMacOS: "macOS 15 Sequoia",
  /**
   * Paste the App Store link here (or set NEXT_PUBLIC_APP_STORE_URL in Vercel)
   * once the app is through review. Everything else already points at it.
   */
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL ?? "",
} as const;

export const appStoreReady = site.appStoreUrl.length > 0;
