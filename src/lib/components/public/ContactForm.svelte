<script>
  import { Button, TextArea, TextInput } from "carbon-components-svelte";

  export let content;
  let msg = {
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    message: "",
  };
</script>

<div class="bg-cover" style="background-image: url('/img/bg-contact.jpg');">
  <div class="bg-brand-700/90">
    <div class="container xl:max-w-7xl mx-auto px-4 py-16 lg:px-8 lg:py-32">
      <div class="flex flex-col lg:flex-row space-y-16 lg:space-y-0 lg:space-x-16">
        <!-- Heading with Company Info -->
        <div class="lg:w-2/5 text-white">
          <div class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-400">
            {content.name}
          </div>
          <h2 class="text-xl font-extrabold mb-4">
            {content.subtitle}
          </h2>
          <div class="text-white/60 leading-relaxed">
            {@html content.description}
          </div>
        </div>
        <!-- END Heading with Company Info -->

        <!-- Contact Form -->
        <div class="lg:w-3/5 p-2 bg-white bg-opacity-10 rounded-xl">
          <form method="post" action="/api/email" class="bg-white rounded-lg p-6 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-1">
                <TextInput name="first_name" labelText="First Name" bind:value={msg.first_name} required />
              </div>
              <div class="space-y-1">
                <TextInput name="last_name" labelText="Last Name" bind:value={msg.last_name} required />
              </div>
            </div>
            <div class="space-y-1">
              <TextInput name="email" labelText="Email" type="email" bind:value={msg.email} required />
            </div>
            <div class="space-y-1">
              <TextInput name="phone" labelText="Phone" bind:value={msg.phone} required />
            </div>
            <div class="space-y-1">
              <TextArea name="message" labelText="Message" bind:value={msg.message} required />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </div>
        <!-- END Contact Form -->
      </div>
    </div>
  </div>
</div>
