<script>
  import { Button } from "carbon-components-svelte";
  export let data;
  export let form;
  console.log({
    data, form
  });
</script>

<div class="p-5">
  <div class="p-8 bg-white">
    <h1 class="text-2xl">Thank you for subscribing!</h1>
    <p class="text-lg text-gray-600 mb-10">We're so glad to have you with us! Now that you've subscribed, you'll receive updates on planning your next trip.</p>
    <div>
      <Button href="/">Back to home</Button>
    </div>
  </div>
</div>
