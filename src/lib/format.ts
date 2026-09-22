/* Formatage localisé fr-BE : prix, surfaces, dates.
   Centralisé ici pour garantir un rendu cohérent dans tout le site. */

const LOCALE = "fr-BE";

const eur = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** Prix en euros sans décimales : formatPrix(285000) → « 285 000 € ». */
export function formatPrix(montant: number): string {
  return eur.format(montant);
}

/** Surface en m² : formatSurface(120) → « 120 m² ». */
export function formatSurface(m2: number): string {
  return `${new Intl.NumberFormat(LOCALE).format(m2)} m²`;
}

/** Date longue : formatDate(new Date("2026-09-22")) → « 22 septembre 2026 ». */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Année seule, pour les mentions « chiffres 2026 ». */
export function formatAnnee(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return String(d.getFullYear());
}
