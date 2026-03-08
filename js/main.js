/**
 * Epic Revive — Main JavaScript
 * Minimal, purposeful interactions
 */

(function () {
  'use strict';

  // ============================================
  // NAV: Scroll behavior & mobile toggle
  // ============================================
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  // Add 'scrolled' class when page scrolls past 60px
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav && nav.classList.add('scrolled');
    } else {
      nav && nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on init

  // Mobile hamburger toggle
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMobile.classList.contains('is-open');
      navMobile.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(!isOpen));

      // Animate hamburger lines
      const spans = navToggle.querySelectorAll('span');
      if (!isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile nav when a link is clicked
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ============================================
  // ACCORDION: Protocol cards
  // ============================================
  document.querySelectorAll('[data-toggle]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const card = trigger.closest('.protocol-card');
      if (!card) return;

      const isOpen = card.classList.contains('is-open');

      // Close all other open cards
      document.querySelectorAll('.protocol-card.is-open').forEach(function (openCard) {
        if (openCard !== card) {
          openCard.classList.remove('is-open');
        }
      });

      // Toggle current card
      card.classList.toggle('is-open', !isOpen);
    });
  });

  // ============================================
  // FADE IN: Intersection Observer for scroll animations
  // ============================================
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately for older browsers
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ============================================
  // FORM: Founding Access form handling
  // ============================================
  const form = document.getElementById('founding-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        }
      });

      // Email format check
      const emailField = form.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          emailField.style.borderColor = '#c0392b';
          valid = false;
        }
      }

      if (!valid) return;

      // Simulate form submission (replace with actual endpoint)
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // In production: replace this timeout with an actual fetch/POST call
      setTimeout(function () {
        form.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
        }
      }, 900);
    });
  }

  // ============================================
  // SMOOTH SCROLL: Internal anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 80;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

})();
