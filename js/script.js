// Persistent stock for demo with 10 pieces each
const stock = {
  "Drop 1": 10,
  "Drop 2": 10,
  "Drop 3": 10,
  "Drop 4": 10
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Render cart item count
function renderCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

// Render wishlist item count
function renderWishlistCount() {
  const wishCountEl = document.getElementById('wish-count');
  if (wishCountEl) wishCountEl.textContent = wishlist.length;
}

// Render cart contents in cart panel
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.title} (Size: ${item.size}) - ₹${item.price}`;
    cartItems.appendChild(li);
    total += parseInt(item.price);
  });
  const cartTotal = document.getElementById("cart-total");
  if (cartTotal) cartTotal.textContent = `Total: ₹${total}`;
}

// Add item to cart with stock management
function addToCart(product) {
  if (!stock[product.title] || stock[product.title] <= 0) {
    alert("Sorry, this product is out of stock.");
    return;
  }
  stock[product.title]--;
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderCartCount();
  alert(`Added ${product.title} to cart!`);
  // Close product popup if open
  const productPopup = document.getElementById("product-popup");
  if (productPopup) productPopup.style.display = "none";
}

// Toggle wishlist item presence
function toggleWishlistItem(title) {
  const index = wishlist.findIndex(i => i.title === title);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push({ title });
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderWishlistCount();
  renderWishlistButtons();
}

// Update wishlist buttons (heart icons)
function renderWishlistButtons() {
  document.querySelectorAll(".product-card").forEach(card => {
    const title = card.querySelector("h3").textContent;
    const btn = card.querySelector("button.add-to-wishlist");
    if (!btn) return;

    if (wishlist.find(i => i.title === title)) {
      btn.textContent = "❤️";
      btn.setAttribute("aria-pressed", "true");
      btn.title = "Remove from Wishlist";
    } else {
      btn.textContent = "♡";
      btn.setAttribute("aria-pressed", "false");
      btn.title = "Add to Wishlist";
    }
  });
}

// Initialize all interactive UI behaviors
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderCartCount();
  renderWishlistCount();
  renderWishlistButtons();

  // Mobile menu toggle
  document.querySelectorAll(".menu-toggle").forEach(menuToggle => {
    const navUL = menuToggle.closest("nav").querySelector("ul");
    menuToggle.addEventListener("click", () => navUL.classList.toggle("show"));
  });

  // Countdown Timer
  if (document.querySelector(".countdown")) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const countdown = document.querySelector(".countdown");
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        countdown.innerHTML = "EXPIRED";
        clearInterval(interval);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);
      countdown.innerHTML = `<div><span>${days}</span>Days</div>` +
        `<div><span>${hours}</span>Hrs</div>` +
        `<div><span>${minutes}</span>Mins</div>` +
        `<div><span>${seconds}</span>Secs</div>`;
    }, 1000);
  }

  // Carousel Buttons
  document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
    const carousel = wrapper.querySelector(".carousel");
    const prev = wrapper.querySelector(".carousel-btn.prev");
    const next = wrapper.querySelector(".carousel-btn.next");

    if (prev) prev.addEventListener("click", () => carousel.scrollBy({ left: -250, behavior: 'smooth' }));
    if (next) next.addEventListener("click", () => carousel.scrollBy({ left: 250, behavior: 'smooth' }));
  });

  // Product Popup Elements
  const productPopup = document.getElementById("product-popup");
  const popupTitle = document.getElementById("popup-title");
  const popupImg = document.getElementById("popup-img");
  const popupDesc = document.getElementById("popup-desc");
  const sizeSelect = document.getElementById("size-select");
  const popupAddBtn = document.getElementById("popup-add-to-cart");
  const closePopup = document.getElementById("close-popup");

  // Open popup on product click (except on add-to-cart/wishlist buttons)
  document.body.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (card && !e.target.classList.contains("add-to-cart") && !e.target.classList.contains("add-to-wishlist")) {
      const title = card.querySelector("h3").textContent;
      popupTitle.textContent = title;
      popupDesc.textContent = card.querySelector("p").textContent;
      const img = card.querySelector("img") || card.querySelector(".placeholder-img");
      if (img && img.style.backgroundImage) {
        popupImg.src = img.style.backgroundImage.slice(5, -2);
      } else if (img && img.src) {
        popupImg.src = img.src;
      } else {
        popupImg.src = "images/logo.final.png";
      }
      if (stock[title] <= 0) {
        popupAddBtn.disabled = true;
        popupAddBtn.textContent = "Out of Stock";
      } else {
        popupAddBtn.disabled = false;
        popupAddBtn.textContent = "Add to Cart";
      }
      sizeSelect.value = "M";
      productPopup.style.display = "flex";
    }
  });

  // Close the product popup
  if (closePopup) closePopup.addEventListener("click", () => {
    productPopup.style.display = "none";
  });

  // Add to cart from popup
  if (popupAddBtn) popupAddBtn.addEventListener("click", () => {
    const product = {
      title: popupTitle.textContent,
      price: (popupDesc.textContent.match(/\d+/) || [0])[0],
      size: sizeSelect.value
    };
    addToCart(product);
  });

  // Add to cart via cards (event delegation)
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault();
      const card = e.target.closest(".product-card");
      const title = card.querySelector("h3").textContent;
      if (stock[title] <= 0) {
        alert("Sorry, this product is out of stock.");
        return;
      }
      const product = {
        title,
        price: (card.querySelector("p").textContent.match(/\d+/) || [0])[0],
        size: "M"
      };
      addToCart(product);
    }
  });

  // Wishlist toggle on hearts (event delegation)
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-wishlist")) {
      e.preventDefault();
      const card = e.target.closest(".product-card");
      const title = card.querySelector("h3").textContent;
      toggleWishlistItem(title);
    }
  });

  // Cart panel toggle by cart icon/button
  const cartPanel = document.getElementById("cart-panel");
  const cartBtn = document.getElementById("cart");
  if (cartBtn) {
    cartBtn.addEventListener("click", e => {
      e.preventDefault();
      if (cartPanel.style.right === "0px") {
        cartPanel.style.right = "-400px";
      } else {
        renderCart();
        cartPanel.style.right = "0";
      }
    });
  }

  // Close cart panel button
  const closeCartBtn = document.getElementById("close-cart");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartPanel.style.right = "-400px";
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener("scroll", () => {
      backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
  }

  // User Login / Logout UI update
  const loginLinks = document.querySelectorAll('#login-link');
  function updateUserUI() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    loginLinks.forEach(link => {
      if (user) {
        link.textContent = "Logout";
        link.href = "#";
        link.onclick = e => {
          e.preventDefault();
          localStorage.removeItem("loggedInUser");
          alert("Logged out.");
          updateUserUI();
          window.location.href = "index.html";
        };
      } else {
        link.textContent = "Login";
        link.href = "user-login.html";
        link.onclick = null;
      }
    });
  }
  updateUserUI();

  // Optional: Simple form validations can be added here similar to prior suggestions
});
