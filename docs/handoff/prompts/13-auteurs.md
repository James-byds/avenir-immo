# 13 — Auteurs : hub (`/auteurs`) + page auteur (`/auteurs/[slug]`)

**Références** : `docs/handoff/reference/auteurs.html`, `auteur-camille-renard.html` (+ 4 autres `auteur-*.html`). Classes dans un `<style>` de page à recopier valeurs inchangées : `.au-hero`, `.au-grid`, `.au-side`, `.au-stats`, `.au-count`, `.au-charte`, `.au-toolhead`, `.w-top`, `.w-id`, `.w-portrait`, `.w-quote`, `.w-specs`, `.writer--photo`, `.wide`. Les auteurs sont des **rédacteurs**, distincts des agents : jamais de biens sur ces pages.

---

## A. Hub `src/pages/auteurs/index.astro`

1. `PageHead` plain `tight` — H1 « Chaque article est signé, par quelqu'un. », chapô.
2. `.sec--white` — « Quatre conseillers, une notaire invitée » — `.writers` : 5 `.writer.writer--photo` (`.w-top` : `.w-portrait` + `.w-id` ; `.w-quote` ; `.w-specs` ; nb d'articles ; contact). Photo = seul lien vers l'auteur, ou le nom — **un seul lien par carte**.
3. `.blog .sec--tint` — « À lire cette semaine » — 3 `ArticleCard variant="compact"` (les plus récents).
4. `.sec--white` — « Ce que vous ne lirez jamais ici » — `.au-charte` : charte éditoriale (liste ✓).
5. `.finalcta.on-dark` aplat vert profond — « Une question revient souvent ? Écrivons-la. » (`FinalCta tone="deep"`, CTA → `/contact?sujet=article`).

## B. Auteur `src/pages/auteurs/[slug].astro`

`getStaticPaths` sur `auteurs`.

1. `PageHead` plain avec `.ah-stats` (règle `.page-head:has(.ah-stats)` de `local.css` rétablit le padding bas) — `Breadcrumb` (Accueil › Blog › Rédacteurs › Nom), `AuthorHero` : portrait **rond** (initiales sur `--green-tint` si pas de photo), H1 nom, rôle, méta mono (depuis · n articles · spécialités), actions (`.btn` écrire · `.btn--ghost` voir les articles → `#articles`), `.ah-stats` (nb articles · lectures · dernier article), `.au-quote`. Aligner le portrait en haut (`.author-hero{align-items:flex-start}` — déjà dans `local.css`).
2. `#articles .blog .sec--tint` — `.au-toolhead` (Seg catégories + `.au-count`), grille de `ArticleCard variant="compact"` filtrée `auteur === slug`, `Pagination` si > 9.
3. `.sec--white` — « Les autres rédacteurs » — 4 `.writer` compacts.
4. `.finalcta.on-dark` aplat vert profond — « Et si on commençait par un café ? » (`FinalCta tone="deep"`).

Alternance : blanc → tendre → blanc → vert profond (dans les deux pages).

## Head

Hub : title/description de la référence, canonical `/auteurs`. Auteur : « {Nom} — {rôle} · Avenir Immobilier », description « Les {n} articles de {Nom}, {rôle} : … », canonical ; JSON-LD `Person` (`jobTitle`, `worksFor`, `sameAs` liens) + `BreadcrumbList`.

## Livrable

`src/pages/auteurs/{index,[slug]}.astro`, `components/surfaces/{AuthorHero,WriterCard}.astro` (si absents), `components/surfaces/EditorialCharter.astro` (`.au-charte`). Contenu : `src/content/auteurs/*.md` (5 : rôle, bio, citation, spécialités, liens), `articles.auteur` renseigné.

Recette : `/auteurs`, `/auteurs/camille-renard` contre leurs références ; aucune `PropertyCard` sur ces pages.
