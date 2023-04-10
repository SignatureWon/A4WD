import { supabase } from "$lib/supabaseClient";
// import { page } from "$app/stores";

export async function load({ params }) {
  const slug = params.slug;

  console.log("slug", slug);

  const { data, error } = await supabase
    .from("vehicles")
    .select()
    .eq("slug", slug)
    .single();

  console.log("data", data);

  return {data};
}
