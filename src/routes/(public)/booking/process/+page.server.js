import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import sgMail from "@sendgrid/mail";
// import { env } from "$env/dynamic/public";
import { error, redirect } from "@sveltejs/kit";
import CryptoJS from "crypto-js";
import { default as FD } from "form-data";
import Mailgun from "mailgun.js";
import { MAIL_KEY, PUBLIC_KEY } from "$env/static/private";

export async function load() {
  return {};
}

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    let id = fd.id;
    delete fd.id;

    fd.date_deposit = dayjs();
    fd.status = "Booking";
    fd.cc_number = CryptoJS.AES.encrypt(fd.cc_number, PUBLIC_KEY).toString();
    fd.cc_cvv = CryptoJS.AES.encrypt(fd.cc_cvv, PUBLIC_KEY).toString();

    // console.log("fd", fd);

    const { error: err } = await locals.sb.from("quotes").update(fd).eq("id", id);
    if (err) {
      console.log("error", err);
    }

    const { data: dataQuote, error: errorQuote } = await supabase
      .from("quotes")
      .select("*, users (*)")
      .eq("id", id)
      .single();

    // console.log(dataQuote);
    let user_name = `${dataQuote.users.first_name.trim()} ${dataQuote.users.last_name.trim()}`;
    let user_email = dataQuote.users.email.trim();
    let vehicle_name = dataQuote.details.vehicle.name;
    let pickup_name = dataQuote.details.pickup.name;
    let dropoff_name = dataQuote.details.dropoff.name;
    let pickup_date = dayjs(dataQuote.details.date_start).format("DD MMM YYYY");
    let dropoff_date = dayjs(dataQuote.details.date_end).format("DD MMM YYYY");
    let bond_name = dataQuote.details.bonds.display_name;

    let emailSubject = `Booking Submitted: ${vehicle_name.trim()}: ${pickup_name.trim()}, ${pickup_date} - ${dropoff_name.trim()}, ${dropoff_date} (${bond_name.trim()}) ${user_name}`;
    let emailBody = `
        <div style="font-size:18px; font-weight:bold;margin-bottom:20px">Booking submitted!</div>
        <div>Booking Reference</div>
        <div style="font-size: 24px; font-weight: bold">B${388000 + Number(id)}</div>`;

    // console.log(emailSubject);

    // // const { data: dataUser, error: errorUser } = await supabase.from("users").select().eq("id", dataQuote.users).single();

    // if (fd.vehicles) {
    //   const { data: vehicleData } = await supabase.from("vehicles").select("name").eq("id", fd.vehicles).single();
    //   vehicle_name = vehicleData.name;
    // }

    // const { data: depotData } = await supabase.from("depots").select("id, name");
    // let pickup_name = depotData.filter((item) => {
    //   return item.id === fd.pickup_depot;
    // })[0].name;
    // let dropoff_name = depotData.filter((item) => {
    //   return item.id === fd.dropoff_depot;
    // })[0].name;

    const { data: dataEmail } = await supabase.from("constants").select("name").eq("type", "email_quote").single();
    let bcc = dataEmail.name.split(",");
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
