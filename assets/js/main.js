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
  // A link is clickable only when it is a real web address or email address.
  // Placeholders such as "[ADD GITHUB PROFILE URL]" are shown as "to be added".
  const isLiveUrl = (u = "") => /^(https?:\/\/|mailto:)/.test(u);
  const socialItem = (s) => isLiveUrl(s.url)
    ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`
    : `<span class="social-pending" aria-disabled="true">${esc(s.label)} · link to be added</span>`;
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

  /* ---------- Feature builders: terminal, SQL demo ---------- */
  function renderTerminal(t) {
    return `
      <div class="term-wrap" data-reveal ${delay(160)}>
        <section class="terminal glass" id="terminal" aria-labelledby="term-title">
          <header class="term-bar">
            <span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <h3 id="term-title" class="term-title">${esc(t.title)}</h3>
            <div class="term-ctls">
              <button type="button" class="term-ctl" id="termMin" aria-expanded="true" aria-controls="termBody">Minimize</button>
              <button type="button" class="term-ctl" id="termClose">Close</button>
            </div>
          </header>
          <div class="term-body" id="termBody">
            <p class="term-intro" id="term-help">${esc(t.intro)}</p>
            <div class="term-chips" role="group" aria-label="Example commands">
              <span class="term-chips-label" aria-hidden="true">Try</span>
              ${(t.examples || []).map((c) => `<button type="button" class="term-chip" data-cmd="${esc(c)}">${esc(c)}</button>`).join("")}
            </div>
            <div class="term-out" id="termOut" role="log" aria-live="polite" aria-label="Terminal output" tabindex="0"></div>
            <form class="term-form" id="termForm" autocomplete="off">
              <label class="term-prompt" for="termIn">${esc(t.prompt)}</label>
              <input id="termIn" class="term-input" type="text" name="command"
                     autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
                     aria-describedby="term-help" />
            </form>
          </div>
        </section>
        <button type="button" class="term-reopen" id="termReopen" hidden>Open the terminal</button>
      </div>`;
  }

  function renderSqlDemo(d) {
    return `
      <section id="${esc(d.id)}" class="sql-demo glass" data-reveal ${delay(120)} aria-labelledby="sql-title">
        <h3 id="sql-title" class="sql-title">${esc(d.title)}</h3>
        <p class="sql-intro">${esc(d.intro)}</p>
        <div class="sql-steps" role="group" aria-label="Example steps">
          ${d.steps.map((st, i) => `<button type="button" class="sql-step" data-step="${i}">${esc(st.label)}</button>`).join("")}
          <button type="button" class="sql-step sql-reset" data-reset="1">${esc(d.resetLabel || "Reset database")}</button>
        </div>
        <p class="sql-note" id="sqlNote" aria-live="polite">Pick a step to load its SQL, then run it. Or write your own query below.</p>
        <label class="sql-label" for="sqlIn">SQL query</label>
        <textarea id="sqlIn" class="sql-input" rows="7" spellcheck="false">${esc(d.start)}</textarea>
        <div class="sql-actions">
          <button type="button" class="btn btn-solid" id="sqlRun"><span>Run query</span><span class="arrow" aria-hidden="true">→</span></button>
          <p class="sql-status" id="sqlStatus" role="status">Tip: press Ctrl+Enter (Cmd+Enter on Mac) to run.</p>
        </div>
        <div class="sql-out" id="sqlOut"></div>
      </section>`;
  }

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
      const photo = owner.photo
        ? `<figure class="photo-frame" data-reveal ${delay(150)}>
             <div class="photo-empty">
               <span>Your photo goes here</span>
               <small>Add the file: ${esc(owner.photo)}</small>
             </div>
             <img src="${esc(owner.photo)}" alt="Photo of ${esc(owner.name)}" loading="lazy" decoding="async" />
           </figure>`
        : "";
      return head(p) + `
        <div class="about-grid${owner.photo ? " has-photo" : ""}">
          ${photo}
          <div class="prose" data-reveal ${delay(200)}>
            ${p.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}
          </div>
          <div class="about-facts" data-reveal ${delay(320)}>
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
      const allSkills = p.groups.flatMap((g) => g.items);
      return head(p) + `
        <div class="skills-all" data-reveal ${delay(120)} aria-label="All skills">
          <p class="skills-all-label">All skills</p>
          <ul class="chips skills-all-list">${allSkills.map((s) => `<li class="chip">${esc(s)}</li>`).join("")}</ul>
        </div>
        <div class="skills-explorer" data-reveal ${delay(160)}>
          <div class="skill-tabs" role="tablist" aria-label="Skill categories">
            ${p.groups.map((g, i) => `<button type="button" role="tab" class="skill-tab" id="skill-tab-${i}"
                aria-controls="skill-panel" aria-selected="${i === 0 ? "true" : "false"}"
                tabindex="${i === 0 ? 0 : -1}" data-skill="${i}">${esc(g.title)}</button>`).join("")}
          </div>
          <div class="skill-panel glass" id="skill-panel" role="tabpanel" aria-labelledby="skill-tab-0" tabindex="0"></div>
        </div>
        ${p.terminal ? renderTerminal(p.terminal) : ""}`;
    },

    work(p) {
      const filters = p.filters || [];
      return head(p) + `
        ${filters.length ? `
        <div class="filters" role="group" aria-label="Filter projects by category">
          ${filters.map((f, i) => `<button type="button" class="filter-btn" data-filter="${i}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(f.label)}</button>`).join("")}
        </div>
        <p class="filter-count" id="filterCount" aria-live="polite"></p>` : ""}
        <div class="grid">
          ${p.projects.map((pr, i) => `
            <div data-reveal ${delay(i * 140)} data-category="${esc(pr.category)}">
              <article class="glass project tilt">
                <p class="tag">${esc(pr.category)}${pr.year ? ` · ${esc(pr.year)}` : ""}${pr.status ? ` · <span class="status">${esc(pr.status)}</span>` : ""}</p>
                <h3>${esc(pr.title)}</h3>
                <p>${esc(pr.summary)}</p>
                <div class="project-actions">
                  <button type="button" class="project-open" data-project="${i}" aria-haspopup="dialog"
                          aria-label="Project details: ${esc(pr.title)}">Project details</button>
                  ${isLiveUrl(pr.link) && pr.link.startsWith("http")
                    ? `<a class="project-link" href="${esc(pr.link)}" target="_blank" rel="noopener noreferrer">View project</a>`
                    : `<span class="project-link is-disabled" aria-disabled="true">Live link not available yet</span>`}
                </div>
              </article>
            </div>`).join("")}
        </div>
        <p class="filter-empty" id="filterEmpty" hidden>No projects in this category yet. Projects will appear here when they are added.</p>
        ${p.sqlDemo ? renderSqlDemo(p.sqlDemo) : ""}`;
    },

    approach(p) {
      return head(p) + `
        <ol class="steps">
          ${p.steps.map((s, i) => `
            <li data-reveal ${delay(i * 140)}>
              <span class="step-num">${esc(s.step || pad(i + 1))}</span>
              <h3>${esc(s.title)}</h3>
              ${s.text ? `<p>${esc(s.text)}</p>` : ""}
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
            <button type="button" class="btn magnetic" id="copyEmail" data-email="${esc(owner.email)}"><span>Copy email</span></button>
            <button type="button" class="btn magnetic" data-open-resume aria-haspopup="dialog">
              <span>${esc((C.resume && C.resume.title) || "Résumé")}</span><span class="arrow" aria-hidden="true">↗</span>
            </button>
            ${owner.cvUrl ? `
            <a class="btn magnetic" href="${esc(owner.cvUrl)}">
              <span>View CV</span><span class="arrow" aria-hidden="true">↓</span>
            </a>` : ""}
          </div>
          <p class="copy-status" id="copyStatus" role="status"></p>
          <ul class="social" data-reveal ${delay(440)}>
            ${(owner.social || []).map((s) => `<li>${socialItem(s)}</li>`).join("")}
          </ul>
          <p class="contact-line" data-reveal ${delay(520)}>${esc(owner.email)} · ${esc(owner.location)}</p>
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
  const scan = $("#scan");
  const header = $("#header");
  const dotLinks = $$("a", dotsEl);
  const menuLinks = $$("a", menuList);
  let active = -1;
  let lastY = window.scrollY;
  let ticking = false;

  function setActive(i, dir) {
    if (i === active) return;
    const isFirst = active === -1;

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

      // A thin accent scan line sweeps across the wallpaper between phases.
      // It moves down when scrolling down and up when scrolling up.
      if (scan && !isFirst) {
        scan.classList.remove("go", "up");
        void scan.offsetWidth;
        scan.classList.add("go");
        if (dir === "up") scan.classList.add("up");
      }
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

  /* ---------- Interactive terminal ---------- */
  function setupTerminal() {
    const cfg = (phases.find((p) => p.terminal) || {}).terminal;
    const out = $("#termOut");
    const form = $("#termForm");
    const input = $("#termIn");
    const section = $("#terminal");
    const termBody = $("#termBody");
    const minBtn = $("#termMin");
    const closeBtn = $("#termClose");
    const reopen = $("#termReopen");
    if (!cfg || !out || !form || !input || !section || !termBody) return;

    const aboutPhase = phases.find((p) => p.type === "about") || {};
    const skillsPhase = phases.find((p) => p.type === "skills") || {};
    const workPhase = phases.find((p) => p.type === "work") || {};
    const focusPhase = phases.find((p) => p.type === "focus") || {};
    const facts = {};
    (aboutPhase.facts || []).forEach((f) => { facts[f.label.toLowerCase()] = f.value; });
    const fact = (label) => facts[label] || "Not added yet.";

    const coreHelp = {
      help: "list the commands",
      about: "who I am",
      skills: "what I am learning",
      projects: "my projects and their status",
      focus: "what I am working on now",
      contact: "how to reach me",
      clear: "clear the screen"
    };
    const moreHelp = {
      sql: "open the SQL demo",
      c: "a sample C program",
      education: "my studies",
      languages: "languages I speak",
      goal: "what I am working toward",
      location: "where I am based",
      whoami: "a short summary"
    };
    const fmt = ([k, v]) => `  ${k.padEnd(10)} ${v}`;

    const print = (text, cls = "") => {
      const line = document.createElement("div");
      line.className = `term-line ${cls}`.trim();
      line.textContent = text === "" ? "\u00a0" : text;
      out.appendChild(line);
    };
    const printLines = (lines, cls) => lines.forEach((l) => print(l, cls));
    const echo = (cmd) => {
      const line = document.createElement("div");
      line.className = "term-line term-echo";
      const pr = document.createElement("span");
      pr.className = "term-echo-prompt";
      pr.textContent = `${cfg.prompt} `;
      const c = document.createElement("span");
      c.textContent = cmd;
      line.append(pr, c);
      out.appendChild(line);
    };

    const openSql = () => {
      const target = document.getElementById("sql-demo");
      if (!target) return ["The SQL demo is not on this page yet."];
      target.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
      return ["Opening the SQL demo in Selected Projects."];
    };

    // Every answer is built from content.js and added as plain text (never as HTML).
    // Only the listed commands run; anything else gets a "not found" message.
    const commands = {
      help: () => [
        "Core commands:",
        ...Object.entries(coreHelp).map(fmt),
        "",
        "More commands:",
        ...Object.entries(moreHelp).map(fmt),
        "",
        "Use the up and down arrow keys for earlier commands. Click a chip to run it."
      ],
      about: () => [owner.tagline || "", "", ...(aboutPhase.paragraphs || [])],
      skills: () => (skillsPhase.groups || []).map((g) => `${g.title}: ${g.items.join(", ")}`),
      projects: () => (workPhase.projects || []).map((pr) =>
        `- ${pr.title} (${pr.category}${pr.status ? `, ${pr.status}` : ""})`),
      focus: () => [
        ...(focusPhase.paragraphs || []),
        ...(focusPhase.items || []).map((i) => `- ${i}`),
        focusPhase.openTo || ""
      ].filter((l) => l !== ""),
      contact: () => [
        `Email: ${owner.email || "not added yet"}`,
        `Location: ${owner.location || "not added yet"}`,
        ...(owner.social || []).map((s) => `${s.label}: ${isLiveUrl(s.url) ? s.url : "link to be added"}`)
      ],
      education: () => [fact("education")],
      languages: () => [fact("languages")],
      goal: () => [fact("career goal")],
      location: () => [owner.location || "Not added yet."],
      whoami: () => [`${owner.name} — ${owner.role}`],
      sql: openSql,
      c: () => [...cfg.sampleC, "", "(A general example. It is not one of my projects.)"]
    };

    const hist = [];
    let histIndex = -1;

    const run = (raw) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      echo(raw.trim());
      if (cmd === "clear") {
        out.innerHTML = "";
      } else if (commands[cmd]) {
        printLines(commands[cmd]());
      } else {
        print(`Command not found: ${cmd}. Type help to see the list of commands.`, "term-err");
      }
      out.scrollTop = out.scrollHeight;
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        if (!hist.length) return;
        e.preventDefault();
        histIndex = histIndex < 0 ? hist.length - 1 : Math.max(0, histIndex - 1);
        input.value = hist[histIndex];
      } else if (e.key === "ArrowDown") {
        if (histIndex < 0) return;
        e.preventDefault();
        histIndex += 1;
        if (histIndex >= hist.length) { histIndex = -1; input.value = ""; }
        else input.value = hist[histIndex];
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value;
      if (value.trim()) hist.push(value.trim());
      histIndex = -1;
      run(value);
      input.value = "";
    });

    // Example chips run a predefined command and return focus to the input
    $$(".term-chip", section).forEach((chip) => {
      chip.addEventListener("click", () => {
        run(chip.dataset.cmd);
        input.focus();
      });
    });

    // Minimize collapses the body but keeps the title bar; Close hides the terminal
    minBtn.addEventListener("click", () => {
      const collapse = !termBody.hidden;
      termBody.hidden = collapse;
      minBtn.textContent = collapse ? "Expand" : "Minimize";
      minBtn.setAttribute("aria-expanded", String(!collapse));
    });
    closeBtn.addEventListener("click", () => {
      section.hidden = true;
      reopen.hidden = false;
      reopen.focus();
    });
    reopen.addEventListener("click", () => {
      section.hidden = false;
      reopen.hidden = true;
      termBody.hidden = false;
      minBtn.textContent = "Minimize";
      minBtn.setAttribute("aria-expanded", "true");
      input.focus();
    });

    printLines([
      "Welcome. This is a small command line about me.",
      "Type help to see what you can ask, or click a chip below."
    ]);
  }

  /* ---------- SQL demo (real SQLite, loaded only when first used) ---------- */
  function setupSqlDemo() {
    const cfg = (phases.find((p) => p.sqlDemo) || {}).sqlDemo;
    const wrap = cfg && document.getElementById(cfg.id);
    if (!cfg || !wrap) return;

    const input = $("#sqlIn");
    const out = $("#sqlOut");
    const status = $("#sqlStatus");
    const note = $("#sqlNote");
    const runBtn = $("#sqlRun");

    let db = null;
    let engine = null;

    // The engine file is about 1.4 MB, so it is downloaded only when someone runs a query.
    function loadEngine() {
      if (db) return Promise.resolve(db);
      if (!engine) {
        engine = new Promise((resolve, reject) => {
          const ready = () => (typeof window.initSqlJs === "function"
            ? resolve(window.initSqlJs)
            : reject(new Error("The SQL engine did not start.")));
          if (typeof window.initSqlJs === "function") return ready();
          const script = document.createElement("script");
          script.src = "assets/vendor/sql.js/sql-asm.js";
          script.async = true;
          script.onload = ready;
          script.onerror = () => reject(new Error("Could not load assets/vendor/sql.js/sql-asm.js."));
          document.head.appendChild(script);
        })
          .then((init) => init())
          .then((SQL) => { db = new SQL.Database(); return db; })
          .catch((err) => { engine = null; throw err; });
      }
      return engine;
    }

    const setStatus = (msg, isError = false) => {
      status.textContent = msg;
      status.classList.toggle("is-error", isError);
    };

    function buildTable(r) {
      const wrap2 = document.createElement("div");
      wrap2.className = "sql-table-wrap";
      const table = document.createElement("table");
      table.className = "sql-table";
      const caption = document.createElement("caption");
      caption.textContent = `${r.values.length} row(s)`;
      table.appendChild(caption);
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      r.columns.forEach((c) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = c;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      r.values.slice(0, 100).forEach((vals) => {
        const row = document.createElement("tr");
        vals.forEach((v) => {
          const td = document.createElement("td");
          td.textContent = v === null ? "NULL" : String(v);
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      wrap2.appendChild(table);
      if (r.values.length > 100) {
        const more = document.createElement("p");
        more.className = "sql-more";
        more.textContent = `Showing the first 100 of ${r.values.length} rows.`;
        wrap2.appendChild(more);
      }
      return wrap2;
    }

    async function runSql(sql) {
      const text = String(sql || "").trim();
      if (!text) { setStatus("Type a query first.", true); return; }
      out.innerHTML = "";
      runBtn.disabled = true;
      setStatus(db ? "Running…" : "Loading the SQL engine (once, about 1.4 MB)…");
      try {
        const database = await loadEngine();
        const t0 = performance.now();
        const results = database.exec(text);
        const ms = Math.round(performance.now() - t0);
        if (!results.length) {
          setStatus(`Done. ${database.getRowsModified()} row(s) changed (${ms} ms).`);
        } else {
          results.forEach((r) => out.appendChild(buildTable(r)));
          setStatus(`Done. ${results.length} result table(s) in ${ms} ms.`);
        }
      } catch (err) {
        const msg = (err && err.message) ? err.message : String(err);
        const hint = /no such table/i.test(msg) ? " Tip: run steps 1 and 2 first." : "";
        setStatus(`Error: ${msg}.${hint}`, true);
      } finally {
        runBtn.disabled = false;
      }
    }

    wrap.addEventListener("click", (e) => {
      const stepBtn = e.target.closest("[data-step]");
      if (stepBtn) {
        const st = cfg.steps[Number(stepBtn.dataset.step)];
        if (!st) return;
        input.value = st.sql;
        note.textContent = `${st.label}: ${st.note}`;
        runSql(st.sql);
        return;
      }
      if (e.target.closest("[data-reset]")) {
        input.value = cfg.resetSql;
        note.textContent = "Database reset. Start again with step 1.";
        runSql(cfg.resetSql);
      }
    });

    runBtn.addEventListener("click", () => {
      note.textContent = "Edit the SQL above and run it, or pick a step.";
      runSql(input.value);
    });

    input.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runSql(input.value);
      }
    });
  }

  /* ---------- Lightweight C syntax highlighting (no library) ---------- */
  const C_KEYWORDS = new Set([
    "auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else",
    "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return",
    "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned",
    "void", "volatile", "while"
  ]);

  // Returns HTML. Every piece of source text is escaped before it is wrapped in a span.
  function highlightC(src) {
    const re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*")|('(?:\\.|[^'\\\n])*')|(^[ \t]*#[^\n]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)(?=\s*\()|(\b[A-Za-z_]\w*\b)/gm;
    let html = "";
    let last = 0;
    let m;
    while ((m = re.exec(src)) !== null) {
      const tok = m[0];
      html += esc(src.slice(last, m.index));
      let cls = null;
      if (m[1]) cls = "tk-com";
      else if (m[2] || m[3]) cls = "tk-str";
      else if (m[4]) cls = "tk-pre";
      else if (m[5]) cls = "tk-num";
      else if (m[6]) cls = C_KEYWORDS.has(tok) ? "tk-kw" : "tk-fn";
      else if (m[7]) cls = C_KEYWORDS.has(tok) ? "tk-kw" : null;
      html += cls ? `<span class="${cls}">${esc(tok)}</span>` : esc(tok);
      last = m.index + tok.length;
    }
    return html + esc(src.slice(last));
  }

  /* ---------- Dialog helpers (shared by project details and the résumé) ---------- */
  function openDialog(dlg, opener, focusEl) {
    dlg.__opener = opener;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    if (focusEl) focusEl.focus();
  }
  function closeDialog(dlg) {
    if (typeof dlg.close === "function") dlg.close();
    else dlg.removeAttribute("open");
  }
  function wireDialog(dlg) {
    // Clicking the dark backdrop, a Close button, or a link inside the dialog closes it
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest(".detail-close") || e.target.closest("a")) closeDialog(dlg);
    });
    // Escape closes natively; afterwards focus returns to the button that opened it
    dlg.addEventListener("close", () => {
      const o = dlg.__opener;
      dlg.__opener = null;
      if (o && document.body.contains(o)) o.focus();
    });
  }

  /* ---------- Project details dialog (with C examples) ---------- */
  function setupDetails() {
    const projects = (phases.find((p) => p.type === "work") || {}).projects || [];
    const dlg = document.createElement("dialog");
    dlg.className = "detail-dialog";
    dlg.setAttribute("aria-labelledby", "detail-title");
    body.appendChild(dlg);
    wireDialog(dlg);

    const liveHttp = (u) => isLiveUrl(u) && /^https?:\/\//.test(u);

    function detailHTML(pr) {
      const details = (pr.details || []).length
        ? `<ul class="detail-list">${pr.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`
        : `<p class="detail-empty">Details will be added when this project is ready.</p>`;
      const repo = liveHttp(pr.repo)
        ? `<a class="detail-link" href="${esc(pr.repo)}" target="_blank" rel="noopener noreferrer">Open the GitHub repository ↗</a>
           <p class="detail-help">Check the README, the code, and the commit history to see the work for yourself.</p>`
        : `<p class="detail-empty">GitHub repository: link not available yet. It will appear here once the repository is ready.</p>`;
      const live = liveHttp(pr.link)
        ? `<a class="detail-link" href="${esc(pr.link)}" target="_blank" rel="noopener noreferrer">Open the live project ↗</a>`
        : `<p class="detail-empty">Live project: not available yet.</p>`;
      const demo = pr.demo
        ? `<a class="detail-link" href="#${esc(pr.demo)}">${esc(pr.demoLabel || "Open the demo")} ↓</a>`
        : "";
      const examples = (pr.examples || []).length
        ? `<h4>Examples</h4>
           <p class="detail-help">Simple teaching examples. They are not completed professional software.</p>
           ${pr.examples.map((ex) => `
             <figure class="code-example">
               <figcaption><strong>${esc(ex.title)}</strong> — ${esc(ex.note)}</figcaption>
               <pre class="code"><code>${highlightC((ex.code || []).join("\n"))}</code></pre>
               ${(ex.output || []).length ? `<p class="code-out-label">Output</p><pre class="code-out"><code>${esc(ex.output.join("\n"))}</code></pre>` : ""}
             </figure>`).join("")}`
        : "";
      return `
        <div class="detail-inner">
          <button type="button" class="detail-close">Close</button>
          <p class="tag">${esc(pr.category)}${pr.status ? ` · ${esc(pr.status)}` : ""}</p>
          <h3 id="detail-title">${esc(pr.title)}</h3>
          <p class="detail-summary">${esc(pr.summary)}</p>
          <h4>Details</h4>
          ${details}
          ${examples}
          <h4>Work and links</h4>
          ${repo}
          ${live}
          ${demo}
        </div>`;
    }

    appEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".project-open");
      if (!btn) return;
      const pr = projects[Number(btn.dataset.project)];
      if (!pr) return;
      dlg.innerHTML = detailHTML(pr);
      openDialog(dlg, btn, dlg.querySelector(".detail-close"));
    });
  }

  /* ---------- Résumé panel (printable, built from the same content) ---------- */
  function setupResume() {
    const dlg = document.createElement("dialog");
    dlg.className = "resume-dialog";
    dlg.setAttribute("aria-labelledby", "resume-title");
    body.appendChild(dlg);
    wireDialog(dlg);

    const find = (t) => phases.find((p) => p.type === t) || {};
    const about = find("about");
    const timeline = find("timeline");
    const skills = find("skills");
    const work = find("work");
    const focusP = find("focus");
    const facts = {};
    (about.facts || []).forEach((f) => { facts[f.label] = f.value; });

    const social = (owner.social || []).map((s) => isLiveUrl(s.url)
      ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`
      : `<span>${esc(s.label)}: link to be added</span>`).join(" · ");

    dlg.innerHTML = `
      <div class="resume-inner">
        <div class="resume-bar no-print">
          <button type="button" class="resume-print">Print or save as PDF</button>
          <button type="button" class="detail-close resume-close">Close</button>
        </div>
        <header class="resume-head">
          <figure class="photo-frame resume-photo">
            <div class="photo-empty"><span>Photo slot</span><small>Add: ${esc(owner.photo || "a photo")}</small></div>
            ${owner.photo ? `<img src="${esc(owner.photo)}" alt="Photo of ${esc(owner.name)}" loading="lazy" decoding="async" />` : ""}
          </figure>
          <div class="resume-id">
            <h2 id="resume-title" class="resume-name">${esc(owner.name)}</h2>
            <p class="resume-role">${esc(owner.role)}</p>
            <p class="resume-meta">${esc(owner.location)} · <a href="mailto:${esc(owner.email)}">${esc(owner.email)}</a></p>
            <p class="resume-meta">${social}</p>
            ${owner.cvUrl ? `<a class="btn btn-solid resume-cv" href="${esc(owner.cvUrl)}" download><span>Download CV (PDF)</span></a>` : ""}
          </div>
        </header>
        <section class="resume-sec">
          <h3>About</h3>
          ${(about.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join("")}
        </section>
        <section class="resume-sec">
          <h3>Education and languages</h3>
          <dl class="resume-dl">
            <div><dt>Education</dt><dd>${esc(facts["Education"] || "")}</dd></div>
            <div><dt>Languages</dt><dd>${esc(facts["Languages"] || "")}</dd></div>
            <div><dt>Based in</dt><dd>${esc(facts["Based in"] || "")}</dd></div>
          </dl>
        </section>
        <section class="resume-sec">
          <h3>Experience and learning</h3>
          <ul class="resume-items">
            ${(timeline.items || []).map((it) => `<li><strong>${esc(it.title)}</strong>${it.org ? ` — ${esc(it.org)}` : ""}<span class="resume-period">${esc(it.period)}</span>${esc(it.text)}</li>`).join("")}
          </ul>
        </section>
        <section class="resume-sec">
          <h3>Skills</h3>
          <ul class="resume-items">
            ${(skills.groups || []).map((g) => `<li><strong>${esc(g.title)}:</strong> ${esc(g.items.join(", "))}</li>`).join("")}
          </ul>
        </section>
        <section class="resume-sec">
          <h3>Projects</h3>
          <ul class="resume-items">
            ${(work.projects || []).map((pr) => `<li><strong>${esc(pr.title)}</strong> — ${esc(pr.category)}${pr.status ? `, ${esc(pr.status)}` : ""}<br>${esc(pr.summary)}</li>`).join("")}
          </ul>
        </section>
        <section class="resume-sec">
          <h3>Current focus and career interests</h3>
          <ul class="resume-items">${(focusP.items || []).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
          <p>${esc(focusP.openTo || "")}</p>
          <p>${esc(facts["Career goal"] || "")}</p>
        </section>
      </div>`;

    const img = $(".resume-photo img", dlg);
    if (img) {
      img.addEventListener("load", () => img.classList.add("is-loaded"));
      img.addEventListener("error", () => img.remove());
    }
    $(".resume-print", dlg).addEventListener("click", () => window.print());

    // Any element with data-open-resume (header button, contact button) opens the panel
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open-resume]");
      if (!trigger) return;
      openDialog(dlg, trigger, $(".resume-close", dlg));
    });
  }

  /* ---------- Copy email (uses the clipboard if the browser allows it) ---------- */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) { /* fall through to the older method */ }
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    ta.remove();
    return ok;
  }

  function setupCopy() {
    const btn = $("#copyEmail");
    const status = $("#copyStatus");
    if (!btn || !status) return;
    btn.addEventListener("click", async () => {
      const ok = await copyText(btn.dataset.email || "");
      status.textContent = ok
        ? "Email copied to your clipboard."
        : "Could not copy automatically. Select the email address above and copy it.";
    });
  }

  /* ---------- Skills explorer (choose a category to see its skills and related projects) ---------- */
  function setupSkills() {
    const skillsPhase = phases.find((p) => p.type === "skills");
    const tabs = $$(".skill-tab");
    const panel = $("#skill-panel");
    if (!skillsPhase || !skillsPhase.groups || !tabs.length || !panel) return;
    const projects = (phases.find((p) => p.type === "work") || {}).projects || [];
    const tabList = $(".skill-tabs");

    function show(i, moveFocus = false) {
      const g = skillsPhase.groups[i];
      if (!g) return;
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", `skill-tab-${i}`);
      const related = g.relates
        ? projects.map((pr, idx) => ({ pr, idx })).filter((x) => x.pr.category === g.relates)
        : [];
      const relatedHtml = related.length
        ? `<ul class="related">
             ${related.map(({ pr, idx }) => `
               <li>
                 <button type="button" class="project-open" data-project="${idx}" aria-haspopup="dialog"
                         aria-label="Project details: ${esc(pr.title)}">${esc(pr.title)}</button>
                 ${pr.status ? `<span class="related-status">${esc(pr.status)}</span>` : ""}
               </li>`).join("")}
           </ul>`
        : `<p class="detail-empty">${g.relates
            ? "No project in this category yet."
            : "No linked projects yet. Projects will be linked here when they are added."}</p>`;
      panel.innerHTML = `
        <h3>${esc(g.title)}</h3>
        <div class="chips">${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
        <h4>Related projects</h4>
        ${relatedHtml}`;
      if (moveFocus) tabs[i].focus();
    }

    tabs.forEach((t, i) => t.addEventListener("click", () => show(i)));
    tabList.addEventListener("keydown", (e) => {
      const cur = tabs.indexOf(document.activeElement);
      if (cur < 0) return;
      let next = null;
      if (e.key === "ArrowRight") next = (cur + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (cur - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next !== null) {
        e.preventDefault();
        show(next, true);
      }
    });
    show(0);
  }

  /* ---------- Project filters with an empty state ---------- */
  function setupFilters() {
    const work = phases.find((p) => p.type === "work") || {};
    const scope = $(".phase-work", appEl);
    if (!scope || !work.filters || !work.filters.length) return;
    const btns = $$(".filter-btn", scope);
    const cards = $$("[data-category]", scope);
    const count = $("#filterCount", scope);
    const empty = $("#filterEmpty", scope);

    function apply(i) {
      const f = work.filters[i];
      if (!f) return;
      let shown = 0;
      cards.forEach((c) => {
        const visible = !f.match || c.dataset.category === f.match;
        c.hidden = !visible;
        if (visible) shown += 1;
      });
      btns.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
      if (count) count.textContent = `Showing ${shown} of ${cards.length} project${cards.length === 1 ? "" : "s"}.`;
      if (empty) empty.hidden = shown > 0;
    }

    btns.forEach((b) => b.addEventListener("click", () => apply(Number(b.dataset.filter))));
    apply(0);
  }

  /* ---------- Start ---------- */
  buildOk();

  function buildOk() {
    setupReveal();
    setupPointer();
    setupMenu();
    setupTerminal();
    setupSqlDemo();
    setupDetails();
    setupResume();
    setupCopy();
    setupSkills();
    setupFilters();

    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Show the profile photo only once the file really loads; otherwise keep the placeholder box
    $$(".photo-frame img", appEl).forEach((img) => {
      img.addEventListener("load", () => img.classList.add("is-loaded"));
      img.addEventListener("error", () => img.remove());
    });

    // Load the first image right away
    loadAround(0);

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    // Set the first phase after the first paint so its entrance transition plays
    requestAnimationFrame(() => requestAnimationFrame(update));
  }
})();
