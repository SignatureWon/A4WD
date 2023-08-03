import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "status", "rank"];

  return {
    data: db.all({
      table: "categories",
      keys: keys,
      eq: [{ name: "type", value: "events" }],
      order: [{ name: "rank", ascend: true}]
    }),
    path: url.pathname,
  };
}
