# Recette globale — compte rendu (F7, 24 septembre 2026)

Exécution de `docs/handoff/prompts/99-recette.md` sur la branche `feat/99-recette`
(mergée dans `main`, tag `v0.1.0-maquette`). Par section : **conforme** /
**écarts corrigés** / **écarts renvoyés** (à qui). Les contrôles reproductibles
sont dans `scripts/recette.mjs` ; les contrôles de rendu ont été faits avec
Chrome headless sur le build servi en local (gzip, cache), à 1 440 et 375 px,
sur les 104 routes (103 pages + `/404`), avec captures pleine page comparées
au pixel avant/après chaque lot.

## §1 Build et routes — conforme après corrections

| Contrôle | Résultat |
| --- | --- |
| `npm run build` | vert, 104 pages (103 routes + `dist/404.html`) |
| `npx astro check` | 0 erreur, 0 avertissement, 316 hints (types implicites du starter) |
| Avertissements Astro sur les collections | 0 |
| `sitemap.xml` vs routes émises | **corrigé** : `/a-propos` et `/communes` manquaient ; 0 route en trop ; `/404` exclue |
| `href="#"` dans `dist/` | 0 |
| `data-planned` | 6 cibles — 5 pages de localité voisines de Gerpinnes (Charleroi centre, Fleurus, Loverval, Mont-sur-Marchienne, Montigny-le-Tilleul) et « Gérer mes cookies » (cible existante, fonction à câbler) → `docs/pages-planifiees.md` |
| Liens internes (`href`/`src`, ancres `#id` comprises) | **corrigé** : 5 liens cassés (les pilules planifiées pointaient vers des 404) → une cible `planned` n'a plus de `href` ; 8 219 liens résolus, 0 cassé |

## §2 Cohérence inter-pages — conforme

- **Header** : mêmes entrées de nav sur 103 pages, « Quartiers » → `/communes`,
  `.header--solid` partout sauf l'accueil (`/404` compris).
- **Footer** : colonne « Quartiers » identique (4 combinaisons réelles + « Toutes
  nos communes »), filigrane `signe-v-blanc.png` partout, liens légaux `/legal/*`
  (+ « Gérer mes cookies » `data-planned`).
- **Rythme des fonds** (fond calculé de chaque `<section>` de `<main>`, hors
  héros et pied) — 0 paire de sections consécutives de même fond hors
  `.sec--cont`, au plus une zone encre dans le corps, au plus 2 aplats vert
  profond :

  | Gabarit | Séquence (W blanc · T vert tendre · INK encre · DEEP vert profond · `+` = `.sec--cont`) |
  | --- | --- |
  | `/` | hero · W T W DEEP INK W T W DEEP T W · CTA |
  | `/biens` | INK (bandeau) · W+ T |
  | `/biens/*` | INK (galerie) · W+ T |
  | `/communes` | INK · T W T W T |
  | localités Liège | INK · T W T W T T+ · INK (CTA) · W T T+ T+ W |
  | `/maison-a-vendre-gerpinnes` | INK · W T W T W T W · INK (CTA) |
  | `/estimation` | INK (estimateur) · W T |
  | `/contact`, `/avis` | plain · T DEEP |
  | `/a-propos` | INK · W T W W+ T T+ |
  | `/equipe` | INK · T INK (cas) · CTA à cheval |
  | `/equipe/*` | plain · T W (+ T+ INK W avec bande contact) |
  | `/blog` | T W T DEEP |
  | `/blog/*` | plain · W T W |
  | `/auteurs`, `/auteurs/*` | plain · (W) T W DEEP |
  | `/legal/*` | T W+ |
  | `/404` | plain · T |

