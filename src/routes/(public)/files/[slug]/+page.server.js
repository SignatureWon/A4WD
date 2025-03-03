import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

export async function load({ params }) {
  const slug = params.slug;

  const { data, error } = await supabase
    .from("contents")
    .select("name, attachment")
    .eq("slug", slug)
    .eq("type", "attachments")
    .single();
  // return {data};
  throw redirect(303, `${env.PUBLIC_URL}/storage/v1/object/public/terms/${data.attachment}`);
}
