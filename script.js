document.getElementById("rsvp-form").addEventListener("submit", function(e) {
    e.preventDefault();
    document.getElementById("thanks").style.display = "block";
    this.reset();
});



function updateCountdown() {
    const weddingDate = new Date("2025-08-09T15:00:00").getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById("days").innerHTML = "0";
        document.getElementById("hours").innerHTML = "0";
        document.getElementById("minutes").innerHTML = "0";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
}

setInterval(updateCountdown, 1000);
updateCountdown();
