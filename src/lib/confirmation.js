import dayjs from "dayjs";
import { supabase } from "$lib/supabaseClient";
import { format } from "$lib/format.js";

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

    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("name, slug, image")
      .eq("id", quote.details.vehicle.id)
      .single();

    const duration = quote.details.duration;
    const date_quote = dayjs(quote.created_at).format("DD MMM YYYY");
    const date_start = dayjs(quote.details.date_start).format("ddd, DD MMM YYYY");
    const date_end = dayjs(quote.details.date_end).format("ddd, DD MMM YYYY");
    let agentFees = [];
    let supplierFees = [];
    let pickupFees = [];

    const totalAgentFee = () => {
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.total;
      });
      return sum;
    };
    const totalAgentCommission = () => {
      // console.log(agentFees);
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.profit;
      });

      sum += quote.add_discount;
      return sum;
    };
    const totalSupplierFee = () => {
      let sum = 0;
      supplierFees.forEach((fee) => {
        sum += fee.total;
      });
      return sum;
    };

    const getDailyRates = () => {
      let obj = quote.details.daily;
      let type = quote.details.rates_type;
      let arr = obj.items;
      if (type === "flex") {
        let week = 1;
        let day = 0;
        arr.forEach((o, i) => {
          if (i !== 0 && i % 7 === 0) {
            agentFees.push({
              name: `Daily basic rental: Week ${week}: Flex[${arr[i - 1].flex}]: $${format.currency(
                arr[i - 1].gross
              )} x ${day} days`,
              total: arr[i - 1].gross * day,
              nett: arr[i - 1].nett * day,
              profit: arr[i - 1].profit * day,
            });
            day = 1;
            week++;
          } else {
            day++;
          }
          if (i === arr.length - 1) {
            agentFees.push({
              name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
              total: o.gross * day,
              nett: o.nett * day,
              profit: o.profit * day,
            });
          }
        });
      } else {
        agentFees.push({
          name: `Daily basic rental: $${format.currency(obj.gross / arr.length)} x ${arr.length} days`,
          total: obj.gross,
          nett: obj.nett,
          profit: obj.profit,
        });
      }
    };
    const getDiscount = () => {
      if (quote.add_discount > 0) {
        agentFees.push({
          name: `Discount: ${quote.add_discount_remark}`,
          total: -quote.add_discount,
          nett: 0,
          profit: 0,
        });
      }
    };

    const getBonds = () => {
      const bond = Object.keys(quote.details.bonds).length ? quote.details.bonds : quote.details.bond;
      pickupFees.push({
        name: `Bond: $${format.currency(
          bond.bond,
          0
        )} is taken from the hirer's credit or debit card <div style="font-size: 14px; color: #999999">Refundable as per supplier's Summary of Terms<div>`,
        total: bond.bond,
        nett: 0,
        profit: 0,
      });

      let gross = 0;
      let nett = 0;
      let profit = 0;

      if ("gross" in bond) {
        gross = bond.gross * duration;
        nett = bond.nett * duration;
        profit = nett > 0 ? gross - nett : 0;
      } else {
        bond.gross = 0;
        bond.nett = 0;
        bond.bond = 0;
      }

      if (bond.gross > 0) {
        const row = {
          name: `${bond.display_name}: $${bond.gross} x ${duration} days`,
          total: gross,
          nett: nett,
          profit: profit,
        };
        if (bond.nett > 0 && bond.gross > bond.nett) {
          agentFees.push(row);
        } else {
          supplierFees.push(row);
          pickupFees.push(row);
        }
      }
    };

    const getOneways = () => {
      let one_way = quote.details.one_way;
      if (one_way > 0) {
        supplierFees.push({
          name: `One-way fee`,
          total: one_way,
          nett: 0,
          profit: 0,
        });
        pickupFees.push({
          name: `One-way fee`,
          total: one_way,
          nett: 0,
          profit: 0,
        });
      }
    };
    const getAddons = () => {
      let addons = quote.details.addons;
      for (const key in addons) {
        const addon = addons[key];
        let gross = addon.gross_rate;
        if (addon.daily) {
          gross = gross * duration;
        }
        if (addon.gross_cap > 0) {
          if (gross > addon.gross_cap) {
            gross = addon.gross_cap;
          }
        }
        let nett = addon.nett_rate;
        if (addon.daily) {
          nett = nett * duration;
        }
        if (addon.nett_cap > 0) {
          if (nett > addon.nett_cap) {
            nett = addon.nett_cap;
          }
        }
        const row = {
          name: `Add-on: ${addon.name} ${addon.daily ? `$${addon.gross_rate} x ${duration} days` : ""}`,
          total: gross,
          nett: nett,
          profit: nett > 0 ? gross - nett : 0,
        };
        if (addon.gross_rate > addon.nett_rate) {
          agentFees.push(row);
        } else {
          supplierFees.push(row);
          pickupFees.push(row);
        }
      }
    };

    const getSpecials = () => {
      let special = quote.details.specials;
      if (special.total > 0) {
        special.items.forEach((item) => {
          if (item.discount_amount > 0) {
            agentFees.push({
              name: item.name,
              total: -item.discount_amount,
              nett: 0,
              profit: 0,
            });
          }
        });
      }
    };
    const getFees = () => {
      let fee = quote.details.fees;
      if (fee.total > 0) {
        fee.items.forEach((item) => {
          supplierFees.push({
            name: item.name,
            total: item.fee,
            nett: 0,
            profit: 0,
          });
          pickupFees.push({
            name: item.name,
            total: item.fee,
            nett: 0,
            profit: 0,
          });
        });
      }
    };
    const getCcs = () => {
      if (quote.cc_charge) {
        let fee = (totalAgentFee() * 2) / 100;
        if (fee > 0) {
          agentFees.push({
            name: "Credit card surcharge (2%)",
            total: fee,
            nett: 0,
            profit: 0,
          });
        }
      } else {
        agentFees.push({
          name: "Credit card surcharge (WAIVED)",
          total: 0,
          nett: 0,
          profit: 0,
        });
      }
    };

    let termsItems = [];
    const getTerms = () => {
      let total = totalAgentFee();

      if ("terms" in quote.details) {
        let terms = quote.details.terms;
        let gap = dayjs(date_start).diff(dayjs(date_quote), "day");

        if (gap <= terms.balance) {
          termsItems = [
            {
              name: `Full payment to agent on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
              total: total,
            },
          ];
        } else {
          termsItems = [
            {
              name: `Booking deposit to agent now (${
                terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
              }) on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
              total: terms.percentage ? (total * terms.deposit) / 100 : terms.deposit,
            },
          ];
          if (terms.payment2) {
            if (terms.balance2 < gap) {
              termsItems.push({
                name: `First payment to agent (${
                  terms.percentage2 ? `${terms.deposit2}%` : `$${terms.deposit2}`
                }) on ${dayjs(date_start).subtract(terms.balance2, "day").format("ddd, DD MMM YYYY")} (${
                  terms.balance2
                } days before
                travel)`,
                total: terms.percentage2 ? (total * terms.deposit2) / 100 : terms.deposit2,
              });
            }
          }
          if (terms.payment3) {
            if (terms.balance3 < gap) {
              termsItems.push({
                name: `Second payment (${terms.percentage3 ? `${terms.deposit3}%` : `$${terms.deposit3}`}) on ${dayjs(
                  date_start
                )
                  .subtract(terms.balance3, "day")
                  .format("ddd, DD MMM YYYY")} (${terms.balance3} days before
                travel)`,
                total: terms.percentage3 ? (total * terms.deposit3) / 100 : terms.deposit3,
              });
            }
          }
          // balance
          if (terms.balance < gap) {
            let bal = total;
            termsItems.forEach((t) => {
              bal -= t.total;
            });

            termsItems.push({
              name:
                "Balance payment to " +
                (terms.pay_counter
                  ? `supplier at pick-up counter on ${dayjs(date_start).format("ddd, DD MMM YYYY")}`
                  : `agent on ${dayjs(date_start).subtract(terms.balance, "day").format("ddd, DD MMM YYYY")}`) +
                ` (${terms.balance} days before travel)`,
              total: bal,
            });
          }
        }
      }
    };

    // map data
    const info = {
      //   doc: {
      //     name: contents.name,
      //   },
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
        supplier_reference: quote.supplier_reference,
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
        id: quote.details.terms.id,
        confirmation: {
          text: quote.details.terms.confirmation_terms,
          pdf: quote.details.terms.confirmation,
        },
        summary: {
          text: quote.details.terms.summary_terms,
          pdf: quote.details.terms.summary,
        },
        counter: {
          text: quote.details.terms.counter_terms,
          pdf: quote.details.terms.counter,
        },
      },
      daily: getDailyRates(),
      discount: getDiscount(),
      bond: getBonds(),
      oneway: getOneways(),
      addon: getAddons(),
      special: getSpecials(),
      fee: getFees(),
      cc: getCcs(),
      term: getTerms(),
    };

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
          Booking<br>Confirmation
        </div>
      </td>
    </tr>
  </table>
  <hr />
  <div style="margin-top: 30px; font-weight: bold; font-size: 18px; text-align: center">CONFIRMATION PAGE</div>
  <div style="margin-bottom: 30px; text-align: center">
    Please sign, scan and send via email attachment (this page only) to <strong>info@australia4wdrentals.com.au</strong>
  </div>
  <table
    width="600"
    cellpadding="5"
    cellspacing="0"
    style="margin-bottom: 30px;"
  >
    <tr>
      <td width="30%" valign="top">
        Booking Reference
      </td>
      <td valign="top" style="font-weight: bold">
        Q${info.quote.id}
      </td>
    </tr>
    <tr>
      <td width="30%" valign="top">
        Date of Issue
      </td>
      <td valign="top" style="font-weight: bold">
        ${info.quote.date}
      </td>
    </tr>
    <tr>
      <td width="30%" valign="top">
        Vehicle
      </td>
      <td valign="top" style="font-weight: bold">
        ${info.vehicle.name}
      </td>
    </tr>
    <tr>
      <td width="30%" valign="top">
        Pick-up
      </td>
      <td valign="top" style="font-weight: bold">
        ${info.quote.pickup.name} - ${info.quote.pickup.date}, 09:00AM
      </td>
    </tr>
    <tr>
      <td width="30%" valign="top">
        Drop-off
      </td>
      <td valign="top" style="font-weight: bold">
        ${info.quote.dropoff.name} - ${info.quote.dropoff.date}, 03:00PM
      </td>
    </tr>
    <tr>
      <td width="30%" valign="top">
        Confirmation Code
      </td>
      <td valign="top" style="font-weight: bold">
        ${info.quote.supplier_reference}
      </td>
    </tr>
  </table>
  <div style="margin-top: 30px; margin-bottom: 10px; font-weight: bold; font-size: 16px">
    Payment Schedule
  </div>
  <div style="margin-bottom: 10px;">
    Payments are to be made (by credit card or Internet transfer) according to the schedule below. Unless advised otherwise, your credit card (supplied to us at the time of booking) will be charged accordingly. Kindly refer to the Payments Summary found on your provisional or final e-ticket issued to you for more details.
  </div>
  <div style="margin-bottom: 10px;">
    Any optional or extra items are to be paid directly to the supplier at the time of pick-up. Please refer to your e-Ticket for more details.
  </div>
  <div style="margin-bottom: 10px;">
    <strong>Important:</strong> Please read and understand the supplier’s and agent’s terms and conditions found in your quote.
  </div>
  <div style="margin-bottom: 10px;">
    Please ensure that you pick-up and drop-off your rental vehicle during depot business hours to avoid any inconvenience or extra charges.
  </div>
  <div style="margin-bottom: 10px;">
    Depot addresses and booking times can be found in this document.
  </div>
  <div style="margin-bottom: 10px;">
    <strong>Cancellation fees</strong> will apply on <strong>AUD $${format.currency(
      totalAgentFee()
    )}</strong>. The <strong>Agent Nett Deposit Fee after discount of AUD $${format.currency(
      totalAgentCommission()
    )} is non-refundable</strong>. The Agent Deposit will be carried forward towards a future booking if cancellation is made more than 25 days prior to travel. An additional AUD $100.00 administration cancellation fee applies. Please read the cancellation policy found in the quote.
  </div>
  <div style="font-style: italic;">
    I acknowledge that I have read, verified and understood the terms and conditions associated with this vehicle rental, and have authorised Australia 4 Wheel Drive Rentals to debit my credit card for the amounts nominated above.
  </div>
  <table
    width="200"
    cellpadding="5"
    cellspacing="0"
    style="margin-bottom: 30px;"
  >
    <tr>
      <td valign="top">
        <div style="border-bottom:1px solid #999999">
          <br /><br /><br /><br /><br />
        </div>
        Signature: <strong>${info.user.first_name} ${info.user.last_name}</strong>
      </td>
    </tr>
  </table>
  <div style="font-style: italic;">
    Please sign, scan and send via email attachment (this page only) to <a href="mailto:info@australia4wdrentals.com.au">info@australia4wdrentals.com.au</a>
  </div>
</div>
</body>
</html>`;
    return email;
  },
};
