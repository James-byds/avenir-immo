import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { slugCommune, slugCombinaison } from "../lib/maillage";
import type { TypeBien, Transaction } from "../lib/maillage";

/* Sitemap généré à la main (pas d'intégration @astrojs/sitemap) : on maîtrise
   exactement quelles routes de localité sont émises — jamais de combinaison vide. */

const SITE = "https://www.lavenir-immobilier.be";

export const GET: APIRoute = async () => {
  const urls = new Set<string>();

  // Pages fixes
  for (const p of [
    "", "contact", "estimation", "avis", "biens", "equipe", "blog", "auteurs",
    "legal/mentions", "legal/confidentialite", "legal/cookies", "legal/honoraires",
  ]) {
    urls.add(`${SITE}/${p}`.replace(/\/$/, p === "" ? "/" : ""));
  }

  // Fiches biens
  const biens = await getCollection("biens", ({ data }) => data.publie !== false);
  for (const b of biens) urls.add(`${SITE}/biens/${b.id}`);

  // Articles
  const articles = await getCollection("articles", ({ data }) => data.publie !== false);
  for (const a of articles) urls.add(`${SITE}/blog/${a.id}`);

  // Équipe & auteurs
  for (const m of await getCollection("equipe")) urls.add(`${SITE}/equipe/${m.id}`);
  for (const a of await getCollection("auteurs")) urls.add(`${SITE}/auteurs/${a.id}`);

  // Pages de localité — uniquement les combinaisons déclarées disponibles
  for (const commune of await getCollection("communes")) {
    const cs = slugCommune(commune.data.nom);
    for (const c of commune.data.combinaisons as { type: TypeBien; transaction: Transaction }[]) {
      urls.add(`${SITE}/${slugCombinaison(c.type, c.transaction, cs)}`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
