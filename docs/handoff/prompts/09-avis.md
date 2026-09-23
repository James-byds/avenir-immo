# 09 — Avis (`/avis`)

**Référence** : `docs/handoff/reference/avis.html` (`<style>` de page : `.av-hero`, `.av-toolhead`, `.av-count`, `.wall`, `.wall-more`, `.wall-note`, `.r-tag` — à recopier dans le composant, valeurs inchangées, « à reprendre dans le DS »).

---

Monte `src/pages/avis.astro` sur `PageLayout solid`. Données : `getCollection("avis")` (190 avis annoncés, 24 affichés + « Voir plus ») — chaque avis porte sa `source` (Google, date).

## Sections

1. `PageHead` plain `tight` — `Breadcrumb`, `.av-hero` : H1 « Ce que nos clients disent, sans filtre. », chapô « tous les avis sont repris de Google, sans tri ni réécriture », `.trust-sum` en aplat vert profond (note 4,8, 190 avis, barres de répartition jaunes, CTA blanc « Laisser un avis ↗ »).
2. `#mur .sec--tint` (le fond est déjà déclaré `#mur{background:var(--green-tint)}` dans `local.css` — n'en redouble pas) — `.av-toolhead` : `Seg` (Tous · Vendeurs · Acquéreurs · Location · avec photos) + `.av-count` + tri ; `.wall` : mur de `.t-card` (variantes `.t-card--photo` avec `.t-photos`/`.t-imgs`, `.t-card--hl` mis en avant, `.t-chip` commune, `.t-date`, `.t-reply` réponse de l'agence, `.t-gsrc`/`.t-glogo` source Google), `.wall-more` « Afficher 24 avis de plus », `.wall-note` source datée. Lightbox photos `.t-lb` (script inline de la référence → `<script>` du composant).
3. `.finalcta.on-dark` aplat vert profond — « Le prochain avis pourrait être le vôtre. » (même composant `FinalCta tone="deep"` que `/contact`).

Alternance : blanc (head) → tendre → vert profond.

## Head

Title « Avis clients — 4,8/5 sur Google · Avenir Immobilier », description de la référence, canonical `/avis` ; JSON-LD `RealEstateAgent` + `AggregateRating` (4,8 · 190) + `Review` × n affichés (auteur, note, date, texte).

## Livrable

`src/pages/avis.astro`, `components/surfaces/ReviewCard.astro` (`.t-card` + variantes) si `TrustSection` ne l'expose pas déjà, `components/surfaces/ReviewWall.astro` (`.av-*`, `.wall*`). Contenu : `src/content/avis/*.md` (compléter à 24 minimum via `contenu`, avec `source`).

Recette : `/avis` contre `avis.html` ; filtrer, ouvrir une photo, « voir plus ».
