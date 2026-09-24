import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

/* ─────────────────────────────────────────────────────────────────────────
   Schémas Zod des Content Collections.

   Principe (handoff) : les champs que le design system EXIGE sont rendus
   obligatoires ici. Une omission casse `astro build` plutôt que d'atteindre
   la production :
     • tout chiffre affiché porte une `source` datée ;
     • toute mensualité de crédit porte sa `mentionLegale` ;
     • tout lien de maillage porte une `ancre` descriptive.
   ───────────────────────────────────────────────────────────────────────── */

/** Provenance datée obligatoire pour tout chiffre publié. */
const source = z.object({
  libelle: z.string(),
  url: z.string().url().optional(),
  date: z.coerce.date(),
});

/** Un chiffre affiché = valeur + source datée. */
const chiffre = z.object({
  label: z.string(),
  valeur: z.union([z.string(), z.number()]),
  unite: z.string().optional(),
  source,
});

const faqItem = z.object({
  question: z.string(),
  reponse: z.string(),
});

const typeBien = z.enum(["maison", "appartement", "terrain", "commerce", "immeuble"]);
const transaction = z.enum(["vente", "location"]);

/** Ligne des tables « prix par quartier / village » des pages de localité. */
const prixQuartier = z.object({
  nom: z.string(),
  description: z.string().optional(),
  transaction,
  valeur: z.union([z.string(), z.number()]),
  /** « €/m² », « €/mois »… */
  unite: z.string().optional(),
  source,
});

/* ── Biens (annonces immobilières) ──────────────────────────────────────── */
const biens = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/biens" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      type: typeBien,
      transaction,
      commune: z.string(),
      /** Quartier de la commune (« Cointe & Laveu ») — filtres des pages de localité. */
      quartier: z.string().optional(),
      /** Sous-type d'affichage (le type reste la clé du maillage). */
      sousType: z.enum(["villa", "studio", "duplex", "penthouse", "fermette"]).optional(),
      /** Cycle de vie commercial — badges des cartes. */
      statut: z.enum(["nouveau", "sous-offre", "vendu", "off-market"]).optional(),
      /** Référence interne de l'annonce (« AV-2418 »). */
      reference: z.string().optional(),
      prix: z.number().int().positive(),
      surface: z.number().positive().optional(),
      chambres: z.number().int().nonnegative().optional(),
      sdb: z.number().int().nonnegative().optional(),
      /** Terrain en m². */
      terrain: z.number().positive().optional(),
      anneeConstruction: z.number().int().optional(),
      /** Places de garage (« 2 voit. » dans la SpecGrid de la fiche). */
      garage: z.number().int().nonnegative().optional(),
      /** Code postal affiché dans la ligne de localisation (« 6280 »). */
      codePostal: z.string().optional(),
      peb: z.enum(["A++", "A+", "A", "B", "C", "D", "E", "F", "G"]).optional(),
      /** Consommation PEB en kWh/m²·an. */
      kwh: z.number().optional(),
      description: z.string(),
      photos: z.array(image()).default([]),
      /** Légendes des photos — placeholders .ph tant que les visuels manquent. */
      galerie: z.array(z.string()).default([]),
      /** Lignes dt/dd du bloc « PEB & informations légales » de la fiche. */
      legales: z.array(z.object({ label: z.string(), valeur: z.string() })).default([]),
      /** Paragraphe « Le quartier » de la fiche bien. */
      quartierTexte: z.string().optional(),
      /** Repères sous la carte (« Écoles à 4 min · N5 → Charleroi en 15 min »). */
      quartierRepere: z.string().optional(),
      agent: reference("equipe").optional(),
      /* Simulation de mensualité : la mention légale est obligatoire si affichée. */
      mensualite: z
        .object({
          montant: z.number().positive(),
          /** Hypothèses de calcul affichées avec la mensualité (quotité, durée, taux). */
          hypothese: z.string().optional(),
          mentionLegale: z.string(),
        })
        .optional(),
      publie: z.boolean().default(true),
      date: z.coerce.date(),
    }),
});

