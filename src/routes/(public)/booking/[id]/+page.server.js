// import { env } from "$env/dynamic/public";
import CryptoJS from "crypto-js";
import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import sgMail from "@sendgrid/mail";
import { redirect } from "@sveltejs/kit";
import { html } from "$lib/booked.js";
import { default as FD } from "form-data";
import Mailgun from "mailgun.js";
import { MAIL_KEY } from "$env/static/private";
import { PUBLIC_KEY } from "$env/static/public";

export async function load({ url, params, locals }) {
  // console.log("PUBLIC_KEY", PUBLIC_KEY);

  let id =
    Number(CryptoJS.AES.decrypt(params.id.replaceAll("__", "/"), PUBLIC_KEY).toString(CryptoJS.enc.Utf8)) - 388000;
  // console.log("id", id);
  if (id < 0) {
    id = Number(CryptoJS.AES.decrypt(params.id.replaceAll("__", "/"), PUBLIC_KEY).toString(CryptoJS.enc.Utf8));
  }
  // console.log("id2", id);

  if (id <= 0) {
    id = Number(CryptoJS.AES.decrypt(params.id.replaceAll("__", "/"), "A4WDr").toString(CryptoJS.enc.Utf8)) - 388000;
  }
  // console.log("A4WDrid", id);
  if (id < 0) {
    id = Number(CryptoJS.AES.decrypt(params.id.replaceAll("__", "/"), "A4WDr").toString(CryptoJS.enc.Utf8));
  }
  // console.log("A4WDrid2", id);

  let quote = null;
  let user = null;

  if (id > 0) {
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .select()
      .eq("id", id)
      // .eq("status", "Request")
      .single();
    quote = quoteData;

    // console.log(quote);

    if (quote) {
      const { data: userData, error: userError } = await supabase.from("users").select().eq("id", quote.users).single();
      user = userData;
    }
  }

  return {
    quote: quote,
    user: user,
    id: id,
  };
}
export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    // console.log(fd);

    let user = JSON.parse(fd.user);
    const user_id = user.id;
    delete user.id;
    delete user.created_at;
    delete user.updated_at;

    let quote = JSON.parse(fd.quote);
    const quote_id = quote.id;
    delete quote.id;
    delete quote.created_at;
    delete quote.updated_at;
    quote.date_deposit = dayjs();
    quote.status = "Booking";
    quote.cc_number = CryptoJS.AES.encrypt(quote.cc_number, PUBLIC_KEY).toString();
    quote.cc_cvv = CryptoJS.AES.encrypt(quote.cc_cvv, PUBLIC_KEY).toString();

    const { error: userError } = await locals.sb.from("users").update(user).eq("id", user_id);
    if (userError) {
      console.log("error", userError);
    }

    const { error: quoteError } = await locals.sb.from("quotes").update(quote).eq("id", quote_id);
    if (quoteError) {
      console.log("error", quoteError);
    }

    let user_name = `${user.first_name.trim()} ${user.last_name.trim()}`;
    let user_email = user.email.trim();
    let vehicle_name = quote.details.vehicle.name;
    let pickup_name = quote.details.pickup.name;
    let dropoff_name = quote.details.dropoff.name;
    let pickup_date = dayjs(quote.details.date_start).format("DD MMM YYYY");
    let dropoff_date = dayjs(quote.details.date_end).format("DD MMM YYYY");
    let bond_name = quote.details.bonds.display_name;

    let emailSubject = `Booking Submitted: ${vehicle_name.trim()}: ${pickup_name.trim()}, ${pickup_date} - ${dropoff_name.trim()}, ${dropoff_date} ${
      bond_name ? `(${bond_name.trim()})` : ""
    } ${user_name}`;
    let emailBody = await html.create(quote_id);

    // let emailBody = `
    //     <div style="font-size:18px; font-weight:bold;margin-bottom:20px">Booking submitted!</div>
    //     <div>Booking Reference</div>
    //     <div style="font-size: 24px; font-weight: bold">Q${388000 + Number(quote_id)}</div>`;
    const { data: emailData } = await supabase.from("constants").select("name").eq("type", "email_quote").single();
    let bcc = emailData.name.split(",");
    let bccList = [];
    bcc.forEach((email) => {
      bccList.push(email.trim());
      // bccList.push({
      //   email: email.trim(),
      // });
    });

    const mailgun = new Mailgun(FD);
    const mg = mailgun.client({ username: "api", key: MAIL_KEY });
    mg.messages
      .create("mail.australia4wheeldriverentals.com", {
        from: "Australia 4WD Rentals <info@australia4wheeldriverentals.com>",
        to: [user_email],
        bcc: bccList,
        subject: emailSubject,
        html: emailBody,
      })
      .then((msg) => console.log(msg)) // logs response data
      .catch((err) => console.log(err)); // logs any error
    /*    
    sgMail.setApiKey(MAIL_KEY);
    await sgMail
      .send({
        personalizations: [
          {
            to: [
              {
                email: user_email,
                name: user_name,
              },
            ],
            bcc: bccList,
          },
        ],
        from: {
          email: "info@australia4wdrentals.com",
          name: "Australia 4WD Rentals",
        },
        subject: emailSubject,
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
    throw redirect(303, `/booking/success`);
  },
};
