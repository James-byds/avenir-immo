/* Constructeurs de JSON-LD (schema.org).
   Chaque fonction renvoie un objet sérialisable à injecter dans une balise
   <script type="application/ld+json">. Voir chrome/PageHead.astro. */

const SITE = "https://www.lavenir-immobilier.be";
const ORG_NAME = "L'Avenir Immobilier";

type FaqEntry = { question: string; reponse: string };

/** FAQPage — pour les pages de localité et les articles à FAQ. */
export function faqPage(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.reponse },
    })),
  };
}

type Listing = {
  titre: string;
  description: string;
  prix: number;
  url: string;
  image?: string[];
};

/** RealEstateListing — fiche bien. */
export function realEstateListing(bien: Listing) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: bien.titre,
    description: bien.description,
    url: bien.url.startsWith("http") ? bien.url : `${SITE}${bien.url}`,
    ...(bien.image?.length ? { image: bien.image } : {}),
    offers: {
      "@type": "Offer",
      price: bien.prix,
      priceCurrency: "EUR",
    },
  };
}

/** Organization — injecté une fois, typiquement dans BaseLayout. */
export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: ORG_NAME,
    url: SITE,
  };
}

/** Sérialise en toute sécurité pour l'insertion dans un <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
