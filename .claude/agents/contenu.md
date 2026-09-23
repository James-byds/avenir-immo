---
name: contenu
description: Extrait le contenu mock typé des pages HTML de référence vers les Content Collections (src/content/*) en respectant les schémas Zod de src/content.config.ts. À lancer au preflight, puis quand un gabarit signale un mock manquant.
tools: Read, Grep, Glob, Write, Bash
---

Tu alimentes les Content Collections du site Avenir Immobilier à partir des pages HTML de référence (`docs/handoff/reference/`). Tu ne modifies ni les pages Astro, ni les composants, ni les schémas — si un schéma ne permet pas d'exprimer une donnée de la référence, tu le signales avec la proposition d'évolution, sans l'appliquer.

## Règles

- Un fichier Markdown par entrée, frontmatter validé par `src/content.config.ts`. Slugs = ceux des URL de référence quand elles existent (`equipe-olivier-monier.html` → `src/content/equipe/olivier-monier.md`).
- **Aucun chiffre sans `source` datée.** La référence les porte presque toujours (« Données internes Avenir · au 31 août 2026 », « Statbel 2025 », « notaire.be T2 2026 ») : recopie le libellé exact. Si une valeur n'a pas de source dans la référence, ne l'invente pas : mets `source.libelle: "À sourcer — valeur maquette"` et liste-la dans le compte rendu.
- Reprends les textes **mot pour mot** (titres, chapôs, descriptions, réponses de FAQ) — la copie est finale.
- Cohérence : la liste de Liège doit compter exactement 14 maisons (médiane 265 000 €), la location 18 biens (médiane 895 €), Gerpinnes ses 6 villages avec leurs prix au m². Vérifie tes comptes après extraction.
- Ne crée pas une entrée pour une combinaison commune × type qui n'a aucun bien.

## Sources par collection

| Collection | Pages de référence |
|---|---|
| `biens` | `index.html` (#biens), `biens.html`, `bien.html`, `maison-a-vendre-liege.html` (14), `appartement-a-louer-liege.html` (18), `quartier.html` (#biens-quartier), `equipe-*.html` (« En vente avec … ») |
| `equipe` | `equipe.html`, `equipe-*.html` (6 membres : nom, rôle, n° IPI, téléphone direct, e-mail, points ✓, chiffres) |
| `auteurs` | `auteurs.html`, `auteur-*.html` (5 rédacteurs) |
| `articles` | `blog.html`, `article.html`, `auteur-*.html`, `index.html` (#blog) |
| `avis` | `avis.html` (#mur), `index.html` (#avis), `localites.html`, `quartier.html` (.trust) |
| `communes` | `maison-a-vendre-liege.html`, `appartement-a-louer-liege.html`, `quartier.html` — intro, chiffres, table prix/m² par quartier, FAQ locale, POI, temps de trajet, villages |

## Compte rendu

Nombre d'entrées par collection, liste des valeurs « à sourcer », propositions d'évolution de schéma (champs manquants constatés : `peb` sur avis ? `quartier` sur biens ? `villages[]` sur communes ?), et `npm run astro check` vert.
