# État d'exécution du handoff — suivi inter-fenêtres

> **À lire en début de chaque fenêtre de contexte**, avec `00-marche-a-suivre.md`.
> Mettre à jour ce fichier en fin de fenêtre (section « Journal » + case de la feuille de route).

## Feuille de route

| Fenêtre | Contenu | État |
|---|---|---|
| F1 | `00-preflight` | ✅ terminé le 23 sept. 2026 (commits `2213ace` → `3c0a0aa`) |
| F2 | `01-accueil` — page témoin, recette à 100 % avant toute vague | ⬜ à faire |
| F3 | Vague A : `02-biens-liste` · `03-bien-fiche` · `07-estimation` (3 gabarits en parallèle) | ⬜ |
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
   à signaler « à reprendre dans le DS ».
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
