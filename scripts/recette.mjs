#!/usr/bin/env node
/* Recette statique du build — sans dépendance, à lancer après `npm run build` :
     node scripts/recette.mjs            → rapport (code de sortie 1 si un contrôle échoue)
   Contrôles (docs/handoff/prompts/99-recette.md §1-§3) :
     · sitemap.xml = exactement les routes émises dans dist/ (hors /404)
     · aucun href="#" nu ; inventaire des data-planned par page
     · tous les liens internes (href, src) résolvent vers un fichier de dist/,
       et leur ancre #id existe dans la page cible
     · aucune ancre imbriquée ; chaque carte (.card, .art-feature, .post, .art-mini)
       porte exactement un lien
     · aucune couleur de charte en dur dans src/ hors src/styles/ds/ (les
       fallbacks var(--green,#…) des scripts de carte sont tolérés) */
import fs from "node:fs";
import path from "node:path";

const DIST = "dist";
const SITE_RE = /^https?:\/\/[^/]+/;
let failures = 0;
const fail = (msg) => { failures++; console.log("  ✗ " + msg); };
const ok = (msg) => console.log("  ✓ " + msg);

/* ── pages du build ── */
const pages = new Map(); // route → html
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name === "index.html") {
      const rel = path.relative(DIST, d).split(path.sep).filter(Boolean).join("/");
      pages.set("/" + rel, fs.readFileSync(f, "utf8"));
    }
  }
};
walk(DIST);
pages.set("/404", fs.readFileSync(path.join(DIST, "404.html"), "utf8"));
const routes = [...pages.keys()].sort();

/* ── 1 · sitemap ── */
console.log("\n§1 Sitemap");
const sitemap = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE_RE, "").replace(/\/$/, "") || "/"));
const expected = new Set(routes.filter((r) => r !== "/404"));
const missing = [...expected].filter((r) => !listed.has(r)), extra = [...listed].filter((r) => !expected.has(r));
missing.length ? fail(`manquantes dans le sitemap : ${missing.join(", ")}`) : ok(`${expected.size} routes émises, toutes dans le sitemap`);
extra.length ? fail(`en trop dans le sitemap : ${extra.join(", ")}`) : ok("aucune route en trop dans le sitemap");

/* ── 1 · href="#", data-planned ── */
console.log("\n§1 Liens nus et pages planifiées");
let bare = 0; const planned = new Map();
for (const [r, html] of pages) {
  bare += (html.match(/href="#"/g) || []).length;
  for (const m of html.matchAll(/<a\b([^>]*\bdata-planned\b[^>]*)>([\s\S]*?)<\/a>/g)) {
    // Cible absente → pas de href (jamais de lien vers une 404) : l'URL prévue est en data-href.
    const href = /(?<![\w-])href="([^"]*)"/.exec(m[1])?.[1] ?? (/data-href="([^"]*)"/.exec(m[1])?.[1] ? "(prévu) " + /data-href="([^"]*)"/.exec(m[1])[1] : "");
    const label = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!planned.has(href)) planned.set(href, { label, pages: new Set() });
    planned.get(href).pages.add(r);
  }
}
bare ? fail(`${bare} href="#" nu(s)`) : ok('0 href="#"');
console.log(`  · ${planned.size} cible(s) data-planned :`);
for (const [href, { label, pages: ps }] of [...planned].sort()) console.log(`    ${href || "(sans href)"} « ${label} » — ${ps.size} page(s)`);

/* ── 1 · résolution des liens internes ── */
console.log("\n§1 Liens internes");
const exists = (p) => {
  const f = path.join(DIST, p);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, "index.html")));
};
const ids = new Map(); // route → Set(id)
const idsOf = (route) => {
  if (!ids.has(route)) ids.set(route, new Set([...(pages.get(route) || "").matchAll(/\s(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(route);
};
let links = 0, broken = [];
for (const [r, html] of pages) {
  for (const m of html.matchAll(/(?<![\w-])(?:href|src)="([^"]+)"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#$)/.test(u) || u.startsWith("//")) continue;
    if (u.startsWith("#")) { const id = u.slice(1); if (id && !idsOf(r).has(id) && !idsOf(r).has(decodeURIComponent(id))) broken.push(`${r} → ${u} (ancre absente)`); continue; }
    if (!u.startsWith("/")) continue;
    links++;
    const [p, hash] = u.split("#"); const clean = decodeURIComponent(p.split("?")[0]);
    if (!exists(clean)) { broken.push(`${r} → ${u}`); continue; }
    if (hash) { const target = clean.replace(/\/$/, "") || "/"; if (pages.has(target) && !idsOf(target).has(hash)) broken.push(`${r} → ${u} (ancre #${hash} absente de ${target})`); }
  }
}
broken.length ? (fail(`${broken.length} lien(s) cassé(s) sur ${links}`), broken.forEach((b) => console.log("     " + b))) : ok(`${links} liens internes, tous résolus (fichier + ancre)`);

/* ── 2 · ancres imbriquées, cartes ── */
console.log("\n§2 Ancres et cartes");
let nested = [], cardsBad = [], multi = new Set();
for (const [r, html] of pages) {
  let depth = 0;
  for (const m of html.matchAll(/<a\b|<\/a>/g)) { if (m[0] === "<a") { if (depth > 0) nested.push(r); depth++; } else depth = Math.max(0, depth - 1); }
  for (const m of html.matchAll(/<article\b[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/article>/g)) {
    const cls = m[1].split(/\s+/);
    if (!cls.some((c) => ["card", "art-feature", "post", "art-mini"].includes(c))) continue;
    // Une .card sans .card-link (MarketCard du hub des localités) porte plusieurs liens à dessein.
    if (cls.includes("card") && !/class="card-link"/.test(m[2])) { multi.add(r); continue; }
    const n = (m[2].match(/<a\b[^>]*(?<![\w-])href=/g) || []).length;
    if (n !== 1) cardsBad.push(`${r} : <article class="${cls.slice(0, 2).join(" ")}"> — ${n} lien(s)`);
  }
}
nested.length ? fail(`ancres imbriquées : ${[...new Set(nested)].join(", ")}`) : ok("0 ancre imbriquée");
cardsBad.length ? (fail(`${cardsBad.length} carte(s) sans lien unique`), cardsBad.slice(0, 20).forEach((c) => console.log("     " + c))) : ok("chaque carte à lien étendu porte exactement un lien");
if (multi.size) console.log(`  · cartes multi-liens assumées (.card sans .card-link — MarketCard) : ${[...multi].join(", ")}`);

/* ── 3 · couleurs en dur ── */
console.log("\n§3 Couleurs de charte en dur (src/ hors ds/)");
const hex = [];
const scan = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { if (!f.split(path.sep).join("/").includes("src/styles/ds")) scan(f); continue; }
    if (!/\.(astro|tsx?|css|mjs|js)$/.test(e.name)) continue;
    fs.readFileSync(f, "utf8").split("\n").forEach((l, i) => {
      if (/#(17413B|00A678|EDE300|0E2B27)/i.test(l) && !/var\(--[a-z-]+,\s*#/i.test(l) && !/^\s*(\/\*|\*|\/\/)/.test(l)) hex.push(`${f}:${i + 1}`);
    });
  }
};
scan("src");
hex.length ? (fail(`${hex.length} occurrence(s)`), hex.forEach((h) => console.log("     " + h))) : ok("0 hex de charte hors tokens (fallbacks var(--x,#…) et commentaires tolérés)");

console.log(failures ? `\n${failures} contrôle(s) en échec` : "\nRecette statique : conforme");
process.exit(failures ? 1 : 0);
