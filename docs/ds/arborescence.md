# Arborescence cible du dépôt Astro

## Avant l'étape 1 — le dossier de départ

```
mon-projet/
├── handoff-astro/        ← ce dossier, décompressé
└── design-system/        ← l'export du DS, décompressé
```

Claude Code s'ouvre ici. Rien d'autre.

## Après l'étape 2 — où passe le handoff

Le handoff se **dissout** : ses fichiers exécutables rejoignent leur
emplacement de travail, ses documents de référence passent dans `docs/ds/`,
et le dossier `handoff-astro/` disparaît.

| Fichier du handoff | Devient |
|---|---|
| `CLAUDE.md` | `CLAUDE.md` (racine) — **chargé automatiquement à chaque session** |
| `sync-ds.sh` | `sync-ds.sh` (racine) |
| `theme.css`, `app.css` | `src/styles/` |
| `fonts.astro.css` | `src/styles/ds/tokens/fonts.css` |
| `BaseLayout.astro` | `src/layouts/` |
| `examples/*.astro` | `src/components/` (Button, PropertyCard) |
| `README.md` | `docs/ds/architecture.md` |
| `ARBORESCENCE.md` | `docs/ds/arborescence.md` |
| `component-map.md` | `docs/ds/composants.md` |
| `DEMARRAGE.md` | `docs/ds/demarrage.md` (archive) |

**`design-system/`** sort du dépôt, ou reste à côté en `.gitignore` :
`sync-ds.sh` prend son chemin en argument, il n'a pas besoin d'être versionné.
Le garder à la racine du dépôt reviendrait à versionner deux fois le même CSS.

### Pourquoi `docs/ds/` et pas la racine

Claude Code charge `CLAUDE.md` tout seul, mais **rien d'autre**. Les trois
documents de référence doivent donc être *appelés* depuis `CLAUDE.md` — c'est
fait, il ouvre sur leurs chemins. Les laisser dans un `handoff-astro/` à la
racine marcherait aussi, mais le nom ne dit plus rien six mois plus tard : un
dépôt ne se lit pas comme une passation, il se lit comme un projet.

## Arborescence complète

