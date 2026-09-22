# Obtenir l'export du design system

`sync-ds.sh` a besoin d'un dossier contenant l'instantané du design system.
Voici comment l'obtenir, et une erreur à ne pas commettre.

## Comment l'obtenir

Depuis le projet **Avenir Immobilier Design System**, téléchargez le projet
entier, puis renommez le dossier décompressé en `design-system/`.

Il doit contenir au minimum :

```
design-system/
├── styles.css            # point d'entrée — uniquement des @import
├── tokens/               # fonts, colors, typography, spacing, effects
├── site/site.css         # 1 930 lignes : reset, utilitaires, composants, sections
├── script.js             # interactions partagées
├── assets/               # logotype, signe V, favicons, fonte Acumin Variable
├── components/           # 29 composants de référence (.jsx + .d.ts + .prompt.md)
├── guidelines/           # cartes specimens
└── readme.md             # guide de marque complet
```

Le téléchargement contient aussi `uploads/`, `explorations/`, `_ds_bundle.js`,
`_ds_manifest.json` : sans utilité ici, vous pouvez les supprimer de la copie.

## L'erreur à ne pas commettre

**Ne placez jamais cet export à l'intérieur du projet design system.**

Le compilateur du design system découvre ses composants par convention : tout
`<Nom>.jsx` accompagné d'un `<Nom>.d.ts` dans le même dossier devient un
composant publié. Un export déposé dans le projet crée donc un second
`Button.jsx`, un second `Faq.jsx`, et ainsi de suite — 29 collisions de noms,
et la compilation entière est abandonnée. Le design system devient inutilisable,
y compris pour les projets qui en dépendent.

L'export vit **à côté** du dépôt Astro, ou n'importe où ailleurs sur votre
disque : `sync-ds.sh` prend son chemin en argument.

```bash
./sync-ds.sh ../design-system
./sync-ds.sh ~/Downloads/avenir-immobilier-design-system
```

## Deux avertissements sur le contenu

**Les `.card.html` de `components/` ne s'ouvrent pas seuls.** Ils chargent un
`_ds_bundle.js` compilé par le projet design system. Ce sont des vignettes de
catalogue, pas des pages : lisez les `.jsx`, `.d.ts` et `.prompt.md`, qui
portent toute l'information utile sur les props et les règles d'usage.

**`tokens/fonts.css` pointe vers `../assets/fonts/`.** Dans le dépôt Astro la
fonte est servie depuis `public/`, d'où la version corrigée
`fonts.astro.css`. C'est le seul fichier que `sync-ds.sh` ne recopie
volontairement pas.
