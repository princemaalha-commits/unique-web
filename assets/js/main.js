/* =====================================================================
   MAIN SCRIPT — builds the page from content.js and runs the motion.
   You normally do not need to edit this file. Edit content.js instead.
   ===================================================================== */
(() => {
  "use strict";

  const C = window.SITE_CONTENT;
  const root = document.documentElement;
  const body = document.body;
  const appEl = document.getElementById("app");

  if (!C || !Array.isArray(C.phases)) {
    appEl.innerHTML =
      '<p class="fatal">Could not load <code>assets/js/content.js</code>. ' +
      "Check that the file exists and that it has no missing commas or quotation marks.</p>";
    return;
  }

  /* ---------- Helpers ---------- */
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (v = "") =>
    String(v).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  const delay = (ms) => `style="--d:${ms}ms"`;
  const owner = C.owner || {};
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReduced = () => reduceQuery.matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const initials = (name = "") =>
    name.replace(/[[\]]/g, "").split(/\s+/).filter(Boolean)
      .slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "•";

  /* ---------- Data model: phases + finale ---------- */
  const phases = C.phases.map((p, i) => ({ ...p, index: i }));
  const finale = {
    ...C.finale,
    id: phases.length + 1,
    index: phases.length,
    type: "finale",
    tone: C.finale.tone || "dark"
  };
  const all = [...phases, finale];
  const navItems = all.map((p) => ({
    index: p.index,
    anchor: p.anchor || `phase-${p.id}`,
    label: p.type === "finale" ? "Contact" : p.name
  }));

  /* ---------- Renderers (one per phase type) ---------- */
  const head = (p) => `
    <header class="phase-head">
      <p class="kicker" data-reveal>Phase ${pad(p.id)} · ${esc(p.name)}</p>
      <h2 id="phase-${p.id}-title" class="title" data-reveal ${delay(120)}>${esc(p.heading)}</h2>
      ${p.intro ? `<p class="lead" data-reveal ${delay(240)}>${esc(p.intro)}</p>` : ""}
    </header>`;

  const renderers = {
    hero(p) {
      return `
        <div class="hero">
          <p class="kicker intro-in" style="--d:0ms">${esc(owner.role)}</p>
          <h1 id="phase-${p.id}-title" class="display intro-in" style="--d:150ms">${esc(owner.name)}</h1>
          <p class="lead intro-in" style="--d:320ms">${esc(owner.tagline)}</p>
          <div class="cta-row intro-in" style="--d:480ms">
            <a class="btn btn-solid magnetic" href="#${esc(p.ctaPrimary.target)}">
              <span>${esc(p.ctaPrimary.label)}</span><span class="arrow" aria-hidden="true">→</span>
            </a>
            <a class="btn magnetic" href="#${esc(p.ctaSecondary.target)}">
              <span>${esc(p.ctaSecondary.label)}</span><span class="arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <p class="meta intro-in" style="--d:600ms">${esc(owner.location)}</p>
        </div>`;
    },

    about(p) {
      return head(p) + `
        <div class="about-grid">
          <div class="prose" data-reveal ${delay(200)}>
            ${p.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}
          </div>
          <div data-reveal ${delay(320)}>
            <dl class="facts glass">
              ${p.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}
            </dl>
          </div>
        </div>`;
    },

    timeline(p) {
      return head(p) + `
        <ol class="timeline">
          ${p.items.map((it, i) => `
            <li data-reveal ${delay(i * 140)}>
              <span class="tl-period">${esc(it.period)}</span>
              <h3>${esc(it.title)}</h3>
              <p class="tl-org">${esc(it.org)}</p>
              <p>${esc(it.text)}</p>
            </li>`).join("")}
        </ol>`;
    },

    principles(p) {
      return head(p) + `
        <div class="grid">
          ${p.items.map((it, i) => `
            <div data-reveal ${delay(i * 120)}>
              <article class="glass">
                <span class="num">${pad(i + 1)}</span>
                <h3>${esc(it.title)}</h3>
                <p>${esc(it.text)}</p>
              </article>
            </div>`).join("")}
        </div>`;
    },

    skills(p) {
      return head(p) + `
        <div class="grid">
          ${p.groups.map((g, i) => `
            <div data-reveal ${delay(i * 120)}>
              <article class="glass">
                <h3>${esc(g.title)}</h3>
                <div class="chips">
                  ${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}
                </div>
              </article>
            </div>`).join("")}
        </div>`;
    },

    work(p) {
      return head(p) + `
        <div class="grid">
          ${p.projects.map((pr, i) => `
            <div data-reveal ${delay(i * 140)}>
              <article class="glass project tilt">
                <p class="tag">${esc(pr.category)} · ${esc(pr.year)}</p>
                <h3>${esc(pr.title)}</h3>
                <p>${esc(pr.summary)}</p>
                <a class="project-link" href="${esc(pr.link || "#")}">View project</a>
              </article>
            </div>`).join("")}
        </div>`;
    },

    approach(p) {
      return head(p) + `
        <ol class="steps">
          ${p.steps.map((s, i) => `
            <li data-reveal ${delay(i * 140)}>
              <span class="step-num">${esc(s.step || pad(i + 1))}</span>
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.text)}</p>
            </li>`).join("")}
        </ol>`;
    },

    focus(p) {
      return head(p) + `
        <div class="focus-grid">
          <div class="prose" data-reveal ${delay(200)}>
            ${p.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}
          </div>
          <ul class="focus-list" data-reveal ${delay(320)}>
            ${p.items.map((t) => `<li>${esc(t)}</li>`).join("")}
          </ul>
        </div>
        <p class="open-to" data-reveal ${delay(420)}>${esc(p.openTo)}</p>`;
    },

    finale(p) {
      return `
        <div class="finale">
          <p class="kicker" data-reveal>Finale · Let's connect</p>
          <h2 id="phase-${p.id}-title" class="display display-lg" data-reveal ${delay(120)}>${esc(p.heading)}</h2>
          ${p.intro ? `<p class="lead" data-reveal ${delay(240)}>${esc(p.intro)}</p>` : ""}
          <div class="cta-row" data-reveal ${delay(340)}>
            <a class="btn btn-solid magnetic" href="mailto:${esc(owner.email)}">
              <span>Email me</span><span class="arrow" aria-hidden="true">→</span>
            </a>
            ${owner.cvUrl ? `
            <a class="btn magnetic" href="${esc(owner.cvUrl)}">
              <span>View CV</span><span class="arrow" aria-hidden="true">↓</span>
            </a>` : ""}
          </div>
          <ul class="social" data-reveal ${delay(440)}>
            ${(owner.social || []).map((s) => `
              <li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}
          </ul>
          <p class="contact-line" data-reveal ${delay(520)}>${esc(owner.phone)} · ${esc(owner.location)}</p>
          <footer class="site-footer">
            <p>© <span id="year"></span> ${esc(owner.name)}</p>
            <a href="#phase-1">Back to top ↑</a>
          </footer>
        </div>`;
    }
  };

  function section(p) {
    const anchor = p.anchor || `phase-${p.id}`;
    const inner = renderers[p.type](p);
    const cue = p.type === "hero"
      ? `<a class="scroll-cue" href="#phase-2" aria-label="Scroll to the next phase"><span>Scroll</span><i aria-hidden="true"></i></a>`
      : "";
    return `
      <section id="${esc(anchor)}" class="phase phase-${esc(p.type)}" data-index="${p.index}"
               data-tone="${esc(p.tone || "dark")}" style="--accent:${esc(p.accent)}"
               aria-labelledby="phase-${p.id}-title">
        <span class="ghost" aria-hidden="true" data-speed="-0.14">${esc(p.ghost || pad(p.id))}</span>
        <div class="phase-inner">${inner}</div>
        ${cue}
      </section>`;
  }

  /* ---------- Build the page ---------- */
  appEl.innerHTML = all.map(section).join("");
  const sections = $$(".phase", appEl);
  const ghosts = $$(".ghost", appEl);

  // Header brand and side dots / menu
  const brand = $("#brand");
  brand.innerHTML =
    `<span class="brand-mark" aria-hidden="true">${esc(owner.initials || initials(owner.name))}</span>` +
    `<span class="brand-name">${esc(owner.name)}</span>`;
  brand.setAttribute("aria-label", `${owner.name} — back to top`);

  const dotsEl = $("#dots");
  dotsEl.innerHTML = navItems.map((n) => `
    <li><a href="#${esc(n.anchor)}" data-index="${n.index}" aria-label="${esc(n.label)}">
      <span class="dot-label">${esc(n.label)}</span><span class="dot" aria-hidden="true"></span>
    </a></li>`).join("");

  const menuList = $("#menuList");
  menuList.innerHTML = all.map((p, i) => `
    <li><a href="#${esc(p.anchor || `phase-${p.id}`)}" data-index="${p.index}" style="--i:${i}">
      <small>${p.type === "finale" ? "END" : pad(p.id)}</small>${esc(p.type === "finale" ? "Contact" : p.name)}
    </a></li>`).join("");

  document.title = `${owner.name || "Portfolio"} — Portfolio`;

  /* ---------- Wallpaper stage ---------- */
  const stage = $("#stage");
  stage.innerHTML = all.map((p) => `
    <div class="stage-layer" data-index="${p.index}"
         style="--c1:${esc(p.fallback[0])};--c2:${esc(p.fallback[1])}">
      <div class="stage-media" style="--focus:${esc(p.focus || "center")}">
        <img class="stage-img" alt="" decoding="async"
             data-src="${esc(p.wallpaper)}" fetchpriority="${p.index === 0 ? "high" : "low"}" />
      </div>
      <div class="stage-shade shade-${esc(p.tone || "dark")}"></div>
    </div>`).join("");

  const layers = $$(".stage-layer", stage);
  layers.forEach((layer) => {
    const img = $("img", layer);
    img.addEventListener("load", () => layer.classList.add("has-image"));
    img.addEventListener("error", () => {
      layer.classList.add("no-image");
      console.warn(`Wallpaper not found: ${img.dataset.src} (the phase shows its colour gradient instead)`);
    });
  });

  // Load the current phase's image plus the neighbouring ones only (saves bandwidth)
  function loadAround(i) {
    for (let k = i - 1; k <= i + 1; k++) {
      const img = layers[k] && $("img", layers[k]);
      if (img && !img.getAttribute("src")) img.setAttribute("src", img.dataset.src);
    }
  }

  /* ---------- Active phase, transitions and HUD ---------- */
  const hudNum = $("#hudNum");
  const hudName = $("#hudName");
  const flash = $("#flash");
  const header = $("#header");
  const dotLinks = $$("a", dotsEl);
  const menuLinks = $$("a", menuList);
  let active = -1;
  let lastY = window.scrollY;
  let ticking = false;

  function setActive(i, dir) {
    if (i === active) return;

    const prev = layers[active];
    if (prev) {
      prev.classList.remove("is-active");
      prev.classList.add("is-leaving");
      clearTimeout(prev._leaveTimer);
      prev._leaveTimer = setTimeout(() => prev.classList.remove("is-leaving"), 1500);
    }

    const next = layers[i];
    clearTimeout(next._leaveTimer);
    next.classList.remove("is-leaving");
    next.dataset.dir = dir;
    next.classList.add("is-active");
    active = i;
    loadAround(i);

    const p = all[i];
    root.style.setProperty("--accent", p.accent);
    root.dataset.chrome = p.tone === "light" ? "light" : "dark";
    root.dataset.phaseType = p.type;

    if (p.type === "finale") {
      hudNum.textContent = "Finale";
      hudName.textContent = "Contact";
    } else {
      hudNum.textContent = `${pad(p.id)} / ${pad(phases.length)}`;
      hudName.textContent = p.name;
    }

    dotLinks.forEach((a) => a.setAttribute("aria-current", Number(a.dataset.index) === i ? "true" : "false"));
    menuLinks.forEach((a) => a.setAttribute("aria-current", Number(a.dataset.index) === i ? "true" : "false"));

    if (!prefersReduced()) {
      flash.classList.remove("go");
      void flash.offsetWidth; // restart the animation
      flash.classList.add("go");
    }
  }

  function currentIndex() {
    const mid = window.innerHeight * 0.45;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= mid) idx = i;
    }
    return idx;
  }

  /* ---------- Parallax ---------- */
  function updateParallax() {
    if (prefersReduced()) return;
    const vh = window.innerHeight;

    // Wallpaper drifts slightly while its phase is on screen
    const sec = sections[active];
    const layer = layers[active];
    if (sec && layer) {
      const r = sec.getBoundingClientRect();
      const t = clamp((vh - r.top) / (r.height + vh), 0, 1);
      layer.style.setProperty("--py", ((0.5 - t) * 90).toFixed(1) + "px");
    }

    // Large phase numbers move at a different speed from the text
    ghosts.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const dist = (r.top + r.height / 2) - vh / 2;
      const speed = parseFloat(el.dataset.speed) || 0;
      el.style.transform = `translate3d(0, ${(dist * speed).toFixed(1)}px, 0)`;
    });
  }

  function update() {
    ticking = false;
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : "0");
    header.classList.toggle("is-scrolled", y > 40);

    const dir = y >= lastY ? "down" : "up";
    lastY = y;

    setActive(currentIndex(), dir);
    updateParallax();
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  /* ---------- Scroll reveals ---------- */
  function setupReveal() {
    const items = $$("[data-reveal]", appEl);
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-in");
        obs.unobserve(el);
        // After the staggered entrance, remove the delay so hover effects respond instantly
        const ms = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
        setTimeout(() => { el.style.transitionDelay = "0ms"; }, ms + 1500);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Pointer effects (desktop only) ---------- */
  function setupPointer() {
    if (!canHover || prefersReduced()) return;

    // Spotlight and tilt on glass cards
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".glass");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      if (card.classList.contains("tilt")) {
        card.style.setProperty("--ry", `${((x / r.width - 0.5) * 8).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${((0.5 - y / r.height) * 8).toFixed(2)}deg`);
      }
    }, { passive: true });

    $$(".tilt", appEl).forEach((el) => {
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });

    // Magnetic buttons
    $$(".magnetic", appEl).forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    // Soft cursor glow that follows the pointer
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    body.appendChild(glow);
    let gx = -1000, gy = -1000, tx = -1000, ty = -1000, looping = false;
    const loop = () => {
      gx += (tx - gx) * 0.14;
      gy += (ty - gy) * 0.14;
      glow.style.transform = `translate3d(${(gx - 210).toFixed(1)}px, ${(gy - 210).toFixed(1)}px, 0)`;
      if (Math.abs(tx - gx) > 0.3 || Math.abs(ty - gy) > 0.3) {
        requestAnimationFrame(loop);
      } else {
        looping = false;
      }
    };
    document.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add("on");
      if (!looping) { looping = true; requestAnimationFrame(loop); }
    }, { passive: true });
  }

  /* ---------- Full-screen menu ---------- */
  function setupMenu() {
    const btn = $("#menuBtn");
    const menu = $("#menu");
    const closeBtn = $("#menuClose");

    const focusables = () => $$("a[href], button", menu).filter((el) => el.offsetParent !== null);

    const open = () => {
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      body.style.overflow = "hidden";
      setTimeout(() => closeBtn.focus(), 60);
    };
    const shut = () => {
      if (!menu.classList.contains("is-open")) return;
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      body.style.overflow = "";
    };

    btn.addEventListener("click", open);
    closeBtn.addEventListener("click", shut);
    menu.addEventListener("click", (e) => {
      if (e.target === menu || (e.target.closest && e.target.closest("a"))) shut();
    });
    document.addEventListener("keydown", (e) => {
      if (!menu.classList.contains("is-open")) return;
      if (e.key === "Escape") { shut(); btn.focus(); }
      if (e.key === "Tab") {
        // Keep keyboard focus inside the open menu
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Start ---------- */
  buildOk();

  function buildOk() {
    setupReveal();
    setupPointer();
    setupMenu();

    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Load the first image right away
    loadAround(0);

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    // Set the first phase after the first paint so its entrance transition plays
    requestAnimationFrame(() => requestAnimationFrame(update));
  }
})();
