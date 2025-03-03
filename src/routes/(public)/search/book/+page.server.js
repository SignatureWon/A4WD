import { supabase } from "$lib/supabaseClient";
import { html } from "$lib/email/quotation.js";
import { q } from "$lib/quote.js";
import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
import dayjs from "dayjs";
import { error, redirect } from "@sveltejs/kit";
import { default as FD } from "form-data";
import Mailgun from "mailgun.js";
import { MAIL_KEY } from "$env/static/private";

export async function load({ url, params, locals }) {
  const id = url.searchParams.get("q");
  const { data: options, error: options_error } = await supabase.rpc("search_options").select();

  let quote = null;
  const { data, error } = await supabase.from("tempQuotes").select().eq("id", id).single();

  if (data) {
    quote = JSON.parse(data.quote);
  }
  return { quote: quote, options: options };
}
export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    let user = JSON.parse(fd.user);
    let quote = JSON.parse(fd.quote);

    const { data: existing_user, error: error_existing_user } = await supabase
      .from("users")
      .select()
      .eq("email", user.email)
      .single();

    if (existing_user) {
      const { error: error_update_user } = await supabase.from("users").update(user).eq("id", existing_user.id);
      user.id = existing_user.id;
    } else {
      const { data: new_user, error: error_new_user } = await supabase.from("users").insert(user).select().single();
      if (error_new_user) {
        console.log("error_new_user", error_new_user);
      }
      if (new_user) {
        user.id = new_user.id;
      }
    }

    quote.users = user.id;
    const { data: new_quote, error: error_new_quote } = await supabase.from("quotes").insert(quote).select().single();

    if (new_quote) {
      quote.id = new_quote.id;
      let emailBody = await html.create(new_quote.id);

      const { data: emailData } = await supabase.from("constants").select("name").eq("type", "email_quote").single();
      let bcc = emailData.name.split(",");
      let bccList = [];
      bcc.forEach((email) => {
        bccList.push(email.trim());
        // bccList.push({
        //   email: email.trim(),
        // });
      });
      let email_to = [user.email.trim()];
      // let email_to = [
      //   {
      //     email: user.email.trim(),
      //     name: `${user.first_name ? user.first_name.trim() : "-"} ${user.last_name ? user.last_name.trim() : "-"}`,
      //   },
      // ];
      let email_bcc = bccList;

      let emailSubject = `Quote: ${quote.details.vehicle.name.trim()}: ${quote.details.pickup.name.trim()}, ${dayjs(
        quote.details.date_start
      ).format("DD MMM YYYY")} - ${quote.details.dropoff.name.trim()}, ${dayjs(quote.details.date_end).format(
        "DD MMM YYYY"
      )} (${quote.details.bonds.display_name.trim()}) ${user.first_name.trim()} ${user.last_name.trim()}`;

      const mailgun = new Mailgun(FD);
      const mg = mailgun.client({ username: "api", key: MAIL_KEY });
      mg.messages
        .create("mail.australia4wheeldriverentals.com", {
          from: "Australia 4WD Rentals <info@australia4wheeldriverentals.com>",
          to: email_to,
          bcc: email_bcc,
          subject: emailSubject,
          html: emailBody,
        })
        .then((msg) => console.log(msg)) // logs response data
        .catch((err) => console.log(err)); // logs any error
      /*      
      sgMail.setApiKey(env.PUBLIC_MAIL_KEY);
      await sgMail
        .send({
          personalizations: [
            {
              to: email_to,
              bcc: email_bcc,
              // to: [
              //   {
              //     email: user.email,
              //     name: `${user.first_name.trim()} ${user.last_name.trim()}`,
              //   },
              // ],
              // bcc: bccList,
            },
          ],
          from: {
            email: "info@australia4wdrentals.com",
            name: "Australia 4WD Rentals",
          },
          subject: `Quote: ${quote.details.vehicle.name.trim()}: ${quote.details.pickup.name.trim()}, ${dayjs(
            quote.details.date_start
          ).format("DD MMM YYYY")} - ${quote.details.dropoff.name.trim()}, ${dayjs(quote.details.date_end).format(
            "DD MMM YYYY"
          )} (${quote.details.bonds.display_name.trim()}) ${user.first_name.trim()} ${user.last_name.trim()}`,
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
        */
    }

    // console.log(user);

    //   const { data, error } = await supabase
    //     .from("tempQuotes")
    //     .insert({
    //       quote: fd.quote,
    //     })
    //     .select()
    //     .single();

    throw redirect(303, `/search/confirm?q=${quote.id}`);
  },
};
