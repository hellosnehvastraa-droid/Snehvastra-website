/* -------------------- Intro & Gradient -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const mainContent = document.getElementById("main-content");

  setTimeout(() => {
    intro.style.display = "none";
    mainContent.style.display = "block";
  }, 2500); // Matches logo animation duration
});

/* -------------------- Menu Toggle -------------------- */
const menuToggle = document.querySelector(".menu-toggle");
const navUL = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  navUL.classList.toggle("show");
});

/* -------------------- Countdown -------------------- */
function countdownTimer(endDate, selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  function update() {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance < 0) {
      container.innerHTML = "EXPIRED";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    container.innerHTML = `
      <div><span>${days}</span>Days</div>
      <div><span>${hours}</span>Hrs</div>
      <div><span>${minutes}</span>Mins</div>
      <div><span>${seconds}</span>Secs</div>
    `;
  }

  update();
  const interval = setInterval(update, 1000);
}

// Example: countdown to 3 days from now
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 3);
countdownTimer(targetDate, ".countdown");

/* -------------------- Carousel -------------------- */
const carousels = document.querySelectorAll(".carousel-wrapper");
carousels.forEach(wrapper => {
  const carousel = wrapper.querySelector(".carousel");
  const prev = wrapper.querySelector(".carousel-prev");
  const next = wrapper.querySelector(".carousel-next");

  next.addEventListener("click", () => { carousel.scrollBy({ left: 250, behavior: 'smooth' }); });
  prev.addEventListener("click", () => { carousel.scrollBy({ left: -250, behavior: 'smooth' }); });
});

/* -------------------- Product Popup -------------------- */
const productPopup = document.getElementById("product-popup");
const closePopup = document.getElementById("close-popup");
const popupTitle = document.getElementById("popup-title");
const popupImg = document.getElementById("popup-img");
const popupDesc = document.getElementById("popup-desc");
const sizeSelect = document.getElementById("size-select");

document.querySelectorAll(".product-card button.add-to-cart").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    popupTitle.textContent = card.querySelector("h3").textContent;
    popupImg.src = card.querySelector("img").src;
    popupDesc.textContent = card.querySelector("p").textContent;
    sizeSelect.value = "M"; // default size
    productPopup.style.display = "flex";

    // Add to Cart prompt inside popup
    document.getElementById("popup-add-to-cart").onclick = () => {
      const purpose = prompt("Tell us the purpose of buying this article — we’ll make it just for you!");
      if (purpose) addToCart({
        title: popupTitle.textContent,
        price: card.querySelector(".price") ? card.querySelector(".price").textContent : "0",
        size: sizeSelect.value
      });
      productPopup.style.display = "none";
    }
  });
});

closePopup.addEventListener("click", () => productPopup.style.display = "none");

/* -------------------- Cart -------------------- */
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const closeCart = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const cartToggleBtns = document.querySelectorAll(".cart-toggle");

let cart = [];

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.title} (Size: ${item.size}) - ₹${item.price}`;
    cartItems.appendChild(li);
    total += parseFloat(item.price);
  });
  document.getElementById("cart-total").textContent = `Total: ₹${total.toFixed(2)}`;
}

function addToCart(item) {
  cart.push(item);
  updateCart();
  cartPanel.style.right = "0";
}

cartToggleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    cartPanel.style.right = "0";
  });
});

closeCart.addEventListener("click", () => { cartPanel.style.right = "-400px"; });
checkoutBtn.addEventListener("click", () => alert("Checkout functionality coming soon!"));


/* -------------------- Music Toggle -------------------- */
const musicBtn = document.getElementById("music-toggle");
const music = document.getElementById("background-music");

if (musicBtn && music) {
  musicBtn.addEventListener("click", () => {
    if (music.paused) music.play();
    else music.pause();
  });
}

/* -------------------- Back to Top -------------------- */
const backToTop = document.getElementById("back-to-top");
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* -------------------- Dynamic Gradient (optional) -------------------- */
const logo = document.querySelector(".intro-logo");
const gradientBg = document.querySelector(".gradient-bg");

if (logo && gradientBg) {
  const img = new Image();
  img.src = logo.src;
  img.onload = () => {
    // You can implement dynamic color extraction if needed
    // For now fallback to main.css gradient
  };
}
