<script>
  import { FileUploader } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";
  import { supabase } from "$lib/supabaseClient";
  import { v4 as uuidv4 } from "uuid";

  export let field = {};
  export let record = {};
  export let updateRecord = () => {};

  let errors = false;

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
        const { data, error } = await supabase.storage.from(field.bucket).upload(fileName, resizedImage);

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
</script>

<label for={field.name} class="block mb-2 text-sm tracking-wider text-gray-600 font-semibold">{field.label}</label>
{#if record[field.name]}
  <div class="mb-2">
    <img
      src={`${env.PUBLIC_DB_URL}/storage/v1/object/public/${field.bucket}/${record[field.name] || ""}`}
      alt=""
      class="w-auto h-16"
    />
  </div>
{/if}
<div>
  <FileUploader
    labelTitle=""
    buttonLabel={record[field.name] === null || record[field.name] === "" ? "Upload" : "Change"}
    labelDescription=""
    accept={["*.jpg", "*.png", "*.gif"]}
    kind="secondary"
    status="complete"
    class="[&>.bx--file-container]:hidden"
    on:change={async (files) => {
      const file = files.detail[0];

      let filename = files.detail[0].name;
      const lastDot = filename.lastIndexOf(".");
      const ext = filename.substring(lastDot + 1);
      filename = `${uuidv4()}.${ext}`;

      // const filename = `${record.id}.png`;
      if (record[field.name] !== null || record[field.name] !== "") {
        const { data, error } = await supabase.storage
          .from(field.bucket)
          .remove([record[field.name], `thumb-${record[field.name]}`]);
      }

      await saveImage(file, filename, 800, 600);
      await saveImage(file, `thumb-${filename}`, 400, 300);

      if (!errors) {
        record[field.name] = filename;
        updateRecord();
      }
    }}
  />
</div>
