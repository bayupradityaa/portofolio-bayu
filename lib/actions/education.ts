"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateEducation } from "@/lib/cache";
import { educationSchema } from "@/lib/schemas/education";
import type { Education } from "@/lib/types/database";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export const getPublishedEducation = unstable_cache(
  async (): Promise<Education[]> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("education")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[education] fetch error:", error.message);
      return [];
    }

    return (data ?? []) as Education[];
  },
  ["published-education"],
  { tags: [CACHE_TAGS.EDUCATION], revalidate: 3600 },
);

export async function getAllEducation(): Promise<Education[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Education[];
}

export async function createEducation(values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = educationSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = { ...parsed.data, website: parsed.data.website || null };
  const { error } = await supabase.from("education").insert(data);
  if (error) return { error: error.message };

  revalidateEducation();
  return { success: true };
}

export async function updateEducation(id: string, values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = educationSchema.partial().safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { error } = await supabase.from("education").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidateEducation();
  return { success: true };
}

export async function deleteEducation(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateEducation();
  return { success: true };
}

export async function toggleEducationPublished(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { data } = await supabase.from("education").select("published").eq("id", id).single();
  if (!data) return { error: "Not found" };

  const { error } = await supabase.from("education").update({ published: !data.published }).eq("id", id);
  if (error) return { error: error.message };

  revalidateEducation();
  return { success: true };
}
