// Debug: zie of script.js geladen wordt
console.log("[Debug] script.js geladen");

// === Countdown ===
function updateCountdown() {
  const weddingDate = new Date("2025-08-09T15:00:00").getTime();
  const now         = Date.now();
  const distance    = weddingDate - now;

  if (distance < 0) {
    ["days","hours","minutes","seconds"].forEach(id => {
      document.getElementById(id).textContent = "0";
    });
    return;
  }

  const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60))      / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60))            / 1000);

  document.getElementById("days").textContent    = days;
  document.getElementById("hours").textContent   = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();


// === EmailJS formulier-verzending & fade-in ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Debug] DOMContentLoaded");
  // 1) EmailJS-submit
  const form      = document.getElementById("rsvp-form");
  console.log("[Debug] form gevonden:", form);
  const submitBtn = form.querySelector('button[type="submit"]');
  console.log("[Debug] submitBtn:", submitBtn);
  const thanksMsg = document.getElementById("thanks");
  console.log("[Debug] thanksMsg:", thanksMsg);

  form.addEventListener("submit", e => {
    e.preventDefault();
    submitBtn.disabled     = true;
    submitBtn.textContent  = "Verzenden…";
    thanksMsg.style.display = "none";

    emailjs.sendForm(
      'service_j12dpb9',     // jouw Service ID
      'template_p45lme8',    // jouw Template ID
      '#rsvp-form'           // of form element zelf
    )
    .then(() => {
      thanksMsg.style.display = "block";
      form.reset();
    })
    .catch(err => {
      console.error("EmailJS fout:", err);
      alert("Er ging iets mis bij het versturen. Probeer het nog eens.");
    })
    .finally(() => {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Bevestigen";
    });
  });

  // 2) Fade-in on scroll
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
