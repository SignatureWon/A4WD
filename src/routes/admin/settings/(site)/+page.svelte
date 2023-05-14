<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import {
    Button,
    Tab,
    TabContent,
    Tabs,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";
  import Toast from "$lib/components/Toast.svelte";
  // import InputText from "./input/InputText.svelte";
  // import InputTextarea from "./input/InputTextarea.svelte";
  import InputImage from "$lib/components/input/InputImage.svelte";

  let show = false;
  const selectedConstants = [
    "title",
    "description",
    "keywords",
    "hotline",
    "email",
    "logo",
    "icon",
    "color",
    "about",
    "contact",
    "destinations",
    "specials",
    "routes",
    "attractions",
    "vehicles",
    "features",
    "blog",
    "testimonials",
    "faqs",
  ];
  const sections = [
    "about",
    "contact",
    "destinations",
    "specials",
    "routes",
    "attractions",
    "vehicles",
    "features",
    "blog",
    "testimonials",
    "faqs",
  ];
  let record = {};
  let recordObj = {};
  let loading = false;
  let message = "";

  selectedConstants.forEach((key) => {
    recordObj[key] = {
      name: "",
      subtitle: "",
      description: "",
      type: key,
    };
  });

  onMount(async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("constants")
        .select("name, type, subtitle, description")
        .in("type", selectedConstants);

      if (error) throw error;

      if (data) {
        // records = data
        data.forEach((item) => {
          recordObj[item.type] = item;
          record[item.type] = item.name;
        });

        // console.log(recordObj);
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  });

  const updateRecord = async (key, value) => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("constants")
        .update({ name: value })
        .eq("type", key);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    } finally {
      message = "Updated successfully";
      show = true;
      loading = false;
    }
  };

  const updateLogo = () => {
    updateRecord("logo", record.logo);
  };
  const updateIcon = () => {
    updateRecord("icon", record.icon);
  };

  const updateRecordObj = async (key) => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("constants")
        .update(recordObj[key])
        .eq("type", key);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    } finally {
      message = "Updated successfully";
      show = true;
      loading = false;
    }
  };
</script>

<Loading {loading} />
<Toast bind:show {message} />

<PageHeader name="Site" />
<Tabs autoWidth class="border-b border-gray-200">
  <Tab label="General" />
  <Tab label="Sections" />
  <svelte:fragment slot="content">
    <TabContent>
      <form
        class="bg-white"
        on:submit={() => {
          updateRecord("title", record.title);
          updateRecord("description", record.description);
          updateRecord("keywords", record.keywords);
          updateRecord("hotline", record.hotline);
          updateRecord("email", record.email);
          updateRecord("color", record.color);
        }}
      >
        <div
          class="grid md:grid-cols-3 gap-5 px-5 py-8 border-b border-gray-200"
        >
          <div>
            <h4 class="font-bold">Info</h4>
          </div>
          <div class="md:col-span-2">
            <div class="mb-4">
              <TextInput
                labelText="Site Title"
                name="title"
                bind:value={record.title}
              />
            </div>
            <div class="mb-4">
              <TextArea
                labelText="Description"
                bind:value={record.description}
              />
            </div>
            <div class="mb-4">
              <TextArea labelText="Keywords" bind:value={record.keywords} />
            </div>
            <div class="mb-4">
              <TextInput labelText="Hotline" bind:value={record.hotline} />
            </div>
            <div class="mb-4">
              <TextInput labelText="Email" bind:value={record.email} />
            </div>
          </div>
        </div>
        <div
          class="grid md:grid-cols-3 gap-5 px-5 py-8 border-b border-gray-200"
        >
          <div>
            <h4 class="font-bold">Personalise</h4>
          </div>
          <div class="md:col-span-2">
            <div class="mb-4">
              <div class="text-sm font-bold text-gray-600 tracking-wide mb-1">
                Color
              </div>
              <input type="color" bind:value={record.color} />
            </div>
            <div class="mb-8">
              <InputImage
                field={{
                  name: "logo",
                  label: "Logo",
                  bucket: "contents",
                }}
                bind:record
                updateRecord={updateLogo}
              />
            </div>
            <div class="mb-4">
              <InputImage
                field={{
                  name: "icon",
                  label: "Icon",
                  bucket: "contents",
                }}
                bind:record
                updateRecord={updateIcon}
              />
            </div>
          </div>
        </div>
        <footer class="flex p-4  bg-gray-50">
          <div class="flex-1" />
          <div>
            <Button type="submit">Update</Button>
          </div>
        </footer>
      </form>
    </TabContent>
    <TabContent>
      <form
        class="bg-white"
        on:submit={() => {
          sections.forEach((section) => {
            updateRecordObj(section);
          });
        }}
      >
        {#each sections as section}
          <div
            class="grid md:grid-cols-3 gap-5 px-5 py-8 border-b border-gray-200"
          >
            <div>
              <h4 class="font-bold capitalize">{section}</h4>
            </div>
            <div class="md:col-span-2">
              <div class="mb-4">
                <TextInput
                  labelText="Title"
                  name="title"
                  bind:value={recordObj[section].name}
                />
              </div>
              <div class="mb-4">
                <TextInput
                  labelText="Subtitle"
                  name="subtitle"
                  bind:value={recordObj[section].subtitle}
                />
              </div>
              <div class="mb-4">
                <TextArea
                  labelText="Description"
                  bind:value={recordObj[section].description}
                />
              </div>
            </div>
          </div>
        {/each}
        <footer class="flex p-4  bg-gray-50">
          <div class="flex-1" />
          <div>
            <Button type="submit">Update</Button>
          </div>
        </footer>
      </form>
    </TabContent>
  </svelte:fragment>
</Tabs>
