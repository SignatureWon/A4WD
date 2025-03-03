import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { supabase } from "$lib/supabaseClient";
import { format } from "$lib/format.js";
import { env } from "$env/dynamic/public";
import CryptoJS from "crypto-js";
import { q } from "$lib/quote.js";
import { theme } from "$lib/theme.js";
import * as html2pdf from "html2pdf.js";
// import axios from "axios";

async function getBase64(imageUrl) {
  const res = await fetch(imageUrl);
  const result = await res.arrayBuffer();
  const b64 = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(result)))}`;
  return b64;
}
// console.log(getBase64("http://approvaltests.com/images/logo.png"));

// getBase64("http://approvaltests.com/images/logo.png");
export const html = {
  create: async (quote_id) => {
    console.log(quote_id);
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

    // let img = await getBase64(quote.details.vehicle.image);
    // console.log(img);

    let email = `
    <table>
      <tr>
        <td>${letterhead.name}<td>
      </tr>
    </table>
    <table lang="en" bgcolor="#EEEEEE" cellpadding="16" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td align="center">
          <table class="container" bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" role="presentation" width="600">
            <tr>
              <td align="left">
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="276">
            <div style="font-weight: bold">
                ${letterhead.name}
            </div>
            <div style="font-size: 10px; color: #999999">
                ${letterhead.description}
            </div>
            <div>
                ${letterhead.content.replace(/(?:\r\n|\r|\n)/g, "<br>")}
            </div>
          </td>
          <td class="col" width="276" align="right" style="font-size: 20px; font-weight: bold; line-height: 25px">FINAL<br>TICKET</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="184" style="padding: 10px; border-top: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Ticket No.</div>
            <div><b>FT${388000 + quote.id}</b></div>
          </td>
          <td class="col" width="184" style="padding: 10px; border-top: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Ticket Date</div>
            <div><b>${quote.date_balance ? dayjs(quote.date_balance).format("DD MMM YYYY") : "&mdash;"}</b></div>
          </td>
          <td class="col" width="184" style="padding: 10px; border-top: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Duration</div>
            <div><b>${quote.details.duration} days</b></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Pick-up from</div>
            <div><b>${quote.details.pickup.name}</b></div>
            <div>${dayjs(quote.details.date_start).format("ddd, DD MMM YYYY")}${
      supplier.all_day ? " (24hrs)" : `, ${supplier.start_time ? q.showtime(supplier.start_time) : "09:00AM"}`
    }</div>
            <br>
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Depot</div>
            <div>${pickup.Address.replace(/(?:\r\n|\r|\n)/g, "<br>")}</div>
            ${pickup["Contact (Australia)"] ? `<div>Australia: ${pickup["Contact (Australia)"]}</div>` : ""}
            ${pickup["Contact (International)"] ? `<div>International: ${pickup["Contact (International)"]}</div>` : ""}
          </td>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Drop-off to</div>
            <div><b>${quote.details.dropoff.name}</b></div>
            <div>${dayjs(quote.details.date_end).format("ddd, DD MMM YYYY")}${
      supplier.all_day ? " (24hrs)" : `, ${supplier.end_time ? q.showtime(supplier.end_time) : "03:00PM"}`
    }</div>
            <br>
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Depot</div>
            <div>${dropoff.Address.replace(/(?:\r\n|\r|\n)/g, "<br>")}</div>
            ${dropoff["Contact (Australia)"] ? `<div>Australia: ${dropoff["Contact (Australia)"]}</div>` : ""}
            ${
              dropoff["Contact (International)"]
                ? `<div>International: ${dropoff["Contact (International)"]}</div>`
                : ""
            }
          </td>
        </tr>
        <tr>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Supplier</div>
            <div><b>${supplier.name}</b></div>
            ${supplier.url ? `<div><a href="${supplier.url}">Self Check-in</a></div>` : ""}
            ${supplier.phone ? `<div>Customer Service: ${supplier.phone}</div>` : ""}
          </td>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">${
              quote.details.supplier.name
            } Confirmation Code</div>
            <div><b>${quote.supplier_reference || "&mdash;"}</b></div>
          </td>
        </tr>
        <tr>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Customer</div>
            <div><b><span style="text-transform:uppercase">${
              quote.users.first_name || ""
            }</span> <span style="text-transform:capitalize">${quote.users.last_name || ""}</span></b></div>
            <div>${quote.users.email}</div>
            <div>${quote.users.phone || ""}</div>
            <br>
            <div>${(quote.users.address_1 || "").trim() !== "" ? `${(quote.users.address_1 || "").trim()},` : ""}</div>
            <div>${(quote.users.address_2 || "").trim() !== "" ? `${(quote.users.address_2 || "").trim()},` : ""}</div>
            <div>
                ${(quote.users.postcode || "").trim() !== "" ? `${(quote.users.postcode || "").trim()}` : ""}
                ${(quote.users.city || "").trim() !== "" ? `${(quote.users.city || "").trim()},` : ""}
            </div>
            <div>
                ${(quote.users.state || "").trim() !== "" ? `${(quote.users.state || "").trim()},` : ""}
                ${(quote.users.country || "").trim() !== "" ? `${(quote.users.country || "").trim()},` : ""}
            </div>
          </td>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Vehicle</div>
            <div><b>${quote.details.vehicle.name}</b></div>
            <div><a href="https://www.australia4wdrentals.com/vehicles/${
              quote.details.vehicle.slug
            }">View vehicle specs</a></div>
            <br>`;
    // email += `<div><img src="${img}" alt="${quote.details.vehicle.name}" width="200"></div>`;
    email += `</td>
        </tr>
        <tr>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Passenger</div>
            <div><b>Adult: ${quote.details.passenger.adult}</b></div>
            <div><b>Children: ${quote.details.passenger.children}</b></div>
          </td>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Driver</div>
            <div><b>Age: ${quote.details.driver.age}</b></div>
            <div><b>License: ${quote.details.driver.license}</b></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
                <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Comment</div>
                <div><b>${quote.comment || "No comment"}</b></div>
            </td>
        </tr>
      </table>
    </td>
  </tr>
  </table>`;
    if (terms.pay_counter) {
      email += `
  <br>
  <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
    <tr>
      <td style="padding: 0 24px;">
        <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
              <td class="col" width="100%">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="414" style="padding-top: 15px;">
            <p style="font-size: 16px; padding-bottom: 10px"><b>Summary</b></p>
          </td>
          <td class="col" width="138" align="right" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Total (AUD)</div>
          </td>
        </tr>`;
      summary.summaryItems.forEach((item) => {
        email += `
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${item.name}</div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${format.currency(item.total)}</div>
          </td>
        </tr>`;
      });
      email += `
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <div><b>Total</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <div><b>${format.currency(summary.totalSummary)}</b></div>
          </td>
        </tr>
      </table>
              </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
    }
    email += `
  <br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="414" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Payable to Agent</div>
          </td>
          <td class="col" width="138" align="right" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Total (AUD)</div>
          </td>
        </tr>`;
    summary.agentItems.forEach((item) => {
      email += `
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${item.name}</div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${format.currency(item.total)}</div>
          </td>
        </tr>`;
    });
    email += `
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <div><b>Total payable to agent</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <div><b>${format.currency(summary.totalAgent)}</b></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="414" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Payable to Supplier</div>
          </td>
          <td class="col" width="138" align="right" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Total (AUD)</div>
          </td>
        </tr>`;
    summary.supplierItems.forEach((item) => {
      email += `
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${item.name}</div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${format.currency(item.total)}</div>
          </td>
        </tr>`;
    });
    email += `
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <div><b>Total payable to supplier</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <div><b>${format.currency(summary.totalSupplier)}</b></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand500
          }; color: #FFFFFF">
            <div><b>Total amount</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand500
          }; color: #FFFFFF">
            <div><b>${format.currency(summary.totalAgent + summary.totalSupplier)}</b></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%">
                <p style="font-size: 16px; padding-bottom: 10px"><b>Original Payment Schedule</b></p>
                <p>
                    Payments are to be made (by credit card or Internet transfer) according to the schedule below. Unless advised otherwise, your credit card (supplied to us at the time of booking) will be charged accordingly. Kindly refer to the Payments Summary found on your provisional or e-ticket issued to you for more details.
                </p>
            </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%">
                <p style="font-size: 16px; padding-bottom: 10px"><b>Pay At Pick-Up</b></p>
                <p style="padding-bottom: 10px">
                    Any optional or extra items are to be paid directly to ${
                      supplier.name
                    } at the time of pick-up. Please refer to your e-Ticket for more details.
                </p>
                <p style="padding-bottom: 10px">
                    Please ensure that you have sufficient funds in your credit card to pay the bond. Information on applicable bond charges can be found in this document.
                </p>
                <p>
                    Please ensure that you pick-up and drop-off your rental vehicle during depot business hours to avoid any inconvenience or extra charges. Depot addresses and booking times can be found in this document.
                </p>
            </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="414" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Description</div>
          </td>
          <td class="col" width="138" align="right" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Total (AUD)</div>
          </td>
        </tr>`;
    summary.pickupItems.forEach((item) => {
      email += `
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${item.name}</div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div>${format.currency(item.total)}</div>
          </td>
        </tr>`;
    });
    email += `
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="414" style="padding-top: 15px;">
            <div style="font-size: 16px"><b>New Updated Payment Schedule</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Total (AUD)</div>
          </td>
        </tr>
      </table>
      <br>`;
    //   <table cellpadding="0" cellspacing="0" role="presentation" width="100%">`;
    // (quote.payments || []).forEach((item) => {
    //   email += `
    //     <tr>
    //       <td class="col" width="138" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
    //         c.brand100
    //       }">
    //         <div>${dayjs(item.date, "DD/MM/YYYY").format("DD MMM YYYY")}</div>
    //       </td>
    //       <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
    //         c.brand100
    //       }">
    //         <div>${item.method}</div>
    //         <div style="color:#999999">${item.remark || ""}</div>
    //       </td>
    //       <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
    //         c.brand100
    //       }">
    //         <div>${format.currency(item.amount)}</div>
    //       </td>
    //     </tr>`;
    // });
    // email += `
    //   </table>
    email += `
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <b>Total Outstanding</b>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${
            c.brand100
          }">
            <b>${format.currency(totalOutstanding())}</b>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%">
                <b>Cancellation fees</b> will apply on <b>AUD $${format.currency(summary.totalAgent)}</b>. 
                The <b>Agent Nett Deposit Fee after discount of AUD $${format.currency(
                  summary.totalCommission
                )} is non-refundable</b>. 
                The Agent Deposit will be carried forward towards a future booking if cancellation is made more than 25 days prior to travel. 
                An additional AUD $100.00 administration cancellation fee applies. Please read the cancellation policy found in the quote.
            </td>
        </tr>
      </table>
    </td>
  </tr>
  </table>`;
    if (vehicle.specs !== "<p></p>" && vehicle.specs) {
      email += `
  <br>
  <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
    <tr>
      <td style="padding: 0 24px;">
        <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
              <td class="col" width="100%">
                  <p style="font-size: 16px; padding-bottom: 10px"><b>Specifications</b></p>
                  ${vehicle.specs.replaceAll("<li><p>", "<li><p>&bull; ")}
              </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
    }
    email += `
  <br>
  <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%" style="background-color: #F6F6F6; padding: 15px">
                <p style="font-weight: bold; font-size: 11px">
                    Terms & Conditions
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    For your convenience please find links to the summary of the full terms and
                    conditions and the supplier counter agreement for the rental of this
                    vehicle. You will also find links to the user agreement and agent terms and
                    conditions. Please ensure that you read and understand the terms and
                    conditions found at the following links:
                </p>`;
    if (terms.id) {
      if (terms.confirmation_terms !== "<p></p>" || terms.confirmation) {
        email += `
        <p>&bull; 
          <a
            href="https://www.australia4wdrentals.com/terms/${terms.id}/confirmation"
            style="color: ${c.brand500}; font-size: 11px">Booking Confirmation Terms</a
          >
        </p>`;
      }
      if (terms.summary_terms !== "<p></p>" || terms.summary) {
        email += `
        <p>&bull; 
          <a
            href="https://www.australia4wdrentals.com/terms/${terms.id}/summary"
            style="color: ${c.brand500}; font-size: 11px">Summary of Terms</a
          >
        </p>`;
      }
      if (terms.counter_terms !== "<p></p>" || terms.counter) {
        email += `
        <p>&bull; 
          <a
            href="https://www.australia4wdrentals.com/terms/${terms.id}/counter"
            style="color: ${c.brand500}; font-size: 11px">Counter Agreement</a
          >
        </p>`;
      }
    }
    email += `
            </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%" align="center" style="background-color: #e9f7e8; padding: 15px">
                <p>Thank you for choosing</p>
                <p>
                    <b><a href="https://www.australia4wdrentals.com" style="color: ${c.brand500}">
                        AUSTRALIA 4WD RENTALS
                    </a></b>
                </p>
            </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%" align="center" style="font-size: 11px">
                <p>
                    <a href="https://www.australia4wdrentals.com/conditions-australia-4-wheel-drive-rentals" style="color: ${c.brand500}">
                        Terms & Conditions of Australia 4 Wheel Drive Rentals
                    </a>
                </p>
            </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
`;
    return email;
  },
};
