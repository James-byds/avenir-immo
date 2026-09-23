# 08 — Contact (`/contact`)

**Référence** : `docs/handoff/reference/contact.html` (contient un `<style>` de page : classes `.c-grid`, `.c-row(s)`, `.c-points`, `.c-visit`, `.c-google`, `.c-after`, `.c-faq-lead` — à recopier **valeurs inchangées** dans le `<style>` du composant concerné et à noter « à reprendre dans le DS »).

---

Monte `src/pages/contact.astro` sur `PageLayout solid`.

## Sections

1. `PageHead` plain — `Breadcrumb`, H1 « Et si on commençait par un café ? », chapô « Réponse sous 24 h · sans engagement ».
2. `.sec--tint` — `.c-grid` : `ContactForm tone="light"` (île `client:visible`, carte blanche `.cform` — **blanc bordé, jamais teinté sur teinté**, `splitName`, `subjects[]` Vendre/Acheter/Estimer/Louer/Autre, consentement RGPD `.cf-consent`, `.cf-fine`) + colonne `.c-rows` : coordonnées (Boulevard Tirou 102 · +32 71 32 14 70 · e-mail · horaires) et `.c-points` « Vous saurez toujours où en est votre demande. » (H2).
3. `.sec--white` — « Boulevard Tirou, sans rendez-vous si vous passez. » — `AgencyCard media="photo"` (vitrine `.ph`, lignes clé/valeur, actions appeler + itinéraire, `zones` = pilules vers les pages de localité réelles) + `.c-visit` + `.c-google` (lien avis Google « ↗ »).
4. `.finalcta.on-dark` en **aplat vert profond** (`.sec--deep` si le DS le porte, sinon classe locale « à reprendre » — jamais `style="background:var(--green)"`) — « Votre bien vaut peut-être plus que vous ne pensez. » — bouton `.btn` vert clair texte encre (pas le blanc), `.btn--ghost` transparent bord blanc grâce à `.on-dark`.

Alternance : blanc → tendre → blanc → vert profond (l'un des 1-2 aplats verts autorisés par page).

## Comportement

`ContactForm` : validation à la soumission, état envoyé « ✓ Message envoyé — réponse sous 24 h », pas de backend (log + `console.info`, laisse un `TODO endpoint`). Le `<script>` inline de la référence gère la FAQ courte `.c-after` : reprends-le si la FAQ est conservée.

## Head

Title/description de la référence, canonical `/contact` ; JSON-LD `FAQPage` (si les 3 questions `.c-after` restent) + `RealEstateAgent` avec `PostalAddress`, `telephone`, `openingHoursSpecification`.

## Livrable

`src/pages/contact.astro`, `components/surfaces/AgencyCard.astro` (si absent), `components/surfaces/ContactRows.astro` (`.c-*`). Aucun contenu de collection.

Recette : `/contact` contre `contact.html` ; soumettre le formulaire vide puis valide.
