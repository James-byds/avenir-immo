# État d'exécution du handoff — suivi inter-fenêtres

> **À lire en début de chaque fenêtre de contexte**, avec `00-marche-a-suivre.md`.
> Mettre à jour ce fichier en fin de fenêtre (section « Journal » + case de la feuille de route).

## Feuille de route

| Fenêtre | Contenu | État |
| --- | --- | --- |
| F1 | `00-preflight` | ✅ terminé le 23 sept. 2026 (commits `2213ace` → `3c0a0aa`) |
| F2 | `01-accueil` — page témoin, recette à 100 % avant toute vague | ✅ terminé le 24 sept. 2026 (commit `c37e852`, recette conforme) |
| F3 | Vague A : `02-biens-liste` · `03-bien-fiche` · `07-estimation` (3 gabarits en parallèle) | ✅ terminé le 24 sept. 2026 (commits `ef993fa` → `a3736d8`, recettes conformes) |
| F4 | Vague B : `05-localite` puis `06-quartier` · `04-localites-hub` | ✅ terminé le 24 sept. 2026 (commits `fde39c7` → `85d9ce3`, recettes conformes) |
| F5 | Vague C : `11-equipe` · `10-a-propos` · `08-contact` · `09-avis` (3 max puis le 4e) | ✅ terminé le 24 sept. 2026 (commits `62319f9` → `54c2505`, recettes conformes) |
| F6 | Vague D : `12-blog` · `13-auteurs` · `14-legales` | ✅ terminé le 24 sept. 2026 (commits `d665c62` → `df47775`, recettes conformes) |
| F7 | `99-recette` globale (+ suppression de `src/pages/test.astro`, page 404, vigilances 16-20) | ✅ terminé le 24 sept. 2026 (branche `feat/99-recette` mergée, tag `v0.1.0-maquette`, compte rendu `docs/handoff/recette-globale.md`) |

Protocole d'une fenêtre de vague : coller le prompt du gabarit **en entier** dans un
sous-agent `gabarit` (périmètre = son bloc « Livrable »), attendre, lancer `recette-ds`
sur la page livrée avec sa référence, corriger, commit `feat(<gabarit>): …`.
Trois sous-agents en parallèle maximum.

## Acquis du preflight (ne pas refaire)

- **DS synchronisé** avec `reference/ds-export` (les CSS étaient déjà au niveau ;
  delta réel = `ds-script.js` + `signe-v-blanc.png`). `local.css` branché dans
  `app.css` entre le DS et `theme.css`.
