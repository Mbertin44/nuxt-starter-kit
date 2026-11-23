# Conventions des projets Nuxt

Source unique des conventions de tous les projets créés depuis ce starter, et de la bibliothèque `nuxt-ui-kit`. Une convention décidée dans un projet est reportée ici.

## Principes

- La lisibilité passe avant tout : le code est lu par des humains. Des conventions identiques partout valent mieux qu'une astuce locale.
- Un même besoin se résout de la même façon (structure, style, patterns) dans tout le projet.
- Pas de code mort, de variable inutilisée ni de nommage incohérent. Après un changement en plusieurs étapes, une relecture dédiée cherche ces trois défauts et les besoins résolus de deux façons.
- Mesurer plutôt que supposer : une valeur visuelle se vérifie dans le navigateur, une affirmation sur un paquet dans son code ou ses notes de version.

## Langues

- Code, noms, commentaires et messages de commit : anglais.
- Textes du site : fichiers de langue. Documents de travail (passation, suivi de chantier) : français.

## Stack et outillage

- Nuxt 4 (`app/`), Nuxt UI 4, Tailwind CSS 4, TypeScript strict, pnpm 10, Node 24 (`.nvmrc` et `engines`).
- Prettier avec ses réglages par défaut et le plugin Tailwind : `pnpm format`, vérifié en CI par `pnpm format:check`. ESLint ne garde que les règles de correction (`@nuxt/eslint` + `eslint-config-prettier`).
- La CI vérifie le formatage, le lint et le typecheck à chaque push, avec la version de Node lue dans `.nvmrc`.
- Aucun paquet ajouté, remplacé ou monté de version majeure sans accord. Une montée de version s'essaie dans une copie jetable du dépôt avant d'être proposée.

## Nuxt UI d'abord

### Lire la documentation avant d'écrire

- Avant d'utiliser un composant Nuxt UI, lire sa documentation : usage, API (props, slots, événements), thème et exemples. Sources : le serveur MCP Nuxt UI (`get-component`, `get-component-metadata`, `get-example`) ou ui.nuxt.com. Pour la version installée, le thème généré fait foi (`.nuxt/ui/<composant>.ts`), et le code du composant en cas de doute (`node_modules/@nuxt/ui/dist/runtime/components/`).
- Reprendre les noms exacts des props, slots et événements ; ne jamais en deviner un. Suivre la structure des exemples officiels : composant parent, composants enfants, slots nommés.
- Passer par les props avant les classes : `color`, `variant`, `size`, `icon`, `to`… Une classe ne remplace jamais une prop qui existe.
- Couleurs : les classes sémantiques de Nuxt UI (`text-muted`, `text-highlighted`, `bg-default`, `bg-elevated`, `border-default`, `text-primary`…), jamais une teinte brute de Tailwind (`text-gray-500`, `bg-white`).

### Partir d'un design externe

- Une maquette est une référence visuelle. On n'en reprend jamais le code : ni HTML, ni CSS, ni JS.
- Avant de coder une section, dresser l'inventaire de ses éléments (mise en page, navigation, boutons, formulaires, médias, listes…) et noter pour chacun le composant Nuxt UI le plus proche, dans un tableau de correspondance de la page de suivi.
- Ordre de choix :
  1. le composant Nuxt UI tel quel, réglé par ses props et `ui` ;
  2. un composant `M<Nom>.vue` qui enveloppe un composant Nuxt UI pour le personnaliser ;
  3. un composant entièrement sur mesure, seulement si aucun composant Nuxt UI ne convient, avec la raison écrite dans le tableau.
- Les valeurs du design (couleurs, polices, tailles, rayons, durées, courbes) deviennent des tokens de `main.css`. Aucune valeur de la maquette n'est recopiée en dur dans un composant ; une valeur arbitraire qui revient devient un token.

### Personnaliser un composant

