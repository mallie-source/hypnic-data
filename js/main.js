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

    // Process tabs (Project Sprint / Ongoing Support)
  const processTabs = document.querySelectorAll(".process-tabs .tab");
  const processPanels = document.querySelectorAll(".process-panels .panel");

  processTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      processTabs.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      processPanels.forEach((p) => {
        p.classList.toggle("active", p.dataset.panel === tab);
      });
    });
  });

    // Section reveal on scroll
  const revealTargets = document.querySelectorAll(".section, .footer");

  revealTargets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => io.observe(el));

    // Smooth anchor scroll (consistent across browsers)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  
  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});