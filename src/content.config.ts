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
      peb: z.enum(["A++", "A+", "A", "B", "C", "D", "E", "F", "G"]).optional(),
      /** Consommation PEB en kWh/m²·an. */
      kwh: z.number().optional(),
      description: z.string(),
      photos: z.array(image()).default([]),
      agent: reference("equipe").optional(),
      /* Simulation de mensualité : la mention légale est obligatoire si affichée. */
      mensualite: z
        .object({
          montant: z.number().positive(),
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
      description: z.string(),
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
    }),
});

/* ── Communes (pages de localité — chiffres datés + FAQ locale) ─────────── */
const communes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/communes" }),
  schema: z.object({
    nom: z.string(),
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
    faq: z.array(faqItem).default([]),
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
