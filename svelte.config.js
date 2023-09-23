// import adapter from '@sveltejs/adapter-auto';
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      memory: 3008,
      maxDuration: 60,
    }),
  },
  preprocess: vitePreprocess(),
};

export default config;
