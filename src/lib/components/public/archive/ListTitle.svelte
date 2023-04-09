<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  export let type = "vehicles";
  let record = {};

  onMount(async () => {
    const { data, error } = await supabase
      .from("constants")
      .select()
      .eq("type", type)
      .single();

    if (error) {
      console.log(error);
    }

    if (data) {
      record = data;
    }
  });
</script>

<div class="h-96 bg-cover bg-center">
  <div
    class="w-full h-full bg-black/20 flex flex-col items-center justify-center text-center p-10"
  >
    <h1 class="text-4xl font-bold text-white mb-4">{record.name}</h1>
    <div class="text-brand-200 text-2xl mb-4">
      {record.subtitle}
    </div>
  </div>
</div>
