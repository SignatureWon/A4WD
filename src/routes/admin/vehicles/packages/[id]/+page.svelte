<script>
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
</Tabs>
