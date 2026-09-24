/* Filtre par thème, tri et pagination du hub /blog — gabarit 12.

   Reprend le motif de listing-filter.ts (liste des biens) sans ses cinq
   états (squelette, vide, « élargir autour ») : les thèmes du segment sont
   ceux réellement présents dans la collection, un filtre ne peut donc pas
   renvoyer zéro article. Les cartes sont toutes dans le HTML (SEO) ; le
   script bascule leur attribut hidden ([hidden] gagne sur .post en
   display:flex, règle de local.css), réordonne et pagine.

   Contrat d'URL : ?cat=<slug de thème>&page=N — reflété à chaque rendu
   (replaceState) et lu au chargement (le fil d'Ariane JSON-LD des articles
   pointe vers /blog?cat=…).

   La carte à la une (#blogFeature) suit le filtre : masquée quand son thème
   n'est pas celui choisi, comptée dans le total, hors pagination.

   S'exécute APRÈS /ds-script.js (script classique en fin de body), qui
   enhance le <select> de tri et relaie ses « change ». Le segment porte un
   id distinct de #filters pour ne pas déclencher le filtre biens du DS. */

/** Slug d'un thème éditorial (« Marché » → marche) — clé du contrat ?cat=. */
export function slugCategorie(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface BlogFilterOptions {
  perPage: number;
  /** Ancre des liens de pagination (défaut #articles). */
  anchor?: string;
  ids?: Partial<{
    seg: string;
    grid: string;
    feature: string;
    count: string;
    reset: string;
    sort: string;
  }>;
}

export function initBlogFilter(o: BlogFilterOptions): void {
  const ids = {
    seg: "blogCats",
    grid: "blogGrid",
    feature: "blogFeature",
    count: "toolCount",
    reset: "toolReset",
    sort: "selSort",
    ...o.ids,
  };
  const seg = document.getElementById(ids.seg);
  const grid = document.getElementById(ids.grid);
  if (!seg || !grid) return;
  const cards = Array.from(grid.children) as HTMLElement[];
  const feature = document.getElementById(ids.feature);
  const count = document.getElementById(ids.count);
  const reset = document.getElementById(ids.reset) as HTMLButtonElement | null;
  const sort = document.getElementById(ids.sort) as HTMLSelectElement | null;
  const pagi = document.querySelector(".pagination") as HTMLElement | null;
  const btns = Array.from(seg.querySelectorAll("button")) as HTMLButtonElement[];
  const valides = new Set(btns.map((b) => b.dataset.f || "all"));
  const PER = o.perPage;
  const ANCHOR = o.anchor ?? "#articles";
  let cat = "all";
  let page = 1;

  /* État initial depuis l'URL. */
  const p0 = new URLSearchParams(location.search);
  const c0 = p0.get("cat");
  if (c0 && valides.has(c0)) cat = c0;
  const pg0 = parseInt(p0.get("page") || "", 10);
  if (pg0 > 1) page = pg0;

  const matches = (el: HTMLElement) => cat === "all" || el.dataset.cat === cat;

  function syncUrl() {
    const p = new URLSearchParams();
    if (cat !== "all") p.set("cat", cat);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }

  function render() {
    let total = 0;
    if (feature) {
      const ok = matches(feature);
      feature.hidden = !ok;
      if (ok) total++;
    }
    const kept = cards.filter(matches);
    total += kept.length;

    /* Tri : « recent » = ordre du HTML (date décroissante) ; « read » = temps
       de lecture croissant, départagé par l'ordre initial. */
    const s = sort?.value ?? "recent";
    kept.sort((a, b) =>
      s === "read"
        ? +(a.dataset.read || 0) - +(b.dataset.read || 0) || +a.dataset.idx! - +b.dataset.idx!
        : +a.dataset.idx! - +b.dataset.idx!,
    );

    const pages = Math.max(1, Math.ceil(kept.length / PER));
    if (page > pages) page = 1;
    const shown = kept.slice((page - 1) * PER, page * PER);
    cards.forEach((c) => (c.hidden = true));
    shown.forEach((c) => {
      c.hidden = false;
      grid!.appendChild(c);
    });

    if (count) {
      count.textContent =
        (total === 0 ? "Aucun article" : total + (total > 1 ? " articles" : " article")) +
        (pages > 1 ? " · page " + page + " sur " + pages : "");
    }
    if (reset) reset.hidden = cat === "all";
    btns.forEach((b) => b.classList.toggle("on", (b.dataset.f || "all") === cat));

    /* Pagination réelle — puces régénérées, « suivant » = puce → */
    if (pagi) {
      pagi.textContent = "";
      pagi.hidden = pages < 2;
      const goTo = (n: number) => (e: Event) => {
        e.preventDefault();
        page = n;
        render();
        const target = document.querySelector(ANCHOR);
        if (target) target.scrollIntoView({ block: "start" });
      };
      for (let i = 1; i <= pages; i++) {
        if (i === page) {
          const cur = document.createElement("span");
          cur.className = "cur";
          cur.textContent = String(i);
          pagi.appendChild(cur);
        } else {
          const a = document.createElement("a");
          a.href = ANCHOR;
          a.textContent = String(i);
          a.addEventListener("click", goTo(i));
          pagi.appendChild(a);
        }
      }
      if (pages > 1 && page < pages) {
        const nx = document.createElement("a");
        nx.href = ANCHOR;
        nx.setAttribute("aria-label", "Page suivante");
        nx.textContent = "→";
        nx.addEventListener("click", goTo(page + 1));
        pagi.appendChild(nx);
      }
    }

    syncUrl();
  }

  seg.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("button");
    if (!btn) return;
    cat = btn.dataset.f || "all";
    page = 1;
    render();
  });
  reset?.addEventListener("click", () => {
    cat = "all";
    page = 1;
    render();
  });
  sort?.addEventListener("change", () => {
    page = 1;
    render();
  });

  render();
}
