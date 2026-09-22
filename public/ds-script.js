/* ============================================================
   Avenir — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById("header");
  const onScroll = () => { if (header) header.classList.toggle("scrolled", window.scrollY > 12); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile drawer ---------- */
  const drawer = document.getElementById("drawer");
  const openDrawer = () => { if (!drawer) return; drawer.style.removeProperty("transform"); drawer.style.removeProperty("visibility"); drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
  const closeDrawer = () => { if (!drawer) return; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  const burgerBtn = document.getElementById("burger");
  if (burgerBtn) burgerBtn.addEventListener("click", openDrawer);
  const drawerClose = document.getElementById("drawerClose");
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawer) drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDrawer));

  /* ---------- Hero search (Estimer / Acheter / Louer) ---------- */
  const heroSearch = document.getElementById("heroSearch");
  const hsTabs = document.querySelectorAll(".hs-tab");
  const hsEstimerRow = document.getElementById("hsEstimerRow");
  const hsSearchRow = document.getElementById("hsSearchRow");
  const hsLoc = document.getElementById("hsLoc");
  const hsLocate = document.getElementById("hsLocate");
  let hsMode = "estimer";
  const scrollToId = (id) => {
    const t = document.getElementById(id);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  };
  hsTabs.forEach((t) =>
    t.addEventListener("click", () => {
      hsTabs.forEach((x) => { x.classList.remove("on"); x.setAttribute("aria-selected", "false"); });
      t.classList.add("on"); t.setAttribute("aria-selected", "true");
      hsMode = t.dataset.mode;
      const estimer = hsMode === "estimer";
      hsEstimerRow.hidden = !estimer;
      hsSearchRow.hidden = estimer;
      if (hsLoc && !estimer) hsLoc.placeholder = hsMode === "louer" ? "Où souhaitez-vous louer ?" : "Où souhaitez-vous acheter ?";
    })
  );
  if (heroSearch) {
    heroSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      scrollToId(hsMode === "estimer" ? "estimation" : "biens");
    });
  }
  if (hsLocate) {
    hsLocate.addEventListener("click", (e) => {
      e.preventDefault();
      const field = hsMode === "estimer" ? document.getElementById("hsEstLoc") : hsLoc;
      if (field) { field.value = "Ma position actuelle"; field.focus(); }
    });
  }

  /* ---------- Custom dropdowns (Type de bien / Budget) ---------- */
  const dropdowns = document.querySelectorAll(".hs-field--dd");
  const closeDropdowns = (except) => {
    dropdowns.forEach((f) => {
      if (f === except) return;
      f.classList.remove("open");
      const b = f.querySelector(".hs-dd-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  };
  dropdowns.forEach((field) => {
    const btn = field.querySelector(".hs-dd-btn");
    const val = field.querySelector(".hs-dd-val");
    field.addEventListener("click", (e) => {
      if (e.target.closest(".hs-dd-opt")) return;
      const open = !field.classList.contains("open");
      closeDropdowns(field);
      field.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    field.querySelectorAll(".hs-dd-opt").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        val.textContent = opt.textContent;
        val.classList.remove("is-placeholder");
        field.dataset.value = opt.dataset.v;
        field.querySelectorAll(".hs-dd-opt").forEach((o) => o.classList.remove("sel"));
        opt.classList.add("sel");
        field.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".hs-field--dd")) closeDropdowns(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDropdowns(); });

  /* ---------- Property filters ---------- */
  const filters = document.getElementById("filters");
  const cards = Array.from(document.querySelectorAll("#propGrid .card"));
  if (filters && !document.getElementById("selLoc")) filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    filters.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    const f = btn.dataset.f;
    cards.forEach((c) => {
      const show = f === "all" || c.dataset.cat === f;
      c.classList.toggle("hide", !show);
    });
  });

  /* ---------- Favorite toggle ---------- */
  document.querySelectorAll(".card-fav").forEach((b) => {
    b.addEventListener("click", () => {
      const on = b.textContent.trim() === "♥";
      b.textContent = on ? "♡" : "♥";
      b.style.color = on ? "" : "var(--green)";
    });
  });

  /* ---------- Estimation multi-step form ---------- */
  const form = document.getElementById("estForm");
  if (form) {
    const steps = Array.from(form.querySelectorAll(".est-step"));
    const progress = Array.from(document.querySelectorAll("#ecProgress span"));
    const stepLabel = document.getElementById("ecStep");
    let cur = 1;
    const TOTAL = 3;

    const show = (n) => {
      steps.forEach((s) => s.classList.toggle("on", s.dataset.step === String(n)));
      progress.forEach((p, i) => p.classList.toggle("on", i < n));
      if (typeof n === "number") stepLabel.textContent = `Étape ${n} / ${TOTAL}`;
    };

    // type choice
    const typeChoice = document.getElementById("typeChoice");
    typeChoice.addEventListener("click", (e) => {
      const c = e.target.closest(".choice");
      if (!c) return;
      typeChoice.querySelectorAll(".choice").forEach((x) => x.classList.remove("on"));
      c.classList.add("on");
    });

    const markErr = (el, bad) => el && el.classList.toggle("err", bad);

    const validate = (n) => {
      if (n === 1) {
        const cp = document.getElementById("cp");
        const ok = /^\d{4}$/.test(cp.value.trim());
        markErr(cp, !ok);
        return ok;
      }
      if (n === 2) {
        const surf = document.getElementById("surf");
        const rooms = document.getElementById("rooms");
        const okS = surf.value.trim() !== "" && !isNaN(+surf.value);
        const okR = rooms.value !== "";
        markErr(surf, !okS); markErr(rooms, !okR);
        return okS && okR;
      }
      if (n === 3) {
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const okN = name.value.trim().length > 1;
        const okE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
        const okP = phone.value.replace(/[^0-9]/g, "").length >= 8;
        markErr(name, !okN); markErr(email, !okE); markErr(phone, !okP);
        return okN && okE && okP;
      }
      return true;
    };

    // instant indicative price range
    const fmt = (v) => Math.round(v / 5000) * 5000;
    const euro = (v) => v.toLocaleString("fr-BE").replace(/\u202f|,/g, "\u00a0") + "\u00a0€";
    const computeRange = () => {
      const base = { Maison: 1950, Appartement: 2200, Villa: 2650, Terrain: 330 };
      const cpMult = { "6280": 1.28, "6110": 1.18, "6120": 1.12, "6032": 1.06, "6041": 0.95, "6000": 0.9 };
      const roomsAdj = { "1 à 2": 0.96, "3 à 4": 1.0, "5 et plus": 1.06 };
      const type = (document.querySelector("#typeChoice .choice.on") || {}).dataset?.v || "Maison";
      const surf = Math.max(20, Math.min(2000, parseInt(document.getElementById("surf").value, 10) || 150));
      const cp = (document.getElementById("cp").value || "").trim();
      const rooms = document.getElementById("rooms").value;
      const mid = (base[type] || 2000) * surf * (cpMult[cp] || 1.0) * (roomsAdj[rooms] || 1.0);
      return [fmt(mid * 0.92), fmt(mid * 1.08)];
    };

    form.querySelectorAll("[data-next]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!validate(cur)) return;
        cur = Math.min(cur + 1, TOTAL);
        show(cur);
      })
    );
    form.querySelectorAll("[data-back]").forEach((b) =>
      b.addEventListener("click", () => { cur = Math.max(cur - 1, 1); show(cur); })
    );

    // clear error on input
    form.querySelectorAll("input, select").forEach((el) =>
      el.addEventListener("input", () => el.classList.remove("err"))
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(3)) return;
      const [lo, hi] = computeRange();
      const rangeEl = document.getElementById("edRange");
      if (rangeEl) rangeEl.textContent = euro(lo) + "  –  " + euro(hi);
      steps.forEach((s) => s.classList.remove("on"));
      form.querySelector('[data-step="done"]').classList.add("on");
      progress.forEach((p) => p.classList.add("on"));
      stepLabel.textContent = "Terminé";
    });
  }

  /* ---------- Testimonials ---------- */
  /* ---------- Team carousel ---------- */
  const teamTrack = document.getElementById("teamTrack");
  if (teamTrack) {
    const prev = document.getElementById("teamPrev");
    const next = document.getElementById("teamNext");
    const step = () => {
      const c = teamTrack.querySelector(".member");
      return c ? c.getBoundingClientRect().width + 24 : 300;
    };
    const update = () => {
      prev.disabled = teamTrack.scrollLeft <= 4;
      next.disabled = teamTrack.scrollLeft + teamTrack.clientWidth >= teamTrack.scrollWidth - 4;
    };
    next.addEventListener("click", () => teamTrack.scrollBy({ left: step(), behavior: "smooth" }));
    prev.addEventListener("click", () => teamTrack.scrollBy({ left: -step(), behavior: "smooth" }));
    teamTrack.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    const setH = () => { a.style.maxHeight = item.classList.contains("open") ? a.scrollHeight + "px" : "0px"; };
    if (item.classList.contains("open")) requestAnimationFrame(setH);
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((o) => {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = "0px";
      });
      if (!isOpen) { item.classList.add("open"); setH(); }
    });
  });
  window.addEventListener("resize", () => {
    const open = document.querySelector(".faq-item.open .faq-a");
    if (open) open.style.maxHeight = open.scrollHeight + "px";
  });

  /* ---------- Newsletter (footer) ---------- */
  const newsForm = document.getElementById("newsForm");
  if (newsForm) newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim())) { input.style.borderColor = "#d98b73"; return; }
    input.value = "Merci, c'est noté ✓";
    input.disabled = true;
    input.style.borderColor = "";
  });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Stats count-up ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const countUp = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const cv = el.querySelector(".cv");
    if (!cv) return;
    if (reduceMotion) { cv.textContent = target; return; }
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      cv.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statIo = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { countUp(en.target); statIo.unobserve(en.target); } }),
    { threshold: 0.6 }
  );
  document.querySelectorAll(".s-num[data-count]").forEach((el) => statIo.observe(el));

  /* ---------- Smooth anchor offset for sticky header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
  /* ---------- Menus déroulants custom (DS DropdownMenu) ---------- */
  const ddAll = [];
  const closeDD = (except) => ddAll.forEach((d) => {
    if (d.wrap === except) return;
    d.wrap.classList.remove("open");
    d.btn.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll(".field select, .tool-select select").forEach((sel) => {
    const inline = !!sel.closest(".tool-select");
    if (inline) sel.closest(".tool-select").classList.add("dd-host");
    const wrap = document.createElement("div");
    wrap.className = "dd" + (inline ? " dd--inline" : "");
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "dd-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    if (sel.getAttribute("aria-label")) btn.setAttribute("aria-label", sel.getAttribute("aria-label"));
    const val = document.createElement("span"); val.className = "dd-val";
    btn.appendChild(val);
    const menu = document.createElement("ul"); menu.className = "dd-menu"; menu.setAttribute("role", "listbox");
    const opts = Array.from(sel.options);
    opts.forEach((o) => {
      const li = document.createElement("li");
      li.className = "dd-opt"; li.setAttribute("role", "option");
      li.textContent = o.textContent; li.dataset.v = o.value;
      li.addEventListener("click", () => {
        sel.value = o.value;
        sel.dispatchEvent(new Event("input", { bubbles: true }));
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
        wrap.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
      menu.appendChild(li);
    });
    function sync() {
      const cur = sel.options[sel.selectedIndex];
      val.textContent = cur ? cur.textContent : "";
      val.classList.toggle("is-placeholder", !inline && (!cur || cur.value === ""));
      menu.querySelectorAll(".dd-opt").forEach((li) => {
        const on = cur && li.dataset.v === cur.value;
        li.classList.toggle("sel", !!on);
        li.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
    btn.addEventListener("click", () => {
      const open = !wrap.classList.contains("open");
      closeDD(wrap);
      wrap.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    sync();
    sel._ddSync = sync;
    sel.addEventListener("change", sync);
    wrap.appendChild(btn); wrap.appendChild(menu);
    sel.dataset.dd = "1";
    sel.insertAdjacentElement("afterend", wrap);
    ddAll.push({ wrap, btn });
  });
  document.addEventListener("mousedown", (e) => { if (!e.target.closest(".dd")) closeDD(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDD(); });

})();

/* Sommaire des pages légales — scroll-spy (actif seulement si #toc présent) */
(function () {
  "use strict";
  if (!document.getElementById("toc")) return;
  var links = Array.prototype.slice.call(document.querySelectorAll("#toc a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function setOn(id) {
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + id); });
  }
  if ("IntersectionObserver" in window) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { setOn(sections[i].id); break; }
      }
    }, { rootMargin: "-100px 0px -55% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }
})();

