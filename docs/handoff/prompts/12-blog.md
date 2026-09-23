# 12 — Blog : hub (`/blog`) + article (`/blog/[slug]`)

**Références** : `docs/handoff/reference/blog.html`, `article.html` (« Home-staging : 7 gestes… », 971 mots). Journal : « Cartes d'article cassées » — **règle absolue : une carte d'article a un seul lien (le titre), étendu à toute la carte ; la racine n'est jamais un `<a>`** (`ArticleCard` ne doit jamais émettre `<a class="art-feature">`).

---

## A. Hub `src/pages/blog/index.astro`

1. `PageHead variant="tint"` — H1 « Comprendre le marché avant de décider. », chapô, `Seg` de catégories avec compteurs (Vendre · Acheter · Louer · Marché · Quartiers) — c'est pour ça que l'en-tête est **tint** et non band (contenu riche).
2. `.sec--white` (padding court → `.sec--short`, pas `style=`) — `ArticleCard variant="feature"` (**une seule** par écran : horizontale teintée, `.af-media` / `.af-body` / `.af-foot`, `Byline small` non cliquable) puis grille de `ArticleCard variant="compact"` (`.art-mini`, `thumb`), `Pagination`. Le lien du titre couvre la carte (`h3 a::after` `z-index:4`, règle de `local.css`).
3. `.sec--tint` — « Cinq rédacteurs, tous du métier » — `.writers` : 5 `.writer` (byline + bio courte + nb d'articles + contact) → `/auteurs/[slug]`.
4. `.finalcta.on-dark` aplat vert profond — « Ce que vaut votre bien, précisément. » (`FinalCta tone="deep"`).

## B. Article `src/pages/blog/[slug].astro`

`getStaticPaths` sur `articles`, corps Markdown rendu (`render()`), prose dans `.lg-article` **uniquement pour le corps** (h2 numérotés mono, puces vertes — c'est le seul gabarit hors légal où cette prose est légitime).

1. `PageHead` plain `tight` — `Breadcrumb` (Accueil › Blog › Catégorie › Titre).
2. `<header class="art-head">` = `ArticleHeader size="large"` : `.art-cat` (aplat vert clair, **texte encre**), H1, `.ah-lede`, `.ah-foot` : `Byline` (44 px, cliquable → auteur) + `.art-meta` (date · temps de lecture), `.ah-media` `.ph` 16/9.
3. `.sec--white.sec--short` — `.art-layout` : `ShareBar variant="sticky"` (île `client:visible`, colonne 56 px collante, redevient rangée sous 960 px ; LinkedIn · Facebook · WhatsApp · e-mail · copier avec état « ✓ Lien copié ») + corps de l'article (5 H2 de la référence), encadrés `.enclair` si le Markdown en porte (`:::enclair` via une directive ou un composant).
4. `<aside class="author-box">` = `AuthorBox` — **max 1, toujours après le corps** (`margin-top` → classe, pas `style=`).
5. `.sec--tint` — « À lire aussi » — 3 `ArticleCard variant="compact"` de même catégorie, jamais l'article courant.
6. `.sec--white` — « Combien vaut votre bien aujourd'hui ? » — `FinalCta` (blanc) ; **pas** un second aplat sombre.

## Head

Hub : title/description de la référence, canonical `/blog`. Article : title « {titre} · Avenir Immobilier », description = `article.data.description`, canonical ; JSON-LD `Article` (`headline`, `author` → `Person` avec `url` auteur, `datePublished`, `dateModified`, `publisher` RealEstateAgent) + `BreadcrumbList`.

## Livrable

`src/pages/blog/{index,[slug]}.astro`, `src/layouts/ArticleLayout.astro`, `components/surfaces/{ArticleCard,ArticleHeader,AuthorBox,Byline,WriterCard}.astro`. Contenu : `src/content/articles/*.md` (≥ 7 articles : ceux de `blog.html` + `index.html#blog`, avec `categorie`, `tempsLecture`, corps réel pour `home-staging-7-gestes`), `src/content/auteurs/*.md`.

Recette : `/blog`, `/blog/home-staging-7-gestes-qui-font-monter-le-prix` contre leurs références ; **0 ancre imbriquée** (`grep -c "<a[^>]*>[^<]*<a" dist/blog -r`), 1 lien par carte, clic sur le coin haut-gauche d'une carte (au-dessus de la pastille de catégorie) fonctionne.
