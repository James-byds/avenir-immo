# Handoff — Avenir Immobilier DS → Astro 5 + Tailwind 4

Pour un environnement **Claude Code**. Ce dossier contient tout ce qu'il faut copier
dans le dépôt Astro, plus la décision d'architecture qui conditionne le reste.

---

## 1. La décision à ne pas prendre à la légère

**Ne réécrivez pas `site/site.css` en classes Tailwind.**

Ce fichier fait 1 930 lignes et n'est pas du CSS générique : ce sont des décisions
validées une par une avec le client, avec des valeurs exactes (rayons 11/16/100 px,
ombres teintées encre, `font-stretch: 112%`), des règles de contraste corrigées après
audit (`--ink-mute` → `--ink-soft` sur fond teinté), et surtout des **crochets de
cascade** qui n'ont pas d'équivalent utilitaire :

```css
.on-dark .btn--ghost, .footer .btn--ghost, .trust-sum .btn--ghost { … }
```

Porté en utilitaires, chaque `.btn--ghost` devrait décider seul de son contexte.
C'est exactement le genre de régression qui ne se voit pas en revue de code et qui
se voit en production.

### Le partage retenu

| | Outil | Pourquoi |
|---|---|---|
| Composants, sections, états, thèmes sombres | **classes du DS** (`.btn`, `.card`, `.toolbar`, `.sec--ink`) | déjà validé, synchronisable, un seul endroit à corriger |
| Mise en page d'une vue, grilles, espacements ponctuels, prototypage | **utilitaires Tailwind** | c'est là que Tailwind est meilleur que du CSS ad hoc |
| Couleurs, rayons, ombres, fontes | **tokens du DS**, exposés à Tailwind via `@theme inline` | une seule source de vérité |

Concrètement : `<article class="card">` — jamais
`<article class="rounded-2xl bg-white shadow-sm …">`. Mais
`<div class="grid gap-4 md:grid-cols-3">` pour poser trois cartes : oui.

### Le pont `@theme inline`

`theme.css` (dans ce dossier) mappe les tokens du DS dans les espaces de noms
Tailwind 4. Le mot-clé `inline` est le point important : l'utilitaire généré
**référence** la variable au lieu d'en copier la valeur.

```css
@theme inline { --color-green: var(--green); }
/* → .bg-green { background-color: var(--green) } */
```

Résultat : quand le DS change `--green`, `bg-green` suit **sans regénérer quoi que
ce soit**. Sans `inline`, Tailwind copierait `#17413B` dans le CSS compilé et les
deux systèmes divergeraient à la première mise à jour de charte.

---

## 2. Installation

```bash
npm create astro@latest avenir-web -- --template minimal --typescript strict
cd avenir-web
npm i tailwindcss @tailwindcss/vite
```

> ⚠️ **Pas** `npx astro add tailwind` / `@astrojs/tailwind` : cette intégration cible
> Tailwind 3. En v4 on passe par le plugin Vite.

`astro.config.mjs` :

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://avenir-immobilier.be',
  vite: { plugins: [tailwindcss()] },
});
```

### Arborescence cible

Vue courte ci-dessous ; l'arborescence complète du dépôt (layouts, composants,
content collections, routes) est dans **`ARBORESCENCE.md`**.

```
src/
  styles/
    ds/                 ← copie du design system, NE PAS ÉDITER
      styles.css
      tokens/{fonts,colors,typography,spacing,effects}.css
      site/site.css
    theme.css           ← le pont Tailwind (fourni ici)
    app.css             ← point d'entrée unique
  layouts/BaseLayout.astro
  components/…
public/
  fonts/AcuminVariable.woff2
  favicon-32.png  favicon-180.png  favicon-512.png
  assets/…            ← logos, signe V
