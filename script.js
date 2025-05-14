function updateCountdown() {
    const weddingDate = new Date("2025-08-09T15:00:00").getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById("days").innerHTML = "0";
        document.getElementById("hours").innerHTML = "0";
        document.getElementById("minutes").innerHTML = "0";
        document.getElementById("seconds").innerHTML = "0";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
}

document.getElementById("rsvp-form").addEventListener("submit", function(e) {
    //e.preventDefault();
    document.getElementById("thanks").style.display = "block";
    this.reset();
});

setInterval(updateCountdown, 1000);
updateCountdown();

// Selecteer alle elementen met fade-in
const faders = document.querySelectorAll('.fade-in');

// Maak een observer die een .visible-klasse toevoegt zodra in view
const observerOptions = {
  threshold: 0.2,    // 20% zichtbaar voordat animatie start
  rootMargin: '0px 0px -10% 0px'  // laat de animatie iets eerder beginnen
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target); // optioneel: één keer animeren
    }
  });
}, observerOptions);

// Observeer elk fade-in element
faders.forEach(el => observer.observe(el));
