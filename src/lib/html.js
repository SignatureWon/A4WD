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
      let date_start = dayjs(quote.details.daily.date_start);
      let gap = date_start.diff(today, "day");

      // console.log("gap", gap, terms.balance, gap > terms.balance);

      if (gap < terms.balance) {
        termsItem = [
          {
            name: "Full payment",
            amount: quote.gross,
          },
        ];
      } else {
        termsItem = [
          {
            name: `Booking Deposit (${
              terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
            })`,
            description: terms.description || "",
            amount: terms.percentage
              ? (quote.gross * terms.deposit) / 100
              : terms.deposit,
          },
        ];
        if (terms.payment2) {
          if (terms.balance2 < gap) {
            termsItem.push({
              name: `1st Payment (${
                terms.percentage2 ? `${terms.deposit2}%` : `$${terms.deposit2}`
              } - ${terms.balance2} days before
                travel)`,
              description: terms.description2 || "",
              amount: terms.percentage2
                ? (quote.gross * terms.deposit2) / 100
                : terms.deposit2,
            });
          }
        }
        if (terms.payment3) {
          if (terms.balance3 < gap) {
            termsItem.push({
              name: `1st Payment (${
                terms.percentage3 ? `${terms.deposit3}%` : `$${terms.deposit3}`
              } - ${terms.balance3} days before
                travel)`,
              description: terms.description3 || "",
              amount: terms.percentage3
                ? (quote.gross * terms.deposit3) / 100
                : terms.deposit3,
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
            name:
              "Balance (" +
              (terms.pay_counter
                ? "Pay at pick-up counter"
                : `${terms.balance} days before travel`) +
              ")",
            amount: bal,
          });
        }
      }
      let paymentTerms = "";
      termsItem.forEach((t) => {
        paymentTerms += `<div style="margin-top:10px">• ${
          t.name
        } - ${formatCurrency(t.amount)}</div>`;
      });
      payment = payment.replace("{payment_schedule}", paymentTerms);
      payment = payment.replace("{supplier_name}", quote.details.supplier.name);

      //   console.log("terms", terms);

      // if (terms.balance < gap) {
      // }
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

    // let fee_deposit = terms.percentage
    //   ? (quote.gross * terms.deposit) / 100
    //   : terms.deposit;
    // let fee_payment_1 =
    //   (terms.percentage2
    //     ? (quote.gross * terms.deposit2) / 100
    //     : terms.deposit2) || 0;
    // let fee_payment_2 =
    //   (terms.percentage3
    //     ? (quote.gross * terms.deposit3) / 100
    //     : terms.deposit3) || 0;
    // let fee_balance = quote.gross - fee_deposit - fee_payment_1 - fee_payment_2;

    // let paymentTerms = "• ";
    // paymentTerms += `$${formatCurrency(fee_deposit)}`;
    // paymentTerms += ` on ${dayjs(quote.details.daily.date_book).format(
    //   "DD MMM YYYY (ddd)"
    // )}\n`;
    // if (terms.payment2) {
    //   paymentTerms += "• ";
    //   paymentTerms += `$${formatCurrency(fee_payment_1)}`;
    //   let depositDay = dayjs(quote.details.daily.date_book);
    //   let payDay = dayjs(quote.details.daily.date_start).subtract(
    //     terms.balance2,
    //     "day"
    //   );
    //   paymentTerms += ` on ${
    //     payDay.isBefore(depositDay)
    //       ? depositDay.format("DD MMM YYYY (ddd)")
    //       : payDay.format("DD MMM YYYY (ddd)")
    //   }\n`;
    // }
    // if (terms.payment3) {
    //   paymentTerms += "• ";
    //   paymentTerms += `$${formatCurrency(fee_payment_2)}`;
    //   let depositDay = dayjs(quote.details.daily.date_book);
    //   let payDay = dayjs(quote.details.daily.date_start).subtract(
    //     terms.balance3,
    //     "day"
    //   );
    //   paymentTerms += ` on ${
    //     payDay.isBefore(depositDay)
    //       ? depositDay.format("DD MMM YYYY (ddd)")
    //       : payDay.format("DD MMM YYYY (ddd)")
    //   }\n`;
    // }
    // paymentTerms += "• ";
    // paymentTerms += `$${formatCurrency(fee_balance)}`;
    // let depositDay = dayjs(quote.details.daily.date_book);
    // let payDay = dayjs(quote.details.daily.date_start).subtract(
    //   terms.balance,
    //   "day"
    // );
    // paymentTerms += ` on ${
    //   payDay.isBefore(depositDay)
    //     ? depositDay.format("DD MMM YYYY (ddd)")
    //     : payDay.format("DD MMM YYYY (ddd)")
    // }`;

    // if (terms.pay_counter) {
    //   paymentTerms += " (Pay at pick-up counter)";
    // }

    // let billingDetail = [];
    // billingDetail.push([
    //   {
    //     content: `Daily Rental (${quote.details.duration} days)
    //       ${
    //         quote.details.min_days > quote.details.duration
    //           ? `\nPrice is based on minimum ${quote.details.min_days} days, less days will average out.`
    //           : ""
    //       }`,
    //   },
    //   {
    //     content: `${formatCurrency(quote.gross)}`,
    //     styles: { halign: "right" },
    //   },
    // ]);
    // let getBond = quote.details.bonds ? quote.details.bonds : quote.details.bond;

    // billingDetail.push([
    //   {
    //     content: `${bond.display_name}`,
    //   },
    //   {
    //     content: `${formatCurrency(bond.gross)}`,
    //     styles: { halign: "right" },
    //   },
    // ]);

    // if (quote.details.one_way > 0) {
    //   billingDetail.push([
    //     {
    //       content: "One-way Fee",
    //     },
    //     {
    //       content: `${formatCurrency(quote.details.one_way)}`,
    //       styles: { halign: "right" },
    //     },
    //   ]);
    // }
    // if (quote.details.fees.total > 0) {
    //   quote.details.fees.items.forEach((item) => {
    //     billingDetail.push([
    //       {
    //         content: item.name,
    //       },
    //       {
    //         content: `${formatCurrency(item.fee)}`,
    //         styles: { halign: "right" },
    //       },
    //     ]);
    //   });
    // }
    // if (quote.details.specials.total > 0) {
    //   quote.details.specials.items.forEach((item) => {
    //     let title = "• ";
    //     if (item.type === "Early bird") {
    //       title += `Early bird (${item.days} days) `;
    //     } else if (item.type === "Long term") {
    //       title += `Long term (${item.days} days) `;
    //     } else if (item.type === "Every X day") {
    //       title += `Every ${item.days} days `;
    //     }

    //     if (item.factor === "Percentage") {
    //       title += `Discount ${item.value}%`;
    //     } else if (item.factor === "Price") {
    //       title += `Discount $${item.value}`;
    //     } else if (item.factor === "Day") {
    //       title += `Discount ${item.value} ${item.value > 1 ? "days" : "day"}`;
    //     } else if (item.factor === "No One Way Fee") {
    //       title += "No One Way Fee";
    //     }
    //     billingDetail.push(
    //       [
    //         {
    //           content: `Deduct: ${item.name}`,
    //         },
    //         {
    //           content: "",
    //           styles: { halign: "right" },
    //         },
    //       ],
    //       [
    //         {
    //           content: `${title})\n${item.description}`,
    //         },
    //         {
    //           content: `- $${formatCurrency(item.discount_amount)}`,
    //           styles: { halign: "right" },
    //         },
    //       ]
    //     );

    //     if (item.discount2) {
    //       let title2 = "• ";
    //       if (item.type2 === "Early bird") {
    //         title2 += `Early bird (${item.days2} days) `;
    //       } else if (item.type2 === "Long term") {
    //         title2 += `Long term (${item.days2} days) `;
    //       } else if (item.type2 === "Every X day") {
    //         title2 += `Every ${item.days2} days `;
    //       }

    //       if (item.factor2 === "Percentage") {
    //         title2 += `Discount ${item.value2}%`;
    //       } else if (item.factor2 === "Price") {
    //         title2 += `Discount $${item.value2}`;
    //       } else if (item.factor2 === "Day") {
    //         title2 += `Discount ${item.value2} ${
    //           item.value2 > 1 ? "days" : "day"
    //         }`;
    //       } else if (item.factor2 === "No One Way Fee") {
    //         title2 += "No One Way Fee";
    //       }
    //       billingDetail.push([
    //         {
    //           content: `${title2})`,
    //         },
    //         {
    //           content: `- $${formatCurrency(item.discount_amount2)}`,
    //           styles: { halign: "right" },
    //         },
    //       ]);
    //     }
    //   });
    // }

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
                    </div>
                    <div>
                        ${pickup.Address.replace(/(?:\r\n|\r|\n)/g, "<br>")}<br>
                        Contact (Australia): ${pickup["Contact (Australia)"]}
                    </div>
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
                    </div>
                    <div>
                        ${dropoff.Address.replace(
                          /(?:\r\n|\r|\n)/g,
                          "<br>"
                        )}<br>
                        Contact (Australia): ${dropoff["Contact (Australia)"]}
                    </div>
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
                    ${getBond.display_name}
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
                : quote.gross
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
                ? quote.gross - fee_deposit - fee_payment_1 - fee_payment_2
                : 0
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
    email += `<div style="margin-top: 10px">* Rates quoted are in Australian Dollar (AUD)</div>`
    email += `<div style="margin-top: 10px; text-align: center">
        <a href="https://australia4wdrentals.com/form/vehicle/booking" style="display: inline-block; padding-left: 30px; padding-right: 30px; padding-top: 10px; padding-bottom: 10px; font-weight: bold; font-size: 30px; background-color: #1d4ed8; color: #ffffff">Book Now</a>
    </div>`

    email += `</div>`;

    return email;

    //   const doc = new jsPDF({ orientation: "p", lineHeight: 1.5 });

    // header
    //   doc.autoTable({
    //     theme: "plain",
    //     body: [
    //       [
    //         {
    //           content: "",
    //           styles: {
    //             minCellHeight: 30,
    //           },
    //         },
    //         {
    //           content: contents.name,
    //           styles: {
    //             halign: "right",
    //             fontSize: 18,
    //             fontStyle: "bold",
    //           },
    //         },
    //       ],
    //     ],
    //     didDrawCell: function (data) {
    //       if (data.column.dataKey === 0 && data.row.section === "body") {
    //         doc.autoTable({
    //           theme: "plain",
    //           head: [
    //             [
    //               {
    //                 content: letterhead.name,
    //                 styles: {
    //                   fontSize: 13,
    //                   fontStyle: "bold",
    //                   cellPadding: { bottom: 0, left: 1 },
    //                 },
    //               },
    //             ],
    //           ],
    //           body: [
    //             [
    //               {
    //                 content: letterhead.description,
    //                 styles: {
    //                   fontSize: 9,
    //                   textColor: "#999999",
    //                 },
    //               },
    //             ],
    //             [
    //               {
    //                 content: letterhead.content,
    //                 styles: {
    //                   fontSize: 10,
    //                 },
    //               },
    //             ],
    //           ],
    //         });
    //       }
    //     },
    //     styles: {
    //       cellPadding: 0,
    //     },
    //   });

    //   // notice
    //   doc.autoTable({
    //     theme: "plain",
    //     body: [
    //       [
    //         {
    //           content: contents.description,
    //         },
    //       ],
    //     ],
    //     bodyStyles: {
    //       fillColor: "#eeeeee",
    //     },
    //   });

    //   // reference
    //   doc.autoTable({
    //     theme: "plain",
    //     head: [
    //       [
    //         {
    //           content: "Reference",
    //           styles: {
    //             cellWidth: 60,
    //             cellPadding: { bottom: 0, left: 1 },
    //           },
    //         },
    //         {
    //           content: "Confirmation Code",
    //           styles: {
    //             cellWidth: 60,
    //             cellPadding: { bottom: 0, left: 1 },
    //           },
    //         },
    //         {
    //           content: "Date of Issue",
    //           styles: {
    //             cellWidth: 60,
    //             cellPadding: { bottom: 0, left: 1 },
    //           },
    //         },
    //       ],
    //     ],
    //     body: [
    //       [
    //         {
    //           content: quote.id + 388000,
    //         },
    //         {
    //           content: quote.status,
    //         },
    //         {
    //           content: dayjs(quote.created).format("DD MMM YYYY"),
    //         },
    //       ],
    //     ],
    //     headStyles: {
    //       fontSize: 9,
    //       textColor: "#999999",
    //       cellPadding: 0,
    //     },
    //     bodyStyles: {
    //       fontSize: 10,
    //     },
    //   });

    //   // Customer
    //   doc.autoTable({
    //     theme: "plain",
    //     head: [
    //       [
    //         {
    //           content: "Customer",
    //           styles: {
    //             cellWidth: 60,
    //             cellPadding: { bottom: 0, left: 1 },
    //           },
    //         },
    //         {
    //           content: "Driver",
    //           styles: {
    //             cellWidth: 60,
    //             cellPadding: { bottom: 0, left: 1 },
    //           },
    //         },
    //         {
    //           content: "Passenger",
    //           styles: {
    //             cellWidth: 60,
    //             cellPadding: { bottom: 0, left: 1 },
    //           },
    //         },
    //       ],
    //     ],
    //     body: [
    //       [
    //         {
    //           content: `${user.first_name} ${user.last_name}\n${user.email}\n${user.phone}`,
    //         },
    //         {
    //           content: `Age: ${quote.details.driver.age}\nLicense: ${quote.details.driver.license}`,
    //         },
    //         {
    //           content: `Adult: ${quote.details.passenger.adult}\nChildren: ${quote.details.passenger.children}`,
    //         },
    //       ],
    //     ],
    //     headStyles: {
    //       fontSize: 9,
    //       textColor: "#999999",
    //       cellPadding: 0,
    //     },
    //     bodyStyles: {
    //       fontSize: 10,
    //     },
    //   });

    //   // Itinerary
    //   doc.autoTable({
    //     theme: "plain",
    //     body: [
    //       [
    //         {
    //           content: "",
    //           styles: {
    //             minCellHeight: 50,
    //           },
    //         },
    //         {
    //           content: "",
    //           styles: {
    //             minCellHeight: 50,
    //           },
    //         },
    //       ],
    //     ],
    //     didDrawCell: function (data) {
    //       if (data.column.index === 0 && data.row.section === "body") {
    //         doc.autoTable({
    //           theme: "plain",
    //           head: [
    //             [
    //               {
    //                 content: "Pick-up",
    //                 styles: {
    //                   cellWidth: 90,
    //                 },
    //               },
    //               {
    //                 content: "Drop-off",
    //                 styles: {
    //                   cellWidth: 90,
    //                 },
    //               },
    //             ],
    //           ],
    //           body: [
    //             [
    //               {
    //                 content: `${quote.details.pickup.name}\n${dayjs(
    //                   quote.details.date_start
    //                 ).format("DD MMM YYYY (ddd)")}`,
    //                 styles: {
    //                   fontStyle: "bold",
    //                 },
    //               },
    //               {
    //                 content: `${quote.details.dropoff.name}\n${dayjs(
    //                   quote.details.date_end
    //                 ).format("DD MMM YYYY (ddd)")}`,
    //                 styles: {
    //                   fontStyle: "bold",
    //                 },
    //               },
    //             ],
    //             [
    //               {
    //                 content: `${pickup.Address}}`,
    //               },
    //               {
    //                 content: `${dropoff.Address}}`,
    //               },
    //             ],
    //             [
    //               {
    //                 content: `Contact (Australia): ${pickup["Contact (Australia)"]}\nContact (International): ${pickup["Contact (International)"]}`,
    //               },
    //               {
    //                 content: `Contact (Australia): ${dropoff["Contact (Australia)"]}\nContact (International): ${dropoff["Contact (International)"]}`,
    //               },
    //             ],
    //           ],
    //           headStyles: {
    //             fontSize: 9,
    //             textColor: "#999999",
    //           },
    //         });
    //       }
    //     },
    //     bodyStyles: {
    //       fontSize: 10,
    //     },
    //     styles: {
    //       lineColor: "#000000",
    //       lineWidth: 0.1,
    //     },
    //   });

    //   // Payment
    //   doc.autoTable({
    //     theme: "plain",
    //     head: [
    //       [
    //         {
    //           content: "Payment Schedule",
    //         },
    //       ],
    //     ],
    //     body: [
    //       [
    //         {
    //           content: payment,
    //         },
    //       ],
    //     ],
    //     headStyles: {
    //       fontStyle: "bold",
    //       fontSize: 12,
    //     },
    //     bodyStyles: {
    //       fontSize: 10,
    //     },
    //   });

    //   // Details
    //   doc.autoTable({
    //     theme: "plain",
    //     pageBreak: "always",
    //     head: [
    //       [
    //         {
    //           content: "Payment Summary",
    //           styles: {
    //             fontSize: 18,
    //             fontStyle: "bold",
    //           },
    //         },
    //       ],
    //     ],
    //   });
    //   doc.autoTable({
    //     theme: "striped",
    //     head: [
    //       [
    //         {
    //           content: "Billing Details",
    //           styles: {
    //             cellWidth: 140,
    //           },
    //         },
    //         {
    //           content: "AUD",
    //           styles: {
    //             cellWidth: 40,
    //             halign: "right",
    //           },
    //         },
    //       ],
    //     ],
    //     body: billingDetail,
    //     headStyles: {
    //       fontSize: 12,
    //       fontStyle: "bold",
    //       textColor: "#000000",
    //       fillColor: "#ffffff",
    //     },
    //   });

    //   doc.autoTable({
    //     theme: "plain",
    //     head: [
    //       [
    //         {
    //           content: "Total payable to agent",
    //           styles: {
    //             cellWidth: 140,
    //           },
    //         },
    //         {
    //           content: formatCurrency(
    //             terms.pay_counter
    //               ? fee_deposit + fee_payment_1 + fee_payment_2
    //               : quote.gross
    //           ),
    //           styles: {
    //             cellWidth: 40,
    //             halign: "right",
    //           },
    //         },
    //       ],
    //       [
    //         {
    //           content: "Total payable to supplier at pick-up counter",
    //         },
    //         {
    //           content: formatCurrency(
    //             terms.pay_counter
    //               ? quote.gross - fee_deposit - fee_payment_1 - fee_payment_2
    //               : 0
    //           ),
    //           styles: {
    //             halign: "right",
    //           },
    //         },
    //       ],
    //       [
    //         {
    //           content: "Total full amount",
    //         },
    //         {
    //           content: formatCurrency(quote.gross),
    //           styles: {
    //             halign: "right",
    //           },
    //         },
    //       ],
    //     ],
    //     body: [
    //       [
    //         {
    //           content: "* Rates quoted are in Australian Dollar (AUD)",
    //         },
    //         {
    //           content: "",
    //         },
    //       ],
    //     ],
    //     headStyles: {
    //       fontSize: 12,
    //       fontStyle: "bold",
    //       textColor: "#000000",
    //       fillColor: "#ffffff",
    //     },
    //   });

    //   // return doc.save("sample.pdf");
    //   return doc.output("blob");
  },
};
