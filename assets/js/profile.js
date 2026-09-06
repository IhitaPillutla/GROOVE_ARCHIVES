(() => {
  const root = document.querySelector("[data-profile-root]");
  if (!root || !window.GROOVE_MEMBERS) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");
  const members = window.GROOVE_MEMBERS;
  const member = members.find((item) => item.id === requestedId) || members[0];

  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeAccent(hex) {
    return /^#[0-9a-f]{6}$/i.test(hex || "") ? hex : "";
  }

  function formatParagraph(value) {
    return esc(value).replace(/\n/g, "<br>");
  }

  function infoboxRow(label, value, className = "") {
    if (!value) return "";
    return `<div class="info-row ${className}"><dt>${label}</dt><dd>${esc(value)}</dd></div>`;
  }

  function chips(items, fallback) {
    if (!items?.length) return `<p class="archive-placeholder">${fallback}</p>`;
    return `<div class="chip-list">${items.map((item) => `<span class="chip">${esc(item)}</span>`).join("")}</div>`;
  }

  function optionalExtras(extras = {}) {
    const rows = [
      ["Pronouns", extras.pronouns],
      ["Year", extras.year],
      ["Programme", extras.programme],
      ["Dance style", extras.danceStyle],
      ["Favourite artist", extras.favouriteArtist],
      ["Favourite song", extras.favouriteSong],
      ["Unofficial title", extras.unofficialTitle],
      ["Chaos level", extras.chaosLevel]
    ].filter(([, value]) => value);

    const hasTrivia = Array.isArray(extras.trivia) && extras.trivia.length;
    const hasGroundZero = Boolean(extras.groundZeroMemory);
    if (!rows.length && !hasTrivia && !hasGroundZero) return "";

    return `
      <section class="profile-section optional-section" aria-labelledby="extras-title">
        <div class="section-heading"><span>SUPPLEMENTAL // OPTIONAL</span><h2 id="extras-title">EXTRA FILES</h2></div>
        ${rows.length ? `<dl class="extra-grid">${rows.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>` : ""}
        ${hasTrivia ? `<div class="mini-block"><h3>TRIVIA</h3><ul>${extras.trivia.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>` : ""}
        ${hasGroundZero ? `<div class="mini-block"><h3>GROUND ZERO MEMORY</h3><p>${formatParagraph(extras.groundZeroMemory)}</p></div>` : ""}
      </section>`;
  }

  function authorSection(author = {}) {
    const hasAnything = author.name || author.friendship || author.opinion;
    if (!hasAnything) {
      return `
        <section class="writer-panel metal-panel" aria-labelledby="writer-title">
          <span class="writer-stamp">WHO WROTE THIS?</span>
          <h2 id="writer-title">PROFILE AUTHOR // PENDING</h2>
          <p class="archive-placeholder">This file is waiting for its paired GROOVE member to submit the friendship lore and verdict.</p>
        </section>`;
    }

    const linkedWriter = author.id && members.some((item) => item.id === author.id);
    return `
      <section class="writer-panel metal-panel" aria-labelledby="writer-title">
        <span class="writer-stamp">PROFILE AUTHORED BY</span>
        <h2 id="writer-title">${esc(author.name || "UNFILED")}</h2>
        <div class="writer-grid">
          <div>
            <h3>OUR LORE</h3>
            <p>${author.friendship ? formatParagraph(author.friendship) : '<span class="archive-placeholder">Friendship file pending.</span>'}</p>
          </div>
          <div>
            <h3>THEIR VERDICT</h3>
            <p>${author.opinion ? formatParagraph(author.opinion) : '<span class="archive-placeholder">Verdict pending.</span>'}</p>
          </div>
        </div>
        ${linkedWriter ? `<a class="text-link" href="profile.html?id=${encodeURIComponent(author.id)}">VIEW ${esc(author.name || "WRITER").toUpperCase()}'S FILE →</a>` : ""}
      </section>`;
  }

  function navLinks() {
    const index = members.findIndex((item) => item.id === member.id);
    const prev = members[(index - 1 + members.length) % members.length];
    const next = members[(index + 1) % members.length];
    return `
      <nav class="profile-pager" aria-label="Member profile navigation">
        <a href="profile.html?id=${encodeURIComponent(prev.id)}"><span>← PREVIOUS FILE</span><strong>${esc(prev.name)}</strong></a>
        <a href="team.html" class="profile-pager__index"><span>PERSONNEL INDEX</span><strong>ALL FILES</strong></a>
        <a href="profile.html?id=${encodeURIComponent(next.id)}"><span>NEXT FILE →</span><strong>${esc(next.name)}</strong></a>
      </nav>`;
  }

  const accent = safeAccent(member.color?.hex);
  if (accent) document.documentElement.style.setProperty("--profile-accent", accent);
  document.title = `${member.name} — GROOVE Archives`;

  const nameParts = member.name.trim().split(/\s+/);
  const first = nameParts.shift() || member.name;
  const rest = nameParts.join(" ");
  const colorValue = member.color?.name || member.color?.hex || "";

  root.innerHTML = `
    <section class="profile-hero">
      <div class="profile-hero__main">
        <div class="eyebrow-row">
          <span>GROOVE ARCHIVES</span>
          <span>MEMBER FILE ${esc(member.fileNumber || "—")}</span>
          <span>STATUS // ${esc((member.status || "UNFILED").toUpperCase())}</span>
        </div>
        <h1><span>${esc(first)}</span>${rest ? `<span>${esc(rest)}</span>` : ""}</h1>
        <p class="profile-role">${esc(member.role || "ROLE // UNFILED")}</p>
        <p class="profile-alias">ALIAS // ${member.alias ? esc(member.alias) : '<span>UNFILED</span>'}</p>
        <div class="hero-rule" aria-hidden="true"><span></span></div>
      </div>
    </section>

    <div class="profile-layout">
      <main class="profile-main">
        <section class="profile-section" aria-labelledby="personality-title">
          <div class="section-heading"><span>CHARACTER NOTES // 01</span><h2 id="personality-title">PERSONALITY</h2></div>
          ${member.personality ? `<p class="profile-copy">${formatParagraph(member.personality)}</p>` : '<p class="archive-placeholder archive-placeholder--large">Personality entry pending paired-member submission.</p>'}
        </section>

        <section class="profile-section dual-section" aria-label="Likes and dislikes">
          <div>
            <div class="section-heading section-heading--small"><span>FILED // POSITIVE</span><h2>LIKES</h2></div>
            ${chips(member.likes, "No likes archived yet.")}
          </div>
          <div>
            <div class="section-heading section-heading--small"><span>FILED // NEGATIVE</span><h2>DISLIKES</h2></div>
            ${chips(member.dislikes, "No dislikes archived yet.")}
          </div>
        </section>

        <section class="quote-block" aria-labelledby="quote-title">
          <div class="quote-block__label" id="quote-title">MOST LIKELY TO SAY</div>
          ${member.quote ? `<blockquote>“${esc(member.quote)}”</blockquote><p>— ${esc(first)}, probably</p>` : '<blockquote class="quote-block__pending">“QUOTE PENDING”</blockquote><p>— archival silence, for now</p>'}
        </section>

        ${optionalExtras(member.extras)}
        ${authorSection(member.author)}
      </main>

      <aside class="profile-sidebar" aria-label="Member information">
        <div data-portrait-slot></div>
        <section class="infobox metal-panel">
          <div class="infobox__title"><span>PERSONNEL RECORD</span><strong>${esc(member.name)}</strong></div>
          <dl>
            ${infoboxRow("Name", member.name)}
            ${infoboxRow("Alias", member.alias)}
            ${infoboxRow("Role", member.role)}
            ${infoboxRow("Vertical", member.vertical)}
            ${infoboxRow("Birthday", member.birthday)}
            ${infoboxRow("Affiliation", "GROOVE")}
            ${infoboxRow("Status", member.status)}
            ${infoboxRow("Debut", member.debut)}
            ${infoboxRow("Profile author", member.author?.name)}
          </dl>
          <div class="color-record">
            <span>ASSOCIATED COLOUR</span>
            ${colorValue ? `<div class="color-record__value"><i style="--swatch:${esc(member.color.hex || "transparent")}"></i><strong>${esc(member.color.name || member.color.hex)}</strong>${member.color.name && member.color.hex ? `<code>${esc(member.color.hex)}</code>` : ""}</div>` : '<p class="archive-placeholder">UNASSIGNED</p>'}
          </div>
        </section>
      </aside>
    </div>
    ${navLinks()}
  `;

  const portraitSlot = root.querySelector("[data-portrait-slot]");
  if (portraitSlot && window.GrooveUI?.makePortrait) portraitSlot.appendChild(window.GrooveUI.makePortrait(member));
})();
