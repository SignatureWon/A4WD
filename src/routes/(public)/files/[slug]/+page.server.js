import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
  const slug = params.slug;

  const { data, error } = await supabase
    .from("contents")
    .select("name, attachment")
    .eq("slug", slug)
    .eq("type", "attachments")
    .single();
  return {data};
}
