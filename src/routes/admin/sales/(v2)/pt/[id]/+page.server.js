import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";
import { error, redirect } from "@sveltejs/kit";
import { html } from "$lib/email/provisional.js";
import { html as confirmation } from "$lib/email/confirmation.js";
import playwright from "playwright-aws-lambda";
import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
import { default as FD } from "form-data";
import Mailgun from "mailgun.js";
import { MAIL_KEY } from "$env/static/private";

export async function load({ url, params }) {
  const { data: quote } = await supabase.from("quotes").select("*, users (*)").eq("id", params.id).single();
  return {
    quote: quote,
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  update: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    const quote = JSON.parse(fd.quote);
    const id = quote.id;
    const user_id = quote.users.id;

    delete quote.id;
    delete quote.created_at;
    delete quote.updated_at;

    quote.users = user_id;

    const { error: err } = await locals.sb.from("quotes").update(quote).eq("id", id);

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    throw redirect(303, url.pathname);
  },
  provisional: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Provisional",
        date_provisional: dayjs(),
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/pt/${params.id}`);
  },
  final: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Final",
        date_balance: dayjs(),
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/ft/${params.id}`);
  },
  clearcard: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        cc_type: null,
        cc_name: null,
        cc_number: null,
        cc_cvv: null,
        cc_month: null,
        cc_year: null,
        cc_remark: null,
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/pt/${params.id}`);
  },
  trash: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Trash",
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/pt`);
  },
  archive: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Archive",
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/pt`);
  },
  download: async ({ request, url, params, locals }) => {
    const browser = await playwright.launchChromium();
    const context = await browser.newContext();
    const page = await context.newPage();
    const content = await html.create(params.id);
    await page.setContent(content);
    const buffer = await page.pdf({
      format: "A4",
      margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
    });

    let filePDF = new Blob([buffer], {
      type: "application/pdf",
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("quotes")
      .upload(`Provisional Ticket - PT${388000 + Number(params.id)}.pdf`, filePDF);

    if (uploadError) {
      console.log("uploadError", uploadError);
      const { data: updateData, error: updateError } = await supabase.storage
        .from("quotes")
        .update(`Provisional Ticket - PT${388000 + Number(params.id)}.pdf`, filePDF, {
          cacheControl: "3600",
          upsert: true,
        });
      if (updateError) {
        console.log(updateError);
      }
    }
    throw redirect(303, url.pathname);
  },
  email: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    let emailBody = await html.create(params.id);
    const { data: emailData } = await supabase.from("constants").select("name").eq("type", "email_quote").single();
    const { data: dataQuote } = await supabase.from("quotes").select().eq("id", params.id).single();
    let getBond = Object.keys(dataQuote.details.bonds).length ? dataQuote.details.bonds : dataQuote.details.bond;
    const { data: dataUser } = await supabase.from("users").select().eq("id", dataQuote.users).single();

    const browser = await playwright.launchChromium();
    const context = await browser.newContext();
    const page = await context.newPage();
    const content = await html.create(params.id);
    await page.setContent(content);
    const buffer = await page.pdf({
      format: "A4",
      margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
    });
    browser.close();

    const browser2 = await playwright.launchChromium();
    const context2 = await browser2.newContext();
    const page2 = await context2.newPage();
    const content2 = await confirmation.create(params.id);
    await page2.setContent(content2);
    const buffer2 = await page2.pdf({
      format: "A4",
      margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
    });
    browser2.close();

    let filePDF = new Blob([buffer], {
      type: "application/pdf",
    });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("quotes")
      .upload(`Provisional Ticket - PT${388000 + Number(params.id)}.pdf`, filePDF);

    if (uploadError) {
      console.log("uploadError", uploadError);
      const { data: updateData, error: updateError } = await supabase.storage
        .from("quotes")
        .update(`Provisional Ticket - PT${388000 + Number(params.id)}.pdf`, filePDF, {
          cacheControl: "3600",
          upsert: true,
        });
      if (updateError) {
        console.log(updateError);
      }
    }

    emailBody =
      `<div style="font-size: 16px; margin-bottom: 50px">${fd.message.replace(/(?:\r\n|\r|\n)/g, "<br>")}</div>` +
      emailBody;

    let bcc = emailData.name.split(",");
    let bccList = [];
    bcc.forEach((email) => {
      bccList.push(email.trim());
      // bccList.push({
      //   email: email.trim(),
      // });
    });
    let email_to = [
      dataUser.email.trim(),
      // {
      //   email: dataUser.email.trim(),
      //   name: `${dataUser.first_name ? dataUser.first_name.trim() : "-"} ${
      //     dataUser.last_name ? dataUser.last_name.trim() : "-"
      //   }`,
      // },
    ];
    let email_bcc = bccList;

    if (fd.a4only) {
      email_to = bccList;
      email_bcc = [];
    }
    let resp = {
      status: "success",
      message: "Email sent",
    };

    let emailSubject = `Provisional Ticket: ${dataQuote.details.vehicle.name.trim()}: ${dataQuote.details.pickup.name.trim()}, ${dayjs(
      dataQuote.details.date_start
    ).format("DD MMM YYYY")} - ${dataQuote.details.dropoff.name.trim()}, ${dayjs(dataQuote.details.date_end).format(
      "DD MMM YYYY"
    )} (${getBond.display_name.trim()}) ${dataUser.first_name.trim()} ${dataUser.last_name.trim()}`;

    // console.log("email_to", email_to);
    // console.log("email_bcc", email_bcc);
    // console.log("emailSubject", emailSubject);

    const mailgun = new Mailgun(FD);
    const mg = mailgun.client({ username: "api", key: MAIL_KEY });
    mg.messages
      .create("mg.australia4wdrentals.com.au", {
        from: "Australia 4WD Rentals <sales@australia4wdrentals.com.au>",
        // to: ["won@signature.studio"],
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
            //     email: dataUser.email,
            //     name: `${dataUser.first_name.trim()} ${dataUser.last_name.trim()}`,
            //   },
            // ],
            // bcc: bccList,
          },
        ],
        from: {
          email: "info@australia4wdrentals.com.au",
          name: "Australia 4WD Rentals",
        },
        subject: `Provisional Ticket: ${dataQuote.details.vehicle.name.trim()}: ${dataQuote.details.pickup.name.trim()}, ${dayjs(
          dataQuote.details.date_start
        ).format("DD MMM YYYY")} - ${dataQuote.details.dropoff.name.trim()}, ${dayjs(dataQuote.details.date_end).format(
          "DD MMM YYYY"
        )} (${getBond.display_name.trim()}) ${dataUser.first_name.trim()} ${dataUser.last_name.trim()}`,
        content: [
          {
            type: "text/html",
            value: emailBody,
          },
        ],
        attachments: [
          {
            content: buffer.toString("base64"),
            filename: `Provisional Ticket - PT${388000 + Number(params.id)}.pdf`,
            type: "application/pdf",
            disposition: "attachment",
          },
          {
            content: buffer2.toString("base64"),
            filename: `Booking Confirmation - PT${388000 + Number(params.id)}.pdf`,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
        // mail_settings: {
        //   sandbox_mode: {
        //     enable: true,
        //   },
        // },
      })
      .then(() => {
        resp = {
          status: "success",
          message: "Email sent",
        };
        // console.log("Email sent");
      })
      .catch((error) => {
        resp = {
          status: "error",
          message: error.response.body.errors[0].message,
        };
        // console.error(error.response.body.errors[0].message);
      });
      */
    throw redirect(303, `${url.pathname}?status=${resp.status}&message=${resp.message}`);

    // throw redirect(303, url.pathname);
  },
};
