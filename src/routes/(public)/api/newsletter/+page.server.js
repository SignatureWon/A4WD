// import { env } from "$env/dynamic/public";
// import sgMail from "@sendgrid/mail";
// import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());

    const { data, error } = await supabase.from("form_newsletter").insert({
      email: newData.email,
    });

    if (data) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  },
};
