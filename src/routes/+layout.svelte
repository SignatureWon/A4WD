<script>
    import { supabase } from "$lib/supabaseClient";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";

    onMount(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            invalidate("supabase:auth");
        });

        return () => {
            subscription.unsubscribe();
        };
    });
    // import "carbon-components-svelte/css/g10.css";
    import "$lib/css/app.css";
</script>

<slot />
