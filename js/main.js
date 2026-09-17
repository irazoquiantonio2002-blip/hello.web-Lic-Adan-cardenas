const WHATSAPP_NUMBER = "528112748956";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    qs("#loader")?.classList.add("is-hidden");
  }, 450);
});

const navbar = qs("#navbar");
const hamburger = qs("#hamburger");
const mobileMenu = qs("#mob-menu");

function setNavState() {
  navbar?.classList.toggle("is-scrolled", window.scrollY > 24);
}

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-active");
  mobileMenu?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

qsa("#mob-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("is-active");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    hamburger?.setAttribute("aria-expanded", "false");
  });
});

const marquee = qs("#marquee");
if (marquee) {
  const items = [
    "Divorcios",
    "Pensiones alimenticias",
    "Custodia y convivencia",
    "Matrimonio y concubinato",
    "Intestados",
    "Derecho familiar",
    "Nuevo León",
    "Previa cita",
  ];
  const track = [...items, ...items, ...items]
    .map((item) => `<span>${item}</span>`)
    .join("");
  marquee.innerHTML = track;
}

const revealItems = qsa(".reveal");

if (prefersReducedMotion) {
  revealItems.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((el) => revealObserver.observe(el));
}

function animateCounter(el) {
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || "";
  const duration = target > 100 ? 1200 : 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    const value = el.dataset.format === "plain"
      ? String(current)
      : new Intl.NumberFormat("es-MX").format(current);
    el.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const statNumbers = qsa(".stat-num");
const statsSection = qs("#stats");

if (statsSection && statNumbers.length) {
  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        statNumbers.forEach(animateCounter);
        statsObserver.disconnect();
      }
    },
    { threshold: 0.35 }
  );

  statsObserver.observe(statsSection);
}

const form = qs("#wa-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = qs("#f-name");
  const interest = qs("#f-interest");
  const message = qs("#f-msg");
  const fields = [name, message].filter(Boolean);
  let isValid = true;

  fields.forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle("is-invalid", empty);
    if (empty) isValid = false;
  });

  if (!isValid) return;

  const text = [
    "Hola, visité el sitio web del Lic. Adán Cárdenas y me gustaría agendar una asesoría de derecho familiar.",
    "",
    `Nombre: ${name.value.trim()}`,
    `Tema: ${interest.value}`,
    `Detalle: ${message.value.trim()}`,
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

qsa(".form-control").forEach((field) => {
  field.addEventListener("input", () => field.classList.remove("is-invalid"));
});

const year = qs("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const canvas = qs("#hero-canvas");
const ctx = canvas?.getContext("2d");

if (canvas && ctx && !prefersReducedMotion) {
  const particles = [];
  const particleCount = 46;

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.offsetWidth * ratio);
    canvas.height = Math.floor(canvas.offsetHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: 0.8 + Math.random() * 2.2,
        dx: -0.12 + Math.random() * 0.24,
        dy: -0.08 + Math.random() * 0.16,
        alpha: 0.12 + Math.random() * 0.28,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < -10) p.x = canvas.offsetWidth + 10;
      if (p.x > canvas.offsetWidth + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.offsetHeight + 10;
      if (p.y > canvas.offsetHeight + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(241, 217, 133, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}
