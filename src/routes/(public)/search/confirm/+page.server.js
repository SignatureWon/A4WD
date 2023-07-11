import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
  let id = url.searchParams.get("q");
  if (id) {
    const { data, error } = await supabase.from("quotes").select().eq("id", id).single();
    if (!data) {
      id = null;
    }
  }
  const { data: content } = await supabase
    .from("contents")
    .select("name,content,description,caption")
    .eq("type", "template_quote")
    .single();

  return { id: id, content: content };
}