/* ── Articles de blog ───────────────────────────────────────────────────── */
const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      /** Extrait des cartes (accueil, hub, pages auteur) et chapô de repli. */
      description: z.string(),
      /** Meta description propre à la page article quand elle diffère de
          l'extrait (réf. article.html) — repli : `description`. Additif F6. */
      metaDescription: z.string().optional(),
      /** Libellé court du fil d'Ariane (« Home-staging ») — le JSON-LD garde
          le titre complet. Additif F6. */
      titreCourt: z.string().optional(),
      auteur: reference("auteurs"),
      /** Catégorie éditoriale affichée (« Marché », « Fiscalité »…). */
      categorie: z.string().optional(),
      /** Temps de lecture en minutes. */
      tempsLecture: z.number().int().positive().optional(),
      image: image().optional(),
      tags: z.array(z.string()).default([]),
      chiffres: z.array(chiffre).default([]),
      publie: z.boolean().default(true),
      datePublication: z.coerce.date(),
      dateMaj: z.coerce.date().optional(),
    }),
});

/* ── Auteurs (signatures d'articles) ────────────────────────────────────── */
const auteurs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/auteurs" }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      role: z.string().optional(),
      bio: z.string(),
      photo: image().optional(),
      liens: z
        .array(z.object({ label: z.string(), url: z.string().url() }))
        .default([]),
      /* ── Additifs gabarit 13 (hub /auteurs + page auteur) — tous optionnels.
         Les COMPTES (articles signés, thématiques, lecture moyenne, dernière
         publication) ne sont jamais déclarés ici : calculés depuis `articles`. ── */
      /** Rôle développé du héros de la page auteur (« Expert vente — Loverval &
          Mont-sur-Marchienne ») ; défaut : `role`. */
      roleLong: z.string().optional(),
      /** Agrément IPI (« 509 217 ») — suffixe « · Agent IPI … » du rôle du héros. */
      ipi: z.string().optional(),
      /** Citation du héros de la page auteur (.au-quote), sans guillemets. */
      citation: z.string().optional(),
      /** Citation courte des cartes rédacteur (.w-quote du hub, .w-bio des
          cartes compactes « Les autres rédacteurs »), sans guillemets. */
      citationCourte: z.string().optional(),
      /** Thèmes de prédilection — pilules .w-specs du hub. */
      specialites: z.array(z.string()).default([]),
      /** Année de la première signature dans le journal (« Écrit depuis 2018 »). */
      depuis: z.number().int().optional(),
      /** Libellé devant l'année — « Écrit depuis » par défaut, « Invitée depuis »
          pour une signature extérieure. */
      depuisLabel: z.string().optional(),
      /** Signature extérieure à l'agence (notaire invitée) : pas de `worksFor`
          Avenir dans le JSON-LD Person. */
      externe: z.boolean().default(false),
      langues: z.array(z.string()).default([]),
      /** Rattachement affiché tel quel dans la méta du héros (« Basée à
          Charleroi », « Étude à Charleroi »). */
      base: z.string().optional(),
      /** Portrait client servi depuis public/ (« /assets/portrait-02.png ») —
          initiales sur vert tendre sinon. */
      portrait: z.string().optional(),
      /** Ordre d'affichage (hub et cartes « autres rédacteurs »). */
      ordre: z.number().int().default(0),
      /** Suite de « Les {n} articles de {Nom}, » dans la meta description :
          rôle libre + deux-points + spécificités (n est calculé). */
      metaDescription: z.string().optional(),
    }),
});

