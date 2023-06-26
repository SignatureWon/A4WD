import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";
import { error, redirect } from "@sveltejs/kit";
import { html } from "$lib/email/quotation.js";
import playwright from "playwright-aws-lambda";
import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";

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
  duplicate: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    const quote = JSON.parse(fd.quote);
    const id = quote.id;
    const user_id = quote.users.id;

    delete quote.id;
    delete quote.created_at;
    delete quote.updated_at;

    quote.users = user_id;

    const { data, error: err } = await locals.sb.from("quotes").insert(quote).select().single();

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    throw redirect(303, `/admin/sales/quotes/${data.id}`);
  },
  book: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Booking",
        date_deposit: dayjs()
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    // throw redirect(303, url.pathname);
    // console.log("id", params.id);
    throw redirect(303, `/admin/sales/book/${params.id}`);
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
    throw redirect(303, `/admin/sales/quotes`);
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
    throw redirect(303, `/admin/sales/quotes`);
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
      .upload(`Q${388000 + Number(params.id)}.pdf`, filePDF);

    if (uploadError) {
      console.log("uploadError", uploadError);
      const { data: updateData, error: updateError } = await supabase.storage
        .from("quotes")
        .update(`Q${388000 + Number(params.id)}.pdf`, filePDF, {
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

    emailBody = `<div style="font-size: 16px; margin-bottom: 50px">${fd.message}</div>` + emailBody;

    let bcc = emailData.name.split(",");
    let bccList = [];
    bcc.forEach((email) => {
      bccList.push({
        email: email.trim(),
      });
    });
    let email_to = [
      {
        email: dataUser.email,
        name: `${dataUser.first_name.trim()} ${dataUser.last_name.trim()}`,
      },
    ]
    let email_bcc = bccList

    if (fd.a4only) {
      email_to = bccList
      email_bcc = []
    }
    sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
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
          email: "info@australia4wdrentals.com",
          name: "Australia 4WD Rentals",
        },
        subject: `Quote: ${dataQuote.details.vehicle.name.trim()}: ${dataQuote.details.pickup.name.trim()}, ${dayjs(
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
  },
};
