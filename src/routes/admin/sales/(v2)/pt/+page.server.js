import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "date_provisional", "details", "users (first_name, last_name)", "status"];

  return {
    data: db.all({
      table: "quotes",
      keys: keys,
      eq: [{ name: "status", value: "Provisional" }],
      order: [{ name: "date_provisional", ascend: false}]
    }),
    path: url.pathname,
  };
}
