document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuBtn = document.querySelector(".menu-btn");
  const overlay = document.querySelector(".menu-overlay");
  const panel = document.querySelector(".menu-panel");
  const closeBtn = document.querySelector(".menu-close");

  /* ─── MOBILE MENU ─────────────────────────────────────────── */
  function openMenu() {
    body.classList.add("menu-open");
    menuBtn?.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    body.classList.remove("menu-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }

  menuBtn?.addEventListener("click", (e) => { e.preventDefault(); openMenu(); });
  closeBtn?.addEventListener("click", (e) => { e.preventDefault(); closeMenu(); });
  overlay?.addEventListener("click", (e) => {
    if (panel && !panel.contains(e.target)) closeMenu();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  document.querySelectorAll(".menu-links a").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  /* ─── PROCESS TABS ────────────────────────────────────────── */
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

  /* ─── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
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

  /* ─── FOOTER YEAR ─────────────────────────────────────────── */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ─── HERO CANVAS ─────────────────────────────────────────── */
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

    const POINTS = 34;
    const points = Array.from({ length: POINTS }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.035,
      vy: (Math.random() - 0.5) * 0.035,
      r: 1 + Math.random() * 2.2
    }));

    const numbers = [];
    function spawnNumber() {
      const choices = ["07", "12", "24", "30", "48", "72", "1.0", "2.4", "6.2"];
      numbers.push({
        x: Math.random(), y: 1.05,
        vy: 0.05 + Math.random() * 0.04,
        text: choices[Math.floor(Math.random() * choices.length)],
        a: 0
      });
      if (numbers.length > 8) numbers.shift();
    }

    let lastSpawn = 0;

    function drawGrid(w, h) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = "rgba(11,13,16,0.35)";
      ctx.lineWidth = 1 * DPR;
      const step = 48 * DPR;
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
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "rgba(141,166,255,0.20)");
      bg.addColorStop(1, "rgba(11,13,16,0.02)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      drawGrid(w, h);

      ctx.save();
      ctx.globalAlpha = 0.8;
      points.forEach((p) => {
        p.x += p.vx * 0.016; p.y += p.vy * 0.016;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
        ctx.fillStyle = "rgba(11,13,16,0.55)";
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * DPR, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 0.20;
      ctx.strokeStyle = "rgba(11,13,16,0.45)";
      ctx.lineWidth = 1 * DPR;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
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

      const now = performance.now();
      if (now - lastSpawn > 1700) {
        lastSpawn = now;
        if (Math.random() < 0.55) spawnNumber();
      }

      ctx.save();
      ctx.font = `${12 * DPR}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
      ctx.fillStyle = "rgba(11,13,16,0.40)";
      numbers.forEach((n) => {
        n.y -= n.vy * 0.016; n.a = Math.min(1, n.a + 0.02);
        const fade = (n.y < 0.20) ? Math.max(0, n.y / 0.20) : 1;
        ctx.globalAlpha = 0.28 * n.a * fade;
        ctx.fillText(n.text, n.x * w, n.y * h);
      });
      ctx.restore();
      for (let i = numbers.length - 1; i >= 0; i--) {
        if (numbers[i].y < -0.10) numbers.splice(i, 1);
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resizeCanvas);
    requestAnimationFrame(draw);
  }

  /* ─── ANIMATIONS ──────────────────────────────────────────── */
  // Skip if user prefers reduced motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  /* 1. Split big headings into word spans so they animate word-by-word */
  function splitWords(el) {
    if (!el || el.dataset.split) return;
    el.dataset.split = "true";
    const words = el.innerHTML.split(/(\s+|<br\s*\/?>)/gi);
    el.innerHTML = words.map((w) => {
      if (!w.trim() || /^<br/i.test(w)) return w;
      return `<span class="word-wrap"><span class="word">${w}</span></span>`;
    }).join("");
  }

  document.querySelectorAll(".h1, .h2").forEach(splitWords);

  /* 2. Tag everything we want to animate */
  function tagReveal(selector, className, staggered = false) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("anim", className);
      if (staggered) el.style.setProperty("--i", i);
    });
  }

  // Words inside headings
  document.querySelectorAll(".word").forEach((w, i) => {
    w.classList.add("anim", "anim-word");
  });

  // Eyebrows
  tagReveal(".eyebrow", "anim-fade-up");

  // Lead / prose paragraphs
  tagReveal(".lead, .prose p", "anim-fade-up");

  // CTA buttons
  document.querySelectorAll(".hero-cta .btn, .hero-meta").forEach((el, i) => {
    el.classList.add("anim", "anim-fade-up");
    el.style.setProperty("--i", i);
  });

  // Cards — scale + fade, staggered
  document.querySelectorAll(".card").forEach((el, i) => {
    el.classList.add("anim", "anim-card");
    el.style.setProperty("--i", i);
  });

  // Work items — slide from left, staggered
  document.querySelectorAll(".work-item").forEach((el, i) => {
    el.classList.add("anim", "anim-slide-left");
    el.style.setProperty("--i", i);
  });

  // Service cols — fade up, staggered
  document.querySelectorAll(".service-col").forEach((el, i) => {
    el.classList.add("anim", "anim-fade-up");
    el.style.setProperty("--i", i + 1);
  });

  // Price cards — scale fade
  document.querySelectorAll(".price-card").forEach((el, i) => {
    el.classList.add("anim", "anim-card");
    el.style.setProperty("--i", i);
  });

  // Images — clip-path wipe
  document.querySelectorAll(".about-image, .process-visual, .hero-media").forEach((el) => {
    el.classList.add("anim", "anim-wipe");
  });

  // Section dividers / heads
  tagReveal(".works-head, .we-build-head, .section-head, .services-cta, .cta-strip", "anim-fade-up");

  // Process panels
  tagReveal(".process-tabs, .process-panels", "anim-fade-up");

  // Footer
  tagReveal(".footer-left, .footer-col", "anim-fade-up");

  /* 3. Intersection Observer — fire animations on enter */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // For word groups: stagger each word inside this section
        if (el.classList.contains("anim-word")) {
          // handled via parent section below
          return;
        }

        el.classList.add("in-view");
        io.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );

  // Special observer for sections: triggers all child words staggered
  const sectionIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target;

        // Animate words inside this section
        section.querySelectorAll(".word").forEach((w, i) => {
          setTimeout(() => w.classList.add("in-view"), i * 55);
        });

        // Animate all other .anim children
        section.querySelectorAll(".anim:not(.word)").forEach((el, i) => {
          const customI = el.style.getPropertyValue("--i");
          const delay = customI ? parseFloat(customI) * 90 : i * 60;
          setTimeout(() => el.classList.add("in-view"), delay);
        });

        sectionIo.unobserve(section);
      });
    },
    { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".section, .footer, #home").forEach((s) => {
    sectionIo.observe(s);
  });

  /* 4. Horizontal marquee scroll-speed boost on scroll */
  let scrollY = 0;
  let lastScrollY = 0;
  const ticker = document.querySelector(".ticker-track");

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  if (ticker) {
    let baseSpeed = 1;
    let speed = baseSpeed;

    function animateTicker() {
      const delta = Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;
      // Boost ticker speed when user scrolls
      speed += (Math.min(delta * 0.4, 6) - speed) * 0.08;
      speed = Math.max(speed, baseSpeed);
      requestAnimationFrame(animateTicker);
    }
    animateTicker();
  }

  /* 5. Subtle parallax on hero visual */
  const heroVisual = document.querySelector(".hero-media");
  if (heroVisual) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      heroVisual.style.transform = `translateY(${y * 0.06}px)`;
    }, { passive: true });
  }

  /* 6. Nav: shrink + add shadow on scroll */
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY > 40;
      nav.classList.toggle("nav-scrolled", scrolled);
    }, { passive: true });
  }
});