(() => {
  const fandomTheme = document.createElement("link");
  fandomTheme.rel = "stylesheet";
  fandomTheme.href = "assets/css/fandom.css";
  document.head.appendChild(fandomTheme);

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const normalize = (value = "") => value.toLowerCase().trim();

  function setupMobileNav() {
    const toggle = $("[data-nav-toggle]");
    const nav = $("[data-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.dataset.open = String(!isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.dataset.open = "false";
      }
    });
  }

  function markCurrentNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    $$(`[data-nav-link="${page}"]`).forEach((link) => link.setAttribute("aria-current", "page"));
  }

  function initials(name = "") {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  }

  function makePortrait(member, compact = false) {
    const frame = document.createElement("div");
    frame.className = `portrait-frame${compact ? " portrait-frame--compact" : ""}`;

    if (member.image) {
      const img = document.createElement("img");
      img.src = member.image;
      img.alt = member.imageAlt || `Portrait of ${member.name}`;
      img.loading = "lazy";
      frame.appendChild(img);
      return frame;
    }

    frame.classList.add("portrait-frame--pending");
    frame.innerHTML = `
      <span class="portrait-code" aria-hidden="true">${initials(member.name) || "//"}</span>
      <span class="portrait-kicker">PORTRAIT // PENDING</span>
      <strong>AWAITING EVIDENCE</strong>
      <span class="portrait-sub">SELECT PROFILE IMAGE</span>
    `;
    return frame;
  }

  function memberCard(member) {
    const card = document.createElement("a");
    card.className = "member-card metal-panel";
    card.href = `profile.html?id=${encodeURIComponent(member.id)}`;
    card.dataset.memberCard = "true";
    card.dataset.vertical = normalize(member.vertical);
    card.dataset.search = normalize([member.name, member.alias, member.role, member.vertical].filter(Boolean).join(" "));
    if (member.color?.hex) card.style.setProperty("--member-accent", member.color.hex);

    const portrait = makePortrait(member, true);
    const content = document.createElement("div");
    content.className = "member-card__content";
    content.innerHTML = `
      <div class="member-card__meta">
        <span>FILE ${member.fileNumber || "—"}</span>
        <span>${member.status || ""}</span>
      </div>
      <h3>${member.name}</h3>
      <p class="member-card__alias">${member.alias ? `ALIAS // ${member.alias}` : "ALIAS // UNFILED"}</p>
      <p class="member-card__role">${member.role || "ROLE // UNFILED"}</p>
      <span class="member-card__vertical">${member.vertical || "UNASSIGNED"}</span>
      <span class="member-card__open">OPEN FILE →</span>
    `;
    card.append(portrait, content);
    return card;
  }

  function vacancyCard(item) {
    const card = document.createElement("article");
    card.className = "member-card member-card--vacancy metal-panel";
    card.dataset.memberCard = "true";
    card.dataset.vertical = normalize(item.vertical);
    card.dataset.search = normalize([item.name, item.role, item.vertical, item.status].join(" "));
    card.innerHTML = `
      <div class="vacancy-portrait" aria-hidden="true"><span>?</span><small>FILE NOT ASSIGNED</small></div>
      <div class="member-card__content">
        <div class="member-card__meta"><span>OPEN FILE</span><span>${item.status}</span></div>
        <h3>${item.name}</h3>
        <p class="member-card__alias">PERSONNEL // PENDING</p>
        <p class="member-card__role">${item.role}</p>
        <span class="member-card__vertical">${item.vertical}</span>
        <span class="member-card__open">RECRUITMENT ACTIVE</span>
      </div>
    `;
    return card;
  }

  function renderMemberCards(target, members, includeVacancies = false) {
    if (!target) return;
    const fragment = document.createDocumentFragment();
    members.forEach((member) => fragment.appendChild(memberCard(member)));
    if (includeVacancies) (window.GROOVE_VACANCIES || []).forEach((item) => fragment.appendChild(vacancyCard(item)));
    target.replaceChildren(fragment);
  }

  function setupTeamDirectory() {
    const grid = $("[data-team-grid]");
    if (!grid || !window.GROOVE_MEMBERS) return;

    renderMemberCards(grid, window.GROOVE_MEMBERS, true);

    const search = $("[data-member-search]");
    const buttons = $$('[data-filter]');
    const count = $("[data-result-count]");
    let activeFilter = "all";

    function applyFilters() {
      const term = normalize(search?.value || "");
      let visible = 0;
      $$('[data-member-card="true"]', grid).forEach((card) => {
        const matchesFilter = activeFilter === "all" || card.dataset.vertical === activeFilter;
        const matchesSearch = !term || card.dataset.search.includes(term);
        const show = matchesFilter && matchesSearch;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (count) count.textContent = `${visible} FILE${visible === 1 ? "" : "S"} VISIBLE`;
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        applyFilters();
      });
    });
    search?.addEventListener("input", applyFilters);
    applyFilters();

    const random = $("[data-random-member]");
    random?.addEventListener("click", () => {
      const members = window.GROOVE_MEMBERS;
      const pick = members[Math.floor(Math.random() * members.length)];
      window.location.href = `profile.html?id=${encodeURIComponent(pick.id)}`;
    });
  }

  function setupFeaturedPersonnel() {
    const target = $("[data-featured-personnel]");
    if (!target || !window.GROOVE_MEMBERS) return;
    renderMemberCards(target, window.GROOVE_MEMBERS.slice(0, 4), false);
  }

  function setupFooterYear() {
    $$('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  }

  setupMobileNav();
  markCurrentNav();
  setupTeamDirectory();
  setupFeaturedPersonnel();
  setupFooterYear();

  window.GrooveUI = { makePortrait, memberCard, initials };
})();
