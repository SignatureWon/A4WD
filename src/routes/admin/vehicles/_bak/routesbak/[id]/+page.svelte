<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import { db } from "$lib/db";
  import { routes } from "$lib/schema/routes";

  const title = "Route";
  let fetch = {
    from: "routes",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
  let data = {};

  onMount(async () => {
    data = db.default(routes);
    if (fetch.id !== "add") {
      data = await db.one(fetch);
    }
  });

  $: {
    fetch = {
    from: "routes",
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
        fields: ["name", "date_start"],
      },
      {
        name: "Criteria",
        fields: ["all_depots", "all_suppliers"],
      },
      {
        name: "Routes",
        fields: ["routes"],
      },
    ],
  }}
  {fetch}
  bind:data
  schema={routes}
  duplicate={true}
/>
