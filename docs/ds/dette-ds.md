# Dette design system — handoff retour vers le DS

Relevé de la recette globale du 24 septembre 2026 (`docs/handoff/prompts/99-recette.md`, §3).
Tout ce qui est listé ici vit **provisoirement dans ce dépôt** parce que le design
system ne le porte pas encore : `src/styles/local.css` (blocs titrés), les `<style>`
scoped « à reprendre dans le DS » des pages et composants, et quelques écarts
d'API de composants. Quand le DS reprend un point, on supprime la copie locale et
on resynchronise (`./sync-ds.sh`). Rien ne s'édite dans `src/styles/ds/`.

Deux règles de lecture :

- **Valeurs inchangées** : sauf mention « DS ≻ maquette », chaque règle recopie
  la maquette au pixel (les captures 1440/375 des 104 pages ont servi de témoin).
- **DS ≻ maquette** : contrastes et cibles tactiles corrigés selon les règles du
  DS quand la maquette les violait (précédent des vagues C et D).

## 1. Couches CSS — à connaître côté DS

Depuis la recette globale, `src/styles/app.css` déclare
`@layer theme, base, ds, components, utilities;` et importe le DS puis
`local.css` dans la couche `ds`. Tous les `<style>` des pages et composants
sont enveloppés dans `@layer ds { … }`.

Pourquoi : hors couche, le reset `* { margin: 0 }` de `site.css` (et toute règle
du DS) primait sur les utilitaires Tailwind — `mt-*`, `max-w-*`, `mx-auto`
étaient compilés mais inertes (vigilance 16 du handoff). En couche, le DS bat
le preflight de Tailwind (`base`) et perd face aux utilitaires : c'est le
contrat « le DS porte le style, Tailwind pose la mise en page ».

Conséquence pour le DS : l'export doit rester importable dans une couche (pas
de `@import` conditionnel, pas de `!important` qui casserait l'ordre). Si le DS
adopte lui-même `@layer`, aligner les noms avec `app.css`.

## 2. `local.css` — blocs et pages qui les utilisent

Ligne = début du bloc dans `src/styles/local.css` ; « règles » = nombre de
déclarations ; la dernière colonne indique où les classes sont employées
(pages, layouts, composants).

