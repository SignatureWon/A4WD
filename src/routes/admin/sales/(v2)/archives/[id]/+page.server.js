import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";
import { error, redirect } from "@sveltejs/kit";
import { html } from "$lib/email/final.js";
import { html as confirmation } from "$lib/confirmation.js";
import playwright from "playwright-aws-lambda";
import { env } from "$env/dynamic/public";
import sgMail from "@sendgrid/mail";

export async function load({ url, params }) {
  const { data: quote } = await supabase.from("quotes").select("*, users (*)").eq("id", params.id).single();
  return {
    quote: quote,
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  provisional: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Provisional",
        date_provisional: dayjs()
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/pt/${params.id}`);
  },
  final: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Final",
        date_balance: dayjs()
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/ft/${params.id}`);
  },
  booking: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Booking",
        date_provisional: dayjs()
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/book/${params.id}`);
  },
  quotation: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Request",
        date_balance: dayjs()
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/quotes/${params.id}`);
  },
  clearcard: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        cc_type: null,
        cc_name: null,
        cc_number: null,
        cc_cvv: null,
        cc_month: null,
        cc_year: null,
        cc_remark: null,
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/pt/${params.id}`);
  },
  trash: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Trash",
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/archive`);
  },
  archive: async ({ request, url, params, locals }) => {
    const { error: err } = await locals.sb
      .from("quotes")
      .update({
        status: "Archive",
      })
      .eq("id", params.id);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    throw redirect(303, `/admin/sales/pt`);
  },
};
