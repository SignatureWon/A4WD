<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "General",
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
            name: "booking_start",
            label: "Booking Start Date",
            name2: "booking_end",
            label2: "Booking End Date",
            type: "daterange",
          },
          {
            name: "travel_start",
            label: "Travel Start Date",
            name2: "travel_end",
            label2: "Travel End Date",
            type: "daterange",
          },
        ],
      },
      {
        name: "Payment",
        description: "",
        fields: [
          {
            name: "deposit",
            label: "Deposit",
            type: "number",
          },
          {
            name: "balance",
            label: "Balance Due (Days)",
            type: "number",
          },
          {
            name: "reminder",
            label: "Reminder (Days)",
            type: "number",
          },
        ],
      },
      {
        name: "Documents",
        description: "",
        fields: [
          {
            name: "summary",
            label: "Summary of Terms",
            type: "file",
            bucket: "terms"
          },
          {
            name: "confirmation",
            label: "Booking Confirmation Terms",
            type: "file",
            bucket: "terms"
          },
          {
            name: "counter",
            label: "Counter Agreement",
            type: "file",
            bucket: "terms"
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Terms" table="terms" />
<Form {form} table="terms" />
