<script>
  import { Button, TextInput } from "carbon-components-svelte";
</script>

<div class="p-4 bg-white">
  <div class="mx-auto max-w-lg p-4">
    <h1 class="text-3xl font-bold mb-10">Check your quote</h1>
    <form action="/booking/detail" method="post">
      <TextInput
        name="email"
        labelText="Your Email Address"
        type="email"
        value=""
        class="mb-5"
        required
      />
      <TextInput
        name="last_name"
        labelText="Your Last Name"
        value=""
        class="mb-5"
        required
      />
      <TextInput
        name="reference"
        labelText="Reference Number"
        value=""
        class="mb-10"
        required
      />
      <div class="text-center">
        <Button type="submit" class="px-10">Check</Button>
      </div>
    </form>
  </div>
</div>
