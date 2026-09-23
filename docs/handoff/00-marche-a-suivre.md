# Marche à suivre — Claude Code, structuré et rapide

## Principe

Un **orchestrateur** (la session principale) qui ne code pas les pages lui-même : il tient le plan, lance des sous-agents à périmètre fermé, et fait passer chaque livraison par un sous-agent de recette. Trois rôles, définis dans `repo/.claude/agents/` :

| Agent | Rôle | Quand |
|---|---|---|
| `gabarit` | Construit **un** gabarit à partir de sa page de référence et de son prompt | Un lancement par prompt 01 → 14 |
| `contenu` | Extrait le mock typé des HTML vers `src/content/*` en respectant les schémas Zod | Preflight, puis à la demande d'un `gabarit` |
| `recette-ds` | Vérifie une page livrée : adhérence DS (5 contrôles), pixel-diff à 1440/375, SEO, a11y, build | Après chaque `gabarit`, jamais avant |

Pourquoi par gabarit et non par couche : les pages partagent déjà leur couche (le DS est synchronisé, les composants sont des wrappers de classes). Le travail restant est du **montage de page + contenu**, indépendant d'une page à l'autre — c'est parallélisable par gabarit, pas par couche.

## Mise en place (10 minutes, une fois)

```bash
# 1. dans le dépôt avenir-immo
cp -r <handoff>/repo/.claude .claude
cp <handoff>/repo/src/styles/local.css src/styles/local.css
./sync-ds.sh <handoff>/reference/ds-export        # remet src/styles/ds/ au niveau du 23 sept.
# 2. app.css : insérer l'import entre ds et theme
#    @import "tailwindcss"; @import "./ds/styles.css"; @import "./local.css"; @import "./theme.css";
# 3. la documentation et les références
mkdir -p docs/handoff && cp <handoff>/README.md <handoff>/00-marche-a-suivre.md docs/handoff/ && cp -r <handoff>/prompts docs/handoff/
cp -r <handoff>/reference docs/handoff/reference    # ignoré par git (cf. repo/.gitignore.append)
cat <handoff>/repo/.gitignore.append >> .gitignore
npx serve docs/handoff/reference                    # http://localhost:3000/README.html
```

Puis `claude` à la racine du dépôt et coller **`prompts/00-preflight.md`**.

## Ordre des sessions

```
00 preflight ─────────────────────────────── 1 session, séquentielle (orchestrateur + contenu)
   │  inventaire réel · sync DS · local.css · chrome (header/footer/PageHead) · collections mock
   ▼
01 accueil ───────────────────────────────── 1 session — c'est la page témoin : ne rien paralléliser avant qu'elle passe la recette
   ▼
┌───────────── vague A (3 sous-agents gabarit en parallèle) ─────────────┐
│ 02 biens-liste   03 bien-fiche   07 estimation                         │
└────────────────────────────────────────────────────────────────────────┘
┌───────────── vague B ──────────────────────────────────────────────────┐
│ 05 localite (route dynamique)   04 localites-hub   06 quartier          │   05 avant 06 : quartier = 05 enrichi
└────────────────────────────────────────────────────────────────────────┘
┌───────────── vague C ──────────────────────────────────────────────────┐
│ 11 equipe   10 a-propos   08 contact   09 avis                          │
└────────────────────────────────────────────────────────────────────────┘
┌───────────── vague D ──────────────────────────────────────────────────┐
│ 12 blog+article   13 auteurs   14 legales                               │
└────────────────────────────────────────────────────────────────────────┘
99 recette globale ───────────────────────── 1 session
```

Chaque vague : l'orchestrateur lance les sous-agents `gabarit` (un prompt chacun), attend, lance `recette-ds` sur chaque page livrée, corrige, commit par gabarit. **Trois sous-agents en parallèle maximum** — au-delà, les conflits sur `src/components/` et `src/content/` coûtent plus qu'ils ne font gagner.

## Portes de contrôle (ne pas passer outre)

1. **Après 00** : `npm run build` vert ; `grep -r "#17413B" dist/` ne sort que dans les tokens ; `local.css` chargé (la classe `.sk-card` existe dans le CSS compilé).
2. **Après 01** : la recette de l'accueil passe à 100 % — c'est elle qui valide le chrome et la méthode. Si l'accueil a des écarts, toutes les pages suivantes les hériteront.
3. **Après chaque gabarit** : `recette-ds` rend « conforme » ; commit `feat(<gabarit>): …`.
4. **Avant 99** : `sitemap.xml` liste toutes les routes ; aucun `href="#"` nu (les pages non codées portent `data-planned`).

## Comment lancer un sous-agent (formulation pour l'orchestrateur)

> Lance le sous-agent `gabarit` avec le prompt `prompts/03-bien-fiche.md` (colle-le en entier dans son contexte). Périmètre : `src/pages/biens/[slug].astro`, les composants qu'il liste, `src/content/biens/`. Il ne touche à rien d'autre. Quand il a fini, lance `recette-ds` sur `/biens/villa-architecte-gerpinnes` avec la référence `bien.html`.

Chaque prompt de gabarit se termine par un **bloc « Livrable »** qui délimite exactement les fichiers autorisés — c'est ce qui rend la parallélisation sûre.

## Règles permanentes (rappelées à chaque agent)

- `src/styles/ds/` en lecture seule ; `local.css` : ne rien ajouter sans le noter en tête de bloc « à reprendre dans le DS ».
- Les classes du DS portent le style, Tailwind pose la grille. Aucun `bg-*`, `text-*`, `rounded-*`, `shadow-*` là où une classe DS existe.
- Aucune couleur de fond en `style=` ni en `bg-*` sur une `<section>` : `.sec--white` / `.sec--tint` / `.sec--ink` / `.sec--cont`. Les `⚠ style="background:…"` relevés dans `reference/squelettes-pages.md` sont des **défauts de la maquette à corriger au portage**, pas à reproduire.
- Un chiffre = une source datée (schéma Zod). Une mensualité = la mention légale.
- Aucune ancre dans une ancre. Une carte = un seul lien (le titre) étendu à toute la carte.
- Pas de lien vers une combinaison commune × type sans bien ; pages non codées → `data-planned`.

## Ce que ce handoff ne fait pas

- Les photos (placeholders `.ph` partout). Remplacer par `<img>` au même endroit quand elles arrivent.
- Le choix de la source de données (CMS / API métier). Les collections mock sont conçues pour qu'un loader Astro puisse être branché ensuite sans toucher aux pages.
- Le simulateur de crédit n'est pas un composant du DS : il est porté **en local** (page localité) avec la mention légale, à faire remonter au DS plus tard.
