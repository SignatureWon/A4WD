import { supabase } from "$lib/supabaseClient";

export async function load({ params, url }) {
  const keyword = url.searchParams.get("keyword") || "";

  const pageCurrent = Number(url.searchParams.get("page")) || 1;
  const pageSize = 18;
  const rangeFrom = (pageCurrent - 1) * pageSize;
  const rangeTo = rangeFrom + pageSize - 1;

  const {
    data: faqs,
    count,
    error: error_faqs,
  } = await supabase
    .from("contents")
    .select("name, description", { count: "exact" })
    .eq("type", "faqs")
    .order("rank", { ascending: true });

  const pageTotal = Math.round(count / pageSize + 0.5);

  const { data: pageTitle, error: error_pageTitle } = await supabase
    .from("constants")
    .select()
    .eq("type", "faqs")
    .single();

  return { faqs, pageCurrent, pageTotal, pageTitle, keyword };
}
