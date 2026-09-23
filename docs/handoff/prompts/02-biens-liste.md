# 02 — Liste des biens (`/biens`) + 5 états

**Référence** : `docs/handoff/reference/biens.html` — tester aussi `biens.html?cat=location`, `?loc=loverval&type=maison` (1-3 résultats), `?loc=marcinelle` (zéro), `?q=gerpines` (« vouliez-vous dire »). Journal : `journal-maquette.md` § « Hub des localités + états de la liste ».

---

Monte `src/pages/biens/index.astro` sur `PageLayout solid`.

## Sections

1. `PageHead variant="band"` — `Breadcrumb` (Accueil › Nos biens), `SectionHead` : éyebrow, H1 « Nos biens d'exception », chapô. Emplacement photo `.pb-photo` (48 % à droite, dégradé de lisibilité ; en bandeau 16/9 au-dessus sous 900 px).
2. Section **continuation** (`.sec--cont`, pas `style="padding-top:0"`) :
   - `.toolbar` : `Seg` (Tous · À vendre · À louer · Vendus, **avec compteurs**), `.tool-group` × 3 (`Select` Commune · Type · Budget), `.tool-search` (champ texte, mêmes métriques que `.tool-select`), tri `.tool-select`, compteur « X biens affichés · page n sur p » constant, `.tool-clear` « × Effacer les filtres » qui apparaît **sous** les filtres quand un filtre est actif.
   - `.search-hint` : « Aucun résultat pour « x ». Vouliez-vous dire **y** ? » (Levenshtein ≤ 2 sur communes et types).
   - `LocalityLinks variant="widen"` (`.ll-widen`) — visible **seulement** si 1 ≤ résultats ≤ 3, ancres descriptives vers des combinaisons non vides.
   - `.prop-grid` de `PropertyCard` (défaut) depuis `getCollection("biens")`, 9 par page, `Pagination` (puces rondes, « suivant » = puce `→`).
   - Squelette `.sk-card` × 6 (`.sk-media`, `.sk-body`, `.sk-line`, `.sk-shimmer`) pendant le filtrage ; `prefers-reduced-motion` coupe l'animation.
   - État zéro `.empty` : « Aucun bien ne correspond », critères actifs en `.empty-crit` retirables un par un, `.empty-acts` (Effacer · Être prévenu), `.empty-widen`.
3. `.trust.trust--band` en continuation (`.sec--cont`) : « Des acquéreurs accompagnés, notés 4,8/5 » — variante bandeau.
4. `FinalCta tone="tint"` : « Le bien idéal est peut-être off-market. » — `.sec--tint`, jamais `style="background:…"`.

Alternance : encre (band) → blanc (cont) → blanc (cont, trust) → tendre (CTA). Les deux continuations sont légitimes (`padding-top:0`).

## Contrat d'URL (client-side, HTML pré-rendu complet)

`<script>` Astro (vanilla, pas d'île) : lit `?cat=vente|location|vendu&loc=<slug>&type=<slug>&q=<texte>` au chargement, applique aux contrôles, filtre les cartes (données en `data-*` sur chaque `<article>` : `data-cat`, `data-loc`, `data-type`, `data-price`, `data-surface`), met à jour l'URL (`history.replaceState`) à chaque changement, gère `[hidden]` (règle `[hidden]{display:none!important}` de `local.css` — sans elle `.prop-grid{display:grid}` gagne). Tri prix ↑↓ / surface. Toute la logique est dans le script inline de `biens.html` : reprends-la.

## Head

Title/description de la référence ; ajoute le `canonical` manquant `/biens` ; JSON-LD `ItemList` des biens de la première page (`realEstateListing` de `lib/seo.ts`).

## Livrable

`src/pages/biens/index.astro`, `components/surfaces/Toolbar.astro` (si le motif est partagé avec les localités — il l'est : prévois props `segments`, `groups`, `search`, `sort`), `components/surfaces/SkeletonGrid.astro`, `components/surfaces/EmptyState.astro`, `components/core/LocalityLinks.astro` (variantes `widen` | `mesh`). Contenu : `src/content/biens/`.

Recette : `/biens`, `/biens?cat=location`, `/biens?loc=loverval&type=maison`, `/biens?loc=marcinelle`, `/biens?q=gerpines` contre les mêmes URL de `biens.html`.
