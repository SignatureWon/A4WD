<script>
  import { Button } from "carbon-components-svelte";

  export let id = "add";
  export let path = "/";

  let action = "?/insert";
</script>

<form method="POST" {action} class="bg-white divide-y divide-gray-200">
  <slot />
  <footer class="flex justify-between p-5">
    <div class="flex">
      {#if id !== "add"}
        <Button
          kind="danger-tertiary"
          type="submit"
          on:click={(e) => {
            action = "?/delete";
          }}
        >
          <span class="hidden md:inline-block">Delete</span>
          <span class="inline-block md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="w-5 h-5"
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z" /><path
                d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
              />
            </svg>
          </span>
        </Button>
        <Button
          kind="ghost"
          type="submit"
          on:click={(e) => {
            action = "?/duplicate";
          }}
        >
          <span class="hidden md:inline-block">Duplicate</span>
          <span class="inline-block md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="w-5 h-5"
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z" /><path
                d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z"
              />
            </svg>
          </span>
        </Button>
      {/if}
    </div>
    <div class="flex">
      {#if id !== "add"}
        <Button kind="ghost" href={path.replace(id, "")}>Back</Button>
        <Button
          type="submit"
          on:click={(e) => {
            action = "?/update";
          }}>Update</Button
        >
      {:else}
        <Button
          type="submit"
          on:click={(e) => {
            action = "?/insert";
          }}>Create</Button
        >
      {/if}
    </div>
  </footer>
</form>
