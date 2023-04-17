<script>
  import { db } from "$lib/db";
  import { supabase } from "$lib/supabaseClient";
  import {
    InlineNotification,
    MultiSelect,
    Select,
    SelectItem,
    Toggle,
  } from "carbon-components-svelte";

  export let key = "";
  export let field = {};
  export let data = {};

  let selections = [];
  let selected = [];
  let selectAll = [];
  let manyTable = "";
  let table = [];

  const getData = async () => {
    manyTable = field.options;
    table = manyTable.split("_");

    if (data.id !== "add") {
      const dataSelections = await db.all({
        from: table[1],
        eq: [
          {
            name: "status",
            value: true,
          },
        ],
        order: [
          {
            name: "rank",
            ascend: true,
          },
        ],
      });
      selections = [];
      selectAll = [];
      dataSelections.forEach((item) => {
        selections.push({
          id: item.id,
          text: item.name,
        });
        selectAll.push(item.id);
      });

      const dataSelected = await db.all({
        from: field.options,
        eq: [
          {
            name: table[0],
            value: data.id,
          },
        ],
      });
      selected = [];
      dataSelected.forEach((item) => {
        selected.push(item[table[1]]);
      });
    }
  };

  $: {
    if (data.id) {
      getData();
    }
  }
</script>

{#if data.id}
  <Toggle
    name={key}
    labelText={field.label}
    labelA="All"
    labelB="All"
    bind:toggled={data[key]}
    required={field.required}
    on:toggle={async (e) => {
      let fetch = {
        from: table[0],
        id: data.id,
      };
      let newData = {};
      newData[key] = e.detail.toggled;
      data.updated = false;
      await db.update(fetch, newData);

      if (e.detail.toggled) {
        selectAll.forEach(async (item) => {
          if (!selected.includes(item)) {
            data.updated = false;
            let fetch = {
              from: manyTable,
            };
            let newData = {};

            newData[table[0]] = data.id;
            newData[table[1]] = item;

            await db.insert(fetch, newData);
            selected.push(item)
            data.updated = true;
          }
        });
      }
      data.updated = true;
    }}
  />
  {#if !data[key]}
    <div class="mb-4">
      <MultiSelect
        filterable
        titleText=""
        selectedIds={selected}
        placeholder={`Select ${table[1]}`}
        items={selections}
        on:select={(e) => {
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
        }}
      />
    </div>
  {/if}
{:else}
  <div class="text-sm font-bold tracking-wide">{field.label}</div>
  <InlineNotification
    hideCloseButton
    lowContrast
    kind="warning"
    title="Not available: "
    subtitle="Will be enabled after added this record"
  />
{/if}
