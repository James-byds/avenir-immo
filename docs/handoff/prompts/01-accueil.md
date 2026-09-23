# 01 — Accueil (`/`)

**Référence** : `docs/handoff/reference/index.html` (1805 mots, 13 sections). **Page témoin** : elle valide le chrome et la méthode ; aucune autre page ne démarre avant que sa recette passe.

---

Monte `src/pages/index.astro` sur `PageLayout` (header **transparent** sur le héros, `solid={false}`), à l'identique de `index.html`. Sections dans cet ordre, avec leur fond — l'alternance est la délimitation, aucun filet :

| # | id · classe | Fond | Contenu |
|---|---|---|---|
| 1 | `#accueil .hero.hero--media` | encre (héros) | H1 « L'immobilier de prestige, *en plus simple*. » (emphase en couleur via la classe de la référence, jamais en italique), chapô, barre de recherche `.hero-search` à 3 onglets Estimer / Acheter / Louer (`#heroSearch`, champs `.hs-field--dd` Type de bien / Budget, `#hsLocate` géolocalisation), preuves chiffrées sous la barre, `.brand-logo--rev` blanc dans le header |
| 2 | `#preuves .proofs` | blanc | « Quatre raisons de nous confier votre bien » — 4 `.proof` avec pictos `/assets/picto-{25-ans,87-valorisation,89-rapidite,0-litige}.png` (`.proof-ic`, `--wide` pour le large), chiffre `.proof-fig`, source datée |
| 3 | `#vendre .services` | vert tendre | « Quatre métiers, une exigence » — `.serv-grid`, numéros `.s-no` |
| 4 | `#biens` | blanc | « Nos biens d'exception » — `.props-head`, barre `.hero-search--inline` (`#propSearch`, transmet `loc`/`type` en `?`-params vers `/biens`), grille organique `.prop-grid` avec 1re carte `PropertyCard variant="overlay"`, flèches `#propPrev/#propNext` (4 par page), favoris `.card-fav` |
| 5 | `#process .process.process--light` | **aplat vert profond** | « Votre vente, en quatre temps » — `.proc-grid` : `.proc-side` sticky avec `.proc-stat` (chiffre jaune), `.proc-panel` + `.timeline` / `.tl-item` auto-numérotés, `.tl-end`. Éyebrow jaune, bouton blanc |
| 6 | `#estimation .estimate` | encre (seule zone encre du corps) | « Combien vaut votre bien ? » — `.est-grid`, formulaire 3 étapes `#estForm` (logique dans `ds-script.js` : `#typeChoice`, `#cp`, `#surf`, `#rooms`, fourchette instantanée `.ed-range`) |
| 7 | `#approche` | blanc | « Le sur-mesure, pas la série. » — `.approach-grid`, `.approach-media` (placeholders `.ph.tall2`) |
| 8 | `#equipe .team` | vert tendre | « Des visages, pas un standard » — carousel `#teamTrack` + `#teamPrev/#teamNext`, cartes `.member` depuis `getCollection("equipe")` (photos `/assets/agent-*.png`) |
| 9 | `#avis .trust` | blanc | « 190 familles accompagnées, notées 4,8/5 » — `.trust-sum` (aplat vert profond : note + barres jaunes + CTA blanc), `.t-card` × n depuis `avis`, `.t-imgs`/`.t-more`, lightbox `.t-lb` |
| 10 | `#quartiers` | vert tendre | « Nos quartiers » — `.hoods-grid` 4 tuiles → pages de localité réelles (`lib/maillage.ts`) |
| 11 | `#blog .blog` | blanc | « Conseils & marché » — `.blog-grid` de `.post` (un seul lien = le titre, étendu à la carte, `z-index:4`), `Byline small` non cliquable |
| 12 | `#faq .faq` | vert tendre | « Tout, clairement. » — `.faq-grid` : `Faq` île `client:visible` `structuredData={false}` + JSON-LD `FAQPage` émis par la page ; `.faq-aside` (carte verte) |
| 13 | `#contact .finalcta.finalcta--photo` | blanc → chevauche le pied | « Et si on commençait par un café ? » — `.fc-panel` aplat vert clair **texte encre**, bouton `.btn--deep`, portrait `.fc-photo` (`/assets/conseiller-cta.png`) débordant ; le footer réserve la hauteur (`body:has(.finalcta--photo) .footer` dans `local.css`) |

Vérifie l'alternance : 2 blanc → 3 tendre → 4 blanc → 5 vert profond → 6 encre → 7 blanc → 8 tendre → 9 blanc → 10 tendre → 11 blanc → 12 tendre → 13 blanc. Utilise `.sec--*` ; les classes de section du DS (`.services`, `.team`, `.blog`, `.process`) portent déjà leur fond — ne le redouble pas.

## Comportements (tous dans `ds-script.js`, déjà chargé — vérifie qu'ils s'accrochent aux mêmes `id`)

Header `scrolled` > 12 px · drawer · onglets et dropdowns de la barre héros (Échap ferme) · recherche section biens → `/biens?cat=&loc=&type=` (ne pas jeter la saisie) · pagination cartes · favoris · estimateur 3 étapes · carousel équipe · accordéon FAQ · newsletter · scroll-reveal (`.reveal`, `.d1/.d2/.d3`) · count-up des `.s-num[data-count]`.

## Head

`<title>`, description et canonical de la référence ; JSON-LD `RealEstateAgent` (+ `PostalAddress`, `AggregateRating` 4,8/190) et `FAQPage` depuis les mêmes items que la FAQ.

## Livrable

`src/pages/index.astro` ; nouveaux composants seulement si un motif revient sur ≥ 2 pages : `surfaces/TrustSection.astro` (`.trust-sum` + `.t-card`), `surfaces/FinalCta.astro` (props `variant: "plain" | "photo" | "straddle"`, `tone: "tint" | "deep"`, slot), `core/SectionHead.astro` s'il manque. Contenu : `src/content/{biens,equipe,avis,articles}` (compléter via `contenu` si besoin). Ne touche pas au chrome sans le signaler.

Quand `npm run build` passe, lance `recette-ds` sur `/` avec la référence `index.html`.
