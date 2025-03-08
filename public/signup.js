document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupButton = signupForm.querySelector('button[type="submit"]');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Disable the signup button and show a loading message
        signupButton.disabled = true;
        signupButton.textContent = 'Signing up...';

        const formData = new FormData(signupForm);

        fetch('signup.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Redirect to the login page after successful signup
                window.location.href = 'login.html';
            } else {
                signupButton.disabled = false;
                signupButton.textContent = 'Sign Up';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            signupButton.disabled = false;
            signupButton.textContent = 'Sign Up';
        });
    });
});