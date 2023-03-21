<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import Form from "$lib/components/Form.svelte";
  import CustomFields from "$lib/components/CustomFields.svelte";
  import Automations from "$lib/components/Automations.svelte";
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
            name: "unit",
            label: "Unit",
            type: "related",
            related: "units",
          },
          {
            name: "price",
            label: "Starting Price",
            type: "number",
          },
        ],
      },
      {
        name: "Content",
        description: "",
        fields: [
          {
            name: "description",
            label: "Description",
            type: "textarea",
          },
          {
            name: "excerpt",
            label: "Excerpt",
            type: "text",
          },
          {
            name: "image",
            label: "Featured Image",
            type: "image",
            bucket: "services",
            format: ["*.jpg", "*.png", "*.gif"],
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Service" />
<Tabs>
  <Tab label="General" />
  <Tab label="Fields" />
  <Tab label="Automations" />
  <svelte:fragment slot="content">
    <TabContent>
      <Form {form} table="services" />
    </TabContent>
    <TabContent>
      <CustomFields ref="id" />
    </TabContent>
    <TabContent>
      <Automations ref="id" />
    </TabContent>
  </svelte:fragment>
</Tabs>
