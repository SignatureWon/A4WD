import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { supabase } from "$lib/supabaseClient";
import { format } from "$lib/format.js";
import { env } from "$env/dynamic/public";
import CryptoJS from "crypto-js";
import { q } from "$lib/quote.js";
import { theme } from "$lib/theme.js";

export const html = {
  create: async (quote_id) => {
    // console.log(quote_id);
    const { data: color } = await supabase.from("constants").select("name").eq("type", "color").single();

    const c = theme.brandcolor(color.name);

    const { data: letterhead } = await supabase
      .from("contents")
      .select("content, description, name")
      .eq("type", "template_letterhead")
      .single();
    const { data: quote } = await supabase.from("quotes").select("*, users (*)").eq("id", quote_id).single();
    const { data: supplier } = await supabase.from("suppliers").select().eq("id", quote.details.supplier.id).single();
    const { data: vehicle } = await supabase.from("vehicles").select().eq("id", quote.details.vehicle.id).single();

    const pickup = supplier.depots.filter((item) => {
      return item.Depots.id === quote.details.pickup.id;
    })[0];
    const dropoff = supplier.depots.filter((item) => {
      return item.Depots.id === quote.details.dropoff.id;
    })[0];

    let summary = q.getPayments(quote);
    let terms = {
      name: null,
      id: null,
      confirmation: null,
      confirmation_terms: null,
      summary: null,
      summary_terms: null,
      counter: null,
      counter_terms: null,
      deposit: 0,
      percentage: false,
      balance: 0,
      description: null,
      payment2: false,
      deposit2: null,
      percentage2: null,
      balance2: null,
      description2: null,
      payment3: null,
      deposit3: null,
      percentage3: null,
      balance3: null,
      description3: null,
      pay_counter: false,
      suppliers: {
        id: null,
        name: null,
      },
    };

    if ("terms" in quote.details) {
      terms = quote.details.terms;
    }
    const totalOutstanding = () => {
      let payments = quote.payments || [];
      let paid = 0;
      payments.forEach((obj) => {
        paid += obj.amount;
      });
      let total = summary.totalAgent;
      if (paid > summary.totalAgent) {
        total = summary.totalAgent + summary.totalSupplier;
      }
      return total - paid;
    };

    let address = letterhead.content.replace(/(?:\r\n|\r|\n)/g, "||");
    let addressDropoff = dropoff.Address.replace(/(?:\r\n|\r|\n)/g, "||");
    let addressPickup = pickup.Address.replace(/(?:\r\n|\r|\n)/g, "||");

    let json = [
      {
        columns: [
          {
            width: "*",
            stack: [
              {
                text: letterhead.name,
                bold: true,
              },
              {
                text: letterhead.description,
                color: "#999",
                fontSize: 8,
              },
              address.split("||"),
            ],
          },
          {
            width: "auto",
            stack: [
              {
                text: "FINAL",
                fontSize: 15,
                bold: true,
                alignment: "right",
              },
              {
                text: "TICKET",
                fontSize: 15,
                bold: true,
                alignment: "right",
              },
            ],
          },
        ],
        margin: [0, 0, 0, 10],
      },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, color: "#ccc" }] },
      {
        layout: {
          hLineWidth: function (i, node) {
            return 0;
          },
          vLineWidth: function (i, node) {
            return 0;
          },
          paddingLeft: function (i, node) {
            return 1;
          },
          paddingRight: function (i, node) {
            return 1;
          },
          paddingTop: function (i, node) {
            return 5;
          },
          paddingBottom: function (i, node) {
            return 5;
          },
        },
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
              {
                stack: [
                  {
                    text: "TICKET NO.",
                    style: "label",
                  },
                  {
                    text: `FT${388000 + quote.id}`,
                    bold: true,
                  },
                ],
              },
              {
                stack: [
                  {
                    text: "TICKET DATE",
                    style: "label",
                  },
                  {
                    text: quote.date_balance ? dayjs(quote.date_balance).format("DD MMM YYYY") : "&mdash;",
                    bold: true,
                  },
                ],
              },
              {
                stack: [
                  {
                    text: "DURATION",
                    style: "label",
                  },
                  {
                    text: `${quote.details.duration} days`,
                    bold: true,
                  },
                ],
              },
            ],
          ],
        },
      },
      {
        layout: {
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return 0;
          },
          hLineColor: function (i, node) {
            return "#ccc";
          },
          paddingLeft: function (i, node) {
            return 1;
          },
          paddingRight: function (i, node) {
            return 1;
          },
          paddingTop: function (i, node) {
            return 5;
          },
          paddingBottom: function (i, node) {
            return 5;
          },
        },
        table: {
          widths: ["*", "*"],
          body: [
            [
              {
                stack: [
                  {
                    text: "PICK-UP FROM",
                    style: "label",
                  },
                  {
                    text: quote.details.pickup.name,
                    bold: true,
                  },
                  {
                    text: `${dayjs(quote.details.date_start).format("ddd, DD MMM YYYY")}${
                      supplier.all_day
                        ? " (24hrs)"
                        : `, ${supplier.start_time ? q.showtime(supplier.start_time) : "03:00PM"}`
                    }`,
                    margin: [0, 0, 0, 10],
                  },
                  {
                    text: "DEPOT",
                    style: "label",
                  },
                  addressPickup.split("||"),
                  {
                    text: pickup["Contact (Australia)"] ? `Australia: ${pickup["Contact (Australia)"]}` : "",
                  },
                  {
                    text: pickup["Contact (International)"]
                      ? `International: ${pickup["Contact (International)"]}`
                      : "",
                    margin: [0, 0, 0, 10],
                  },
                ],
              },
              {
                stack: [
                  {
                    text: "DROP-OFF TO",
                    style: "label",
                  },
                  {
                    text: quote.details.dropoff.name,
                    bold: true,
                  },
                  {
                    text: `${dayjs(quote.details.date_end).format("ddd, DD MMM YYYY")}${
                      supplier.all_day
                        ? " (24hrs)"
                        : `, ${supplier.end_time ? q.showtime(supplier.end_time) : "03:00PM"}`
                    }`,
                    margin: [0, 0, 0, 10],
                  },
                  {
                    text: "DEPOT",
                    style: "label",
                  },
                  addressDropoff.split("||"),
                  {
                    text: dropoff["Contact (Australia)"] ? `Australia: ${dropoff["Contact (Australia)"]}` : "",
                  },
                  {
                    text: dropoff["Contact (International)"]
                      ? `International: ${dropoff["Contact (International)"]}`
                      : "",
                    margin: [0, 0, 0, 10],
                  },
                ],
              },
            ],
            [
              {
                stack: [
                  {
                    text: "SUPPLIER",
                    style: "label",
                  },
                  {
                    text: supplier.name,
                    bold: true,
                  },
                  {
                    text: supplier.url ? { text: "Self Check-in", link: supplier.url } : "",
                    color: c.brand500,
                  },
                  supplier.phone ? `Customer Service: ${supplier.phone}` : "",
                ],
              },
              {
                stack: [
                  {
                    text: `${quote.details.supplier.name.toUpperCase()} CONFIRMATION CODE`,
                    style: "label",
                  },
                  {
                    text: quote.supplier_reference || "&mdash;",
                    bold: true,
                  },
                ],
              },
            ],
          ],
        },
      },
    ];
    return json;

  },
};
