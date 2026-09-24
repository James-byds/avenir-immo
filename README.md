# Avenir Immobilier — site public

Site vitrine d'Avenir Immobilier, agence immobilière de prestige à Charleroi :
accueil, liste et fiches de biens, pages de localité, estimation, équipe, blog,
auteurs, avis, contact, pages légales.

**Stack** : Astro 7 (statique), Tailwind 4 (`@tailwindcss/vite`), îles React 19
en `client:visible`, Leaflet pour les cartes. Aucun back-end : contenu typé en
Content Collections, données mock en attendant la source réelle (CMS / API).

## Démarrage

```sh
npm ci
npm run dev          # http://localhost:4321
```

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build statique dans `dist/` |
| `npm run preview` | sert le build |
| `npx astro check` | typage + validation des pages |
| `node scripts/recette.mjs` | recette statique du build : sitemap, liens et ancres, `data-planned`, cartes, couleurs en dur (après `npm run build`) |
| `./sync-ds.sh docs/handoff/reference/ds-export` | resynchronise le design system (sens unique, voir ci-dessous) |
| `node scripts/favicons.mjs` | régénère favicon.ico / apple-touch / icon-512 depuis l'artwork client |
| `npx serve docs/handoff/reference` | sert les maquettes HTML de référence sur `:3000` |

**En dev uniquement**, `http://localhost:4321/dev` : hub des 14 gabarits —
routes cliquables, état dérivé (livré / stub / à créer), instances des
collections, liens vers les maquettes. Jamais émis au build. La page `/404`
(`src/pages/404.astro`) est émise en `dist/404.html`, hors sitemap, `noindex`.

## Architecture

```text
src/
├── styles/
│   ├── ds/          ← COPIE du design system — NE JAMAIS ÉDITER (sync-ds.sh)
│   ├── local.css    ← écarts maquette en attente de reprise dans le DS
│   ├── theme.css    ← pont @theme inline : les tokens DS deviennent utilitaires Tailwind
│   └── app.css      ← point d'entrée (l'ordre des imports est significatif)
├── components/
│   ├── chrome/      ← TopBar, SiteHeader, SiteFooter, PageHead (hors DS)
│   ├── core/ actions/ forms/ surfaces/   ← ports .astro des composants DS
│   └── islands/     ← les 5 îles React : Faq, ShareBar, ContactForm, DropdownMenu, MapLeaflet
├── content/         ← 6 collections (biens, articles, auteurs, equipe, communes, avis)
├── content.config.ts← schémas Zod — les règles métier y sont des contraintes de build
├── layouts/         ← Base, Page, Article, Legal
├── lib/             ← seo.ts (JSON-LD), format.ts, maillage.ts (combinaisons commune × type)
└── pages/           ← les gabarits ; sitemap.xml.ts est généré à la main
docs/
├── ds/              ← architecture, inventaire des 29 composants, arborescence
└── handoff/         ← prompts des gabarits, ETAT.md (suivi), reference/ (maquettes, hors git)
```

**Le design system est la source de vérité.** `src/styles/ds/` est une copie :
toute correction de style se fait dans le projet design system puis se
resynchronise — une retouche locale serait écrasée. Les classes DS portent le
style, Tailwind ne pose que la grille. Règles complètes dans `CLAUDE.md`
(chargé par Claude Code) et `docs/ds/architecture.md`.

## Contenu et garde-fous

Les schémas Zod de `src/content.config.ts` transforment les règles métier en
erreurs de build plutôt qu'en accidents de production :

- tout chiffre publié porte une **source datée** ;
- toute mensualité de crédit porte sa **mention légale** ;
- les pages de localité n'existent que pour les combinaisons commune × type ×
  transaction **réellement pourvues** (`communes.combinaisons` ∩ biens publiés) —
  jamais de page ni de lien vers une combinaison vide.

Les photos sont des placeholders `.ph` en attendant les visuels de l'agence :
remplacer chaque `.ph` par un `<img>` au même endroit, rien d'autre.

## Contrat d'URL

`/` · `/biens` (+ filtres `?cat=&loc=&type=&q=`) · `/biens/[slug]` ·
`/[type]-a-[transaction]-[commune]` (ex. `/maison-a-vendre-liege`) ·
`/communes` · `/equipe` (+`/[slug]`) · `/blog` (+`/[slug]`) · `/auteurs`
(+`/[slug]`) · `/estimation` · `/contact` · `/avis` · `/a-propos` ·
`/legal/{mentions,confidentialite,cookies,honoraires}`.

Le motif des pages de localité est **figé** (le changer coûte des redirections).

## État du chantier

Le site a été construit par gabarits depuis les maquettes du projet claude design
(`docs/handoff/`). **L'historique et les arbitrages vivent dans
`docs/handoff/ETAT.md`.** Au 24 septembre 2026, les 14 gabarits sont livrés,
recettés un à un puis passés par la recette globale
(`docs/handoff/recette-globale.md`) : 104 pages, build et `astro check` verts,
0 violation axe, 0 lien interne cassé, tag `v0.1.0-maquette`.

## Dette design system

Ce que le dépôt porte à la place du DS — `src/styles/local.css` (blocs titrés),
les `<style>` scoped « à reprendre dans le DS », les écarts d'API de composants,
les corrections d'accessibilité — est inventorié dans **`docs/ds/dette-ds.md`**,
avec la page qui utilise chaque bloc. C'est le handoff retour vers le design
system : quand le DS reprend un point, on supprime la copie locale et on
resynchronise.

Les CSS du DS et `local.css` sont importés dans la couche `ds`
(`src/styles/app.css`) : les utilitaires Tailwind s'appliquent sur les éléments
stylés par le DS, et tout `<style>` de page ou de composant est enveloppé dans
`@layer ds { … }`.

Les pages prévues mais pas encore codées (ancres `data-planned`, sans `href`)
sont listées dans `docs/pages-planifiees.md`.

## Avant mise en ligne

- Figer le domaine : `astro.config.mjs`, `src/lib/seo.ts`,
  `src/pages/sitemap.xml.ts` et `public/robots.txt` pointent le placeholder
  `www.lavenir-immobilier.be`.
- Trancher les identités de contact incohérentes héritées de la maquette
  (téléphone `071 22 11 41` au pied de page vs `+32 71 32 14 70` en en-tête,
  `info@` vs `contact@`, siège Boulevard Tirou vs Place Roger Desaise, IPI
  509 217 sur trois entités) — relevé dans `docs/handoff/ETAT.md`.
- Poids des actifs clients (fonte variable 443 Ko, `equipe-avenir.png` 3,5 Mo,
  portraits ~330 Ko) : Lighthouse mobile reste sous 90 tant qu'ils ne sont pas
  exportés aux tailles d'affichage (`docs/ds/dette-ds.md`, § 6).
- Remplacer les placeholders `.ph` quand les photos de l'agence arrivent.
