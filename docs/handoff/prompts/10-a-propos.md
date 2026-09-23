# 10 — À propos (`/a-propos`)

**Référence** : `docs/handoff/reference/a-propos.html` (piste « 2d » retenue ; les pistes 2a/2b/2c et la v1 sont archivées — ne pas s'en inspirer). Classes locales : `.about-hero`, `.about-photo`, `.about-dl`, `.team-grid--contact`, `.member--contact`, `.m-*`, `.lx*`, `.lf*` (dans `local.css`).

---

Monte `src/pages/a-propos.astro` sur `PageLayout solid`.

## Sections

1. `.estimate`-like **héros encre** `.about-hero` — `Breadcrumb` inversé (**pas** de `style="color:rgba(255,255,255,.6)"` : le fil d'Ariane s'inverse déjà sur `.page-head--band` ; utilise `PageHead variant="band"` ou pose `.on-dark`), H1 « Six personnes, un numéro direct chacune. », chapô, chiffres (`depuis 1992`, `4,8/5 · 190 avis`) sourcés, `.about-photo` (photo d'équipe `/assets/equipe-avenir.png`).
2. `#equipe .sec--white` — « Appelez directement la bonne personne » — `.team-grid.team-grid--contact` : 6 `.member.member--contact` (photo = lien vers `/equipe/[slug]` avec voile « Voir le profil » `.m-veil`, `.m-name`, `.m-role`, `.m-rows` : `.m-row--tel` / `.m-row--mail` avec icônes en masque, `.m-facts`). Données `equipe`.
3. `.sec--tint` — « Ce que vous pouvez exiger de nous » — `.about-dl` : 5 engagements écrits (`dt`/`dd`).
4. `.sec--white` — « Le prix d'une rue, pas seulement d'un code postal » — `.lx` (deux colonnes `.lx-col`, `.lx-list`) : méthode d'estimation.
5. `.sec--white.sec--cont` — « Chercher là où nous vendons » — `LocalityLinks variant="mesh"` (remplace `style="margin:0"` par la continuation).
6. `.sec--tint` — « Boulevard Tirou, depuis le premier jour » — `AgencyCard media="map"` + `.lf` (lignes `.lf-k`/`.lf-v` : horaires, parking, accès).
7. `.sec--tint.sec--cont` — « Combien vaut votre bien aujourd'hui ? » — `SellHere variant="compact"` (carte blanche bordée sur fond tendre).

Alternance : encre → blanc → tendre → blanc → blanc (cont) → tendre → tendre (cont).

## Head

Title/description/canonical de la référence ; JSON-LD `RealEstateAgent` + `PostalAddress` + `AggregateRating` + `employee[]` (`Person` × 6).

## Livrable

`src/pages/a-propos.astro`, `components/surfaces/MemberContactCard.astro` (`.member--contact`, réutilisé par `/equipe`), `components/surfaces/Commitments.astro` (`.about-dl`). Contenu : `src/content/equipe/*.md` (téléphone direct, e-mail, faits).

Recette : `/a-propos` contre `a-propos.html`.
