<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import ManyToMany from "$lib/admin/input/ManyToMany.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import { db } from "$lib/db";
  import { vehicles } from "$lib/schema/vehicles";

  const title = "Vehicle";
  let fetch = {
    from: "vehicles",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };

  let data = db.default(vehicles);

  onMount(async () => {
    if (fetch.id !== "add") {
      data = await db.one(fetch);
      console.log(data);
    }
  });

  $: fetch = {
    from: "vehicles",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
</script>

<Feedback {data} />

<Title {title} {data} />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if fetch.id !== "add"}
    <Tab label="Contents" />
    <Tab label="Categories" />
    <Tab label="Specifications" />
    <Tab label="FAQs" />
    <Tab label="Gallery" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form
        structure={{
          name: "",
          sections: [
            {
              name: "Info",
              fields: ["name", "code", "suppliers"],
            },
            {
              name: "Publish",
              fields: ["status", "rank"],
            },
            {
              name: "Image",
              fields: ["image", "caption"],
            },
            {
              name: "Features",
              fields: [
                "pax",
                "transmission",
                "fuel",
                "wheel",
                "shower",
                "toilet",
              ],
            },
          ],
        }}
        {fetch}
        bind:data
        schema={vehicles}
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
                fields: ["excerpt", "description", "restrictions", "notes"],
              },
            ],
          }}
          {fetch}
          bind:data
          schema={vehicles}
          duplicate={true}
        />
      </TabContent>
      <TabContent>
        <ManyToMany
          table="vehicles_categories"
          options={{
            field: "type",
            value: "vehicles",
          }}
        />
      </TabContent>
      <TabContent>
        <Form
          structure={{
            name: "",
            sections: [
              {
                name: "",
                fields: ["specifications"],
              },
            ],
          }}
          {fetch}
          bind:data
          schema={vehicles}
          duplicate={true}
        />
      </TabContent>
      <TabContent>
        <Form
          structure={{
            name: "",
            sections: [
              {
                name: "",
                fields: ["faqs"],
              },
            ],
          }}
          {fetch}
          bind:data
          schema={vehicles}
          duplicate={true}
        />
      </TabContent>
      <TabContent>
        <Form
          structure={{
            name: "",
            sections: [
              {
                name: "",
                fields: ["images"],
              },
            ],
          }}
          {fetch}
          bind:data
          schema={vehicles}
          duplicate={true}
        />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs>
