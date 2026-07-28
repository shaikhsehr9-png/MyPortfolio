// =====================================================
//  SEHRISH SHAIKH PORTFOLIO — JAVASCRIPT
// =====================================================

'use strict';

// ---- CUSTOM CURSOR ----
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .tech-pill, .highlight-item, .contact-card, .project-card, .skill-category-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); cursorFollower.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); cursorFollower.classList.remove('hovered'); });
});

// ---- PARTICLE CANVAS ----
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 80;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      const purples = ['rgba(124,58,237,', 'rgba(168,85,247,', 'rgba(217,70,239,', 'rgba(139,92,246,'];
      this.color = purples[Math.floor(Math.random() * purples.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Draw lines between close particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ---- TYPED TEXT ----
(function initTyped() {
  const el     = document.getElementById('typedText');
  const words  = ['Full Stack Developer', 'UI/UX Designer', 'Frontend Engineer', 'React Developer', 'Software Engineer'];
  let wIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = words[wIdx];
    if (!deleting) {
      el.textContent = word.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === word.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      el.textContent = word.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
})();

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
  });
});

// ---- ACTIVE NAV LINK ----
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.section-header, .about-grid, .skill-category-card, .project-card, .contact-grid, .about-image-wrapper, .tech-pills');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('reveal', 'visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---- SKILL BAR ANIMATION ----
const skillBars = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const w    = fill.getAttribute('data-width');
      fill.style.width = w + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillObserver.observe(bar));

// ---- CONTACT FORM ----
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('contactSubmit');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmailInput').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !email || !message) {
    // Shake invalid fields
    [document.getElementById('contactName'), document.getElementById('contactEmailInput'), document.getElementById('contactMessage')].forEach(inp => {
      if (!inp.value.trim()) {
        inp.style.borderColor = '#ef4444';
        inp.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
        setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 2000);
      }
    });
    return;
  }

  // Simulate sending
  submitBtn.querySelector('.btn-text').textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    submitBtn.disabled = false;
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1500);
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, suffix='') {
  let current = 0;
  const step  = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current + suffix;
  }, 40);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent;
        if (text.includes('+')) {
          animateCounter(num, parseInt(text), '+');
        } else if (text.includes('%')) {
          animateCounter(num, parseInt(text), '%');
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ---- TILT EFFECT ON PROJECT CARDS ----
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const rotX   = -(y / rect.height) * 6;
    const rotY   =  (x / rect.width)  * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- HERO PARALLAX ON SCROLL ----
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const glows   = document.querySelectorAll('.hero-bg-glow');
  glows.forEach((glow, i) => {
    const speed = (i + 1) * 0.15;
    glow.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ---- FLOATING CHIPS MOUSE PARALLAX ----
document.addEventListener('mousemove', (e) => {
  const chips = document.querySelectorAll('.floating-chip');
  const cx    = window.innerWidth  / 2;
  const cy    = window.innerHeight / 2;
  chips.forEach((chip, i) => {
    const depth = (i + 1) * 0.008;
    const dx    = (e.clientX - cx) * depth;
    const dy    = (e.clientY - cy) * depth;
    chip.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});

console.log('%c👩‍💻 Sehrish Shaikh Portfolio', 'color: #a855f7; font-size: 1.2rem; font-weight: bold;');
console.log('%c💜 Full Stack Developer | UI/UX Designer | Open to Remote Opportunities', 'color: #d946ef; font-size: 0.9rem;');
console.log('%c📧 Shaikhsehr9@gmail.com', 'color: #c084fc; font-size: 0.85rem;');
