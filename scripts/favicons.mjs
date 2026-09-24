/* Génère les icônes du site depuis l'artwork client (favicon-512.png).
   Usage : node scripts/favicons.mjs

   Pourquoi : le signe V couleur sur fond transparent disparaît dans les
   onglets sombres. On le pose sur une PLAQUE BLANCHE — l'artwork n'est ni
   redessiné ni recoloré (règle client), seul un fond est ajouté.

   Produit (noms hors motif favicon-*.png → jamais écrasés par sync-ds.sh) :
   · public/favicon.ico          16 + 32 + 48 (PNG embarqués, coins arrondis)
   · public/apple-touch-icon.png 180, plein cadre (iOS applique son masque)
   · public/icon-512.png         512, plein cadre
   À reprendre dans le DS : la visibilité des favicons devrait être réglée
   à la source (l'export ne livre que le signe sur transparent). */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "public/favicon-512.png"; // composition client, couleurs d'origine
const PLATE = "#ffffff";
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// Marge transparente d'origine retirée : à 16 px, chaque pixel compte.
const artwork = await sharp(SRC).trim().toBuffer();

async function tile(size, { radius = 0 } = {}) {
  const inner = Math.round(size * 0.78);
  const sign = await sharp(artwork)
    .resize(inner, inner, { fit: "contain", background: TRANSPARENT })
    .toBuffer();
  const rx = Math.round(size * radius);
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${rx}" fill="${PLATE}"/></svg>`,
  );
  return sharp(bg).composite([{ input: sign }]).png().toBuffer();
}

/* favicon.ico — conteneur ICO de PNG (supporté partout depuis Vista). */
const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) pngs.push(await tile(s, { radius: 0.2 }));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // réservé
header.writeUInt16LE(1, 2); // type icône
header.writeUInt16LE(sizes.length, 4);

let offset = 6 + 16 * sizes.length;
const entries = [];
pngs.forEach((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] % 256, 0); // largeur (0 = 256)
  e.writeUInt8(sizes[i] % 256, 1); // hauteur
  e.writeUInt16LE(1, 4); // plans
  e.writeUInt16LE(32, 6); // bpp
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  entries.push(e);
});
await writeFile("public/favicon.ico", Buffer.concat([header, ...entries, ...pngs]));

await writeFile("public/apple-touch-icon.png", await tile(180));
await writeFile("public/icon-512.png", await tile(512));

console.log("✓ favicon.ico (16/32/48) · apple-touch-icon.png · icon-512.png");
