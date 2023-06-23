import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
import { html } from "$lib/email/quotation.js";
import { error, redirect } from "@sveltejs/kit";

export async function load() {
    return {};
};

export const actions = {

  email: async ({ request, url, params, locals }) => {
    let emailBody = await html.create(163)
    sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
    await sgMail
      .send({
        personalizations: [
          {
            to: [
              {
                email: `maychwen.tan@cubinet.com`,
                name: `May`,
              },
              {
                email: `wonyeehow@gmail.com`,
                name: `Yee How`,
              },
            ],
          },
        ],
        from: {
          email: "info@australia4wdrentals.com",
          name: "Australia 4WD Rentals",
        },
        subject: `Test EMAIL`,
        content: [
          {
            type: "text/html",
            value: emailBody,
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

    throw redirect(303, url.pathname);
  }
}