- Ordre de priorité, du plus faible au plus fort : thème par défaut, `app.config.ts`, `UTheme`, prop `ui`, prop `class`. tailwind-merge fusionne les classes, sauf entre `UTheme` et la prop `ui` (ou deux `UTheme` imbriqués) : sur un même slot, la valeur la plus forte remplace l'autre.
- Réglage propre à une instance : prop `ui` (par slot) ou `class` (slot racine). `ULink` et `UIcon` n'ont pas de prop `ui` : `class` seulement.
- Réglage qui se répète sur un même composant : `app.config.ts` du projet, clé `ui.<composant>` (`slots`, `variants`, `compoundVariants`, `defaultVariants`).
- Nouveau style partagé par plusieurs instances : une nouvelle valeur de variant dans `app.config.ts` (par exemple `variant: { frame: … }`) plutôt que les mêmes classes répétées. Quand des variants partagent des réglages (une couleur sur plusieurs tailles, un variant sur plusieurs couleurs), les regrouper dans `compoundVariants`.
- Taille et couleur par défaut de tous les composants : `ui.theme.defaultVariants` dans `nuxt.config.ts`.
- Remplacer les classes d'un slot au lieu de les fusionner : un slot sous forme de fonction (`base: () => "…"`), qui reçoit les classes par défaut du slot ; variants et `compoundVariants` s'ajoutent encore. Dans `app.config.ts`, à un seul endroit : si une autre couche définit la même clé, Nuxt appelle la fonction pendant la fusion des layers et ne garde que la chaîne, que Nuxt UI fusionne au lieu de remplacer.
- Dans le kit : aucune clé `ui` dans son `app.config.ts`, puisque Nuxt la fusionnerait dans celui de chaque projet et changerait leurs composants Nuxt UI. Un composant du kit règle les composants Nuxt UI qu'il contient par leur prop `ui` ou par `UTheme`, et accepte `ui` et `class` pour que le projet l'ajuste.

### Composants `M`

- Un `M<Nom>.vue` enveloppe de préférence un composant Nuxt UI : il transmet les props, les attributs et les slots, accepte `ui` et `class`, et n'ajoute que ce qui manque.
- Il porte le nom de ce qu'il fait, jamais celui de son contenu ni celui du composant Nuxt UI qu'il enveloppe : il reste polyvalent et réutilisable. Exemple : `MScrollingText` (un texte qui défile), et non `MMarquee` ni `MHeroBand`.
- Ses propres classes passent par `tv` de Nuxt UI (`import { tv } from "@nuxt/ui/utils/tv"`), comme les composants Nuxt UI : un slot par élément, `ui` du projet fusionné par tailwind-merge.
- Aucune donnée du projet en dur : les textes arrivent par props et slots, les valeurs visuelles par le thème du projet.

### Pièges vérifiés (Nuxt UI 4.11)

- `UNavigationMenu` : son `<nav>` n'a pas de nom accessible, passer `aria-label`. Le lien actif reçoit `aria-current="page"` ; pour une ancre de la même page, passer `"aria-current": "true"` dans l'item actif seulement, puisque la valeur de l'item l'emporte toujours. Un lien `#section` n'est jamais actif par la route : piloter `active`.
- Ancre de la même page (`#section`) dans `ULink`, `UButton` ou `UNavigationMenu` : `external` + `noRel` en font un lien simple, sans passage par le routeur (défilement géré par la page).
- `UButton` avec seulement une icône : 32 px à la taille `md`, sous les 44 px visés.
- `UColorModeButton` change le thème dès le clic, sans point d'accroche : pour une animation avant la bascule, `UButton` + `useColorMode()`.
- `UMain` impose `min-h-[calc(100vh-var(--ui-header-height))]` ; `--ui-header-height` vaut 4rem par défaut.
- `UTheme` n'agit pas sur `ULink` ni sur `UIcon`.
- La couche de base de Nuxt UI met l'`outline-offset` des liens à 0 : un style de focus du projet cible aussi `a:focus-visible`.

## Tailwind et CSS

