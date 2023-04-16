<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  // import ManyToMany from "$lib/admin/input/ManyToMany.svelte";
  // import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import { db } from "$lib/db";
  import { fees } from "$lib/schema/fees";

  const title = "Vehicle";
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
        fields: ["pickup", "dropoff", "return"],
      },
    ],
  }}
  {fetch}
  bind:data
  schema={fees}
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
            default: false,
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
            default: false,
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
            default: false,
          },
        ],
      },
      {
        name: "Charge on",
        description: "",
        fields: [
          {
            name: "pickup",
            label: "Pick-up",
            type: "switch",
            default: false,
          },
          {
            name: "dropoff",
            label: "Drop-off",
            type: "switch",
            default: false,
          },
          {
            name: "return",
            label: "Return to base",
            type: "switch",
            default: false,
          },
          ],
      },
    ],
  };
</script>

<PageHeader name="Fee" table="fees" />
<Form {form} table="fees" /> -->