- **Chrome aligné sur la référence** : `TopBar` (`.utility`, sur toutes les pages via
  `PageLayout`), `SiteHeader` (double logo à bascule, nav : Nos biens · Quartiers →
  `/communes` · Estimation · L'agence → `/a-propos` · Blog · Contact, props `solid`/`active`),
  `SiteFooter` (filigrane, colonne Quartiers **calculée par `lib/maillage`**, siège social,
  22 zones), `PageHead` (slots `breadcrumb`/défaut/`aside`, variants `plain|band|ink|tint`,
  prop `photoTag`), `BaseLayout` (JSON-LD Organization), `SocialLinks`, `SectionHead`,
  `PropertyCard.peb`.
- **Contenu mock complet** : 102 entrées (52 biens, 22 articles, 15 avis, 6 equipe,
  5 auteurs, 2 communes), textes mot pour mot, comptes vérifiés (14 ventes Liège
  médiane 265 000 €, 18 locations médiane 895 €). Schémas étendus et validés :
  `biens.{quartier,sousType,statut,reference,sdb,terrain,anneeConstruction,kwh}`,
  `communes.{combinaisons,prixQuartiers,trajets,atouts}`, `equipe.{ipi,points,stats,langues,zones,depuis}`,
  `articles.{categorie,tempsLecture}`, `avis.{projet,photos,reponse}`.
- **Portes passées** : build vert (103 pages), `astro check` 0 erreur, `.sk-card`
  compilé, `#17413B` hors styles compilés, seules les 4 combinaisons de localité
  pourvues sont générées (pas de `/appartement-a-vendre-liege`).

## Points de vigilance pour les gabarits

1. **`ds-script.js` exige `#header`, `#burger`, `#drawer`, `#drawerClose`** (gardes
   retirées côté DS). Toute page rend le chrome — ne jamais l'omettre.
2. **`ds-script.js` code en dur `window.location.href = "biens.html"`** au submit de
   `#propSearch`/`#heroSearch` en jetant la saisie. Le gabarit accueil/biens-liste doit
   recâbler vers `/biens?cat=…&loc=…&q=…` (contrat d'URL du README) — script Astro local,
   à signaler « à reprendre dans le DS ». **Fait sur l'accueil** (interception en phase
   de capture avant `ds-script.js`, voir `index.astro`) — motif à réutiliser en 02.
3. **MapLeaflet** contient `var(--green,#17413B)` — le hex n'est qu'un fallback de
   var CSS ; écart toléré, ne pas le compter en recette comme couleur en dur.
4. **`/test` (banc de comparaison)** affiche des hex en texte documentaire — page à
   supprimer en F7, ignorer d'ici là.
5. **Écarts maquette recopiés en scoped style** (valeurs inchangées, notés « à reprendre
   dans le DS ») : point vert du `nav-phone` (SiteHeader), `.fb-google`/`.fb-star`
   #E9A93B (SiteFooter).
6. **Le prompt 00 mentionnait une newsletter `#newsForm` au footer** : la référence
   n'en a pas (colonne siège social à la place). Le footer suit la référence.
7. **Enums à resserrer plus tard** (valeurs constatées) : `articles.categorie` — Vendre,
   Marché, Acheter, Investir, Juridique, Copropriété, Estimation, Louer, Quartiers,
   Succession, Technique ; `avis.projet` — vente, achat, estimation, offmarket.
8. **`sousType` n'a pas « loft »** : le loft de Charleroi reste type=appartement sans
   sousType. À trancher si le gabarit biens-liste en a besoin pour un filtre.
9. **`data-planned`** : retiré de `/communes` en F4 (SiteHeader, SiteFooter, widen de
   `/biens`, fils d'Ariane des localités — hub livré), puis de `/a-propos` en F5
   (SiteHeader — page livrée). Restent les pilules de communes voisines du
   quartier Gerpinnes.
10. **Contrat JSON-LD des pages** : `PageLayout` relaie le slot `head` ; une page qui
    émet son propre `RealEstateAgent` complet passe `organizationLd={false}` (sinon
    doublon avec le bloc minimal du `BaseLayout`). La colonne Quartiers du footer =
    `combinaisons(biens)` ∩ `communes.combinaisons` (jamais de lien sans page).
11. **Composants disponibles depuis F2** : `surfaces/FinalCta` (`variant: plain|photo|straddle`,
    `tone: tint|deep` — `deep` stylé en F5, `.finalcta--deep` dans `local.css`) et `surfaces/TrustSection` (photos
    d'avis `.t-imgs`/`.t-more`, logo Google) — à réutiliser en 08-contact et 09-avis.
    **Depuis F3** : `surfaces/Toolbar` (props `segments`/`groups`/`search`/`sort` —
    motif partagé avec les localités, cf. `.q-toolbar` de `local.css`),
    `surfaces/SkeletonGrid`, `surfaces/EmptyState`, `surfaces/Gallery` (lightbox
    vanilla dans son `<script>`), `surfaces/Steps` (`cols: 3|4`),
    `forms/EstimateForm` (prop `level: 2|3` pour la hiérarchie de titres —
    l'accueil duplique encore ce balisage, à lui faire adopter hors vague).
    **Depuis F4** : `surfaces/GuidePoints`, `surfaces/MarketStats` (`.q-stats`),
    `surfaces/PriceTable` (`.lg-table.q-prices`), `surfaces/CreditSimulator`
    (mentions légales incluses — porté en local, à remonter au DS),
    `surfaces/VillageMap` (carte Leaflet des villages, script vanilla — pas de
    6e île : `MapLeaflet` n'expose pas sa carte), `surfaces/Atouts` (prop
    `numerote`), `surfaces/NeighbourPills`, `surfaces/MarketCard` (hub) ;
    `SellHere` a gagné une prop `id` ; `src/scripts/listing-filter.ts` =
    filtre/tri/pagination partagé entre `/biens` et les localités.
    **Depuis F5** : `surfaces/MemberContactCard` (contrat `membre` +
    pass-through `class` — carte `.member--contact` autonome, `.m-id`/`.m-facts`
    avec IPI en dernier, voile « Profil », liens frères), `surfaces/Commitments`
    (`.about-dl`), `surfaces/CaseCard`, `surfaces/ContactRows` (`.c-*`),
    `surfaces/ReviewCard` (`.t-card` + `--hl`, photos `.t-photos`),
    `surfaces/ReviewWall` (`.av-*`, `.wall*`, lightbox vanilla) ; `MemberHero`
    enrichi (`photo`, `source`, marqueur bio en `.mh-bio-note`) ; `AgencyCard`
    paramétrable (rows `href`, `tag`+`open` cumulés, `directionsPrimary`/
    `phoneLabel`/`directionsArrow`, `target/rel` sur lien externe) ;
    `ContactForm` (ids `useId`/`htmlFor`, `consentHref`, en-tête de carte
    opt-in en ton encre) ; `TrustSection` prop `countHref` (« Lire les
    {count} avis → » — bandes localité).
12. **À reprendre dans le DS (relevé F2)** : redirection `biens.html` de `ds-script.js` ;
    `PropertyCard` sans passe-through `class`/`data-cat`, sans prop de ratio, kWh PEB
    non affiché (l'accueil pose `data-cat` + `reveal` par script local) ; `local.css`
    additifs — photos du carousel équipe, aspect-ratio de la carte vedette, `.sell-src`
    sur aplat sombre.
    **Relevé F3 (vague A)** : le passe-through `class`/`data-*` de `PropertyCard` et
    `id`/`hidden`/`planned` de `LocalityLinks` sont livrés côté repo — à remonter au
    DS ; layout colonne du `Toolbar` (= `.q-toolbar`) ; `Seg`/`Select` du DS
    inutilisables en toolbar (pas d'`id`/`data-f`, `.field` ≠ `.tool-select`) ;
    `SectionHead` ne rend que des h2 ; `TrustSection` sans prop `class`
    (l'`aria-label` des étoiles est désormais interpolé depuis `rating`, corrigé en
    recette) ; `AgentCard` : normalisation `telHref` (numéros « 0475/52.26.31 ») ;
    `ChoiceRow`/`Select` sans passe-through `id` ni câblage `label for=` (EstimateForm
    porte le balisage brut) ; `lib/seo.ts` : `realEstateListing()` ne modélise pas le
    loyer mensuel, `breadcrumbList()` à mutualiser ; `local.css` : `.sk-*`, `.empty*`,
    `.estimate h1`/`.estimate--page`/`.estimate h1 strong`.
    **Relevé F4 (vague B)** : `TrustSection` — le `t-count` du variant band est un
    texte (« 190 avis vérifiés ») là où la maquette met un lien « Lire les avis »
    (**soldé en F5** : prop `countHref`), et pas de slot de titre riche
    (`<em class="t-hl">` impossible) — le trust du quartier reste en classes DS,
    même précédent que `/biens` ; `FinalCta` sans variante encre
    (`.finalcta.sec--ink` recopié dans `local.css`) ; `MapLeaflet` mono-marqueur —
    prop `markers[]` groupés + sélection externe souhaitée (quartier et hub portent
    chacun leur script Leaflet local) ; `local.css` additifs F4 : `.sec--short`,
    `.sec--tint .ll-mesh`, `.page-head--band .section-head p strong`,
    `.vil-pick`/`.vil-row`, `.finalcta.sec--ink`, `.loc-who .b-av img`.
    **Relevé F5 (vague C)** : `PageHead` n'accepte ni classe additionnelle ni
    padding paramétrable et `FinalCta` ne cumule pas `photo`+`straddle` → héros
    du hub équipe et CTA final écrits en classes DS directes (`.eq-hero`/
    `.eq-cols`/`.eq-photo`, scoped) ; crochet `.on-dark` du DS sans inversion du
    fil d'Ariane (recopiée en scoped sur `/a-propos`) ; `FinalCta` ne pose pas
    `.on-dark` lui-même (posé sur `.fc-actions` en 08/09, à remonter sur la
    section à la reprise de `.finalcta--deep`) ; reprises livrées côté repo à
    remonter au DS : `ContactForm` (a11y `useId`/`htmlFor`, `consentHref`,
    en-tête encre opt-in, validation + état envoyé), `AgencyCard` (cf.
    vigilance 11), `TrustSection.countHref` + `.t-count a{color:inherit}` ;
    scoped « à reprendre » : `.eq-contact`, `.mh-photo--img`/`.mh-bio-note`
    (MemberHero), base `.about-hero`/`.about-dl`/`.about-photo`/`.lx--two`
    (a-propos), `.c-*` (ContactRows), `.av-hero`/`.av-sync`/`.av-toolhead`/
    `.wall*`/`.t-date`/`.t-reply`/`.t-photos` (avis) ; `local.css` additifs
    F5 : `.finalcta--deep`, `.cf-consent span a` ; contrastes corrigés sur
    fond teinté (règle DS ≻ maquette) : `#mur .av-count`/`.tool-label`/
    `.wall-note` et `.sc-body .ts-bar` → `--ink-soft` ; `Seg` du DS toujours
    inutilisable en toolbar (balisage brut au mur d'avis, déjà relevé F3).

13. **Schéma biens étendu en F3** (additif, tout optionnel — décision du gabarit 03,
    hors Livrable strict, assumée) : `biens.{garage, codePostal, galerie[], legales[],
    quartierTexte, quartierRepere}` + `mensualite.hypothese`. Seuls 2 biens portent les
    nouveaux champs (villa Gerpinnes, duplex Guillemins) : les autres fiches rendent
    avec les défauts — compléter au fil des vagues si une page l'exige.
14. **Fiches biens : `<title>` en forme courte** (segment du titre avant la première
    virgule, motif de la référence) — toute page qui référence un bien doit rester
    cohérente avec ce format. Labels `Input` : le `for` reprend l'`id` passé — passer
    un `id` à chaque `Input` associé à un champ (le banc `/test` ne le fait pas,
    signalé en contre-recette, sans incidence : supprimé en F7).
15. **Schéma communes étendu en F4** (additif, tout optionnel) : `pages[]` — copie
    complète d'une page de localité (bandeau/intro/guide/marche/vivre/vendre/
    contact/faq/trust/final/conseiller, `listing: type|transaction`, bloc
    `quartier`) ; `province`, `coord`, `agence`, `codePostal`, `gabarit:
    "quartier"`, `villages[]` (nom, lat/lng, prixM2 sourcé), `faq[].{id,
    transaction, type}` (ciblage d'une question par page, ancres stables).
    Évolutions souhaitées NON appliquées (relevé 04) : `communes/charleroi.md` ou
    champ `marche` pour sortir les chiffres du Grand Charleroi du frontmatter de
    `communes.astro` ; champ `equipe.photo` (convention actuelle
    `/assets/agent-<prénom>.png`, reprise de l'accueil).

16. **Les marges Tailwind (`mt-*`, `mb-*`, `m-*`) sont inertes** : le reset
    `* { margin: 0 }` de `site.css` (l. 4) est importé hors couche et prime sur
    `@layer utilities` — la classe est compilée mais la marge calculée vaut 0
    (mesuré en F6). Occurrences existantes hors vague D, à traiter en F7 :
    `a-propos.astro:272`, `biens/[slug].astro:284,338`, `equipe/[slug].astro:243`.
    Vague D corrigée en règles scoped (`.blog-lead`, `.art-related`, `.writers`).
    **Tranché en F7** : `app.css` déclare `@layer theme, base, ds, components,
    utilities` et importe le DS puis `local.css` dans la couche `ds` ; **tout
    `<style>` de page ou de composant est enveloppé dans `@layer ds { … }`**
    (sinon, hors couche, il primerait sur `local.css` quelle que soit sa
    spécificité — régression constatée sur `.t-card--hl .t-date`). Les
    utilitaires Tailwind s'appliquent désormais (les `mt-*`/`mb-*`/`mx-auto`
    déjà écrits ont pris effet, conformes aux références) ; les `style=` de
    mise en page ont été convertis en utilitaires, la typographie en scoped.
    Règle pour la suite : marges et largeurs en utilitaires, jamais en `style=`.
17. **`.sec--short` (local.css) raccourcit le haut ET le bas** ; les références
    blog/article ne raccourcissent que le haut. **Tranché en F7** : `.sec--short-top`
    (padding-top seul, mêmes bornes 28-44 px) livré dans `local.css` et employé
    par le corps de l'article (`ArticleLayout`) ; le hub blog garde sa valeur
    propre (34/4vw/56) en scoped. À reprendre dans le DS.
18. **`markdown.smartypants: false`** dans `astro.config.mjs` (F6) : les corps
    Markdown sont rendus tels qu'écrits — la recette compare les articles à leur
    référence par points de code (satteri substituait 23 apostrophes en U+2019).
    **Confirmé en F7** : conservé (la copie validée fait foi, guillemets et
    apostrophes compris).
19. **Composants disponibles depuis F6** : `surfaces/ArticleCard` (contrat
    `article` + `auteur?` entrées de collection, `variant: feature|post|compact`,
    `tint`/`thumb`, `class`, `data-cat/date/read/idx` sur la racine — racine
    `<article>`, un seul `<a>` = le titre étendu par `::after`) ; `ArticleHeader`
    (`title` requis, `lede` HTML léger) ; `AuthorBox` (un seul lien) ; `Byline`
    (`<a>` si `href`, sinon `<span>`) ; `AuthorHero` (portrait/initiales,
    `quote`, `stats` → `.ah-stats`) ; `WriterCard` (`auteur`, `count`,
    `variant: photo|compact`, racine `<a class="writer">` comme la référence) ;
    `EditorialCharter` (`.au-charte`) ; `EnClair`, `LegalTable`, `Droits` ;
    `layouts/LegalLayout` (props `doc/titre/description/version/date/lecture?/toc[]/cta`,
    slot `toc-action`, temps de lecture CALCULÉ depuis le corps rendu si `lecture`
    absent) ; `layouts/ArticleLayout` (conventions du corps : 1er `<p>` = chapô si
    le corps a un H2, paragraphe « **En clair** — … » = encadré, chaque H2 =
    `<section>`, source des `chiffres[]` rendue sous le corps) ;
    `src/scripts/blog-filter.ts` (filtre/tri/pagination du hub, contrat d'URL
    `?cat=<slug>&page=N`, `slugCategorie()` partagé). **F7** : `ContactForm`
    gagne `headingLevel: 2|3` (page contact) ; `BaseLayout`/`PageLayout`
    acceptent `canonical={false}` (404) ; `LocalityLinks`/`NeighbourPills`/
    `MarketCard` rendent une cible `planned` **sans `href`** (URL en `data-href`).
    Schémas additifs F6 :
    `articles.{metaDescription, titreCourt}` ; `auteurs.{roleLong, ipi, citation,
    citationCourte, specialites[], depuis, depuisLabel, externe, langues[], base,
    portrait, ordre, metaDescription}` (citation/spécialités/langues remontées de la
    prose en frontmatter, corps vidés).
20. **À reprendre dans le DS (relevé F6)** : `local.css` additifs F6 —
    `.art-feature .art-meta` (--ink-soft), `.page-head--tint .breadcrumb a` /
    `.lg-meta` (--ink-soft, 4,46:1 → 6,31:1) + `:hover` vert, `.toc-action a`
    (`min-height:44px`, marge 10 → 6). Scoped « à reprendre » : `.writer--photo`,
    `.w-top/.w-portrait/.w-id/.w-quote/.w-specs/.w-count`, `.writer:focus-visible`,
    `.au-charte`, `.au-hero/.au-stats/.au-lede`, `.au-toolhead/.au-count(--end)/
    .au-grid/.au-side(--4)`, `.b-av--init` (13) ; `.blog-hub` (`.section-head`
    de l'en-tête déplafonné + H1 58 px, `.blog-grid .post:last-child` visible,
    `.toolbar-right` calé à droite + `.dd-menu` ancré à droite — le menu du
    select débordait le viewport à 375, même défaut sur la référence),
    `.blog-article` (`.wrap--art` 1040, `.art-layout` 56 px/1fr repliée sous
    960, marges du corps) (12) ; `.lg-head h1` (taille) et liens du corps légal
    (14). DS : `.tool-group{min-width:auto}` déborde à 375 sous un `.seg` long
    (blog, auteur, /avis) ; `:focus-visible` absent sur `.btn`, `.lg-switch a`,
    `.lg-toc a`, `.writer` ; cibles < 44 px (`.seg button` 38, `.sh-btns a` 38,
    `.breadcrumb a` 18, `.link-arrow` 19, `#burger` 32) ; `.seg button .n`
    inactif ≈ 2,9:1 ; `#burger` reste `aria-expanded="false"` drawer ouvert
    (`ds-script.js`) ; `aria-pressed` sur les seg (posé en local sur la page
    auteur, absent sur /avis et /blog). `lib/seo.ts` : `webPage()`,
    `breadcrumbList()`, `article()`, `person()` à mutualiser (construits inline
    dans ArticleLayout/LegalLayout/pages auteur). `SiteFooter` : lien « Gérer
    mes cookies » (`/legal/cookies#s3`, `data-planned`) ajouté en F6 — annoncé
    « en bas de page » par la confidentialité (s6) ; à câbler sur le bandeau de
    consentement quand il existera. `PropertyCard`/accueil : l'accueil duplique
    encore le balisage `.post` (`ArticleCard variant="post"` à lui faire adopter
    hors vague, comme `EstimateForm`). **F7** : l'ensemble de ce relevé (12 + 20)
    et les corrections d'accessibilité de la recette globale sont consolidés dans
    `docs/ds/dette-ds.md`, avec la page qui utilise chaque bloc — c'est le
    handoff retour vers le DS.
21. **Recette statique reproductible** : `node scripts/recette.mjs` après
    `npm run build` (sitemap, `href="#"`, `data-planned`, résolution des liens et
    ancres, ancres imbriquées, cartes, hex de charte) — à relancer avant tout
    merge. Les contrôles de rendu (axe, focus, 375 px, cibles, rythme des fonds)
    ont été faits en F7 avec Chrome headless (outillage de session, non versionné).
22. **Pages planifiées** : une cible `data-planned` dont la page n'existe pas
    n'a **pas de `href`** (un lien vers une 404 est un lien cassé) — l'URL prévue
    est en `data-href`, la liste vit dans `docs/pages-planifiees.md`.

## Arbitrages de contenu (incohérences de la maquette)

- Article « droits d'enregistrement » signé « Nadia Bouchard » (auteure inexistante,
  blog.html) : **écarté** — la version d'Anne Vandeputte (28 février, Juridique) est retenue.
- Maison familiale Montigny : **425 000 € + statut vendu** (biens.html/index) retenu
  contre 398 000 € (page Alexandra) ; agent = Alexandra.
- Villa AV-2418 (bien.html) : conseiller affiché « Julien Schmitz » (auteur, pas agent)
  → `agent: olivier-monier` (« En vente avec Olivier »).
- Agnès Quispe : métas de sa page = copier-coller d'Olivier → version du hub retenue
  (depuis 2021, FR·IT), `zones` omis.
- Conseillers « Thomas Gilles » / « Sarah » (pages Liège) inexistants : biens laissés
  sans agent (sauf les 2 de Briyann).
- quartier.html dit « Loverval : aucun bien en ligne » alors que 3 biens Loverval
  existent — **résolu en F4** : la page quartier couvre l'ENTITÉ (Gerpinnes +
  villages, filtre sur `villages[]`, biens inchangés) et affiche les comptes réels
  (6 biens, « Loverval : 3 biens ») ; tous les comptes calculés suivent (hoods de
  l'accueil, pastilles du maillage via `compteCible`).
- **Valeurs « À sourcer — valeur maquette »** (datées 2026-09-23) : les 15 stats des
  pages membres (Olivier 320 ventes/34 ans/4,9 · Annelise 1 400/98 %/48 h · David
  180/31 j/96 % · Alexandra 74/9 sem./4,8 · Briyann 140/11 j/0 litige) ; dates des
  52 biens et de 3 avis (aucune date en référence) ; avis du mur datés au 1er du mois.
- Compteurs maquette non reproduits tels quels : « 28 biens », « 48 articles »,
  « 190 avis Google » — les pages devront afficher les comptes RÉELS des collections
  (règle : pas de chiffre non sourcé).
- **Mur d'avis (F5)** : la référence `avis.html` affiche 12 avis (le prompt 09 en
  annonçait 24) et la collection (17 entrées) couvre 100 % du corpus maquette —
  rien à inventer. `/avis` rend les 17 cartes (SEO), 12 visibles + 5 derrière
  « En voir plus », filtres et compteurs calculés ; 4,8/190 et la distribution
  restent des chiffres Google externes avec source.
- **Cartes membres (F5)** : voile « Profil » (référence) retenu contre « Voir le
  profil » du prompt 10 (`aria-label` « Voir le profil de {nom} » conservé) ;
  IPI affiché en dernière position des `.m-facts` et dans le `.mh-role` des
  pages membres (« {rôle} · IPI {n°} », directive du prompt 11 — la référence
  membre ne l'affichait qu'au hub).
- **Incohérences maquette relevées en F5, non tranchées (à figer avant mise en
  ligne)** : `contact@` (a-propos, contact, JSON-LD) vs `info@` (TopBar/footer/
  accueil) ; Boulevard Tirou (chrome, pages) vs Place Desaise (footer,
  `gerpinnes.md`) ; lat/lng du siège approchées (50.4076, 4.4418) ; « Ouvert
  aujourd'hui jusque 18h30 » statique (faux le samedi).

- **Vague D (F6) — compteurs** : tous calculés depuis `articles` (Camille 7,
  Julien 4, Marc 4, Sophie 3, Anne 4 ; hub blog « Tout voir 22 » ; hub auteurs
  « 5 rédacteurs · 22 articles · depuis 2018 » ; `.ah-stats` = articles signés,
  thématiques distinctes, lecture moyenne, dernière publication — dérivés). Les
  « 48 / 18 / 12 / 9 / 6 / 3 articles », « 4 thématiques », « 7 min » de la
  maquette ne sont reproduits nulle part.
- **Hub blog** : section « Cinq rédacteurs » = pilules `.q-pill` « Nom · n
  articles → » (référence) et non `.writers` (prompt) ; grille en cartes `.post`
  (référence, comme les pages auteur) et non `.art-mini` (réservé à « À lire
  aussi ») ; seg = « Tout voir » + les 11 catégories réellement présentes
  (référence : 5 fictives) — la toolbar passe sur deux rangées à 1440 (196 px vs
  112, calée à droite), **écart de hauteur acté** ; tri « Les plus lus » omis
  (aucune donnée) ; l'article à la une = le plus récent, suit le filtre. Le H1
  reprend les styles inline de blog.html (58 px, une ligne, `.section-head`
  déplafonné) — la classe DS seule le mettait sur deux lignes.
- **Article** : CTA final = panneau `.lg-cta` de la référence (≻ « FinalCta
  blanc » du prompt) ; fil d'Ariane HTML = `titreCourt` (« Home-staging »), le
  JSON-LD garde le titre complet ; `<meta description>` = `metaDescription`
  (texte d'article.html) tandis que `description` reste l'extrait court des
  cartes (index.html, pages auteur) — l'extrait long de la carte à la une de
  blog.html (« … mesurés sur nos 42 dernières ventes ») n'est pas repris ; la
  ligne « SOURCE : … » de la référence est rendue sous le corps depuis
  `chiffres[]` (source « Données internes Avenir Immobilier · 42 ventes, 2025 —
  1er semestre 2026 », datée 2026-06-30) ; « À lire aussi » sans `art-mini--tint`
  (teinté sur teinté) ; la grille `.art-layout` se replie sous 960 px (la
  référence gardait la colonne vide).
- **Auteurs** : « Les autres rédacteurs » = 4 cartes (tous sauf le courant ; la
  référence en montrait 3) ; h2 nus de la référence → `SectionHead` (défaut de
  maquette, précédent F5) ; rôle d'Anne « Notaire · rédactrice invitée » partout,
  rendu « notaire & rédactrice invitée » dans le `<title>` et la byline compacte ;
  fil d'Ariane « Blog » (nav du site) plutôt que « Journal » ; `WriterCard` garde
  la racine `<a>` de la référence (aucun élément interactif à l'intérieur) ;
  `.au-stats .sv` du hub en display élargi (parti de `.ah-stats .sv`, sans
  incidence de hauteur) ; `/contact?sujet=article` : paramètre inerte
  (`ContactForm` ne lit pas l'URL). **Non tranché** : les bios portent des
  chiffres non sourcés hérités (« 180 baux », « 42 ventes l'an dernier »).
- **Recette globale (F7)** : identités de contact **non tranchées, renvoyées au
  client** (téléphone `071 22 11 41` au pied de page et sur les pages légales vs
  `+32 71 32 14 70` en en-tête, contact, estimation ; `info@` vs `contact@` ;
  siège social Place Roger Desaise (pied de page, `gerpinnes.md`) vs Boulevard
  Tirou (barre utilitaire, pages) ; IPI 509 217 sur trois entités) : la maquette
  décrit deux implantations, ce n'est pas au portage de choisir ; les valeurs
  restent celles des références, page par page. `MarketCard` multi-liens assumée
  (pas de `.card-link`). Contrastes corrigés selon la règle DS ≻ maquette :
  `.footer-bottom` (.5 → .66), `.tl-end` (`--green-l` → `--green-soft`),
  `.seg .n` inactif, `.guide-pt .a-num` (`--green-l` → `--green`). Cibles
  tactiles étendues par pseudo-élément sans changer la mise en page ; résidu
  assumé : contrôles Leaflet 30 px (tiers), liens inline dans le texte
  (exception WCAG), champs de la recherche héros enveloppés dans leur `<label>`.
  Lighthouse mobile < 90 en performance à cause des actifs clients (fonte 443 Ko,
  images non redimensionnées) — renvoyé au client, détail dans `dette-ds.md` § 6.
- **Légales** : `honoraires` sans aucun barème (5 × « Sur devis », Estimation
  « Gratuite » — source : le site), aucune mensualité ; `mentions`/`cookies`/
  `honoraires` rédigés prudemment, versions 1.0 datées 2026-09-24, temps de
  lecture calculé, 18 blocs `<!-- À valider par le client -->` et « [à
  compléter] » pour BCE/TVA, RC, hébergeur, licence de fonte, outils d'audience ;
  `cookies` décrit l'état RÉEL du code (aucun cookie posé, pas de bandeau, tiers
  = tuiles OSM + Font Awesome jsDelivr) ; `.lg-cta` confidentialité →
  `mailto:privacy@…` (référence) ; identité = chrome (Tirou 102, info@,
  071 22 11 41, « Agent immobilier agréé n° 509 217 — IPI »). **Non tranchés,
  s'ajoutent au relevé F5** : téléphone 071 22 11 41 (footer) vs +32 71 32 14 70
  (header, contact) ; IPI 509 217 attribué à trois entités (agence, Olivier
  Monier, Camille Renard) ; confidentialité garde « BE 0712.xxx.xxx » mot pour
  mot là où mentions dit « [numéro d'entreprise à compléter] ».

## Journal

- **23 sept. 2026 — F1 preflight** : paquet importé et committé ; sync DS ; local.css
  branché ; assets copiés ; chrome aligné ; SectionHead + PropertyCard.peb ; contenu
  extrait puis enrichi (sous-agent contenu ×2) ; schémas étendus après validation
  utilisateur ; route localité et sitemap passés sur `combinaisons`. Outillage :
  `@astrojs/check` + `typescript` en devDependencies.
- **24 sept. 2026 — F2 accueil** (commit `c37e852`, branche `feat/01-accueil` mergée) :
  gabarit livré par sous-agent `gabarit`, recette en 2 passes (6 écarts → conforme).
  Corrections de chrome par l'orchestrateur : footer Quartiers intersecté avec
  `communes.combinaisons` (3 liens 404 supprimés), `data-planned` sur `/communes` et
  `/a-propos`, slot `head` relayé + `organizationLd` (un seul `RealEstateAgent`/page).
  Fonds des sections 10-12 : la référence (quartiers vert profond · blog tendre ·
  faq blanc) prime sur le tableau du prompt 01 — acté en recette. L'écart « espaces
  sécables FAQ » était un faux positif (U+00A0 déjà en source, contrôle par points de
  code). Photos d'avis complétées (toussaint 2, sebastien-l 4). Prochaine étape :
  **F3 vague A** (`02-biens-liste` · `03-bien-fiche` · `07-estimation`, 3 sous-agents
  `gabarit` en parallèle).
- **24 sept. 2026 — F3 vague A** (commits `ef993fa` · `b2f86fa` · `a3736d8`, branche
  `feat/vague-a` mergée) : 3 sous-agents `gabarit` en parallèle dans le même arbre
  (périmètres disjoints, propriété de `src/content/biens/` donnée au 03, builds
  interdits pendant la vague — porte `astro check` + build passée par l'orchestrateur),
  puis 3 `recette-ds` en parallèle. 02 conforme d'emblée ; 03 : 2 écarts (label `for`
  d'`Input`, `<title>` en forme courte) ; 07 : 4 écarts (trou H1→H3 → prop `level`
  d'`EstimateForm`, insécable manquante, `aria-label` des étoiles figé dans
  `TrustSection`, `strong` du H1 en graisse 900 → `font-weight:inherit` dans
  `local.css`) — corrigés par l'orchestrateur, contre-recettes conformes. À savoir :
  le prompt 07 citait des crochets inexacts (`.ep`, `.step[data-step]`) —
  `ds-script.js` prime (`#ecProgress`, `.est-step[data-step]`), acté en recette ;
  le trust de `/biens` est en variante pleine (la référence prime sur le
  `.trust--band` du prompt 02, même précédent que F2). Prochaine étape : **F4
  vague B** (`05-localite` d'abord, puis `06-quartier` · `04-localites-hub`).
- **24 sept. 2026 — outillage** : hub de développement `/dev`
  (`src/pages/dev/[...path].astro`) — inventaire des 14 gabarits, état dérivé de la
  source des pages (marqueur « Stub ») et des collections, liens « réf » vers la
  maquette servie sur :3000. **Dev uniquement** : `getStaticPaths` renvoie `[]` au
  build, la page n'existe pas dans `dist/` (rien à retirer en F7, hors recette).
- **24 sept. 2026 — F4 vague B** (commits `fde39c7` · `9258ed2` · `85d9ce3`, branche
  `feat/vague-b` mergée) : 05 seul d'abord (06 en dérive), puis 06 · 04 en parallèle
  (périmètres disjoints — `content.config.ts` et `gerpinnes.md` réservés au 06,
  builds interdits pendant la parallélisation, portes par l'orchestrateur), puis
  2 `recette-ds` en parallèle. **05** : copie par page dans `communes/<slug>.md`
  (`pages[]`), 4 écarts en recette (bande trust omise → `TrustSection band` entre
  agence et maillage ; `ctaGhost` alignés sur la référence ; compteur de pastille =
  périmètre RÉEL de la page cible — `compteCible`, une page `listing:"transaction"`
  affiche 18, pas 17, hood de l'accueil aligné aussi ; `.a-num` des atouts location)
  — contre-recette conforme. **06** : conforme d'emblée ; périmètre ENTITÉ (villages
  inclus par filtre sur `villages[]`, 6 biens réels, cf. arbitrage Loverval) ;
  `VillageMap.astro` + script vanilla — pas de 6e île. **04** : 2 écarts (hex bruts
  du script carte → `var(--green…)` ; `data-planned` de `/communes` périmés →
  retirés du chrome, vigilance 9 soldée) ; hub SANS compteurs — règle du handoff
  portée par le prompt, qui prime ici sur la référence (l'inverse du précédent
  F2/F3, à retenir : la référence prime sur le *plan* du prompt, jamais sur une
  *règle*) ; section 5 en `.lx` (balisage de la référence) plutôt que
  `LocalityLinks mesh`. Prochaine étape : **F5 vague C** (`11-equipe` ·
  `10-a-propos` · `08-contact` · `09-avis` — 3 sous-agents max puis le 4e).
- **24 sept. 2026 — F5 vague C** (commits `62319f9` · `a53c34e` · `07cc0a9` ·
  `54c2505`, branche `feat/vague-c` mergée) : 3 sous-agents `gabarit` en
  parallèle (11 · 10 · 08), périmètres arbitrés AVANT lancement — les prompts 10
  et 11 se chevauchaient : `MemberContactCard` + `Commitments` au 10 (contrat
  d'interface `membre` + `class` dicté aux deux, le 11 l'a consommée avant
  qu'elle existe — builds interdits, soudure vérifiée à la porte),
  `content.config.ts` + `equipe/*` + `biens.agent` + `MemberHero`/`CaseCard`
  au 11, `local.css` (un seul bloc `.finalcta--deep`) + `ContactForm.tsx` +
  `ContactRows` au 08. Puis 3 recettes en parallèle, corrections orchestrateur,
  2 contre-recettes conformes ; 09 seul ensuite. **10** : conforme d'emblée
  (arbitrage carte `.m-id` ≻ `.m-cap` de la référence antérieure, tenu en
  recette). **11** : 6 écarts (IPI absent des facts et du `.mh-role`, voile
  « Voir le profil » → « Profil », en-tête du formulaire encre manquant, bio
  provisoire sans retrait) — corrigés. **08** : 2 bloquants (noms accessibles
  → `useId`/`htmlFor` ; lien « confidentialité » → `consentHref`) + reprises
  `AgencyCard` (les deux références divergeaient : bouton plein = tél sur
  a-propos, = itinéraire sur contact → props, défauts rétro-compatibles).
  **09** : le sous-agent `contenu` a établi que le mur de la référence compte
  12 avis (pas 24 comme le prompt) et que la collection (17) couvre 100 % du
  corpus — rien créé ; recette 2 écarts de contraste (`#mur .tool-label`/
  `.wall-note` → `--ink-soft`), contre-recette conforme. `TrustSection.countHref`
  livré (relevé F4 soldé), en-tête de carte du formulaire encre opt-in (les
  bandes localité n'en ont pas — non-régression vérifiée), `data-planned`
  `/a-propos` retiré du chrome. À savoir : `biens.agent` était déjà conforme
  aux arbitrages (aucune édition). Prochaine étape : **F6 vague D** (`12-blog` ·
  `13-auteurs` · `14-legales`).
- **24 sept. 2026 — F6 vague D** (commits `d665c62` · `6c44a14` ·
  `df47775`, branche `feat/vague-d` mergée) : 3 sous-agents `gabarit` en
  parallèle (12 · 13 · 14), périmètres arbitrés AVANT lancement — les prompts 12
  et 13 se chevauchaient (`WriterCard`, `auteurs/*.md`) : `WriterCard` +
  `content.config.ts` (schéma `auteurs` seul) + `auteurs/*.md` au 13, contrat
  `ArticleCard` (entrées de collection, `variant post`) dicté aux deux, le 13 l'a
  consommé avant qu'il existe — builds interdits, soudure vérifiée à la porte
  (0 erreur, 105 pages ; seuls écarts : le banc `/test` sur l'ancienne interface
  d'`ArticleCard`, adapté par l'orchestrateur). Puis 3 `recette-ds` en parallèle
  (ports 4312-4314, référence sur :3000), corrections orchestrateur, 3
  contre-recettes (13 conforme d'emblée ; 12 : 3 écarts de second passage ; 14 :
  1 effet de bord de la correction de contraste), contrôles ciblés finaux
  conformes. **12** : 9 écarts (méta de la carte à la une 4,46:1, trou H1→H3,
  `.dd-menu` du tri débordant à 375, toolbar repliée calée à gauche,
  `.sec--short` trop court en bas ×2, `mt-*` inertes ×2 — vigilance 16, « 5 min
  de lecture ») puis 3 (`metaDescription`, H1 du hub, `titreCourt`). **13** :
  10 écarts (`.au-quote` scoped écrasant `local.css` — même spécificité inlinée
  après, `mt-[clamp]` inerte, débordement du seg à 375, trou H1→H3, élision
  « d'Anne », double « · » dans le title, ligne de clôture sans pagination,
  `aria-pressed`, `font-stretch` de la citation, `:focus-visible`). **14** :
  3 écarts (contraste du bandeau tint, lien footer « Gérer mes cookies »
  annoncé par la confidentialité, cible `.toc-action a` 40 px) + 1 (hover du
  fil d'Ariane éteint par la règle de contraste). Décisions orchestrateur :
  `smartypants: false` (vigilance 18), `ArticleCard` du banc `/test` passé sur
  des entrées réelles, réponse (b) « rangée repliée calée à droite » plutôt qu'un
  seg défilant à 1440. À savoir : les comptes par auteur annoncés dans le cadre
  (Camille 8, Julien 5) étaient faux — le sous-agent a vérifié (7 et 4) ; toujours
  faire calculer. Prochaine étape : **F7 `99-recette` globale** (+ suppression de
  `src/pages/test.astro`, décision vigilance 16 sur le reset/les couches,
  `mt-*` restants, incohérences chrome non tranchées).
- **24 sept. 2026 — F7 recette globale** (branche `feat/99-recette` mergée, tag
  `v0.1.0-maquette`, compte rendu détaillé dans `docs/handoff/recette-globale.md`) :
  orchestrateur seul, sans sous-agent gabarit. Outillage de session : serveur
  statique gzip, captures pleine page 1440/375 des 104 routes à chaque étape
  (diff pixel avant/après — 0 régression non voulue), audit rendu (axe, titres,
  focus clavier, débordement 375, cibles tactiles effectives, tiroir, rythme des
  fonds), Lighthouse mobile/desktop, `scripts/recette.mjs` versionné. Lots :
  (1) suppression de `/test` ; (2) DS en couche `ds` + 90 `style=` convertis +
  pilules planifiées sans `href` + sitemap (`/a-propos`, `/communes` manquaient)
  + fallbacks hex retirés ; (3) page 404 ; (4) accessibilité — 0 violation axe
  sur 104 routes (contrastes, titres de colonnes du pied de page en h2, `TopBar`
  en région, `#filters` en `group`, `ContactForm headingLevel`, « À lire aussi »
  en h2, h2 masqué sur `/biens`, focus visible, cibles ≥ 44 px, toolbar mobile,
  tiroir clavier), `@layer ds` sur les 36 blocs `<style>` (régression
  `.t-card--hl .t-date` corrigée) ; (5) docs (`README`, `dette-ds.md`,
  `pages-planifiees.md`, `.sec--short-top`). À savoir : envelopper un `<style>`
  par regex exige une balise en début de ligne (cinq commentaires de frontmatter
  citaient `<style>`) ; un `padding` sur un item flex change la mise en page
  (préférer le pseudo-élément) ; les fallbacks `var(--green,#…)` sont inutiles
  (tokens toujours chargés). Reste hors vague : adoption de
  `EstimateForm`/`ArticleCard` par l'accueil, identités de contact (client),
  actifs (client), reprise DS de `dette-ds.md`.
