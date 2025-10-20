<script>
  import { Button } from "carbon-components-svelte";
  import { page } from "$app/stores";
  // import { html } from "$lib/email/confirmation.js";
  import { html as quote } from "$lib/email/quotation.js";
  import { html as pt } from "$lib/email/provisional.js";
  import { html as ft } from "$lib/email/final.js";
  import { html as booking } from "$lib/email/booking.js";
  import { onMount } from "svelte";

  let email = "";
  let type = "quote";
  let id = 1175;

  onMount(async () => {
    //change all to lowercase
    let type = ($page.url.searchParams.get("type") || "quote").toLowerCase();
    let id = $page.url.searchParams.get("id") || "1175";

    if (type === "quote") {
      email = await quote.create(Number(id));
    } else if (type === "pt") {
      email = await pt.create(Number(id));
    } else if (type === "ft") {
      email = await ft.create(Number(id));
    } else if (type === "booking") {
      email = await booking.create(Number(id));
    }
  });
</script>

<!-- <form action="?/email" method="POST">
  <Button type="submit" class="w-full">Test Send</Button>
</form>
 -->
{@html email}
