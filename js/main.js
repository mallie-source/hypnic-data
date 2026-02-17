// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const overlay = document.querySelector(".menu-overlay");
const closeBtn = document.querySelector(".menu-close");

function openMenu(){
  overlay.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
}

function closeMenu(){
  overlay.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) closeMenu();
});

// Close menu on link click
document.querySelectorAll(".menu-links a").forEach(a => {
  a.addEventListener("click", () => closeMenu());
});

// Tabs (Process)
document.querySelectorAll(".process-tabs .tab").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll(".process-tabs .tab").forEach(b => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });

    document.querySelectorAll(".process-panels .panel").forEach(p => {
      p.classList.toggle("active", p.dataset.panel === tab);
    });
  });
});

// (We removed pricing tabs since pricing is quote-based only. Leaving structure simple.)

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();