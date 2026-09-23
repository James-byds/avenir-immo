# 14 — Pages légales (`/legal/{mentions,confidentialite,cookies,honoraires}`)

**Référence** : `docs/handoff/reference/legale.html` (modèle : politique de confidentialité, 8 sections). Règles du DS : « En clair » obligatoire en tête des sections longues ; max 1 `.lg-cta` par page ; le switcher `.lg-switch` figure sur les 4 documents.

---

## Layout `src/layouts/LegalLayout.astro`

Props : `doc` (`mentions | confidentialite | cookies | honoraires`), `titre`, `version`, `date`, `lecture`, `toc[]`. Rend :

1. `PageHead variant="tint"` — `Breadcrumb`, `.lg-head` (H1, `.lg-meta` « version · date · temps de lecture »), `<nav class="lg-switch">` : 4 pilules, la courante en `.on`.
2. `.sec--white.sec--cont` `.lg-layout` : `<aside class="lg-toc">` sticky (sommaire, scroll-spy actif via `ds-script.js` dès qu'un `#toc` existe) + `.toc-action` (encart vert : CTA « Estimer mon bien », remplaçable par une action propre au document — « Gérer mes cookies » sur `cookies`) ; colonne `.lg-article` = `<slot />`.
3. `.lg-cta` (bandeau sombre final, **unique**) — « Une question sur vos données ? » → `/contact` ; texte adapté par document.

## Les 4 pages `src/pages/legal/*.astro`

Contenu en Markdown/MDX ou directement en `.astro` dans le slot, structuré en `<section id="s1">…` : H2 numérotés (`01`, `02`… via le compteur mono du DS — pas de numéro en dur dans le texte), `.enclair` en tête de chaque section longue, `.legal` (dt/dd) pour les lignes clé/valeur (responsable du traitement, DPO, IPI, BCE), `.lg-table` pour cookies (finalité · cookie · durée) et registre des données, `.droits`/`.droit` pour la grille RGPD.

- **confidentialite** : les 8 sections de la référence, texte intégral.
- **mentions** : éditeur (L'Avenir Immobilier, Boulevard Tirou 102, BCE, IPI, assurance RC), hébergeur, propriété intellectuelle, médiation (IPI), crédits.
- **cookies** : `.lg-table` 3 colonnes, bouton « Gérer mes cookies » dans `.toc-action` (ouvre le bandeau de consentement — `data-planned` tant qu'il n'existe pas).
- **honoraires** : barème (`.lg-table`), CGV, mention « emprunter de l'argent coûte aussi de l'argent » si une mensualité est citée.

Rédige les textes manquants **de manière factuelle et prudente**, marqués `<!-- À valider par le client -->` — ce ne sont pas des textes juridiques finaux.

## Head

Title « {Titre} · Avenir Immobilier », description de la référence pour `confidentialite`, canonical `/legal/{doc}` ; JSON-LD `WebPage` + `BreadcrumbList`. Ces pages ne sont pas dans le sitemap si `sitemap.xml.ts` ne les liste pas — ajoute-les.

## Livrable

`src/layouts/LegalLayout.astro`, `src/pages/legal/{mentions,confidentialite,cookies,honoraires}.astro`, `components/surfaces/{EnClair,LegalTable,Droits}.astro`, `src/pages/sitemap.xml.ts` (ajout des 4 routes). Aucun contenu de collection.

Recette : `/legal/confidentialite` contre `legale.html` ; scroll-spy actif ; les 4 pilules du switcher pointent vers des routes présentes dans `dist/`.
