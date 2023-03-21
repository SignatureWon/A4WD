import { supabase } from "$lib/supabaseClient";
export async function load() {
  const { data: contents, error } = await supabase
    .from("contents")
    .select()
    .in("type", [
      "announcements",
      //   "banners",
      //   "destinations",
      //   "testimonials",
      //   "faqs",
    ])
    .eq("status", true);
  return { contents };
}
