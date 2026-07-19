import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas/contact";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Server-side validation — never trust the client.
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

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
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
