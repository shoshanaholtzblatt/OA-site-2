// Render meetings grouped by region (as given in data), then by day, sorted by time.
// Schema fields used: region, day, time, name, status, frequency, contacts[],
// zoom_url, phone_access, pin, password, address, room, notes, meeting_id.
(async function () {
  const root = document.getElementById("meeting-root");
  const countEl = document.getElementById("meeting-count");
  const searchEl = document.getElementById("meeting-search");
  if (!root) return;

  const fmtBtns = document.querySelectorAll("[data-format]");
  let activeFmt = "all";
  let query = "";
  let meetings = [];

  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  function deriveFormat(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("hybrid")) return "hybrid";
    if (s.includes("virtual")) return "virtual";
    if (s.includes("phone only")) return "phone";
    return "in-person";
  }

  function parseTime(s) {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(s || "");
    if (!m) return 0;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const isPM = /pm/i.test(m[3]);
    if (h === 12) h = 0;
    if (isPM) h += 12;
    return h * 100 + min;
  }

  function regionRank(region) {
    if (region === "District of Columbia") return 0;
    if (/^maryland/i.test(region)) return 1;
    if (/^virginia/i.test(region)) return 2;
    if (/specialty/i.test(region)) return 9;
    return 5;
  }

  function regionSort(a, b) {
    const r = regionRank(a) - regionRank(b);
    return r !== 0 ? r : a.localeCompare(b);
  }

  function tagClass(f) {
    return ({
      "in-person": "tag tag-inperson",
      virtual: "tag tag-virtual",
      phone: "tag tag-phone",
      hybrid: "tag tag-hybrid",
    })[f] || "tag";
  }

  function escapeHTML(s) {
    return (s ?? "").toString().replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function rowHTML(m) {
    const fmt = deriveFormat(m.status);
    const tags = `<span class="${tagClass(fmt)}">${escapeHTML(m.status || fmt)}</span>`;

    const contactLines = (m.contacts || [])
      .map((c) => {
        const phone = c.phone ? ` · <a href="tel:${escapeHTML(c.phone.replace(/[^0-9+]/g, ""))}">${escapeHTML(c.phone)}</a>` : "";
        return `<span class="muted">${escapeHTML(c.name || "")}${phone}</span>`;
      })
      .join("<br>");

    const addr = m.address ? `<br><span class="muted">${escapeHTML(m.address)}${m.room ? " · Room " + escapeHTML(m.room) : ""}</span>` : "";

    const zoom = m.zoom_url
      ? `<br><a href="${escapeHTML(m.zoom_url)}" rel="noopener" target="_blank">Join online →</a>`
      : "";

    const dialin = m.phone_access
      ? `<br><span class="muted">Phone: <a href="tel:${escapeHTML(m.phone_access.replace(/[^0-9+]/g, ""))}">${escapeHTML(m.phone_access)}</a>${m.pin ? " · ID " + escapeHTML(m.pin) : ""}${m.password ? " · PW " + escapeHTML(m.password) : ""}</span>`
      : "";

    const notes = m.notes ? `<p class="meeting-loc"><em>${escapeHTML(m.notes)}</em></p>` : "";

    return `
      <article class="meeting-row">
        <div class="meeting-when">
          <span class="meeting-day">${escapeHTML(m.day)}</span>
          <span class="meeting-time">${escapeHTML(m.time)}</span>
        </div>
        <div class="meeting-main">
          <h3>${escapeHTML(m.name || "")}</h3>
          <p class="meeting-loc">${contactLines}${addr}${zoom}${dialin}</p>
          ${notes}
        </div>
        <div class="meeting-tags">${tags}</div>
      </article>`;
  }

  function regionAnchor(region) {
    return region.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function render() {
    const q = query.trim().toLowerCase();
    const filtered = meetings.filter((m) => {
      const fmt = deriveFormat(m.status);
      if (activeFmt !== "all" && fmt !== activeFmt) return false;
      if (!q) return true;
      const hay = [
        m.region, m.day, m.time, m.name, m.status,
        m.address, m.room, m.notes,
        ...(m.contacts || []).map((c) => `${c.name || ""} ${c.phone || ""}`),
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });

    const regions = Array.from(new Set(filtered.map((m) => m.region))).sort(regionSort);

    let html = "";
    let total = 0;
    regions.forEach((region) => {
      const inRegion = filtered.filter((m) => m.region === region);
      if (inRegion.length === 0) return;
      total += inRegion.length;
      html += `
        <section class="meeting-group" id="${regionAnchor(region)}">
          <div class="meeting-group-head">
            <h2>${escapeHTML(region)}</h2>
            <span class="count">${inRegion.length} meeting${inRegion.length === 1 ? "" : "s"}</span>
          </div>
          <div class="meeting-list">`;
      DAYS.forEach((day) => {
        const dayMeetings = inRegion
          .filter((m) => m.day === day)
          .sort((a, b) => parseTime(a.time) - parseTime(b.time));
        if (dayMeetings.length === 0) return;
        html += `<div class="meeting-day-head">${day}</div>`;
        dayMeetings.forEach((m) => { html += rowHTML(m); });
      });
      html += `</div></section>`;
    });

    if (total === 0) {
      html = `<div class="empty-state">No meetings match these filters. <a href="mailto:whereandwhen@oa-dcmetro.org">Email whereandwhen@oa-dcmetro.org</a> if your meeting isn't listed.</div>`;
    }

    if (countEl) {
      countEl.textContent = `${total} meeting${total === 1 ? "" : "s"} listed`;
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
