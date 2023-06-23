<script>
  import { format } from "$lib/format.js";
  import { Button, Modal } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import { html as quotation } from "$lib/email/quotation.js";
  import { html as booking } from "$lib/email/booking.js";
  import { html as provisional } from "$lib/email/provisional.js";
  import { html as final } from "$lib/email/final.js";
  export let quote;
  const stat = {
    Quotation: "Quotation",
    Booking: "Pax Booking",
    Final: "Final Ticket",
    Provisional: "Provisional Ticket",
  };

  let q_open = false;
  let q_content = "";
  let b_open = false;
  let b_content = "";
  let pt_open = false;
  let pt_content = "";
  let ft_open = false;
  let ft_content = "";
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Status</h2>
  </div>
  <div class="p-4">
    <div class="mb-8">
      <div class="label">Current Status</div>
      <div class="value">{stat[quote.status]}</div>
    </div>
    <div class="label">Past Statuses</div>
    <div class="flex items-center py-2 border-b border-gray-200">
      <div class="flex-1">Quotation</div>
      <div class="w-28 mx-1">{dayjs(quote.date_created).format("DD MMM YYYY")}</div>
      <div class="w-28 mx-1">
        <Button
          kind="tertiary"
          class="w-full"
          on:click={async () => {
            q_content = await quotation.create(quote.id);
            q_open = true;
          }}>Preview</Button
        >
      </div>
      <div class="w-28 mx-1">
        <Button
          kind="tertiary"
          class="inline-block w-full"
          href={`https://api.australia4wdrentals.com/storage/v1/object/public/quotes/Q${388000 + quote.id}.pdf`}
          >Download</Button
        >
      </div>
    </div>
    {#if quote.date_deposit}
      <div class="flex items-center py-2 border-b border-gray-200">
        <div class="flex-1">Pax Booking</div>
        <div class="w-28 mx-1">{dayjs(quote.date_deposit).format("DD MMM YYYY")}</div>
        <div class="w-28 mx-1">
          <Button
            kind="tertiary"
            class="w-full"
            on:click={async () => {
              b_content = await booking.create(quote.id);
              b_open = true;
            }}>Preview</Button
          >
        </div>
        <div class="w-28 mx-1">
          <Button
            kind="tertiary"
            class="inline-block w-full"
            href={`https://api.australia4wdrentals.com/storage/v1/object/public/quotes/B${388000 + quote.id}.pdf`}
            >Download</Button
          >
        </div>
      </div>
    {/if}
    {#if quote.date_provisional}
      <div class="flex items-center py-2 border-b border-gray-200">
        <div class="flex-1">Provisional Ticket</div>
        <div class="w-28 mx-1">{dayjs(quote.date_provisional).format("DD MMM YYYY")}</div>
        <div class="w-28 mx-1">
          <Button
            kind="tertiary"
            class="w-full"
            on:click={async () => {
              pt_content = await provisional.create(quote.id);
              pt_open = true;
            }}>Preview</Button
          >
        </div>
        <div class="w-28 mx-1">
          <Button
            kind="tertiary"
            class="inline-block w-full"
            href={`https://api.australia4wdrentals.com/storage/v1/object/public/quotes/Provisional%20Ticket%20-%20PT${
              388000 + quote.id
            }.pdf`}>Download</Button
          >
        </div>
      </div>
    {/if}
    {#if quote.date_balance}
      <div class="flex items-center py-2 border-b border-gray-200">
        <div class="flex-1">Final Ticket</div>
        <div class="w-28 mx-1">{dayjs(quote.date_balance).format("DD MMM YYYY")}</div>
        <div class="w-28 mx-1">
          <Button
            kind="tertiary"
            class="w-full"
            on:click={async () => {
              ft_content = await final.create(quote.id);
              ft_open = true;
            }}>Preview</Button
          >
        </div>
        <div class="w-28 mx-1">
            <Button
            kind="tertiary"
            class="inline-block w-full"
            href={`https://api.australia4wdrentals.com/storage/v1/object/public/quotes/Final%20Ticket%20-%20FT${
              388000 + quote.id
            }.pdf`}>Download</Button
          >
        </div>
      </div>
    {/if}
  </div>
</div>
<Modal passiveModal bind:open={q_open} modalHeading="Preview Quotation" on:open on:close>
  <div id="htmlcontent">
    {@html q_content}
  </div>
</Modal>
<Modal passiveModal bind:open={b_open} modalHeading="Preview Booking" on:open on:close>
  <div id="htmlcontent">
    {@html b_content}
  </div>
</Modal>
<Modal passiveModal bind:open={pt_open} modalHeading="Preview Provisional Ticket" on:open on:close>
  <div id="htmlcontent">
    {@html pt_content}
  </div>
</Modal>
<Modal passiveModal bind:open={ft_open} modalHeading="Preview Final Ticket" on:open on:close>
  <div id="htmlcontent">
    {@html ft_content}
  </div>
</Modal>
