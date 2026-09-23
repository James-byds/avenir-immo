# 04 — Hub des localités (`/communes`)

**Référence** : `docs/handoff/reference/localites.html`. Journal : « Hub des localités + états de la liste ».

---

Monte `src/pages/communes.astro` sur `PageLayout solid`. Toutes les données viennent de `getCollection("communes")` + `lib/maillage.ts` (`combinaisons(biens)`) : **aucun lien vers une combinaison sans bien, aucun compteur affiché** — uniquement des ancres descriptives.

## Sections

1. `PageHead variant="band"` — H1 « Trois marchés, un seul bureau. », chapô, `.pb-photo`.
2. `.sec--tint` — « Chacun a sa page, son conseiller, ses prix » : 3 cartes riches des marchés (Grand Charleroi · Gerpinnes & Loverval · Liège) — reprendre le balisage de la référence (`.mkt-rows`, `.mkt-row`, `.mk-*` de `local.css`) : nom, ligne de chiffres sourcés, conseiller référent (`equipe`), liens descriptifs vers `/{type}-a-{transaction}-{commune}`.
3. `.sec--white` — « Un avis par marché, avec la commune » : 3 `.t-card` (`avis` filtrés par commune), `.loc-avis` / `.loc-avis-foot`.
4. `.sec--tint` — « Trois marchés, quinze minutes de route entre les deux premiers » : `MapLeaflet client:visible` (tuiles `tile.openstreetmap.org`, attribution), 3 marqueurs, `.q-drive` (temps de trajet en ligne mono).
5. `.sec--white` — « Par ce que vous cherchez, pas par code postal » : `LocalityLinks variant="mesh"` groupé par intention (Acheter une maison · Acheter un appartement · Louer · Terrains…), `.ll-rows` / `.ll-row` / `.ll-pills`.
6. `.sec--tint` — « La personne qui estime votre bien est celle qui le vendra » : `.loc-who` + CTA estimation.

Alternance stricte tendre/blanc, 6 sections. Le footer suit.

## Head

Title/description de la référence, canonical `/communes` ; JSON-LD `ItemList` des pages de localité + `BreadcrumbList`.

## Livrable

`src/pages/communes.astro`, `components/surfaces/MarketCard.astro` (`.mkt-*`), réutilise `LocalityLinks`, `MapLeaflet`. Contenu : `src/content/communes/*.md` (champ `marche`/`conseiller` si le schéma les a — sinon propose l'évolution).

Recette : `/communes` contre `localites.html`. Vérifie que chaque pilule pointe vers une route présente dans `dist/`.
