import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "updated_at", "users (first_name)", "status", "gross"];

  return {
    data: db.all({
      table: "quotes",
      keys: keys,
      // eq: [{ name: "status", value: true }],
      order: [{ name: "updated_at", ascend: true}]
    }),
    path: url.pathname,
  };
}
