# 05 — Page de localité (`/[type]-a-[transaction]-[commune]`)

**Références** : `docs/handoff/reference/maison-a-vendre-liege.html` (vente, 14 biens, 3170 mots) et `appartement-a-louer-liege.html` (location, 18 biens). Journal : les quatre entrées « Page de localité — … ». C'est le gabarit SEO du site : **une route dynamique, un contenu réellement local par commune**.

---

Monte `src/pages/[type]-a-[transaction]-[commune].astro` : `getStaticPaths` depuis `communes` × `types` × `transactions` déclarés, **filtré** par les combinaisons non vides de `lib/maillage.ts`. `PageLayout solid`.

## Sections (ordre figé — transactionnel avant éditorial)

| # | Fond | Contenu |
|---|---|---|
| 1 | `PageHead variant="band"` | fil d'Ariane + bascule alignée à droite (« Vous cherchez à louer ? » → route sœur si elle existe, sinon rien), H1 « Maisons à vendre à Liège », chapô, 2 actions (`.btn` « Voir les 14 biens » ancre `#resultats` · `.btn--ghost` « Vendre ma maison à Liège » → `#vendre`), `.pb-photo` |
| 2 | `.sec--tint` | bloc texte + image `two-col--b` : H2 « Acheter une maison à Liège : une ville qui change de prix tous les cinq cents mètres » (location : « … un marché qui bouge deux fois par an »), 2 §, 2 CTA, grande photo `.ph` |
| 3 | `#resultats .sec--white` | `Toolbar` (Seg types avec compteurs · Quartier avec compteurs entre parenthèses · Budget/Loyer · Tri), `.ll-widen` **si ≤ 3 résultats**, `.prop-grid` de `PropertyCard`, 6 par page, `Pagination #pagi`, compteur « 14 biens affichés · page 1 sur 3 », `.empty`, `.sk-card` — même script que `/biens` (extraire un `src/scripts/listing-filter.ts` partagé, importé par les deux pages) |
| 4 | `.sec--tint` | guide six points `two-col--c` : colonne gauche sticky (H2 « Acheter une maison à Liège : six points à vérifier avant l'offre », `.enclair` — **blanc bordé dans une section teintée**, CTA), à droite `.guide-pts` / `.guide-pt` numérotés 01-06 (points filetés, **pas** des `.atout`) |
| 5 | `#marche .sec--white` | « Prix au m² à Liège : 1 980 € en moyenne, 265 000 € pour une maison » — `.q-stats` : `.big` chiffre clé + `.q-stat-rows`/`.s-row` × 4, puis `.lg-table.q-prices` (6 quartiers, piste `1fr 1.6fr 92px`), source datée `.sell-src` |
| 6 | `.sec--tint` | « Vivre à Liège : ce que vous achetez avec le quartier » — `.q-atouts` / `.atout` (cartes bordées, **sans** numéros : la numérotation appartient au guide), `.q-poi` |
| 7 | `#vendre` | `SellHere variant="band"` (vert tendre + `.sell-card` chiffres, éyebrow « Vous vendez à Liège ? », H2 « 48 ventes dans l'arrondissement, 41 jours avant compromis. ») **puis** simulateur de crédit `.sim-*` en continuation : 3 curseurs (`.sim-range`, poignée `--sim-thumb` = signe V blanc sur disque vert, piste 44 px, rail 6 px, `--pct` posé en JS), résultat `.sim-val`, **mentions légales obligatoires** « Attention, emprunter de l'argent coûte aussi de l'argent » + « Avenir Immobilier n'est pas intermédiaire en crédit hypothécaire ». Location : « 140 baux gérés, onze jours pour relouer. » + gestion locative, sans simulateur |
| 8 | `.contact-band` (encre) | `ContactForm tone="ink"` — la **seule** zone encre du corps |
| 9 | `.faq .sec--white` | « Questions fréquentes sur l'achat d'une maison à Liège » — `Faq` île `client:visible` `structuredData={false}`, 6 questions **locales** depuis `commune.data.faq`, aside sans carte ; JSON-LD `FAQPage` côté page |
| 10 | `.sec--tint` | « Votre agence immobilière à Liège » — `AgencyCard media="map"` (zones = pilules vers les pages de localité) + `AgentCard` du conseiller référent |
| 11 | `.sec--tint.sec--cont` | maillage `LocalityLinks variant="mesh"` « Chercher autrement dans la province de Liège » |
| 12 | `.sec--white` | `SellHere variant="compact"` ou `FinalCta` « Vendre sa maison à Liège : une estimation quartier par quartier. » |

Les `⚠ style="background:…"` et `style="padding-top:…"` du squelette de la référence sont **à remplacer** par `.sec--tint` / `.sec--cont` / `.sec--short` (si `site.css` n'a pas de padding court, ajoute-le dans `local.css` sous un bloc « à reprendre »).

## Copie

Titres H2 tels que dans la référence (ils portent l'intention + la ville). Texte du guide et de la FAQ : **depuis `communes/<slug>.md`**, jamais partagé entre communes. Les 12 liens vers des pages non codées portent `data-planned`.

## Head

Title « Maisons à vendre à Liège — 14 biens · Avenir Immobilier » (compteur calculé), description avec médiane/€/m²/délai depuis les chiffres sourcés, canonical ; JSON-LD `BreadcrumbList` + `ItemList` (`SingleFamilyResidence`/`Apartment`, `Offer` — location : `UnitPriceSpecification` mensuelle) + `FAQPage`, tous générés depuis les mêmes données.

## Livrable

`src/pages/[type]-a-[transaction]-[commune].astro`, `src/scripts/listing-filter.ts`, `components/surfaces/{SellHere,AgencyCard,CreditSimulator,GuidePoints,MarketStats,PriceTable}.astro`, `components/core/LocalityLinks.astro` (si absent). Contenu : `src/content/communes/{liege,gerpinnes,…}.md`, `src/content/biens/` (14 + 18 biens de Liège).

Recette : `/maison-a-vendre-liege` et `/appartement-a-louer-liege` contre leurs références ; compter les biens (14 / 18), la médiane, les 6 quartiers de la table, l'apparition de `.ll-widen` uniquement sous ≤ 3 résultats.
