# 06 — Page quartier Gerpinnes (`/maison-a-vendre-gerpinnes`)

**Référence** : `docs/handoff/reference/quartier.html`. Journal : « Page quartier Gerpinnes — revue et refonte de la carte » et « FAQ locale et titres porteurs ». **Dépend de 05** : c'est la route dynamique de localité, enrichie d'une section carte quand la commune déclare des `villages[]`.

---

Ne crée pas une page à part : étends `[type]-a-[transaction]-[commune].astro` avec une section conditionnelle `{commune.data.villages?.length > 0 && <VillageMap …/>}` insérée **juste après `#resultats`** (les biens d'abord, la carte ensuite), et remplace le guide six points par les blocs propres à la référence quand `commune.data.gabarit === "quartier"` (ou tout indicateur équivalent que tu proposes dans le schéma).

## Sections de la référence (ordre)

1. `PageHead variant="band"` — H1 « Immobilier à Gerpinnes : maisons et villas à vendre », chapô « la campagne aux portes de la ville », bascule vendeur à droite du fil d'Ariane.
2. `#biens-quartier .sec--white` — « Maisons et villas à vendre à Gerpinnes » — `.q-toolbar` (Seg + `.q-scope`), grille `PropertyCard`, `.q-empty`.
3. `.sec--tint` — **carte des villages** « Prix de l'immobilier par village : Loverval, Acoz, Gougnies… » : `.q-map-band` = `.vil-rows` (6 `.vil-row` cliquables : `.vil-name`, `.vil-price` €/m², `.vil-sub` nb de biens ou « être prévenu » si 0 — **pas de lien vers une liste vide**) + `MapLeaflet` (OSM, recentrage animé, pastille active vert profond avec halo, étiquette **au survol/sélection seulement**, infobulle `.vil-pop`), `.vil-head` / `.vil-reset`, `.q-drive` temps de trajet en une ligne mono sous la carte. Logique : script inline de `quartier.html` → `<script>` du composant `VillageMap.astro` (l'île `MapLeaflet` expose la carte ; sinon fais de `VillageMap` une île React `client:visible` — c'est le seul cas où une 6e île est acceptée, justifie-le).
4. `.sec--white` — « Prix au m² à Gerpinnes : 2 120 € en moyenne, 385 000 € pour une maison » — `MarketStats` (`.q-stats`).
5. `.sec--tint` — « Vivre à Gerpinnes : écoles, nature et accès à Charleroi » — 3 `.atout` (Écoles à Gerpinnes · Nature, RAVeL et patrimoine · Accès à Charleroi et à l'aéroport).
6. `.trust .sec--white` — « Ils ont vendu leur maison à Gerpinnes, ils nous notent 4,8/5 » — `TrustSection` filtrée par commune.
7. `#faq .faq.sec--tint` — « Questions fréquentes sur l'immobilier à Gerpinnes » — 6 questions **propres à l'entité** (droits d'enregistrement sur 385 000 €, 34 jours sur 74 ventes, écart d'un tiers entre villages, assainissement autonome Gougnies/Joncret/Villers-Poterie, rareté des grandes parcelles, qui suit le dossier).
8. `.sec--white.sec--short` — « Immobilier dans les communes voisines » — `.q-others` / `.q-pill` (6 liens `data-planned` tant que les pages n'existent pas).
9. `.finalcta.sec--ink` — « Vendre sa maison à Gerpinnes : elle vaut peut-être plus que vous ne pensez. » — seule zone encre du corps (pas de `.contact-band` sur cette variante).

## Head

Title/description/canonical de la référence (canonical devient `/maison-a-vendre-gerpinnes`) ; JSON-LD `BreadcrumbList`, `Place` (6 villages `GeoCoordinates`), `RealEstateAgent` (4,8/190), `FAQPage`.

## Livrable

`src/pages/[type]-a-[transaction]-[commune].astro` (extension conditionnelle), `components/surfaces/VillageMap.astro` (ou `.tsx` justifié), `components/surfaces/Atouts.astro`, `components/surfaces/NeighbourPills.astro`. Contenu : `src/content/communes/gerpinnes.md` (villages : nom, lat/lng, prix/m², nb biens ; trajets ; POI ; FAQ). Schéma : propose `villages[]`, `trajets[]`, `poi[]` si absents.

Recette : `/maison-a-vendre-gerpinnes` contre `quartier.html` ; vérifier qu'aucune tuile n'affiche « API KEY REQUIRED », que les villages à 0 bien n'ont pas de lien, qu'aucune étiquette n'est permanente sur la carte.
