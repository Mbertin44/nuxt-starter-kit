// Starter project scaffold: dependencies, ESLint/Prettier and a couple of example
// pages/layouts already wired up, built on the `nuxt-ui-kit` component layer.
// See README.md for what to rename or replace when starting a new project from this template.
export default defineNuxtConfig({
  // nuxt-ui-kit is a pinned dependency (package.json): moving to a newer kit is an explicit change.
  extends: ["nuxt-ui-kit"],

  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/image"],

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      titleTemplate: "%s — My Project",
    },
  },

  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "light",
    fallback: "light",
  },

  runtimeConfig: {
    public: {
      // Access key for https://web3forms.com, used by the example contact page to submit
      // the form from the browser. The Worker reads NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY at
      // runtime; prerendered pages also need it at build time (see README.md).
      web3formsAccessKey: "",
    },
  },

  nitro: {
    preset: "cloudflare_module",
    // Local builds match Workers Builds: generated wrangler config and Node.js compatibility.
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  compatibilityDate: "2025-10-01",
});
