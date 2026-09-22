# Prompt de démarrage — Claude Code

Copiez tout le bloc ci-dessous dans un dossier vide, après y avoir déposé
`handoff-astro/` et l'export du design system.

---

## Préparation (2 minutes, avant d'ouvrir Claude Code)

Dans votre dossier vide :

```
mon-projet/
  handoff-astro/          ← le zip de ce handoff, décompressé
  design-system/          ← l'export complet du DS, décompressé
```

L'export du design system s'obtient depuis le projet Design System
(bouton de téléchargement du projet entier) : renommez le dossier décompressé
en `design-system/`. Il doit contenir au minimum `styles.css`, `tokens/`,
`site/`, `script.js`, `assets/`. Procédure détaillée et piège à éviter :
**`handoff-astro/EXPORT-DS.md`**.

Puis `claude` dans `mon-projet/`.

---

## Le prompt

> Je démarre un site vitrine pour **Avenir Immobilier**, agence immobilière
> de prestige à Charleroi (Belgique). Stack imposée : **Astro 5 + Tailwind 4**.
> Le site sera en français de Belgique.
>
> Le dossier est vide à part deux choses :
>
> - `handoff-astro/` — le dossier de passation du design system. **Lis
>   `handoff-astro/README.md` en entier avant toute action**, puis
>   `handoff-astro/CLAUDE.md`, `handoff-astro/ARBORESCENCE.md` et
>   `handoff-astro/component-map.md`.
> - `design-system/` — l'export du design system Avenir Immobilier
>   (tokens, `site/site.css`, `script.js`, `assets/`, composants React de
>   référence, `readme.md`). S'il est absent, ne devine pas : dis-le-moi,
>   je dois le déposer à côté de `handoff-astro/`.
>
> Point d'architecture à respecter absolument, il est expliqué dans le
> README : **on ne réécrit pas `site.css` en classes Tailwind.** Les classes
> du design system portent les composants, Tailwind ne sert qu'à la mise en
> page. Les tokens sont exposés à Tailwind via `@theme inline` pour que les
> deux systèmes ne divergent jamais.
>
> Ta mission, dans cet ordre, en t'arrêtant après chaque étape pour me montrer
> le résultat :
>
> 1. **Échafaudage.** Initialise le projet Astro 5 (TypeScript strict,
>    template minimal) avec `tailwindcss` + `@tailwindcss/vite` —
>    surtout pas `@astrojs/tailwind`, qui cible Tailwind 3. Mets en place
>    l'arborescence décrite dans le README.
>
> 2. **Intégration du design system.** Copie les fichiers listés au §3 du
>    README vers `src/styles/ds/` et `public/`, installe `theme.css`,
>    `app.css`, `fonts.astro.css`, `BaseLayout.astro`, `sync-ds.sh` et
>    `CLAUDE.md` à leurs emplacements. Ne modifie jamais le contenu de
>    `src/styles/ds/`.
>
>    Puis **dissous le dossier `handoff-astro/`** selon le tableau en tête de
>    `ARBORESCENCE.md` : les documents de référence passent dans `docs/ds/`,
>    `CLAUDE.md` et `sync-ds.sh` à la racine, et `handoff-astro/` disparaît.
>    Sors `design-system/` du dépôt ou ajoute-le au `.gitignore` — `sync-ds.sh`
>    prend son chemin en argument, il n'a pas à être versionné.
>
> 3. **Validation du pont.** Crée une page `/_test` qui affiche : les trois
>    couleurs de charte en aplats, les trois variantes de `Button`, une
>    `PropertyCard`, et un titre en `.display`. Puis lance `npm run build` et
>    **vérifie que `#17413B` n'apparaît dans `dist/` que dans les tokens,
>    jamais dans un utilitaire compilé** — si `bg-green` a copié la valeur au
>    lieu de référencer `var(--green)`, `@theme inline` est cassé et il faut
>    le corriger avant d'aller plus loin. Montre-moi la page et le résultat
>    de cette vérification.
>
> 4. **Ports de composants.** Porte en `.astro` les composants de la colonne
>    « astro » du `docs/ds/composants.md`, en suivant exactement le modèle des
>    deux exemples fournis. Les quatre composants interactifs (`Faq`,
>    `ShareBar`, `ContactForm`, `DropdownMenu`) restent des îles React en
>    `client:visible`. Commence par les dix plus utilisés et montre-les-moi
>    avant de continuer.
>
> 5. **Première page réelle.** L'accueil, composée uniquement de classes du
>    design system et de grilles Tailwind, en respectant l'alternance des
>    fonds (`.sec--white` / `.sec--tint` / `.sec--ink`, jamais deux sections
>    de même fond qui se suivent).
>
> Contraintes permanentes, valables pour tout ce que tu écriras ensuite :
> les cinq règles d'adhérence du `CLAUDE.md` (alternance des fonds, jamais de
> blanc sur `--green-l`, `--ink-soft` minimum pour les petits textes sur fond
> teinté, pas de surface teintée sur surface teintée, `.on-dark` sur les
> surfaces sombres faites main).
>
> Avant de commencer, dis-moi ce que tu as compris de l'architecture et
> signale-moi tout ce qui te paraît manquer ou ambigu dans le handoff.

---

## Ce qui va se passer

L'étape 3 est le vrai point de contrôle : si `bg-green` compile en `#17413B`
au lieu de `var(--green)`, tout le bénéfice de la synchronisation est perdu et
ça ne se verra pas à l'œil. Ne laissez pas Claude passer à l'étape 4 sans avoir
vu ce contrôle.

L'étape 4 est longue : 25 composants. Il est normal de la mener en plusieurs
sessions — `CLAUDE.md` étant à la racine, le contexte est rechargé à chaque fois.

## Après le premier build

Deux choses que le handoff ne peut pas faire à votre place :

- **Convertir la fonte en woff2** (§3 du README). L'OTF variable fonctionne
  mais pèse lourd au premier rendu. Conserver les axes `wght` **et** `wdth`.
- **Les photos.** Tout le site est en placeholders `.ph` en attendant les
  visuels de l'agence. Le remplacement est mécanique (un `<img>` au même
  endroit) mais c'est ce qui donnera au site son aspect définitif.

## Si vous repartez du dépôt plus tard

Pour resynchroniser après une évolution du design system :

> Le design system a évolué. Relance `./sync-ds.sh /chemin/vers/le/nouvel/export`,
> puis dis-moi ce qui a changé dans `src/styles/ds/` (git diff) et si des pages
> ou des composants portés sont impactés.
