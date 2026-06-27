// Render meetings as progressive-disclosure cards, grouped by region.
// Schema fields used: region, day, time, name, status, frequency, contacts[],
// zoom_url, phone_access, pin, password, address, room, notes, meeting_id.
(async function () {
  const root = document.getElementById("meeting-root");
  const countEl = document.getElementById("meeting-count");
  const searchEl = document.getElementById("meeting-search");
  if (!root) return;

  const regionBtns = document.querySelectorAll("[data-region]");
  let activeRegion = "all";
  let query = "";
  let meetings = [];

  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const DAY_ABBR = { Sunday: "SUN", Monday: "MON", Tuesday: "TUE", Wednesday: "WED", Thursday: "THU", Friday: "FRI", Saturday: "SAT" };

  function deriveFormat(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("hybrid")) return "hybrid";
    if (s.includes("virtual")) return "virtual";
    if (s.includes("phone only")) return "phone";
    return "in-person";
  }

  function formatLabel(f) {
    return ({
      "in-person": "In-person",
      virtual: "Virtual",
      phone: "Phone",
      hybrid: "Hybrid",
    })[f] || f;
  }

  function formatBadgeClass(f) {
    return ({
      "in-person": "format-badge format-inperson",
      virtual: "format-badge format-virtual",
      phone: "format-badge format-phone",
      hybrid: "format-badge format-hybrid",
    })[f] || "format-badge";
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

  function regionBucket(region) {
    if (region === "District of Columbia") return "dc";
    if (/^maryland/i.test(region)) return "maryland";
    if (/^virginia/i.test(region)) return "virginia";
    return "other";
  }

  function regionSubhead(region) {
    if (region === "District of Columbia") return "Meetings within Washington, DC";
    if (region === "Maryland - Montgomery County") return "Montgomery County, MD";
    if (region === "Maryland - Prince George’s, Anne Arundel, and Howard Counties") return "Prince George’s, Anne Arundel & Howard Counties, MD";
    if (/^maryland/i.test(region)) return region.replace(/^Maryland\s*-\s*/, "") + ", MD";
    if (/^virginia/i.test(region)) return region.replace(/^Virginia\s*-\s*/, "") + ", VA";
    return "";
  }

  function escapeHTML(s) {
    return (s ?? "").toString().replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function regionAnchor(region) {
    return region.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function cardHTML(m) {
    const fmt = deriveFormat(m.status);
    const badge = `<span class="${formatBadgeClass(fmt)}">${formatLabel(fmt)}</span>`;

    const contactRows = (m.contacts || [])
      .map((c) => {
        const phone = c.phone
          ? `<a href="tel:${escapeHTML(c.phone.replace(/[^0-9+]/g, ""))}">${escapeHTML(c.phone)}</a>`
          : "";
        return `<div>${escapeHTML(c.name || "")}${phone ? " · " + phone : ""}</div>`;
      })
      .join("");

    const addr = m.address
      ? `<dt>Address</dt><dd>${escapeHTML(m.address)}${m.room ? ` · Room ${escapeHTML(m.room)}` : ""}</dd>`
      : "";

    const contacts = contactRows
      ? `<dt>Contact</dt><dd>${contactRows}</dd>`
      : "";

    const zoom = m.zoom_url
      ? `<dt>Online</dt><dd><a class="meeting-card-zoom" href="${escapeHTML(m.zoom_url)}" rel="noopener" target="_blank">Join Zoom →</a></dd>`
      : "";

    const dialin = m.phone_access
      ? `<dt>Dial in</dt><dd><div class="meeting-card-dialin">
          <span><strong>Phone:</strong><a href="tel:${escapeHTML(m.phone_access.replace(/[^0-9+]/g, ""))}">${escapeHTML(m.phone_access)}</a></span>
          ${m.pin ? `<span><strong>Meeting ID:</strong>${escapeHTML(m.pin)}</span>` : ""}
          ${m.password ? `<span><strong>Passcode:</strong>${escapeHTML(m.password)}</span>` : ""}
        </div></dd>`
      : "";

    const notes = m.notes
      ? `<p class="meeting-card-notes">${escapeHTML(m.notes)}</p>`
      : "";

    const hasDetails = contacts || addr || zoom || dialin || notes;

    return `
      <details class="meeting-card">
        <summary>
          <div class="meeting-card-top">
            <span class="meeting-card-when">
              <span class="meeting-card-day">${escapeHTML(DAY_ABBR[m.day] || m.day || "")}</span>
              <span class="meeting-card-time">${escapeHTML(m.time || "")}</span>
            </span>
            ${badge}
          </div>
          <h3 class="meeting-card-name">${escapeHTML(m.name || "")}</h3>
          ${m.status ? `<p class="meeting-card-status">${escapeHTML(m.status)}</p>` : ""}
          ${hasDetails ? `<div class="meeting-card-toggle"><span class="meeting-card-toggle-label"></span></div>` : ""}
        </summary>
        ${hasDetails ? `<div class="meeting-card-body">
          ${notes}
          <dl>
            ${contacts}
            ${addr}
            ${zoom}
            ${dialin}
          </dl>
        </div>` : ""}
      </details>`;
  }

  function render() {
    const q = query.trim().toLowerCase();
    const filtered = meetings.filter((m) => {
      if (activeRegion !== "all" && regionBucket(m.region) !== activeRegion) return false;
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
      const inRegion = filtered
        .filter((m) => m.region === region)
        .sort((a, b) => {
          const di = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
          return di !== 0 ? di : parseTime(a.time) - parseTime(b.time);
        });
      if (inRegion.length === 0) return;
      total += inRegion.length;
      const sub = regionSubhead(region);
      html += `
        <section class="meeting-group" id="${regionAnchor(region)}">
          <div class="meeting-group-head">
            <h2>${escapeHTML(region)}<span class="count">· ${inRegion.length}</span></h2>
            ${sub ? `<p class="meeting-group-sub">${escapeHTML(sub)}</p>` : ""}
          </div>
          <div class="meeting-list">`;
      inRegion.forEach((m) => { html += cardHTML(m); });
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

  regionBtns.forEach((b) => b.addEventListener("click", () => {
    regionBtns.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    activeRegion = b.dataset.region;
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
