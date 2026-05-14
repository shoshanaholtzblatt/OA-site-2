// Highlight current nav link + mobile menu toggle
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
})();
