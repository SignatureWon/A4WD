import { supabase } from "$lib/supabaseClient";

export async function load({ params, url }) {
  const keyword = url.searchParams.get("keyword") || "";
  const category = url.searchParams.get("category") || "";
  const cat = {
    "4wd-campers": "b15650e0-8620-41be-994f-e3fd7a43ac7a",
    "4wd-cars": "bb8ddb8c-f0d1-4d70-93f2-662d7d986f98",
    "2wd-campers": "2d5813fd-ec03-48a4-8363-f4d2d9d0223b",
    "2wd-cars": "ed05bc2e-2301-49fc-8eb4-8fef2be514b0",
  };

  const pageCurrent = Number(url.searchParams.get("page")) || 1;
  const pageSize = 18;
  const rangeFrom = (pageCurrent - 1) * pageSize;
  const rangeTo = rangeFrom + pageSize - 1;

  let query = supabase.from("vehicles").select("*, vehicles_categories!inner (categories)", { count: "exact" }).eq("status", true);

  if (category !== "") {
    query = query.filter("vehicles_categories.categories", 'eq', cat[category]);
  }
  const {
    data: vehicles,
    count,
    error: error_vehicles,
  } = await query.ilike("name", `%${keyword}%`).order("rank", { ascending: true }).range(rangeFrom, rangeTo);
  const pageTotal = Math.round(count / pageSize + 0.5);

  const { data: pageTitle, error: error_pageTitle } = await supabase
    .from("constants")
    .select()
    .eq("type", "vehicles")
    .single();

  return { vehicles, pageCurrent, pageTotal, pageTitle, keyword, category };
}
