export const site = {
  name: "Eyebrow",
  tagline: "Your notch, finally doing something.",
  description:
    "Eyebrow turns the notch on your Mac into a live control centre — now playing, HUDs, a drag-and-drop shelf, clipboard history, screenshots, call controls and widgets. No account, no tracking. Free, with a one-time Pro upgrade.",
  url: "https://eyebrow.app",
  supportEmail: "bilalibnajnaz@gmail.com",
  minMacOS: "macOS 15 Sequoia",
  /**
   * Eyebrow Pro — a single non-consumable in-app purchase, bought inside the
   * app. `price` is the display string from App Store Connect.
   * Empty it and the site says "One-time" instead of a figure;
   * NEXT_PUBLIC_PRO_PRICE (Vercel) sets it without a code change.
   */
  pro: {
    name: "Eyebrow Pro",
    price: process.env.NEXT_PUBLIC_PRO_PRICE ?? "$4.99",
    /** Clipboard items the free tier keeps; Pro keeps the full history. */
    freeClipboardItems: 30,
    proClipboardItems: 500,
  },
  /**
   * The live App Store listing. NEXT_PUBLIC_APP_STORE_URL (Vercel) overrides
   * it if ever needed. Everything on the site points at this one value.
   */
  appStoreUrl:
    process.env.NEXT_PUBLIC_APP_STORE_URL ??
    "https://apps.apple.com/us/app/eyebrow-dynamic-notch/id6808540516",
} as const;

export const appStoreReady = site.appStoreUrl.length > 0;
