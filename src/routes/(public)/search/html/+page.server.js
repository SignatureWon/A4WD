import dayjs from "dayjs";
import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
  const { data: letterhead } = await supabase
    .from("contents")
    .select("content, description, name")
    .eq("type", "template_letterhead")
    .single();

  const { data: contents } = await supabase.from("contents").select().eq("type", "template_quote").single();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, users (id, first_name, last_name, email, phone)")
    .eq("id", 38)
    .single();

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("name, slug, image")
    .eq("id", quote.details.vehicle.id)
    .single();

//   const { data: terms } = await supabase.from("terms").select().eq("suppliers", quote.details.supplier.id).single();
//   console.log("termstermsterms", quote.details.supplier.id);

  return {
    letterhead: letterhead,
    contents: contents,
    quote: quote,
    vehicle: vehicle,
    // terms: terms,
  };
}
