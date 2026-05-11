/* ============================================================
   RAJU CHANDRA BORMON – Portfolio Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- AOS Init ----
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });

  // ---- Theme Toggle ----
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // ---- Scroll Progress Bar ----
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ---- Sticky Navbar ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---- Back to Top ----
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');

  const observerOpts = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));

  // ---- Animated Counters ----
  const counters = document.querySelectorAll('.counter-number');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.3 });

  const counterSection = document.getElementById('results');
  if (counterSection) counterObserver.observe(counterSection);

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // ---- Skill Bars Animation ----
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ---- Swiper Testimonials ----
  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    breakpoints: {
      640: { slidesPerView: 1 },
      900: { slidesPerView: 2 },
    }
  });

  // ---- Particles Canvas ----
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    let mouse = { x: null, y: null };

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    function getAccentColor() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#38bdf8';
    }

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.5 + 0.2);
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = getAccentColor();
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.x !== null) {
          const dx = this.x - mouse.x, dy = this.y - mouse.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            this.x += dx / dist * 0.8;
            this.y += dy / dist * 0.8;
          }
        }

        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function connectParticles() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = getAccentColor();
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient bg mesh
      const theme = document.documentElement.getAttribute('data-theme');
      const gradColor = theme === 'dark' ? 'rgba(56,189,248,0.04)' : 'rgba(56,189,248,0.06)';
      const grad = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.6
      );
      grad.addColorStop(0, gradColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animFrame = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // Stop animation when section not visible for performance
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animFrame) { initParticles(); animate(); }
        } else {
          cancelAnimationFrame(animFrame);
          animFrame = null;
        }
      });
    }, { threshold: 0 });
    heroObserver.observe(document.getElementById('hero'));
  }

  // ---- Contact Form ----
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Simulate async send (replace with real endpoint)
      setTimeout(() => {
        form.reset();
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        formSuccess.classList.add('show');
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          formSuccess.classList.remove('show');
        }, 5000);
      }, 1800);
    });
  }

  // ---- Smooth scroll for same-page anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Tilt Effect on Cards ----
  document.querySelectorAll('.service-card, .counter-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---- Typed Hero Headline Effect ----
  // Highlight number words with accent
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '1';
  }

  // ---- Parallax on Hero ----
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const scrollY = window.scrollY;
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
    }
  }, { passive: true });

});
