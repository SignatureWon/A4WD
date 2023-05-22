import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { supabase } from "$lib/supabaseClient";

export const pdf = {
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
    console.log("terms", terms);

    const pickup = supplier.depots.filter((d) => {
      return d.Depots.id === quote.details.pickup.id;
    })[0];

    const dropoff = supplier.depots.filter((d) => {
      return d.Depots.id === quote.details.dropoff.id;
    })[0];

    let payment = contents.content.replace(
      "{agreement_terms}",
      `• https://australia4wdrentals.com/terms/${terms.id}`
    );

    const formatCurrency = (num) => {
      if (!num) {
        num = 0
      }
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    let fee_deposit = terms.percentage
      ? (quote.gross * terms.deposit) / 100
      : terms.deposit;
    let fee_payment_1 =
      (terms.percentage2
        ? (quote.gross * terms.deposit2) / 100
        : terms.deposit2) || 0;
    let fee_payment_2 =
      (terms.percentage3
        ? (quote.gross * terms.deposit3) / 100
        : terms.deposit3) || 0;
    let fee_balance = quote.gross - fee_deposit - fee_payment_1 - fee_payment_2;

    let paymentTerms = "• ";
    paymentTerms += `$${formatCurrency(fee_deposit)}`;
    paymentTerms += ` on ${dayjs(quote.details.daily.date_book).format(
      "DD MMM YYYY (ddd)"
    )}\n`;
    if (terms.payment2) {
      paymentTerms += "• ";
      paymentTerms += `$${formatCurrency(fee_payment_1)}`;
      let depositDay = dayjs(quote.details.daily.date_book);
      let payDay = dayjs(quote.details.daily.date_start).subtract(
        terms.balance2,
        "day"
      );
      paymentTerms += ` on ${
        payDay.isBefore(depositDay)
          ? depositDay.format("DD MMM YYYY (ddd)")
          : payDay.format("DD MMM YYYY (ddd)")
      }\n`;
    }
    if (terms.payment3) {
      paymentTerms += "• ";
      paymentTerms += `$${formatCurrency(fee_payment_2)}`;
      let depositDay = dayjs(quote.details.daily.date_book);
      let payDay = dayjs(quote.details.daily.date_start).subtract(
        terms.balance3,
        "day"
      );
      paymentTerms += ` on ${
        payDay.isBefore(depositDay)
          ? depositDay.format("DD MMM YYYY (ddd)")
          : payDay.format("DD MMM YYYY (ddd)")
      }\n`;
    }
    paymentTerms += "• ";
    paymentTerms += `$${formatCurrency(fee_balance)}`;
    let depositDay = dayjs(quote.details.daily.date_book);
    let payDay = dayjs(quote.details.daily.date_start).subtract(
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

    payment = payment.replace("{payment_schedule}", paymentTerms);
    payment = payment.replace("{supplier_name}", quote.details.supplier.name);

    let billingDetail = [];
    billingDetail.push([
      {
        content: `Daily Rental (${quote.details.duration} days) 
        ${
          quote.details.min_days > quote.details.duration
            ? `\nPrice is based on minimum ${quote.details.min_days} days, less days will average out.`
            : ""
        }`,
      },
      {
        content: `${formatCurrency(quote.gross)}`,
        styles: { halign: "right" },
      },
    ]);
    let bond = quote.details.bonds ? quote.details.bonds : quote.details.bond;

    billingDetail.push([
      {
        content: `${bond.display_name}`,
      },
      {
        content: `${formatCurrency(bond.gross)}`,
        styles: { halign: "right" },
      },
    ]);

    if (quote.details.one_way > 0) {
      billingDetail.push([
        {
          content: "One-way Fee",
        },
        {
          content: `${formatCurrency(quote.details.one_way)}`,
          styles: { halign: "right" },
        },
      ]);
    }
    if (quote.details.fees.total > 0) {
      quote.details.fees.items.forEach((item) => {
        billingDetail.push([
          {
            content: item.name,
          },
          {
            content: `${formatCurrency(item.fee)}`,
            styles: { halign: "right" },
          },
        ]);
      });
    }
    if (quote.details.specials.total > 0) {
      quote.details.specials.items.forEach((item) => {
        let title = "• ";
        if (item.type === "Early bird") {
          title += `Early bird (${item.days} days) `;
        } else if (item.type === "Long term") {
          title += `Long term (${item.days} days) `;
        } else if (item.type === "Every X day") {
          title += `Every ${item.days} days `;
        }

        if (item.factor === "Percentage") {
          title += `Discount ${item.value}%`;
        } else if (item.factor === "Price") {
          title += `Discount $${item.value}`;
        } else if (item.factor === "Day") {
          title += `Discount ${item.value} ${item.value > 1 ? "days" : "day"}`;
        } else if (item.factor === "No One Way Fee") {
          title += "No One Way Fee";
        }
        billingDetail.push(
          [
            {
              content: `Deduct: ${item.name}`,
            },
            {
              content: "",
              styles: { halign: "right" },
            },
          ],
          [
            {
              content: `${title})\n${item.description}`,
            },
            {
              content: `- $${formatCurrency(item.discount_amount)}`,
              styles: { halign: "right" },
            },
          ]
        );

        if (item.discount2) {
          let title2 = "• ";
          if (item.type2 === "Early bird") {
            title2 += `Early bird (${item.days2} days) `;
          } else if (item.type2 === "Long term") {
            title2 += `Long term (${item.days2} days) `;
          } else if (item.type2 === "Every X day") {
            title2 += `Every ${item.days2} days `;
          }

          if (item.factor2 === "Percentage") {
            title2 += `Discount ${item.value2}%`;
          } else if (item.factor2 === "Price") {
            title2 += `Discount $${item.value2}`;
          } else if (item.factor2 === "Day") {
            title2 += `Discount ${item.value2} ${
              item.value2 > 1 ? "days" : "day"
            }`;
          } else if (item.factor2 === "No One Way Fee") {
            title2 += "No One Way Fee";
          }
          billingDetail.push([
            {
              content: `${title2})`,
            },
            {
              content: `- $${formatCurrency(item.discount_amount2)}`,
              styles: { halign: "right" },
            },
          ]);
        }
      });
    }

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

    const doc = new jsPDF({ orientation: "p", lineHeight: 1.5 });

    // header
    doc.autoTable({
      theme: "plain",
      body: [
        [
          {
            content: "",
            styles: {
              minCellHeight: 30,
            },
          },
          {
            content: contents.name,
            styles: {
              halign: "right",
              fontSize: 18,
              fontStyle: "bold",
            },
          },
        ],
      ],
      didDrawCell: function (data) {
        if (data.column.dataKey === 0 && data.row.section === "body") {
          doc.autoTable({
            theme: "plain",
            head: [
              [
                {
                  content: letterhead.name,
                  styles: {
                    fontSize: 13,
                    fontStyle: "bold",
                    cellPadding: { bottom: 0, left: 1 },
                  },
                },
              ],
            ],
            body: [
              [
                {
                  content: letterhead.description,
                  styles: {
                    fontSize: 9,
                    textColor: "#999999",
                  },
                },
              ],
              [
                {
                  content: letterhead.content,
                  styles: {
                    fontSize: 10,
                  },
                },
              ],
            ],
          });
        }
      },
      styles: {
        cellPadding: 0,
      },
    });

    // notice
    doc.autoTable({
      theme: "plain",
      body: [
        [
          {
            content: contents.description,
          },
        ],
      ],
      bodyStyles: {
        fillColor: "#eeeeee",
      },
    });

    // reference
    doc.autoTable({
      theme: "plain",
      head: [
        [
          {
            content: "Reference",
            styles: {
              cellWidth: 60,
              cellPadding: { bottom: 0, left: 1 },
            },
          },
          {
            content: "Confirmation Code",
            styles: {
              cellWidth: 60,
              cellPadding: { bottom: 0, left: 1 },
            },
          },
          {
            content: "Date of Issue",
            styles: {
              cellWidth: 60,
              cellPadding: { bottom: 0, left: 1 },
            },
          },
        ],
      ],
      body: [
        [
          {
            content: quote.id + 388000,
          },
          {
            content: quote.status,
          },
          {
            content: dayjs(quote.created).format("DD MMM YYYY"),
          },
        ],
      ],
      headStyles: {
        fontSize: 9,
        textColor: "#999999",
        cellPadding: 0,
      },
      bodyStyles: {
        fontSize: 10,
      },
    });

    // Customer
    doc.autoTable({
      theme: "plain",
      head: [
        [
          {
            content: "Customer",
            styles: {
              cellWidth: 60,
              cellPadding: { bottom: 0, left: 1 },
            },
          },
          {
            content: "Driver",
            styles: {
              cellWidth: 60,
              cellPadding: { bottom: 0, left: 1 },
            },
          },
          {
            content: "Passenger",
            styles: {
              cellWidth: 60,
              cellPadding: { bottom: 0, left: 1 },
            },
          },
        ],
      ],
      body: [
        [
          {
            content: `${user.first_name} ${user.last_name}\n${user.email}\n${user.phone}`,
          },
          {
            content: `Age: ${quote.details.driver.age}\nLicense: ${quote.details.driver.license}`,
          },
          {
            content: `Adult: ${quote.details.passenger.adult}\nChildren: ${quote.details.passenger.children}`,
          },
        ],
      ],
      headStyles: {
        fontSize: 9,
        textColor: "#999999",
        cellPadding: 0,
      },
      bodyStyles: {
        fontSize: 10,
      },
    });

    // Itinerary
    doc.autoTable({
      theme: "plain",
      body: [
        [
          {
            content: "",
            styles: {
              minCellHeight: 50,
            },
          },
          {
            content: "",
            styles: {
              minCellHeight: 50,
            },
          },
        ],
      ],
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.row.section === "body") {
          doc.autoTable({
            theme: "plain",
            head: [
              [
                {
                  content: "Pick-up",
                  styles: {
                    cellWidth: 90,
                  },
                },
                {
                  content: "Drop-off",
                  styles: {
                    cellWidth: 90,
                  },
                },
              ],
            ],
            body: [
              [
                {
                  content: `${quote.details.pickup.name}\n${dayjs(
                    quote.details.date_start
                  ).format("DD MMM YYYY (ddd)")}`,
                  styles: {
                    fontStyle: "bold",
                  },
                },
                {
                  content: `${quote.details.dropoff.name}\n${dayjs(
                    quote.details.date_end
                  ).format("DD MMM YYYY (ddd)")}`,
                  styles: {
                    fontStyle: "bold",
                  },
                },
              ],
              [
                {
                  content: `${pickup.Address}}`,
                },
                {
                  content: `${dropoff.Address}}`,
                },
              ],
              [
                {
                  content: `Contact (Australia): ${pickup["Contact (Australia)"]}\nContact (International): ${pickup["Contact (International)"]}`,
                },
                {
                  content: `Contact (Australia): ${dropoff["Contact (Australia)"]}\nContact (International): ${dropoff["Contact (International)"]}`,
                },
              ],
            ],
            headStyles: {
              fontSize: 9,
              textColor: "#999999",
            },
          });
        }
      },
      bodyStyles: {
        fontSize: 10,
      },
      styles: {
        lineColor: "#000000",
        lineWidth: 0.1,
      },
    });

    // Payment
    doc.autoTable({
      theme: "plain",
      head: [
        [
          {
            content: "Payment Schedule",
          },
        ],
      ],
      body: [
        [
          {
            content: payment,
          },
        ],
      ],
      headStyles: {
        fontStyle: "bold",
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
      },
    });

    // Details
    doc.autoTable({
      theme: "plain",
      pageBreak: "always",
      head: [
        [
          {
            content: "Payment Summary",
            styles: {
              fontSize: 18,
              fontStyle: "bold",
            },
          },
        ],
      ],
    });
    doc.autoTable({
      theme: "striped",
      head: [
        [
          {
            content: "Billing Details",
            styles: {
              cellWidth: 140,
            },
          },
          {
            content: "AUD",
            styles: {
              cellWidth: 40,
              halign: "right",
            },
          },
        ],
      ],
      body: billingDetail,
      headStyles: {
        fontSize: 12,
        fontStyle: "bold",
        textColor: "#000000",
        fillColor: "#ffffff",
      },
    });

    doc.autoTable({
      theme: "plain",
      head: [
        [
          {
            content: "Total payable to agent",
            styles: {
              cellWidth: 140,
            },
          },
          {
            content: formatCurrency(
              terms.pay_counter
                ? fee_deposit + fee_payment_1 + fee_payment_2
                : quote.gross
            ),
            styles: {
              cellWidth: 40,
              halign: "right",
            },
          },
        ],
        [
          {
            content: "Total payable to supplier at pick-up counter",
          },
          {
            content: formatCurrency(
              terms.pay_counter
                ? quote.gross - fee_deposit - fee_payment_1 - fee_payment_2
                : 0
            ),
            styles: {
              halign: "right",
            },
          },
        ],
        [
          {
            content: "Total full amount",
          },
          {
            content: formatCurrency(quote.gross),
            styles: {
              halign: "right",
            },
          },
        ],
      ],
      body: [
        [
          {
            content: "* Rates quoted are in Australian Dollar (AUD)",
          },
          {
            content: "",
          },
        ],
      ],
      headStyles: {
        fontSize: 12,
        fontStyle: "bold",
        textColor: "#000000",
        fillColor: "#ffffff",
      },
    });

    // return doc.save("sample.pdf");
    return doc.output("blob");
  },
};
