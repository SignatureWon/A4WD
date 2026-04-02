<script>
  import { supabase } from "$lib/supabaseClient";
  export let data;

  const logoutAll = async () => {
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      console.error("Error signing out:", error);
    } else {
      console.log("Successfully signed out");
    }
  };
</script>

<button on:click={logoutAll}>Logout All</button>
