import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "suppliers (name)"];

  return {
    data: db.all({
      table: "rates",
      keys: keys,
      eq: [{ name: "type", value: "flex" }],
    }),
    path: url.pathname,
  };
}