```
avenir-web/
├── CLAUDE.md                        # instructions permanentes — chargé auto
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── sync-ds.sh                       # resynchronise src/styles/ds/ depuis le DS
│
├── docs/
│   └── ds/                          # référence du design system
│       ├── architecture.md          # ex-README du handoff — la décision Tailwind
│       ├── arborescence.md          # ce document
│       ├── composants.md            # inventaire + props + astro/island
│       └── demarrage.md             # archive du prompt initial
│
├── public/                          # servi tel quel, jamais transformé
│   ├── ds-script.js                 # ⟲ copie de script.js du DS
│   ├── favicon-32.png
│   ├── favicon-180.png
│   ├── favicon-512.png
│   ├── robots.txt
│   ├── fonts/
│   │   ├── AcuminVariable.woff2     # version convertie (production)
│   │   └── AcuminVariableConcept.otf# ⟲ source du DS, repli
│   └── assets/                      # ⟲ copies du DS
│       ├── logo-lavenir-immobilier.png
│       ├── logo-lavenir-immobilier-blanc.png
│       ├── logo-lavenir-immobilier-jaune.png
│       ├── logo-lavenir-immobilier-vert.png
│       ├── signe-v.png
│       ├── signe-v-128.png
│       └── signe-v-128-blanc.png
│
├── src/
│   ├── styles/
│   │   ├── app.css                  # point d'entrée : tailwind → ds → theme
│   │   ├── theme.css                # pont @theme inline
│   │   └── ds/                      # ⟲ NE JAMAIS ÉDITER — écrasé par sync-ds.sh
│   │       ├── styles.css
│   │       ├── tokens/
│   │       │   ├── fonts.css        # ✎ exception : version Astro (/fonts/…)
│   │       │   ├── colors.css
│   │       │   ├── typography.css
│   │       │   ├── spacing.css
│   │       │   └── effects.css
│   │       └── site/
│   │           └── site.css
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro         # head, fontes, favicons, ds-script
│   │   ├── PageLayout.astro         # BaseLayout + header + footer
│   │   ├── ArticleLayout.astro      # page article : en-tête, partage, auteur
│   │   └── LegalLayout.astro        # switcher + sommaire sticky + prose
│   │
│   ├── components/
│   │   ├── core/
│   │   │   ├── Eyebrow.astro
│   │   │   ├── LinkArrow.astro
│   │   │   ├── Breadcrumb.astro
│   │   │   ├── Pagination.astro
│   │   │   ├── Placeholder.astro
│   │   │   └── LocalityLinks.astro
│   │   ├── actions/
│   │   │   └── Button.astro
│   │   ├── forms/
│   │   │   ├── Input.astro
│   │   │   ├── Select.astro
│   │   │   ├── ChoiceRow.astro
│   │   │   └── Seg.astro
│   │   ├── surfaces/
│   │   │   ├── Badge.astro
│   │   │   ├── PropertyCard.astro
│   │   │   ├── SpecGrid.astro
│   │   │   ├── PebScale.astro
│   │   │   ├── AgentCard.astro
│   │   │   ├── AgencyCard.astro
│   │   │   ├── MemberHero.astro
│   │   │   ├── Byline.astro
│   │   │   ├── AuthorBox.astro
│   │   │   ├── AuthorHero.astro
│   │   │   ├── ArticleHeader.astro
│   │   │   ├── ArticleCard.astro
│   │   │   ├── TrustSection.astro
│   │   │   └── SellHere.astro
│   │   ├── islands/                 # les 4 seuls composants React
│   │   │   ├── Faq.tsx              # client:visible
│   │   │   ├── ShareBar.tsx         # client:visible
│   │   │   ├── ContactForm.tsx      # client:visible
│   │   │   └── DropdownMenu.tsx     # en dernier recours : préférer <select>
│   │   └── chrome/
│   │       ├── SiteHeader.astro     # .header--solid sur pages intérieures
│   │       ├── SiteFooter.astro
│   │       └── PageHead.astro       # variantes band / ink / tint
│   │
│   ├── content/                     # Content Collections (contenu éditorial)
│   │   ├── config.ts                # schémas Zod
│   │   ├── biens/*.md
│   │   ├── articles/*.md
│   │   ├── auteurs/*.md
│   │   ├── equipe/*.md
│   │   ├── communes/*.md            # 1 fichier par localité — chiffres + FAQ locale
│   │   └── avis/*.md
│   │
│   ├── lib/
│   │   ├── seo.ts                   # JSON-LD : FAQPage, RealEstateListing, Organization
│   │   ├── format.ts                # prix, surfaces, dates fr-BE
│   │   └── maillage.ts              # combinaisons commune × type, comptages
│   │
│   └── pages/
│       ├── index.astro
│       ├── contact.astro
│       ├── estimation.astro
│       ├── avis.astro
│       ├── biens/
│       │   ├── index.astro          # liste + toolbar + pagination
│       │   └── [slug].astro         # fiche bien
│       ├── equipe/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── blog/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── auteurs/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── [type]-a-[transaction]-[commune].astro   # pages de localité
│       ├── legal/
│       │   ├── mentions.astro
│       │   ├── confidentialite.astro
│       │   ├── cookies.astro
│       │   └── honoraires.astro
│       ├── 404.astro
│       └── sitemap.xml.ts
│
└── dist/                            # build, non versionné
```

## Points de vigilance

**`src/styles/ds/` est en lecture seule.** Une seule exception, `tokens/fonts.css`,
dont la version Astro pointe vers `/fonts/` — `sync-ds.sh` ne la recopie
volontairement pas. Tout le reste est écrasé à chaque synchro : une correction de
style se fait dans le design system, jamais ici.

**`components/islands/` doit rester à quatre fichiers.** C'est le budget JavaScript
du site. Chaque composant ajouté là doit se justifier par un état que le HTML seul
ne peut pas porter. `DropdownMenu` y figure par prudence, mais le `<select>` natif
enhancé par `ds-script.js` est préférable.

**Les pages de localité sont une route dynamique unique**, alimentée par
`content/communes/`. Un fichier Markdown par commune, avec ses chiffres datés et sa
FAQ propre — c'est ce qui empêche le contenu dupliqué. `lib/maillage.ts` calcule les
combinaisons et leurs comptages, et n'émet jamais de lien vers une combinaison vide.

**`content/` plutôt que des données en dur.** Les schémas Zod de `config.ts` rendent
obligatoires les champs que le design system exige : la `source` datée de tout chiffre
affiché, la mention légale des mensualités de crédit, l'ancre descriptive des liens
de maillage. Une omission casse le build plutôt que d'atteindre la production.

**Nommage des routes de localité.** Le motif `[type]-a-[transaction]-[commune]`
produit `/maison-a-vendre-gerpinnes`, `/appartement-a-louer-charleroi`. À figer avant
la première mise en ligne : ces URL sont ce que le référencement capitalise, les
changer ensuite coûte des redirections.
