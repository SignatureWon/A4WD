import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
  const type = params.type;
  const table = type === "vehicles" ? "vehicles" : "contents";
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, type, image, meta_title, meta_description, description")
    .eq("slug", params.slug)
    .eq("type", type)
    .single();

  const keyword = url.searchParams.get("keyword") || "";
  const pageCurrent = Number(url.searchParams.get("page")) || 1;
  const pageSize = 18;
  const rangeFrom = (pageCurrent - 1) * pageSize;
  const rangeTo = rangeFrom + pageSize - 1;

  const {
    data: list,
    count,
    error: error_list,
  } = await supabase
    .from(table)
    .select("name, image, slug", { count: "exact" })
    .eq("categories", category.id)
    .eq("type", type)
    .ilike("name", `%${keyword}%`)
    .order("rank", { ascending: true })
    .range(rangeFrom, rangeTo);

  const pageTotal = Math.round(count / pageSize + 0.5);

  return { category, type, list, pageCurrent, pageTotal, keyword };
}
