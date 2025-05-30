// script.js

(() => {
  'use strict';

  // Configuration
  const CONFIG = {
    weddingDateISO: '2025-08-09T15:00:00',
    nameRevealDuration: 3000,
    countdownInterval: 1000,
  };

  /**
   * Remove the name-reveal section after the initial animation.
   */
  const initNameReveal = () => {
    const section = document.querySelector('.page.name-reveal');
    if (!section) return;

    setTimeout(() => {
      section.remove();
    }, CONFIG.nameRevealDuration);
  };

  /**
   * Smoothly scroll to the next section after intro.
   */
  const scrollToNext = () => {
    const intro = document.querySelector('.page.intro-eye');
    if (!intro) return;
    const next = intro.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  window.scrollToNext = scrollToNext; // expose for onclick in HTML

  /**
   * Update countdown elements in the DOM.
   */
  const updateCountdown = () => {
    const target = new Date(CONFIG.weddingDateISO).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const units = [
      { id: 'days',    ms: 86400000 },
      { id: 'hours',   ms: 3600000  },
      { id: 'minutes', ms: 60000    },
      { id: 'seconds', ms: 1000     },
    ];

    units.forEach(({ id, ms }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const value = Math.floor(diff / ms) % (id === 'days' ? Infinity : (86400000 / ms));
      el.textContent = String(value).padStart(2, '0');
    });
  };

  /**
   * Initialize countdown timer.
   */
  const initCountdown = () => {
    updateCountdown();
    setInterval(updateCountdown, CONFIG.countdownInterval);
  };

  /**
   * Handle RSVP form submission via EmailJS.
   */
  const initRSVP = () => {
    const form = document.getElementById('rsvp-form');
    if (!form || !window.emailjs) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const thanksMsg = document.getElementById('thanks');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!submitBtn) return;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verzenden…';
      thanksMsg?.classList.remove('visible');

      try {
        await emailjs.sendForm('service_j12dpb9', 'template_p45lme8', form);
        thanksMsg?.classList.add('visible');
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        alert('Er ging iets mis bij het versturen. Probeer het nog eens.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Bevestigen';
      }
    });
  };

  /**
   * Apply scroll-based fade-in animations.
   */
  const initFadeInOnScroll = () => {
    const options = { threshold: 0.2, rootMargin: '0px 0px -10% 0px' };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  };

  // Initialize all features when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initNameReveal();
    initCountdown();
    initRSVP();
    initFadeInOnScroll();
  });
})();