```

`src/styles/app.css` :

```css
@import "tailwindcss";
@import "./ds/styles.css";   /* tokens + site.css — l'ordre compte */
@import "./theme.css";       /* le pont : après les tokens */
```

---

## 3. Ce qu'on copie du design system

Depuis ce projet, vers `src/styles/ds/` :

```
styles.css
tokens/fonts.css  tokens/colors.css  tokens/typography.css
tokens/spacing.css  tokens/effects.css
site/site.css
```

Et vers `public/` :

```
assets/logo-lavenir-immobilier{,-blanc,-jaune,-vert}.png
assets/signe-v.png  assets/signe-v-128.png  assets/signe-v-128-blanc.png
assets/favicon-32.png  assets/favicon-180.png  assets/favicon-512.png
assets/fonts/AcuminVariableConcept.otf
script.js                       → public/ds-script.js
```

`sync-ds.sh` est fourni : il refait cette copie. **Aucune édition dans
`src/styles/ds/`** — toute retouche de style se fait dans le design system, sinon
la synchro suivante l'écrase.

### Deux corrections à faire à la copie

1. **`tokens/fonts.css`** pointe sur `../assets/fonts/…` (chemin du DS). Dans Astro,
   la fonte est servie depuis `public/` : remplacer par `/fonts/AcuminVariable.woff2`.
   Le fichier `fonts.astro.css` de ce dossier est la version corrigée, à utiliser
   à la place.
2. **Convertir l'OTF en woff2.** L'OTF variable pèse lourd et bloque le premier
   rendu. `fonttools` :
   ```bash
   pip install fonttools brotli
   fonttools varLib.instancer  # si besoin de figer des axes
   fonttools ttLib.woff2 compress assets/fonts/AcuminVariableConcept.otf
   ```
   Garder les axes `wght` **et** `wdth` : le display utilise `font-stretch: 112%`.

---

## 4. Composants — Astro statique ou île React ?

Le DS expose 29 composants React. La grande majorité sont des **enveloppes fines
autour de classes CSS** : aucune raison d'embarquer React pour les rendre.

```jsx
// Button.jsx dans le DS — tout est dans les classes
export function Button({ variant, block, arrow = true, href, children, ...rest }) {
  const cls = ["btn", variant && "btn--" + variant, block && "btn--block"]…
}
```

→ Port `.astro` d'une quinzaine de lignes, **zéro JS envoyé**.

| Port `.astro` (statique) | Île React (`client:visible`) |
|---|---|
| Button, Eyebrow, LinkArrow, Breadcrumb, Placeholder, Badge, Byline, Pagination, PropertyCard, AgentCard, AgencyCard, ArticleCard, ArticleHeader, AuthorBox, AuthorHero, MemberHero, SpecGrid, PebScale, TrustSection, SellHere, LocalityLinks, Input, Select, ChoiceRow, Seg | **Faq** (accordéon + mesure de hauteur + JSON-LD), **ShareBar** (presse-papier + état « copié »), **ContactForm** (état des champs), **DropdownMenu** (clavier + focus) |

Trois cas particuliers :

- **`Faq`** doit rester une île, mais son JSON-LD `FAQPage` a plus de valeur rendu
  côté serveur. Le mieux : émettre le `<script type="application/ld+json">` depuis
  la page `.astro` (mêmes données), et passer `structuredData={false}` à l'île.
- **`DropdownMenu`** est déjà « enhancé » par `script.js` sur les `<select>` natifs.
  Sur une page Astro, préférer le `<select>` + `script.js` à l'île React.
- **Le simulateur de crédit** n'est pas encore un composant du DS (exploration en
  cours, cf. `explorations/`). À porter directement en île Astro/React quand la
  version sera figée.

`component-map.md` détaille les props de chacun.

---

## 5. Pièges de contexte (à lire avant de composer une page)

Les cinq règles d'adhérence du DS deviennent des pièges spécifiques en Tailwind,
parce que les utilitaires rendent trivial de contourner le système sans le vouloir.

| Règle DS | Le piège Tailwind |
|---|---|
| Alternance des fonds : jamais deux sections de même fond | `bg-white` / `bg-green-tint` posés à la main section par section → la règle se perd. **Utiliser `.sec--white` / `.sec--tint` / `.sec--ink` / `.sec--cont`.** |
| `--green-l` ne porte jamais de blanc (2,9:1) | `bg-green-l text-white` compile sans broncher. Texte encre : `bg-green-l text-ink`. |
| Petits textes sur fond teinté ≥ `--ink-soft` | `text-ink-mute` tombe à 4,06:1 sur `--green-tint`. |
| Surface teintée sur surface teintée = invisible | une carte `bg-green-tint` dans `.sec--tint` : repasser en `bg-white border-line`. |
| Surface sombre faite main → `.on-dark` | sans lui, `.btn--ghost` reste blanc plein et double le CTA. |

Le fichier `_adherence.oxlintrc.json` du DS liste les mêmes contraintes sous forme
de règles lint, exploitables côté dépôt.

---

## 6. SEO — ce que le DS attend d'Astro

Le DS a été conçu autour de trois exigences que l'implémentation doit respecter :

- **Réponses FAQ dans le HTML**, seulement masquées par `max-height` — jamais montées
  au clic. Une île `client:visible` satisfait cela (le HTML est pré-rendu) ; un
  `client:only` non.
- **Une ancre par question** (`#faq-…`) qui ouvre la bonne réponse au chargement.
- **Ancres descriptives** dans `LocalityLinks variant="widen"` (« Maisons à vendre à
  Loverval », pas « Loverval »).

Pages de localité : le contenu doit être **réellement local** (droits d'enregistrement
wallons, délais constatés dans l'entité). Une FAQ ou un texte recopié de commune en
commune est du contenu dupliqué — c'est le défaut principal du concurrent analysé
(cf. `Page de localité - plan éditorial.html`).

---

## 7. Checklist de mise en route

- [ ] Astro 5 + `@tailwindcss/vite` installés, `@astrojs/tailwind` **absent**
- [ ] `src/styles/ds/` copié, jamais édité ; `sync-ds.sh` en place
- [ ] `app.css` : `tailwindcss` → `ds/styles.css` → `theme.css`, dans cet ordre
- [ ] Fonte convertie en woff2, axes `wght` + `wdth` conservés, chemin corrigé
- [ ] `BaseLayout.astro` charge la fonte, les favicons et `ds-script.js`
- [ ] Un composant porté (`Button.astro`) pour valider le pont : `bg-green` doit
      produire `var(--green)` dans le CSS compilé, pas `#17413B`
- [ ] `CLAUDE.md` à la racine du dépôt
- [ ] Une page témoin (accueil) composée uniquement de classes DS + grilles Tailwind

---

## 8. Fichiers de ce dossier

| Fichier | Destination |
|---|---|
| `DEMARRAGE.md` | — (mode d'emploi + prompt Claude Code) |
| `EXPORT-DS.md` | — (comment obtenir l'export du DS) |
| `ARBORESCENCE.md` | — (structure cible du dépôt) |
| `theme.css` | `src/styles/theme.css` |
| `fonts.astro.css` | `src/styles/ds/tokens/fonts.css` (remplace la copie) |
| `app.css` | `src/styles/app.css` |
| `BaseLayout.astro` | `src/layouts/BaseLayout.astro` |
| `examples/Button.astro` | `src/components/Button.astro` |
| `examples/PropertyCard.astro` | `src/components/PropertyCard.astro` |
| `CLAUDE.md` | racine du dépôt |
| `component-map.md` | doc d'équipe |
| `sync-ds.sh` | racine du dépôt |

Le design system reste la source de vérité : tokens, `site.css`, composants,
`script.js`, assets. Le dépôt Astro en est **consommateur**.
