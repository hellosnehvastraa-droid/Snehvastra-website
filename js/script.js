// Smooth scroll effect
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

// Initial hidden state
products.forEach(p => {
  p.style.opacity = "0";
  p.style.transform = "translateY(20px)";
  p.style.transition = "all 0.6s ease-out";
});