/* ── Équipe (agents / membres de l'agence) ──────────────────────────────── */
const equipe = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/equipe" }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      fonction: z.string(),
      /** Numéro d'agrément IPI (« 509 217 »). */
      ipi: z.string().optional(),
      photo: image().optional(),
      telephone: z.string().optional(),
      email: z.string().email().optional(),
      /** Points ✓ de la carte membre. */
      points: z.array(z.string()).default([]),
      /** Chiffres de la page membre — source datée obligatoire. */
      stats: z.array(chiffre).default([]),
      langues: z.array(z.string()).default([]),
      /** Zones d'intervention (communes). */
      zones: z.array(z.string()).default([]),
      /** Année d'entrée chez Avenir. */
      depuis: z.number().int().optional(),
      ordre: z.number().int().default(0),
      /* ── Additifs gabarit 11 (page membre) — tous optionnels ── */
      /** Sujets du formulaire pré-adressé (« Votre projet ») de la page membre. */
      specialites: z.array(z.string()).default([]),
      /** Réseaux affichés en action du MemberHero (« LinkedIn ↗ »). */
      liens: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      /** H2 de la bande contact de la page membre (réf. equipe-*.html). */
      contactTitre: z.string().optional(),
      /** Chapô de la bande contact de la page membre. */
      contactLede: z.string().optional(),
      /** Meta description spécifique (défaut : « Ses biens en vente et son
          contact direct : {tél}. » — cas Agnès, sans biens). */
      metaDescription: z.string().optional(),
    }),
});

/* ── Communes (pages de localité — chiffres datés + FAQ locale) ─────────── */

/* Copie éditoriale d'UNE page de localité (gabarit 05) — additif optionnel,
   une entrée par combinaison type × transaction déclarée. Tout le texte de la
   page vient d'ici (jamais partagé entre communes) ; les chiffres cités dans
   ces textes doivent exister dans `chiffres[]` avec leur source datée. */
