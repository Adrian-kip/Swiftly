document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        // Change button state
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
        
        try {
            // Submit to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                showMessage('Booking request submitted successfully! We\'ll contact you shortly.', 'success');
                form.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit form');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error: ' + error.message, 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
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
                markFieldAsError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            markFieldAsError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone number
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            markFieldAsError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate return date if provided
        const departureDate = document.getElementById('departure-date').value;
        const returnDate = document.getElementById('return-date').value;
        if (returnDate && returnDate < departureDate) {
            markFieldAsError(document.getElementById('return-date'), 'Return date must be after departure date');
            isValid = false;
        }
        
        return isValid;
    }
    
    function markFieldAsError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '0.8em';
        errorElement.style.marginTop = '5px';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    }
    
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.getElementById('form-message');
        if (existingMessage) existingMessage.remove();
        
        const messageElement = document.createElement('div');
        messageElement.id = 'form-message';
        messageElement.textContent = message;
        messageElement.style.padding = '10px';
        messageElement.style.margin = '15px 0';
        messageElement.style.borderRadius = '4px';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = '#dff0d8';
            messageElement.style.color = '#3c763d';
            messageElement.style.border = '1px solid #d6e9c6';
        } else {
            messageElement.style.backgroundColor = '#f2dede';
            messageElement.style.color = '#a94442';
            messageElement.style.border = '1px solid #ebccd1';
        }
        
        form.insertBefore(messageElement, form.firstChild);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.5s';
            messageElement.style.opacity = '0';
            setTimeout(() => messageElement.remove(), 500);
        }, 5000);
    }
});