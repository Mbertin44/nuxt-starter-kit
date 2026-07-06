# nuxt-starter-kit

A project template: clone it, rename a few things, and start a new Nuxt project with dependencies, tooling, and a couple of example pages already in place — instead of rebuilding the same setup from scratch every time.

This is a **starting point**, not a library. For shared, reusable components (header, footer, sections...), this project extends [`nuxt-ui-kit`](https://github.com/Mbertin44/nuxt-ui-kit) — a separate [Nuxt Layer](https://nuxt.com/docs/getting-started/layers). Improvements to those components belong in that repo, not here; this repo is meant to be forked/cloned per project and diverge freely.

---

## Starting a new project from this template

1. On GitHub, click **"Use this template" → "Create a new repository"** on this repo (or: `gh repo create my-new-project --template Mbertin44/nuxt-starter-kit --public`).
2. Clone your new repo, then `pnpm install`.
3. Rename the project:
   - `package.json` → `name`
   - `wrangler.toml` → `name`
   - `nuxt.config.ts` → `app.head.titleTemplate`, `site` block if you add `@nuxtjs/seo` back
   - `app/layouts/default.vue` and `landing.vue` → `brand-name`/`navigation-items` props passed to `MHeader`/`MFooter`
4. Replace the placeholder copy in `app/pages/index.vue` (hero title/description, feature cards) and `app/pages/contact.vue` (copy only — the form logic works as-is).
5. Pick real brand colors in `app/app.config.ts` (`ui.colors`) — see [Nuxt UI theming](https://ui.nuxt.com/getting-started/theme).
6. Copy `.env.example` to `.env` and fill in `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (create a free access key at [web3forms.com](https://web3forms.com)).

---

## What's included

| Layer              | Technology                        | Notes                                                                                         |
| ------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| Framework          | [Nuxt](https://nuxt.com) 4         | Uses the `app/` source directory layout                                                       |
| Component library  | [Nuxt UI](https://ui.nuxt.com) v4  | Plus [`nuxt-ui-kit`](https://github.com/Mbertin44/nuxt-ui-kit) for `MHeader`/`MFooter`/etc.    |
| Styling            | Tailwind CSS v4                    | Configured through Nuxt UI; theme tokens in `app/assets/css/main.css`                          |
| Images             | `@nuxt/image`                      | Required by `nuxt-ui-kit`; no provider configured yet — add one (e.g. `cloudinary`) if needed |
| Icons              | Nuxt Icon (Iconify)                | Lucide (`i-lucide-*`) included by default                                                     |
| Forms / validation | Zod v4                             | Example contact form schema in `app/pages/contact.vue`                                        |
| Language           | TypeScript 5                       | Checked with `vue-tsc` via `nuxt typecheck`                                                    |
| Linting            | ESLint 9 (flat config)             | Correctness/logic rules only — formatting is delegated to Prettier via `eslint-config-prettier` |
| Formatting         | Prettier                           | `prettier-plugin-tailwindcss` sorts Tailwind utility classes automatically                      |
| Package manager    | pnpm                                | —                                                                                              |
| Server runtime     | Nitro (bundled with Nuxt)          | Deploy target: **Cloudflare Workers** (`wrangler.toml` included)                                |
| CI                 | GitHub Actions                     | Lint + typecheck on every push (`.github/workflows/ci.yml`)                                    |

Deliberately **not** included, since they're specific to individual past projects rather than generic starting points: `@nuxtjs/seo`, `@nuxt/fonts`, a Cloudflare KV cache binding, a Guesty-style external API integration. Add them back per-project when actually needed.

---

## Project structure

```
nuxt-starter-kit/
├── app/
│   ├── app.vue                   # Root component: global <head> defaults, mounts the layout/page tree
│   ├── app.config.ts             # Runtime-editable UI config (theme colors) — placeholder values, replace per project
│   ├── assets/css/main.css       # Tailwind entrypoint
│   ├── layouts/
│   │   ├── default.vue           # Standard layout (opaque header from the start)
│   │   └── landing.vue           # Header stays transparent until the user scrolls (for hero sections)
│   └── pages/
│       ├── index.vue             # Example landing page: hero + a features grid using nuxt-ui-kit components
│       └── contact.vue           # Working contact form (Zod validation + Web3Forms submission, no backend needed)
├── nuxt.config.ts                 # Nuxt configuration — extends nuxt-ui-kit
├── wrangler.toml                  # Cloudflare Workers deployment config
├── eslint.config.mjs              # ESLint flat config (extends Nuxt's own config + eslint-config-prettier)
└── .prettierrc                    # Prettier config (Tailwind class sorting)
```

---

## Using nuxt-ui-kit components

`nuxt.config.ts` already has `extends: ["github:Mbertin44/nuxt-ui-kit"]`, so `MHeader`, `MFooter`, `MRevealSection`, `MIconCard`, `MCalendar` and `MDateRangePicker` are available in any page/component without an import statement — see [nuxt-ui-kit's README](https://github.com/Mbertin44/nuxt-ui-kit#components) for their props/slots.

You're free to also create your own local components (`app/components/Header.vue`, for instance) — the `M` prefix on the kit's components means there's no naming collision either way.

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

| Variable                           | Purpose                                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Access key for [Web3Forms](https://web3forms.com), used by the example contact page to deliver form submissions without a backend |

**On Cloudflare Workers Builds**: `NUXT_PUBLIC_*` variables back Nuxt's `runtimeConfig.public`, which is resolved at **build time** — set this variable's scope to **Build** (not just Runtime) in the Cloudflare dashboard, or the deployed site will submit an empty access key.

---

## Getting started

```bash
pnpm install       # installs dependencies (postinstall runs `nuxt prepare`)
pnpm dev           # dev server → http://localhost:3000
pnpm build         # production build (Nitro/Cloudflare Workers output)
pnpm preview       # preview the production build locally
pnpm lint          # ESLint
pnpm typecheck     # vue-tsc via `nuxt typecheck`
```

---

## Deployment

Deploys to **Cloudflare Workers** (Nitro's Cloudflare preset, auto-detected from `wrangler.toml`). Connect the repo to a Cloudflare Workers Builds project for automatic build-and-deploy on push, or run `wrangler deploy` manually. CI (`.github/workflows/ci.yml`) only runs lint + typecheck — it does not deploy.
