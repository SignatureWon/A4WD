import dayjs from "dayjs";
import { supabase } from "$lib/supabaseClient";
import { Table } from "carbon-components-svelte";

export const html = {
  create: async (quote_id, type) => {
    const { data: quote } = await supabase
      .from("quotes")
      .select()
      .eq("id", quote_id)
      .single();

    console.log("quote", quote);

    const { data: user } = await supabase
      .from("users")
      .select()
      .eq("id", quote.users)
      .single();

    const { data: letterhead } = await supabase
      .from("contents")
      .select()
      .eq("type", "template_letterhead")
      .single();

    // Doc Type:
    // template_quote
    // template_ticket_provisional
    // template_ticket

    const { data: contents } = await supabase
      .from("contents")
      .select()
      .eq("type", type)
      .single();

    const { data: supplier } = await supabase
      .from("suppliers")
      .select()
      .eq("id", quote.details.supplier.id)
      .single();

    // console.log(supplier);

    const { data: terms } = await supabase
      .from("terms")
      .select()
      .eq("suppliers", quote.details.supplier.id)
      .single();
    //   console.log("terms", terms);

    const pickup = supplier.depots.filter((d) => {
      return d.Depots.id === quote.details.pickup.id;
    })[0];

    const dropoff = supplier.depots.filter((d) => {
      return d.Depots.id === quote.details.dropoff.id;
    })[0];

    let payment = contents.content.replace(/(?:\r\n|\r|\n)/g, "<br>");
    payment = payment.replace(
      "{agreement_terms}",
      `<div style="margin-top:10px">• <a href="https://australia4wdrentals.com/terms/${terms.id}">View Terms</a></div>`
    );

    const formatCurrency = (num) => {
      if (!num) {
        num = 0;
      }
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    let termsItem = [];

    if (terms) {
      let today = dayjs();
      let date_start = dayjs(quote.details.date_start);
      let gap = date_start.diff(today, "day");

      // console.log("today", today);
      // console.log("date_start", date_start);
      // console.log("gap", gap);

      if (gap < terms.balance) {
        termsItem = [
          {
            name: "Full payment",
            amount: quote.gross,
            due_date: today.format("ddd, DD MMM YYYY"),
          },
        ];
      } else {
        termsItem = [
          {
            name: `Booking Deposit`,
            description: terms.description || "",
            amount: terms.percentage
              ? (quote.gross * terms.deposit) / 100
              : terms.deposit,
            due_date: today.format("ddd, DD MMM YYYY"),
          },
        ];
        if (terms.payment2) {
          if (terms.balance2 < gap) {
            termsItem.push({
              name: `1st Payment:`,
              description: terms.description2 || "",
              amount: terms.percentage2
                ? (quote.gross * terms.deposit2) / 100
                : terms.deposit2,
              due_date: date_start
                .subtract(terms.balance2, "day")
                .format("ddd, DD MMM YYYY"),
            });
          }
        }
        if (terms.payment3) {
          if (terms.balance3 < gap) {
            termsItem.push({
              name: `2nd Payment`,
              description: terms.description3 || "",
              amount: terms.percentage3
                ? (quote.gross * terms.deposit3) / 100
                : terms.deposit3,
              due_date: date_start
                .subtract(terms.balance3, "day")
                .format("ddd, DD MMM YYYY"),
            });
          }
        }
        // balance
        if (terms.balance < gap) {
          let bal = quote.gross;
          termsItem.forEach((t) => {
            bal -= t.amount;
          });

          termsItem.push({
            name: "Balance",
            amount: bal,
            due_date: date_start
              .subtract(terms.balance, "day")
              .format("ddd, DD MMM YYYY"),
          });
        }
      }
      let paymentTerms = `<table cellpadding="5" style="margin-top: 10px">`;
      termsItem.forEach((t) => {
        paymentTerms += `<tr><td>• ${t.name}: </td><td>$${formatCurrency(t.amount)} on ${t.due_date}</td></tr>`;
      });
      paymentTerms += "</table>"
      payment = payment.replace("{payment_schedule}", paymentTerms);
      payment = payment.replace("{supplier_name}", quote.details.supplier.name);
    }

    const showDiscountType = (type, days) => {
      if (type === "Early bird") {
        return `Early bird (${days} days)`;
      } else if (type === "Long term") {
        return `Long term (${days} days)`;
      } else if (type === "Every X day") {
        return `Every (${days} day)`;
      }
    };
    const showDiscountFactor = (factor, value) => {
      if (factor === "Percentage") {
        return `Discount ${value}%`;
      } else if (factor === "Price") {
        return `Discount $${value}`;
      } else if (factor === "Day") {
        return `Discount ${value} ${value > 1 ? "days" : "day"}`;
      } else if (factor === "No One Way Fee") {
        return `No One Way Fee`;
      }
    };

    for (const key in quote.details.addons) {
      let addon = quote.details.addons[key];
      console.log("addon", addon);
      billingDetail.push([
        {
          content: `Add-on: ${addon.name}`,
        },
        {
          content: `${formatCurrency(
            addon.daily
              ? addon.gross_rate * quote.details.duration
              : addon.gross_rate
          )}`,
          styles: { halign: "right" },
        },
      ]);
    }

    let email = `<div style="width: 800px; background-color: #ffffff; margin: auto; padding: 20px">`;

    // header
    email += `
        <table width="100%">
            <tr>
                <td>
                    <div style="font-size: 18px; font-weight: bold">
                        ${letterhead.name}
                    </div>
                    <div style="font-size: 12px; color: #999999">
                        ${letterhead.description}
                    </div>
                    <div style="font-size: 14px;">
                        ${letterhead.content.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                    </div>
                </td>
                <td valign="top">
                    <div style="text-align: right; font-size: 24px; font-weight: bold">
                        ${contents.name}
                    </div>
                </td>
            </tr>
        </table>`;
    // notice
    email += `
        <div style="padding: 10px; background-color: #eeeeee; margin-top: 20px;">
            ${contents.description}
        </div>`;
    // Reference
    email += `
        <table width="100%" style="margin-top: 20px">
            <tr>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Reference
                    </div>
                    <div>
                        ${quote.id + 388000}
                    </div>
                </td>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Confirmation Code
                    </div>
                    <div>
                        ${quote.status}
                    </div>
                </td>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Date of Issue
                    </div>
                    <div>
                        ${dayjs(quote.created).format("DD MMM YYYY (ddd)")}
                    </div>
                </td>
            </tr>
        </table>`;
    // Customer
    email += `
        <table width="100%" style="margin-top: 15px">
            <tr>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Customer
                    </div>
                    <div>
                        ${user.first_name} ${user.last_name}<br>
                        ${user.email}<br>
                        ${user.phone}
                    </div>
                </td>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Driver
                    </div>
                    <div>
                        Age: ${quote.details.driver.age}<br>
                        License: ${quote.details.driver.license}
                    </div>
                </td>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Passenger
                    </div>
                    <div>
                        Adult: ${quote.details.passenger.adult}<br>
                        Children: ${quote.details.passenger.children}
                    </div>
                </td>
            </tr>
        </table>`;
    // Vehicle
    email += `
        <table width="100%" style="margin-top: 15px">
            <tr>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Vehicle
                    </div>
                    <div>
                        ${quote.details.vehicle.name}
                    </div>
                </td>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Supplier
                    </div>
                    <div>
                        ${quote.details.supplier.name}
                    </div>
                </td>
                <td width="33.33333%" valign="top">
                    <div style="font-size: 13px; color: #999999">
                        Duration
                    </div>
                    <div>
                        ${quote.details.duration} days
                    </div>
                </td>
            </tr>
        </table>`;
    // Travel
    email += `
        <table cellspacing="0" cellpadding="10" width="100%" style="margin-top: 20px; border: 1px solid #999999">
            <tr>
                <td width="50%" valign="top" style="border: 1px solid #999999">
                    <div style="font-size: 13px; color: #999999; font-weight: bold; margin-bottom: 5px">
                        Pick-up
                    </div>
                    <div style="font-weight: bold">
                        ${quote.details.pickup.name}<br>
                        ${dayjs(quote.details.date_start).format(
                          "DD MMM YYYY (ddd)"
                        )}
                    </div>`
              if (type !== "template_quote") {
                  email += `<div>
                        ${pickup.Address.replace(/(?:\r\n|\r|\n)/g, "<br>")}<br>
                        Contact (Australia): ${pickup["Contact (Australia)"]}
                    </div>`}
              email += `
                </td>
                <td width="50%" valign="top" style="border: 1px solid #999999">
                    <div style="font-size: 13px; color: #999999; font-weight: bold; margin-bottom: 5px">
                        Drop-off
                    </div>
                    <div style="font-weight: bold">
                        ${quote.details.dropoff.name}<br>
                        ${dayjs(quote.details.date_end).format(
                          "DD MMM YYYY (ddd)"
                        )}
                    </div>`
                    if (type !== "template_quote") {
                        email += `<div>
                          ${dropoff.Address.replace(
                          /(?:\r\n|\r|\n)/g,
                          "<br>"
                        )}<br>
                        Contact (Australia): ${dropoff["Contact (Australia)"]}
                    </div>`}
            email += `
              </td>
            </tr>
        </table>`;
    // Payment schedule
    email += `
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px">Payment Schedule</div>
        <div>${payment}</div>
    `;
    // Payment details
    let getBond = Object.keys(quote.details.bonds).length
      ? quote.details.bonds
      : quote.details.bond;

    email += `
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px">Payment Details</div>
        <table cellspacing="0" cellpadding="10" width="100%" style="margin-top: 20px; border: 1px solid #999999">
            <tr>
                <td width="70%" valign="top" style="font-size: 13px; color: #999999; font-weight: bold">
                    Description
                </td>
                <td width="30%" valign="top" style="font-size: 13px; color: #999999; font-weight: bold; text-align: right">
                    AUD $
                </td>
            </tr>
            <tr>
                <td valign="top" style="border-top: 1px solid #999999">
                    Daily Rental (${quote.details.duration} days)
                    ${
                      quote.details.min_days > quote.details.duration
                        ? `<div style="font-size: 13px>Price is based on minimum ${quote.details.min_days} days, less days will average out.</div>`
                        : ""
                    }
                </td>
                <td valign="top" style="text-align: right; border-top: 1px solid #999999">
                    ${formatCurrency(quote.gross)}
                </td>
            </tr>
            <tr>
                <td valign="top" style="border-top: 1px solid #999999">
                    ${getBond.display_name} (${getBond.bond.toLocaleString("en-US")} Bond)
                </td>
                <td valign="top" style="text-align: right; border-top: 1px solid #999999">
                    ${formatCurrency(getBond.gross)}
                </td>
            </tr>`;

    if (quote.details.one_way > 0) {
      email += `
        <tr>
            <td valign="top" style="border-top: 1px solid #999999">
                One-way Fee
            </td>
            <td valign="top" style="text-align: right; border-top: 1px solid #999999">
                ${formatCurrency(quote.details.one_way)}
            </td>
        </tr>`;
    }

    if (quote.details.fees.total > 0) {
      quote.details.fees.items.forEach((item) => {
        email += `
            <tr>
                <td valign="top" style="border-top: 1px solid #999999">
                    ${item.name}
                </td>
                <td valign="top" style="text-align: right; border-top: 1px solid #999999">
                    ${formatCurrency(item.fee)}
                </td>
            </tr>`;
      });
    }

    if (quote.details.specials.total > 0) {
      quote.details.specials.items.forEach((item) => {
        email += `
            <tr>
                <td valign="top" style="border-top: 1px solid #999999">
                    ${showDiscountType(item.type, item.days)}
                    ${showDiscountFactor(item.factor, item.value)}
                    ${
                      item.discount2
                        ? `<br>
                    ${showDiscountType(item.type2, item.days2)}
                    ${showDiscountFactor(item.factor2, item.value2)}`
                        : ""
                    }
                </td>
                <td valign="top" style="text-align: right; border-top: 1px solid #999999">
                    - $${formatCurrency(item.discount_amount)}
                    ${
                      item.discount2
                        ? `<br>- $${formatCurrency(item.discount_amount2)}`
                        : ""
                    }
                </td>
            </tr>`;
      });
    }
    for (const key in quote.details.addons) {
      let addon = quote.details.addons[key];
      email += `
        <tr>
            <td valign="top" style="border-top: 1px solid #999999">
                Add-on: ${addon.name}
            </td>
            <td valign="top" style="text-align: right; border-top: 1px solid #999999">
            ${formatCurrency(
              addon.daily
                ? addon.gross_rate * quote.details.duration
                : addon.gross_rate
            )}
            </td>
        </tr>`;
    }
    email += `
        <tr>
            <td valign="top" style="border-top: 1px solid #999999; font-weight: bold">
                Total payable to agent
            </td>
            <td valign="top" style="text-align: right; border-top: 1px solid #999999; font-weight: bold">
            ${formatCurrency(
              terms.pay_counter
                ? fee_deposit + fee_payment_1 + fee_payment_2
                : quote.details.daily.gross
            )}
            </td>
        </tr>`;
    email += `
        <tr>
            <td valign="top" style="border-top: 1px solid #999999; font-weight: bold">
                Total payable to supplier at pick-up counter
            </td>
            <td valign="top" style="text-align: right; border-top: 1px solid #999999; font-weight: bold">
            ${formatCurrency(
              terms.pay_counter
                ? quote.details.daily.gross - fee_deposit - fee_payment_1 - fee_payment_2 + getBond.gross + quote.details.fees.total
                : getBond.gross + quote.details.fees.total
            )}
            </td>
        </tr>`;
    email += `
        <tr>
            <td valign="top" style="border-top: 1px solid #999999; font-weight: bold">
                Total full amount
            </td>
            <td valign="top" style="text-align: right; border-top: 1px solid #999999; font-weight: bold">
            ${formatCurrency(quote.gross)}
            </td>
        </tr>`;

    email += `</table>`;
    email += `<div style="margin-top: 10px">
      * Rates quoted are in Australian Dollar (AUD)<br>
      * Booking with a Visa or Mastercard required 2% card merchant fee
    </div>`;
    email += `<div style="margin-top: 30px; margin-bottom: 30px; text-align: center">
        <a href="https://australia4wdrentals.com/form/vehicle/booking" style="display: block; width: 200px; padding-top: 10px; padding-bottom: 10px; font-weight: bold; font-size: 30px; background-color: #1d4ed8; text-decoration: none; color: #ffffff; border-radius: 5px">
          <strong style="text-decoration: none; color: #ffffff;">Book Now</strong>
        </a>
    </div>`;

    email += `</div>`;

    return email;
  },
};
