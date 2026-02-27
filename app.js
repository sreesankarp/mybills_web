// ═══════════════════════════════════════════════════════════════
// MyBills Landing Page — Core JavaScript
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  let currentLang = 'en';

  // ── Language Data for Grid ──
  const LANG_DATA = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'ks', name: 'Kashmiri', native: 'कश्मीरी' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी' },
    { code: 'brx', name: 'Bodo', native: 'बड़ो' },
    { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  ];

  // ── RTL languages ──
  const RTL_LANGS = ['ur', 'sd'];

  // ════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    initLanguageSelector();
    initLanguageGrid();
    initScrollReveal();
    initCounterAnimation();
    initNavbarScroll();
    initMobileMenu();
    initParticles();
    initSmoothScroll();

    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      setLanguage(browserLang);
      document.getElementById('langSelect').value = browserLang;
    }
  });

  // ════════════════════════════════════════
  //  LANGUAGE SWITCHER
  // ════════════════════════════════════════
  function initLanguageSelector() {
    const select = document.getElementById('langSelect');
    LANG_DATA.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = `${l.native} (${l.name})`;
      if (l.code === 'en') opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  function setLanguage(lang) {
    currentLang = lang;
    // Set dir for RTL
    document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key, lang);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    // Special handling for hero h1 (use dedicated keys, fallback to split)
    const beforeEl = document.querySelector('[data-i18n="hero_tagline_before"]');
    const highlightEl = document.querySelector('[data-i18n="hero_tagline_highlight"]');
    if (beforeEl && highlightEl) {
      const before = t('hero_tagline_before', lang);
      const highlight = t('hero_tagline_highlight', lang);
      // If the key exists natively, use it; otherwise split the full tagline
      if (before !== 'hero_tagline_before') {
        beforeEl.textContent = before;
        highlightEl.textContent = highlight !== 'hero_tagline_highlight' ? highlight : '';
      } else {
        const tagline = t('hero_tagline', lang);
        const parts = tagline.split(',');
        if (parts.length >= 2) {
          beforeEl.textContent = parts[0] + ',';
          highlightEl.textContent = parts.slice(1).join(',').trim();
        } else {
          beforeEl.textContent = '';
          highlightEl.textContent = tagline;
        }
      }
    }
  }

  // ════════════════════════════════════════
  //  LANGUAGE GRID
  // ════════════════════════════════════════
  function initLanguageGrid() {
    const grid = document.getElementById('languagesGrid');
    if (!grid) return;
    LANG_DATA.forEach((l, i) => {
      const chip = document.createElement('div');
      chip.className = 'lang-chip';
      chip.style.animationDelay = `${i * 0.05}s`;
      chip.innerHTML = `<span class="lang-native">${l.native}</span> <span>${l.name}</span>`;
      chip.addEventListener('click', () => {
        setLanguage(l.code);
        document.getElementById('langSelect').value = l.code;
      });
      grid.appendChild(chip);
    });
  }

  // ════════════════════════════════════════
  //  SCROLL REVEAL (Intersection Observer)
  // ════════════════════════════════════════
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ════════════════════════════════════════
  //  COUNTER ANIMATION
  // ════════════════════════════════════════
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.count-up[data-target]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ════════════════════════════════════════
  //  NAVBAR SCROLL EFFECT
  // ════════════════════════════════════════
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ════════════════════════════════════════
  //  MOBILE MENU
  // ════════════════════════════════════════
  function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      // Animate hamburger to X
      const spans = toggle.querySelectorAll('span');
      if (links.classList.contains('open')) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        const spans = toggle.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ════════════════════════════════════════
  //  BACKGROUND PARTICLES
  // ════════════════════════════════════════
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 15 + 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      container.appendChild(p);
    }
  }

  // ════════════════════════════════════════
  //  SMOOTH SCROLL
  // ════════════════════════════════════════
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── SmartScreen Modal: close on Escape ──
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('smartscreen-modal');
      if (modal) modal.classList.remove('active');
    }
  });

  // ── Desktop & Phone Screenshot Slider ──
  let slideIndex = 0;
  const desktopCount = 3;
  const phoneCount = 6;
  let slideTimer;

  window.slideTo = function (index) {
    slideIndex = index;
    const dSlider = document.getElementById('desktopSlider');
    const pSlider = document.getElementById('phoneSlider');
    const dots = document.querySelectorAll('.slide-dot');
    if (dSlider) dSlider.style.transform = 'translateX(-' + (index * 100) + '%)';
    // Phone cycles through its 6 images (2 per desktop slide)
    if (pSlider) {
      var phoneIdx = (index * 2) % phoneCount;
      pSlider.style.transform = 'translateX(-' + (phoneIdx * 100) + '%)';
    }
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
    clearInterval(slideTimer);
    slideTimer = setInterval(autoSlide, 5000);
  };

  function autoSlide() {
    window.slideTo((slideIndex + 1) % desktopCount);
  }

  slideTimer = setInterval(autoSlide, 5000);

})();
