import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
// import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";
import { default as FD } from "form-data";
import Mailgun from "mailgun.js";
import { MAIL_KEY } from "$env/static/private";

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());

    const { data: emailData } = await supabase.from("constants").select("name").eq("type", "email").single();
    let to = emailData.name.split(",");
    let toList = [];
    to.forEach((email) => {
      toList.push(email.trim());
      // toList.push({
      //   email: email.trim(),
      // });
    });

    const mailgun = new Mailgun(FD);
    const mg = mailgun.client({ username: "api", key: MAIL_KEY });
    mg.messages
      .create("mail.australia4wheeldriverentals.com", {
        from: "Australia 4WD Rentals <info@australia4wheeldriverentals.com>",
        to: toList,
        subject: `Message from ${newData.first_name}`,
        html: `
              First name: <strong>${newData.first_name}</strong><br>
              Last name: <strong>${newData.last_name}</strong><br>
              Email: <strong>${newData.email}</strong><br>
              Phone: <strong>${newData.phone}</strong><br><br>
              Message: <br>
              ${newData.message}`,
      })
      .then((msg) => console.log(msg)) // logs response data
      .catch((err) => console.log(err)); // logs any error
    /*
    sgMail.setApiKey(env.PUBLIC_MAIL_KEY);
    await sgMail
      .send({
        personalizations: [
          {
            to: toList,
            // bcc: bccList,
          },
        ],
        from: {
          email: "info@australia4wdrentals.com.au",
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
      */
  },
};