- **Chiffres** : mêmes valeurs partout où elles se répètent — 4,8/5 · 190 avis
  (103 pages), 900+ ventes depuis 1992, 98 % au prix estimé, 38 j avant
  compromis, Liège 265 000 € / 1 980 €/m² / 895 € / 11,40 €/m² / 41 j,
  Gerpinnes 385 000 € / 2 120 € / 34 j. Aucune divergence. Les « 65 jours en
  moyenne wallonne » (Gerpinnes) et « près de 90 jours sur le marché
  carolorégien » (accueil) sont deux références distinctes, sourcées.
- **Cartes** : 0 ancre imbriquée sur `dist/` ; chaque `PropertyCard` /
  `ArticleCard` porte exactement un lien. `MarketCard` (hub des localités)
  porte plusieurs liens à dessein (pas de lien étendu) — assumé, documenté.
- **Renvoyé au client** : identités de contact héritées de la maquette —
  téléphone `071 22 11 41` (pied de page, légales, Gerpinnes) vs
  `+32 71 32 14 70` (en-tête, contact, estimation, accueil) ; `info@` vs
  `contact@` ; siège Place Roger Desaise (pied de page) vs Boulevard Tirou
  (barre utilitaire) ; IPI 509 217 sur trois entités. La maquette décrit deux
  implantations ; à figer avant mise en ligne (`ETAT.md`, arbitrages).

## §3 Adhérence DS — conforme après corrections

- **Couleurs en dur** : 0 occurrence de `#17413B / #00A678 / #EDE300 / #0E2B27`
  hors `src/styles/ds/` (fallbacks `var(--green,#…)` des scripts de carte
  retirés, commentaires reformulés).
- **`style="…"`** : 90 attributs convertis — mise en page → utilitaires Tailwind
  (`mt-*`, `max-w-*`, `flex-*`, `justify-*`, `aspect-*`), typographie et
  surlignages → règles scoped « à reprendre dans le DS », ligne de preuve de
  l'estimateur → `.est-proof` (`local.css`). Captures 1440/375 identiques au
  pixel avant/après. Restent, justifiés comme valeurs d'exécution : l'état
  initial du tiroir (`SiteHeader`, lu par `ds-script.js`), les marqueurs
  Leaflet (`MapLeaflet`, `VillageMap`, `communes`), `--pct` du simulateur.
- **Vigilance 16 tranchée** : DS et `local.css` importés dans la couche `ds`
  (`@layer theme, base, ds, components, utilities`), tous les `<style>` de
  pages/composants enveloppés dans `@layer ds` — les utilitaires s'appliquent,
  la cascade DS ↔ scoped d'avant est conservée.
