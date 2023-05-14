import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
// import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());

    const { data: emailData } = await supabase
      .from("constants")
      .select("name")
      .eq("type", "email")
      .single();
    
    sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
    sgMail
      .send({
        to: emailData.name,
        from: "info@australia4wheeldriverentals.com.au",
        subject: `Message from ${newData.first_name}`,
        text: `First name: ${newData.first_name}, Last name: ${newData.last_name}, Email: ${newData.email}, Phone: ${newData.phone}, Message: ${newData.message}`,
        html: `
            First name: <strong>${newData.first_name}</strong><br>
            Last name: <strong>${newData.last_name}</strong><br>
            Email: <strong>${newData.email}</strong><br>
            Phone: <strong>${newData.phone}</strong><br><br>
            Message: <br>
            ${newData.message}`,
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
