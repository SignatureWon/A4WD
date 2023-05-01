<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import { db } from "$lib/db";
  import { fees } from "$lib/schema/fees";

  const title = "Fee";
  let fetch = {
    from: "fees",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
  let data = {};

  onMount(async () => {
    data = db.default(fees);
    if (fetch.id !== "add") {
      data = await db.one(fetch);
    }
  });

  $: {
    fetch = {
    from: "fees",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
  
}
</script>

<Feedback {data} />

<Title {title} {data} />

<Form
  structure={{
    name: "",
    sections: [
      {
        name: "Info",
        fields: ["name", "description", "date_start"],
      },
      {
        name: "Criteria",
        fields: ["all_vehicles", "all_depots", "all_suppliers"],
      },
      {
        name: "Charge on",
        fields: ["pickup", "dropoff", "return", "fee"],
      },
    ],
  }}
  {fetch}
  bind:data
  schema={fees}
  duplicate={true}
/>
