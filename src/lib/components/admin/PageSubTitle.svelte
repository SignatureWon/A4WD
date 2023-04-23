<script>
  export let id = "";
  export let title = "Title";
  export let data = false;
</script>

<div class="p-5">
  <h2 class="text-lg font-bold">
    {#if data}
      {#if id === "add"}
        Add {title}
      {:else}
        Edit {data.name}
      {/if}
    {:else}
      {title}
    {/if}
  </h2>
</div>
