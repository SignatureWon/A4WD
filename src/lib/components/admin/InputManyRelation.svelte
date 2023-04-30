<script>
  import { MultiSelect, Toggle } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let table = "";
  export let selected = [];
  export let options = [];

  let currentSelected = []
  let userSelected = [];
  let userUnselected = [];

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

  const getIds = (arr) => {
    let resp = [];
    arr.forEach((obj) => {
      resp.push(obj.id);
    });
    return resp.join(",");
  };

  selected.forEach(item => {
    currentSelected.push(item[table.split("_")[1]])
  })


  // console.log("table", table);
  // console.log("selected", selected);
  // console.log("options", options);
</script>

<div class="md:col-span-2">
  <Toggle
    {name}
    labelText={label}
    labelA="All {label}"
    labelB="All {label}"
    bind:toggled={value}
    on:toggle={(e) => {}}
  />
  {#if !value}
    <div class="mb-4">
      <MultiSelect
        filterable
        titleText=""
        selectedIds={currentSelected}
        placeholder="Select {label}"
        items={toMultiSelectItem(options)}
        on:select={(e) => {
          userSelected = getIds(e.detail.selected);
          userUnselected = getIds(e.detail.unselected);
        }}
      />
      <input
        type="hidden"
        name="manySelected_{name}"
        value={selected.join(",")}
      />
      <input
        type="hidden"
        name="manyNewSelected_{name}"
        value={userSelected}
      />
      <input
        type="hidden"
        name="manyUnSelected_{name}"
        value={userUnselected}
      />
      <input type="hidden" name="manyTable_{name}" value={table} />
      <!-- <input type="hidden" name="manyID_{name}" value={id} /> -->
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
