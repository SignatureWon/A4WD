import { supabase } from "$lib/supabaseClient";

export async function load({ params, url }) {
  const keyword = url.searchParams.get("keyword") || "";

  const pageCurrent = Number(url.searchParams.get("page")) || 1;
  const pageSize = 10;
  const rangeFrom = (pageCurrent - 1) * pageSize;
  const rangeTo = rangeFrom + pageSize - 1;

  const {
    data: events,
    count,
    error: error_events,
  } = await supabase
    .from("contents")
    .select("name, image, slug", { count: "exact" })
    .eq("type", "events")
    .ilike("name", `%${keyword}%`)
    .order("rank", { ascending: true })
    .range(rangeFrom, rangeTo);

  const pageTotal = Math.round(count / pageSize + 0.5);

  const { data: pageTitle, error: error_pageTitle } = await supabase
    .from("constants")
    .select()
    .eq("type", "events")
    .single();


  return { events, pageCurrent, pageTotal, pageTitle, keyword };
}
