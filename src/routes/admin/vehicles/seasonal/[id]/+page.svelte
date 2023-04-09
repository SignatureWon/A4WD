<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import { db } from "$lib/db";
  import { rates } from "$lib/schema/rates";

  const title = "Seasonal";
  let fetch = {
    from: "rates",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };

  // set default
  rates.type.default = "seasonal"

  let data = db.default(rates);

  onMount(async () => {
    if (fetch.id !== "add") {
      data = await db.one(fetch);
      rates.fees.type = "seasonal"
      rates.fees.related = data.suppliers
    }
  });

  $: fetch = {
    from: "rates",
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
    <Tab label="Rates" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form
        structure={{
          name: "",
          sections: [
            {
              name: "Info",
              fields: ["name", "suppliers", "date_start", "calendar"],
            },
            {
              name: "Driver",
              fields: ["license", "age"],
            },
            {
              name: "Factors",
              fields: ["nett", "gross", "type"],
            },
          ],
        }}
        {fetch}
        bind:data
        schema={rates}
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
                fields: ["fees"],
              },
            ],
          }}
          {fetch}
          bind:data
          schema={rates}
          duplicate={true}
        />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs>

<!-- <script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  import InputSeasonal from "$lib/components/InputSeasonal.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import { page } from "$app/stores";

  const id = $page.params.id;

  const formGeneral = {
    name: "",
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
            name: "suppliers",
            label: "Supplier",
            type: "related",
            related: "suppliers",
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
        name: "Driver",
        description: "",
        fields: [
          {
            name: "license",
            label: "License",
            type: "related",
            related: "constants",
            filters: [{ type: "eq", column: "type", value: "licenses" }],
          },
          {
            name: "age",
            label: "Age",
            type: "related",
            related: "constants",
            filters: [{ type: "eq", column: "type", value: "ages" }],
          },
          // {
          //   name: "license",
          //   label: "License",
          //   type: "select",
          //   options: [
          //     {
          //       id: "All",
          //       name: "All",
          //     },
          //     {
          //       id: "International",
          //       name: "International",
          //     },
          //     {
          //       id: "AU/NZ",
          //       name: "AU/NZ",
          //     },
          //   ],
          // },
          // {
          //   name: "age",
          //   label: "Age",
          //   type: "select",
          //   options: [
          //     {
          //       id: "All",
          //       name: "All",
          //     },
          //     {
          //       id: "18-21",
          //       name: "18-21",
          //     },
          //     {
          //       id: "21+",
          //       name: "21+",
          //     },
          //     {
          //       id: "25+",
          //       name: "25+",
          //     },
          //   ],
          // },
        ],
      },
      {
        name: "Factors",
        description: "",
        fields: [
          {
            name: "nett",
            label: "Nett Factor (Percentage)",
            type: "number",
            step: 0.01,
            default: 1,
          },
          {
            name: "gross",
            label: "Gross Factor (Percentage)",
            type: "number",
            step: 0.01,
            default: 1,
          },
          {
            name: "type",
            type: "hidden",
            default: "seasonal",
          },
        ],
      },
    ],
  };
  let updateFlex = 1;
</script>

<PageHeader name="Seasonal" table="rates" />

<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if id !== "add"}
    <Tab label="Rates" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form form={formGeneral} table="rates" bind:update={updateFlex} />
    </TabContent>
    {#if id !== "add"}
      <TabContent>
        <InputSeasonal />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs> -->
