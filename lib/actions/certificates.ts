"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateCertificates } from "@/lib/cache";
import { certificateSchema } from "@/lib/schemas/certificate";
import type { Certificate } from "@/lib/types/database";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export const getPublishedCertificates = unstable_cache(
  async (): Promise<Certificate[]> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[certificates] fetch error:", error.message);
      return [];
    }

    return (data ?? []) as Certificate[];
  },
  ["published-certificates"],
  { tags: [CACHE_TAGS.CERTIFICATES], revalidate: 3600 },
);

export async function getAllCertificates(): Promise<Certificate[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Certificate[];
}

export async function createCertificate(values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = certificateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = { ...parsed.data, credential_url: parsed.data.credential_url || null };
  const { error } = await supabase.from("certificates").insert(data);
  if (error) return { error: error.message };

  revalidateCertificates();
  return { success: true };
}

export async function updateCertificate(id: string, values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = certificateSchema.partial().safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { error } = await supabase.from("certificates").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidateCertificates();
  return { success: true };
}

export async function deleteCertificate(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateCertificates();
  return { success: true };
}

export async function toggleCertificatePublished(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { data } = await supabase.from("certificates").select("published").eq("id", id).single();
  if (!data) return { error: "Not found" };

  const { error } = await supabase.from("certificates").update({ published: !data.published }).eq("id", id);
  if (error) return { error: error.message };

  revalidateCertificates();
  return { success: true };
}
