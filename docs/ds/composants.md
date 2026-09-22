# Inventaire des composants — DS → Astro

29 composants exposés par le design system. Colonne **Port** : `astro` = port
statique, zéro JS ; `island` = île React `client:visible`.

Source de vérité des props : le `.d.ts` de chaque composant, et son
`.prompt.md` pour les règles d'usage. Ce tableau est un index, pas un contrat.

## core/

| Composant | Port | Props clés | Notes |
|---|---|---|---|
| `Eyebrow` | astro | `center` | Filet + capitales espacées. Vert sur clair, jaune sur sombre (automatique). |
| `LinkArrow` | astro | `href` | Lien fléché mono. |
| `Breadcrumb` | astro | `items[]` | `.breadcrumb` ; s'inverse sur `.page-head--band/--ink`. |
| `Pagination` | astro | `page`, `pages`, `hrefFor` | Puces rondes ; le « suivant » est une puce `→`, **pas** un bouton libellé. |
| `Placeholder` | astro | `green`, `tag`, `ratio` | Emplacement photo. À remplacer par `<img>` quand les visuels arrivent. |
| `LocalityLinks` | astro | `variant` widen\|mesh, `links[]`, `groups[]` | `widen` : ancres **descriptives**, affiché sous ~12 résultats, `null` si vide. `mesh` : groupé par intention. |

## actions/

| Composant | Port | Props clés | Notes |
|---|---|---|---|
| `Button` | astro | `variant`, `block`, `arrow`, `href` | Défaut = aplat vert clair, texte encre. `deep` quand le vert clair est pris. `dark`/`brass` = alias de `deep`. |
| `ShareBar` | **island** | `variant` row\|sticky, `url`, `title`, `networks[]` | Presse-papier + état « ✓ Lien copié ». Icônes en masque CSS sur SVG Font Awesome (CDN). `sticky` redevient `row` sous 960 px. |

## forms/

| Composant | Port | Props clés | Notes |
|---|---|---|---|
| `Input` | astro | `label`, `placeholder`, `type` | `.field` |
| `Select` | astro | `label`, `options[]` | `<select>` natif ; `script.js` l'enhance. |
| `ChoiceRow` | astro | `options[]`, `value` | Pilules `.choice`, 2 par ligne. |
| `Seg` | astro | `options[]` (avec compteurs), `value` | Filtres segmentés `.seg`. |
| `DropdownMenu` | astro + `script.js` | — | Préférer le `<select>` enhancé à une île React. |
| `ContactForm` | **island** | `tone` light\|ink, `subjects[]`, `coordinates[]`, `splitName` | `ink` = bande encre + coordonnées jaunes. Consentement RGPD obligatoire. |

## surfaces/

| Composant | Port | Props clés | Notes |
|---|---|---|---|
| `Badge` | astro | `floating`, `variant` | |
| `PropertyCard` | astro | `variant` overlay\|horizontal, `price`, `suffix`, `location`, `title`, `specs[]`, `badge` | Variantes **contextuelles**, jamais liées au device. `overlay` jamais en grille dense. |
| `SpecGrid` | astro | `items[]` | Caractéristiques de la fiche bien. |
| `PebScale` | astro | `value` (A→G) | Échelle PEB wallonne. |
| `AgentCard` | astro | `name`, `role`, `phone`, `photo` | Conseiller **associé à un bien**. |
| `AgencyCard` | astro | `media` photo\|map, `rows[]`, `phone`, `zones[]` | **Une seule agence** : la couverture passe par `zones` (pilules vers les pages de localité = maillage interne). |
| `MemberHero` | astro | `name`, `role`, `stats[]` | En-tête de profil. |
| `Byline` | astro | `name`, `role`, `small`, `href` | Auteur d'article — **distinct des agents**. |
| `AuthorBox` | astro | `name`, `bio`, `href` | « À propos de l'auteur ». Max 1, après le corps. |
| `AuthorHero` | astro | `name`, `role`, `meta`, `actions` | En-tête de page auteur. Jamais de biens. |
| `ArticleHeader` | astro | `size` large\|compact, `category`, `date`, `lede`, `author`, `readTime`, `showMedia` | Filet vert sous la signature. |
| `ArticleCard` | astro | `variant` feature\|compact, `tint`, `thumb` | `feature` : **une seule par écran**. |
| `TrustSection` | astro | `variant` band, `reviews[]`, `score` | Panneau de synthèse en aplat vert profond, note et barres jaunes. |
| `SellHere` | astro | `variant` band\|compact, `headline`, `rows[]`, `source` | Seconde intention de la page de localité : le **propriétaire**. `source` datée obligatoire. |
| `Faq` | **island** | `items[]`, `openIndex`, `single`, `idPrefix`, `structuredData` | Émettre le JSON-LD depuis la page et passer `structuredData={false}`. `idPrefix` distinct si deux FAQ coexistent. |

## Pas encore dans le DS

- **Simulateur de crédit** — exploration en cours (`explorations/Exploration
  simulateur de credit v4.html`). Deux formats retenus : bande horizontale (page
  de localité, montant pré-réglé sur le prix médian communal) et widget de colonne
  (fiche bien, pré-rempli au prix du bien). Poignées de curseur portant le signe V
  blanc sur disque vert profond. Mention légale crédit obligatoire.
  → ne pas porter avant que le composant soit figé dans le DS.
