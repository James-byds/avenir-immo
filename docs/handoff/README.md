# Handoff — Avenir Immobilier · site complet (14 gabarits)

**Pour** : le dépôt Astro `James-byds/avenir-immo` (Astro 7 + Tailwind 4, îles React), piloté dans Claude Code.
**Depuis** : le projet maquette Avenir Immobilier (compositions de pages liées au design system).
**Date** : 23 septembre 2026.

## Ce qu'est ce dossier

Les fichiers de `reference/` sont des **références de design écrites en HTML** : des prototypes qui montrent l'aspect et le comportement voulus, pas du code de production à copier. La mission est de **recréer ces pages dans l'environnement du dépôt** — layouts et composants `.astro`, îles React existantes, Content Collections, classes du design system déjà synchronisées dans `src/styles/ds/` — en suivant les conventions posées par `AGENTS.md` et `docs/ds/*.md` du dépôt.

**Fidélité : haute.** Couleurs, typographie, espacements, rayons, ombres, états et copie sont finaux. Le rendu Astro doit être identique au pixel près à la référence à 1440 px et à 375 px, **à une différence près** : les photos sont des placeholders `.ph` en attendant les visuels de l'agence.

## Où ranger ce paquet dans le dépôt

```
avenir-immo/
├── .claude/agents/                 ← repo/.claude/agents/
├── .gitignore                      ← + repo/.gitignore.append
├── src/styles/local.css            ← repo/src/styles/local.css
└── docs/handoff/
    ├── README.md, 00-marche-a-suivre.md, prompts/     (versionnés)
    └── reference/                                     (IGNORÉ par git — 3 Mo d'assets déjà dans public/, HTML non livrable)
```

Tous les prompts et agents pointent sur `docs/handoff/reference/`. Servir avec `npx serve docs/handoff/reference`.

## Contenu

| Dossier / fichier | Rôle |
|---|---|
| `00-marche-a-suivre.md` | Ordre des sessions Claude Code, organisation en sous-agents, portes de contrôle |
| `prompts/00-preflight.md` … `14-legales.md` | **Un prompt de démarrage par gabarit**, prêt à coller dans Claude Code |
| `prompts/99-recette.md` | Prompt de recette finale (adhérence DS, SEO, a11y, build) |
| `repo/` | Fichiers à déposer tels quels dans le dépôt : `src/styles/local.css`, `.claude/agents/*.md`, `.gitignore.append` (à concaténer au `.gitignore`) |
| `reference/*.html` | Les 27 pages de la maquette (voir `reference/README.html` pour l'index) |
| `reference/squelettes-pages.md` | Pour chaque page : sections dans l'ordre, H1/H2, JSON-LD, scripts — le plan de montage de chaque gabarit |
| `reference/ds-export/` | Instantané du design system au 23 sept. (tokens, `site/site.css`, `script.js`, assets) — **c'est l'argument de `./sync-ds.sh`** |
| `reference/local.css` | Écarts de la maquette pas encore repris dans le DS (139 classes) — version brute ; la version adaptée au dépôt est dans `repo/src/styles/local.css` |
| `reference/assets/` | Portraits d'agents, pictos de preuve, logos, signe V, favicons, fonte |
| `reference/handoff-rythme-visuel.md` | Le parti de rythme (alternance des fonds) et ses règles — lecture obligatoire avant tout gabarit |
| `reference/journal-maquette.md` | Journal des décisions prises page par page (pourquoi telle section est là, ce qui a été écarté) |

## Ce que le dépôt a déjà (vu le 23 sept., `main@3777a30`)

- `src/styles/ds/` synchronisé, `theme.css` (pont `@theme inline`), `app.css`, fonte woff2 dans `public/fonts/`
- 4 îles React : `Faq`, `ShareBar`, `ContactForm`, `DropdownMenu`, + `MapLeaflet`
- `src/content.config.ts` (6 collections Zod), `lib/{seo,format,maillage}.ts`, `sitemap.xml.ts`
- `AGENTS.md`, `docs/ds/*.md`, `sync-ds.sh`

**Pas encore dans `main`** : aucun `.astro` (ni layouts, ni composants, ni pages), aucun contenu dans `src/content/`. Le header/footer et l'accueil partiel annoncés sont donc soit locaux, soit sur une autre branche — le prompt `00-preflight` commence par l'inventaire réel.

## Les trois écarts à connaître avant de coder

1. **`src/styles/ds/` du dépôt est en retard sur `reference/ds-export/`.** Le DS a repris depuis les utilitaires `.sec--*`, les en-têtes `.page-head--band/--ink/--tint`, `SellHere compact`, `LocalityLinks`, les pages de localité `.q-*`. Première action : `./sync-ds.sh reference/ds-export`.
2. **139 classes ne vivent que dans `local.css`** (états de la liste `.sk-*`/`.empty*`, sélecteur de villages `.vil-*`, guide `.guide-pt`, preuves `.proofs`, CTA photo `.fc-*`, cartes équipe `.member--contact`/`.m-*`, curseurs `.sim-*`, etc.). Elles sont livrées prêtes dans `repo/src/styles/local.css`, à importer entre `ds/styles.css` et `theme.css`. Elles sont **en attente de reprise dans le DS** : ne pas les réécrire, ne pas les déplacer.
3. **33 classes vivent dans des `<style>` de page** (`avis.html`, `auteurs.html`, `auteur-*.html`, `contact.html`) : `.av-*`, `.au-*`, `.c-*`, `.w-*`, `.wall-*`. Les recopier dans un `<style>` scopé du composant `.astro` correspondant, valeurs inchangées.

## Contrat d'URL

Les routes sont figées par `lib/maillage.ts` et `sitemap.xml.ts` : `/`, `/biens`, `/biens/[slug]`, `/[type]-a-[transaction]-[commune]` (ex. `/maison-a-vendre-liege`), `/communes` (hub), `/equipe`, `/equipe/[slug]`, `/blog`, `/blog/[slug]`, `/auteurs`, `/auteurs/[slug]`, `/estimation`, `/contact`, `/avis`, `/a-propos`, `/legal/{mentions,confidentialite,cookies,honoraires}`. La page quartier Gerpinnes (`quartier.html`) est un cas de `[type]-a-[transaction]-[commune]` à contenu enrichi (carte des villages) : `/maison-a-vendre-gerpinnes`.

La liste `biens.html` lit `?cat=vente|location|vendu&loc=<slug>&type=<slug>&q=<texte>` — c'est ce qui rend chaque ancre du maillage fonctionnelle sans page par combinaison. À conserver côté Astro (lecture côté client, HTML pré-rendu avec la grille complète).

## Données

Pas de source décidée : **mock typé** via les Content Collections du dépôt. Chaque prompt indique quel contenu extraire des HTML de référence (biens, agents, articles, avis, communes). Tout chiffre publié porte une `source` datée — c'est déjà obligatoire dans les schémas Zod.

## Fichiers du projet maquette contenant le design

`index.html`, `biens.html`, `bien.html`, `localites.html`, `maison-a-vendre-liege.html`, `appartement-a-louer-liege.html`, `quartier.html`, `estimation.html`, `contact.html`, `avis.html`, `a-propos.html`, `equipe.html`, `equipe-*.html` (6), `blog.html`, `article.html`, `auteurs.html`, `auteur-*.html` (5), `legale.html`, `local.css`, `script.js`. Tous recopiés dans `reference/`.
