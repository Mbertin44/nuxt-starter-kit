<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

useSeoMeta({
  title: "Contact",
  description: "Get in touch.",
});

const contactFormSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.email("Invalid email address"),
  message: z.string().min(1, "Required"),
  botcheck: z.boolean().default(false),
});

type ContactFormData = z.output<typeof contactFormSchema>;

const state = reactive<ContactFormData>({
  name: "",
  email: "",
  message: "",
  botcheck: false,
});

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const loading = ref(false);

/**
 * Submits the contact form to Web3Forms and shows a success/error toast,
 * resetting the form fields (except the honeypot) on success.
 */
async function onSubmit(event: FormSubmitEvent<ContactFormData>) {
  loading.value = true;
  try {
    const response = await $fetch<{ success: boolean }>(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        body: {
          access_key: runtimeConfig.public.web3formsAccessKey,
          subject: `New contact request from ${event.data.name}`,
          ...event.data,
        },
      },
    );
    if (!response.success) throw new Error();
    toast.add({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
      color: "success",
    });
    Object.assign(state, { name: "", email: "", message: "" });
  } catch (e) {
    toast.add({
      title: "Something went wrong",
      description: "Please try again or contact us directly by email.",
      color: "error",
    });
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UPageSection
    title="Get in touch"
    description="Send us a message and we'll get back to you as soon as possible."
  >
    <UPageCard class="mx-auto max-w-lg">
      <UForm
        :schema="contactFormSchema"
        :state="state"
        class="flex flex-col space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Full name" name="name" required>
          <UInput v-model="state.name" placeholder="John Doe" class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="john@example.com"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Message" name="message" required>
          <UTextarea
            v-model="state.message"
            placeholder="How can we help?"
            :rows="5"
            class="w-full"
          />
        </UFormField>

        <!-- Honeypot field: hidden from real users, left unchecked; bots that fill it in get flagged as spam by Web3Forms -->
        <input
          v-model="state.botcheck"
          type="checkbox"
          name="botcheck"
          class="hidden"
          style="display: none"
        />

        <UButton
          type="submit"
          :loading="loading"
          trailing-icon="i-lucide-send"
          size="lg"
          label="Send message"
          class="w-full"
        />
      </UForm>
    </UPageCard>
  </UPageSection>
</template>
