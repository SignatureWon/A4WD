import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";

export async function load({ url, params }) {
  const keys = [
    "id",
    "created_at",
    "updated_at",
    "details",
    "users",
    "status",
    "deposit",
    "payment_1",
    "payment_2",
    "balance",
    "nett",
    "gross",
    "profit",
    "discount",
    "agent",
    "agent_fee",
    "system_fee",
    "nett_profit",
    "refund",
    "remark",
    "remark_deposit",
    "remark_payment_1",
    "remark_payment_2",
    "remark_balance",
    "remark_refund",
    "paid_deposit",
    "paid_payment_1",
    "paid_payment_2",
    "paid_balance",
    "add_discount",
    "add_discount_remark",
  ];

  const quote = await db.one({
    table: "quotes",
    id: params.id,
    keys: keys,
  });

  //   const { data: vehicle } = await supabase
  //     .from("vehicles")
  //     .select("name, slug, image")
  //     .eq("id", quote.id)
  //     .single();
  const { data: user } = await supabase.from("users").select().eq("id", quote.users).single();

  return {
    quote: quote,
    user: user,
    path: url.pathname,
    id: params.id,
  };
}
