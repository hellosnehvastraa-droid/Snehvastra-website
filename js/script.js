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

// ---------------------- 🌸 Cinematic Intro Control ----------------------
window.addEventListener("load", () => {
    const intro = document.getElementById("intro");
    const mainContent = document.getElementById("main-content");

    // Wait for logo animation duration, then show main page
    setTimeout(() => {
        intro.style.opacity = "0";
        intro.style.transition = "opacity 1s ease";
        setTimeout(() => {
            intro.style.display = "none";
            mainContent.style.display = "block";
            mainContent.classList.add("fade-in");
        }, 1000);
    }, 4000); // 4 seconds for logo animation
});
