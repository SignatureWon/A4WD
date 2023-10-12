import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
  const { data, error } = await supabase
    .from("contents")
    .select()
    .eq("type", "attractions")
    .eq("slug", params.slug)
    .single();
  return { data };
}
