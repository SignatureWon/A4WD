<script>
  import { MultiSelect, Toggle } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let table = "";
  export let selected = [];
  export let options = [];
  export let a = null;
  export let b = null;

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
    labelText={label}
    labelA={a || `All ${label}`}
    labelB={b || `All ${label}`}
    bind:toggled={value}
    on:toggle={(e) => {}}
  />
  <input type="hidden" {name} bind:value={value} />

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
        value={currentSelected.join(",")}
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
    </div>
  {/if}
</div>
