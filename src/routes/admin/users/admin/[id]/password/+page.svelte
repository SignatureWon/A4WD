<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputPassword from "$lib/components/admin/InputPassword.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="User" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.type, data.id)} selected={1} />
<Form id={data.id} path={data.path}>
  <FormSection title="Reset user password">
    <InputPassword
      name="password"
      label="New Password"
      required={true}
    />
  </FormSection>
</Form>
