import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = [
    "id",
    "created_at",
    "email",
  ];
  return {
    data: db.all({
      table: "form_newsletter",
      keys: keys,
      // eq: [{ name: "role", value: "admin" }],
      order: [{ name: "created_at", ascend: false }],
    }),
    path: url.pathname,
    // title: pageTitle[params.type],
  };
}
