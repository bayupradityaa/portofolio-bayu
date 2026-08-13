import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas/contact";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Simple hash for IP obfuscation (GDPR-friendly)
// ---------------------------------------------------------------------------
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function POST(request: Request) {
  // ── Resolve client IP ────────────────────────────────────────────────
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";
  const ipHash = simpleHash(ip);

  // ── Parse body (before rate check so we don't waste a query on bad JSON) ──
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // ── Server-side validation — never trust the client. ─────────────────
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 },
    );
  }

  const supabase = getSupabaseAdmin();

  // If Supabase is not configured yet, accept the message so the UI works in
  // development and log it server-side. Wire env keys to persist for real.
  if (!supabase) {
    console.info("[contact] (unconfigured) message received:", parsed.data);
    return NextResponse.json({ ok: true, stored: false });
  }

  // ── DB-based rate limit — max 3 messages per 10 min per IP ───────────
  // Works across serverless instances (unlike in-memory), survives restarts.
  const { count, error: countError } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(Date.now() - 600_000).toISOString());

  if (!countError && (count ?? 0) >= 3) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  // ── Insert message ───────────────────────────────────────────────────
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("[contact] supabase insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Could not save your message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
