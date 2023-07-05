<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  onMount(() => {
    setTimeout(() => {
      goto(`/admin/sales/search`);
    }, 500);
  });
</script>
