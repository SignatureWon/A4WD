// import playwright from "playwright-aws-lambda";
import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
import { html } from "$lib/email/confirmation.js";
import { error, redirect } from "@sveltejs/kit";

export async function load() {
    return {};
};

export const actions = {

  email: async ({ request, url, params, locals }) => {
    // const browser2 = await playwright.launchChromium();
    // const context2 = await browser2.newContext();
    // const page2 = await context2.newPage();
    // const content2 = await confirmation.create(params.id);
    // await page2.setContent(content2);
    // const buffer = await page2.pdf({
    //   format: "A4",
    //   margin: {
    //     top: "1cm",
    //     bottom: "1cm",
    //     left: "1cm",
    //     right: "1cm",
    //   },
    // });
    // browser2.close();

    // let filePDF = new Blob([buffer], {
    //   type: "application/pdf",
    // });

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
        // attachments: [
        //   {
        //     content: buffer.toString("base64"),
        //     filename: `Confirmation - PT${388000 + Number(params.id)}.pdf`,
        //     type: "application/pdf",
        //     disposition: "attachment",
        //   },
        // ],
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