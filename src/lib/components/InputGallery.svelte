<script>
  import { supabase } from "$lib/supabaseClient";
  import { v4 as uuidv4 } from "uuid";
  import { env } from "$env/dynamic/public";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import {
    Button,
    FileUploader,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";

  export let table = "table";
  export let field = "field";
//   export let structure = [
//     {
//       name: "Name",
//       type: "text",
//     },
//   ];

  const id = $page.params.id;

  let records = [];

  let loading = false;
  let show = false;
  let message = "";
  let errors = false;

  onMount(() => {
    getRecord();
  });

  const getRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .select(field)
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        records = data[field];
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };
  const updateRecord = async () => {
    try {
      let obj = {};
      obj[field] = records;
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .update(obj)
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      errors = error;
    } finally {
      message = "Updated successfully";
      show = true;
      loading = false;
    }
  };

  //   let dataURLToBlob = function (dataURL) {
  //     let BASE64_MARKER = ";base64,";
  //     if (dataURL.indexOf(BASE64_MARKER) == -1) {
  //       let parts = dataURL.split(",");
  //       let contentType = parts[0].split(":")[1];
  //       let raw = parts[1];

  //       return new Blob([raw], { type: contentType });
  //     }

  //     let parts = dataURL.split(BASE64_MARKER);
  //     let contentType = parts[0].split(":")[1];
  //     let raw = window.atob(parts[1]);
  //     let rawLength = raw.length;

  //     let uInt8Array = new Uint8Array(rawLength);

  //     for (let i = 0; i < rawLength; ++i) {
  //       uInt8Array[i] = raw.charCodeAt(i);
  //     }

  //     return new Blob([uInt8Array], { type: contentType });
  //   };

  const saveImage = (file, fileName, maxWidth, maxHeight) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = async function () {
        // Resize the image
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        // Upload the resized image
        const dataUrl = canvas.toDataURL(file.type);

        let BASE64_MARKER = ";base64,";

        // convert to BLOB
        if (dataUrl.indexOf(BASE64_MARKER) == -1) {
          let parts = dataUrl.split(",");
          let contentType = parts[0].split(":")[1];
          let raw = parts[1];

          return new Blob([raw], { type: contentType });
        }

        let parts = dataUrl.split(BASE64_MARKER);
        let contentType = parts[0].split(":")[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        // return new Blob([uInt8Array], { type: contentType });

        let resizedImage = new Blob([uInt8Array], {
          type: contentType,
        });
        const { data, error } = await supabase.storage
          .from("gallery")
          .upload(fileName, resizedImage);

        if (!error) {
          errors = error;
        }
        // console.log(dataUrl);

        //   uploadImage(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  //   function newItem() {
  //     let item = {};
  //     structure.forEach((field) => {
  //       item[field.name] = "";
  //     });
  //     return item;
  //   }
  function move(arr, from, to) {
    let newArr = arr;
    let el = newArr.splice(from, 1)[0];
    newArr.splice(to, 0, el);
    return newArr;
  }
  function remove(arr, index) {
    let newArr = arr;
    newArr.splice(index, 1);
    return newArr;
  }
</script>

<Loading {loading} />
<Toast bind:show {message} />

<div class="bg-white">
  <form
    on:submit={() => {
      updateRecord();
    }}
  >
    {#if records.length === 0}
      <div class="px-4 py-20 text-center border-b border-gray-200">
        <div class="pb-4">No images yet</div>
      </div>
    {:else}
      {#each records as item, itemIndex}
        <div class="md:flex p-4 border-b border-gray-200">
          <div class="flex-1">
            <div class="flex ">
              <div class="w-8 text-right pr-2 mt-2">
                {itemIndex + 1}
              </div>
              <div class="w-40 pr-2">
                <img src={item.thumb} alt={item.caption} />
              </div>
              <div class="flex-1">
                <TextInput placeholder="Caption" bind:value={item.caption} />
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <Button
              kind="ghost"
              iconDescription="Move up"
              disabled={itemIndex === 0 ? true : false}
              on:click={() => {
                records = [...move(records, itemIndex, itemIndex - 1)];
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="h-4 w-4"
                fill="currentColor"
                ><path fill="none" d="M0 0h24v24H0z" /><path
                  d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"
                /></svg
              >
            </Button>
            <Button
              kind="ghost"
              iconDescription="Move down"
              disabled={itemIndex === records.length - 1 ? true : false}
              on:click={() => {
                records = [...move(records, itemIndex, itemIndex + 1)];
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="h-4 w-4"
                fill="currentColor"
                ><path fill="none" d="M0 0h24v24H0z" /><path
                  d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z"
                /></svg
              >
            </Button>
            <Button
              kind="ghost"
              iconDescription="Delete"
              on:click={async () => {
                console.log(item.name);
                
                const { data, error } = await supabase.storage
                  .from("gallery")
                  .remove([item.name, `thumb-${item.name}`]);

                records = [...remove(records, itemIndex)];

                updateRecord()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="h-4 w-4"
                fill="currentColor"
                ><path fill="none" d="M0 0h24v24H0z" /><path
                  d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
                /></svg
              >
            </Button>
          </div>
        </div>
      {/each}
    {/if}
    <footer class="p-5 bg-gray-50 flex items-center justify-between">
      <div>
        <FileUploader
          labelTitle=""
          buttonLabel="Upload"
          labelDescription=""
          accept={[".jpg", ".jpeg", ".png", ".gif"]}
          kind="secondary"
          status="complete"
          class="[&>.bx--file-container]:hidden"
          on:change={async (files) => {
            const file = files.detail[0];

            let filename = files.detail[0].name;
            const lastDot = filename.lastIndexOf(".");
            const ext = filename.substring(lastDot + 1);
            filename = `${table}-${uuidv4()}.${ext}`;

            await saveImage(file, filename, 800, 600);
            await saveImage(file, `thumb-${filename}`, 200, 150);

            if (!errors) {
              records = [
                ...records,
                {
                  name: filename,
                  url: `${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${filename}`,
                  thumb: `${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/thumb-${filename}`,
                  caption: "",
                },
              ];

              updateRecord();
            }

            // console.log(filename);

            // const dataUrl = canvas.toDataURL("image/jpeg");

            //   const filename = `${record.id}.png`;
            //   if (
            //     record[field.name] === null ||
            //     record[field.name] === ""
            //   ) {
            //     const { data, error } = await supabase.storage
            //       .from(field.bucket)
            //       .upload(filename, files.detail[0]);
            //   } else {
            //     const { data, error } = await supabase.storage
            //       .from(field.bucket)
            //       .update(filename, files.detail[0]);
            //   }

            //   record[field.name] = `${filename}?c=${Date.now()}`;

            //   updateRecord();
          }}
        />
      </div>
      <div>
        <Button type="submit">Save</Button>
      </div>
    </footer>
  </form>
</div>
