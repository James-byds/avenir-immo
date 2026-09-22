/* Maillage interne : combinaisons commune × type × transaction et leurs comptages.

   Règle du handoff : ne JAMAIS émettre de lien vers une combinaison vide.
   Chaque lien porte une ancre descriptive (exigée par le DS). Le motif d'URL
   [type]-a-[transaction]-[commune] est figé — le changer coûte des redirections. */

export type TypeBien = "maison" | "appartement" | "terrain" | "commerce" | "immeuble";
export type Transaction = "vente" | "location";

const VERBE: Record<Transaction, string> = {
  vente: "vendre",
  location: "louer",
};

const TYPE_PLURIEL: Record<TypeBien, string> = {
  maison: "maisons",
  appartement: "appartements",
  terrain: "terrains",
  commerce: "commerces",
  immeuble: "immeubles",
};

export interface Combinaison {
  type: TypeBien;
  transaction: Transaction;
  commune: string;
  communeSlug: string;
  slug: string; // ex. "maison-a-vendre-gerpinnes"
  ancre: string; // ex. "Maisons à vendre à Gerpinnes"
  count: number;
}

/** Normalise un nom de commune en slug d'URL (retire les diacritiques U+0300–U+036F). */
export function slugCommune(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL figée d'une combinaison : /maison-a-vendre-gerpinnes */
export function slugCombinaison(
  type: TypeBien,
  transaction: Transaction,
  communeSlug: string,
): string {
  return `${type}-a-${VERBE[transaction]}-${communeSlug}`;
}

/** Ancre descriptive : « Appartements à louer à Charleroi ». */
export function ancre(type: TypeBien, transaction: Transaction, commune: string): string {
  const t = TYPE_PLURIEL[type];
  return `${t.charAt(0).toUpperCase()}${t.slice(1)} à ${VERBE[transaction]} à ${commune}`;
}

type BienLike = { type: TypeBien; transaction: Transaction; commune: string };

/**
 * Calcule les combinaisons non vides à partir des biens publiés.
 * N'émet que celles dont le comptage est > 0.
 */
export function combinaisons(biens: BienLike[]): Combinaison[] {
  const counts = new Map<string, number>();
  for (const b of biens) {
    const key = `${b.type}|${b.transaction}|${b.commune}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const out: Combinaison[] = [];
  for (const [key, count] of counts) {
    if (count <= 0) continue; // jamais de lien vers une combinaison vide
    const [type, transaction, commune] = key.split("|") as [TypeBien, Transaction, string];
    const communeSlug = slugCommune(commune);
    out.push({
      type,
      transaction,
      commune,
      communeSlug,
      slug: slugCombinaison(type, transaction, communeSlug),
      ancre: ancre(type, transaction, commune),
      count,
    });
  }
  return out.sort((a, b) => b.count - a.count);
}
