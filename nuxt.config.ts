// Starter project scaffold: dependencies, ESLint/Prettier and a couple of example
// pages/layouts already wired up, built on the `nuxt-ui-kit` component layer.
// See README.md for what to rename or replace when starting a new project from this template.
export default defineNuxtConfig({
  extends: ["github:Mbertin44/nuxt-ui-kit"],

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
      // Access key for https://web3forms.com, used by the example contact page
      // to deliver form submissions without a backend. Set via
      // NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY at build time (see README.md).
      web3formsAccessKey: "",
    },
  },

  compatibilityDate: "2025-01-15",
});
