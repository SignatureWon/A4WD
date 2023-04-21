<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import { db } from "$lib/db";
  import { packages } from "$lib/schema/packages";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";

  const title = "Bond";
  let fetch = {
    from: "packages",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
  let data = {};

  onMount(async () => {
    data = db.default(packages);
    if (fetch.id !== "add") {
      data = await db.one(fetch);
      ["suppliers"].forEach(key => {
        delete data[key]
      })
    }
  });

  $: {
    fetch = {
      from: "packages",
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
    <Tab label="Compulsory" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form
        structure={{
          name: "",
          sections: [
            {
              name: "Info",
              fields: ["name", "display_name", "code", "date_start"],
            },
            {
              name: "Criteria",
              fields: ["all_suppliers", "all_vehicles"],
            },
            {
              name: "Rate",
              fields: ["nett", "gross", "cap", "deposit", "liability", "bond"],
            },
            {
              name: "Contents",
              fields: ["description", "inclusions"],
            },
            {
              name: "Publish",
              fields: ["status", "rank"],
            },
          ],
        }}
        {fetch}
        bind:data
        schema={packages}
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
                fields: ["compulsory"],
              },
            ],
          }}
          {fetch}
          bind:data
          schema={packages}
          duplicate={true}
        />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs>

<!-- <script>
  import { page } from "$app/stores";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import InputMany from "$lib/components/InputMany.svelte";
  import InputJson from "$lib/components/InputJson.svelte";
  import InputGallery from "$lib/components/InputGallery.svelte";

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
            name: "code",
            label: "Code",
            type: "text",
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
        name: "Rate",
        description: "",
        fields: [
          {
            name: "nett",
            label: "Nett Daily Rate",
            type: "number",
            size: "half",
          },
          {
            name: "gross",
            label: "Gross Daily Rate",
            type: "number",
            size: "half",
          },
          {
            name: "cap",
            label: "Rate Cap (Days)",
            type: "number",
            size: "half",
          },
          {
            name: "deposit",
            label: "Security Deposit",
            type: "number",
            size: "half",
          },
          {
            name: "liability",
            label: "Liability",
            type: "number",
            size: "half",
          },
          {
            name: "bond",
            label: "Bond",
            type: "number",
            size: "half",
          },
          {
            name: "waive_one_way",
            label: "Waive one-way fee",
            type: "switch",
            default: false,
          },
        ],
      },
      {
        name: "Contents",
        description: "",
        fields: [
          {
            name: "description",
            label: "Description",
            type: "textarea",
          },
          {
            name: "inclusions",
            label: "Inclusions",
            type: "textarea",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Bond" table="packages" />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if id !== "add"}
    <Tab label="Compulsory Items" />
    <Tab label="Vehicles" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form form={formGeneral} table="packages" />
    </TabContent>
    {#if id !== "add"}
      <TabContent>
        <InputJson
          table="packages"
          field="compulsory"
          structure={[
            {
              name: "Name",
              placeholder: "Name",
              type: "text",
            },
            {
              name: "Description",
              placeholder: "Description",
              type: "textarea",
            },
            {
              name: "Nett Rate",
              label: "Nett Rate",
              type: "number",
              size: "half",
            },
            {
              name: "Gross Rate",
              label: "Gross Rate",
              type: "number",
              size: "half",
            },
            {
              name: "Quatity",
              label: "Quatity",
              type: "number",
              size: "half",
            },
          ]}
        />
      </TabContent>
      <TabContent>
        <InputMany
          table="packages_vehicles"
          options={{
            table: "left",
            field: "suppliers",
          }}
          addUrl="/admin/vehicles"
        />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs> -->
