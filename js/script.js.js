// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Fade-in animation for products
const products = document.querySelectorAll(".product");
window.addEventListener("scroll", () => {
  products.forEach(p => {
    const position = p.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      p.style.opacity = "1";
      p.style.transform = "translateY(0)";
    }
  });
});
products.forEach(p => {
  p.style.opacity = "0";
  p.style.transform = "translateY(20px)";
  p.style.transition = "all 0.6s ease-out";
});

// ✨ Sparkles following mouse
document.addEventListener("mousemove", (e) => {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";
  sparkle.style.left = `${e.pageX}px`;
  sparkle.style.top = `${e.pageY}px`;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1000);
});

// 🌙 Auto Dark Mode based on time
const hour = new Date().getHours();
if (hour >= 18 || hour < 6) {
  document.body.classList.add("dark-mode");
}

// 💫 Logo bounce and glow
const logo = document.querySelector(".logo");
logo.addEventListener("mouseenter", () => {
  logo.style.textShadow = "0 0 15px #b21f66, 0 0 30px #ff7eb9";
  logo.style.transform = "scale(1.1)";
});
logo.addEventListener("mouseleave", () => {
  logo.style.textShadow = "none";
  logo.style.transform = "scale(1)";
});

// 🎉 Confetti burst on Shop Now
document.querySelector(".btn").addEventListener("click", (e) => {
  e.preventDefault();
  const confettiCount = 50;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `${Math.random() * 100}vh`;
    confetti.style.width = "8px";
    confetti.style.height = "8px";
    confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    confetti.style.opacity = "0.8";
    confetti.style.transition = "transform 2s ease-out, opacity 2s ease-out";
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = `translateY(100vh) rotate(${Math.random() * 360}deg)`;
      confetti.style.opacity = "0";
    }, 50);

    setTimeout(() => confetti.remove(), 2000);
  }

  // Scroll to products after effect
  setTimeout(() => {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  }, 1200);
});