<script>
  import { page } from "$app/stores";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import InputJson from "$lib/components/InputJson.svelte";
  import InputRoutes from "$lib/components/InputRoutes.svelte";

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
    ],
  };
  let updateDepots = 1;
</script>

<PageHeader name="Route" table="routes" />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if id !== "add"}
    <!-- <Tab label="Depots" /> -->
    <Tab label="Routes" />
    <!-- <Tab label="Blockout Depots" />
    <Tab label="Blockout Vehicles" /> -->
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form form={formGeneral} table="routes" />
    </TabContent>
    {#if id !== "add"}
      <!-- <TabContent>
        <InputJson
          table="routes"
          field="depots"
          bind:update={updateDepots}
          structure={[
            {
              name: "Depots",
              type: "related",
              related: "depots",
              required: true,
            },
            {
              name: "Address",
              type: "textarea",
            },
            {
              name: "Contact (International)",
              type: "text",
              size: "half",
            },
            {
              name: "Contact (Australia)",
              type: "text",
              size: "half",
            },
          ]}
        />
      </TabContent> -->
      <TabContent>
        <InputRoutes bind:update={updateDepots} />
      </TabContent>
      <!-- <TabContent>
        <InputJson
          table="routes"
          field="depots_restrictions"
          bind:update={updateDepots}
          structure={[
            {
              name: "Depots",
              type: "related",
              related: "depots",
              required: true,
            },
            {
              name: "date_start",
              label: "Closure start",
              name2: "date_end",
              label2: "Closure end",
              type: "daterange",
            },
          ]}
        />
      </TabContent>
      <TabContent>
        <InputJson
          table="routes"
          field="depots_restrictions"
          bind:update={updateDepots}
          structure={[
            {
              name: "Depots",
              type: "related",
              related: "depots",
              required: true,
            },
            {
              name: "date_start",
              label: "Closure start",
              name2: "date_end",
              label2: "Closure end",
              type: "daterange",
            },
          ]}
        />
      </TabContent> -->
    {/if}
  </svelte:fragment>
</Tabs>