const pageLocalite = z.object({
  type: typeBien,
  transaction,
  /** Périmètre du listing : « type » (défaut) ou tout le marché de la
      transaction (la page appartements-à-louer liste tout le locatif,
      comme la référence appartement-a-louer-liege.html). */
  listing: z.enum(["type", "transaction"]).default("type"),
  /** Meta description (médiane, €/m², délai — chiffres sourcés de chiffres[]). */
  description: z.string(),
  /** Eyebrow du bandeau (« Liège & arrondissement · 4000 — 4032 »). */
  eyebrow: z.string(),
  /** Légende du placeholder photo du bandeau. */
  photo: z.string().optional(),
  /** Chapô du bandeau — HTML léger autorisé (<strong>). */
  chapo: z.string(),
  /** Seconde action du bandeau (la première est l'ancre #resultats calculée). */
  ctaGhost: z.object({ label: z.string(), href: z.string() }),
  /** Section 2 — texte + image (two-col--b). */
  intro: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    paragraphes: z.array(z.string()).min(1),
    /** Libellé du lien fléché vers #marche. */
    lien: z.string(),
    photo: z.string().optional(),
  }),
  /** Tranches du filtre budget/loyer (« value » = "lo-hi" numérique). */
  budgets: z.array(z.object({ value: z.string(), label: z.string() })),
  /** Libellé de la première option du filtre budget. */
  budgetTous: z.string().default("Tous budgets"),
  /** État zéro résultat. */
  vide: z.object({ titre: z.string(), texte: z.string(), action: z.string() }),
  /** Section 4 — guide six points (colonne sticky + .guide-pts). */
  guide: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    texte: z.string(),
    /** Encadré « En clair » — HTML léger autorisé. */
    enclair: z.string(),
    points: z.array(z.object({ titre: z.string(), texte: z.string() })).min(1),
  }),
  /** Section 5 — marché : chiffre clé + lignes + table quartiers. */
  marche: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    texte: z.string(),
    big: z.object({ valeur: z.string(), texte: z.string() }),
    rows: z.array(
      z.object({
        label: z.string(),
        detail: z.string().optional(),
        valeur: z.string(),
        /** Valeur accentuée en vert (<em>), ex. « +2,4 % ». */
        accent: z.boolean().default(false),
      }),
    ),
    tableTitre: z.string(),
  }),
  /** Section 6 — cadre de vie ; `atouts` prime sur ceux de la commune. */
  vivre: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    atouts: z.array(z.object({ titre: z.string(), texte: z.string() })).optional(),
    /* Numéros 01-0n sur les cartes (la référence location les a, pas la vente —
       la numérotation reste sinon réservée au guide six points). */
    numerote: z.boolean().default(false),
  }),
  /** Section 7 — SellHere band (+ simulateur de crédit si `simulateur`). */
  vendre: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    lede: z.string(),
    headline: z.string(),
    headlineLabel: z.string(),
    rows: z.array(z.object({ label: z.string(), valeur: z.string() })),
    source: z.string(),
    primaire: z.object({ label: z.string(), href: z.string() }),
    secondaire: z.object({ label: z.string(), href: z.string() }),
    /** Montant pré-réglé du simulateur (vente uniquement — jamais en location). */
    simulateur: z.object({ montant: z.number().int().positive() }).optional(),
  }),
  /** Section 8 — bande contact encre (ContactForm tone="ink"). */
  contact: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    lede: z.string(),
    sujets: z.array(z.string()).optional(),
    coordonnees: z
      .array(z.object({ label: z.string(), valeur: z.string(), href: z.string().optional() }))
      .default([]),
  }),
  /** Section 9 — FAQ (questions filtrées par `transaction` dans faq[]). */
  faq: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    asideTitre: z.string(),
    asideTexte: z.string(),
  }),
  /** Section 10 — titre de la section agence. */
  agenceTitre: z.string(),
  /* Bande d'avis 4,8/5 entre agence et maillage (continuation du vert tendre) —
     citation propre à la page ; `noms` = signatures abrégées des avatars. La
     note et le volume (190 avis Google) sont des données externes reprises
     telles quelles, comme sur l'accueil et l'estimation. */
  trust: z
    .object({ quote: z.string(), noms: z.array(z.string()).min(1) })
    .optional(),
  /** Section 11 — titre du bloc maillage (.ll-mesh). */
  meshTitre: z.string(),
  /** Section 12 — CTA final (.lg-cta). */
  final: z.object({
    eyebrow: z.string(),
    titre: z.string(),
    texte: z.string(),
    cta: z.object({ label: z.string(), href: z.string() }),
  }),
  /* Gabarit « quartier » (06) — blocs PROPRES à la variante entité-et-villages
     (réf. quartier.html) : listing d'entité, carte des villages, avis situés,
     communes voisines, CTA final encre. Obligatoire quand la commune déclare
     `gabarit: quartier` ; ignoré sinon. Additif optionnel. */
  quartier: z
    .object({
      /** <title> de la référence (« Immobilier à Gerpinnes — vendre & acheter · … »). */
      title: z.string(),
      /** H1 porteur (« Immobilier à Gerpinnes : maisons et villas à vendre »). */
      h1: z.string(),
      /** Bascule vendeur à droite du fil d'Ariane (.bc-switch). */
      bascule: z.object({ label: z.string(), href: z.string() }),
      /** H2 du listing (#biens-quartier). */
      biensTitre: z.string(),
      /** Pastille .q-scope — portée annoncée de la recherche (entité, n villages). */
      portee: z.string(),
      /** État vide du listing (.q-empty). */
      vide: z.object({
        texte: z.string(),
        primaire: z.object({ label: z.string(), href: z.string() }),
        secondaire: z.object({ label: z.string(), href: z.string() }),
      }),
      /** Section carte des villages (.q-map-band). */
      carte: z.object({ eyebrow: z.string(), titre: z.string(), texte: z.string() }),
      /** Avis situés (.trust) : titre coupé avant l'em « 4,8/5 », intro, cartes =
          avis de la collection (vendeurs de l'entité). */
      avis: z.object({
        titreAvant: z.string(),
        titreEm: z.string(),
        intro: z.string(),
        cartes: z.array(reference("avis")).min(1),
      }),
      /** Communes voisines (.q-others) — data-planned tant que non codées. */
      voisins: z.object({
        eyebrow: z.string(),
        titre: z.string(),
        liens: z
          .array(z.object({ label: z.string(), href: z.string(), planned: z.boolean().default(true) }))
          .min(1),
      }),
      /** CTA final encre — seule zone encre du corps de la variante ;
          `titre` : HTML léger (<em> jaune). */
      final: z.object({
        eyebrow: z.string(),
        titre: z.string(),
        texte: z.string(),
        primaire: z.object({ label: z.string(), href: z.string() }),
        secondaire: z.object({ label: z.string(), href: z.string() }),
      }),
    })
    .optional(),
  /** Conseiller référent (AgentCard + prénom dans la copie). */
  conseiller: reference("equipe"),
});