- Tailwind seulement. Pas de bloc `<style>` ni de CSS écrit à la main dans un composant. Exception : un vrai blocage que Tailwind ne sait pas exprimer, accepté par le propriétaire avant d'écrire la moindre ligne, dans la plus petite portée possible, avec un commentaire qui explique pourquoi.
- `app/assets/css/main.css` est le seul fichier en syntaxe CSS, seule entrée Tailwind du projet :
  - imports de Tailwind puis de Nuxt UI ;
  - tokens dans `@theme` (couleurs, polices, tailles, rayons, points de rupture, courbes, animations) ;
  - variables sémantiques de Nuxt UI (`--ui-*`), toutes redéfinies à partir des tokens du projet ;
  - styles de base dans `@layer base` : hors couche, une règle l'emporterait sur toutes les classes, y compris celles des composants Nuxt UI ;
  - styles partagés par des éléments qui ne sont pas des composants Nuxt UI (les étiquettes, par exemple) : une utilité `@utility` composée de classes Tailwind avec `@apply`.
- Points de rupture du projet dans `@theme` (`--breakpoint-*`), utilisés par leurs variantes (`tab:`, `max-desk:`…) dans les classes et par `@variant` dans `main.css`, jamais en pixels dans une media query.
- États par variantes : `hover:`, `focus-visible:`, `aria-*:`, `data-*:`, `group-*:`, `peer-*:`, `motion-reduce:`, `dark:`, `light:` ; pas de classe d'état ajoutée à la main.
- Ordre des classes : celui du plugin Prettier, appliqué par `pnpm format`.
- Animations : utilitaires `transition-*` et `animate-*`, `@keyframes` déclarés dans `@theme`. Les séquences pilotées par JavaScript passent par l'API Web Animations.

### Noms de classes

- Pas de BEM : noms trop longs.
- Pour styler : des utilitaires Tailwind. Si une classe personnalisée est indispensable, nom court, porté par la hiérarchie (`.nav .link`), jamais un nom composé.
- Pour cibler un élément depuis un script ou un test : `ref`, rôle et nom accessible, ou attribut `data-*`. Jamais une classe de style.

## Arborescence et nommage

- Composants dans `app/components/`, déclarés avec `pathPrefix: false` : le nom du fichier est le nom du composant et reste unique dans le projet.
- Composants destinés à `nuxt-ui-kit` : préfixe `M`, à la racine de `app/components/` (même chemin que dans le kit), aucune donnée du projet en dur (voir « Composants `M` »).
- Composants propres au projet : regroupés par rôle dans des sous-dossiers.
- Composables `useX` dans `app/composables/` ; constantes et types partagés dans `app/utils/`.
- La structure (ancres, entrées de menu, ordres) vit dans le code ; les textes vivent dans les fichiers de langue.
- Une fonction porte le nom de ce qu'elle fait ; un commentaire d'une ligne quand le nom ne suffit pas. Constantes nommées plutôt que nombres magiques.

## Accessibilité (WCAG 2.2, niveau AA)

Chaque règle cite son critère WCAG quand il existe ; une exigence plus stricte que le critère, ou de niveau AAA, est marquée « choix du projet ». Tout se vérifie sur la page construite, dans chaque langue et chaque thème.

### Structure et langue

