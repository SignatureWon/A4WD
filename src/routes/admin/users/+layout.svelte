<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  onMount(async () => {
    const { data, error } = await supabase.auth.getSession()
    // console.log('session', data);
  });
    
</script>

<slot />