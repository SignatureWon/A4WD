<script>
  import { supabase } from "$lib/supabaseClient";
  import {
    Button,
    DataTable,
    Modal,
    Pagination,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";

  export let field = {};
  export let record = {};

  let modalLink = false;
  let pageSize = 100;
  let page = 1;
  let rows = [];
  let filteredRowIds = [];

  const getRows = async () => {
    const { data: contents } = await supabase
      .from("contents")
      .select("id, name, type, slug")
      .in("type", ["articles", "destinations", "pages", "vehicles"])
      .order("type", { ascending: true })
      .order("name", { ascending: true });
    // rows = contents;

    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id, name, type, slug")
      .order("name", { ascending: true });
    rows = [...contents, ...vehicles];
  };

  const setLink = (detail) => {
    const dir = {
      pages: "/",
      articles: "/blog/",
      destinations: "/destinations/",
      vehicles: "/vehicles/",
    };
    record[field.name] = `${dir[detail.type]}${detail.slug}`;
    modalLink = false;
  };
</script>

<div class="flex">
  <div class="flex-1">
    <TextInput
      labelText={field.label}
      name={field.name}
      placeholder={field.placeholder}
      bind:value={record[field.name]}
      required={field.required || false}
    />
  </div>
  <div>
    <Button
      class="mt-6 !bg-gray-200"
      kind="ghost"
      on:click={() => {
        getRows();
        modalLink = true;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
        class="w-4 h-4"
        ><path
          d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM13.529 14.4464C11.9951 15.3524 9.98633 15.1464 8.66839 13.8284C7.1063 12.2663 7.1063 9.73367 8.66839 8.17157C10.2305 6.60948 12.7631 6.60948 14.3252 8.17157C15.6432 9.48951 15.8492 11.4983 14.9432 13.0322L17.1537 15.2426L15.7395 16.6569L13.529 14.4464ZM12.911 12.4142C13.6921 11.6332 13.6921 10.3668 12.911 9.58579C12.13 8.80474 10.8637 8.80474 10.0826 9.58579C9.30156 10.3668 9.30156 11.6332 10.0826 12.4142C10.8637 13.1953 12.13 13.1953 12.911 12.4142Z"
          fill="#000"
        /></svg
      >
    </Button>
  </div>
</div>

<Modal
  size="md"
  bind:open={modalLink}
  modalHeading="Contents"
  passiveModal
  hasScrollingContent
>
  <DataTable
    sortable
    title=""
    description=""
    headers={[
      { key: "name", value: "Name" },
      { key: "type", value: "Type" },
    ]}
    {pageSize}
    {page}
    {rows}
    on:click:row={(row) => {
      setLink(row.detail);
    }}
    class="cursor-pointer"
  >
    <Toolbar class="mb-4">
      <ToolbarContent>
        <ToolbarSearch
          size="lg"
          persistent
          value=""
          shouldFilterRows
          bind:filteredRowIds
        />
      </ToolbarContent>
    </Toolbar>
  </DataTable>
  <Pagination
    bind:pageSize
    bind:page
    totalItems={rows.length}
    pageSizeInputDisabled
  />
</Modal>
