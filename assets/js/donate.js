// Donate dialog: nav button opens a <dialog> modal.
// Falls back to navigating to donate.html when JS or <dialog> isn't available.
(function () {
  const dlg = document.getElementById("donate-dialog");
  if (!dlg || typeof dlg.showModal !== "function") return;

  document.querySelectorAll("[data-donate-trigger]").forEach((el) => {
    el.addEventListener("click", (e) => {
      // If we're already on donate.html, let the link work normally.
      if (window.location.pathname.replace(/\/$/, "").endsWith("/donate.html")) return;
      e.preventDefault();
      dlg.showModal();
    });
  });

  dlg.addEventListener("click", (e) => {
    // Close when clicking outside the dialog body (on the backdrop).
    const rect = dlg.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                   e.clientY >= rect.top  && e.clientY <= rect.bottom;
    if (!inside) dlg.close();
  });

  dlg.querySelectorAll("[data-donate-close]").forEach((b) =>
    b.addEventListener("click", () => dlg.close())
  );
})();
