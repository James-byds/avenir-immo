# 00 — Preflight : inventaire, synchro DS, chrome, collections

> Coller tel quel dans Claude Code, à la racine de `avenir-immo`. Le dossier `docs/handoff/reference/` est la copie de `reference/` du handoff, servi sur `http://localhost:3000`.

---

Je reprends l'intégration du site **Avenir Immobilier** (Astro 5 + Tailwind 4). Le design est fini : 27 pages HTML de référence dans `docs/handoff/reference/` (index dans `README.html`, plan de montage de chaque page dans `squelettes-pages.md`). Ta mission dans cette session : préparer le dépôt pour que des sous-agents puissent ensuite monter les gabarits en parallèle. Tu t'arrêtes après chaque étape pour me montrer le résultat.

Lis d'abord `AGENTS.md`, `docs/ds/architecture.md`, `docs/ds/composants.md`, `docs/ds/arborescence.md`, puis `docs/handoff/reference/handoff-rythme-visuel.md` (le parti de rythme des fonds — il conditionne toutes les pages).

## 1. Inventaire réel

`main` ne contient aucun `.astro` ni contenu dans `src/content/`. Dis-moi ce qui existe réellement dans le dossier de travail (layouts, header/footer, accueil partiel, branches non poussées). Liste ce qui est réutilisable et ce qui contredit `AGENTS.md`. Ne supprime rien sans me le proposer.

## 2. Synchronisation du design system

```bash
./sync-ds.sh docs/handoff/reference/ds-export
git diff --stat src/styles/ds/ public/
```

Résume ce qui a changé (attendu : `site/site.css` gagne les utilitaires `.sec--*`, `.page-head--band/--ink/--tint`, `.sell-compact`, `.ll-*`, `.q-*`, `.brand-logo`). Vérifie que `src/styles/ds/tokens/fonts.css` est resté la version Astro (`/fonts/…`).

## 3. Écarts locaux

Copie `repo/src/styles/local.css` du handoff (version adaptée : sans `@font-face`, chemins `/assets/…`) vers `src/styles/local.css` et modifie `src/styles/app.css` :

```css
@import "tailwindcss";
@import "./ds/styles.css";
@import "./local.css";    /* écarts maquette en attente de reprise DS */
@import "./theme.css";
```

`local.css` contient 139 classes utilisées par les pages et absentes du DS (états de la liste `.sk-*`/`.empty*`, `.vil-*`, `.guide-pt`, `.proofs`, `.fc-panel`, `.member--contact`, `.sim-*`, `[hidden]{display:none!important}`…). Règle : **on n'y ajoute rien sans un titre de bloc « à reprendre dans le DS »**, on n'y réécrit rien. Vérifie que `--sim-thumb` pointe bien sur `/assets/signe-v-128-blanc.png` et que le fichier est dans `public/assets/`.

