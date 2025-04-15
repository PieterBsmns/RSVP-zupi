document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('rsvpForm');
  const submitButton = document.getElementById('submitButton');
  const confirmationMessage = document.getElementById('confirmationMessage');
  const errorMessage = document.getElementById('errorMessage');

  // Check if the form actually exists on the page
  if (!form) {
    console.error("RSVP form not found on the page.");
    return; // Stop if form isn't found
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default browser form submission

    // Disable button and clear previous messages
    submitButton.disabled = true;
    submitButton.textContent = 'Verzenden...';
    confirmationMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    const formData = new FormData(form);
    const action = form.action; // Get the Formspree URL from the form's action attribute

    // Send the data to Formspree
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json' // Formspree needs this for AJAX to work correctly
      }
    })
    .then(response => {
      if (response.ok) {
        // Success! Show confirmation, reset form
        confirmationMessage.style.display = 'block';
        form.reset(); // Clear the form fields
      } else {
        // Server returned an error (e.g., Formspree config issue)
        response.json().then(data => {
          // Try to display a specific error from Formspree if available
          if (data && data.errors) {
            errorMessage.textContent = data.errors.map(error => error.message).join(", ");
          } else {
            errorMessage.textContent = 'Er is een serverfout opgetreden. Controleer de Formspree configuratie.';
          }
          errorMessage.style.display = 'block';
        }).catch(() => {
          // Fallback if the error response wasn't valid JSON
          errorMessage.textContent = 'Er is een onbekende serverfout opgetreden.';
          errorMessage.style.display = 'block';
        });
      }
    })
    .catch(error => {
      // Network error or other issue with the fetch request itself
      console.error('Fetch Error:', error);
      errorMessage.textContent = 'Kon geen verbinding maken. Controleer je internetverbinding en probeer opnieuw.';
      errorMessage.style.display = 'block';
    })
    .finally(() => {
      // Re-enable the button regardless of success or failure
      submitButton.disabled = false;
      submitButton.textContent = 'Verzend RSVP';
    });
  });
});
