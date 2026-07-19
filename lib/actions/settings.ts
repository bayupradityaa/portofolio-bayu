"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateSettings } from "@/lib/cache";
import { settingsSchema } from "@/lib/schemas/settings";
import type { ProfileSettings, ProfileSettingsUpdate } from "@/lib/types/database";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

/** Fetch profile settings (cached for public portfolio) */
export const getProfileSettings = unstable_cache(
  async (): Promise<ProfileSettings | null> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("profile_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("[settings] fetch error:", error.message);
      return null;
    }

    return data as ProfileSettings;
  },
  ["profile-settings"],
  { tags: [CACHE_TAGS.SETTINGS], revalidate: 3600 },
);

/** Update profile settings (admin only) */
export async function updateProfileSettings(values: ProfileSettingsUpdate) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = settingsSchema.partial().safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  // Upsert the single settings row
  const { data: existing } = await supabase
    .from("profile_settings")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("profile_settings")
      .update(parsed.data)
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("profile_settings")
      .insert(parsed.data);

    if (error) return { error: error.message };
  }

  revalidateSettings();
  return { success: true };
}
