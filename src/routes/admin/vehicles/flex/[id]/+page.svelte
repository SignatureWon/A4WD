<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  import InputFlex from "$lib/components/InputFlex.svelte";
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
            filters: [{ type: "eq", column: "type", value: "licenses" }]
          },
          {
            name: "age",
            label: "Age",
            type: "related",
            related: "constants",
            filters: [{ type: "eq", column: "type", value: "ages" }]
          },
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
        ],
      },
      {
        name: "Rate",
        description: "",
        fields: [
          {
            name: "matrix",
            label: "Matrix",
            type: "textarea",
            required: true,
          },
          {
            name: "data",
            label: "Data",
            type: "textarea",
            required: true,
          },
          {
            name: "zero",
            label: "Matrix starts from zero",
            type: "switch",
          },
          {
            name: "type",
            type: "hidden",
            default: "flex",
          },
        ],
      },
    ],
  };
  let updateFlex = 1;
</script>

<PageHeader name="Flex" table="rates" />

<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if id !== "add"}
    <Tab label="Fees" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form form={formGeneral} table="rates" bind:update={updateFlex} />
    </TabContent>
    {#if id !== "add"}
      <TabContent>
        <InputFlex bind:update={updateFlex} />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs>
