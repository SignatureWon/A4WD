<script>
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import List from "$lib/components/public/archive/List.svelte";
  import ListTitle from "$lib/components/public/archive/ListTitle.svelte";
  import ListFilter from "$lib/components/public/archive/ListFilter.svelte";
  import Vehicle from "$lib/components/public/archive/card/Vehicle.svelte";

  let records = [];
</script>

<PageHeader>
  <ListTitle type="vehicles" />
</PageHeader>
<ListFilter
  filters={[
    {
      key: "wheel",
      label: "Type",
      options: [
        {
          key: "4WD",
          label: "4WD",
        },
        {
          key: "2WD",
          label: "2WD",
        },
      ],
    },
  ]}
/>
<List
  bind:records
  fetch={{
    from: "vehicles",
    select: "*",
  }}
>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    {#each records as record}
      <Vehicle {record} />
    {/each}
  </div>
</List>