| Ligne | Bloc | Règles | Employé par |
| --- | --- | --- | --- |
| 1 | Display élargi (`font-stretch: var(--wide)`) sur tous les éléments que le DS met en `--serif` | 1 | toutes les pages |
| 16 | Écarts maquette d'origine : `.lg-head`, `.toc-action`, `.ah-stats`, `.writer`, `.f-zones`, `.f-social`, `.f-hq`, `.u-nav`/`.u-call`/`.u-social`, `.t-glogo`, `.hero-search--inline`, `.card-peb`, `.props-tools`, `.spec-ico`, `.finalcta--photo`, `.proofs`, `.f-mark`, page avis… (en-tête du fichier) | 65 | chrome (TopBar, SiteFooter), accueil, biens, légales, auteurs, avis |
| 180 | Passe couleur — accents `--green-l`, placeholders alternés (`.eyebrow`, `.estimate`, `.footer`, `.lg-cta`, `.serv .s-no`, `.check .ck`) | 8 | accueil, estimation, chrome |
| 211 | Section avis — fond teinté, cartes blanches, synthèse verte (`.trust*`, `.t-card`, `.ts-score`) | 15 | TrustSection (accueil, biens, estimation, localités) |
| 233 | Barre de recherche compacte (`.hero-search--inline`, `.hs-*`) | 6 | accueil (section biens) |
| 245 | Carte bien — indice PEB (`.card-peb`, `.pb`, `.pv`) | 12 | PropertyCard |
| 261 | Section biens — grille organique + flèches (`.props-tools`, `.prop-stage`, `.prop-nav`, `.card--overlay`) | 14 | accueil, PropertyCard |
| 290 | Topbar — sous-navigation secondaire (`.utility`, `.u-nav`, `.u-call`, `.u-social`) | 12 | TopBar, SocialLinks |
| 306 | CTA de contact final — panneau vert + portrait (`.finalcta--photo`, `.finalcta--straddle`, `.fc-panel`, `.fc-copy`) | 19 | FinalCta (accueil, équipe, contact, avis) |
| 358 | Section preuves — pictogrammes (`.proofs`, `.proof-grid`, `.proof-ic`) | 14 | accueil |
| 380 | Page avis — mur en couleur (`.wall`, `.t-card--hl`, `.t-chip`, `.t-reply`, `.t-photos`) | 26 | avis (ReviewWall, ReviewCard) |
| 430 | Contact — formulaire & bande (`.cform`, `.cf-*`, `.field`, `.contact-band`, `.cb-*`) | 26 | ContactForm (contact, équipe, localités, biens) |
| 472 | Agence — carte agence & zones (`.agc*`, `.ag-*`, `.map-pin`) | 22 | AgencyCard (contact, à propos, localités) |
| 504 | Article — en-tête & cartes (`.art-cat`, `.art-meta`, `.art-head`) | 14 | ArticleHeader, ArticleCard |
| 527 | Cartes d'article — un seul lien étendu (`.post`, `.art-feature`, `.art-mini`, `.af-*`) | 33 | ArticleCard (blog, auteurs, accueil) |
| 586 | Partage — barre de partage (`.sharebar`, `.sh-*`) | 19 | ShareBar (articles) |
| 620 | Maillage interne (`.ll-widen`, `.ll-mesh`, `.ll-pills`, `.ll-lab`, `.ll-n`) | 16 | LocalityLinks (biens, localités, communes, 404) |
| 657 | Localité / quartier — page commune (`.q-hero`, `.q-stats`, `.q-toolbar`, `.q-*`) | 32 | `[type]-a-[transaction]-[commune]`, MarketStats, Toolbar |
| 701 | Carte équipe « contact » (`.member--contact`, `.m-*`) + carrousel | 120 | MemberContactCard (équipe, à propos, membres) |
| 901 | Rythme visuel — fonds de sections de l'accueil (`.stats`, `.services`, `.team`, `.blog`, `.process`) | 31 | accueil |
| 962 | En-tête des pages intérieures (`.page-head--band/--tint`, `.sell-card`, `.lg-meta`, `.breadcrumb` sur tint) | 29 | PageHead (toutes les pages intérieures) |
| 1042 | États de la liste des biens (`.tool-search`, `.search-hint`, squelette, vide) | 10 | Toolbar, SkeletonGrid, EmptyState |
| 1074 | Gabarit accueil (`.team-track`, `.member-photo`, ratio de la carte vedette, `.sell-src` sur sombre) | 22 | accueil |
| 1132 | SellHere — variante compacte (`.sell-compact`, `.sell-chips`) | 4 | SellHere (à propos, localités) |
| 1152 | Curseurs du simulateur (`.sim-*`, `--sim-thumb`) | 21 | CreditSimulator (localités) |
| 1224 | Utilitaires de fond de section (`.sec--white/--tint/--ink/--cont`) | 6 | toutes les pages |
| 1243 | Guide d'achat local (`.guide-pts`, `.guide-pt`, `.a-num`) | 6 | GuidePoints (localités) |
| 1265 | Page de localité — compléments (`.bc-row`, `.bc-switch`, `.st-lab`) | 15 | localités |
| 1322 | Carte de l'entité — sélecteur de village (`.vil-*`) | 28 | VillageMap (quartier Gerpinnes) |
| 1383 | Hub des localités (`.loc-figs`, `.loc-who`, `.lx`) | 54 | communes, MarketCard |
| 1469 | Gabarit estimation (`.estimate h1`, `.estimate--page`) | 4 | estimation, à propos |
| 1488 | Gabarit page de localité (`.sec--short`, `.sec--short-top`, `.sec--tint .ll-mesh`, `.page-head--band .section-head p strong`) | 4 | localités, article de blog, 404 |
| 1506 | Gabarit quartier (`.vil-pick`, `.finalcta.sec--ink`) | 8 | quartier Gerpinnes |
| 1535 | Hub des localités — photo du conseiller (`.loc-who .b-av img`) | 1 | communes |
| 1544 | `.finalcta--deep` (aplat vert profond) | 5 | contact, avis |
| 1560 | Lien « confidentialité » du consentement (`.cf-consent span a`) | 1 | ContactForm |
| 1565 | `.est-proof` — ligne de preuve sous les points de l'estimateur | 1 | accueil, estimation |
| 1574 | Recette globale — contrastes, focus visible, cibles tactiles, toolbar mobile, Leaflet (détail en § 5) | 15 | toutes les pages |

