import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // Use static adapter for Capacitor/mobile build
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html' // SPA routing fallback
    }),

    // optional: can add paths/base if deploying to subpath
    // paths: { base: '' }
  }
};

export default config;
