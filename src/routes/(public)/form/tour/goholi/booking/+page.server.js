import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import sgMail from "@sendgrid/mail";
import { env } from "$env/dynamic/public";
import { error, redirect } from "@sveltejs/kit";
import CryptoJS from "crypto-js";

export async function load() {
  const { data: dataOptions, error: errorOptions } = await supabase.rpc("search_options").select();
  let options = {
    depots: [],
    vehicles: [],
    ages: [],
    licenses: [],
  };
  dataOptions.forEach((opt) => {
    options[opt.name] = opt.options;
  });

  const { data: dataVehicles } = await supabase
    .from("vehicles")
    .select("id, name, categories (id), suppliers (id)")
    .eq("status", true)
    .order("rank", {
      ascend: true,
    });

  const { data: dataBonds } = await supabase.from("packages").select("id, name, vehicles (id)").order("rank", {
    ascend: true,
  });

  // const etext = CryptoJS.AES.encrypt("YEEHOW", "A4wdR").toString()
  // const dtext = CryptoJS.AES.decrypt(etext, "A4wdR").toString(CryptoJS.enc.Utf8)

  return {
    options: JSON.parse(JSON.stringify(options)),
    vehicles: dataVehicles,
    bonds: dataBonds,
  };
}

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());
    fd.guests = JSON.parse(fd.guests);
    fd.pickup_date = dayjs(fd.pickup_date, "DD/MM/YYYY");
    fd.dropoff_date = dayjs(fd.dropoff_date, "DD/MM/YYYY");
    fd.arrival_date = dayjs(fd.arrival_date, "DD/MM/YYYY");
    fd.card_number = CryptoJS.AES.encrypt(fd.card_number, env.PUBLIC_AES_KEY).toString();
    fd.card_code = CryptoJS.AES.encrypt(fd.card_code, env.PUBLIC_AES_KEY).toString();
    fd.user_agree = true;
    fd.tour = true;
    fd.goholi = true;

    // console.log("AGREE", fd.user_agree);

    let user = {
      title: fd.title,
      first_name: fd.first_name,
      last_name: fd.last_name,
      phone: fd.phone,
      email: fd.email,
      address_1: fd.address_1,
      address_2: fd.address_2,
      postcode: fd.postcode,
      city: fd.city,
      state: fd.state,
      country: fd.country,
    };

    const { data: checkUser, error: errorCheckUser } = await supabase
      .from("users")
      .select()
      .eq("email", fd.email)
      .single();
    if (errorCheckUser) {
      console.log("errorCheckUser", errorCheckUser);
    }

    if (!checkUser) {
      const { data: dataUser, error: errUser } = await supabase.from("users").insert(user).select().single();
      if (errUser) {
        console.log("errUser", errUser);
      }
      user.id = dataUser.id;
    } else {
      user.id = checkUser.id;
      const { error: errUpdateUser } = await supabase.from("users").update(user).eq("id", user.id);
      if (errUpdateUser) {
        console.log("errUpdateUser", errUpdateUser);
      }
    }

    fd.users = user.id;

    const { data: dataform, error: errform } = await supabase.from("forms").insert(fd).select().single();
    if (errform) {
      console.log("errform", errform);
    }

    // let vehicle_name = "N/A";
    // if (fd.vehicles) {
    //   const { data: vehicleData } = await supabase.from("vehicles").select("name").eq("id", fd.vehicles).single();
    //   vehicle_name = vehicleData.name;
    // }

    // const { data: depotData } = await supabase.from("depots").select("id, name");
    // const { data: dataOptions, error: errorOptions } = await supabase.rpc("search_options").select();
    // let options = {
    //   depots: [],
    //   vehicles: [],
    //   ages: [],
    //   licenses: [],
    // };
    // dataOptions.forEach((opt) => {
    //   options[opt.name] = opt.options;
    // });

    // let pickup_name = depotData.filter((item) => {
    //   return item.id === fd.pickup_depot;
    // })[0].name;
    // let dropoff_name = depotData.filter((item) => {
    //   return item.id === fd.dropoff_depot;
    // })[0].name;

    // let license_name = options.licenses.filter((item) => {
    //   return item.id === fd.licenses;
    // })[0].name;

    // let bond_name = "N/A";
    // if (fd.bonds) {
    //   const { data: bondData } = await supabase.from("packages").select("name").eq("id", fd.bonds).single();
    //   bond_name = bondData.name;
    // }

    const label = {
      reference: "Reference",
      title: "Title",
      first_name: "First Name",
      last_name: "Last Name",
      address_1: "Address 1",
      address_2: "Address 2",
      city: "City",
      state: "State",
      postcode: "Postcode",
      country: "Country",
      phone: "Phone",
      email: "Email",
      vehicles: "Vehicles",
      bonds: "Bonds",
      comments: "Comments",
      licenses: "Licenses",
      age: "Age",
      pickup_depot: "Pickup Depot",
      dropoff_depot: "Dropoff Depot",
      pickup_date: "Pickup Date",
      dropoff_date: "Dropoff Date",
      count_adults: "No. of Adults",
      count_children: "No. of Children",
      arrival_by: "Arrival By",
      flexibility: "Flexibility",
      arrival_date: "Arrival Date",
      arrival_flight: "Arrival Flight",
      tour_code: "Tour or tour code",
      accommodation_code: "Accommodation or accommodation code",
    };

    let emailBody = `
        <!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
        <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <style type="text/css">
        body{
            margin:0;
            padding:0;
            font-size: 16px;
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
            font-size: 16px;
        }
        
        #bodyTable{
            height:100% !important;
            margin:0;
            padding:0;
            width:100% !important;
            font-size: 16px;
        }
        </style>
        </head>
        <body>
        <div
        style="width: 600px; background-color: #ffffff; margin: auto; padding: 0"
        >
        <div style="font-size: 20px; font-weight: bold">Tour Booking Request (Goholi)</div>
        <table
        width="600"
        cellpadding="10"
        cellspacing="0"
        style="margin-bottom: 30px;"
    >`;

    for (const key in fd) {
      if (
        ![
          "guests",
          "categories",
          "users",
          "type",
          "pay_arrangement",
          "pay_amount",
          "card_type",
          "card_name",
          "card_number",
          "card_month",
          "card_year",
          "card_code",
          "card_comments",
          "goholi",
          "tour",
          "user_agree",
        ].includes(key)
      ) {
        let display = fd[key];
        if (key === "vehicles") {
          display = vehicle_name;
        } else if (key === "pickup_depot") {
          display = pickup_name;
        } else if (key === "dropoff_depot") {
          display = dropoff_name;
        } else if (key === "licenses") {
          display = license_name;
        } else if (key === "bonds") {
          display = bond_name;
        } else if (key === "pickup_date") {
          display = fd.pickup_date.format("ddd, DD MMM YYYY");
        } else if (key === "dropoff_date") {
          display = fd.dropoff_date.format("ddd, DD MMM YYYY");
        } else if (key === "arrival_date") {
          display = fd.arrival_date.format("ddd, DD MMM YYYY");
        }

        emailBody += `
            <tr>
                <td
                width="50%"
                valign="top"
                style="font-size: 16px;border: 1px solid #CCCCCC"
                >
                ${label[key]}
                </td>
                <td
                width="50%"
                valign="top"
                style="border: 1px solid #CCCCCC; font-size: 16px"
                >
                ${display}
                </td>
            </tr>`;
      }
    }

    emailBody += `
    </table>
    </div>
    </body>
    </html>`;

    const { data: emailData } = await supabase.from("constants").select("name").eq("type", "email_quote").single();
    let bcc = emailData.name.split(",");
    let bccList = [];
    bcc.forEach((email) => {
      bccList.push({
        email: email.trim(),
      });
    });
    let emailResponse = "";
    sgMail.setApiKey(env.PUBLIC_SENDGRID_API_KEY);
    await sgMail
      .send({
        personalizations: [
          {
            to: [
              {
                email: user.email.trim(),
                name: `${user.first_name.trim()} ${user.last_name.trim()}`,
              },
            ],
            bcc: bccList,
          },
        ],
        from: {
          email: "info@australia4wdrentals.com",
          name: "Goholi Pty Ltd",
        },
        subject: `Manual Booking: ${fd.pickup_date.format("DD MMM YYYY")} - ${fd.dropoff_date.format(
          "DD MMM YYYY"
        )}: ${user.first_name.trim()} ${user.last_name.trim()}`,
        content: [
          {
            type: "text/html",
            value: emailBody,
          },
        ],
        // mail_settings: {
        //   sandbox_mode: {
        //     enable: true,
        //   },
        // },
      })
      .then(() => {
        emailResponse = "Email sent";
        console.log("Email sent");
      })
      .catch((error) => {
        emailResponse = error;
        console.error(error);
      });

    throw redirect(303, `/form/tour/goholi/booking/success`);
  },
};
