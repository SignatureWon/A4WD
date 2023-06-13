import { supabase } from "$lib/supabaseClient";
import { pdf } from "$lib/pdf.js";
import { html } from "$lib/html.js";
import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";
import dayjs from "dayjs";

export async function load({ url, params, locals }) {
  const { data: content } = await supabase
    .from("contents")
    .select("name,content,description,caption")
    .eq("type", "template_quote")
    .single();
  return { content };
}
export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    // console.log(fd);

    let user = {
      first_name: fd.first_name,
      last_name: fd.last_name,
      phone: fd.phone,
      email: fd.email,
      address_1: fd.address_1,
      address_2: fd.address_2,
      postcode: fd.postcode,
      city: fd.city,
      state: fd.state,
      country: fd.country,
    };
    // console.log("USER", user, fd.user_id);

    if (fd.user_id === "") {
      const { data: dataUser, error: errUser } = await supabase.from("users").insert(user).select().single();

      if (errUser) {
        console.log("error", errUser);
      } else {
        user.id = dataUser.id;
      }
    } else {
      const { error: errUpdateUser } = await supabase.from("users").update(user).eq("id", fd.user_id);

      user.id = fd.user_id;
    }
    let data = JSON.parse(fd.data);
    let detail = JSON.parse(data.detail);
    detail.driver = {
      age: data.age,
      license: data.license,
    };
    detail.passenger = {
      adult: data.adult,
      children: data.children,
    };

    const agent_fee = 0;
    const system_fee = (detail.daily.profit * 8) / 100;

    let quote = {
      details: detail,
      users: user.id,
      status: "Request",
      balance: 0,
      deposit: 0,
      payment_1: 0,
      payment_2: 0,
      gross: detail.daily.gross,
      nett: detail.daily.nett,
      profit: detail.daily.profit,
      discount: 0,
      agent_fee: agent_fee,
      system_fee: system_fee,
      nett_profit: detail.daily.profit - agent_fee - system_fee,
      comment: fd.comment,
    };

    // console.log("quote", quote);

    const { data: dataQuote, error: errQuote } = await supabase.from("quotes").insert(quote).select().single();

    if (errQuote) {
      console.log("errQuote", errQuote);
    }

    // console.log("dataQuote", dataQuote);

    // let filePDF = new Blob(
    //   [await pdf.create(dataQuote.id, "template_quote")],
    //   {
    //     type: "application/pdf",
    //   }
    // );
    // const { data: dataPdf, error: errPdf } = await supabase.storage
    //   .from("quotes")
    //   .upload(`Q${388000 + dataQuote.id}.pdf`, filePDF);

    //   if (errPdf) {
    //     console.log("errPdf", errPdf);
    //   }

    const { data: contents } = await supabase.from("contents").select("caption").eq("type", "template_quote").single();

    const { data: terms } = await supabase
      .from("terms")
      .select()
      .eq("suppliers", dataQuote.details.supplier.id)
      .single();

    let emailBody = await html.create(dataQuote.id, "template_quote");
    const { data: emailData } = await supabase.from("constants").select("name").eq("type", "email_quote").single();

    let getBond = Object.keys(dataQuote.details.bonds).length ? dataQuote.details.bonds : dataQuote.details.bond;
    let bcc = emailData.name.split(",")
    let bccList = []
    bcc.forEach(email => {
      bccList.push({
        email: email.trim()
      })
    })
    let emailResponse = ""
    sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
    await sgMail
      .send({
        personalizations: [
          {
            to: [
              {
                email: user.email,
                name: `${user.first_name.trim()} ${user.last_name.trim()}`,
              },
            ],
            bcc: bccList,
          },
        ],
        from: {
          email: "info@australia4wdrentals.com",
          name: "Australia 4WD Rentals",
        },
        subject: `Quote: ${dataQuote.details.vehicle.name.trim()}: ${
            dataQuote.details.pickup.name.trim()
          }, ${dayjs(dataQuote.details.date_start).format("DD MMM YYYY")} - ${
            dataQuote.details.dropoff.name.trim()
          }, ${dayjs(dataQuote.details.date_end).format("DD MMM YYYY")} (${
            getBond.display_name.trim()
          }) ${user.first_name.trim()} ${user.last_name.trim()}`,
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
        emailResponse = "Email sent"
        console.log("Email sent");
      })
      .catch((error) => {
        emailResponse = error
        console.error(error);
      });

    return {
      quote: JSON.parse(JSON.stringify(dataQuote)),
      emailResponse: JSON.parse(JSON.stringify(emailResponse)),
    };
  },
};
