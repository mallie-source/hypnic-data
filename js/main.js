document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ─── CUSTOM CURSOR ────────────────────────────────────────── */
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) {
      dot.style.left = mouseX + "px";
      dot.style.top  = mouseY + "px";
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (ring) {
      ring.style.left = ringX + "px";
      ring.style.top  = ringY + "px";
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => {
      if (ring) { ring.style.width = "52px"; ring.style.height = "52px"; ring.style.borderColor = "rgba(141,166,255,0.7)"; }
    });
    el.addEventListener("mouseleave", () => {
      if (ring) { ring.style.width = "32px"; ring.style.height = "32px"; ring.style.borderColor = "rgba(141,166,255,0.45)"; }
    });
  });

  /* ─── MOBILE MENU ──────────────────────────────────────────── */
  const menuBtn  = document.querySelector(".menu-btn");
  const overlay  = document.querySelector(".menu-overlay");
  const panel    = document.querySelector(".menu-panel");
  const closeBtn = document.querySelector(".menu-close");

  function openMenu()  { body.classList.add("menu-open");    menuBtn?.setAttribute("aria-expanded", "true");  }
  function closeMenu() { body.classList.remove("menu-open"); menuBtn?.setAttribute("aria-expanded", "false"); }

  menuBtn?.addEventListener("click", (e) => { e.preventDefault(); openMenu(); });
  closeBtn?.addEventListener("click", (e) => { e.preventDefault(); closeMenu(); });
  overlay?.addEventListener("click", (e) => { if (panel && !panel.contains(e.target)) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  document.querySelectorAll(".menu-links a").forEach(a => a.addEventListener("click", closeMenu));

  /* ─── PROCESS TABS ─────────────────────────────────────────── */
  const processTabs   = document.querySelectorAll(".process-tabs .tab");
  const processPanels = document.querySelectorAll(".process-panels .panel");

  processTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      processTabs.forEach(b => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      processPanels.forEach(p => p.classList.toggle("active", p.dataset.panel === tab));
    });
  });

  /* ─── SMOOTH SCROLL ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ─── FOOTER YEAR ──────────────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── HERO CANVAS — dark theme ─────────────────────────────── */
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * DPR);
      canvas.height = Math.floor(rect.height * DPR);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animated data points
    const POINTS = 32;
    const points = Array.from({ length: POINTS }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.028,
      vy: (Math.random() - 0.5) * 0.028,
      r: 1.2 + Math.random() * 2
    }));

    // Floating data numbers
    const numbers = [];
    const choices = ["07", "12", "24", "30", "48", "72", "1.0", "2.4", "6.2", "R8K", "KPI", "CSV"];

    function spawnNumber() {
      numbers.push({
        x: Math.random(), y: 1.05,
        vy: 0.04 + Math.random() * 0.035,
        text: choices[Math.floor(Math.random() * choices.length)],
        a: 0
      });
      if (numbers.length > 10) numbers.shift();
    }

    let lastSpawn = 0;

    function drawGrid(w, h) {
      ctx.save();
      ctx.strokeStyle = "rgba(141,166,255,0.06)";
      ctx.lineWidth = 1 * DPR;
      const step = 52 * DPR;
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "rgba(141,166,255,0.06)");
      bg.addColorStop(0.5, "rgba(13,15,19,0)");
      bg.addColorStop(1, "rgba(196,181,253,0.04)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      drawGrid(w, h);

      // Points
      ctx.save();
      points.forEach(p => {
        p.x += p.vx * 0.016; p.y += p.vy * 0.016;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05)  p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05)  p.y = -0.05;
        ctx.globalAlpha = 0.65;
        ctx.fillStyle   = "rgba(141,166,255,0.8)";
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * DPR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connection lines
      ctx.lineWidth = 0.8 * DPR;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const max  = 130 * DPR;
          if (dist < max) {
            ctx.globalAlpha   = 0.15 * (1 - dist / max);
            ctx.strokeStyle   = "rgba(141,166,255,0.6)";
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Floating numbers
      const now = performance.now();
      if (now - lastSpawn > 1600) { lastSpawn = now; if (Math.random() < 0.6) spawnNumber(); }

      ctx.save();
      ctx.font = `${11 * DPR}px 'DM Mono', 'Courier New', monospace`;
      numbers.forEach(n => {
        n.y -= n.vy * 0.016; n.a = Math.min(1, n.a + 0.025);
        const fade = n.y < 0.18 ? Math.max(0, n.y / 0.18) : 1;
        ctx.globalAlpha = 0.3 * n.a * fade;
        ctx.fillStyle   = "rgba(141,166,255,1)";
        ctx.fillText(n.text, n.x * w, n.y * h);
      });
      for (let i = numbers.length - 1; i >= 0; i--) {
        if (numbers[i].y < -0.1) numbers.splice(i, 1);
      }
      ctx.restore();

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* ─── SCROLL ANIMATIONS ────────────────────────────────────── */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Split headings into words
  function splitWords(el) {
    if (!el || el.dataset.split) return;
    el.dataset.split = "true";
    const words = el.innerHTML.split(/(\s+|<br\s*\/?>)/gi);
    el.innerHTML = words.map(w => {
      if (!w.trim() || /^<br/i.test(w)) return w;
      return `<span class="word-wrap"><span class="word">${w}</span></span>`;
    }).join("");
  }

  document.querySelectorAll(".h1, .h2").forEach(splitWords);

  function tag(selector, cls, stagger = false) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("anim", cls);
      if (stagger) el.style.setProperty("--i", i);
    });
  }

  tag(".eyebrow", "anim-fade-up");
  tag(".lead, .about-body p, .prose p", "anim-fade-up");

  document.querySelectorAll(".hero-cta .btn, .hero-meta").forEach((el, i) => {
    el.classList.add("anim", "anim-fade-up");
    el.style.setProperty("--i", i);
  });

  document.querySelectorAll(".card").forEach((el, i) => {
    el.classList.add("anim", "anim-card");
    el.style.setProperty("--i", i);
  });
  document.querySelectorAll(".work-item").forEach((el, i) => {
    el.classList.add("anim", "anim-slide-left");
    el.style.setProperty("--i", i);
  });
  document.querySelectorAll(".service-col").forEach((el, i) => {
    el.classList.add("anim", "anim-fade-up");
    el.style.setProperty("--i", i + 1);
  });
  document.querySelectorAll(".price-card").forEach((el, i) => {
    el.classList.add("anim", "anim-card");
    el.style.setProperty("--i", i);
  });
  document.querySelectorAll(".about-img-wrap, .process-visual-wrap, .hero-media").forEach(el => {
    el.classList.add("anim", "anim-wipe");
  });
  tag(".works-header, .cards-header, .section-rule, .stat-item, .about-quote, .about-tags, .services-cta, .cta-strip, .process-tabs, .process-panels, .footer-left, .footer-col, .vs-header, .vs-footer-note", "anim-fade-up");

  document.querySelectorAll(".vs-row-label, .vs-cell").forEach((el, i) => {
    el.classList.add("anim", "anim-fade-up");
    el.style.setProperty("--i", Math.floor(i / 3));
  });

  // Section observer
  const sectionIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;

      section.querySelectorAll(".word").forEach((w, i) => {
        setTimeout(() => w.classList.add("in-view"), i * 50);
      });
      section.querySelectorAll(".anim:not(.word)").forEach((el, i) => {
        const customI = el.style.getPropertyValue("--i");
        const delay   = customI ? parseFloat(customI) * 90 : i * 60;
        setTimeout(() => el.classList.add("in-view"), delay);
      });

      sectionIo.unobserve(section);
    });
  }, { threshold: 0.07, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".section, .footer, #home, .stats-strip").forEach(s => sectionIo.observe(s));

  /* ─── NAV SHRINK ON SCROLL ─────────────────────────────────── */
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("nav-scrolled", window.scrollY > 40);
    }, { passive: true });
  }

  /* ─── HERO PARALLAX ────────────────────────────────────────── */
  const heroMedia = document.querySelector(".hero-media");
  if (heroMedia) {
    window.addEventListener("scroll", () => {
      heroMedia.style.transform = `translateY(${window.scrollY * 0.05}px)`;
    }, { passive: true });
  }
});