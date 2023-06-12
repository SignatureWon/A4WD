import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import sgMail from "@sendgrid/mail";
import { env } from "$env/dynamic/public";
import { error, redirect } from "@sveltejs/kit";
import CryptoJS from "crypto-js";

export async function load({ url, params, locals }) {
  const { data: content } = await supabase
    .from("contents")
    .select("name,content,description,caption")
    .eq("type", "template_quote")
    .single();
  return { content };
}

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    let id = Number(fd.reference.replace(/\D+/g, "")) - 388000;

    // console.log(id);

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*, users (*)")
      .eq("id", id)
      .eq("users.email", fd.email)
      .eq("users.last_name", fd.last_name)
      .single();

    return { quote };
  },
};
