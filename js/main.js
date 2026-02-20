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

    // Hero Canvas: subtle data-field animation (premium, calm)
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * DPR);
      canvas.height = Math.floor(rect.height * DPR);
    }

    resizeCanvas();

    // Particles (soft points)
    const POINTS = 34;
    const points = Array.from({ length: POINTS }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.035,
      vy: (Math.random() - 0.5) * 0.035,
      r: 1 + Math.random() * 2.2
    }));

    // Floating numbers (rare, subtle)
    const numbers = [];
    function spawnNumber() {
      const choices = ["07", "12", "24", "30", "48", "72", "1.0", "2.4", "6.2"];
      numbers.push({
        x: Math.random(),
        y: 1.05,
        vy: 0.05 + Math.random() * 0.04,
        text: choices[Math.floor(Math.random() * choices.length)],
        a: 0
      });
      if (numbers.length > 8) numbers.shift();
    }

    let lastSpawn = 0;

    function drawGrid(w, h) {
      // Soft grid
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = "rgba(11,13,16,0.35)";
      ctx.lineWidth = 1 * DPR;

      const step = 48 * DPR;
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;

      // Background wash
      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "rgba(141,166,255,0.20)");
      bg.addColorStop(1, "rgba(11,13,16,0.02)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      drawGrid(w, h);

      // Animate points
      ctx.save();
      ctx.globalAlpha = 0.8;
      points.forEach((p) => {
        p.x += p.vx * 0.016;
        p.y += p.vy * 0.016;

        // wrap around edges
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;

        const px = p.x * w;
        const py = p.y * h;

        // point
        ctx.fillStyle = "rgba(11,13,16,0.55)";
        ctx.beginPath();
        ctx.arc(px, py, p.r * DPR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nearby points (very subtle)
      ctx.globalAlpha = 0.20;
      ctx.strokeStyle = "rgba(11,13,16,0.45)";
      ctx.lineWidth = 1 * DPR;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const max = 140 * DPR;
          if (dist < max) {
            ctx.globalAlpha = 0.18 * (1 - dist / max);
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Floating numbers (rare, subtle)
      const now = performance.now();
      if (now - lastSpawn > 1700) {
        lastSpawn = now;
        if (Math.random() < 0.55) spawnNumber();
      }

      ctx.save();
      ctx.font = `${12 * DPR}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
      ctx.fillStyle = "rgba(11,13,16,0.40)";
      numbers.forEach((n) => {
        n.y -= n.vy * 0.016;
        n.a = Math.min(1, n.a + 0.02);
        const px = n.x * w;
        const py = n.y * h;

        // fade in then fade out
        const fade = (n.y < 0.20) ? Math.max(0, n.y / 0.20) : 1;
        ctx.globalAlpha = 0.28 * n.a * fade;

        ctx.fillText(n.text, px, py);
      });
      ctx.restore();

      // Remove numbers that left screen
      for (let i = numbers.length - 1; i >= 0; i--) {
        if (numbers[i].y < -0.10) numbers.splice(i, 1);
      }

      requestAnimationFrame(draw);
    }

    // Resize handling
    window.addEventListener("resize", () => {
      resizeCanvas();
    });

    // Start
    requestAnimationFrame(draw);
  }
 
  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});