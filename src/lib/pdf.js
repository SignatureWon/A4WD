import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export const pdf = {
  generate_pdf: (user, quote, title) => {
    const doc = new jsPDF();

    // header
    doc.autoTable({
      theme: "plain",
      body: [
        [
          {
            content: "",
            styles: {
              minCellHeight: 25,
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
        lineColor: "#000000",
        lineWidth: 0.1,
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
            content: "388001",
          },
          {
            content: "JUL01234-1",
          },
          {
            content: dayjs().format("DD MMM YYYY"),
          },
        ],
      ],
      headStyles: {
        fontSize: 9,
        textColor: "#999999",
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
              content: "388001",
            },
            {
              content: "JUL01234-1",
            },
            {
              content: dayjs().format("DD MMM YYYY"),
            },
          ],
        ],
        headStyles: {
          fontSize: 9,
          textColor: "#999999",
        },
        bodyStyles: {
          fontSize: 10,
        },
      });
      // doc.autoTable({
    //   theme: "plain",
    //   body: [
    //     [
    //       {
    //         content: "Customer Details",
    //         styles: {
    //           cellWidth: 60,
    //           fontSize: 12,
    //           fontStyle: "bold",
    //         },
    //       },
    //       {
    //         content: "",
    //         styles: {
    //           cellWidth: 60,
    //         },
    //       },
    //       {
    //         content: "",
    //         styles: {
    //           cellWidth: 60,
    //         },
    //       },
    //     ],
    //     [
    //       {
    //         content: "Attn",
    //         styles: {
    //           fontSize: 9,
    //           textColor: "#999999",
    //         },
    //       },
    //       {
    //         content: "Driver",
    //         styles: {
    //           fontSize: 9,
    //           textColor: "#999999",
    //         },
    //       },
    //       {
    //         content: "Passenger",
    //         styles: {
    //           fontSize: 9,
    //           textColor: "#999999",
    //         },
    //       },
    //     ],
    //     [
    //       {
    //         content: "388001",
    //         styles: {
    //           fontSize: 10,
    //         },
    //       },
    //       {
    //         content: "JUL01234-1",
    //         styles: {
    //           fontSize: 10,
    //         },
    //       },
    //       {
    //         content: dayjs().format("DD MMM YYYY"),
    //         styles: {
    //           fontSize: 10,
    //         },
    //       },
    //     ],
    //   ],
    // });

    return doc.save("sample.pdf");
    // return doc.output("invoice");
  },
};
