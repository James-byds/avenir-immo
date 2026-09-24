# Avenir Immobilier — site Astro

Agence immobilière de prestige, Charleroi. Astro 7 + Tailwind 4 + îles React 19
(versions réelles : `package.json`, qui fait foi).
Site public : accueil, liste des biens, fiche bien, pages de localité, blog,
équipe, auteurs, avis, contact, pages légales.

## À lire avant de coder

Ce fichier est chargé automatiquement ; les documents suivants ne le sont pas.
**Ouvre-les selon la tâche :**

- `docs/ds/architecture.md` — pourquoi on ne réécrit pas `site.css` en Tailwind,
  comment fonctionne le pont `@theme inline`. **À lire avant toute intervention
  sur les styles ou la configuration.**
- `docs/ds/composants.md` — inventaire des 29 composants du design system,
  leurs props, et lesquels sont des îles React. **À lire avant de créer ou
  porter un composant.**
- `docs/ds/arborescence.md` — où va quoi dans le dépôt.
- `src/styles/ds/site/site.css` — la source de vérité des classes disponibles.
  **À parcourir avant d'écrire la moindre classe utilitaire de style.**

## Le design system est la source de vérité

`src/styles/ds/` est une **copie** du design system Avenir Immobilier.
**Ne jamais y éditer quoi que ce soit** : toute retouche de tokens, de
`site.css` ou de composant se fait dans le design system, puis `./sync-ds.sh`.
Une correction faite ici serait écrasée à la synchro suivante.

Ce qui vit dans ce dépôt : les **pages**, leur contenu, leur assemblage.
Ce qui vit dans le design system : tokens, `site.css`, composants, `script.js`, assets.

## Règles de style — non négociables

**Les classes du DS portent le style ; Tailwind pose la mise en page.**

```html
<!-- oui -->
<div class="grid gap-4 md:grid-cols-3">
  <article class="card">…</article>
</div>

<!-- non : redécide un style déjà validé -->
<article class="rounded-2xl bg-white shadow-sm p-6">…</article>
```

Avant d'écrire une classe utilitaire de couleur, rayon, ombre ou typo, chercher
la classe DS correspondante dans `src/styles/ds/site/site.css`. Il y en a presque
toujours une : `.btn`, `.card`, `.toolbar`, `.faq-list`, `.sec--tint`, `.page-head--band`…

### Les cinq pièges qui reviennent

1. **Alternance des fonds.** Jamais deux `<section>` de même fond consécutives.
   Utiliser `.sec--white` / `.sec--tint` / `.sec--ink`, et `.sec--cont` pour une
   section qui prolonge la précédente. **Ne jamais écrire de fond en `style=` ni
   en `bg-*` ad hoc sur une section.**
2. **`--green-l` ne porte jamais de blanc** (2,9:1). Sur aplat vert clair, texte
   encre : `bg-green-l text-ink`, jamais `text-white`.
3. **Petits textes sur fond teinté.** Sous 12 px sur `--green-soft`/`--green-tint`,
   minimum `text-ink-soft` — `text-ink-mute` tombe à 4,06:1.
4. **Teinté sur teinté.** Une carte `bg-green-tint` dans une section `.sec--tint`
   est invisible : la repasser en `bg-white border border-line`.
5. **Surface sombre faite main → `.on-dark`.** Sinon `.btn--ghost` y reste blanc
   plein et double le CTA.

### Couleurs

Trois couleurs de charte, avec références CMJN : vert foncé `--green` #17413B
(primaire, CTA, liens), vert clair `--green-l` #00A678 (aplats, pastilles, traits),
jaune `--yellow` #EDE300 (signal, **sur fond sombre ou vert profond uniquement**).
Les fonds sombres valent `--ink-bg` #0E2B27 = le vert foncé de la charte :
**aucun noir ni gris foncé nulle part**, y compris sur les boutons.

Les valeurs #027F01 / #FFED01 sont antérieures à la charte de septembre 2026 —
ne plus les utiliser.

### Typographie

Une seule famille : **Acumin Variable** (fonte variable, axes wght + wdth).
Display = `.display` ou `font-display font-stretch-wide` ; corps 17 px/1.6 ;
méta = `--mono` en capitales espacées (même famille, tracking large).

## Composants

Port `.astro` par défaut (zéro JS). Îles React réservées à : `Faq`, `ShareBar`,
`ContactForm`, `DropdownMenu` — en `client:visible`, **jamais `client:only`**
(le HTML doit être pré-rendu pour l'indexation).

Voir `docs/ds/composants.md` pour l'inventaire et les props.

## SEO

- Réponses de FAQ **présentes dans le HTML**, masquées par `max-height` — jamais
  montées au clic.
- Une ancre par question (`#faq-…`), qui ouvre la bonne réponse au chargement.
- JSON-LD `FAQPage` émis depuis la page, reprenant **mot pour mot** le texte affiché.
- `LocalityLinks variant="widen"` : ancres **descriptives** (« Maisons à vendre à
  Loverval »), pas le seul nom de commune.
- Pages de localité : contenu **réellement local** (droits d'enregistrement wallons,
  délais constatés dans l'entité, écoles, accès). Un texte recopié de commune en
  commune est du contenu dupliqué et nuit au référencement.
- Ne jamais lier une combinaison commune × type sans bien : omettre le lien.

## Ton et copie

Vouvoiement, français de Belgique, pas d'emoji. Phrases courtes, affirmatives,
chiffrées quand c'est possible. Tout chiffre affiché porte une **source datée**
(« Données internes Avenir · au 31 août 2026 ») — sinon on retire le chiffre,
on ne l'invente pas et on ne l'arrondit pas.

Mention légale obligatoire dès qu'une mensualité de crédit est affichée :
« Attention, emprunter de l'argent coûte aussi de l'argent », plus
« Avenir Immobilier n'est pas intermédiaire en crédit hypothécaire ».

## Assets

Logo et signe V fournis par le client (`public/assets/`) — **jamais redessinés,
recolorés ni recomposés**. Sur fond vert ou sombre, utiliser `signe-v-128-blanc.png`.
Les images de biens sont des placeholders `.ph` en attendant les visuels de
l'agence : remplacer le `.ph` par un `<img>` au même endroit, rien d'autre.
