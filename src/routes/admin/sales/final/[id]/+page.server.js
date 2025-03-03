import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";
import { error, redirect } from "@sveltejs/kit";
import { html } from "$lib/final.js";
import { html as confirmation } from "$lib/confirmation.js";
// import puppeteer from "puppeteer";
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium-min";
// import { chromium } from 'playwright';
import playwright from "playwright-aws-lambda";

import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";

export async function load({ url, params }) {
  const keys = [
    "id",
    "created_at",
    "updated_at",
    "details",
    "users",
    "status",
    "deposit",
    "payment_1",
    "payment_2",
    "balance",
    "nett",
    "gross",
    "profit",
    "discount",
    "agent",
    "agent_fee",
    "system_fee",
    "nett_profit",
    "refund",
    "remark",
    "remark_deposit",
    "remark_payment_1",
    "remark_payment_2",
    "remark_balance",
    "remark_refund",
    "paid_deposit",
    "paid_payment_1",
    "paid_payment_2",
    "paid_balance",
    "add_discount",
    "add_discount_remark",
    "receivables",
    "cc_fee",
    "cc_charge",
    "system_fee",
    "nett_profit",
    "supplier_reference",
  ];

  const quote = await db.one({
    table: "quotes",
    id: params.id,
    keys: keys,
  });

  let license_id = null;
  if ("license" in quote.details) {
    license_id = quote.details.license.id;
  } else {
    const { data: dataLicense } = await supabase
      .from("constants")
      .select("id")
      .eq("type", "licenses")
      .eq("name", quote.details.driver.license)
      .single();
    license_id = dataLicense.id;
  }
  let rates_id = null;
  if ("rates" in quote.details) {
    rates_id = quote.details.rates.id;
  }

  const search = {
    pickup: quote.details.pickup.id,
    dropoff: quote.details.dropoff.id,
    date_start: dayjs(quote.details.date_start),
    date_end: dayjs(quote.details.date_end),
    license: license_id,
    rates: rates_id,
    vehicle: quote.details.vehicle.id,
  };
  let allRates = [];
  const { data: flexData } = await cal.getFlex(supabase, search);

  const { data: seasonalData } = await cal.getSeasonal(supabase, search);
  allRates = [...flexData, ...seasonalData];

  const { data: feesData, error: feesError } = await cal.getFees(supabase, search);
  const { data: blockoutsData, error: blockoutsError } = await cal.getBlockouts(supabase, search);
  const { data: specialsData, error: specialsError } = await cal.getSpecials(supabase, search);
  const { data: bondsData, error: bondsError } = await cal.getBonds(supabase, search);
  const { data: addonsData, error: addonsError } = await cal.getAddons(supabase, search);
  const { data: termsData, error: termsError } = await cal.getTerms(supabase, search);

  const filteredRoutes = cal.filterRoutes(allRates, search);
  const arrangedRates = cal.arrangeRates(filteredRoutes, search);
  const filteredBlockouts = cal.filterBlockouts(arrangedRates, blockoutsData);
  const addedFees = cal.addFees(filteredBlockouts.rates, feesData);
  const addedSpecials = cal.addSpecials(addedFees, specialsData, search);
  const addedBonds = cal.addBonds(addedSpecials, bondsData);
  const addAddons = cal.addAddons(addedBonds, addonsData);
  const addTerms = cal.addTerms(addAddons, termsData);

  // console.log(addTerms.length);

  //   const { data: vehicle } = await supabase
  //     .from("vehicles")
  //     .select("name, slug, image")
  //     .eq("id", quote.id)
  //     .single();
  const { data: user } = await supabase.from("users").select().eq("id", quote.users).single();
  let options = {};
  const { data: dataOption } = await supabase.rpc("search_options").select();

  dataOption.forEach((opt) => {
    options[opt.name] = opt.options;
  });

  const { data: templates } = await supabase.from("contents").select("name, content").eq("type", "emails");

  return {
    quote: quote,
    user: user,
    templates: templates,
    detail: JSON.parse(JSON.stringify(addTerms[0])),
    options: JSON.parse(JSON.stringify(options)),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  // insert: async ({ request, url, locals }) => {
  //   await db.actions.insert(request, url, locals, {
  //     table: "contents",
  //   });
  // },
  update: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    const quote = JSON.parse(fd.quote);
    const id = quote.id;

    console.log("id", id);

    delete quote.id;
    delete quote.created_at;
    delete quote.updated_at;

    // console.log("quote", quote);

    const { error: err } = await locals.sb.from("quotes").update(quote).eq("id", id);

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    throw redirect(303, url.pathname);
  },
  download: async ({ request, url, params, locals }) => {
    const browser = await playwright.launchChromium();
    const context = await browser.newContext();
    const page = await context.newPage();
    // const browser = await chromium.launch()
    // const page = await browser.newPage()
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
    await browser.close();
    // const browser = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath("/opt/chromium"),
    //   headless: chromium.headless,
    // });
    // const page = await browser.newPage();
    // const content = await html.create(params.id);
    // await page.setContent(content);
    // const buffer = await page.pdf({
    //   format: "A4",
    //   margin: {
    //     top: "1cm",
    //     bottom: "1cm",
    //     left: "1cm",
    //     right: "1cm",
    //   },
    // });

    let filePDF = new Blob([buffer], {
      type: "application/pdf",
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("quotes")
      .upload(`Final Ticket - Q${388000 + Number(params.id)}.pdf`, filePDF);

    if (uploadError) {
      console.log("uploadError", uploadError);
      const { data: updateData, error: updateError } = await supabase.storage
        .from("quotes")
        .update(`Final Ticket - Q${388000 + Number(params.id)}.pdf`, filePDF, {
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

    // const browser = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath("/opt/chromium"),
    //   headless: chromium.headless,
    // });
    // const browser = await chromium.launch()
    // const page = await browser.newPage();
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

    // const browser2 = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath("/opt/chromium"),
    //   headless: chromium.headless,
    // });
    // const browser2 = await chromium.launch()
    // const page2 = await browser2.newPage();
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
      .upload(`Final Ticket - Q${388000 + Number(params.id)}.pdf`, filePDF);

    if (uploadError) {
      console.log("uploadError", uploadError);
      const { data: updateData, error: updateError } = await supabase.storage
        .from("quotes")
        .update(`Final Ticket - Q${388000 + Number(params.id)}.pdf`, filePDF, {
          cacheControl: "3600",
          upsert: true,
        });
      if (updateError) {
        console.log(updateError);
      }
    }

    emailBody = `<div style="margin-bottom: 50px; font-size: 16px;">${fd.message}</div>` + emailBody;
    // console.log(emailBody);
    // console.log("send to", dataUser.email)

    let bcc = emailData.name.split(",");
    let bccList = [];
    bcc.forEach((email) => {
      bccList.push({
        email: email.trim(),
      });
    });
    let emailResponse = "";
    sgMail.setApiKey(env.PUBLIC_MAIL_KEY);
    await sgMail
      .send({
        personalizations: [
          {
            to: [
              {
                email: dataUser.email,
                name: `${dataUser.first_name.trim()} ${dataUser.last_name.trim()}`,
              },
            ],
            bcc: bccList,
          },
        ],
        from: {
          email: "info@australia4wdrentals.com",
          name: "Australia 4WD Rentals",
        },
        subject: `Final Ticket: ${dataQuote.details.vehicle.name.trim()}: ${dataQuote.details.pickup.name.trim()}, ${dayjs(
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
            filename: `Final Ticket - Q${388000 + Number(params.id)}.pdf`,
            type: "application/pdf",
            disposition: "attachment",
          },
          {
            content: buffer2.toString("base64"),
            filename: `Booking Confirmation - Q${388000 + Number(params.id)}.pdf`,
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
        emailResponse = "Email sent";
        console.log("Email sent");
      })
      .catch((error) => {
        emailResponse = error;
        console.error(error);
      });

    throw redirect(303, url.pathname);
  },
  provisional: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    const updateData = {
      supplier_reference: fd.supplier_reference,
      status: "Provisional",
    };
    const { error: err } = await locals.sb.from("quotes").update(updateData).eq("id", params.id);

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    throw redirect(303, `/admin/sales/provisional/${params.id}`);
  },

  // delete: async ({ request, url, params, locals }) => {
  //   await db.actions.delete(request, url, locals, {
  //     id: params.id,
  //     table: "contents",
  //   });
  // },
  // duplicate: async ({ request, url, params, locals }) => {
  //   await db.actions.duplicate(request, url, locals, {
  //     id: params.id,
  //     table: "contents",
  //   });
  // },
};

// async function downloadFiles(url, count) {
//   const browser = await puppeteer.launch({
//       headless: false,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });
//   const page = await browser.newPage();
//   for (let i = 0; i < count; i++) {
//       const pageUrl = await url(i);
//       try {
//           await page.goto(pageUrl);
//           await page.pdf({
//               path: `Qdf-${i}.pdf`,
//               format: 'A4',
//               printBackground: true
//           });
//       } catch (e) {
//           console.log(`Error loading ${pageUrl}`);
//       }
//   }
//   await browser.close();
// }
