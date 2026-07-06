<!--
  Landing page layout: same chrome as the default layout, but with a header
  that stays transparent until the user scrolls (for hero sections that sit
  under the header instead of below it).
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
      :transparent-until-scrolled="true"
    />
    <main>
      <slot />
    </main>
    <MFooter brand-name="My Project" :navigation-items="[{ label: 'Contact', to: '/contact' }]" />
    <UToaster />
  </div>
</template>
