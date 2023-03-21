import { supabase } from "$lib/supabaseClient";
export async function load() {
    const { data: contents } = await supabase
    .from("contents")
    .select()
    .in("type", [
      "announcements",
      "banners",
      "destinations",
      "testimonials",
      "faqs",
    ])
    .eq("status", true);

const { data: blog } = await supabase
    .from("contents")
    .select()
    .eq("type", "articles")
    .eq("status", true)
    .limit(3)
  return { contents, blog };
}
