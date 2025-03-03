import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
const keys = [
  "name",
  "suppliers",
  "booking_start",
  "booking_end",
  "travel_start",
  "travel_end",
  // "percentage",
  // "deposit",
  // "balance",
  // "reminder",
  // "description",
  // "payment2",
  // "percentage2",
  // "deposit2",
  // "balance2",
  // "reminder2",
  // "description2",
  // "payment3",
  // "percentage3",
  // "deposit3",
  // "balance3",
  // "reminder3",
  // "description3",
  // "description4",
  "confirmation",
  "confirmation_terms",
  "summary",
  "summary_terms",
  "counter",
  "counter_terms",
  // "pay_counter",
];

export async function load({ url, params, locals }) {
  // return {
  //   data: db.one({
  //     table: "terms",
  //     id: params.id,
  //     keys: keys,
  //   }),
  // };
  const data = await db.one({
    table: "terms",
    id: params.id,
    keys: keys,
  });
  if (data.confirmation) {
    throw redirect(303, `${env.PUBLIC_DB_URL}/storage/v1/object/public/terms/${data.confirmation}`);
  } else {
    return { data };
  }
}
