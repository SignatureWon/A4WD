import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
// import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());

    const { data: emailData } = await supabase.from("constants").select("name").eq("type", "email").single();

    sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
    await sgMail
      .send({
        personalizations: [
          {
            to: [
              {
                email: emailData.name,
                // name: `${newData.first_name.trim()} ${newData.last_name.trim()}`,
              },
            ],
            // bcc: bccList,
          },
        ],
        from: {
          email: "info@australia4wdrentals.com",
          name: "Australia 4WD Rentals",
        },
        subject: `Message from ${newData.first_name}`,
        content: [
          {
            type: "text/html",
            value: `
              First name: <strong>${newData.first_name}</strong><br>
              Last name: <strong>${newData.last_name}</strong><br>
              Email: <strong>${newData.email}</strong><br>
              Phone: <strong>${newData.phone}</strong><br><br>
              Message: <br>
              ${newData.message}`,
          },
        ],
        // mail_settings: {
        //   sandbox_mode: {
        //     enable: true,
        //   },
        // },
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
