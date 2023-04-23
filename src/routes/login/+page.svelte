<script>
  // import { supabase } from "$lib/supabaseClient";
  // import { goto } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  // import AlertError from "$lib/components/AlertError.svelte";
  import {
    Button,
    InlineNotification,
    NotificationActionButton,
    PasswordInput,
    TextInput,
  } from "carbon-components-svelte";

  let loading = false;
  let errors = null;
  let email = "";
  let password = "";

  // const handleForm = async () => {
  //   try {
  //     errors = null;
  //     loading = true;
  //     let { data, error } = await supabase.auth.signInWithPassword({
  //       email: email,
  //       password: password,
  //     });
  //     if (error) throw error;
  //     setTimeout(() => goto("/admin"), 300);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       errors = error;
  //     }
  //     console.log("errorserrors", errors);
  //   } finally {
  //     loading = false;
  //   }
  // };
</script>

<Loading {loading} />

<div
  id="page-container"
  class="flex flex-col mx-auto w-full min-h-screen bg-gray-100"
>
  <main id="page-content" class="flex flex-auto flex-col max-w-full">
    <div
      class="min-h-screen flex flex-col bg-cover bg-bottom"
      style="background-image: url('https://images.unsplash.com/photo-1548504769-900b70ed122e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80');"
    >
      <div class="flex grow md:w-8/12 lg:w-5/12 xl:w-4/12 bg-white shadow-xl">
        <div class="flex flex-col p-8 lg:p-16 xl:p-20 w-full">
          <div class="grow flex items-center">
            <div class="w-full max-w-lg mx-auto space-y-10">
              <div>
                <h1 class="text-4xl font-bold inline-flex items-center mb-4">
                  <img
                    src="/logo.svg"
                    alt="Australia 4WD Rentals"
                    class="w-48"
                  />
                </h1>
                <p class="text-gray-500">
                  Welcome, please sign in to your dashboard
                </p>
              </div>
              {#if errors}
                <InlineNotification
                  hideCloseButton
                  lowContrast
                  kind="error"
                  title=""
                  subtitle={errors.message}
                />
              {/if}

              <form action="?/login" method="POST" class="my-6">
                <TextInput
                  name="email"
                  labelText="Email"
                  placeholder="Enter your email"
                  required
                  on:input={() => (errors = null)}
                  bind:value={email}
                  class="mb-5"
                />
                <PasswordInput
                  name="password"
                  labelText="Password"
                  placeholder="Enter your password"
                  required
                  on:input={() => (errors = null)}
                  bind:value={password}
                  class="mb-5"
                />
                <div class="mb-4">
                  <Button type="submit" class="w-full text-center"
                    >Sign In</Button
                  >
                </div>
                <div>
                  <a href="/password" class="font-medium inline-block"
                    >Forgot Password?</a
                  >
                </div>
              </form>

              <div class="text-sm">
                <span class="text-gray-500">Don’t have an account yet?</span>
                <a href="/signup" class="font-medium">Join us today</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
