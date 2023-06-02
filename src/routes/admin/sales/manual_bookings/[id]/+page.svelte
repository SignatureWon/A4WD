<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import ManyToMany from "$lib/admin/input/ManyToMany.svelte";
  import { Button, Tab, TabContent, Tabs, TextInput } from "carbon-components-svelte";
  import { db } from "$lib/db";
  import { forms } from "$lib/schema/forms";
  import CryptoJS from "crypto-js";

  const title = "Booking";
  let fetch = {
    from: "forms",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };

  let data = db.default(forms);
  let passcode = "";

  onMount(async () => {
    if (fetch.id !== "add") {
      data = await db.one(fetch);
    }
  });

  $: fetch = {
    from: "forms",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
</script>

<Feedback {data} />

<Title {title} {data} />
<Form
  structure={{
    name: "",
    sections: [
      {
        name: "Customer Information",
        fields: [
          "reference",
          "title",
          "first_name",
          "last_name",
          "address_1",
          "address_2",
          "city",
          "state",
          "postcode",
          "country",
          "phone",
          "email",
        ],
      },
      {
        name: "Arrival Information",
        fields: ["arrival_by", "flexibility", "arrival_date", "arrival_flight"],
      },
      {
        name: "Vehicle Information",
        fields: ["suppliers", "categories", "vehicles"],
      },
      {
        name: "Driver Information",
        fields: ["licenses", "ages", "bonds", "comments"],
      },
      {
        name: "Travel Information",
        fields: ["pickup_depot", "dropoff_depot", "pickup_date", "count_adults", "count_children"],
      },
      {
        name: "Passenger Information",
        fields: ["guests"],
      },
      {
        name: "Payment Information",
        fields: [
          "pay_arrangement",
          "pay_amount",
          "card_type",
          "card_name",
          "card_number",
          "card_month",
          "card_year",
          "card_code",
          "card_comments",
        ],
      },
    ],
  }}
  {fetch}
  bind:data
  schema={forms}
  duplicate={true}
/>

<div class="p-4 bg-gray-200 my-4">
  <div class="flex max-w-xs mx-auto">
    <TextInput bind:value={passcode} placeholder="Passcode" />
    <Button
      on:click={() => {
        data.card_number = CryptoJS.AES.decrypt(data.card_number, passcode).toString(CryptoJS.enc.Utf8)
        data.card_code = CryptoJS.AES.decrypt(data.card_code, passcode).toString(CryptoJS.enc.Utf8)
      }}>Reveal Card</Button
    >
  </div>
</div>