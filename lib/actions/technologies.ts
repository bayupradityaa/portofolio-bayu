"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateTechnologies } from "@/lib/cache";
import { technologySchema } from "@/lib/schemas/technology";
import type { Technology } from "@/lib/types/database";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

/** Fetch published technologies grouped by category (for marquee) */
export const getPublishedTechnologies = unstable_cache(
  async (): Promise<Technology[]> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[technologies] fetch error:", error.message);
      return [];
    }

    return (data ?? []) as Technology[];
  },
  ["published-technologies"],
  { tags: [CACHE_TAGS.TECHNOLOGIES], revalidate: 3600 },
);

/** Fetch ALL technologies (admin) */
export async function getAllTechnologies(): Promise<Technology[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[technologies/dev] fetch error:", error.message);
    return [];
  }

  return (data ?? []) as Technology[];
}

export async function createTechnology(values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = technologySchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = {
    ...parsed.data,
    website: parsed.data.website || null,
  };

  const { error } = await supabase.from("technologies").insert(data);
  if (error) return { error: error.message };

  revalidateTechnologies();
  return { success: true };
}

export async function updateTechnology(id: string, values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = technologySchema.partial().safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { error } = await supabase.from("technologies").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidateTechnologies();
  return { success: true };
}

export async function deleteTechnology(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("technologies").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateTechnologies();
  return { success: true };
}

export async function reorderTechnologies(orderedIds: string[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const updates = orderedIds.map((id, index) =>
    supabase.from("technologies").update({ sort_order: index }).eq("id", id),
  );

  await Promise.all(updates);
  revalidateTechnologies();
  return { success: true };
}
