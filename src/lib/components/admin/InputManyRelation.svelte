<script>
  import { MultiSelect, Toggle } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let table = "";
  export let selected = [];
  export let options = [];

  const toMultiSelectItem = (arr) => {
    let resp = [];
    arr.forEach((obj) => {
      resp.push({
        id: obj.id,
        text: obj.name,
      });
    });
    return resp;
  };

  console.log("table", table);
  console.log("selected", selected);
  console.log("options", options);
</script>

<div class="md:col-span-2">
  <Toggle
    {name}
    labelText={label}
    labelA="All {label}"
    labelB="All {label}"
    bind:toggled={value}
  />
  {#if !value}
    <div class="mb-4">
      <MultiSelect
        filterable
        titleText=""
        selectedIds={selected}
        placeholder="Select {label}"
        items={toMultiSelectItem(options)}
      />
    </div>
  {/if}
</div>
<!-- on:select={(e) => {
        e.detail.selected.forEach(async (item) => {
          if (!selected.includes(item.id)) {
            data.updated = false;
            let fetch = {
              from: manyTable,
            };
            let newData = {};
            newData[table[0]] = data.id;
            newData[table[1]] = item.id;
            await db.insert(fetch, newData);
            data.updated = true;
          }
        });
        e.detail.unselected.forEach(async (item) => {
          if (selected.includes(item.id)) {              
            data.updated = false;
            await supabase
              .from(manyTable)
              .delete()
              .eq(table[0], data.id)
              .eq(table[1], item.id);
            data.updated = true;
          }
        });
        selected = e.detail.selectedIds;
      }} -->
