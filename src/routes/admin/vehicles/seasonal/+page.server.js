import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "suppliers (name)"];

  return {
    data: db.all.load({
      table: "rates",
      keys: keys,
      eq: [{ name: "type", value: "seasonal" }],
    }),
    path: url.pathname,
  };
}
