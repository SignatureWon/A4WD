<script>
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import List from "$lib/components/public/archive/List.svelte";
  import ListTitle from "$lib/components/public/archive/ListTitle.svelte";
  import ListFilter from "$lib/components/public/archive/ListFilter.svelte";
  import Destination from "$lib/components/public/archive/card/Destination.svelte";

  let records = [];
</script>

<PageHeader>
  <ListTitle type="destinations" />
</PageHeader>
<ListFilter />
<List
  bind:records
  fetch={{
    from: "contents",
    select: "id, image, caption, name",
    eq: [{name: "type", value: "destinations"}],
  }}
>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    {#each records as record}
      <Destination {record} />
    {/each}
  </div>
</List>
