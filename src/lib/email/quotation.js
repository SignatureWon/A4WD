import dayjs from "dayjs";
import { supabase } from "$lib/supabaseClient";
import { format } from "$lib/format.js";
import { env } from "$env/dynamic/public";
import CryptoJS from "crypto-js";
import { q } from "$lib/quote.js";
import { theme } from "$lib/theme.js";

export const html = {
  create: async (quote_id) => {
    const { data: color } = await supabase
      .from("constants")
      .select("name")
      .eq("type", "color")
      .single();

    const c = theme.brandcolor(color.name);

    const { data: letterhead } = await supabase
      .from("contents")
      .select("content, description, name")
      .eq("type", "template_letterhead")
      .single();
    
    let quote = quote_id

    if (Number(quote)) {
      const { data: data_quote } = await supabase.from("quotes").select("*, users (*)").eq("id", Number(quote_id)).single();
      quote = data_quote
    }
    console.log("quote", quote);
    const { data: vehicle } = await supabase.from("vehicles").select().eq("id", quote.details.vehicle.id).single();

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
    const encId = CryptoJS.AES.encrypt(quote.id.toString(), env.PUBLIC_AES_KEY).toString().replaceAll("/", "__");

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
          <td class="col" width="276" align="right" style="font-size: 20px; font-weight: bold">QUOTATION</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td class="divider" style="padding: 24px 16px;">
      <div style="background: #DDDDDD; height: 1px; line-height: 1px;">‌</div>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tr>
    <td style="padding: 0 24px;">
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
            <td class="col" width="100%">
                <p style="font-weight: bold; padding-bottom: 10px">
                    Dear ${quote.users.first_name},
                </p>
                <p style="padding-bottom: 10px">
                    Thank you for contacting <a href="www.australia4wdrentals.com"
                    style="color: ${c.brand500}">www.australia4wdrentals.com</a> 
                    one of Australia's leading officially licensed specialist agents for vehicle
                    rentals (motorhomes, campers, 4WD, 4WD campers) and guided safari tours based
                    in and operating out of Darwin, Australia.
                </p>
                <p style="font-weight: bold; padding-bottom: 10px">
                    Availability and validity of this quotation
                </p>
                <p style="padding-bottom: 10px">
                    Vehicle is subject to availability and rates are subject to change prior to
                    confirmation. We suggest you book as soon as possible to ensure you get the
                    vehicle you want at the best price.
                </p>
                <p style="padding-bottom: 10px">
                    If you have any queries please 
                    <a href="https://www.australia4wdrentals.com/contact-us">contact</a> 
                    our friendly staff. Please be advised that the prices stated in our quote are confidential.
                </p>
                <p>
                    Please note that all prices are quoted in <b>Australian Dollars (AUD)</b>.
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
          <td class="col" width="184" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Quote No.</div>
            <div><b>Q${388000 + quote.id}</b></div>
          </td>
          <td class="col" width="184" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Quote Date</div>
            <div><b>${dayjs(quote.created_at).format("DD MMM YYYY")}</b></div>
          </td>
          <td class="col" width="184" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
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
            <div>${dayjs(quote.details.date_start).format("ddd, DD MMM YYYY")}</div>
          </td>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Drop-off to</div>
            <div><b>${quote.details.dropoff.name}</b></div>
            <div>${dayjs(quote.details.date_end).format("ddd, DD MMM YYYY")}</div>
          </td>
        </tr>
        <tr>
          <td class="col" width="276" style="padding: 10px; border-bottom: 1px solid #DDDDDD">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Customer</div>
            <div><b><span style="text-transform:uppercase">${
              quote.users.first_name
            }</span> <span style="text-transform:capitalize">${quote.users.last_name}</span></b></div>
            <div>${quote.users.email}</div>
            <div>${quote.users.phone}</div>
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
            <br>
            <div><img src="${quote.details.vehicle.image}" alt="${quote.details.vehicle.name}" width="200"></div>
          </td>
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
  </table>`
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
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand100}">
            <div><b>Total</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand100}">
            <div><b>${format.currency(summary.totalSummary)}</b></div>
          </td>
        </tr>
      </table>
              </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
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
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand100}">
            <div><b>Total payable to agent</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand100}">
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
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand100}">
            <div><b>Total payable to supplier</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand100}">
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
          <td class="col" width="414" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand500}; color: #FFFFFF">
            <div><b>Total amount</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding: 10px; border-bottom: 1px solid #DDDDDD; background-color: ${c.brand500}; color: #FFFFFF">
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
            <td class="col" width="100%" style="background-color: ${c.brand100}; padding: 15px">
                <p><a href="https://www.australia4wdrentals.com" style="color: ${c.brand500}">www.australia4wdrentals.com</a> is protected by a 256-bit ssl for complete peace of mind when booking online.</p>
                <br>
                <table cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <th bgcolor="${c.brand500}" style="border-radius: 3px; mso-padding-alt: 6px 42px 12px;">
                            <a href="https://australia4wdrentals.com/booking/${encId}" style="color: #FFFFFF; display: inline-block; font-size: 13px; line-height: 100%; padding: 12px 42px; text-decoration: none;">Book Now</a>
                        </th>
                    </tr>
                </table>
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
            <div style="font-size: 16px"><b>Payment Details & Schedule</b></div>
          </td>
          <td class="col" width="138" align="right" style="padding-top: 15px;">
            <div style="font-size: 9px; line-height: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Total (AUD)</div>
          </td>
        </tr>`;
    summary.termsItems.forEach((item) => {
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
            <td class="col" width="100%"><p>
                The security deposit and balance payment to the agent is taken from the
                credit or debit card supplied at the time of booking - book now using our
                secure online booking form.
            </p></td>
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
            <div style="font-size: 16px"><b>Pay At Pick-Up</b></div>
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
            <td class="col" width="100%">
                <p style="font-size: 16px; padding-bottom: 10px"><b>Alternative payment options</b></p>
                <p>
                    Balance payment collected by Australia 4 Wheel Drive Rentals can be paid via
                    internet banking instead of credit card. Details will be supplied upon
                    request.            
                </p>
            </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
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
</table>`
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
                <br>
                <p style="font-weight: bold; font-size: 11px">
                    Domestic Rates
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    This rate is for Australian and New Zealand residents only. The hirer must
                    be able to produce their Australian or New Zealand drivers licence upon
                    vehicle collection. Should the hirer not be able to do so on the day of pick
                    up, the hirer will be refused the rental at the rate nominated. The hirer
                    will be charged the difference between the Domestic rate and the Standard
                    rate.
                </p>
                <p style="font-weight: bold; font-size: 11px">
                    The agent - Australia 4 Wheel Drive Rentals
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    From here onwards Australia 4 Wheel Drive Rentals and it's associated group
                    of companies shall henceforth be referred to as the 'Agent', 'we' or 'our'.
                </p>
                <p style="font-weight: bold; font-size: 11px">
                    Agent security deposit
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
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
                </p>
                <p style="font-weight: bold; font-size: 11px">
                    Agent credit card surcharge
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    A 2.0% surcharge for all VISA / Mastercard credit card transactions paid
                    towards the booking will apply. Please note that these credit card fees do
                    not overlap with the supplier surcharge. Please note when choosing a
                    Standard rate you will be paying extra credit card fees to the supplier for
                    any administration surcharges and / or if you choose to take up any excess
                    plan upon pickup. The Agent does NOT accept American Express or Diners
                    credit cards.
                </p>
                <p style="font-weight: bold; font-size: 11px">
                    Calculation errors
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    We rely heavily on accurate information provided to us by our suppliers and
                    we endeavour to ensure that all our prices are up to date. However we cannot
                    be held liable for any errors in price calculation. In the event of an
                    erroneous quotation or invoice, we will re-issue another quotation
                    superseding the original quote or invoice with the necessary corrections in
                    pricing.
                </p>
                <p style="font-weight: bold; font-size: 11px">
                    Suppliers Responsibility
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    We are a booking service for the Suppliers. You will be required to complete
                    a rental agreement directly with the relevant Supplier on collection of the
                    rented vehicle. Your rental is subject to the terms and conditions of the
                    respective Supplier with whom the rental agreement is made. Each Supplier is
                    responsible for notifying inventory levels to the Agent. We do not accept
                    any liability for unavailability of vehicles caused by the Supplier
                    over-selling its own vehicle inventory or vehicle movement disruption.
                </p>
                <p style="font-weight: bold; font-size: 11px">
                    Disclaimer
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    These details are indicative of the vehicle that will be supplied under
                    your booking. Actual vehicles may vary according to year of manufacture
                    and availability but your vehicle will be suitable for the required number
                    of persons and have equivalent or better specifications to those listed in
                    this website.
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    We will NOT accept responsibility for any/the loss or damage or injury
                    caused to any passenger. We will not be held responsible for any changes
                    to any or all of the above services provided by the operator. We STRONGLY
                    recommends you take out adequate travel insurance including cancellation
                    insurance for your holiday.
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
                    Unless we hear from you that you can't access this information before your
                    booking of the vehicle it will be generally understood and accepted by all
                    parties that you have successfully accessed all links then read and
                    understood our terms and conditions and those of the supplier.
                </p>
                <p style="font-size: 11px; padding-bottom: 10px">
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
  </body>
</html>
`;
    return email;
  },
};
