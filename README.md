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
| `./sync-ds.sh docs/handoff/reference/ds-export` | resynchronise le design system (sens unique, voir ci-dessous) |
| `node scripts/favicons.mjs` | régénère favicon.ico / apple-touch / icon-512 depuis l'artwork client |
| `npx serve docs/handoff/reference` | sert les maquettes HTML de référence sur `:3000` |

**En dev uniquement**, `http://localhost:4321/dev` : hub des 14 gabarits —
routes cliquables, état dérivé (livré / stub / à créer), instances des
collections, liens vers les maquettes. Jamais émis au build.

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

## Chantier en cours

Le site se construit par gabarits depuis les maquettes du projet claude design
(`docs/handoff/`). **L'état d'avancement vit dans `docs/handoff/ETAT.md`** —
feuille de route, points de vigilance, arbitrages. Au 24 septembre 2026 :
preflight, accueil et vagues A/B/C livrés et recettés ; restent la vague D
(blog, auteurs, légales — encore en stubs) et la recette globale.

## Avant mise en ligne

- Figer le domaine : `astro.config.mjs`, `src/lib/seo.ts`,
  `src/pages/sitemap.xml.ts` et `public/robots.txt` pointent le placeholder
  `www.lavenir-immobilier.be`.
- La recette globale (`docs/handoff/prompts/99-recette.md`) supprime
  `src/pages/test.astro` (banc de comparaison) et vérifie sitemap, maillage,
  adhérence DS, SEO et accessibilité sur l'ensemble.
- Remplacer les placeholders `.ph` quand les photos de l'agence arrivent.
