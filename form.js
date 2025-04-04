document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        hideMessage();
        
        // Validate form
        if (!validateForm()) return;
        
        // Prepare form data
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        
        // Add checkbox state
        formObject['video-documentation'] = form.querySelector('#video-documentation').checked;
        
        // Show loading state
        showLoading(true);

        try {
            // Send to Google Apps Script
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('Booking submitted successfully! Confirmation sent to your email.', 'success');
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to submit booking');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    });

    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });

        // Validate required fields
        const requiredFields = [
            'full-name', 'email', 'phone', 
            'service-type', 'departure', 
            'destination', 'departure-date', 
            'passengers'
        ];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
            showError(emailField, 'Please enter a valid email');
            isValid = false;
        }

        // Validate phone number
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneField.value)) {
            showError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate return date if provided
        const departureDate = document.getElementById('departure-date').value;
        const returnDate = document.getElementById('return-date').value;
        if (returnDate && returnDate < departureDate) {
            showError(document.getElementById('return-date'), 'Return date must be after departure date');
            isValid = false;
        }

        return isValid;
    }

    function showError(field, message) {
        field.classList.add('error');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = type;
        formMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.style.opacity = '0';
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.style.opacity = '1';
            }, 300);
        }, 5000);
    }

    function hideMessage() {
        formMessage.style.display = 'none';
    }

    function showLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Booking Request';
        }
    }
});