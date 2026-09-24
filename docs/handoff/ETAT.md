# État d'exécution du handoff — suivi inter-fenêtres

> **À lire en début de chaque fenêtre de contexte**, avec `00-marche-a-suivre.md`.
> Mettre à jour ce fichier en fin de fenêtre (section « Journal » + case de la feuille de route).

## Feuille de route

| Fenêtre | Contenu | État |
|---|---|---|
| F1 | `00-preflight` | ✅ terminé le 23 sept. 2026 (commits `2213ace` → `3c0a0aa`) |
| F2 | `01-accueil` — page témoin, recette à 100 % avant toute vague | ✅ terminé le 24 sept. 2026 (commit `c37e852`, recette conforme) |
| F3 | Vague A : `02-biens-liste` · `03-bien-fiche` · `07-estimation` (3 gabarits en parallèle) | ✅ terminé le 24 sept. 2026 (commits `ef993fa` → `a3736d8`, recettes conformes) |
| F4 | Vague B : `05-localite` puis `06-quartier` · `04-localites-hub` | ⬜ |
| F5 | Vague C : `11-equipe` · `10-a-propos` · `08-contact` · `09-avis` (3 max puis le 4e) | ⬜ |
| F6 | Vague D : `12-blog` · `13-auteurs` · `14-legales` | ⬜ |
| F7 | `99-recette` globale (+ suppression de `src/pages/test.astro`) | ⬜ |

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
9. **`data-planned` posé sur `/communes` et `/a-propos`** (SiteHeader nav+drawer,
   SiteFooter « Toutes nos communes ») : à RETIRER quand les gabarits 04 et 10 livrent.
10. **Contrat JSON-LD des pages** : `PageLayout` relaie le slot `head` ; une page qui
    émet son propre `RealEstateAgent` complet passe `organizationLd={false}` (sinon
    doublon avec le bloc minimal du `BaseLayout`). La colonne Quartiers du footer =
    `combinaisons(biens)` ∩ `communes.combinaisons` (jamais de lien sans page).
11. **Composants disponibles depuis F2** : `surfaces/FinalCta` (`variant: plain|photo|straddle`,
    `tone: tint|deep` — `deep` réservé, non stylé) et `surfaces/TrustSection` (photos
    d'avis `.t-imgs`/`.t-more`, logo Google) — à réutiliser en 08-contact et 09-avis.
    **Depuis F3** : `surfaces/Toolbar` (props `segments`/`groups`/`search`/`sort` —
    motif partagé avec les localités, cf. `.q-toolbar` de `local.css`),
    `surfaces/SkeletonGrid`, `surfaces/EmptyState`, `surfaces/Gallery` (lightbox
    vanilla dans son `<script>`), `surfaces/Steps` (`cols: 3|4`),
    `forms/EstimateForm` (prop `level: 2|3` pour la hiérarchie de titres —
    l'accueil duplique encore ce balisage, à lui faire adopter hors vague).
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
  existent — sans incidence (Loverval n'est pas une commune déclarée), à savoir en F4.
- **Valeurs « À sourcer — valeur maquette »** (datées 2026-09-23) : les 15 stats des
  pages membres (Olivier 320 ventes/34 ans/4,9 · Annelise 1 400/98 %/48 h · David
  180/31 j/96 % · Alexandra 74/9 sem./4,8 · Briyann 140/11 j/0 litige) ; dates des
  52 biens et de 3 avis (aucune date en référence) ; avis du mur datés au 1er du mois.
- Compteurs maquette non reproduits tels quels : « 28 biens », « 48 articles »,
  « 190 avis Google » — les pages devront afficher les comptes RÉELS des collections
  (règle : pas de chiffre non sourcé).

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
