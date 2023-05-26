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
      country: fd.country,
      comment: fd.comment,
    };

    if (fd.user_id === "") {
      const { data: dataUser, error: errUser } = await supabase
        .from("users")
        .insert(user)
        .select()
        .single();

      if (errUser) {
        console.log("error", errUser);
      } else {
        user.id = dataUser.id;
      }
    } else {
      const { error: errUser } = await supabase
        .from("users")
        .update(user)
        .eq("id", fd.user_id);

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
    };

    // console.log("quote", quote);

    const { data: dataQuote, error: errQuote } = await supabase
      .from("quotes")
      .insert(quote)
      .select()
      .single();

    if (errQuote) {
      console.log("errQuote", errQuote);
    }

    console.log("dataQuote", dataQuote);

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

    const { data: contents } = await supabase
      .from("contents")
      .select("caption")
      .eq("type", "template_quote")
      .single();

    const { data: terms } = await supabase
      .from("terms")
      .select()
      .eq("suppliers", dataQuote.details.supplier.id)
      .single();

    // const { data: user } = await supabase
    //   .from("users")
    //   .select()
    //   .eq("id", quote.users)
    //   .single();

    // let emailBody = contents.caption.replace(
    //   "{agreement_terms}",
    //   `<div>• <a href="https://australia4wdrentals.com/terms/${terms.id}">View Terms</a></div>`
    // );
    const formatCurrency = (num) => {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    let fee_deposit = terms.percentage
      ? (dataQuote.gross * terms.deposit) / 100
      : terms.deposit;
    let fee_payment_1 =
      (terms.percentage2
        ? (dataQuote.gross * terms.deposit2) / 100
        : terms.deposit2) || 0;
    let fee_payment_2 =
      (terms.percentage3
        ? (dataQuote.gross * terms.deposit3) / 100
        : terms.deposit3) || 0;
    let fee_balance =
      dataQuote.gross - fee_deposit - fee_payment_1 - fee_payment_2;

    let paymentTerms = "<div>• ";
    paymentTerms += `$${formatCurrency(fee_deposit)}`;
    paymentTerms += ` on ${dayjs(dataQuote.details.daily.date_book).format(
      "DD MMM YYYY (ddd)"
    )}</div>`;
    if (terms.payment2) {
      paymentTerms += "<div>• ";
      paymentTerms += `$${formatCurrency(fee_payment_1)}`;
      let depositDay = dayjs(dataQuote.details.daily.date_book);
      let payDay = dayjs(dataQuote.details.daily.date_start).subtract(
        terms.balance2,
        "day"
      );
      paymentTerms += ` on ${
        payDay.isBefore(depositDay)
          ? depositDay.format("DD MMM YYYY (ddd)")
          : payDay.format("DD MMM YYYY (ddd)")
      }</div>`;
    }
    if (terms.payment3) {
      paymentTerms += "<div>• ";
      paymentTerms += `$${formatCurrency(fee_payment_2)}`;
      let depositDay = dayjs(dataQuote.details.daily.date_book);
      let payDay = dayjs(dataQuote.details.daily.date_start).subtract(
        terms.balance3,
        "day"
      );
      paymentTerms += ` on ${
        payDay.isBefore(depositDay)
          ? depositDay.format("DD MMM YYYY (ddd)")
          : payDay.format("DD MMM YYYY (ddd)")
      }</div>`;
    }
    paymentTerms += "<div>• ";
    paymentTerms += `$${formatCurrency(fee_balance)}`;
    let depositDay = dayjs(dataQuote.details.daily.date_book);
    let payDay = dayjs(dataQuote.details.daily.date_start).subtract(
      terms.balance,
      "day"
    );
    paymentTerms += ` on ${
      payDay.isBefore(depositDay)
        ? depositDay.format("DD MMM YYYY (ddd)")
        : payDay.format("DD MMM YYYY (ddd)")
    }`;

    if (terms.pay_counter) {
      paymentTerms += " (Pay at pick-up counter)";
    }
    paymentTerms += "</div>";

    let emailBody = await html.create(dataQuote.id, "template_quote");

    // emailBody = emailBody.replace("{payment_schedule}", paymentTerms);
    // emailBody = emailBody.replace("{supplier_name}", dataQuote.details.supplier.name);

    // emailBody += `<div style="margin-top:20px"><a href="https://rixauffklvvhkfkwrpme.supabase.co/storage/v1/object/public/quotes/Q${dataQuote.id + 388000}.pdf">Download Quotation</a></div>`

    const { data: emailData } = await supabase
      .from("constants")
      .select("name")
      .eq("type", "email_quote")
      .single();

    let getBond = Object.keys(dataQuote.details.bonds).length
      ? dataQuote.details.bonds
      : dataQuote.details.bond;

    sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
    await sgMail
      .send({
        to: user.email,
        bcc: emailData.name.split(","),
        from: "info@australia4wdrentals.com",
        subject: `Quote: ${dataQuote.details.vehicle.name}: ${
          dataQuote.details.pickup.name
        }, ${dayjs(dataQuote.details.date_start).format("DD MMM YYYY")} - ${
          dataQuote.details.dropoff.name
        }, ${dayjs(dataQuote.details.date_end).format("DD MMM YYYY")} (${
          getBond.display_name
        })
          ${user.first_name} ${user.last_name}`,
        html: emailBody,
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    return {
      quote: dataQuote,
    };
  },
};
