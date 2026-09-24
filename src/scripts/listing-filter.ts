/* Filtrage, tri, pagination et 5 états des listes de biens — logique commune
   extraite du <script> de /biens (gabarit 02), elle-même reprise des scripts
   inline des références biens.html et maison-a-vendre-liege.html.

   Consommée par src/pages/biens/index.astro et par la route de localité
   [type]-a-[transaction]-[commune].astro. S'exécute APRÈS /ds-script.js
   (script classique en fin de body) dont elle utilise l'enhanceur de
   <select> (_ddSync). Les cartes portent les data-* filtrables ; les états
   (squelette, vide, « élargir autour ») sont déjà dans le HTML, seuls leurs
   attributs hidden basculent. */

type SyncableSelect = HTMLSelectElement & { _ddSync?: () => void };

export interface SelectFilter {
  /** id du <select> dans la Toolbar. */
  id: string;
  /** Clé dataset des cartes (data-loc → "loc", data-q → "q"). */
  data: string;
  /** Paramètre d'URL lu au chargement (et réécrit si urlSync). */
  param?: string;
  /** Intervalle numérique "lo-hi" (budget/loyer) au lieu d'une égalité. */
  range?: boolean;
}

export interface ListingOptions {
  perPage: number;
  /** Libellés des segments — chips retirables de l'état vide (data-f → texte). */
  catLabels: Record<string, string>;
  /** Paramètre d'URL du segment ("cat" sur /biens, "type" en localité). */
  catParam?: string;
  selects?: SelectFilter[];
  /** Recherche texte + « vouliez-vous dire » (Levenshtein ≤ 2). */
  search?: { id: string; hintId: string; param?: string; dict?: string[] };
  /** Contrat d'URL : reflète l'état courant à chaque rendu (replaceState). */
  urlSync?: boolean;
  /** Seuil du bandeau « élargir autour » (affiché de 1 à widenMax résultats). */
  widenMax?: number;
  /** ids par défaut : propGrid, skGrid, toolCount, toolReset, widenBand,
      emptyState, emptyCrit, emptyReset, filters. */
  ids?: Partial<{
    grid: string;
    skeleton: string;
    count: string;
    reset: string;
    widen: string;
    empty: string;
    crit: string;
    emptyReset: string;
    seg: string;
  }>;
  /** Ancre des liens de pagination. */
  anchor?: string;
}

