import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  topic?: string;
  macos?: string;
  message?: string;
  /** honeypot — real people never fill this in */
  website?: string;
};

const TOPICS = new Set([
  "Bug report",
  "Feature request",
  "Question",
  "Permissions / privacy",
  "Something else",
]);

/** Best-effort in-memory throttle. Survives within a warm instance only. */
const seen = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string) {
  const now = Date.now();
  const hits = (seen.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  // Honeypot: pretend it worked, send nothing.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true, delivered: "email" });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const topic = clean(body.topic, 60);
  const macos = clean(body.macos, 60);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email and message are all required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Could you give us a little more detail?" },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "That's a lot of messages. Try again in a bit." },
      { status: 429 },
    );
  }

  const subject = `[Eyebrow support] ${TOPICS.has(topic) ? topic : "Question"} — ${name}`;
  const text = [
    `Topic:   ${TOPICS.has(topic) ? topic : "Question"}`,
    `From:    ${name} <${email}>`,
    macos ? `macOS:   ${macos}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  // No mail provider configured — tell the client to hand off to the
  // visitor's own mail app so the form is never a dead end.
  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      fallback: "mailto",
      to: site.supportEmail,
      subject,
      body: text,
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.SUPPORT_FROM_EMAIL || "onboarding@resend.dev",
        to: [site.supportEmail],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Support email failed:", response.status, detail);
      return NextResponse.json({
        ok: false,
        fallback: "mailto",
        to: site.supportEmail,
        subject,
        body: text,
      });
    }

    return NextResponse.json({ ok: true, delivered: "email" });
  } catch (error) {
    console.error("Support email threw:", error);
    return NextResponse.json({
      ok: false,
      fallback: "mailto",
      to: site.supportEmail,
      subject,
      body: text,
    });
  }
}
