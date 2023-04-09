import { supabase } from "$lib/supabaseClient";
// import { page } from "$app/stores";

export async function load({ params }) {
  const slug = params.slug;

  const { data, error } = await supabase
    .from("vehicles")
    .select()
    .eq("slug", slug)
    .single();

  return {data};
}