- Repères : `header`, `nav` nommé (`aria-label`), `main`, `footer`. Un seul `h1` ; un `h2` par section, reliée par `aria-labelledby` ; des `h3` dessous ; aucun niveau sauté (1.3.1, 2.4.6).
- Copies décoratives (texte dupliqué d'un bandeau…) : `aria-hidden="true"` et `inert`, sans titre ni élément focalisable.
- `<html lang>` vient de `useLocaleHead()` (`fr-FR`, `en-GB`) (3.1.1). Un passage dans une autre langue porte `lang`, y compris l'élément dont l'`aria-label` est écrit dans l'autre langue (3.1.2).
- Chaque page a un `<title>` distinct et traduit (2.4.2).

### Clavier et focus

- Tout se fait au clavier (2.1.1), sans piège (2.1.2) : une action au survol ou à la molette a aussi son équivalent au clavier. Glisser : un équivalent à un seul pointeur, sans glisser (2.5.7) ; geste à trajectoire ou à plusieurs doigts : un équivalent à un seul point de contact (2.5.1). Choix du projet : cet équivalent est un `<button>` ou un `<a href>` en un seul clic. Jamais de `div` cliquable.
- Un contrôle qui mène à une autre page est un lien `<a href>`, même quand un script anime le passage ; un contrôle qui agit sur la page est un `<button>` (4.1.2).
- Blocs répétés (2.4.1) : les repères `header`, `nav` nommé et `main`, avec la hiérarchie des titres, permettent de les sauter. Pas de lien d'évitement « Aller au contenu » (choix du propriétaire).
- Une ancre interceptée en JavaScript (défilement doux) déplace aussi le focus sur sa cible `tabindex="-1"`, avec `preventScroll` (2.4.3).
- `<NuxtRouteAnnouncer />` dans `app.vue` : il annonce `document.title` quand il change, donc après une navigation côté client, changement de langue compris. Bonne pratique d'application monopage, sans critère dédié ; chaque page garde un titre distinct (2.4.2).
- Indicateur `:focus-visible` sur tout élément interactif, jamais retiré sans remplaçant (2.4.7), contrasté à 3:1 sur chaque fond où il se pose (1.4.11).
- Un élément qui reçoit le focus n'est jamais entièrement caché par un élément fixe (cadre, en-tête, bandeau) : `scroll-padding` à la mesure de cet élément (2.4.11).

### Pointeur et cibles

- Cibles d'au moins 24 × 24 px, zone invisible `after:` comprise (2.5.8) ; 44 px visés.
- Le nom accessible contient le texte visible (2.5.3), placé en tête (choix du projet). Pas d'`aria-label` quand le texte visible suffit.
- Contenu affiché au survol : affiché aussi au focus, fermable par Échap, survolable, maintenu tant que le survol ou le focus dure (1.4.13). Aucune information portée par le seul attribut `title`.
- Curseur personnalisé : décoratif (`aria-hidden`, sans événements de pointeur), actif seulement avec `(hover: hover) and (pointer: fine)`, coupé en mode de contrastes forcés (`forced-colors: active`).

### Couleur, texte et zoom

- Contraste de 4,5:1 pour le texte, de 3:1 pour le grand texte (1.4.3), de 3:1 pour les contours de champs, les états et les icônes utiles (1.4.11). Mesuré sur la couleur rendue, opacité comprise, dans chaque thème.
- La couleur seule ne porte jamais une information : lien souligné dans un paragraphe, état actif marqué aussi par la forme, erreur écrite (1.4.1).
- À 320 px CSS de large (zoom à 400 %), rien ne défile dans les deux sens et rien n'est masqué par un élément fixe (1.4.10). Au zoom à 200 %, tout le texte grandit sans perte (1.4.4).
- Aucun conteneur de texte à hauteur fixe qui le rogne : `min-h-*` plutôt que `h-*` (1.4.12).

### Mouvement

- `prefers-reduced-motion: reduce` coupe tout mouvement non essentiel : défilement doux, apparitions, transitions décoratives (2.3.3, niveau AAA : choix du projet). En JavaScript, le réglage se lit par une media query réactive, qui suit ses changements (le composable `useMediaQuery()` de Mo), jamais une seule fois au chargement.
- Contenu qui bouge seul plus de 5 s (bandeau, carrousel automatique) : pas de bouton pause (choix du propriétaire, écart avec 2.2.2). Il s'arrête quand le système demande de réduire les animations (`motion-safe:`, comme `UMarquee`).

### Images et icônes

- Image utile : `alt` traduit. Image décorative : `alt=""` sur une `<img>` (ou `NuxtImg`), `aria-hidden="true"` sur un SVG ou une icône (1.1.1).
- Bouton ou lien sans texte visible : `aria-label` traduit, que ni `UButton` ni `UIcon` ne fournissent (4.1.2).

### Formulaires

- Chaque champ a un libellé visible, par `UFormField` (`label`) (3.3.2), et un `autocomplete` explicite pour les données de la personne (`name`, `email`, `tel`, `organization`) : `UInput` vaut `off` par défaut (1.3.5).
- Chaque erreur s'écrit sous son champ, avec la correction attendue (3.3.1, 3.3.3). Sur l'erreur de `UForm`, le focus va au premier champ en erreur : Nuxt UI ne le fait pas.
- Le résultat d'un envoi s'affiche en texte persistant près du bouton et s'annonce par `useAnnouncer()`, avec `<NuxtAnnouncer />` monté une fois dans `app.vue` (4.1.3). Jamais un toast seul.
- Protection anti-robots : Cloudflare Turnstile en mode géré, dans la langue de la page, utilisable au clavier ; aucun test à énigme (1.1.1, exception CAPTCHA ; 2.1.1). Le critère 3.3.8 ne vise que les formulaires de connexion.

### Composants Nuxt UI

- Fenêtre, menu déroulant, onglets, infobulle, popover : le composant Nuxt UI, dont Reka UI gère le focus, Échap et les attributs ARIA.
- Ce qu'ils ne font pas, et qui reste à faire : le nom des boutons à icône, `autocomplete`, le focus sur la première erreur, le contraste des couleurs du projet.

### Vérifier

- Automatique, en CI : axe-core (`@axe-core/playwright`) sur chaque page, dans chaque langue et chaque thème, avec les règles WCAG 2.2 A et AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) : zéro violation. Lighthouse reste un garde-fou (≥ 95).
- Manuel, à chaque section : clavier seul, VoiceOver avec Safari, NVDA avec Firefox, zoom à 200 % puis 400 %, espacement du texte (interligne 1,5, paragraphes 2 em, lettres 0,12 em, mots 0,16 em), mouvement réduit, contrastes forcés.

