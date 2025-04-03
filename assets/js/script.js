// Mobile Navigation
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const mobileLinks = document.querySelectorAll('.mobile-links li a');

burger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    burger.classList.add('active');
    burger.classList.add('hidden');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    burger.classList.remove('active');
    burger.classList.remove('hidden');
    document.body.style.overflow = 'auto';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        burger.classList.remove('active');
        burger.classList.remove('hidden');
        document.body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        mobileMenu.classList.remove('active');
        burger.classList.remove('active');
        burger.classList.remove('hidden');
        document.body.style.overflow = 'auto';
    }
});

// Responsive Navigation
function handleResponsiveNav() {
    if (window.innerWidth <= 992) {
        document.querySelector('.nav-links').style.display = 'none';
        burger.style.display = 'block';
    } else {
        document.querySelector('.nav-links').style.display = 'flex';
        burger.style.display = 'none';
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('resize', handleResponsiveNav);
handleResponsiveNav();

// Testimonial Carousel
const testimonialCarousel = document.querySelector('.testimonial-carousel');
const prevBtn = document.querySelector('.prev-testimonial');
const nextBtn = document.querySelector('.next-testimonial');
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentIndex = 0;

function updateCarousel() {
    const cardWidth = testimonialCards[0].offsetWidth + 30; // including gap
    testimonialCarousel.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
    });
}

nextBtn.addEventListener('click', () => {
    if (currentIndex < testimonialCards.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = testimonialCards.length - 1;
    }
    updateCarousel();
});

// Auto-scroll testimonials
let autoScrollInterval = setInterval(() => {
    if (currentIndex < testimonialCards.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}, 5000);

// Pause auto-scroll on hover
testimonialCarousel.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
});

testimonialCarousel.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
        if (currentIndex < testimonialCards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 5000);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Thank you for your booking request! We will contact you shortly.');
                this.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            alert('There was a problem submitting your form. Please try again or contact us directly.');
            console.error('Error:', error);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    });
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

// Video lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const lazyVideos = document.querySelectorAll('iframe[data-src]');
    
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
                observer.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    lazyVideos.forEach(iframe => {
        videoObserver.observe(iframe);
    });
});