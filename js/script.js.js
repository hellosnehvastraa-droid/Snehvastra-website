// ---------------------- Mobile Menu Toggle ----------------------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// ---------------------- Carousel Functionality ----------------------
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const carousel = document.querySelector('.carousel');

nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
});

// Auto-slide every 3 seconds
let autoSlideInterval = setInterval(() => {
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
    }
}, 3000);

// Pause auto-slide on hover
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }, 3000);
});

// ---------------------- Countdown Timer ----------------------
const countdownDate = new Date("2025-10-10T00:00:00").getTime(); // Set your drop date here

const countdownFunction = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, "0");
    document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");

    if (distance < 0) {
        clearInterval(countdownFunction);
        document.querySelector(".countdown").innerHTML = "<div>Drop is Live!</div>";
    }
}, 1000);

// ---------------------- 🌸 Cinematic Intro Control with Zoom-in Main Content ----------------------
window.addEventListener("load", () => {
    const intro = document.getElementById("intro");
    const mainContent = document.getElementById("main-content");
    const gradient = document.querySelector(".gradient-bg");
    const logo = document.querySelector(".intro-logo");

    // Get CSS animation duration (logo animation)
    const animationDuration = parseFloat(getComputedStyle(logo).animationDuration) * 1000; // ms

    // Wait for logo animation to complete
    setTimeout(() => {
        // Fade out logo and gradient together
        intro.style.transition = "opacity 1s ease";
        intro.style.opacity = "0";
        gradient.style.transition = "opacity 1s ease";
        gradient.style.opacity = "0";

        // After fade-out, hide intro and show main content
        setTimeout(() => {
            intro.style.display = "none";
            mainContent.style.display = "block";

            // Add fade-in + zoom-in animation
            mainContent.style.opacity = "0";
            mainContent.style.transform = "scale(0.95)";
            mainContent.style.transition = "opacity 1.5s ease, transform 1.5s ease";

            // Trigger animation
            requestAnimationFrame(() => {
                mainContent.style.opacity = "1";
                mainContent.style.transform = "scale(1)";
            });
        }, 1000); // match fade-out duration
    }, animationDuration);
});