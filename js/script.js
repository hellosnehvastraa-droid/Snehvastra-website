// ---------------------- Defensive helper ----------------------
function safeQuery(selector) {
  try {
    return document.querySelector(selector);
  } catch (e) {
    return null;
  }
}

// ---------------------- Mobile Menu Toggle ----------------------
const menuToggle = safeQuery('.menu-toggle');
const navLinks = safeQuery('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// ---------------------- Carousel Functionality ----------------------
const prevBtn = safeQuery('.carousel-btn.prev');
const nextBtn = safeQuery('.carousel-btn.next');
const carousel = safeQuery('.carousel');

if (nextBtn && carousel) {
  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  });
}
if (prevBtn && carousel) {
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  });
}

// Auto-slide every 3 seconds (only if carousel exists)
let autoSlideInterval = null;
if (carousel) {
  autoSlideInterval = setInterval(() => {
    try {
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
      }
    } catch (e) {
      // ignore
    }
  }, 3000);

  // Pause auto-slide on hover
  carousel.addEventListener('mouseenter', () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  });

  carousel.addEventListener('mouseleave', () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      try {
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: 300, behavior: 'smooth' });
        }
      } catch (e) {}
    }, 3000);
  });
}

// ---------------------- Countdown Timer ----------------------
// Make sure elements exist before using them
const daysEl = safeQuery('#days');
const hoursEl = safeQuery('#hours');
const minutesEl = safeQuery('#minutes');
const secondsEl = safeQuery('#seconds');

const countdownDate = new Date("2025-10-10T00:00:00").getTime(); // adjust as needed

if (daysEl && hoursEl && minutesEl && secondsEl) {
  const countdownFunction = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = Math.max(0, days).toString().padStart(2, "0");
    hoursEl.innerText = Math.max(0, hours).toString().padStart(2, "0");
    minutesEl.innerText = Math.max(0, minutes).toString().padStart(2, "0");
    secondsEl.innerText = Math.max(0, seconds).toString().padStart(2, "0");

    if (distance < 0) {
      clearInterval(countdownFunction);
      const countdownContainer = safeQuery('.countdown');
      if (countdownContainer) countdownContainer.innerHTML = "<div>Drop is Live!</div>";
    }
  }, 1000);
}

// ---------------------- 🌸 Cinematic Intro Control with Zoom-in Main Content ----------------------
window.addEventListener('load', () => {
  const intro = safeQuery('#intro');
  const mainContent = safeQuery('#main-content');
  const gradient = safeQuery('.gradient-bg');
  const logo = safeQuery('.intro-logo');

  // If mainContent missing, nothing to show
  if (!mainContent) return;

  // Determine animation duration in ms — fallback to 4000ms
  let animationDuration = 4000;
  if (logo) {
    try {
      const cs = getComputedStyle(logo);
      const dur = cs.animationDuration || cs.webkitAnimationDuration || '';
      // dur could be "4s" or "4000ms" or multiple durations — take first numeric part
      if (dur) {
        const first = dur.split(',')[0].trim();
        if (first.endsWith('ms')) animationDuration = parseFloat(first);
        else if (first.endsWith('s')) animationDuration = parseFloat(first) * 1000;
      }
    } catch (e) {
      // keep fallback
    }
  }

  // Wait for the animation duration (logo animation)
  setTimeout(() => {
    // Fade out intro (logo + gradient) together
    if (intro) {
      intro.style.transition = 'opacity 1s ease';
      intro.style.opacity = '0';
    }
    if (gradient) {
      gradient.style.transition = 'opacity 1s ease';
      gradient.style.opacity = '0';
    }

    // After fade out, hide intro and show main content with zoom-in
    setTimeout(() => {
      if (intro) intro.style.display = 'none';
      mainContent.style.display = 'block';

      // initial state for zoom-in
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'scale(0.95)';
      mainContent.style.transition = 'opacity 1.5s ease, transform 1.5s ease';

      requestAnimationFrame(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'scale(1)';
      });
    }, 1000);
  }, animationDuration);
});
