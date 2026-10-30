<script setup lang="ts">
// Root application component: sets global head defaults and mounts the layout/page tree.
// UApp also renders the toaster used by useToast().
useHead({
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
