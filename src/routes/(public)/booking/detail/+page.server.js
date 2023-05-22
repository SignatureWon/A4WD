import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
    const { data: content } = await supabase
      .from("contents")
      .select("name,content,description,caption")
      .eq("type", "template_quote")
      .single();
    return { content };
  }
  
export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    let id = Number(fd.reference) - 388000

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*, users (*)")
      .eq("id", id)
      .eq("users.email", fd.email)
      .single();

    return {quote}
  },
};
