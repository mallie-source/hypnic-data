document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuBtn = document.querySelector(".menu-btn");
  const overlay = document.querySelector(".menu-overlay");
  const panel = document.querySelector(".menu-panel");
  const closeBtn = document.querySelector(".menu-close");

  function openMenu() {
    body.classList.add("menu-open");
    menuBtn?.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }

  // Open
  menuBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openMenu();
  });

  // Close button
  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
  });

  // Click outside panel closes
  overlay?.addEventListener("click", (e) => {
    // if the click is NOT inside the panel
    if (panel && !panel.contains(e.target)) closeMenu();
  });

  // Close on Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close when clicking any menu link
  document.querySelectorAll(".menu-links a").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});