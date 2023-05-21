import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { supabase } from "$lib/supabaseClient";

export const pdf = {
  generate_pdf: async (user, quote, title) => {
    const { data: supplierData } = await supabase
      .from("suppliers")
      .select()
      .eq("id", quote.supplier.id)
      .single();

    const pickup = supplierData.depots.filter((d) => {
      return d.Depots.id === quote.pickup.id;
    })[0];

    const dropoff = supplierData.depots.filter((d) => {
      return d.Depots.id === quote.dropoff.id;
    })[0];
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
            content: title,
            styles: {
              halign: "right",
              fontSize: 16,
              fontStyle: "bold",
            },
          },
        ],
      ],
      didDrawCell: function (data) {
        if (data.column.dataKey === 0 && data.row.section === "body") {
          doc.autoTable({
            theme: "plain",
            body: [
              [
                {
                  content: "Australia 4 Wheel Drive Rentals",
                  styles: {
                    halign: "left",
                    fontSize: 12,
                    fontStyle: "bold",
                  },
                },
              ],
              [
                {
                  content:
                    "ABN No: 54 561 356 425 | License No: 094\n" +
                    "Postal Address: GPO Box 3410, Darwin, NT 0801\n" +
                    "Tel: 1-800-107-371 OR 08-7999-7511 OR 0400-278-958 (Australia)\n" +
                    "Email: info@australia4wdrentals.com",
                  styles: {
                    halign: "left",
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
    let notice =
      "If you have just entered a self quote request, please allow us 24 hours or less to check availability and price.";
    doc.autoTable({
      theme: "plain",
      body: [
        [
          {
            content: notice,
          },
        ],
      ],
      bodyStyles: {
        fillColor: "#eeeeee",
        // lineColor: "#000000",
        // lineWidth: 0.1,
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
            },
          },
          {
            content: "Confirmation Code",
            styles: {
              cellWidth: 60,
            },
          },
          {
            content: "Date of Issue",
            styles: {
              cellWidth: 60,
            },
          },
        ],
      ],
      body: [
        [
          {
            content: quote.reference,
          },
          {
            content: quote.confirmation || "PENDING",
          },
          {
            content: quote.date_issue.format("DD MMM YYYY"),
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
            },
          },
          {
            content: "Driver",
            styles: {
              cellWidth: 60,
            },
          },
          {
            content: "Passenger",
            styles: {
              cellWidth: 60,
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
            content: `Age: ${user.age}\nLicense: ${user.license}`,
          },
          {
            content: `Adult: ${user.adult}\nChildren: ${user.children}
            `,
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
                  content: `${quote.pickup.name}\n${quote.date_start.format(
                    "DD MMM YYYY (ddd)"
                  )}`,
                  styles: {
                    fontStyle: "bold",
                  },
                },
                {
                  content: `${quote.dropoff.name}\n${quote.date_end.format(
                    "DD MMM YYYY (ddd)"
                  )}`,
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
              content: "Payments are to be made (by credit card or Internet transfer) according to the schedule below. Unless advised otherwise, yourcredit card (supplied to us at the time of booking) will be charged accordingly. Kindly refer to the Payments Summary found on your provisional or e-ticket issued to you for more details.",
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
  
    return doc.save("sample.pdf");
    // return doc.output("invoice");
  },
};