Copie aussi `docs/handoff/reference/assets/{agent-*.png,portrait-*.png,picto-*.png,conseiller-cta.png,equipe-avenir.png,signe-v-blanc.png}` vers `public/assets/` (portraits d'agents, pictos de la section preuves, portrait du CTA final, filigrane du pied de page).

Porte de contrôle : `npm run build` ; `grep -c "sk-card" dist/_astro/*.css` > 0 ; `grep -rl "#17413B" dist/` ne renvoie que le CSS des tokens.

## 4. Chrome partagé

Construis, en lisant `docs/handoff/reference/index.html` (header transparent sur héros) et `biens.html` (header plein `.header--solid`) :

- `src/layouts/BaseLayout.astro` — `<html lang="fr">`, favicons (`/favicon-32.png`, `/favicon-180.png`, `/favicon-512.png`), fonte, `app.css`, `/ds-script.js` en `defer`, slot `head` pour title/description/canonical/JSON-LD, JSON-LD `organization()` de `lib/seo.ts`.
- `src/components/chrome/TopBar.astro` — `.utility` + `.u-nav` (sous-nav secondaire) + `.u-social` (recopier la structure exacte de `index.html`).
- `src/components/chrome/SiteHeader.astro` — `.header` avec prop `solid` (→ `.header--solid`), logo officiel en deux versions superposées `.brand-logo--ink` / `.brand-logo--rev` (bascule au scroll gérée par `ds-script.js`), `.nav-links` (Nos biens · Quartiers → `/communes` · Estimation · L'agence · Blog · Contact), bouton `#burger`, drawer `#drawer` (`aria-hidden`, fermé au clic). Le CTA du header est un `.btn` (vert clair, texte encre).
- `src/components/chrome/SiteFooter.astro` — `.footer` : filigrane `.f-mark` (`/assets/signe-v-blanc.png`, version blanche pleine résolution, jamais la couleur), colonnes dont **« Quartiers »** (liens = combinaisons réelles calculées par `lib/maillage.ts` + « Toutes nos communes » → `/communes`), newsletter `#newsForm`, `.f-social` (masques CSS sur SVG Font Awesome, comme la référence), mentions légales → `/legal/*`.
- `src/components/chrome/PageHead.astro` — en-tête de page intérieure, prop `variant: "plain" | "band" | "ink" | "tint"` (→ `.page-head`, `.page-head--band` avec `<div class="ph pb-photo">` en premier enfant, `--ink`, `--tint`), slots `breadcrumb`, défaut, `aside` (pour la bascule « vous cherchez à louer ? » alignée à droite du fil d'Ariane sur les localités).
- `src/layouts/PageLayout.astro` — BaseLayout + TopBar + SiteHeader + `<main>` + SiteFooter, props `solid`, `title`, `description`, `canonical`.

Aucune couleur en dur ; classes DS uniquement ; Tailwind pour la grille du footer si `site.css` ne la porte pas déjà (vérifie `.footer-top`).

## 5. Composants de base (ports `.astro`)

Porte, dans `src/components/{core,actions,forms,surfaces}/`, les composants « astro » de `docs/ds/composants.md` **qui n'existent pas encore** — en priorité ceux dont toutes les pages ont besoin : `Eyebrow`, `Button`, `LinkArrow`, `Breadcrumb`, `Placeholder`, `Badge`, `PropertyCard` (3 variantes + `.card-peb` de `local.css`), `Pagination`, `Seg`, `Input`, `Select`, `SectionHead` (`.section-head` : eyebrow + h2 + p, prop `align`). Un fichier = une enveloppe de classes, aucune valeur inventée. Les autres composants seront créés par les gabarits qui en ont besoin.

## 6. Contenu mock

Lance le sous-agent `contenu` (`.claude/agents/contenu.md`) pour remplir `src/content/{biens,equipe,auteurs,articles,avis,communes}` depuis les pages de référence. Contraintes : Liège vente = 14 maisons (médiane 265 000 €), Liège location = 18 biens (médiane 895 €), Gerpinnes = 6 villages avec prix/m², 6 membres d'équipe, 5 auteurs, source datée sur chaque chiffre. S'il signale des champs manquants dans les schémas (`quartier` sur biens, `villages[]`/`prixQuartiers[]`/`poi[]`/`trajets[]` sur communes, `ipi`/`points[]`/`stats[]` sur equipe, `categorie`/`tempsLecture` sur articles, `photos` sur avis), propose-moi les évolutions de `src/content.config.ts` — je valide avant application.

## 7. Compte rendu

Liste : fichiers créés, composants portés, entrées de contenu par collection, évolutions de schéma appliquées, et **ce qui reste à trancher**. Puis on passe à `prompts/01-accueil.md`.

## Livrable (périmètre autorisé)

`src/styles/{app,local}.css`, `src/styles/ds/**` (via sync uniquement), `public/assets/**`, `src/layouts/**`, `src/components/chrome/**`, `src/components/{core,actions,forms,surfaces}/**`, `src/content/**`, `src/content.config.ts` (après validation), `.claude/agents/**`.
