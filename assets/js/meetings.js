// Filter + render the meetings list from data/meetings.json
(async function () {
  const listEl = document.getElementById("meeting-list");
  const countEl = document.getElementById("meeting-count");
  const searchEl = document.getElementById("meeting-search");
  if (!listEl) return;

  const dayBtns = document.querySelectorAll("[data-day]");
  const fmtBtns = document.querySelectorAll("[data-format]");

  let activeDay = "all";
  let activeFmt = "all";
  let query = "";
  let meetings = [];

  const fmtLabel = {
    "in-person": "In-person",
    virtual: "Virtual",
    phone: "Phone",
    hybrid: "Hybrid",
    newcomer: "Newcomer",
  };

  function tagClass(f) {
    return ({
      "in-person": "tag tag-inperson",
      virtual: "tag tag-virtual",
      phone: "tag tag-phone",
      hybrid: "tag tag-hybrid",
    })[f] || "tag";
  }

  function render() {
    const q = query.trim().toLowerCase();
    const filtered = meetings
      .filter((m) => activeDay === "all" || m.day === activeDay)
      .filter((m) => activeFmt === "all" || m.format === activeFmt || (activeFmt === "newcomer" && m.focus === "Newcomer"))
      .filter((m) => {
        if (!q) return true;
        return [m.day, m.time, m.focus, m.location_name, m.address, m.notes]
          .filter(Boolean).join(" ").toLowerCase().includes(q);
      })
      .sort((a, b) => a.day_order - b.day_order || a.time.localeCompare(b.time));

    if (countEl) countEl.textContent = `${filtered.length} meeting${filtered.length === 1 ? "" : "s"}`;

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No meetings match these filters. Try clearing them, or email <a href="mailto:whereandwhen@oa-dcmetro.org">whereandwhen@oa-dcmetro.org</a> for help.</div>`;
      return;
    }

    listEl.innerHTML = filtered.map((m) => {
      const tags = [
        `<span class="${tagClass(m.format)}">${fmtLabel[m.format] || m.format}</span>`,
        m.focus && m.focus !== "Open" ? `<span class="tag tag-newcomer">${m.focus}</span>` : "",
      ].filter(Boolean).join("");
      const phone = m.phone ? `<br><span class="muted">Phone: ${m.phone}</span>` : "";
      const link = m.join_link ? `<br><a href="${m.join_link}">Join online</a>` : "";
      return `
        <article class="meeting-row">
          <div class="meeting-when">
            <span class="meeting-day">${m.day}</span>
            <span class="meeting-time">${m.time}</span>
          </div>
          <div class="meeting-main">
            <h3>${m.location_name || m.focus}</h3>
            <p class="meeting-loc">${m.address || ""}${phone}${link}</p>
            ${m.notes ? `<p class="meeting-loc"><em>${m.notes}</em></p>` : ""}
          </div>
          <div class="meeting-tags">${tags}</div>
        </article>`;
    }).join("");
  }

  dayBtns.forEach((b) => b.addEventListener("click", () => {
    dayBtns.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    activeDay = b.dataset.day;
    render();
  }));
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
    listEl.innerHTML = `<div class="empty-state">Could not load meetings. Please refresh.</div>`;
    return;
  }
  render();
})();
