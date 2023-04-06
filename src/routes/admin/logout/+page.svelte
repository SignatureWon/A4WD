<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  onMount(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("error", error);
    } else {
      setTimeout(() => goto('/login'), 300);

    }
  });
</script>
