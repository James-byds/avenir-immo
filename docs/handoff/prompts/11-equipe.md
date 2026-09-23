# 11 — Équipe : hub (`/equipe`) + page membre (`/equipe/[slug]`)

**Références** : `docs/handoff/reference/equipe.html`, `equipe-olivier-monier.html` (membre **avec** biens), `equipe-agnes-quispe.html` (office manager, **sans** biens — pas de section « En vente avec … »), + 4 autres `equipe-*.html` pour le contenu. Les membres sont les **agents associés aux biens** (≠ auteurs du blog).

---

## A. Hub `src/pages/equipe/index.astro`

1. `PageHead variant="band"` avec la classe `.hero-ink.on-dark` de la référence (ou `variant="ink"` si le rendu est identique) — H1 « Des visages, pas un standard. », chapô. Supprime `style="padding-bottom:…"` → prop de `PageHead`.
2. `#equipe .sec--tint` — « Cinq agents, une office manager » — `.team-grid` de `MemberContactCard` (créée en 10 ; sinon crée-la ici) depuis `equipe` trié par `ordre`.
3. `.cases-band .sec--white` — « Vous vous reconnaissez ? Voici qui décroche. » — `.cases-grid` : 4-6 `.case` (`.case-media` `.ph`, `.case-body`, `.case-who` → membre) : situation client → interlocuteur.
4. `#contact .finalcta.finalcta--photo.finalcta--straddle` — « Dites-nous votre projet, on vous dit qui s'en occupe. » — `FinalCta variant="straddle"` (panneau chevauchant le pied ; `body:has(.finalcta--straddle) .footer` réserve la hauteur — règle dans `local.css`).

## B. Membre `src/pages/equipe/[slug].astro`

`getStaticPaths` sur `equipe`.

1. `PageHead` plain — `Breadcrumb` (Accueil › L'équipe › Prénom Nom), `MemberHero` : photo portrait 4/4.6 (`/assets/agent-<slug>.png`), H1 nom, rôle + n° IPI, méta mono (langues · depuis · secteur), points ✓, actions (`.btn` appeler · `.btn--ghost` écrire → `#ecrire`), `mh-stats` (chiffres sourcés).
2. **Si le membre a des biens** : `.sec--tint` « En vente avec Olivier » — `.cards` de `PropertyCard` (biens dont `agent === slug`), puis `.sec--tint.sec--cont` compteur/lien « Tous nos biens ». **Sinon** : ces deux sections n'existent pas et la section suivante devient tendre pour garder l'alternance (H2 « Un document, un rendez-vous, une question ? »).
3. `#ecrire .contact-band` (encre) — « Une question sur votre bien ? » — `ContactForm tone="ink"` pré-adressé au membre (`subjects` = ses spécialités, coordonnées en jaune).
4. `.sec--white` — « Les autres conseillers » — 5 `MemberContactCard` compactes ou `.member` (référence : rangée `.team-grid--rows`).

## Head

Hub : title/description de la référence, canonical `/equipe`, JSON-LD `RealEstateAgent` + `employee[]` `Person`. Membre : « {Nom} — {Rôle} · Avenir Immobilier », description « {Nom}, {rôle} chez Avenir Immobilier à Charleroi. Ses biens en vente et son contact direct : {tél}. », canonical, JSON-LD `Person` (`jobTitle`, `telephone`, `worksFor`).

## Livrable

`src/pages/equipe/{index,[slug]}.astro`, `components/surfaces/{MemberHero,CaseCard,MemberContactCard}.astro`. Contenu : `src/content/equipe/*.md` complets (ipi, points, stats, spécialités, langues), `biens.agent` renseigné.

Recette : `/equipe`, `/equipe/olivier-monier`, `/equipe/agnes-quispe` contre leurs références (vérifier l'alternance dans le cas « sans biens »).
