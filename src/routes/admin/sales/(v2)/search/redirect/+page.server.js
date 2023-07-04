import { redirect } from "@sveltejs/kit";

export async function load({ url }) {
  let search = [];

  url.searchParams.forEach((value, key) => {
    search.push(`${key}=${value}`)
  });

  throw redirect(
    301,
    `/admin/sales/search?${search.join("&")}`
  );
}
