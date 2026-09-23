# 03 — Fiche bien (`/biens/[slug]`)

**Référence** : `docs/handoff/reference/bien.html` (Villa d'architecte à Gerpinnes, 745 000 €, réf. AV-2418).

---

Monte `src/pages/biens/[slug].astro` (`getStaticPaths` sur `getCollection("biens")`, `publie !== false`) sur `PageLayout solid`.

## Sections

1. `PageHead variant="ink"` — bandeau encre **sans** photo latérale : `Breadcrumb` (Accueil › Nos biens › Gerpinnes › Villa d'architecte), `.listing-loc` (puce `.u-dot` vert clair — **pas** de `style="background"` — + commune · quartier · réf.), H1 « Villa d'architecte, lisière de bois », `.listing-price` en **jaune** + `.listing-ppm2`, actions (`.btn` Organiser une visite · `.btn--ghost` Poser une question — transparent bord blanc sur cette surface), puis `.gallery` : grande + 4 vignettes placeholders `.ph`, boutons `.g-btn` translucides (« Voir les 12 photos », plan), `.lightbox` plein écran (compteur n/12, légende mono, flèches + clavier, Échap, fond cliquable — logique du script inline de `bien.html`).
2. Section continuation (`.sec--cont`) `.listing-grid` : colonne principale `.listing-main` + `<aside class="listing-aside">` sticky.
   - Main : H2 « En deux mots » (prose + `SpecGrid` des caractéristiques), H2 « PEB & informations légales » (`PebScale value="B"` + `.legal` dt/dd : PEB, e-spec, urbanisme, RC, zone inondable…), H2 « Le quartier » (texte + `.map-ph` ou `MapLeaflet` `client:visible` sur `tile.openstreetmap.org` — jamais CARTO sans clé — + lien vers `/maison-a-vendre-gerpinnes`).
   - Aside : `AgentCard` (conseiller **associé au bien**, `bien.data.agent` → `equipe`), formulaire court (`Input` × 3 + `Button block`), rappel prix + mensualité indicative **avec la mention légale** « Attention, emprunter de l'argent coûte aussi de l'argent » + « Avenir Immobilier n'est pas intermédiaire en crédit hypothécaire » (obligatoire dès qu'une mensualité s'affiche — schéma `mensualite.mentionLegale`), partage.
3. `.sec--tint` « Biens similaires » — 3 `PropertyCard` de même commune ou même type, prix ± 25 %, jamais le bien courant ; si < 3, compléter par la commune voisine. Pas de `style="background"`.
4. (Optionnel, si la page le porte) `.trust.trust--band` — non : la référence n'en a pas, ne pas ajouter.

Alternance : encre → blanc (cont) → tendre.

## Head

Title « {titre} à {commune} — {prix} · Avenir Immobilier », description depuis `bien.data.description`, canonical `/biens/{slug}` ; JSON-LD `realEstateListing()` de `lib/seo.ts` + `BreadcrumbList`.

## Livrable

`src/pages/biens/[slug].astro`, `components/surfaces/{SpecGrid,PebScale,AgentCard,Gallery}.astro`, `components/islands/Lightbox` **non** — la visionneuse est du vanilla dans un `<script>` du composant `Gallery.astro` (pas de 5e île). Contenu : compléter `src/content/biens/*.md` (specs, PEB, description longue, `agent`, `mensualite`).

Recette : `/biens/villa-architecte-gerpinnes` contre `bien.html`, puis une fiche location (`suffix` « /mois », pas de mensualité).
