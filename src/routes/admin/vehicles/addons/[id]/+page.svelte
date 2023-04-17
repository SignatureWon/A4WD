<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import { db } from "$lib/db";
  import { addons } from "$lib/schema/addons";

  const title = "Addon";
  let fetch = {
    from: "addons",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.slice(0, $page.url.pathname.lastIndexOf(`/${$page.params.id}`))
    // parent: $page.url.pathname.replace(new RegExp(`/${$page.params.id}` + '$'), ""),
  };
  let data = {};

  onMount(async () => {
    data = db.default(addons);
    if (fetch.id !== "add") {
      data = await db.one(fetch);
    }
  });

  $: {
    fetch = {
    from: "addons",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.slice(0, $page.url.pathname.lastIndexOf(`/${$page.params.id}`))
    // parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
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
        fields: ["name", "date_start", "link"],
      },
      {
        name: "Criteria",
        fields: ["all_suppliers", "all_vehicles"],
      },
      {
        name: "Addons",
        fields: ["addons"],
      },
    ],
  }}
  {fetch}
  bind:data
  schema={addons}
  duplicate={true}
/>
