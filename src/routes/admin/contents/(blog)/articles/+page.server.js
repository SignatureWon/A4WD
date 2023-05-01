import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "categories (name)", "status", "rank"];

  return {
    data: db.all({
      table: "contents",
      keys: keys,
      eq: [{ name: "type", value: "articles" }],
      order: [{ name: "rank", ascend: true}]
    }),
    path: url.pathname,
  };
}
