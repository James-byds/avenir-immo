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

/* ── Biens (annonces immobilières) ──────────────────────────────────────── */
const biens = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/biens" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      type: z.enum(["maison", "appartement", "terrain", "commerce", "immeuble"]),
      transaction: z.enum(["vente", "location"]),
      commune: z.string(),
      prix: z.number().int().positive(),
      surface: z.number().positive().optional(),
      chambres: z.number().int().nonnegative().optional(),
      peb: z.enum(["A++", "A+", "A", "B", "C", "D", "E", "F", "G"]).optional(),
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
      photo: image().optional(),
      telephone: z.string().optional(),
      email: z.string().email().optional(),
      ordre: z.number().int().default(0),
    }),
});

/* ── Communes (pages de localité — chiffres datés + FAQ locale) ─────────── */
const communes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/communes" }),
  schema: z.object({
    nom: z.string(),
    /* Types de transaction réellement disponibles → alimente lib/maillage.ts. */
    transactions: z.array(z.enum(["vente", "location"])).default(["vente"]),
    types: z
      .array(z.enum(["maison", "appartement", "terrain", "commerce", "immeuble"]))
      .default([]),
    intro: z.string(),
    chiffres: z.array(chiffre).default([]),
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
    date: z.coerce.date(),
    source,
  }),
});

export const collections = { biens, articles, auteurs, equipe, communes, avis };