export function initListingFilter(o: ListingOptions): void {
  const ids = {
    grid: "propGrid",
    skeleton: "skGrid",
    count: "toolCount",
    reset: "toolReset",
    widen: "widenBand",
    empty: "emptyState",
    crit: "emptyCrit",
    emptyReset: "emptyReset",
    seg: "filters",
    ...o.ids,
  };
  const grid = document.getElementById(ids.grid);
  const sk = document.getElementById(ids.skeleton);
  if (!grid || !sk) return;
  const cards = Array.from(grid.children) as HTMLElement[];
  const selects = (o.selects ?? []).map((f) => ({
    ...f,
    el: document.getElementById(f.id) as SyncableSelect,
  }));
  const selSort = document.getElementById("selSort") as HTMLSelectElement;
  const qIn = o.search ? (document.getElementById(o.search.id) as HTMLInputElement) : null;
  const hint = o.search ? document.getElementById(o.search.hintId) : null;
  const count = document.getElementById(ids.count)!;
  const reset = document.getElementById(ids.reset) as HTMLButtonElement;
  const widen = document.getElementById(ids.widen);
  const empty = document.getElementById(ids.empty)!;
  const crit = document.getElementById(ids.crit)!;
  const pagi = document.querySelector(".pagination") as HTMLElement;
  const segBtns = Array.from(
    document.querySelectorAll(`#${ids.seg} button`),
  ) as HTMLElement[];
  const CAT = o.catLabels;
  const PER_PAGE = o.perPage;
  const WIDEN_MAX = o.widenMax ?? 3;
  const ANCHOR = o.anchor ?? "#resultats";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cat = "all";
  let page = 1;
  let pending: ReturnType<typeof setTimeout> | undefined;

  const norm = (s: string | null | undefined) =>
    (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  const labelOf = (sel: HTMLSelectElement) =>
    sel.options[sel.selectedIndex]
      ? sel.options[sel.selectedIndex].text.replace(/\s*\(\d+\)$/, "")
      : "";
  const sync = (sel: SyncableSelect) => {
    if (sel._ddSync) sel._ddSync();
  };

  /* Dictionnaire « vouliez-vous dire » : options des selects d'égalité + mots
     fournis par la page. */
  const DICT: string[] = [];
  if (o.search) {
    selects
      .filter((f) => !f.range)
      .forEach((f) =>
        Array.from(f.el.options).forEach((opt) => {
          if (opt.value !== "all") DICT.push(opt.text.replace(/\s*\(\d+\)$/, ""));
        }),
      );
    (o.search.dict ?? []).forEach((w) => {
      if (!DICT.includes(w)) DICT.push(w);
    });
  }

  function lev(a: string, b: string) {
    const m = a.length,
      n = b.length;
    if (!m || !n) return Math.max(m, n);
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }
  function suggest(term: string) {
    const t = norm(term);
    if (t.length < 4) return null;
    let best: string | null = null;
    let score = 3; /* Levenshtein ≤ 2 */
    DICT.forEach((w) => {
      const d = lev(t, norm(w));
      if (d > 0 && d < score) {
        score = d;
        best = w;
      }
    });
    return best;
  }

  /* État initial depuis l'URL (?cat/?type, selects, ?q, ?page). */
  const p0 = new URLSearchParams(location.search);
  const catParam = o.catParam ?? "cat";
  const urlCat = p0.get(catParam);
  if (urlCat && CAT[urlCat]) cat = urlCat;
  selects.forEach((f) => {
    const v = f.param ? p0.get(f.param) : null;
    if (v && Array.from(f.el.options).some((opt) => opt.value === v)) f.el.value = v;
  });
  if (qIn && o.search!.param && p0.get(o.search!.param)) qIn.value = p0.get(o.search!.param)!;
  const pg0 = parseInt(p0.get("page") || "", 10);
  if (pg0 > 1) page = pg0;
  segBtns.forEach((x) => x.classList.toggle("on", x.dataset.f === cat));
  selects.forEach((f) => sync(f.el));

  function matches(c: HTMLElement) {
    if (cat !== "all" && c.dataset.cat !== cat) return false;
    for (const f of selects) {
      if (f.el.value === "all") continue;
      if (f.range) {
        const [lo, hi] = f.el.value.split("-").map(Number);
        const v = +(c.dataset[f.data] || 0);
        if (v < lo || v > hi) return false;
      } else if (c.dataset[f.data] !== f.el.value) {
        return false;
      }
    }
    if (qIn) {
      const q = norm(qIn.value);
      if (q && !norm(c.textContent).includes(q)) return false;
    }
    return true;
  }

  /* Contrat d'URL (/biens) : l'état courant est reflété à chaque rendu. */
  function syncUrl() {
    if (!o.urlSync) return;
    const p = new URLSearchParams();
    if (cat !== "all") p.set(catParam, cat);
    selects.forEach((f) => {
      if (f.param && f.el.value !== "all") p.set(f.param, f.el.value);
    });
    if (qIn && o.search!.param && qIn.value.trim()) p.set(o.search!.param, qIn.value.trim());
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  function render() {
    const kept = cards.filter(matches);
    const s = selSort.value;
    kept.sort((a, b) =>
      s === "asc" ? +a.dataset.price! - +b.dataset.price! :
      s === "desc" ? +b.dataset.price! - +a.dataset.price! :
      s === "surf" ? +(b.dataset.surface || 0) - +(a.dataset.surface || 0) :
      +a.dataset.idx! - +b.dataset.idx!,
    );
    const pages = Math.max(1, Math.ceil(kept.length / PER_PAGE));
    if (page > pages) page = 1;
    const shown = kept.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    cards.forEach((c) => c.classList.add("hide"));
    shown.forEach((c) => {
      c.classList.remove("hide");
      grid!.appendChild(c);
    });

    count.textContent =
      kept.length === 0
        ? "Aucun bien ne correspond"
        : kept.length + (kept.length > 1 ? " biens affichés" : " bien affiché") +
          " · page " + page + " sur " + pages;

    const active =
      cat !== "all" ||
      selects.some((f) => f.el.value !== "all") ||
      (qIn ? qIn.value.trim() !== "" : false);
    reset.hidden = !active;

    grid!.hidden = kept.length === 0;
    empty.hidden = kept.length !== 0;
    if (widen) widen.hidden = !(kept.length > 0 && kept.length <= WIDEN_MAX);

    /* Pagination réelle — puces régénérées, « suivant » = puce → */
    pagi.textContent = "";
    pagi.hidden = pages < 2;
    const goTo = (n: number) => () => {
      page = n;
      run();
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

    /* Critères actifs, retirables un par un (état zéro) */
    crit.textContent = "";
    if (kept.length === 0) {
      const chips: [string, () => void][] = [];
      if (cat !== "all")
        chips.push([
          CAT[cat],
          () => {
            cat = "all";
            segBtns.forEach((x) => x.classList.toggle("on", x.dataset.f === "all"));
          },
        ]);
      selects.forEach((f) => {
        if (f.el.value !== "all")
          chips.push([
            labelOf(f.el),
            () => {
              f.el.value = "all";
              sync(f.el);
            },
          ]);
      });
      if (qIn && qIn.value.trim())
        chips.push(["« " + qIn.value.trim() + " »", () => { qIn.value = ""; }]);
      chips.forEach(([label, undo]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = label + " "; /* pas d'innerHTML : label peut venir de q */
        const x = document.createElement("span");
        x.setAttribute("aria-hidden", "true");
        x.textContent = "×";
        btn.appendChild(x);
        btn.setAttribute("aria-label", "Retirer le critère " + label);
        btn.addEventListener("click", () => {
          undo();
          page = 1;
          run();
        });
        crit.appendChild(btn);
      });
    }

    /* « Vouliez-vous dire » (Levenshtein ≤ 2 sur le dictionnaire) */
    if (qIn && hint) {
      const term = qIn.value.trim();
      const alt = kept.length === 0 && term ? suggest(term) : null;
      if (alt) {
        hint.hidden = false;
        /* pas d'innerHTML : term est une saisie utilisateur (aussi via ?q=) */
        hint.textContent = "Aucun résultat pour « " + term + " ». Vouliez-vous dire ";
        const btn = document.createElement("button");
        btn.type = "button";
        const b = document.createElement("b");
        b.textContent = alt;
        btn.appendChild(b);
        btn.addEventListener("click", () => {
          qIn.value = alt!;
          page = 1;
          run();
        });
        hint.appendChild(btn);
        hint.appendChild(document.createTextNode(" ?"));
      } else {
        hint.hidden = true;
        hint.textContent = "";
      }
    }

    syncUrl();
  }

  /* Squelette entre deux jeux de résultats — coupé si reduced motion. */
  function run() {
    if (REDUCED) {
      render();
      return;
    }
    clearTimeout(pending);
    count.textContent = "Recherche…";
    sk!.hidden = false;
    grid!.hidden = true;
    empty.hidden = true;
    if (widen) widen.hidden = true;
    if (hint) hint.hidden = true;
    pagi.hidden = true;
    pending = setTimeout(() => {
      sk!.hidden = true;
      render();
    }, 340);
  }

  document.getElementById(ids.seg)!.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("button");
    if (!btn) return;
    cat = btn.dataset.f || "all";
    segBtns.forEach((x) => x.classList.toggle("on", x === btn));
    page = 1;
    run();
  });
  function clearAll() {
    cat = "all";
    selects.forEach((f) => {
      f.el.value = "all";
      sync(f.el);
    });
    if (qIn) qIn.value = "";
    page = 1;
    segBtns.forEach((x) => x.classList.toggle("on", x.dataset.f === "all"));
    run();
  }
  reset.addEventListener("click", clearAll);
  document.getElementById(ids.emptyReset)!.addEventListener("click", clearAll);
  [...selects.map((f) => f.el), selSort].forEach((s) =>
    s.addEventListener("change", () => {
      page = 1;
      run();
    }),
  );
  if (qIn) {
    let typing: ReturnType<typeof setTimeout> | undefined;
    qIn.addEventListener("input", () => {
      page = 1;
      clearTimeout(typing);
      typing = setTimeout(run, 260);
    });
    qIn.addEventListener("search", () => {
      page = 1;
      run();
    });
  }

  render();
}
