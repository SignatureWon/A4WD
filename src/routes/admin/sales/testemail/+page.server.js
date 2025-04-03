// import playwright from "playwright-aws-lambda";
import { env } from "$env/dynamic/public";
import { default as FD } from "form-data";
import Mailgun from "mailgun.js";
// import sgMail from "@sendgrid/mail";
import { html } from "$lib/email/confirmation.js";
import { error, redirect } from "@sveltejs/kit";
import { MAIL_KEY } from "$env/static/private";

export async function load() {
  return {};
}

export const actions = {
  email: async ({ request, url, params, locals }) => {
    // const formData = require("form-data");
    // const Mailgun = require("mailgun.js");
    let emailBody = await html.create(163);

    const mailgun = new Mailgun(FD);
    const mg = mailgun.client({ username: "api", key: MAIL_KEY });
    mg.messages
      .create("mg.australia4wdrentals.com.au", {
        from: "Australia 4WD Rentals <sales@australia4wdrentals.com.au>",
        to: ["Won <won@signature.studio>"],
        // bcc: ["hello@signature.studio"],
        subject: "Hello from A4WD",
        // text: "Testing some Mailgun awesomeness!",
        html: emailBody,
      })
      .then((msg) => console.log(msg)) // logs response data
      .catch((err) => console.log(err)); // logs any error

    // mg.messages
    //   .create("sandboxdbe27d863af64baaae508b1b1662f02d.mailgun.org", {
    //     from: "Excited User <mailgun@sandboxdbe27d863af64baaae508b1b1662f02d.mailgun.org>",
    //     to: ["test@example.com"],
    //     subject: "Hello",
    //     text: "Testing some Mailgun awesomeness!",
    //     html: "<h1>Testing some Mailgun awesomeness!</h1>",
    //   })
    //   .then((msg) => console.log(msg)) // logs response data
    //   .catch((err) => console.log(err));

    // // console.log("key", MAIL_KEY);

    // // const formData = require("form-data");
    // // const Mailgun = require("mailgun.js");
    // const mailgun = new Mailgun(FormData);
    // // const mailgun = new Mailgun(formData);
    // const mg = mailgun.client({ username: "api", key: MAIL_KEY });

    // mg.messages
    //   .create("sandbox-123.mailgun.org", {
    //     from: "Australia 4WD Rentals <mailgun@mail.australia4wheeldriverentals.com>",
    //     to: ["won@signature.studio"],
    //     subject: "Hello",
    //     // text: "Testing some Mailgun awesomeness!",
    //     html: emailBody,
    //   })
    //   .then((msg) => console.log(msg)) // logs response data
    //   .catch((err) => console.log(err)); // logs any error

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

    // let emailBody = await html.create(163);
    // sgMail.setApiKey(env.PUBLIC_MAIL_KEY);
    // await sgMail
    //   .send({
    //     personalizations: [
    //       {
    //         to: [
    //           {
    //             email: `maychwen.tan@cubinet.com`,
    //             name: `May`,
    //           },
    //           {
    //             email: `wonyeehow@gmail.com`,
    //             name: `Yee How`,
    //           },
    //         ],
    //       },
    //     ],
    //     from: {
    //       email: "info@australia4wdrentals.com.au",
    //       name: "Australia 4WD Rentals",
    //     },
    //     subject: `Test EMAIL`,
    //     content: [
    //       {
    //         type: "text/html",
    //         value: emailBody,
    //       },
    //     ],
    //     // attachments: [
    //     //   {
    //     //     content: buffer.toString("base64"),
    //     //     filename: `Confirmation - PT${388000 + Number(params.id)}.pdf`,
    //     //     type: "application/pdf",
    //     //     disposition: "attachment",
    //     //   },
    //     // ],
    //     // mail_settings: {
    //     //   sandbox_mode: {
    //     //     enable: true,
    //     //   },
    //     // },
    //   })
    //   .then(() => {
    //     console.log("Email sent");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    throw redirect(303, url.pathname);
  },
};
