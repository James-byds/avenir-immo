# Pages planifiées — cibles `data-planned`

Relevé de la recette globale du 24 septembre 2026 (`node scripts/recette.mjs`,
§1 « Liens nus et pages planifiées »). Une ancre `data-planned` désigne une
page ou une fonction prévue mais pas encore livrée. **Elle ne porte pas de
`href`** tant que la cible n'existe pas (un lien vers une 404 est un lien
cassé pour le crawl) : l'URL prévue est conservée dans `data-href`, et le
composant remet le `href` dès que `planned` tombe.

Composants concernés : `NeighbourPills` (pilules « communes voisines »),
`LocalityLinks` (`Link.planned`), `MarketCard` (`Lien.planned`).

## Pages de localité à créer (5)

Toutes sur la page quartier `/maison-a-vendre-gerpinnes` (section « Immobilier
dans les communes voisines », `communes/gerpinnes.md` → `voisins.liens`).
Chaque page exige, dans l'ordre : un fichier `src/content/communes/<slug>.md`
(schéma `communes`, avec `combinaisons` et `pages[]`), au moins un bien publié
sur la combinaison, puis le retrait de `planned: true` dans `gerpinnes.md`.

| URL prévue | Libellé | Biens publiés aujourd'hui | Bloquant |
| --- | --- | --- | --- |
| `/maison-a-vendre-charleroi-centre` | Charleroi centre | 0 maison (des appartements existent) | commune + biens |
| `/maison-a-vendre-fleurus` | Fleurus | 2 (villa quatre façades, maison avec atelier) | `communes/fleurus.md` |
| `/maison-a-vendre-loverval` | Loverval | 3 (Loverval est un village de l'entité Gerpinnes) | trancher : page propre ou ancre `#loverval` sur la page quartier |
| `/maison-a-vendre-mont-sur-marchienne` | Mont-sur-Marchienne | 2 | `communes/mont-sur-marchienne.md` |
| `/maison-a-vendre-montigny-le-tilleul` | Montigny-le-Tilleul | 1 (vendue) | commune + bien disponible |

Rappel de la règle (CLAUDE.md) : jamais de page ni de lien pour une
combinaison commune × type × transaction sans bien publié. Le sitemap et la
route `[type]-a-[transaction]-[commune]` n'émettent que les combinaisons
déclarées dans `communes.combinaisons` ∩ biens publiés.

## Fonction planifiée (1)

| Lien | Où | État |
| --- | --- | --- |
| « Gérer mes cookies » → `/legal/cookies#s3` | pied de page, toutes les pages | la cible existe (le `href` est conservé) ; à câbler sur le bandeau de consentement quand il existera — aujourd'hui aucun cookie n'est posé (cf. `/legal/cookies`) |

## Comment retrouver la liste

```sh
npm run build && node scripts/recette.mjs
```

La section §1 imprime chaque cible `data-planned` avec son libellé et le
nombre de pages qui la portent. Une cible « (prévu) » n'a pas de `href`.
