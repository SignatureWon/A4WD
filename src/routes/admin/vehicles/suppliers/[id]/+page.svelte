<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import InputJson from "$lib/components/InputJson.svelte";
  import { page } from "$app/stores";
  const id = $page.params.id;
  const form = {
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
            name: "url",
            label: "Check-in URL",
            type: "text",
          },
          {
            name: "phone",
            label: "Customer Service Number",
            type: "text",
          },
          {
            name: "status",
            label: "Status",
            toggle: "Active",
            type: "switch",
            size: "half",
          },
          {
            name: "rank",
            label: "Rank",
            type: "number",
            size: "half",
          },
        ],
      },
    ],
  };
  let updateDepots = 1;
</script>

<PageHeader name="Supplier" table="suppliers" />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if id !== "add"}
    <Tab label="Depots" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form {form} table="suppliers" duplicate={true} />
    </TabContent>
    {#if id !== "add"}
      <TabContent>
        <InputJson
          table="suppliers"
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
              placeholder: "Address",
            },
            {
              name: "Contact (International)",
              type: "text",
              size: "half",
              placeholder: "Contact (International)",
            },
            {
              name: "Contact (Australia)",
              type: "text",
              size: "half",
              placeholder: "Contact (Australia)",
            },
          ]}
        />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs>