## SEO

Sources : documentation de Google Search Central et web.dev. Les idées reçues sont signalées comme telles.

### Contenu et balises

- Chaque page indexable a un `<title>` unique, descriptif et concis, dans sa langue ; le nom du site y figure une seule fois, au début ou à la fin, après un séparateur. Idée reçue : il n'y a pas de limite de longueur ; Google coupe à la largeur de l'écran, donc l'essentiel va en tête.
- Chaque page a une meta description propre : des phrases qui résument la page, jamais une liste de mots-clés. Idée reçue : aucune longueur n'est imposée, et Google construit d'abord l'extrait à partir du contenu de la page.
- Le titre principal est dans le premier `h1` visible ; la hiérarchie `h2` / `h3` sert l'accessibilité. Idée reçue : l'ordre et le nombre des titres ne jouent pas sur le classement.
- Les mots que le public tape vraiment, sans répétition. Idées reçues : Google ignore `meta keywords`, et des mots-clés dans le domaine ou le chemin d'URL n'ont presque aucun effet.
- Un contenu utile, fiable et original, avec l'information importante en texte. Idées reçues : aucune longueur minimale, et E-E-A-T n'est pas un facteur de classement.
- Images : `alt` court et descriptif, sans accumulation de mots-clés ; nom de fichier descriptif ; image placée près du texte qui s'y rapporte. `loading="lazy"` seulement sous le premier écran ; l'image LCP reçoit `fetchpriority="high"`.
- Open Graph (`og:title`, `og:description`, `og:image`) sert aux aperçus de partage, en cohérence avec le `<title>` ; ce n'est pas un signal de classement.

### URL, langues et indexation

