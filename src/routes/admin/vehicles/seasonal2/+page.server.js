import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "suppliers (name)", "date_start", "date_end"];

  return {
    data: db.all({
      table: "rates",
      keys: keys,
      eq: [
        { name: "type", value: "seasonal" },
        { name: "status", value: true },
      ],
      order: [
        { name: "suppliers", ascend: true },
        { name: "date_start", ascend: true },
      ],
    }),
    path: url.pathname,
  };
}
