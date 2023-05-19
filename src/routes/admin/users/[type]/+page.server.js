import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = [
    "id",
    "created_at",
    "title",
    "first_name",
    "last_name",
    "email",
    "role",
    "email",
    "phone",
    "address_1",
    "address_2",
    "postcode",
    "city",
    "state",
    "country",
    "tnc",
    "newsletter",
  ];
  const pageTitle = {
    quoted: "Pax Quoted",
    booked: "Pax Booked",
    enquiry: "Pax Enquiry",
    subscribed: "Pax Subscribed",
    affiliate: "Affiliate",
    supplier: "Supplier",
    admin: "Admin",
  };

  return {
    data: db.all({
      table: "profiles",
      keys: keys,
      eq: [{ name: "role", value: params.type }],
      order: [{ name: "created_at", ascend: true }],
    }),
    path: url.pathname,
    title: pageTitle[params.type],
  };
}
