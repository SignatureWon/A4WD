<script>
  import { supabase } from "$lib/supabaseClient";
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/FormClient.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputRoutes from "$lib/components/admin/InputRoutes.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";

  export let data;
  let loading = false;
  let show = false;
  let message = "";

  const updateRoutes = async () => {
    loading = true;
    const { data: data_routes, error: error_routes } = await supabase
      .from("routes")
      .update({
        routes: data.data.routes,
      })
      .eq("id", data.id);

    // console.log({ data: data_routes, error: error_routes });

    message = "Updated successfully";
    show = true;

    loading = false;
  };
</script>

<Loading {loading} />
<Toast bind:show {message} />

<PageTitle title="Addons" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={1} />
<Form id={data.id} path={data.path} update={updateRoutes}>
  <FormSection>
    <InputRoutes bind:value={data.data.routes} depots={data.depots} />
  </FormSection>
</Form>
