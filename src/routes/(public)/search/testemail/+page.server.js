import sgMail from "@sendgrid/mail";
import { env } from "$env/dynamic/public";
export async function load() {
  let result = "";
  sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
  await sgMail
    .send({
      personalizations: [
        {
          to: [
            {
              email: "won@signature.studio",
              name: "YH Won",
            },
          ],
          bcc: [
            {
              email: "info@australia4wdrentals.com",
            },
            {
              email: "info@australia4wheeldriverentals.com",
            },
          ],
        },
      ],
      from: {
        email: "info@australia4wdrentals.com",
        name: "Australia 4WD Rentals",
      },
      subject: "Test Email",
      content: [
        {
          type: "text/html",
          value: "<div>Hello,</div><div>World!</div>",
        },
      ],
      mail_settings: {
        sandbox_mode: {
          enable: true,
        },
      },
    })
    .then(() => {
      result = "Email sent";
      console.log("Email sent");
    })
    .catch((error) => {
      result = error;
      console.error(error);
    });
  return { result: JSON.parse(JSON.stringify(result)) };
}
