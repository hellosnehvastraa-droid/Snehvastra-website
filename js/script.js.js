/* -------------------- Intro Animation -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const mainContent = document.getElementById("main-content");

  setTimeout(() => {
    intro.classList.add("hide-intro");
    setTimeout(() => {
      intro.style.display = "none";
      if (mainContent) mainContent.style.display = "block";
    }, 500);
  }, 2500);

  updateUserUI();
  renderWishlistCount();
  renderCartCount();
});

/* -------------------- Menu Toggle -------------------- */
const menuToggles = document.querySelectorAll(".menu-toggle");
menuToggles.forEach(menuToggle => {
  const navUL = menuToggle.closest("nav").querySelector("ul");
  menuToggle.addEventListener("click", () => navUL.classList.toggle("show"));
});

/* -------------------- Countdown Timer -------------------- */
function countdownTimer(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3); // 3 days timer

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) {
      container.innerHTML = "EXPIRED";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    container.innerHTML = `<div><span>${days}</span>Days</div>
      <div><span>${hours}</span>Hrs</div>
      <div><span>${minutes}</span>Mins</div>
      <div><span>${seconds}</span>Secs</div>`;
  }

  update();
  const interval = setInterval(update, 1000);
}
countdownTimer(".countdown");

/* -------------------- Carousel -------------------- */
document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
  const carousel = wrapper.querySelector(".carousel");
  const prev = wrapper.querySelector(".carousel-btn.prev");
  const next = wrapper.querySelector(".carousel-btn.next");

  if (prev) prev.addEventListener("click", () => carousel.scrollBy({ left: -250, behavior: 'smooth' }));
  if (next) next.addEventListener("click", () => carousel.scrollBy({ left: 250, behavior: 'smooth' }));
});

/* -------------------- Product Popup -------------------- */
const productPopup = document.getElementById("product-popup");
const closePopup = document.getElementById("close-popup");
const popupTitle = document.getElementById("popup-title");
const popupImg = document.getElementById("popup-img");
const popupDesc = document.getElementById("popup-desc");
const sizeSelect = document.getElementById("size-select");
const popupAddBtn = document.getElementById("popup-add-to-cart");

document.querySelectorAll(".product-card button.add-to-cart").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    popupTitle.textContent = card.querySelector("h3").textContent;

    const img = card.querySelector("img") || card.querySelector(".placeholder-img");
    if (img && img.style.backgroundImage) {
      popupImg.src = img.style.backgroundImage.slice(5, -2);
    } else if (img && img.src) {
      popupImg.src = img.src;
    } else {
      popupImg.src = "images/logo.final.png";
    }

    popupDesc.textContent = card.querySelector("p").textContent;
    sizeSelect.value = "M";
    productPopup.style.display = "flex";

    popupAddBtn.onclick = () => {
      const purpose = prompt("Tell us the purpose of buying this article — we’ll make it just for you!");
      if (purpose) addToCart({
        title: popupTitle.textContent,
        price: (card.querySelector("p").textContent.match(/\d+/) || [0])[0],
        size: sizeSelect.value
      });
      productPopup.style.display = "none";
    };
  });
});

if (closePopup) closePopup.addEventListener("click", () => productPopup.style.display = "none");

/* -------------------- Cart -------------------- */
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const closeCart = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const cartToggleBtns = document.querySelectorAll("#cart, .cart-toggle");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  if (cartPanel) cartPanel.style.right = "0";
  renderCartCount();
}

function renderCart() {
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.title} (Size:${p.size}) - ₹${p.price}`;
    cartItems.appendChild(li);
    total += parseInt(p.price);
  });
  if (document.getElementById("cart-total"))
    document.getElementById("cart-total").textContent = `Total: ₹${total}`;
}

cartToggleBtns.forEach(btn => btn.addEventListener("click", () => {
  if (cartPanel) cartPanel.style.right = "0";
}));

if (closeCart) closeCart.addEventListener("click", () => {
  if (cartPanel) cartPanel.style.right = "-400px";
});
if (checkoutBtn) checkoutBtn.addEventListener("click", () => alert("Checkout functionality coming soon!"));

renderCart();

/* -------------------- Wishlist -------------------- */
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function renderWishlistCount() {
  const wishCountSpans = document.querySelectorAll("#wish-count, #wish-count-3, #wish-count-4");
  wishCountSpans.forEach(span => {
    span.textContent = wishlist.length;
  });
}

function toggleWishlistItem(title) {
  const index = wishlist.findIndex(item => item.title === title);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push({ title });
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderWishlistCount();
  renderWishlistButtons();
}

function renderWishlistButtons() {
  document.querySelectorAll(".product-card").forEach(card => {
    const title = card.querySelector("h3").textContent;
    const btn = card.querySelector("button.add-to-wishlist");
    if (!btn) return;

    if (wishlist.find(item => item.title === title)) {
      btn.textContent = "❤️";
      btn.setAttribute("aria-pressed", "true");
      btn.title = "Remove from Wishlist";
    } else {
      btn.textContent = "♡";
      btn.setAttribute("aria-pressed", "false");
      btn.title = "Add to Wishlist";
    }

    btn.onclick = () => toggleWishlistItem(title);
  });
}

// Attach wishlist buttons listeners on load
document.addEventListener("DOMContentLoaded", () => {
  renderWishlistCount();
  renderWishlistButtons();
});

/* -------------------- User Login State -------------------- */
function updateUserUI() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginLinks = document.querySelectorAll('a[href="user-login.html"]');
  const wishlistLink = document.getElementById("wishlist");
  const cartLink = document.getElementById("cart");

  if (loggedInUser) {
    loginLinks.forEach(link => {
      link.textContent = "Logout";
      link.href = "#";
      link.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully");
        updateUserUI();
        window.location.href = "index.html";
      };
    });
    if (wishlistLink) wishlistLink.style.display = "inline-block";
    if (cartLink) cartLink.style.display = "inline-block";
  } else {
    loginLinks.forEach(link => {
      link.textContent = "Login";
      link.href = "user-login.html";
      link.onclick = null;
    });
    if (wishlistLink) wishlistLink.style.display = "none";
    if (cartLink) cartLink.style.display = "none";
  }
}

updateUserUI();

/* -------------------- Back to Top -------------------- */
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener("scroll", () => {
    backToTop.style.display = (window.scrollY > 300 ? "block" : "none");
  });
}