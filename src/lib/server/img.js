import { supabase } from "$lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const img = {
  name: (file) => {
    let filename = file.name;
    const lastDot = filename.lastIndexOf(".");
    const ext = filename.substring(lastDot + 1);
    return `${uuidv4()}.${ext}`;
  },
  upload: (file, fileName, bucket, maxWidth, maxHeight) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = async function () {
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

        let resizedImage = new Blob([uInt8Array], {
          type: contentType,
        });

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, resizedImage);

        if (error) {
          console.log(error)
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  },
  resize: (file, maxWidth, maxHeight) => {
    let resp = ""
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = async function () {
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

        let resizedImage = new Blob([uInt8Array], {
          type: contentType,
        });

        resp = resizedImage

        // const { data, error } = await supabase.storage
        //   .from(bucket)
        //   .upload(fileName, resizedImage);

        // if (error) {
        //   console.log(error)
        // }
      };
      // img.src = event.target.result;
    };
    // reader.readAsDataURL(file);
    return resp
  },
  remove: async (fileName, bucket) => {
    if (fileName !== null || fileName !== "") {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([fileName, `thumb-${fileName}`]);
    }
  },
};
