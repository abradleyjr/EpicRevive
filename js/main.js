/**
 * Epic Revive — Main JavaScript
 * Handles: nav scroll state, mobile menu, FAQ accordion, form submission, scroll fade-in
 */

(function () {
  'use strict';

  /* ── Navigation Scroll State ─────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run on load

  /* ── Mobile Menu ─────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navDrawer = document.getElementById('nav-drawer');

  if (hamburger && navDrawer) {
    hamburger.addEventListener('click', function () {
      const isOpen = navDrawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when a link inside is clicked
    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close drawer on outside click
    document.addEventListener('click', function (e) {
      if (
        navDrawer.classList.contains('open') &&
        !navDrawer.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── FAQ Accordion ───────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.faq-item__trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', (!isOpen).toString());
    });

    // Keyboard accessibility
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  /* ── Email Form Handling ─────────────────────────────────── */
  function handleFormSubmit(form, successId) {
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const successMsg = document.getElementById(successId);

      if (!emailInput || !emailInput.value.trim()) {
        emailInput && emailInput.focus();
        return;
      }

      // Basic email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.style.borderColor = '#c0392b';
        setTimeout(function () {
          emailInput.style.borderColor = '';
        }, 2000);
        return;
      }

      // Simulate submission (replace with real endpoint)
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';
      }

      // In production, replace with a fetch() to your form endpoint or CRM
      setTimeout(function () {
        form.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('visible');
        }

        // Store email locally for debugging (remove in production)
        try {
          const existing = JSON.parse(localStorage.getItem('er_leads') || '[]');
          existing.push({ email: emailInput.value.trim(), ts: new Date().toISOString() });
          localStorage.setItem('er_leads', JSON.stringify(existing));
        } catch (_) { /* non-critical */ }
      }, 800);
    });
  }

  handleFormSubmit(document.getElementById('hero-form'),   'hero-success');
  handleFormSubmit(document.getElementById('bottom-form'), 'bottom-success');

  /* ── Scroll Fade-In ──────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately for older browsers
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href === currentPage) {
      link.classList.add('active');
    }
  });

})();