const communes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/communes" }),
  schema: z.object({
    nom: z.string(),
    /** Province (addressRegion du JSON-LD) — additif optionnel. */
    province: z.string().optional(),
    /** Code postal principal (PostalAddress du JSON-LD Place) — additif optionnel. */
    codePostal: z.string().optional(),
    /** Centre de la carte Leaflet de la section agence — additif optionnel. */
    coord: z.object({ lat: z.number(), lng: z.number() }).optional(),
    /* Gabarit de la page de localité : « quartier » = variante entité-et-villages
       (réf. quartier.html, gabarit 06 — carte Leaflet des villages, listing
       élargi à l'entité, blocs propres). Absent = gabarit 05. Additif optionnel. */
    gabarit: z.enum(["quartier"]).optional(),
    /* Villages de l'entité (gabarit quartier) : lignes €/m² et pastilles de la
       carte. `nom` = valeur `commune` des biens du village (les COMPTES de biens
       sont calculés depuis la collection, jamais déclarés) ; `libelle` =
       affichage s'il diffère (« Gerpinnes (centre) »). Le prix au m² porte sa
       source datée (règle : un chiffre = une source). Additif optionnel. */
    villages: z
      .array(
        z.object({
          nom: z.string(),
          libelle: z.string().optional(),
          lat: z.number(),
          lng: z.number(),
          /** Prix moyen au m² (€). */
          prixM2: z.number(),
          source,
        }),
      )
      .default([]),
    /** Antenne / agence affichée en section 10 — additif optionnel. */
    agence: z
      .object({
        ouverture: z.string().optional(),
        nom: z.string(),
        adresse: z.string(),
        email: z.string().optional(),
        rdv: z.string().optional(),
        carte: z.string().optional(),
      })
      .optional(),
    /* Combinaisons type × transaction réellement disponibles → routes de
       [type]-a-[transaction]-[commune] et maillage. Un produit cartésien
       types × transactions générerait des pages sans bien (interdit). */
    combinaisons: z.array(z.object({ type: typeBien, transaction })).default([]),
    intro: z.string(),
    chiffres: z.array(chiffre).default([]),
    /** Tables prix/loyer par quartier ou village. */
    prixQuartiers: z.array(prixQuartier).default([]),
    /** Temps de trajet affichés (« Charleroi centre » → 15 min). */
    trajets: z.array(z.object({ destination: z.string(), minutes: z.number() })).default([]),
    /** Cadre de vie / points d'intérêt (écoles, accès, commerces). */
    atouts: z.array(z.object({ titre: z.string(), texte: z.string() })).default([]),
    /* `transaction` / `type` (additifs optionnels) : ciblent une question sur
       certaines pages de localité de la commune ; absents = toutes les pages.
       Évite de dupliquer une même FAQ (donc un même FAQPage JSON-LD) entre
       deux pages voisines (ex. appartements et maisons à louer). */
    faq: z
      .array(
        faqItem.extend({
          /** Ancre stable de la question (#faq-<id>) — défaut : slug de la question. */
          id: z.string().optional(),
          transaction: transaction.optional(),
          type: typeBien.optional(),
        }),
      )
      .default([]),
    /** Copie des pages de localité (gabarit 05) — additif optionnel. */
    pages: z.array(pageLocalite).default([]),
  }),
});

/* ── Avis clients ───────────────────────────────────────────────────────── */
const avis = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/avis" }),
  schema: z.object({
    auteur: z.string(),
    note: z.number().min(1).max(5),
    texte: z.string(),
    commune: z.string().optional(),
    /** Type de projet — filtres du mur d'avis (« vente », « achat »…). */
    projet: z.string().optional(),
    /** Nombre de photos jointes à l'avis. */
    photos: z.number().int().positive().optional(),
    /** Réponse publique de l'agence. */
    reponse: z.string().optional(),
    date: z.coerce.date(),
    source,
  }),
});

export const collections = { biens, articles, auteurs, equipe, communes, avis };
