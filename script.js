// Debug: zie of script.js geladen wordt
console.log("[Debug] script.js geladen");

// === Remove name-reveal after animation completes ===
document.addEventListener("DOMContentLoaded", () => {
  const nameRevealSection = document.querySelector('.page.name-reveal');
  if (nameRevealSection) {
    // Remove the element after animation completes (3 seconds)
    setTimeout(() => {
      nameRevealSection.style.display = 'none';
      console.log("[Debug] Name reveal section removed");
    }, 3000);
  }
});

// === Scroll to next section function ===
function scrollToNext() {
  const currentSection = document.querySelector('.page.intro-eye');
  const nextSection = currentSection.nextElementSibling;
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// === Countdown ===
function updateCountdown() {
  const weddingDate = new Date("2025-08-09T15:00:00").getTime();
  const now = Date.now();
  const diff = weddingDate - now;
  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = "0";
    });
    return;
  }

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  const dayEl = document.getElementById("days");
  const hourEl = document.getElementById("hours");
  const minEl = document.getElementById("minutes");
  const secEl = document.getElementById("seconds");

  if (dayEl) dayEl.textContent = days;
  if (hourEl) hourEl.textContent = hours;
  if (minEl) minEl.textContent = minutes;
  if (secEl) secEl.textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// === EmailJS‐submit & Fade‐in ===
document.addEventListener("DOMContentLoaded", () => {
  // EmailJS‐submit
  const form      = document.getElementById("rsvp-form");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  const thanksMsg = document.getElementById("thanks");

  if (form && submitBtn) {
    form.addEventListener("submit", e => {
      e.preventDefault();                       // voorkom default scroll-to-top
      submitBtn.disabled    = true;
      submitBtn.textContent = "Verzenden…";
      if (thanksMsg) thanksMsg.style.display = "none";

      emailjs.sendForm(
        'service_j12dpb9',    // jouw Service ID
        'template_p45lme8',   // jouw Template ID
        form                  // of '#rsvp-form'
      ).then(() => {
        if (thanksMsg) thanksMsg.style.display = "block";
        form.reset();
      }).catch(err => {
        console.error("EmailJS error:", err);
        alert("Er ging iets mis bij het versturen. Probeer het nog eens.");
      }).finally(() => {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Bevestigen";
      });
    });
  }

  // Fade‐in op scroll
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px"
  });

  faders.forEach(el => observer.observe(el));
});
