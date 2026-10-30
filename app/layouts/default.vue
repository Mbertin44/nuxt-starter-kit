<!--
  Default site layout: opaque header from the start. Toasts (e.g. from the
  contact form) are rendered by UApp in app.vue.

  MHeader/MFooter come from nuxt-ui-kit (see README.md). Replace the
  placeholder props below with the project's actual brand/navigation, or wrap
  them in a local app/components/Header.vue and Footer.vue if project-specific
  logic is needed — the `M` prefix means there's no naming collision either way.
-->
<template>
  <div>
    <MHeader
      brand-name="My Project"
      :navigation-items="[
        { label: 'Home', to: '/' },
        { label: 'Contact', to: '/contact' },
      ]"
      cta-label="Contact"
      cta-to="/contact"
    />
    <main>
      <slot />
    </main>
    <MFooter
      brand-name="My Project"
      :navigation-items="[{ label: 'Contact', to: '/contact' }]"
    />
  </div>
</template>
