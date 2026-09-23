# 99 — Recette globale

> À lancer quand les 14 gabarits ont chacun passé `recette-ds`. Une session, l'orchestrateur seul, sans sous-agent gabarit.

---

Le site est monté. Fais la recette globale et corrige ce qui relève de la cohérence entre pages (pas de refonte d'un gabarit : si une page est non conforme, renvoie-la à `recette-ds` + `gabarit`).

## 1. Build et routes

- `npm run build` vert, `npm run astro check` vert, 0 avertissement Astro sur les collections.
- Compare `dist/sitemap.xml` à la liste attendue : `/`, `/biens`, toutes les fiches `/biens/*`, `/communes`, toutes les combinaisons non vides `/{type}-a-{transaction}-{commune}`, `/equipe` + 6, `/blog` + articles, `/auteurs` + 5, `/estimation`, `/contact`, `/avis`, `/a-propos`, `/legal/*` (4). Aucune route en trop, aucune manquante.
- `grep -rn 'href="#"' dist/` → 0. Liste les `data-planned` restants par page : ce sont les pages à créer ensuite (autres communes).
- Tous les liens internes résolvent vers un fichier de `dist/` (script de crawl local).

## 2. Cohérence inter-pages

- Header : mêmes entrées de nav partout ; « Quartiers » → `/communes` ; état `.header--solid` sur toutes les pages sauf l'accueil.
- Footer : colonne « Quartiers » identique sur toutes les pages, cibles réelles + « Toutes nos communes » ; filigrane `signe-v-blanc.png` (jamais la version couleur sur fond sombre) ; liens légaux → `/legal/*`.
- Rythme : au plus **une** zone encre dans le corps de chaque page (hors héros/pied) ; 1 à 2 aplats vert profond ; jamais deux sections consécutives de même fond hors `.sec--cont`. Sors la liste par page.
- Chiffres : les mêmes valeurs partout où elles se répètent (4,8/5 · 190 avis ; 900+ ventes depuis 1992 ; 98 % au prix estimé ; 38 j avant compromis ; Liège 14 maisons / 265 000 € / 1 980 €/m² ; location 18 / 895 € / 11,40 €/m² ; Gerpinnes 385 000 € / 2 120 €/m² / 34 j). Une divergence = une erreur.
- Cartes : 0 ancre imbriquée sur tout `dist/` ; chaque `PropertyCard` / `ArticleCard` a exactement un lien.

## 3. Adhérence DS (global)

- `grep -rn "#17413B\|#00A678\|#EDE300\|#0E2B27" src/` → 0 hors `src/styles/ds/`.
- `grep -rn 'style="' src/pages src/components src/layouts` : justifie chaque occurrence (seuls `--pct` du simulateur et des valeurs calculées au runtime sont tolérés).
- `src/styles/local.css` : chaque bloc porte un titre « à reprendre dans le DS » ; liste-les dans `docs/ds/dette-ds.md` avec la page qui les utilise — c'est le handoff retour vers le design system.
- Îles : `ls src/components/islands` ≤ 6 fichiers ; aucun `client:only`.

## 4. Performance et accessibilité

- Lighthouse sur `/`, `/biens`, `/maison-a-vendre-liege`, `/blog/<article>` : Performance ≥ 90, A11y ≥ 95, SEO 100. Fonte woff2 en `preload`, `font-display: swap`.
- Axe : 0 violation critique. Un seul `h1` par page, hiérarchie sans trou, `alt` sur tous les placeholders, focus visible (halo `--green-soft`).
- Mobile 375 px : aucun débordement horizontal, cibles ≥ 44 px, drawer opérable au clavier.

## 5. Livraison

- `README.md` du dépôt réécrit (il contient encore le starter Astro) : stack, commandes, `sync-ds.sh`, où vit quoi, dette DS.
- `docs/ds/dette-ds.md` (point 3) et `docs/pages-planifiees.md` (les `data-planned`).
- Commit `chore(recette): recette globale` et tag `v0.1.0-maquette`.

Compte rendu : par section, conforme / écarts corrigés / écarts renvoyés (avec le gabarit).
