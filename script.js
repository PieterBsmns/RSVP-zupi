// script.js

(() => {
  'use strict';

  // Configuration
  const CONFIG = {
    weddingDateISO: '2025-08-09T18:30:00',
    nameRevealDuration: 3000,
    countdownInterval: 1000,
  };

  /** Remove the name-reveal section after animation. */
  const initNameReveal = () => {
    const section = document.querySelector('.page.name-reveal');
    if (!section) return;
    setTimeout(() => section.remove(), CONFIG.nameRevealDuration);
  };

  /** Smooth scroll to the next section. */
  const scrollToNext = () => {
    const intro = document.querySelector('.page.intro-eye');
    if (!intro) return;
    const next = intro.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };
  window.scrollToNext = scrollToNext;

  /** Update countdown timer elements. */
  const updateCountdown = () => {
    const target = new Date(CONFIG.weddingDateISO).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

  const units = [
    { id: 'days',    ms: 1000 * 60 * 60 * 24 },
    { id: 'hours',   ms: 1000 * 60 * 60 },
    { id: 'minutes', ms: 1000 * 60 },
    { id: 'seconds', ms: 1000 }
  ];
  
    units.forEach(({ id, ms }, index) => {
      const value = Math.floor(diff / ms);
      diff = diff % ms;
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2, '0');
  });
};

  /** Initialize countdown. */
  const initCountdown = () => {
    updateCountdown();
    setInterval(updateCountdown, CONFIG.countdownInterval);
  };

  /** Setup RSVP form: required fields, dynamic button state, and EmailJS. */
  const initRSVP = () => {
    const form = document.getElementById('rsvp-form');
    if (!form || !window.emailjs) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const thanksMsg = document.getElementById('thanks');
    const nameInput = form.querySelector('#names');
    const telInput = form.querySelector('#telephone');

    // Disable submit until required fields (name + telephone) are filled
    const updateSubmitState = () => {
      const canSubmit = nameInput.value.trim() && telInput.value.trim();
      submitBtn.disabled = !canSubmit;
    };
    nameInput.addEventListener('input', updateSubmitState);
    telInput.addEventListener('input', updateSubmitState);
    updateSubmitState();

    form.addEventListener('submit', async e => {
      // HTML5 validation: show built-in messages if invalid
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verzenden…';
      thanksMsg?.classList.remove('visible');

      try {
        await emailjs.sendForm('service_j12dpb9', 'template_p45lme8', form);
        thanksMsg?.classList.add('visible');
        form.reset();
        updateSubmitState();
      } catch (err) {
        console.error('EmailJS error:', err);
        alert('Er ging iets mis bij het versturen. Probeer het nog eens.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Bevestigen';
      }
    });
  };

  /** Fade-in elements on scroll into view. */
  const initFadeInOnScroll = () => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initNameReveal();
    initCountdown();
    initRSVP();
    initFadeInOnScroll();
  });
})();