- Un contenu, une URL indexable : les autres adresses redirigent vers elle ou la désignent comme canonique. Une ancre `#section` n'est pas une URL distincte. Idée reçue : le contenu dupliqué n'entraîne aucune pénalité, Google choisit une canonique.
- Chaque langue a sa propre URL, la langue dans le chemin (`/fr`, `/en`), jamais déterminée par un cookie, un paramètre ou le navigateur. Chaque version a une canonique absolue vers elle-même et traduit tout son contenu principal. Google détecte la langue par le contenu visible, pas par `lang` ni `hreflang`.
- `hreflang` : chaque version liste toutes les versions, elle comprise, en URL absolues, avec des liens réciproques (sinon Google les ignore), plus `x-default` vers la page de repli. Les balises `<link>` et le sitemap donnent les mêmes URL et le même `x-default` (la tête ajoute les codes sans région, `fr`, `en`).
- Aucune redirection automatique d'une langue vers une autre selon le navigateur ou l'adresse IP : chaque page a un lien `<a href>` vers ses autres langues. Une détection de langue ne vit qu'à la racine `/`, en 302 (jamais 301 ni 308) ; Googlebot arrive sans `Accept-Language`.
- Exclure une page : `noindex` (balise meta ou en-tête `X-Robots-Tag`), l'URL restant explorable. Idée reçue : un `Disallow` dans `robots.txt` ne retire pas une page de l'index, et Google ignore `noindex` dans `robots.txt`.
- Une URL inconnue renvoie un vrai 404, jamais une page en 200. 301 ou 308 pour un déplacement définitif, 302 ou 307 pour un renvoi temporaire ou conditionnel ; pas de chaîne de redirections.
- Données structurées : `Organization` (ou son sous-type le plus précis) en JSON-LD sur la page d'accueil, conforme au texte visible (`name`, `url`, `logo` d'au moins 112 × 112 px, `sameAs`), validé par le Rich Results Test. Pas de `FAQPage` ni de `HowTo` pour un résultat enrichi : Google n'affiche plus HowTo depuis septembre 2023, ni FAQ depuis mai 2026.

### Performance et suivi

- Core Web Vitals au 75e centile des visites réelles, mobile et bureau séparés : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Lighthouse ne mesure pas l'INP et ne remplace pas les données de terrain (CrUX, rapport Core Web Vitals de Search Console).
- Search Console : domaine de production validé dès la mise en ligne, sitemap soumis, pages vérifiées avec l'outil d'inspection d'URL.
- Fonctions IA de Google (AI Overviews, AI Mode) : rien de particulier à faire, une page indexée et éligible à un extrait suffit. Idée reçue : ni `llms.txt` ni balisage spécial ne servent pour Google. La page et ses ressources restent explorables, dans `robots.txt` comme au niveau du CDN.

### Nuxt SEO

