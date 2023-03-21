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
</script>

<PageHeader name="Addons" table="addons" />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if id !== "add"}
  <Tab label="Addons" />
  <Tab label="Vehicles" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form form={formGeneral} table="addons" />
    </TabContent>
    {#if id !== "add"}
      <TabContent>
        <InputJson
          table="addons"
          field="addons"
          structure={[
            {
              name: "Name",
              type: "text",
            },
            {
              name: "Description",
              type: "textarea",
            },
            {
              name: "Type",
              type: "select",
              options: [
                {
                  id: "Per Day",
                  name: "Per Day",
                },
                {
                  id: "Per Purchase",
                  name: "Per Purchase",
                },
                {
                  id: "Per Rental",
                  name: "Per Rental",
                },
                {
                  id: "Per Vehicle",
                  name: "Per Vehicle",
                },
              ],
            },
            {
              name: "Nett Rate",
              type: "number",
              size: "half",
            },
            {
              name: "Gross Rate",
              type: "number",
              size: "half",
            },
            {
              name: "Nett Cap",
              type: "number",
              size: "half",
            },
            {
              name: "Gross Cap",
              type: "number",
              size: "half",
            },
            {
              name: "Maximum Quatity",
              type: "number",
              size: "half",
            },
            {
              name: "Included in inclusive",
              type: "switch",
              size: "half",
            },
          ]}
        />
      </TabContent>
      <TabContent>
        <InputMany
          table="addons_vehicles"
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
