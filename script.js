// script.js

(() => {
  'use strict';

  // Configuration
  const CONFIG = {
    weddingDateISO: '2025-08-09T18:30:00',
    nameRevealDuration: 3000,
    countdownInterval: 1000,
    disableRsvp: true
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
  const now    = Date.now();
  let   diff   = Math.max(0, target - now); // let ipv const

  const units = [
    { id: 'days',    ms: 1000 * 60 * 60 * 24 },
    { id: 'hours',   ms: 1000 * 60 * 60 },
    { id: 'minutes', ms: 1000 * 60 },
    { id: 'seconds', ms: 1000 }
  ];
  
  units.forEach(({ id, ms }) => {
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
window.initRSVP = () => {
  const form = document.getElementById('rsvp-form');
  if (!form || !window.emailjs) {
    console.warn('RSVP init skipped: formulier of EmailJS niet gevonden.');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const thanksMsg = document.getElementById('thanks');
  const nameInput = form.querySelector('#names');
  const telInput = form.querySelector('#telephone');
  const errorMsg = document.getElementById('form-error');

   // Disable form if RSVP is disabled
  if (CONFIG.disableRsvp === true) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registratie gesloten';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';

    nameInput.disabled = true;
    telInput.disabled = true;

    return; // ⛔ Stop verdere initialisatie
  }

  // Validation feedback on input (live feedback)
  const checkFields = () => {
    const nameFilled = !!nameInput.value.trim();
    const telFilled = !!telInput.value.trim();

    // Enable button if at least one field is filled (so they can trigger submit/error)
    submitBtn.disabled = !(nameFilled || telFilled);

    // Hide error as soon as both are filled
    if (nameFilled && telFilled) {
      errorMsg.style.display = 'none';
      errorMsg.classList.remove('visible');
    }
  };

  nameInput.addEventListener('input', checkFields);
  telInput.addEventListener('input', checkFields);
  checkFields();

  form.addEventListener('submit', async e => {
    e.preventDefault(); // always prevent default

    const nameFilled = !!nameInput.value.trim();
    const telFilled = !!telInput.value.trim();

    if (!nameFilled || !telFilled) {
      // Show error below button
      errorMsg.textContent = 'Gelieve naam en telefoonnummer in te vullen.';
      errorMsg.style.display = 'block';
      errorMsg.classList.add('visible');
      // Don't proceed
      return;
    }

    // Hide error
    errorMsg.style.display = 'none';
    errorMsg.classList.remove('visible');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Verzenden…';
    thanksMsg?.classList.remove('visible');

    try {
      const result = await emailjs.sendForm(
        'service_j12dpb9',
        'template_p45lme8',
        form,
        'U7x0W_K_fgyaWVT03'
      );
      thanksMsg?.classList.add('visible');
      form.reset();
      checkFields();
    } catch (err) {
      alert('Er ging iets mis bij het versturen:\n' + JSON.stringify(err, null, 2));
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
    /*initRSVP();*/
    initFadeInOnScroll();
  });
})();