- Un seul module dans `modules` : `@nuxtjs/seo`. Chaque sous-module se règle sous sa clé : `site`, `robots`, `sitemap`, `schemaOrg`, `seo` (seo-utils), `linkChecker`, `ogImage`, `aiReady`, `skewProtection`.
- Un sous-module inutile se coupe avec `false` (`ogImage: false`), raison en commentaire : son installation est sautée, alors qu'avec `{ enabled: false }` elle s'exécute pour rien.
- `site.url` : l'URL publique, lue dans `NUXT_PUBLIC_SITE_URL` par une seule constante qui sert aussi à `i18n.baseUrl`. Le projet fait échouer le build si elle manque (dans Mo : `modules/require-site-url.ts`) : Nuxt SEO ne fait qu'avertir, et sans elle canonical, hreflang et `og:url` deviennent relatifs.
- Avec `@nuxtjs/i18n`, pas de `site.defaultLocale` : la langue par défaut vient d'i18n, qui l'emporte. Chaque locale a un `language` BCP 47 avec région (`fr-FR`, `en-GB`).
- Indexation : `NUXT_SITE_INDEXABLE=false`, en variable de build, sur tout déploiement qui n'est pas la production publique et qu'aucun site ne lie. La balise robots et l'en-tête `X-Robots-Tag` des pages prérendues sont écrits au build, et `robots.txt` se ferme (`Disallow: /`). Un site déjà indexé qu'il faut retirer reste explorable avec `"/**": { robots: "noindex, nofollow" }`. Jamais de `<meta name="robots">` à la main.
- Retirer une page de l'index : `routeRules: { "/fr/chemin": { robots: false }, "/en/chemin": { robots: false } }`, sur les chemins localisés : l'en-tête `X-Robots-Tag` écrit au build ne suit que le chemin exact.
- Une racine `/` qui redirige selon la langue s'exclut du sitemap par `sitemap: { exclude: [/^\/$/] }` : sinon elle remplace la page de la langue par défaut dans les `hreflang` du sitemap. La chaîne `"/"` serait déclinée par langue (`/`, `/fr`, `/en`) et retirerait l'accueil de chaque langue ; une expression régulière n'est pas déclinée.
- Chaque page fixe son titre et sa description, en getters pour suivre la langue (`useSeoMeta({ title: () => t("meta.title") })`). Ne jamais réécrire ce que seo-utils déduit (`og:type`, `og:site_name`, `og:title`, `og:description`, `twitter:card`) ni ce que pose `useLocaleHead()`.
- `hreflang`, `x-default`, canonical, `og:url`, `og:locale` et `og:locale:alternate` viennent de `useLocaleHead()`, une seule fois, dans `app.vue` ; ils remplacent ceux de seo-utils. Jamais écrits à la main.
- Gabarit de titre : celui de seo-utils (`%s %separator %siteName`), séparateur dans `site.separator`. `titleTemplate: null` seulement pour une page dont le titre contient déjà le nom du site.
- Image sociale statique `public/og-image.png` (1200 × 630) et icônes dans `public/` (`favicon.ico`, `icon.svg`, `apple-touch-icon.png`) : seo-utils écrit les balises. Le texte alternatif de l'image sociale se traduit par `useSeoMeta({ ogImageAlt })`.
- Schema.org : l'identité une fois, dans `schemaOrg.identity` (`Organization` pour une entreprise : `name`, `logo`, `sameAs`) ; ses textes traduits par `defineOrganization()` dans `app.vue`. `WebSite` et `WebPage` sont produits par le module, avec `inLanguage`.
- Sitemap : le module produit l'index et un sitemap par langue, avec `hreflang` et `x-default`. Sur un site sans contenu dynamique, `sitemap: { zeroRuntime: true }`. Pas de `lastmod` à la date du build.
- Robots des IA : décision écrite dans `robots.blockAiBots` (`'training'` refuse l'entraînement et garde les robots de recherche IA, mais bloque Google-Extended, ce qui retire aussi le site de l'ancrage de Gemini ; `true` bloque tous les robots IA connus).
- Contrôle : `linkChecker: { failOnError: true }` et un `nuxt build` dans la CI. L'indexation se vérifie sur le build : `.output/public/*.html` et `_headers` après `nuxt build`, `robots.txt` et sitemaps servis par `nuxt preview` (ils ne sont écrits dans `.output/public` que s'ils sont prérendus). Jamais sur `nuxt dev`, où le site n'est pas indexable. Les routes de diagnostic (`/__robots__/debug.json`, `/__sitemap__/debug.json`, `/__site-config__/debug.json`, `/__schema-org__/debug.json`) n'existent qu'en développement ou avec `debug: true`.

## Configuration et déploiement

- Aucune URL ni aucun secret en dur : variables d'environnement, listées dans `.env.example`. Une variable `NUXT_PUBLIC_*` est lue à l'exécution par le Worker et figée au build dans les pages prérendues : il faut la définir aux deux endroits.
- Cloudflare Workers : preset Nitro `cloudflare_module` avec `cloudflare.deployConfig` et `nodeCompat`, pour que le build local soit celui de Workers Builds.
- `nuxt-ui-kit` s'installe comme dépendance pnpm épinglée sur un tag, avec `extends: ["nuxt-ui-kit"]`.

## Git et façon de travailler

- Branches `feat/…`, `fix/…`, `chore/…`. Commits atomiques ; message à l'impératif, en anglais : un titre, puis des puces.
- Le propriétaire du dépôt commite lui-même. Les changements sont préparés sur une branche, avec pour chaque commit la liste des fichiers et le message, dans la page de suivi du chantier.
- Trois dépôts : une consigne d'architecture, de nommage ou de style donnée dans un projet s'applique aussi à ce starter ; un défaut du starter ou du kit se corrige dans son propre dépôt.