## 3. `<style>` scoped « à reprendre dans le DS » (pages et composants)

Chaque bloc porte un commentaire d'en-tête qui nomme la référence et précise
« valeurs inchangées ». Depuis la recette globale, tous sont dans `@layer ds`.

| Fichier | Contenu |
| --- | --- |
| `components/surfaces/AgencyCard.astro` | `.ag-rows dd a` (color inherit), `.agc-img` (photo cliente, ratio 16/8.2) |
| `components/surfaces/ContactRows.astro` | classes `.c-*` du `<style>` de page de contact.html (is:global) |
| `components/surfaces/CreditSimulator.astro` | bloc résultat « Mensualité estimée » (styles inline de la référence) |
| `components/surfaces/EditorialCharter.astro` | `.au-charte` |
| `components/surfaces/MarketCard.astro` | `.mk-name` 22 px, `.mk-text` 15 px |
| `components/surfaces/MemberHero.astro` | `.mh-photo--img`, `.mh-bio-note` |
| `components/surfaces/NeighbourPills.astro` | `.np-title` (H2 clamp 21-26 px) |
| `components/surfaces/PriceTable.astro` | `.pt-title` (h3 intermédiaire de la référence) |
| `components/surfaces/PropertyCard.astro` | `.card-suffix` (« /mois » 14 px atténué) |
| `components/surfaces/ReviewCard.astro` | bases `.t-date`, `.t-reply`, `.r-tag` (is:global) |
| `components/surfaces/ReviewWall.astro` | `.av-*`, `.wall*` (is:global) |
| `components/surfaces/Toolbar.astro` | rangée en colonne et alignements (= `.q-toolbar`) |
| `components/surfaces/TrustSection.astro` | `.t-count a` (color inherit), `.t-den` (« /5 » 60 %) |
| `components/surfaces/WriterCard.astro` | `.writer--photo`, `.w-*`, `.writer:focus-visible` |
| `layouts/ArticleLayout.astro` | `.wrap--art`, `.art-layout`, `.art-related-title` (eyebrow en h2) |
| `layouts/LegalLayout.astro` | `.lg-head h1`, liens du corps légal, sommaire |
| `pages/[type]-a-[transaction]-[commune].astro` | `.q-title`, `.lo-title`, `.lo-chapo`, `.lo-faq-title`, `.lo-src` |
| `pages/a-propos.astro` | `.about-hero`, `.about-dl`, `.about-photo`, `.lx--two`, fil d'Ariane inversé sur `.on-dark` |
| `pages/auteurs/[slug].astro` | `.au-toolhead`, `.au-count`, `.au-grid`, `.au-side`, `.b-av--init`, seg mobile |
| `pages/auteurs/index.astro` | `.au-hero`, `.au-stats`, `.au-lede` |
| `pages/avis.astro` | `.av-hero`, `.av-sync`, `.av-title`, `.av-hl`, `.av-lede` |
| `pages/biens/[slug].astro` | écarts de la fiche (galerie, `.listing-*`), `.agent-ok .ok-title/.ok-text` |
| `pages/biens/index.astro` | `.bl-offmarket` (H2 « off-market ») |
| `pages/blog/index.astro` | `.blog-hub` (H1 58 px, `.toolbar-right`, `.dd-menu` ancré à droite, `#articles` padding haut) |
| `pages/communes.astro` | `.cm-title`, `.cm-namur` |
| `pages/contact.astro` | `.ct-title`, `.ct-hl`, `.ct-lede` |
| `pages/equipe/index.astro` | `.eq-hero`, `.eq-cols`, `.eq-photo`, `.eq-contact` |
| `pages/index.astro` | `.hp-faq-title`, `.check h3` |
| `chrome/SiteFooter.astro` | `.footer .f-title` / `.f-zones-title` (titres de colonnes en h2 — voir § 5) |
| `chrome/SiteHeader.astro` | point vert du `nav-phone` ; `chrome/SiteFooter.astro` : `.fb-google` / `.fb-star` #E9A93B |

## 4. Composants — écarts d'API relevés (vagues A à D)

Livrés côté dépôt, à remonter dans le DS :

