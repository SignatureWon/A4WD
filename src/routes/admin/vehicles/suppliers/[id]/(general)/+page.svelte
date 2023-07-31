<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
  if (!data.data.daily_time) {
    data.data.daily_time = {
      d0: {start: "09:00", end: "16:00"},
      d1: {start: "09:00", end: "16:00"},
      d2: {start: "09:00", end: "16:00"},
      d3: {start: "09:00", end: "16:00"},
      d4: {start: "09:00", end: "16:00"},
      d5: {start: "09:00", end: "16:00"},
      d6: {start: "09:00", end: "16:00"}
    }
  }
</script>

<PageTitle title="Supplier" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText name="name" label="Name" bind:value={data.data.name} required={true} />
    <InputText name="url" label="Check-in URL" bind:value={data.data.url} />
    <InputText name="phone" label="Customer Service Number" bind:value={data.data.phone} />
  </FormSection>
  <FormSection title="Time">
    <InputToggle name="all_day" label="24-hour" bind:value={data.data.all_day} />
    {#if !data.data.daily}
      <InputText name="start_time" label="Start Time" type="time" bind:value={data.data.start_time} half={true} />
      <InputText name="end_time" label="End Time" type="time" bind:value={data.data.end_time} half={true} />
    {/if}
    <InputToggle name="daily" label="Set daily hours" bind:value={data.data.daily} />
    {#if data.data.daily}
      <div class="grid grid-cols-3 gap-2 md:col-span-2">
        <div class="text-sm font-bold text-gray-500 tracking-wide">Day</div>
        <div class="text-sm font-bold text-gray-500 tracking-wide">Start Time</div>
        <div class="text-sm font-bold text-gray-500 tracking-wide">End Time</div>
        <div class="pt-2">Monday</div>
        <InputText type="time" bind:value={data.data.daily_time.d1.start} half={true} />
        <InputText type="time" bind:value={data.data.daily_time.d1.end} half={true} />
        <div class="pt-2">Tuesday</div>
        <InputText type="time" bind:value={data.data.daily_time.d2.start} half={true} />
        <InputText type="time" bind:value={data.data.daily_time.d2.end} half={true} />
        <div class="pt-2">Wednesday</div>
        <InputText type="time" bind:value={data.data.daily_time.d3.start} half={true} />
        <InputText type="time" bind:value={data.data.daily_time.d3.end} half={true} />
        <div class="pt-2">Thursday</div>
        <InputText type="time" bind:value={data.data.daily_time.d4.start} half={true} />
        <InputText type="time" bind:value={data.data.daily_time.d4.end} half={true} />
        <div class="pt-2">Friday</div>
        <InputText type="time" bind:value={data.data.daily_time.d5.start} half={true} />
        <InputText type="time" bind:value={data.data.daily_time.d5.end} half={true} />
        <div class="pt-2">Saturday</div>
        <InputText type="time" bind:value={data.data.daily_time.d6.start} half={true} />
        <InputText type="time" bind:value={data.data.daily_time.d6.end} half={true} />
        <div class="pt-2">Sunday</div>
        <InputText type="time" bind:value={data.data.daily_time.d0.start} half={true} />
        <InputText type="time" bind:value={data.data.daily_time.d0.end} half={true} />
      </div>
    {/if}
    <input type="hidden" name="daily_time" value={JSON.stringify(data.data.daily_time)}>
  </FormSection>
  <FormSection title="Publish">
    <InputToggle name="status" label="Status" bind:value={data.data.status} init="true" half={true} />
    <InputNumber name="rank" label="Rank" bind:value={data.data.rank} half={true} />
  </FormSection>
</Form>
