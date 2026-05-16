// Render meetings grouped by region (DC, Metro, Specialty), then by day.
(async function () {
  const root = document.getElementById("meeting-root");
  const countEl = document.getElementById("meeting-count");
  const searchEl = document.getElementById("meeting-search");
  if (!root) return;

  const fmtBtns = document.querySelectorAll("[data-format]");
  let activeFmt = "all";
  let query = "";
  let meetings = [];

  const REGIONS = [
    { key: "dc",        label: "DC in-person meetings", anchor: "dc",
      note: "" },
    { key: "metro",     label: "Metro area meetings",   anchor: "metro",
      note: "DC suburbs in Maryland and Northern Virginia — in-person, hybrid, and remote, grouped by day." },
    { key: "specialty", label: "Specialty meetings",    anchor: "specialty",
      note: "" },
  ];
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const fmtLabel = {
    "in-person": "In-person",
    virtual: "Virtual",
    phone: "Phone",
    hybrid: "Hybrid",
  };
  const tagClass = (f) => ({
    "in-person": "tag tag-inperson",
    virtual: "tag tag-virtual",
    phone: "tag tag-phone",
    hybrid: "tag tag-hybrid",
  })[f] || "tag";

  function rowHTML(m) {
    const tags = [
      `<span class="${tagClass(m.format)}">${fmtLabel[m.format] || m.format}</span>`,
      m.focus && m.focus !== "Open" ? `<span class="tag tag-newcomer">${m.focus}</span>` : "",
    ].filter(Boolean).join("");
    const phone = m.phone ? `<br><span class="muted">Phone: ${m.phone}</span>` : "";
    const link = m.join_link ? `<br><a href="${m.join_link}">Join online</a>` : "";
    const size = m.size ? `<br><span class="muted">Size: ${m.size}</span>` : "";
    return `
      <article class="meeting-row">
        <div class="meeting-when">
          <span class="meeting-day">${m.day}</span>
          <span class="meeting-time">${m.time}</span>
        </div>
        <div class="meeting-main">
          <h3>${m.location_name || m.focus}</h3>
          <p class="meeting-loc">${m.address || ""}${phone}${link}${size}</p>
          ${m.notes ? `<p class="meeting-loc"><em>${m.notes}</em></p>` : ""}
        </div>
        <div class="meeting-tags">${tags}</div>
      </article>`;
  }

  function render() {
    const q = query.trim().toLowerCase();
    const filtered = meetings.filter((m) => {
      if (activeFmt !== "all" && m.format !== activeFmt) return false;
      if (!q) return true;
      return [m.day, m.time, m.focus, m.location_name, m.address, m.notes]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });

    let html = "";
    let totalShown = 0;
    REGIONS.forEach((r) => {
      const inRegion = filtered.filter((m) => m.region === r.key);
      if (inRegion.length === 0) return;
      totalShown += inRegion.length;
      html += `
        <section class="meeting-group" id="${r.anchor}">
          <div class="meeting-group-head">
            <h2>${r.label}</h2>
            <span class="count">${inRegion.length} meeting${inRegion.length === 1 ? "" : "s"}</span>
          </div>
          ${r.note ? `<p class="muted" style="margin: -.25rem 0 1rem;">${r.note}</p>` : ""}
          <div class="meeting-list">`;
      DAYS.forEach((day) => {
        const dayMeetings = inRegion
          .filter((m) => m.day === day)
          .sort((a, b) => a.time.localeCompare(b.time));
        if (dayMeetings.length === 0) return;
        html += `<div class="meeting-day-head">${day}</div>`;
        dayMeetings.forEach((m) => { html += rowHTML(m); });
      });
      html += `</div></section>`;
    });

    if (totalShown === 0) {
      html = `<div class="empty-state">No meetings match these filters. <a href="mailto:whereandwhen@oa-dcmetro.org">Email whereandwhen@oa-dcmetro.org</a> if your meeting isn't listed.</div>`;
    }

    if (countEl) {
      countEl.textContent = `${totalShown} meeting${totalShown === 1 ? "" : "s"} listed`;
    }

    root.innerHTML = html;
  }

  fmtBtns.forEach((b) => b.addEventListener("click", () => {
    fmtBtns.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    activeFmt = b.dataset.format;
    render();
  }));
  if (searchEl) searchEl.addEventListener("input", (e) => { query = e.target.value; render(); });

  try {
    const res = await fetch("data/meetings.json");
    meetings = await res.json();
  } catch (e) {
    root.innerHTML = `<div class="empty-state">Could not load meetings. Please refresh.</div>`;
    return;
  }
  render();
})();
