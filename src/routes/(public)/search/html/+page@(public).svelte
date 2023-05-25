<script>
  import { html } from "$lib/html.js";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import { supabase } from "$lib/supabaseClient";

  let email = "";
  let quote = {}
  let letterhead = {}
  onMount(async () => {
    // email = await html.create(38, "template_quote");
    const { data: dataquote } = await supabase
      .from("quotes")
      .select("*, users (id, name)")
      .eq("id", quote_id)
      .single();

    console.log("quote", quote);

    // const { data: user } = await supabase
    //   .from("users")
    //   .select()
    //   .eq("id", quote.users)
    //   .single();

    const { data: letterhead } = await supabase
      .from("contents")
      .select()
      .eq("type", "template_letterhead")
      .single();
  });
</script>

<!-- {@html email} -->

<div style="width: 640px; background-color: #ffffff; margin: auto; padding: 20px">
  <table width="600">
    <tr>
        <td>
            <div style="font-size: 18px; font-weight: bold">
                ${letterhead.name}
            </div>
            <div style="font-size: 12px; color: #999999">
                ${letterhead.description}
            </div>
            <div style="font-size: 14px;">
                ${letterhead.content.replace(/(?:\r\n|\r|\n)/g, "<br>")}
            </div>
        </td>
        <td valign="top">
            <div style="text-align: right; font-size: 24px; font-weight: bold">
                ${contents.name}
            </div>
        </td>
    </tr>
</table>

</div>
