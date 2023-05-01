<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import { db } from "$lib/db";
  import { suppliers } from "$lib/schema/suppliers";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";

  const title = "Supplier";
  let fetch = {
    from: "suppliers",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
  let data = {};

  onMount(async () => {
    data = db.default(suppliers);
    if (fetch.id !== "add") {
      data = await db.one(fetch);
    }
  });

  $: {
    fetch = {
      from: "suppliers",
      select: "*",
      id: $page.params.id,
      url: $page.url.pathname,
      parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
    };
  }
</script>

<Feedback {data} />

<Title {title} {data} />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if fetch.id !== "add"}
    <Tab label="Depots" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form
        structure={{
          name: "",
          sections: [
            {
              name: "Info",
              fields: ["name", "url", "phone"],
            },
            {
              name: "Publish",
              fields: ["status", "rank"],
            },
          ],
        }}
        {fetch}
        bind:data
        schema={suppliers}
        duplicate={true}
      />
    </TabContent>
    {#if fetch.id !== "add"}
      <TabContent>
        <Form
          structure={{
            name: "",
            sections: [
              {
                name: "",
                fields: ["depots"],
              },
            ],
          }}
          {fetch}
          bind:data
          schema={suppliers}
          duplicate={true}
        />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs>
