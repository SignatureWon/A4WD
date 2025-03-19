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
    const { data: color } = await supabase.from("constants").select("name").eq("type", "color").single();

    const c = theme.brandcolor(color.name);

    const { data: letterhead } = await supabase
      .from("contents")
      .select("content, description, name")
      .eq("type", "template_letterhead")
      .single();
    const { data: quote } = await supabase.from("quotes").select("*, users (*)").eq("id", quote_id).single();
    const { data: supplier } = await supabase.from("suppliers").select().eq("id", quote.details.supplier.id).single();

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
      let total = summary.totalAgent;
      let payments = quote.payments || [];
      payments.forEach((obj) => {
        total -= obj.amount;
      });
      return total;
    };

    let email = `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>Acorn Email Framework</title>
    <!--[if mso]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <style>
      table {border-collapse: collapse;}
      .spacer,.divider {mso-line-height-rule: exactly;}
      td,th,div,p,a {font-size: 13px; line-height: 18px;}
      td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
    </style>
    <![endif]-->

    <style type="text/css">

      @import url('https://fonts.googleapis.com/css?family=Merriweather|DM+Sans');

      img {border: 0; line-height: 100%; vertical-align: middle;}
      .col {font-size: 13px; line-height: 18px; vertical-align: top;}

      @media screen {
        .col, td, th, div, p {font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        .sans-serif {font-family: 'DM Sans', Arial, sans-serif;}
        .serif {font-family: 'Merriweather', Georgia, serif;}
        img {max-width: 100%;}
      }

      @media (max-width: 632px) {
        .container {width: 100%!important;}
      }

      @media (max-width: 480px) {
        .col {
          display: inline-block!important;
          line-height: 18px;
          width: 100%!important;
        }

        .col-sm-1 {max-width: 25%;}
        .col-sm-2 {max-width: 50%;}
        .col-sm-3 {max-width: 75%;}
        .col-sm-third {max-width: 33.33333%;}

        .col-sm-push-1 {margin-left: 25%;}
        .col-sm-push-2 {margin-left: 50%;}
        .col-sm-push-3 {margin-left: 75%;}
        .col-sm-push-third {margin-left: 33.33333%;}

        .full-width-sm {display: table!important; width: 100%!important;}
        .stack-sm-first {display: table-header-group!important;}
        .stack-sm-last {display: table-footer-group!important;}
        .stack-sm-top {display: table-caption!important; max-width: 100%; padding-left: 0!important;}

        .toggle-content {
          max-height: 0;
          overflow: auto;
          transition: max-height .4s linear;
          -webkit-transition: max-height .4s linear;
        }
        .toggle-trigger:hover + .toggle-content,
        .toggle-content:hover {max-height: 999px!important;}

        .show-sm {
          display: inherit!important;
          font-size: inherit!important;
          line-height: inherit!important;
          max-height: none!important;
        }
        .hide-sm {display: none!important;}

        .align-sm-center {
          display: table!important;
          float: none;
          margin-left: auto!important;
          margin-right: auto!important;
        }
        .align-sm-left {float: left;}
        .align-sm-right {float: right;}

        .text-sm-center {text-align: center!important;}
        .text-sm-left {text-align: left!important;}
        .text-sm-right {text-align: right!important;}

        .borderless-sm {border: none!important;}
        .nav-sm-vertical .nav-item {display: block;}
        .nav-sm-vertical .nav-item a {display: inline-block; padding: 4px 0!important;}

        .spacer {height: 0;}

        .p-sm-0 {padding: 0!important;}
        .p-sm-8 {padding: 8px!important;}
        .p-sm-16 {padding: 16px!important;}
        .p-sm-24 {padding: 24px!important;}
        .pt-sm-0 {padding-top: 0!important;}
        .pt-sm-8 {padding-top: 8px!important;}
        .pt-sm-16 {padding-top: 16px!important;}
        .pt-sm-24 {padding-top: 24px!important;}
        .pr-sm-0 {padding-right: 0!important;}
        .pr-sm-8 {padding-right: 8px!important;}
        .pr-sm-16 {padding-right: 16px!important;}
        .pr-sm-24 {padding-right: 24px!important;}
        .pb-sm-0 {padding-bottom: 0!important;}
        .pb-sm-8 {padding-bottom: 8px!important;}
        .pb-sm-16 {padding-bottom: 16px!important;}
        .pb-sm-24 {padding-bottom: 24px!important;}
        .pl-sm-0 {padding-left: 0!important;}
        .pl-sm-8 {padding-left: 8px!important;}
        .pl-sm-16 {padding-left: 16px!important;}
        .pl-sm-24 {padding-left: 24px!important;}
        .px-sm-0 {padding-right: 0!important; padding-left: 0!important;}
        .px-sm-8 {padding-right: 8px!important; padding-left: 8px!important;}
        .px-sm-16 {padding-right: 16px!important; padding-left: 16px!important;}
        .px-sm-24 {padding-right: 24px!important; padding-left: 24px!important;}
        .py-sm-0 {padding-top: 0!important; padding-bottom: 0!important;}
        .py-sm-8 {padding-top: 8px!important; padding-bottom: 8px!important;}
        .py-sm-16 {padding-top: 16px!important; padding-bottom: 16px!important;}
        .py-sm-24 {padding-top: 24px!important; padding-bottom: 24px!important;}
      }
    </style>
  </head>
  <body style="margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">

    <div lang="en" style="display:none;"><!-- Add your preheader text here --></div>

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
          <td class="col" width="414">
            <div style="font-weight: bold">
                ${letterhead.name}
            </div>
            <div style="font-size: 10px; color: #999999">
                ${letterhead.description}
            </div>
            <div style="font-size: 11px">
                ${letterhead.content.replace(/(?:\r\n|\r|\n)/g, "<br>")}
            </div>
          </td>
          <td class="col" width="138" align="right" style="font-size: 20px; font-weight: bold; line-height: 25px">BOOKING<br>CONFIRMATION</td>
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
                <p style="font-size: 14px; padding-bottom: 10px; margin: 0"><b>CONFIRMATION PAGE</b></p>
                <p style="padding-bottom: 10px; margin: 0; font-size: 11px">
                    Please sign, scan and send via email attachment (this page only) to <b><a href="mailto:info@australia4wdrentals.com.au">info@australia4wdrentals.com.au</a></b>
                </p>
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
          <td class="col" width="138" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            Booking Reference
          </td>
          <td class="col" width="414" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            <b>B${388000 + quote.id}</b>
          </td>
        </tr>
        <tr>
          <td class="col" width="138" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            Date of Issue
          </td>
          <td class="col" width="414" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            <b>${dayjs(quote.date_balance || quote.date_provisional).format("DD MMM YYYY")}</b>
          </td>
        </tr>
        <tr>
          <td class="col" width="138" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            Vehicle
          </td>
          <td class="col" width="414" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            <b>${quote.details.vehicle.name}</b>
          </td>
        </tr>
        <tr>
          <td class="col" width="138" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            Pick-up
          </td>
          <td class="col" width="414" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            <b>${quote.details.pickup.name} - ${dayjs(quote.details.date_start).format("ddd, DD MMM YYYY")}${
      supplier.all_day ? " (24hrs)" : `, ${supplier.start_time ? q.showtime(supplier.start_time) : "09:00AM"}`
    }</b>
          </td>
        </tr>
        <tr>
          <td class="col" width="138" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            Drop-off
          </td>
          <td class="col" width="414" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            <b>${quote.details.dropoff.name} - ${dayjs(quote.details.date_end).format("ddd, DD MMM YYYY")}${
      supplier.all_day ? " (24hrs)" : `, ${supplier.end_time ? q.showtime(supplier.end_time) : "03:00PM"}`
    }</b>
          </td>
        </tr>
        <tr>
          <td class="col" width="138" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            ${quote.details.supplier.name} Confirmation Code
          </td>
          <td class="col" width="414" style="padding: 5px; font-size: 11px; border-bottom: 1px solid #DDDDDD">
            <b>${quote.supplier_reference}</b>
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
                <p style="font-size: 14px; padding-bottom: 10px; margin: 0"><b>Payment Schedule</b></p>
                <p style="padding-bottom: 10px; margin: 0; font-size: 11px">
                    Payments are to be made (by credit card or Internet transfer) according to the schedule below. Unless advised otherwise, your credit card (supplied to us at the time of booking) will be charged accordingly. Kindly refer to the Payments Summary found on your provisional or final e-ticket issued to you for more details.
                </p>
                <p style="padding-bottom: 10px; margin: 0; font-size: 11px">
                    Any optional or extra items are to be paid directly to the supplier at the time of pick-up. Please refer to your e-Ticket for more details.
                </p>
            <div width="100%">
                <p style="font-weight: bold; font-size: 11px; margin: 0">
                    Terms & Conditions
                </p>
                <p style="font-size: 11px; padding-bottom: 10px; margin: 0">
                    For your convenience please find links to the summary of the full terms and
                    conditions and the supplier counter agreement for the rental of this
                    vehicle. You will also find links to the user agreement and agent terms and
                    conditions. Please ensure that you read and understand the terms and
                    conditions found at the following links:
                </p>`;
    if (terms.confirmation_terms !== "<p></p>" || terms.confirmation) {
      email += `
      <p style="font-size: 11px; padding-bottom: 10px; margin: 0">&bull; 
        <a
          href="https://www.australia4wdrentals.com/terms/${terms.id}/confirmation"
          style="color: ${c.brand500}; font-size: 11px">Booking Confirmation Terms</a
        >
      </p>`;
    }
    if (terms.summary_terms !== "<p></p>" || terms.summary) {
      email += `
      <p style="font-size: 11px; padding-bottom: 10px; margin: 0">&bull; 
        <a
          href="https://www.australia4wdrentals.com/terms/${terms.id}/summary"
          style="color: ${c.brand500}; font-size: 11px">Supplier's Summary of Terms</a
        >
      </p>`;
    }
    if (terms.counter_terms !== "<p></p>" || terms.counter) {
      email += `
      <p style="font-size: 11px; padding-bottom: 10px; margin: 0">&bull; 
        <a
          href="https://www.australia4wdrentals.com/terms/${terms.id}/counter"
          style="color: ${c.brand500}; font-size: 11px">Supplier's Counter Agreement</a
        >
      </p>`;
    }
    email += `
            </div>
                <p style="padding-bottom: 10px; margin: 0; font-size: 11px">
                    Please ensure that you pick-up and drop-off your rental vehicle during depot business hours to avoid any inconvenience or extra charges. Depot addresses and booking times can be found in this document.
                </p>
                <p style="padding-bottom: 10px; margin: 0; font-size: 11px">
                    <b>Cancellation fees</b> will apply on <b>AUD $${format.currency(summary.totalAgent)}</b>. 
                    The <b>Agent Nett Deposit Fee after discount of AUD $${format.currency(
                      summary.totalCommission
                    )} is non-refundable</b>. 
                    The Agent Deposit will be carried forward towards a future booking if cancellation is made more than 25 days prior to travel. 
                    An additional AUD $100.00 administration cancellation fee applies. Please read the cancellation policy found in the quote.
                </p>
                <p style="font-style: italic; margin: 0; font-size: 11px">
                    I acknowledge that I have read, verified and understood the terms and conditions associated with this vehicle rental, and have authorised Australia 4 Wheel Drive Rentals to debit my credit card for the amounts nominated above.
                </p>
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
          <td class="col" width="138">
            <div style="border-bottom: 1px solid #DDDDDD">
                <br>
                <br>
            </div>
          </td>
          <td class="col" width="414">&nbsp;</td>
        </tr>
        <tr>
          <td class="col" width="138">
            <div style="padding-top: 5px; font-size: 11px; ">
                Signature:
                <b>
                    <span style="text-transform:uppercase">${quote.users.first_name}</span>
                    <span style="text-transform:capitalize">${quote.users.last_name}</span>
                </b>
            </div>
          </td>
          <td class="col" width="414">&nbsp;</td>
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
            <td class="col" width="100%">
                <p style="padding-bottom: 10px; margin: 0; font-size: 11px">
                    Please sign, scan and send via email attachment (this page only) to <b><a href="mailto:info@australia4wdrentals.com.au">info@australia4wdrentals.com.au</a></b>
                </p>
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
            <td class="col" width="100%">
                <p style="margin: 0; font-size: 11px;">Thank you for choosing <a href="https://www.australia4wdrentals.com">Australia 4WD Rentals</a></p>
                <p style="margin: 0; font-size: 11px;">
                    <a href="https://www.australia4wdrentals.com/conditions-australia-4-wheel-drive-rentals">
                        Terms & Conditions of Australia 4 Wheel Drive Rentals
                    </a>
                </p>
            </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
    return email;
  },
};
