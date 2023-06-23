import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "updated_at", "details", "users (first_name, last_name)", "status"];

  return {
    data: db.all({
      table: "quotes",
      keys: keys,
      eq: [{ name: "status", value: "Archive" }],
      order: [{ name: "updated_at", ascend: false}]
    }),
    path: url.pathname,
  };
}
