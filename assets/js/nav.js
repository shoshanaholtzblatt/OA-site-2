// Highlight current nav link, mobile menu toggle, and Phase 0 form stubs.
(function () {
  const path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href").replace(/\.html$/, "").replace(/\/$/, "");
    const current = path.replace(/\/$/, "");
    if (href === current || (href === "" && current === "")) a.classList.add("active");
  });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Stub forms — show the "Thanks" message without submitting anywhere.
  document.querySelectorAll("form[data-stub-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = form.querySelector(".form-ok");
      if (ok) ok.hidden = false;
      form.querySelectorAll("input, textarea, button").forEach((el) => el.disabled = true);
    });
  });
})();
