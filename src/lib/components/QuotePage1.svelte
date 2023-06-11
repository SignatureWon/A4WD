<script>
  import dayjs from "dayjs";
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  export let id;
  export let type;

  let promise = getData();
  let d = {};
  async function getData() {
    const { data: quote } = await supabase
      .from("quotes")
      .select()
      .eq("id", id)
      .single();
    d.quote = quote;

    const { data: user } = await supabase
      .from("users")
      .select()
      .eq("id", quote.users)
      .single();
    d.user = user;

    const { data: letterhead } = await supabase
      .from("contents")
      .select()
      .eq("type", "template_letterhead")
      .single();
    d.letterhead = letterhead;

    // Doc Type:
    // template_quote
    // template_ticket_provisional
    // template_ticket

    const { data: contents } = await supabase
      .from("contents")
      .select()
      .eq("type", type)
      .single();
    d.contents = contents;

    const { data: supplier } = await supabase
      .from("suppliers")
      .select()
      .eq("id", quote.details.supplier.id)
      .single();
    d.supplier = supplier;

    const { data: terms } = await supabase
      .from("terms")
      .select()
      .eq("suppliers", quote.details.supplier.id)
      .single();
    d.terms = terms;

    const pickup = supplier.depots.filter((d) => {
      return d.Depots.id === quote.details.pickup.id;
    })[0];

    const dropoff = supplier.depots.filter((d) => {
      return d.Depots.id === quote.details.dropoff.id;
    })[0];

    // console.log(d);
  }
</script>
<div class="">
<div id="quote_pdf">
  {#await promise}
    Loading
  {:then value}
    <!-- promise was fulfilled -->
    <div class="flex">
      <div class="flex-1">
        <div class="text-lg font-bold">{d.letterhead.name}</div>
        <div class="text-sm text-gray-500 mb-2">{d.letterhead.description}</div>
        <div><pre class="font-sans">{d.letterhead.content}</pre></div>
        <div>
            <ul class="list-disc pl-4">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ul>
        </div>
      </div>
      <div>
        <div class="text-2xl font-bold">{d.contents.name}</div>
      </div>
    </div>
  {/await}
</div>
</div>