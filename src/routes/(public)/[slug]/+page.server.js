import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
  const { data, error } = await supabase.from("contents").select().eq("slug", params.slug).eq("type", "pages").single();
  return { data };
}