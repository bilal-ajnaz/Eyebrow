# Eyebrow — website

Marketing and support site for Eyebrow, the macOS notch app. Next.js App
Router, no CSS framework, no runtime dependencies beyond React.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel

The site lives in the `website/` subdirectory of the app repo, so:

1. Import the repo in Vercel.
2. Set **Root Directory** to `website`.
3. Framework preset: **Next.js** (auto-detected). No build overrides needed.

## The two things to set

### 1. App Store link

Everything on the site points at one constant. Until it's set, every
download button renders as "coming shortly" and is non-clickable.

Set it either in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/id0000000000
```

…or edit `appStoreUrl` in `lib/site.ts`. Redeploy after either.

### 2. Support email delivery

The support form posts to `/api/support`, which sends to
`bilalibnajnaz@gmail.com` (set in `lib/site.ts`).

**Without any configuration** the form still works: the server validates
the message, then hands it back to the visitor's own mail client as a
pre-filled email. Nothing is lost, but the visitor has to press send.

**For real server-side delivery**, add a Resend key (free tier, no card):

```
RESEND_API_KEY=re_xxxxxxxx
SUPPORT_FROM_EMAIL=support@yourdomain.com   # must be a verified domain
```

Use `onboarding@resend.dev` as the from address while testing. Replies go
to the visitor's address automatically. If Resend ever errors, the route
falls back to the mail-client handoff rather than dropping the message.

The route also carries a honeypot field and a per-IP throttle (5 messages
per 10 minutes, best-effort within a warm instance).

## Structure

```
app/
  layout.tsx          shell, metadata, nav + footer
  page.tsx            home, plus SoftwareApplication + FAQPage JSON-LD
  globals.css         the entire design system — tokens, then components
  support/page.tsx    support page
  api/support/route.ts
components/
  NotchStage.tsx      the scroll-driven notch (the centrepiece)
  Sections.tsx        features, tabs, widgets, privacy, price, FAQ
  SupportForm.tsx     client form + mailto fallback
  Nav / Footer / Hero / Reveal / Icon / DownloadButton
lib/
  site.ts             name, URL, email, App Store link
  features.ts         the feature catalogue — edit copy here
```

## Editing content

- **Features, widgets, tabs, FAQ** — `lib/features.ts`. All plain data.
- **Scroll story** — the `acts` array at the top of
  `components/NotchStage.tsx`. Each act sets its own notch width/height
  and its caption; add or remove one and the ticks and numbering follow.
- **Colours, type, spacing, motion** — the token block at the top of
  `app/globals.css`. Components only ever reference semantic tokens.

## Notes

- Dark-only by design — it's a site about a black bar at the top of a
  black bezel.
- `prefers-reduced-motion` is respected throughout: the notch still
  morphs between states, it just doesn't animate there.
- Scroll-reveal styles are scoped under `[data-js="on"]`, so the page is
  fully readable if JavaScript never runs.
- Layout uses CSS logical properties throughout.
- Every act is deep-linkable: `/#act-1` … `/#act-8`.
