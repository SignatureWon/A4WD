<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Feedback from "$lib/components/Feedback.svelte";
  import Title from "$lib/admin/Title.svelte";
  import Form from "$lib/admin/input/Form.svelte";
  import ManyToMany from "$lib/admin/input/ManyToMany.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import { db } from "$lib/db";
  import { forms } from "$lib/schema/forms";

  const title = "Booking";
  let fetch = {
    from: "forms",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };

  let data = db.default(forms);

  onMount(async () => {
    if (fetch.id !== "add") {
      data = await db.one(fetch);
    }
  });

  $: fetch = {
    from: "forms",
    select: "*",
    id: $page.params.id,
    url: $page.url.pathname,
    parent: $page.url.pathname.replace(`/${$page.params.id}`, ""),
  };
</script>

<Feedback {data} />

<Title {title} {data} />
<Form
structure={{
  name: "",
  sections: [
    {
      name: "Customer Information",
      fields: ["reference", "title", "first_name", "last_name", "address_1", "address_2", "city", "state", "postcode", "country", "phone", "email"],
    },
    {
      name: "Arrival Information",
      fields: ["arrival_by", "flexibility", "arrival_date", "arrival_flight"],
    },
    {
      name: "Vehicle Information",
      fields: ["suppliers", "categories", "vehicles"],
    },
    {
      name: "Driver Information",
      fields: ["licenses", "ages", "bonds", "comments"],
    },
    {
      name: "Travel Information",
      fields: ["pickup_depot", "dropoff_depot", "pickup_date", "count_adults", "count_children"],
    },
    {
      name: "Passenger Information",
      fields: ["guests"],
    },
    {
      name: "Payment Information",
      fields: ["pay_arrangement", "pay_amount", "card_type", "card_name", "card_number", "card_month", "card_year", "card_code", "card_comments"],
    },
  ],
}}
{fetch}
bind:data
schema={forms}
duplicate={true}
/>
<!-- 
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
              name: "Customer Information",
              fields: ["reference", "title", "first_name", "last_name", "address_1", "address_2", "city", "state", "postcode", "country", "phone", "email"],
            },
            {
              name: "Arrival Information",
              fields: ["arrival_by", "flexibility", "arrival_date", "arrival_flight"],
            },
            {
              name: "Vehicle Information",
              fields: ["suppliers", "categories", "vehicles"],
            },
            {
              name: "Driver Information",
              fields: ["licenses", "ages"],
            },
            {
              name: "Travel Information",
              fields: ["pickup_depot", "dropoff_depot", "pickup_date", "dropoff_date", "count_adults", "count_children"],
            },
            {
              name: "Passenger Information",
              fields: ["guests"],
            },
          ],
        }}
        {fetch}
        bind:data
        schema={forms}
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
          schema={forms}
          duplicate={true}
        />
      </TabContent>
      <TabContent>
        <ManyToMany
          table="forms_categories"
          options={{
            field: "type",
            value: "forms",
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
          schema={forms}
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
          schema={forms}
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
          schema={forms}
          duplicate={true}
        />
      </TabContent>
    {/if}
  </svelte:fragment>
</Tabs> -->
