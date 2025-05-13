document.getElementById("rsvp-form").addEventListener("submit", function(e) {
    e.preventDefault();
    document.getElementById("thanks").style.display = "block";
    this.reset();
});