- `PropertyCard` : passe-through `class` / `data-*`, prop de ratio, kWh PEB, `.card-suffix`.
- `LocalityLinks` : `id`, `hidden`, `Link.planned` (**sans `href`** quand la cible
  n'existe pas, URL prévue en `data-href`), `class`.
- `NeighbourPills`, `MarketCard` : même contrat `planned` → `data-planned` sans `href`.
- `Toolbar` : layout colonne (= `.q-toolbar`) ; `Seg` / `Select` du DS inutilisables
  en toolbar (pas d'`id` / `data-f`, `.field` ≠ `.tool-select`) — balisage brut sur
  biens, localités, avis, blog, auteurs.
- `SectionHead` : ne rend que des h2 (les hubs blog/auteurs/avis ont besoin de h1
  riches → styles scoped).
- `TrustSection` : prop `countHref` (« Lire les {count} avis → »), `aria-label`
  interpolé depuis `rating`, pas de slot de titre riche, pas de prop `class`.
- `AgentCard` : normalisation `telHref` (« 0475/52.26.31 »).
- `ChoiceRow` / `Select` : pas de passe-through `id` ni de `label for=`.
- `EstimateForm` : prop `level: 2|3` (hiérarchie de titres) — l'accueil duplique
  encore son balisage (à lui faire adopter hors vague, comme `ArticleCard variant="post"`).
- `FinalCta` : `variant photo|straddle` non cumulables, pas de variante encre
  (`.finalcta.sec--ink` recopié), `tone="deep"` stylé en local (`.finalcta--deep`),
  ne pose pas `.on-dark` lui-même.
- `PageHead` : ni classe additionnelle ni padding paramétrable (héros du hub équipe
  écrit en classes directes).
- `MapLeaflet` : mono-marqueur — `markers[]` groupés + sélection externe souhaitée
  (quartier et hub portent chacun leur script Leaflet).
- `ContactForm` (île) : `useId`/`htmlFor`, `consentHref`, en-tête encre opt-in,
  validation + état envoyé, **`headingLevel: 2|3`** (page contact : h2).
- `AgencyCard` : rows `href`, `tag`+`open`, `directionsPrimary`, `phoneLabel`,
  `directionsArrow`, `target/rel`.
- `ArticleCard` / `ArticleHeader` / `AuthorBox` / `Byline` / `AuthorHero` /
  `WriterCard` / `EditorialCharter` / `EnClair` / `LegalTable` / `Droits` :
  composants nés dans le dépôt en vague D (contrats dans `docs/ds/composants.md`).
- `lib/seo.ts` : `realEstateListing()` sans loyer mensuel ; `breadcrumbList()`,
  `webPage()`, `article()`, `person()` construits inline dans plusieurs pages.
- `ds-script.js` : `window.location.href = "biens.html"` au submit des recherches
  (recâblé en local vers `/biens?cat=…`) ; le tiroir ne synchronise pas
  `aria-expanded`, ne déplace pas le focus et ignore Échap (complément dans
  `SiteHeader.astro`) ; lecture de layout dans les boucles (forced reflow signalé
  par Lighthouse).

## 5. Accessibilité, mobile, chrome — corrections de la recette globale

Toutes dans le dernier bloc de `local.css` (l. 1574) ou dans le chrome ; règle
DS ≻ maquette.

| Sujet | Correction locale | Attendu côté DS |
| --- | --- | --- |
| Contraste `.footer-bottom` (13 px, blanc à .5 sur encre = 4,2:1) | `.footer-bottom { color: rgba(255,255,255,.66) }` (6,0:1) | valeur du token |
| Contraste `.proc-panel .tl-end span` (`--green-l` sur encre = 4,3:1) | `--green-soft` | idem |
| Contraste `.seg button .n` inactif (10,5 px, opacité .65 ≈ 2,9:1) | `opacity: 1; color: var(--ink-soft)` | idem |
| Contraste `.guide-pt .a-num` (`--green-l` sur blanc = 3,0:1) | `--green` | idem |
| Focus visible absent (`.btn`, champs de la recherche héros, `.m-photo`, `.lg-switch a`, `.lg-toc a`, `.writer`, pilules, seg, nav, tiroir…) | anneau `2px var(--green)` + halo `3px var(--green-soft)` ; anneau `--green-l` sur fonds sombres | règle `:focus-visible` globale |
| Cibles tactiles < 44 px (`#burger` 38×32, `.card-fav` 40, `.f-social a` 40, `.seg button` 38, `.sh-btns` 40, `.link-arrow` 19, `.f-hq-link` 18, `.agent-tel` 21, `.breadcrumb a` 18, `.t-write` 21, `.hs-*`, `.vil-pick` 27, `.vil-reset` 17) | pseudo-élément absolu `inset` négatif (zone étendue sans changer la mise en page) | tailles natives ≥ 44 px ou même technique |
| Toolbar à 375 px : `.tool-group` (`min-width: auto`) et le seg débordaient le viewport (avis 495 px, localités 444 px) ; menu du tri (`.dd--inline`, `min-width: 220px`) débordait à 1 440 (1 457 px) | `.toolbar-right .dd-menu { left:auto; right:0 }` ; à ≤ 640 : `.tool-group { min-width:0 }`, `.seg { flex-wrap: wrap }`, `.dd--inline .dd-menu { min-width:0; left:0; right:0 }` | reprise dans `.toolbar` |
| Titres de colonnes du pied de page en `h4` (saut h2 → h4 sur toutes les pages) | `SiteFooter` : `h2.f-title` / `h2.eyebrow.f-zones-title`, mêmes valeurs que `.footer h4` | `.footer .f-title` (indépendant du niveau) |
| `.check h4` de l'accueil (saut h2 → h4) | h3 + copie de `.check h4` | sélecteur par classe |
| Barre utilitaire hors point de repère (axe `region`) | `TopBar` : `role="region" aria-label` | idem |
| `#filters role="tablist"` sans `role="tab"` (axe critique) | `role="group"` | `ds-script.js` / doc |
| Liens d'attribution Leaflet sans soulignement (`link-in-text-block`) | `text-decoration: underline !important` (CSS tiers hors couche) | — |
| Tiroir : `aria-expanded` figé, pas de focus, pas d'Échap | `<script>` de `SiteHeader` | `ds-script.js` |
| `.sec--short` raccourcit haut ET bas ; les références blog/article ne raccourcissent que le haut (vigilance 17) | `.sec--short-top` (padding-top seul), employé par l'article de blog | classe DS |
| `.est-proof` (ligne de preuve de l'estimateur, inline dans la maquette) | `local.css` | classe DS |
| `.cform h2` (titre de carte du formulaire en h2 sur la page contact) | `.cform h3, .cform h2` | sélecteur par classe |

## 6. Performance (Lighthouse, serveur statique gzip)

| Page | Mobile (perf / a11y / SEO) | Desktop |
| --- | --- | --- |
| `/` | 79 / 91 / 100 | 99 / 91 / 100 |
| `/biens` | 79 / 95 / 100 | 99 / 95 / 100 |
| `/maison-a-vendre-liege` | 72 / 92 / 100 | 99 / 92 / 100 |
| `/blog/home-staging-7-gestes` | 79 / 94 / 100 | 99 / 94 / 100 |

Mesures **avant** les corrections d'accessibilité de la recette (les scores
a11y remontent ensuite — voir `docs/handoff/recette-globale.md`). Le mobile
reste sous 90 pour des raisons d'actifs, hors code des pages :

- `public/fonts/AcuminVariable.woff2` : 443 Ko (fonte variable, axes wght + wdth)
  — un sous-ensemble Latin + symboles utilisés (→ ✓ ★ ◫ ↗ € · —) diviserait le
  poids par trois ; à trancher avec la licence de fonte (`legal/mentions`).
  `AcuminVariableConcept.otf` (1 Mo) reste en source de repli dans
  `tokens/fonts.css` — jamais chargé par un navigateur moderne, à retirer.
- Images clientes servies telles quelles : `equipe-avenir.png` 3,5 Mo (à propos),
  `conseiller-cta.png` 534 Ko, portraits 310-340 Ko, `agent-*.png` 190-225 Ko,
  logos 695 × 652 / 806 × 735 px affichés à 54 px de haut. Export aux tailles
  d'affichage (WebP/AVIF) sans retouche du visuel — décision client.
- CSS : 164 Ko non compressé (DS complet + Tailwind + local.css), 82-89 Ko de
  règles inutilisées par page : conséquence assumée de l'architecture « une
  feuille DS » ; ~25 Ko gzip.
- `ds-script.js` non minifié (5 Ko d'économie) : copie du DS.
