# 07 — Estimation (`/estimation`)

**Référence** : `docs/handoff/reference/estimation.html` (588 mots — page courte, tout est dans le formulaire).

---

Monte `src/pages/estimation.astro` sur `PageLayout solid`.

## Sections

1. `PageHead` (plain, blanc, `padding-bottom:0` → prop `tight` sur `PageHead` plutôt qu'un `style=`) — `Breadcrumb`, éyebrow « Estimation gratuite », **pas de H1 dans la référence** : c'est un trou de hiérarchie à corriger — le H2 « Combien vaut votre bien ? » de la section suivante devient le H1 de la page (même texte, même style `.estimate h2` : ajoute la règle `.estimate h1` dans `local.css` sous « à reprendre »).
2. `#estimation .estimate` (encre) — `.est-grid` : colonne copy (`.est-copy`, `strong` en jaune) + panneau `#estForm` 3 étapes (progress `.ep`, `.step[data-step]`, `#typeChoice` `ChoiceRow` Maison/Appartement/Villa/Terrain, `#cp`, `#surf`, `#rooms` `Select`, validation `.err`, fourchette instantanée `.est-done .ed-range` arrondie à 5 000 €, coordonnées, consentement). Toute la logique est dans `ds-script.js` (`/* Estimation multi-step form */`) — réutilise les mêmes `id`. Pas de `style="margin-top"` : si l'espacement est nécessaire, classe `.estimate--page` dans `local.css`.
3. `.sec--white` — « De la fourchette en ligne au prix juste » — `.steps` (variante 4 cartes du process, `.step .st-no`), pas la frise.
4. `#faq .sec--tint` — « Avant de vous lancer » — `Faq` (île, `structuredData={false}`) + JSON-LD `FAQPage` ; aside sans carte.

Alternance : blanc (head) → encre → blanc → tendre.

## Head

Title/description de la référence, canonical `/estimation` ; JSON-LD `FAQPage` + `BreadcrumbList`.

## Livrable

`src/pages/estimation.astro`, `components/forms/EstimateForm.astro` (balisage + `id`s ; comportement = `ds-script.js`), `components/surfaces/Steps.astro`. Aucun contenu de collection.

Recette : `/estimation` contre `estimation.html` ; parcourir les 3 étapes, provoquer une erreur de validation, vérifier la fourchette.
