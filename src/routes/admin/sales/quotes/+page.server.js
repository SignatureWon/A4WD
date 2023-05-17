import { db } from "$lib/server/db";

export async function load({ url, params }) {
  return {
    depots: db.related({
      table: "depots",
    }),
    categories: db.related({
      table: "categories",
      eq: [{ name: "type", value: "vehicles" }],
      order: [{ name: "rank", ascend: true }],
    }),
    ages: db.related({
      table: "constants",
      eq: [{ name: "type", value: "ages" }],
    }),
    licenses: db.related({
      table: "constants",
      eq: [{ name: "type", value: "licenses" }],
    }),
  };
}
