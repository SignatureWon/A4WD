<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import { Button, Checkbox } from "carbon-components-svelte";

  export let table = "left_right";
  export let options = {
    table: "table",
    field: "field",
    value: "value",
  };

  export let addUrl = "";

  const id = $page.params.id;

  let relatedTables = table.split("_");

  if (addUrl === "") {
    addUrl = relatedTables[1];
  }

  let manyRecords = [];
  let leftRecords = false;
  let rightRecords = [];

  let loading = false;
  let show = false;
  let message = "";
  let errors = {};

  onMount(() => {
    getRecord();
  });

  const getRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .select()
        .eq(relatedTables[0], id);

      if (error) throw error;

      if (data) {
        manyRecords = data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }

    try {
      loading = true;

      if (options.table === "left") {
        const { data, error } = await supabase
          .from(relatedTables[0])
          .select()
          .eq("id", id)
          .single();

        if (data) {
          leftRecords = data;
        }
      }

      if (leftRecords) {
        options.value = leftRecords[options.field];
      }

      const { data, error } = await supabase
        .from(relatedTables[1])
        .select()
        .eq(options.field, options.value);

      if (error) throw error;

      if (data) {
        rightRecords = data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };
  const updateRecord = async (record) => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .upsert(record)
        .select();

      if (error) throw error;
    } catch (error) {
      errors = error;
    } finally {
      message = "Updated successfully";
      show = true;
      loading = false;
    }
  };

  const deleteRecord = async (leftID, rightID) => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq(relatedTables[0], leftID)
        .eq(relatedTables[1], rightID);

      if (error) throw error;
    } catch (error) {
      errors = error;
    } finally {
      message = "Deleted successfully";
      show = true;
      loading = false;
    }
  };
</script>

<Loading {loading} />
<Toast bind:show {message} />

<div class="bg-white">
  {#if rightRecords.length === 0}
    <div class="px-4 py-20 text-center border-b border-gray-200">
      <div class="pb-4">No {relatedTables[1]} yet</div>
      <Button href={addUrl} class="inline-block">Add new</Button>
    </div>
  {:else}
    <div class="p-5">
      {#each rightRecords as record}
        <Checkbox
          labelText={record.name}
          checked={manyRecords.find(
            (item) => item[relatedTables[1]] === record.id
          )
            ? true
            : false}
          on:check={(e) => {
            if (e.detail === true) {
              let selected = {};
              selected[relatedTables[0]] = id;
              selected[relatedTables[1]] = record.id;
              updateRecord(selected);
              manyRecords.push(selected);
            } else {
              deleteRecord(id, record.id);
              let newSelected = manyRecords.filter(function (item) {
                return item[relatedTables[1]] !== record.id;
              });
              manyRecords = newSelected;
            }
          }}
        />
      {/each}
    </div>
  {/if}
</div>
