<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

useSeoMeta({
  title: "Home",
  description: "Replace this with your project's actual value proposition.",
});

// Placeholder features — replace with what actually differentiates this project.
const startingPointFeatures = [
  {
    icon: "i-lucide-zap",
    label: "Fast to start",
    description: "Nuxt UI, Tailwind, ESLint and Prettier are already wired up.",
  },
  {
    icon: "i-lucide-puzzle",
    label: "Reusable components",
    description:
      "MHeader, MFooter and section components come from nuxt-ui-kit, not copy-pasted per project.",
  },
  {
    icon: "i-lucide-rocket",
    label: "Ready to deploy",
    description: "Cloudflare Workers config is included via wrangler.toml.",
  },
];
</script>

<template>
  <div>
    <!-- Hero: replace the title/description with the project's actual pitch. -->
    <UPageHero
      title="Your project's headline goes here"
      description="A short, one or two sentence description of what this project does and who it's for."
    >
      <template #links>
        <UButton
          to="/contact"
          label="Get in touch"
          size="xl"
          trailing-icon="i-lucide-arrow-right"
        />
      </template>
    </UPageHero>

    <!-- Features: demonstrates MRevealSection + MIconCard from nuxt-ui-kit. -->
    <UPageSection
      title="Why start here"
      description="What this template gives you out of the box."
    >
      <MRevealSection>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <MIconCard
            v-for="feature in startingPointFeatures"
            :key="feature.label"
            :icon="feature.icon"
            :label="feature.label"
            :description="feature.description"
          />
        </div>
      </MRevealSection>
    </UPageSection>
  </div>
</template>
