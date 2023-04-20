<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import { db } from "$lib/db";
  import { blockouts } from "$lib/schema/blockouts";

  const title = "Blockout";
  let fetch = {
    from: "blockouts",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
  let data = {};

  onMount(async () => {
    data = db.default(blockouts);
    console.log("default", data);
    if (fetch.id !== "add") {
      data = await db.one(fetch);
      ["depots", "suppliers", "vehicles"].forEach(key => {
        delete data[key]
      })
      console.log("fetch", data);
    }
  });

  $: {
    fetch = {
    from: "blockouts",
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
        fields: ["all_depots", "all_suppliers", "all_vehicles"],
      },
      {
        name: "Publish",
        fields: ["status"],
      },
    ],
  }}
  {fetch}
  bind:data
  schema={blockouts}
  duplicate={true}
/>
<!-- <script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "General",
    groups: [
      {
        name: "Info",
        description: "",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          },
          {
            name: "description",
            label: "Description",
            type: "text",
            required: true,
          },
          {
            name: "date_start",
            label: "Start date",
            name2: "date_end",
            label2: "End date",
            type: "daterange",
          },
        ],
      },
      {
        name: "Criteria",
        description: "",
        fields: [
          {
            name: "vehicles",
            label: "Vehicle",
            type: "related",
            related: "vehicles",
          },
          {
            name: "all_vehicles",
            label: "All vehicles",
            type: "switch",
          },
          {
            name: "depots",
            label: "Depot",
            type: "related",
            related: "depots",
          },
          {
            name: "all_depots",
            label: "All depots",
            type: "switch",
          },
          {
            name: "suppliers",
            label: "Supplier",
            type: "related",
            related: "suppliers",
          },
          {
            name: "all_suppliers",
            label: "All suppliers",
            type: "switch",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Blockout" table="blockouts" />
<Form {form} table="blockouts" /> -->
