import { supabase } from "$lib/supabaseClient";
import { error, redirect } from "@sveltejs/kit";
// import { db } from "$lib/server/db";

// const keys = ["name", "content", "description"];

export async function load({ url, params, locals }) {
  const { data } = await supabase
    .from("contents")
    .select("name,content,description,caption")
    .eq("type", "template_ticket_provisional")
    .single();
  return {
    data: data,
    path: url.pathname,
    // id: params.id,
  };
}
export const actions = {
  update: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());

    const { error: err } = await locals.sb
      .from("contents")
      .update(newData)
      .eq("type", "template_ticket_provisional");

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `${url.pathname}?success=update`);
  },
};
