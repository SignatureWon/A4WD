<script>
  import { supabase } from "$lib/supabaseClient";
  import Loading from "$lib/components/Loading.svelte";
  // import AlertError from "$lib/components/AlertError.svelte";
  import { goto } from "$app/navigation";
  import {
    Button,
    Checkbox,
    InlineNotification,
    PasswordInput,
    TextInput,
  } from "carbon-components-svelte";

  let loading = false;
  let errors = null;
  let email = "";
  let password = "";

  const handleForm = async () => {
    try {
      errors = null;
      loading = true;
      let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      goto("/admin");
    } catch (error) {
      if (error instanceof Error) {
        errors = [error.message];
      }
    } finally {
      loading = false;
    }
  };
</script>

<!-- Page Container -->
<Loading {loading} />

<div
  id="page-container"
  class="flex flex-col mx-auto w-full min-h-screen bg-gray-100"
>
  <!-- Page Content -->
  <main id="page-content" class="flex flex-auto flex-col max-w-full">
    <div
      class="min-h-screen flex flex-col bg-cover bg-bottom"
      style="background-image: url('https://images.unsplash.com/photo-1548504769-900b70ed122e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80');"
    >
      <!-- Sign Up Section -->
      <div class="flex grow md:w-8/12 lg:w-5/12 xl:w-4/12 bg-white shadow-xl">
        <div class="flex flex-col p-8 lg:p-16 xl:p-20 w-full">
          <!-- Sign Up Content -->
          <div class="grow flex items-center">
            <div class="w-full max-w-lg mx-auto space-y-10">
              <!-- Header -->
              <div>
                <h1 class="text-4xl font-bold inline-flex items-center mb-4">
                  <img
                    src="/logo.svg"
                    alt="Australia 4WD Rentals"
                    class="w-48"
                  />
                </h1>
                <p class="text-gray-500">
                  Create your own account in one single step
                </p>
              </div>
              <!-- END Header -->

              {#if errors}
                <InlineNotification
                  hideCloseButton
                  lowContrast
                  kind="error"
                  title=""
                  subtitle={errors.message}
                />
              {/if}

              <!-- Sign Up Form -->
              <form on:submit|preventDefault={handleForm} class="my-6">
                <TextInput
                  labelText="Email"
                  placeholder="Enter your email"
                  required
                  on:input={() => (errors = null)}
                  bind:value={email}
                  class="mb-5"
                />
                <PasswordInput
                  labelText="Password"
                  placeholder="Enter your password"
                  required
                  on:input={() => (errors = null)}
                  bind:value={password}
                  class="mb-5"
                />
                <label class="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agree"
                    name="agree"
                    required
                    class="border border-gray-300 h-4 w-4"
                  />
                  <span class="ml-2">
                    I accept <a href="/terms" class="font-medium"
                      >terms &amp; conditions</a
                    ></span
                  >
                </label>
                <div class="mb-4">
                  <Button type="submit" class="w-full text-center"
                    >Create Account</Button
                  >
                </div>
              </form>

              <div class="text-sm">
                <a href="/login" class="font-medium">Return to Sign In</a>
              </div>
            </div>
          </div>
          <!-- END Sign Up Content -->
        </div>
      </div>
      <!-- END Sign Up Section -->
    </div>
  </main>
  <!-- END Page Content -->
</div>
<!-- END Page Container -->
