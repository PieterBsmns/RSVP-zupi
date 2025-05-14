// Debug: zie of script.js geladen wordt
console.log("[Debug] script.js geladen");

// === Countdown ===
function updateCountdown() {
  const weddingDate = new Date("2025-08-09T15:00:00").getTime();
  const now = Date.now();
  const diff = weddingDate - now;

  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => {
      document.getElementById(id).textContent = "0";
    });
    return;
  }
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  document.getElementById("days").textContent    = days;
  document.getElementById("hours").textContent   = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// === EmailJS‐submit & Fade‐in ===
document.addEventListener("DOMContentLoaded", () => {
  // EmailJS‐submit
  const form      = document.getElementById("rsvp-form");
  const submitBtn = form.querySelector('button[type="submit"]');
  const thanksMsg = document.getElementById("thanks");

  form.addEventListener("submit", e => {
    e.preventDefault();                       // voorkom default scroll-to-top
    submitBtn.disabled    = true;
    submitBtn.textContent = "Verzenden…";
    thanksMsg.style.display = "none";

    emailjs.sendForm(
      'service_j12dpb9',    // jouw Service ID
      'template_p45lme8',   // jouw Template ID
      form                  // of '#rsvp-form'
    ).then(() => {
      thanksMsg.style.display = "block";
      form.reset();
    }).catch(err => {
      console.error("EmailJS error:", err);
      alert("Er ging iets mis bij het versturen. Probeer het nog eens.");
    }).finally(() => {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Bevestigen";
    });
  });

  // Fade‐in op scroll
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
  faders.forEach(el => observer.observe(el));
});
