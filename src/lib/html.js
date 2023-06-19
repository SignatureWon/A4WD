import dayjs from "dayjs";
import { supabase } from "$lib/supabaseClient";
import { format } from "$lib/format.js";
import { env } from "$env/dynamic/public";
import CryptoJS from "crypto-js";
import { q } from "$lib/quote.js";

export const html = {
  create: async (quote_id, type) => {
    const { data: letterhead } = await supabase
      .from("contents")
      .select("content, description, name")
      .eq("type", "template_letterhead")
      .single();

    const { data: contents } = await supabase.from("contents").select().eq("type", type).single();

    const { data: quote } = await supabase
      .from("quotes")
      .select(
        "*, users (id, first_name, last_name, email, phone, address_1, address_2, postcode, city, state, country)"
      )
      .eq("id", quote_id)
      .single();
    // console.log("quote", quote, quote_id);

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

    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("name, slug, image")
      .eq("id", quote.details.vehicle.id)
      .single();

    const duration = quote.details.duration;
    const date_quote = dayjs(quote.created_at).format("DD MMM YYYY");
    const date_start = dayjs(quote.details.date_start).format("ddd, DD MMM YYYY");
    const date_end = dayjs(quote.details.date_end).format("ddd, DD MMM YYYY");
    // let agentFees = [];
    // let supplierFees = [];
    // let pickupFees = [];

    // const totalAgentFee = () => {
    //   let sum = 0;
    //   agentFees.forEach((fee) => {
    //     sum += fee.total;
    //   });
    //   return sum;
    // };
    // const totalAgentCommission = () => {
    //   // console.log(agentFees);
    //   let sum = 0;
    //   agentFees.forEach((fee) => {
    //     sum += fee.profit;
    //   });

    //   sum -= quote.add_discount;
    //   return sum;
    // };
    // const totalSupplierFee = () => {
    //   let sum = 0;
    //   supplierFees.forEach((fee) => {
    //     sum += fee.total;
    //   });
    //   return sum;
    // };

    // const getDailyRates = () => {
    //   let obj = quote.details.daily;
    //   let type = quote.details.rates_type;
    //   let arr = obj.items;
    //   if (type === "flex") {
    //     let week = 1;
    //     let day = 0;
    //     arr.forEach((o, i) => {
    //       if (i !== 0 && i % 7 === 0) {
    //         agentFees.push({
    //           name: `Daily basic rental: Week ${week}: Flex[${arr[i - 1].flex}]: $${format.currency(
    //             arr[i - 1].gross
    //           )} x ${day} days`,
    //           total: arr[i - 1].gross * day,
    //           nett: arr[i - 1].nett * day,
    //           profit: arr[i - 1].profit * day,
    //         });
    //         day = 1;
    //         week++;
    //       } else {
    //         day++;
    //       }
    //       if (i === arr.length - 1) {
    //         agentFees.push({
    //           name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
    //           total: o.gross * day,
    //           nett: o.nett * day,
    //           profit: o.profit * day,
    //         });
    //       }
    //     });
    //   } else {
    //     agentFees.push({
    //       name: `Daily basic rental: $${format.currency(obj.gross / arr.length)} x ${arr.length} days`,
    //       total: obj.gross,
    //       nett: obj.nett,
    //       profit: obj.profit,
    //     });
    //   }
    // };
    // const getDiscount = () => {
    //   if (quote.add_discount > 0) {
    //     agentFees.push({
    //       name: `Discount: ${quote.add_discount_remark}`,
    //       total: -quote.add_discount,
    //       nett: 0,
    //       profit: 0,
    //     });
    //   }
    // };

    // const getBonds = () => {
    //   const bond = Object.keys(quote.details.bonds).length ? quote.details.bonds : quote.details.bond;
    //   pickupFees.push({
    //     name: `Bond: $${format.currency(
    //       bond.bond,
    //       0
    //     )} is taken from the hirer's credit or debit card <div style="font-size: 14px; color: #999999">Refundable as per supplier's Summary of Terms<div>`,
    //     total: bond.bond,
    //     nett: 0,
    //     profit: 0,
    //   });

    //   let gross = 0;
    //   let nett = 0;
    //   let profit = 0;

    //   if ("gross" in bond) {
    //     gross = bond.gross * duration;
    //     nett = bond.nett * duration;
    //     profit = nett > 0 ? gross - nett : 0;
    //   } else {
    //     bond.gross = 0;
    //     bond.nett = 0;
    //     bond.bond = 0;
    //   }

    //   if (bond.gross > 0) {
    //     const row = {
    //       name: `${bond.display_name}: $${bond.gross} x ${duration} days`,
    //       total: gross,
    //       nett: nett,
    //       profit: profit,
    //     };
    //     if (bond.nett > 0 && bond.gross > bond.nett) {
    //       agentFees.push(row);
    //     } else {
    //       supplierFees.push(row);
    //       pickupFees.push(row);
    //     }
    //   }
    // };

    // const getOneways = () => {
    //   let one_way = quote.details.one_way;
    //   if (one_way > 0) {
    //     supplierFees.push({
    //       name: `One-way fee`,
    //       total: one_way,
    //       nett: 0,
    //       profit: 0,
    //     });
    //     pickupFees.push({
    //       name: `One-way fee`,
    //       total: one_way,
    //       nett: 0,
    //       profit: 0,
    //     });
    //   }
    // };
    // const getAddons = () => {
    //   let addons = quote.details.addons;
    //   for (const key in addons) {
    //     const addon = addons[key];
    //     let gross = addon.gross_rate;
    //     if (addon.daily) {
    //       gross = gross * duration;
    //     }
    //     if (addon.gross_cap > 0) {
    //       if (gross > addon.gross_cap) {
    //         gross = addon.gross_cap;
    //       }
    //     }
    //     let nett = addon.nett_rate;
    //     if (addon.daily) {
    //       nett = nett * duration;
    //     }
    //     if (addon.nett_cap > 0) {
    //       if (nett > addon.nett_cap) {
    //         nett = addon.nett_cap;
    //       }
    //     }
    //     const row = {
    //       name: `Add-on: ${addon.name} ${addon.daily ? `$${addon.gross_rate} x ${duration} days` : ""}`,
    //       total: gross,
    //       nett: nett,
    //       profit: nett > 0 ? gross - nett : 0,
    //     };
    //     if (addon.nett_rate > 0 && addon.gross_rate > addon.nett_rate) {
    //       agentFees.push(row);
    //     } else {
    //       supplierFees.push(row);
    //       pickupFees.push(row);
    //     }
    //   }
    // };

    // const getSpecials = () => {
    //   let special = quote.details.specials;
    //   if (special.total > 0) {
    //     special.items.forEach((item) => {
    //       if (item.discount_amount > 0) {
    //         agentFees.push({
    //           name: item.name,
    //           total: -item.discount_amount,
    //           nett: 0,
    //           profit: 0,
    //         });
    //       }
    //     });
    //   }
    // };
    // const getFees = () => {
    //   let fee = quote.details.fees;
    //   if (fee.total > 0) {
    //     fee.items.forEach((item) => {
    //       supplierFees.push({
    //         name: item.name,
    //         total: item.fee,
    //         nett: 0,
    //         profit: 0,
    //       });
    //       pickupFees.push({
    //         name: item.name,
    //         total: item.fee,
    //         nett: 0,
    //         profit: 0,
    //       });
    //     });
    //   }
    // };
    // const getCcs = () => {
    //   if (quote.cc_charge) {
    //     let fee = (totalAgentFee() * 2) / 100;
    //     if (fee > 0) {
    //       agentFees.push({
    //         name: "Credit card surcharge (2%)",
    //         total: fee,
    //         nett: 0,
    //         profit: 0,
    //       });
    //     }
    //   } else {
    //     agentFees.push({
    //       name: "Credit card surcharge (WAIVED)",
    //       total: 0,
    //       nett: 0,
    //       profit: 0,
    //     });
    //   }
    // };

    // let termsItems = [];
    // const getTerms = () => {
    //   let total = totalAgentFee();

    //   if ("terms" in quote.details) {
    //     let terms = quote.details.terms;
    //     let gap = dayjs(date_start).diff(dayjs(date_quote), "day");

    //     if (gap <= terms.balance) {
    //       termsItems = [
    //         {
    //           name: `Full payment to agent on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
    //           total: total,
    //         },
    //       ];
    //     } else {
    //       termsItems = [
    //         {
    //           name: `Booking deposit to agent now (${
    //             terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
    //           }) on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
    //           total: terms.percentage ? (total * terms.deposit) / 100 : terms.deposit,
    //         },
    //       ];
    //       if (terms.payment2) {
    //         if (terms.balance2 < gap) {
    //           termsItems.push({
    //             name: `First payment to agent (${
    //               terms.percentage2 ? `${terms.deposit2}%` : `$${terms.deposit2}`
    //             }) on ${dayjs(date_start).subtract(terms.balance2, "day").format("ddd, DD MMM YYYY")} (${
    //               terms.balance2
    //             } days before
    //             travel)`,
    //             total: terms.percentage2 ? (total * terms.deposit2) / 100 : terms.deposit2,
    //           });
    //         }
    //       }
    //       if (terms.payment3) {
    //         if (terms.balance3 < gap) {
    //           termsItems.push({
    //             name: `Second payment (${terms.percentage3 ? `${terms.deposit3}%` : `$${terms.deposit3}`}) on ${dayjs(
    //               date_start
    //             )
    //               .subtract(terms.balance3, "day")
    //               .format("ddd, DD MMM YYYY")} (${terms.balance3} days before
    //             travel)`,
    //             total: terms.percentage3 ? (total * terms.deposit3) / 100 : terms.deposit3,
    //           });
    //         }
    //       }
    //       // balance
    //       if (terms.balance < gap) {
    //         let bal = total;
    //         termsItems.forEach((t) => {
    //           bal -= t.total;
    //         });

    //         termsItems.push({
    //           name:
    //             "Balance payment to " +
    //             (terms.pay_counter
    //               ? `supplier at pick-up counter on ${dayjs(date_start).format("ddd, DD MMM YYYY")}`
    //               : `agent on ${dayjs(date_start).subtract(terms.balance, "day").format("ddd, DD MMM YYYY")}`) +
    //             ` (${terms.balance} days before travel)`,
    //           total: bal,
    //         });
    //       }
    //     }
    //   }
    // };

    // map data
    const info = {
      doc: {
        name: contents.name,
      },
      company: {
        name: letterhead.name,
        reg: letterhead.description,
        contact: letterhead.content.replace(/(?:\r\n|\r|\n)/g, "<br>"),
      },
      user: {
        first_name: quote.users.first_name,
        last_name: quote.users.last_name,
        email: quote.users.email,
        phone: quote.users.phone,
        address_1: quote.users.address_1,
        address_2: quote.users.address_2,
        postcode: quote.users.postcode,
        city: quote.users.city,
        state: quote.users.state,
        country: quote.users.country,
      },
      quote: {
        id: quote.id + 388000,
        date: date_quote,
        duration: duration,
        pickup: {
          name: quote.details.pickup.name,
          date: date_start,
        },
        dropoff: {
          name: quote.details.dropoff.name,
          date: date_end,
        },
      },
      comment: quote.comment,
      vehicle: {
        name: vehicle.name,
        slug: vehicle.slug,
        image: vehicle.image,
      },
      passenger: {
        adult: quote.details.passenger.adult,
        children: quote.details.passenger.children,
      },
      driver: {
        age: quote.details.driver.age,
        license: quote.details.driver.license,
      },
      terms: {
        id: terms.id,
        confirmation: {
          text: terms.confirmation_terms,
          pdf: terms.confirmation,
        },
        summary: {
          text: terms.summary_terms,
          pdf: terms.summary,
        },
        counter: {
          text: terms.counter_terms,
          pdf: terms.counter,
        },
      },
      // daily: getDailyRates(),
      // discount: getDiscount(),
      // bond: getBonds(),
      // oneway: getOneways(),
      // addon: getAddons(),
      // special: getSpecials(),
      // fee: getFees(),
      // cc: getCcs(),
      // term: getTerms(),
    };
    const encId = CryptoJS.AES.encrypt(info.quote.id.toString(), env.PUBLIC_AES_KEY).toString().replaceAll("/", "__");

    let email = `
<!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<style type="text/css">
body{
    margin:0;
    padding:0;
    font-family: "DM Sans", sans-serif;
}

img{
    border:0 none;
    height:auto;
    line-height:100%;
    outline:none;
    text-decoration:none;
}

a img{
    border:0 none;
}

.imageFix{
    display:block;
}

table, td{
    border-collapse:collapse;
    font-size: 14px;
    font-family: "DM Sans", sans-serif;
}

#bodyTable{
    height:100% !important;
    margin:0;
    padding:0;
    width:100% !important;
    font-size: 12px;
}
@media print {
  .no-print {
    visibility: hidden;
  }
}
</style>
</head>
<body>
<div
  style="width: 600px; background-color: #ffffff; margin: auto; padding: 0; font-size: 14px; font-family: "DM Sans", sans-serif;"
>
  <table width="600" style="margin-bottom: 30px;">
    <tr>
      <td>
        <div style="font-size: 16px; font-weight: bold">
          ${info.company.name}
        </div>
        <div style="font-size: 10px; color: #999999">
          ${info.company.reg}
        </div>
        <div style="font-size: 12px;">
          ${info.company.contact}
        </div>
      </td>
      <td valign="top">
        <div style="text-align: right; font-size: 20px; font-weight: bold">
          ${info.doc.name}
        </div>
      </td>
    </tr>
  </table>
  <hr />
  <div style="margin-top: 30px; margin-bottom: 10px; font-weight: bold;">
    Dear ${info.user.first_name},
  </div>
  <div style="margin-bottom: 30px">
    Thank you for contacting <a
      href="www.australia4wdrentals.com"
      style="color: #1d4ed8">www.australia4wdrentals.com</a
    > one of Australia's leading officially licensed specialist agents for vehicle
    rentals (motorhomes, campers, 4WD, 4WD campers) and guided safari tours based
    in and operating out of Darwin, Australia.
  </div>
  <div style="margin-bottom: 10px; font-weight: bold;">
    Availability and validity of this quotation
  </div>
  <div style="margin-bottom: 10px;">
    Vehicle is subject to availability and rates are subject to change prior to
    confirmation. We suggest you book as soon as possible to ensure you get the
    vehicle you want at the best price.
  </div>
  <div style="margin-bottom: 10px;">
    If you have any queries please <a
      href="https://www.australia4wdrentals.com/contact-us">contact</a
    > our friendly staff. Please be advised that the prices stated in our quote are
    confidential.
  </div>
  <div style="margin-bottom: 30px;">
    Please note that all prices are quoted in <b
      >Australian Dollars (AUD)</b
    >.
  </div>
  <table
    width="600"
    cellpadding="20"
    cellspacing="0"
    style="margin-bottom: 30px;"
  >
    <tr>
      <td
        width="33.3333%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Quote No.</div>
        <div style="font-weight: bold">
          Q${info.quote.id}
        </div>
      </td>
      <td
        width="33.3333%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Quote Date</div>
        <div style="font-weight: bold">
          ${info.quote.date}
        </div>
      </td>
      <td
        width="33.3333%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Duration</div>
        <div style="font-weight: bold">
          ${info.quote.duration} days
        </div>
      </td>
    </tr>
  </table>
  <table
    width="600"
    cellpadding="20"
    cellspacing="0"
    style="margin-bottom: 30px;"
  >
    <tr>
      <td
        width="50%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Pick-up from</div>
        <div style="font-weight: bold">
          ${info.quote.pickup.name}
        </div>
        <div>
          ${info.quote.pickup.date}
        </div>
      </td>
      <td
        width="50%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Drop-off at</div>
        <div style="font-weight: bold">
          ${info.quote.dropoff.name}
        </div>
        <div>
          ${info.quote.dropoff.date}
        </div>
      </td>
    </tr>
    <tr>
      <td
        width="50%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Customer</div>
        <div style="font-weight: bold">
          ${info.user.first_name}
          ${info.user.last_name}
        </div>
        <div>
          ${info.user.email}<br>
          ${info.user.phone}<br><br>
        </div>
        <div>
          ${info.user.address_1 ? `${info.user.address_1},<br>` : ""}
          ${info.user.address_2 ? `${info.user.address_2},<br>` : ""}
          ${info.user.postcode ? `${info.user.postcode}` : ""}
          ${info.user.city ? `${info.user.city},<br>` : ""}
          ${info.user.state ? `${info.user.state}` : ""}
          ${info.user.country ? `${info.user.country}` : ""}
        </div>
      </td>
      <td
        width="50%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Vehicle</div>
        <div style="font-weight: bold">
          ${info.vehicle.name}
        </div>
        <div style="margin-bottom: 20px">
          <a
            href="https://www.australia4wdrentals.com/vehicles/${info.vehicle.slug}">View vehicle specs</a
          >
        </div>
        <div>
          <img class="imageFix"
            src="https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${
              info.vehicle.image
            }?width=300&height=300&resize=contain"
            alt=${info.vehicle.name}
          />
        </div>
      </td>
    </tr>
    <tr>
      <td
        width="50%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Passenger</div>
        <div style="font-weight: bold">
          Adult: ${info.passenger.adult}
        </div>
        <div style="font-weight: bold">
          Children: ${info.passenger.children}
        </div>
      </td>
      <td
        width="50%"
        valign="top"
        align="center"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Driver</div>
        <div style="font-weight: bold">
          Age: ${info.driver.age}
        </div>
        <div style="font-weight: bold">
          License: ${info.driver.license}
        </div>
      </td>
    </tr>
  </table>
  <table
    width="600"
    cellpadding="20"
    cellspacing="0"
    style="margin-bottom: 30px;page-break-before: always"
  >
    <tr>
      <td
        align="center"
        style="border: 1px solid #CCCCCC"
      >
      <div style="font-size: 12px; color: #999999">Comment</div>
      <div style="font-weight: bold">
        ${info.comment || "No comment"}
      </div>
    </td>
    </tr>
  </table>
  <table
    width="600"
    cellpadding="10"
    cellspacing="0"
    style="margin-bottom: 30px;"
  >
    <tr>
      <td
        width="75%"
        valign="top"
        align="left"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Payable to Agent</div>
      </td>
      <td
        width="25%"
        valign="top"
        align="right"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Total ($)</div>
      </td>
    </tr>`;
    summary.agentItems.forEach((item) => {
      email += `
    <tr>
      <td valign="top" align="left" style="border: 1px solid #CCCCCC">
        <div>
          ${item.name}
        </div>
      </td>
      <td valign="top" align="right" style="border: 1px solid #CCCCCC">
        <div>${format.currency(item.total)}</div>
      </td>
    </tr>`;
    });
    email += `
    <tr>
      <td
        valign="top"
        align="left"
        style="border: 1px solid #CCCCCC; background-color: #dbeafe;"
      >
        <div style="font-weight: bold;">Total payable to agent</div>
      </td>
      <td
        valign="top"
        align="right"
        style="border: 1px solid #CCCCCC; background-color: #dbeafe;"
      >
        <div style="font-weight: bold;">${format.currency(summary.totalAgent)}</div>
      </td>
    </tr>
  </table>
  <table
    width="600"
    cellpadding="10"
    cellspacing="0"
    style="margin-bottom: 30px;"
  >
    <tr>
      <td
        width="75%"
        valign="top"
        align="left"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Payable to Supplier</div>
      </td>
      <td
        width="25%"
        valign="top"
        align="right"
        style="border: 1px solid #CCCCCC"
      >
        <div style="font-size: 12px; color: #999999">Total ($)</div>
      </td>
    </tr>`;
    summary.supplierItems.forEach((item) => {
      email += `
      <tr>
        <td valign="top" align="left" style="border: 1px solid #CCCCCC">
          <div>
            ${item.name}
          </div>
        </td>
        <td valign="top" align="right" style="border: 1px solid #CCCCCC">
          <div>${format.currency(item.total)}</div>
        </td>
      </tr>`;
    });
    email += `
    <tr>
      <td
        valign="top"
        align="left"
        style="border: 1px solid #CCCCCC; background-color: #dbeafe;"
      >
        <div style="font-weight: bold;">
          Total payable to supplier at pick-up
          <div style="font-size: 14px; color: #999999">Any bond selected, addons, fees and one-way fee</div>
        </div>
      </td>
      <td
        valign="top"
        align="right"
        style="border: 1px solid #CCCCCC; background-color: #dbeafe;"
      >
        <div style="font-weight: bold;">
          ${format.currency(summary.totalSupplier)}
        </div>
      </td>
    </tr>
  </table>
  <table
    width="600"
    cellpadding="10"
    cellspacing="0"
    style="margin-bottom: 30px;"
  >
    <tr>
      <td
        width="75%"
        valign="top"
        align="left"
        style="background-color: #1d4ed8; color: #ffffff"
      >
        <div style="font-weight: bold; padding-top: 10px; padding-bottom: 10px">
          Total Amount
        </div>
      </td>
      <td
        width="25%"
        valign="top"
        align="right"
        style="background-color: #1d4ed8; color: #ffffff"
      >
        <div style="font-weight: bold; padding-top: 10px; padding-bottom: 10px">
          ${format.currency(summary.totalAgent + summary.totalSupplier)}
        </div>
      </td>
    </tr>
  </table>
  <div style="background-color: #dbeafe; padding: 20px; margin-bottom: 30px; width: 600px;" class="no-print">
    <div style="margin-bottom: 20px; font-size: 14px;">
      <a href="https://www.australia4wdrentals.com" style="color: #1d4ed8"
        >www.australia4wdrentals.com</a
      > is protected by a 256-bit ssl for complete peace of mind when booking
      online.
    </div>
    <div style="margin-bottom: 10px;">
      <a
        href="https://australia4wdrentals.com/booking/${encId}"
        style="display: block; width: 200px; padding-top: 10px; padding-bottom: 10px; text-align: center; font-weight: bold; font-size: 20px; background-color: #1d4ed8; text-decoration: none; color: #ffffff; border-radius: 5px"
      >
        <b style="text-decoration: none; color: #ffffff; font-size:16px">Book Now</b>
      </a>
    </div>
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 16px;page-break-before: always"
  >
    Payment Details & Schedule
  </div>
  <table
    width="600"
    cellpadding="10"
    cellspacing="0"
    style="margin-bottom: 10px;"
  >`;
    summary.termsItems.forEach((item) => {
      email += `
    <tr>
      <td style="border: 1px solid #CCCCCC">${item.name}</td>
      <td style="border: 1px solid #CCCCCC; text-align: right; width: 100px"
        >${format.currency(item.total)}</td
      >
    </tr>`;
    });
    email += `
  </table>
  <div style="margin-bottom: 10px;">
    The security deposit and balance payment to the agent is taken from the
    credit or debit card supplied at the time of booking - book now using our
    secure online booking form.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 16px"
  >
    Pay At Pick-Up
  </div>
  <table
    width="600"
    cellpadding="10"
    cellspacing="0"
    style="margin-bottom: 10px;"
    >`;
    summary.pickupItems.forEach((item) => {
      email += `
      <tr>
        <td style="border: 1px solid #CCCCCC">${item.name}</td>
        <td style="border: 1px solid #CCCCCC; text-align: right; width: 100px"
          >${format.currency(item.total)}</td
        >
      </tr>`;
    });
    email += `
  </table>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 16px"
  >
    Alternative payment options
  </div>
  <div style="margin-bottom: 10px;">
    Balance payment collected by Australia 4 Wheel Drive Rentals can be paid via
    internet banking instead of credit card. Details will be supplied upon
    request.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px; page-break-before: always"
  >
    Terms & Conditions
  </div>
  <div style="margin-bottom: 10px; font-size: 10px">
    For your convenience please find links to the summary of the full terms and
    conditions and the supplier counter agreement for the rental of this
    vehicle. You will also find links to the user agreement and agent terms and
    conditions. Please ensure that you read and understand the terms and
    conditions found at the following links:
  </div>`;
    if (info.terms.confirmation.text !== "<p></p>" || info.terms.confirmation.pdf) {
      email += `
    &bull; 
        <a
          href="https://www.australia4wdrentals.com/terms/${info.terms.id}/confirmation"
          style="color: #1d4ed8; font-size: 12px">Booking Confirmation Terms</a
        >
      <br>`;
    }
    if (info.terms.summary.text !== "<p></p>" || info.terms.summary.pdf) {
      email += `
      &bull; 
        <a
          href="https://www.australia4wdrentals.com/terms/${info.terms.id}/summary"
          style="color: #1d4ed8; font-size: 12px">Summary of Terms</a
        >
      <br>`;
    }
    if (info.terms.counter.text !== "<p></p>" || info.terms.counter.pdf) {
      email += `
      &bull; 
        <a
          href="https://www.australia4wdrentals.com/terms/${info.terms.id}/counter"
          style="color: #1d4ed8; font-size: 12px">Counter Agreement</a
        >
      <br>`;
    }
    email += `
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px"
  >
    Domestic Rates
  </div>
  <div style="margin-bottom: 10px; font-size: 10px">
    This rate is for Australian and New Zealand residents only. The hirer must
    be able to produce their Australian or New Zealand drivers licence upon
    vehicle collection. Should the hirer not be able to do so on the day of pick
    up, the hirer will be refused the rental at the rate nominated. The hirer
    will be charged the difference between the Domestic rate and the Standard
    rate.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px"
  >
    The agent - Australia 4 Wheel Drive Rentals
  </div>
  <div style="margin-bottom: 10px; font-size: 10px">
    From here onwards Australia 4 Wheel Drive Rentals and it's associated group
    of companies shall henceforth be referred to as the 'Agent', 'we' or 'our'.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px"
  >
    Agent security deposit
  </div>
  <div style="margin-bottom: 10px; font-size: 10px">
    Security deposits taken by the Agent are to help ensure that your
    reservations are secure and in order. The security deposit is
    non-refundable. In the event of a cancellation the security deposit, may be
    used towards a future booking (given at the discretion of the Agent). In the
    event of a cancellation the security deposit will be held for a further 6
    months from date of cancellation to be used towards a future security
    deposit for bookings made through the Agent and only with the same supplier.
    This clause is subject to the sole discretion of the management of the
    Agent. Total Agent's Security Booking Deposit of $${format.currency(summary.totalCommission)} is fully included
    in the final payment.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px"
  >
    Agent credit card surcharge
  </div>
  <div style="margin-bottom: 10px; font-size: 10px">
    A 2.0% surcharge for all VISA / Mastercard credit card transactions paid
    towards the booking will apply. Please note that these credit card fees do
    not overlap with the supplier surcharge. Please note when choosing a
    Standard rate you will be paying extra credit card fees to the supplier for
    any administration surcharges and / or if you choose to take up any excess
    plan upon pickup. The Agent does NOT accept American Express or Diners
    credit cards.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px"
  >
    Calculation errors
  </div>
  <div style="margin-bottom: 10px; font-size: 10px">
    We rely heavily on accurate information provided to us by our suppliers and
    we endeavour to ensure that all our prices are up to date. However we cannot
    be held liable for any errors in price calculation. In the event of an
    erroneous quotation or invoice, we will re-issue another quotation
    superseding the original quote or invoice with the necessary corrections in
    pricing.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px"
  >
    Suppliers Responsibility
  </div>
  <div style="margin-bottom: 10px; font-size: 10px">
    We are a booking service for the Suppliers. You will be required to complete
    a rental agreement directly with the relevant Supplier on collection of the
    rented vehicle. Your rental is subject to the terms and conditions of the
    respective Supplier with whom the rental agreement is made. Each Supplier is
    responsible for notifying inventory levels to the Agent. We do not accept
    any liability for unavailability of vehicles caused by the Supplier
    over-selling its own vehicle inventory or vehicle movement disruption.
  </div>
  <div
    style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 12px"
  >
    Disclaimer
  </div>
  <ul style="margin-bottom: 30px; font-size: 10px">
    <li style="margin-bottom: 10px;">
      These details are indicative of the vehicle that will be supplied under
      your booking. Actual vehicles may vary according to year of manufacture
      and availability but your vehicle will be suitable for the required number
      of persons and have equivalent or better specifications to those listed in
      this website.
    </li>
    <li style="margin-bottom: 10px;">
      We will NOT accept responsibility for any/the loss or damage or injury
      caused to any passenger. We will not be held responsible for any changes
      to any or all of the above services provided by the operator. We STRONGLY
      recommends you take out adequate travel insurance including cancellation
      insurance for your holiday.
    </li>
    <li style="margin-bottom: 10px;">
      Unless we hear from you that you can't access this information before your
      booking of the vehicle it will be generally understood and accepted by all
      parties that you have successfully accessed all links then read and
      understood our terms and conditions and those of the supplier.
    </li>
    <li style="margin-bottom: 10px;">
      This electronic message and any attachments are supplied in good faith and
      is believed to be free of viruses or related problems. The contents of the
      message and any advice contained (this quote will be voided if
      intentionally misused or distributed) therein are supplied on the basis
      that the recipient understands that they should seek their own expert
      opinions. We accept no responsibility for the damage or loss (arising from
      negligence or otherwise) which may occur through the use of the contents
      or from transmission of this message and attachments. The contents of this
      electronic message and any attachments are intended only for the addressee
      and may contain privileged or confidential information. If you are not the
      addressee, you are notified that any transmission, distribution,
      downloading, printing or photocopying of the contents of this message or
      attachments is strictly prohibited. The privilege of confidentiality
      attached to this message and attachments is not waived, lost or destroyed
      by reason of mistaken delivery to you. If you are not the addressee, you
      are notified that any transmission, distribution, downloading, printing or
      photocopying of the contents of this message or attachments is strictly
      prohibited. The privilege of confidentiality attached to this message and
      attachments is not waived, lost or destroyed.
    </li>
  </ul>
  <div
    style="background-color: #dbeafe;padding: 50px; margin-bottom: 30px; text-align: center;"
    class="no-print"
  >
    <div style="font-size: 12px">THANK YOU FOR CHOOSING</div>
    <div style="font-weight: bold; font-size: 16px">
      <a href="https://www.australia4wdrentals.com" style="color: #1d4ed8">
        AUSTRALIA 4WD RENTALS
      </a>
    </div>
  </div>
  <div
    style="padding-bottom: 30px; text-align: center;"
  >
    <a href="https://www.australia4wdrentals.com/conditions-australia-4-wheel-drive-rentals" style="color: #1d4ed8">
      Terms & Conditions of Australia 4 Wheel Drive Rentals
    </a>
  </div>
</div>
</body>
</html>`;
    return email;
  },
};
