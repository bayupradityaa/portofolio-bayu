"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateExperience } from "@/lib/cache";
import { experienceSchema } from "@/lib/schemas/experience";
import type { Experience } from "@/lib/types/database";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export const getPublishedExperience = unstable_cache(
  async (): Promise<Experience[]> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[experience] fetch error:", error.message);
      return [];
    }

    return (data ?? []) as Experience[];
  },
  ["published-experience"],
  { tags: [CACHE_TAGS.EXPERIENCE], revalidate: 3600 },
);

export async function getAllExperience(): Promise<Experience[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Experience[];
}

export async function createExperience(values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = experienceSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = { ...parsed.data, website: parsed.data.website || null };
  const { error } = await supabase.from("experience").insert(data);
  if (error) return { error: error.message };

  revalidateExperience();
  return { success: true };
}

export async function updateExperience(id: string, values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = experienceSchema.partial().safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { error } = await supabase.from("experience").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidateExperience();
  return { success: true };
}

export async function deleteExperience(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateExperience();
  return { success: true };
}

export async function toggleExperiencePublished(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { data } = await supabase.from("experience").select("published").eq("id", id).single();
  if (!data) return { error: "Not found" };

  const { error } = await supabase.from("experience").update({ published: !data.published }).eq("id", id);
  if (error) return { error: error.message };

  revalidateExperience();
  return { success: true };
}

export async function reorderExperience(orderedIds: string[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  await Promise.all(
    orderedIds.map((id, i) => supabase.from("experience").update({ sort_order: i }).eq("id", id)),
  );

  revalidateExperience();
  return { success: true };
}
