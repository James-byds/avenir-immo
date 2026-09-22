#!/usr/bin/env bash
# ============================================================
# Avenir Immobilier — synchronisation du design system
#
# Recopie tokens, site.css, script.js et assets depuis l'export du
# design system vers ce dépôt Astro. Sens UNIQUE : le DS est la source
# de vérité, ce dépôt est consommateur.
#
# Usage :  ./sync-ds.sh /chemin/vers/export-design-system
#
# Toute modification faite dans src/styles/ds/ est écrasée ici.
# Pour corriger un style : le corriger dans le design system, puis
# relancer ce script.
# ============================================================
set -euo pipefail

SRC="${1:-}"
if [[ -z "$SRC" || ! -f "$SRC/styles.css" ]]; then
  echo "Usage: ./sync-ds.sh /chemin/vers/export-design-system" >&2
  echo "(le dossier doit contenir styles.css, tokens/, site/)" >&2
  exit 1
fi

DS="src/styles/ds"
mkdir -p "$DS/tokens" "$DS/site" public/fonts public/assets

# ---------- CSS ----------
cp "$SRC/styles.css"              "$DS/styles.css"
cp "$SRC/tokens/colors.css"       "$DS/tokens/colors.css"
cp "$SRC/tokens/typography.css"   "$DS/tokens/typography.css"
cp "$SRC/tokens/spacing.css"      "$DS/tokens/spacing.css"
cp "$SRC/tokens/effects.css"      "$DS/tokens/effects.css"
cp "$SRC/site/site.css"           "$DS/site/site.css"

# tokens/fonts.css n'est PAS recopié : la version Astro pointe vers
# /fonts/ au lieu de ../assets/fonts/. Elle est versionnée dans ce dépôt.
if [[ ! -f "$DS/tokens/fonts.css" ]]; then
  echo "!! $DS/tokens/fonts.css manquant — copier handoff-astro/fonts.astro.css" >&2
fi

# ---------- Script partagé ----------
cp "$SRC/script.js" public/ds-script.js

# ---------- Assets ----------
cp "$SRC"/assets/logo-lavenir-immobilier*.png public/assets/
cp "$SRC"/assets/signe-v*.png                 public/assets/
cp "$SRC"/assets/favicon-*.png                public/
[[ -f "$SRC/assets/fonts/AcuminVariableConcept.otf" ]] \
  && cp "$SRC/assets/fonts/AcuminVariableConcept.otf" public/fonts/

echo "✓ Design system synchronisé depuis $SRC"
echo
echo "Vérifications :"
echo "  · la fonte woff2 de public/fonts/ est-elle à jour ?"
echo "  · 'npm run build' puis chercher #17413B dans dist/ : il ne doit"
echo "    apparaître QUE dans les tokens, jamais dans un utilitaire compilé"
echo "    (sinon @theme inline a été perdu dans theme.css)"