- **`local.css`** : chaque bloc porte un titre ; inventaire avec les pages
  utilisatrices dans `docs/ds/dette-ds.md` (+ styles scoped, écarts d'API,
  corrections d'accessibilité, performance).
- **Îles** : 5 fichiers dans `src/components/islands` (`MapLeaflet` = dérogation
  validée), 0 `client:only`.

## §4 Performance et accessibilité

Voir le tableau final ci-dessous (mesures après le lot accessibilité, serveur
statique gzip). Exigences du prompt : Performance ≥ 90, A11y ≥ 95, SEO 100.

| Page | Mobile (perf · a11y · bonnes pratiques · SEO) | LCP mobile | Desktop (perf · a11y · BP · SEO) |
| --- | --- | --- | --- |
| `/` | 77 · **100** · 100 · **100** | 5,9 s | 98 · 100 · 100 · 100 |
| `/biens` | 79 · **100** · 100 · **100** | 4,8 s | 99 · 100 · 100 · 100 |
| `/maison-a-vendre-liege` | 74 · **97** · 100 · **100** | 5,1 s | 99 · 97 · 100 · 100 |
| `/blog/home-staging-7-gestes` | 79 · **100** · 100 · **100** | 5,4 s | 99 · 100 · 100 · 100 |

Avant le lot accessibilité (mêmes conditions) : a11y 91 · 95 · 92 · 94. Le 97 de
la page de Liège tient à des attributs ARIA du balisage de tri (`aria-prohibited-attr`,
`label-content-name-mismatch`) que l'audit axe complet ne remonte pas en
violation — à regarder à la reprise du `Toolbar` dans le DS.

- Fonte `AcuminVariable.woff2` en `preload`, `font-display: swap` : oui.
- **Performance mobile < 90 — renvoyé au client** : LCP 5-6 s en 4G simulée à
  cause des actifs (fonte variable 443 Ko, `equipe-avenir.png` 3,5 Mo,
  portraits ~330 Ko, logos 700-800 px affichés à 54 px) ; CSS 164 Ko
  (~25 Ko gzip, DS complet). Desktop : 99. Détail et pistes dans
  `docs/ds/dette-ds.md` § 6.
- **Axe** (toutes règles, 104 routes × 1 440 px) : **0 violation**, tous
  niveaux confondus, après corrections — `color-contrast` (pied de page,
  `.tl-end`, compteurs de seg, `.a-num`), `heading-order` (titres de colonnes du
  pied de page en h2, `.check` en h3, « À lire aussi » en h2, h2 masqué sur
  `/biens`, `ContactForm headingLevel={2}`), `region` (`TopBar`),
  `aria-required-children` (`#filters` en `group`), `link-in-text-block`
  (attribution Leaflet).
- Un seul `h1` par page (104/104) ; hiérarchie sans trou (104/104) ; `alt` sur
  toutes les `<img>` ; placeholders `.ph` étiquetés ou `aria-hidden`.
- **Focus visible** : 0 cible sans indicateur sur 40 tabulations par page
  (anneau `--green` + halo `--green-soft`, variante `--green-l` sur fonds
  sombres).
- **Mobile 375 px** : 0 débordement horizontal (corrigés : toolbar des avis
  495 px, menu de tri des localités 444 px — et 1 457 px à 1 440) ; drawer
  ouvert au clavier, focus déplacé sur « Fermer », Échap referme,
  `aria-expanded` synchronisé ; cibles tactiles ≥ 44 px effectives (zones
  étendues par pseudo-élément, sans changer la mise en page).

- **Résidu assumé des cibles < 44 px** (mesure effective par `elementFromPoint`
  à 375 px) : contrôles de zoom Leaflet 30 × 30 et marqueurs (tiers, 6 pages) ;
  boutons de seg 38 px quand le seg passe sur deux rangées (les zones étendues
  des deux rangées se recouvrent — 10 pages, ≥ 24 px AA satisfait) ; liens
  inline dans le texte (exception WCAG 2.5.8) ; champs de la recherche héros
  (26 px, enveloppés dans leur `<label>` `.hs-field` : tout le champ focalise
  l'input) ; case à cocher du consentement (13 px, `<label>` associé).

## §5 Livraison — conforme

- `README.md` : commandes (dont `node scripts/recette.mjs`), état du chantier,
  dette DS, couches CSS, pages planifiées, « avant mise en ligne ».
- `docs/ds/dette-ds.md` (handoff retour DS) et `docs/pages-planifiees.md`.
- Commits par lot sur `feat/99-recette` (test.astro · couches + styles +
  liens + sitemap · 404 · accessibilité · docs), commit final
  `chore(recette): recette globale`, tag `v0.1.0-maquette`, merge dans `main`.
  Aucun push (prérogative de l'utilisateur).

## Écarts renvoyés (récapitulatif)

| À qui | Quoi |
| --- | --- |
| Client | identités de contact (téléphones, e-mails, siège, IPI) ; export des images aux tailles d'affichage ; sous-ensemble de la fonte (licence) |
| Design system | tout `docs/ds/dette-ds.md` : blocs `local.css`, styles scoped, écarts d'API, contrastes, focus, cibles, toolbar mobile, tiroir (`ds-script.js`), `.sec--short-top`, `.est-proof`, couches CSS |
| Hors vague (dépôt) | adoption de `EstimateForm` et `ArticleCard variant="post"` par l'accueil ; création des 5 pages de localité planifiées |
