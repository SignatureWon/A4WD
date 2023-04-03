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
            required: true,
          },
          {
            name: "suppliers",
            label: "Supplier",
            type: "related",
            related: "suppliers",
          },
      //   ],
      // },
      // {
      //   name: "Status",
      //   description: "",
      //   fields: [
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
          {
            name: "image",
            label: "Image",
            type: "image",
            bucket: "contents",
          },
        ],
      },
      {
        name: "Features",
        description: "",
        fields: [
          {
            name: "pax",
            label: "Pax",
            type: "number",
          },
          {
            name: "transmission",
            label: "Transmission",
            type: "select",
            options: [
              {
                id: "Automatic",
                name: "Automatic",
              },
              {
                id: "Manual",
                name: "Manual",
              },
            ],
          },
          {
            name: "fuel",
            label: "Fuel",
            type: "select",
            options: [
              {
                id: "Diesel",
                name: "Diesel",
              },
              {
                id: "Petrol",
                name: "Petrol",
              },
            ],
          },
          {
            name: "wheel",
            label: "Driven Wheel",
            type: "select",
            options: [
              {
                id: "4WD",
                name: "4WD",
              },
              {
                id: "2WD",
                name: "2WD",
              },
            ],
          },
          {
            name: "shower",
            label: "Shower",
            type: "switch",
          },
          {
            name: "toilet",
            label: "Toilet",
            type: "switch",
          },
        ],
      },
    ],
  };
  const formContents = {
    name: "",
    groups: [
      {
        name: "",
        description: "",
        fields: [
          {
            name: "excerpt",
            label: "Short Description",
            type: "text",
          },
          // {
          //   name: "richtext",
          //   label: "Description",
          //   type: "richtext",
          // },
          {
            name: "description",
            label: "Description",
            type: "richtext",
          },
          {
            name: "restrictions",
            label: "Restrictions",
            type: "richtext",
          },
          {
            name: "notes",
            label: "Notes",
            type: "richtext",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Vehicle" table="vehicles" />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  {#if id !== "add"}
    <Tab label="Contents" />
    <Tab label="Categories" />
    <Tab label="Specifications" />
    <Tab label="FAQs" />
    <Tab label="Gallery" />
  {/if}
  <svelte:fragment slot="content">
    <TabContent>
      <Form form={formGeneral} table="vehicles" duplicate={true} />
    </TabContent>
    {#if id !== "add"}
      <TabContent>
        <Form form={formContents} table="vehicles" />
      </TabContent>
      <TabContent>
        <InputMany
          table="vehicles_categories"
          options={{
            field: "type",
            value: "vehicles",
          }}
        />
      </TabContent>
      <TabContent>
        <InputJson
          table="vehicles"
          field="specifications"
          structure={[
            {
              name: "Title",
              placeholder: "Title",
              type: "text",
            },
            {
              name: "Description",
              placeholder: "Description",
              type: "textarea",
            },
          ]}
        />
      </TabContent>
      <TabContent>
        <InputJson
          table="vehicles"
          field="faqs"
          structure={[
            {
              name: "Title",
              placeholder: "Title",
              type: "text",
            },
            {
              name: "Question",
              placeholder: "Question",
              type: "textarea",
            },
            {
              name: "Answer",
              placeholder: "Answer",
              type: "textarea",
            },
          ]}
        />
      </TabContent>
      <TabContent>
        <InputGallery table="vehicles" field="images" />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs>
