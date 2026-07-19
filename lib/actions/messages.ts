"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateMessages } from "@/lib/cache";
import type { ContactMessage } from "@/lib/types/database";

export async function getMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[messages] fetch error:", error.message);
    return [];
  }

  return (data ?? []) as ContactMessage[];
}

export async function getUnreadCount(): Promise<number> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) return 0;
  return count ?? 0;
}

export async function markRead(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateMessages();
  return { success: true };
}

export async function markReplied(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("contact_messages")
    .update({ replied: true, is_read: true })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateMessages();
  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateMessages();
  return { success: true };
}
