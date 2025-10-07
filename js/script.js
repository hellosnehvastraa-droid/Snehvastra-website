/* ===== Snehvastra common JS (robust + defensive) =====
   Handles:
   - localStorage cart & wishlist
   - menu toggle (mobile)
   - countdown timer
   - carousel arrows
   - product popup (safe handling of missing elements)
   - add to cart & wishlist (with stock checks)
   - cart panel open/close
   - back-to-top
   - intro hide logic (centralized)
*/

(() => {
  // --- Configuration (editable) ---
  const stockLimits = {
    "Drop 1": 10,
    "Drop 2": 50,
    "Drop 3": 100,
    "Drop 4": 200
  };
  const stockCount = { ...stockLimits };

  // --- Safe selectors helpers ---
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from((ctx || document).querySelectorAll(sel));

  // --- State ---
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  // --- Render helpers ---
  function renderCartCount() {
    const el = $("#cart-count");
    if (el) el.textContent = cart.length;
  }
  function renderWishlistCount() {
    const el = $("#wish-count");
    if (el) el.textContent = wishlist.length;
  }
  function renderCart() {
    const cartItems = $("#cart-items");
    if (!cartItems) return;
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.title} (Size: ${item.size || 'M'}) - ₹${item.price}`;
      cartItems.appendChild(li);
      total += Number(item.price || 0);
    });
    const cartTotal = $("#cart-total");
    if (cartTotal) cartTotal.textContent = `Total: ₹${total}`;
  }

  function saveState() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  // --- Wishlist UI update on product cards ---
  function renderWishlistButtons() {
    $$(".product-card").forEach(card => {
      const titleEl = card.querySelector("h3");
      if (!titleEl) return;
      const title = titleEl.textContent.trim();
      const btn = card.querySelector(".add-to-wishlist");
      if (!btn) return;
      const pressed = wishlist.some(i => i.title === title);
      btn.textContent = pressed ? "❤️" : "♡";
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
      btn.title = pressed ? "Remove from Wishlist" : "Add to Wishlist";
    });
  }

  // --- Add to cart (with stock validation) ---
  function addToCart(product, quantity = 1) {
    const available = stockCount[product.title] || 0;
    if (available < quantity) {
      alert(`Sorry, only ${available} pieces left in stock for ${product.title}.`);
      return;
    }
    stockCount[product.title] = available - quantity;
    for (let i=0;i<quantity;i++) cart.push(product);
    saveState();
    renderCart();
    renderCartCount();
    alert(`Added ${quantity} x ${product.title} to cart!`);
    // close popup if open
    const popup = $("#product-popup");
    if (popup) popup.style.display = "none";
  }

  // --- Toggle wishlist item ---
  function toggleWishlistItem(title) {
    const idx = wishlist.findIndex(i => i.title === title);
    if (idx > -1) wishlist.splice(idx,1);
    else wishlist.push({ title });
    saveState();
    renderWishlistCount();
    renderWishlistButtons();
  }

  // --- Utilities for image url extraction from background-image or img src ---
  function extractUrlFromBackgroundImage(styleVal) {
    // styleVal e.g. url("images/myproduct1.jpg")
    if (!styleVal) return null;
    const match = styleVal.match(/url\((['"]?)(.*?)\1\)/);
    return match ? match[2] : null;
  }

  // --- Initialization once DOM ready ---
  document.addEventListener("DOMContentLoaded", () => {
    // 1) Intro cinematic: keep for all pages; hide after 2.2s (matches CSS intro animation)
    const intro = $("#intro");
    const mainContent = $("#main-content");
    const introDelay = 2200;
    if (intro && mainContent) {
      // ensure intro visible, then hide after delay
      setTimeout(() => {
        intro.style.pointerEvents = "none";
        intro.style.transition = "opacity .4s ease";
        intro.style.opacity = "0";
        // remove from flow after fade
        setTimeout(() => {
          intro.style.display = "none";
          mainContent.style.display = "block";
        }, 420);
      }, introDelay);
    } else if (mainContent) {
      mainContent.style.display = "block";
    }

    // 2) Render counts & UI
    renderCart();
    renderCartCount();
    renderWishlistCount();
    renderWishlistButtons();

    // 3) Mobile menu toggle: toggle class on UL and update aria-expanded
    $$(".menu-toggle").forEach(toggle => {
      const nav = toggle.closest("nav");
      if (!nav) return;
      const ul = nav.querySelector(".nav-links");
      toggle.addEventListener("click", () => {
        if (!ul) return;
        const willShow = !ul.classList.contains("show");
        ul.classList.toggle("show", willShow);
        toggle.setAttribute("aria-expanded", willShow ? "true" : "false");
      });
    });

    // 4) Countdown (simple 3-day rolling target as original)
    const countdownEl = $(".countdown");
    if (countdownEl) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3);
      const interval = setInterval(() => {
        const now = Date.now();
        const distance = targetDate - now;
        if (distance <= 0) {
          countdownEl.innerHTML = "EXPIRED";
          clearInterval(interval);
          return;
        }
        const days = Math.floor(distance / (1000*60*60*24));
        const hours = Math.floor((distance / (1000*60*60)) % 24);
        const minutes = Math.floor((distance / (1000*60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        countdownEl.innerHTML = `<div><span>${days}</span>Days</div>` +
          `<div><span>${hours}</span>Hrs</div>` +
          `<div><span>${minutes}</span>Mins</div>` +
          `<div><span>${seconds}</span>Secs</div>`;
      }, 1000);
    }

    // 5) Carousel buttons
    $$(".carousel-wrapper").forEach(wrapper => {
      const carousel = wrapper.querySelector(".carousel");
      const prev = wrapper.querySelector(".carousel-btn.prev");
      const next = wrapper.querySelector(".carousel-btn.next");
      if (prev && carousel) prev.addEventListener("click", () => carousel.scrollBy({ left: -260, behavior: 'smooth' }));
      if (next && carousel) next.addEventListener("click", () => carousel.scrollBy({ left: 260, behavior: 'smooth' }));
    });

    // 6) Product popup logic (open when clicking a product-card but not when clicking buttons inside)
    const productPopup = $("#product-popup");
    const popupTitle = $("#popup-title");
    const popupImg = $("#popup-img");
    const popupDesc = $("#popup-desc");
    const sizeSelect = $("#size-select");
    const quantitySelect = $("#quantity-select");
    const popupAddBtn = $("#popup-add-to-cart");
    const closePopupBtn = $("#close-popup");

    document.body.addEventListener("click", (e) => {
      // open popup when clicking product card (but not clicking add-to-cart / wishlist inside)
      const card = e.target.closest(".product-card");
      if (card && !e.target.closest(".add-to-cart") && !e.target.closest(".add-to-wishlist") && !card.closest("#product-popup")) {
        if (!productPopup) return;
        const titleEl = card.querySelector("h3");
        const descEl = card.querySelector("p");
        popupTitle && (popupTitle.textContent = titleEl ? titleEl.textContent.trim() : "Product");
        popupDesc && (popupDesc.textContent = descEl ? descEl.textContent.trim() : "");
        // image: prefer img tag, fallback to backgroundImage
        const imgEl = card.querySelector("img");
        const bgEl = card.querySelector(".placeholder-img");
        let url = null;
        if (imgEl && imgEl.src) url = imgEl.src;
        else if (bgEl) url = extractUrlFromBackgroundImage(bgEl.style.backgroundImage) || bgEl.getAttribute("data-src") || null;
        if (popupImg) popupImg.src = url || "images/logo.final.png";
        // populate quantity based on stock
        if (quantitySelect) {
          quantitySelect.innerHTML = "";
          const t = popupTitle ? popupTitle.textContent.trim() : "";
          const max = Math.min(stockCount[t] || 0, 10);
          if (max === 0) {
            if (popupAddBtn) { popupAddBtn.disabled = true; popupAddBtn.textContent = "Out of Stock"; }
            quantitySelect.style.display = "none";
          } else {
            for (let i=1;i<=max;i++){
              const opt = document.createElement("option"); opt.value = i; opt.textContent = i; quantitySelect.appendChild(opt);
            }
            quantitySelect.style.display = "inline-block";
            if (popupAddBtn) { popupAddBtn.disabled = false; popupAddBtn.textContent = "Add to Cart"; }
          }
        }
        if (sizeSelect) sizeSelect.value = sizeSelect.querySelector("option") ? sizeSelect.querySelector("option").value : "M";
        productPopup.style.display = "flex";
        // focus for accessibility
        productPopup.setAttribute("tabindex","-1");
        productPopup.focus();
      }
    });

    if (closePopupBtn) closePopupBtn.addEventListener("click", () => { if (productPopup) productPopup.style.display = "none"; });

    // close popup on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (productPopup && productPopup.style.display === "flex") productPopup.style.display = "none";
        const cartPanel = $("#cart-panel");
        if (cartPanel && cartPanel.style.right === "0px") cartPanel.style.right = "-420px";
      }
    });

    // popup add to cart
    if (popupAddBtn) {
      popupAddBtn.addEventListener("click", () => {
        const title = popupTitle ? popupTitle.textContent.trim() : "Product";
        const priceMatch = (popupDesc && popupDesc.textContent.match(/\d+/)) || ["0"];
        const price = priceMatch[0];
        const size = sizeSelect ? sizeSelect.value : "M";
        const qty = quantitySelect ? Number(quantitySelect.value) : 1;
        addToCart({ title, price, size }, qty);
      });
    }

    // 7) Add to cart buttons on product cards
    document.body.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart")) {
        e.preventDefault();
        const card = e.target.closest(".product-card");
        if (!card) return;
        const title = (card.querySelector("h3") && card.querySelector("h3").textContent.trim()) || "Product";
        if ((stockCount[title] || 0) <= 0) { alert("Sorry, this product is out of stock."); return; }
        const price = (card.querySelector("p") && (card.querySelector("p").textContent.match(/\d+/) || ["0"])[0]) || "0";
        addToCart({ title, price, size: "M" }, 1);
      }
    });

    // 8) Wishlist button handling
    document.body.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-wishlist")) {
        e.preventDefault();
        const card = e.target.closest(".product-card");
        if (!card) return;
        const title = (card.querySelector("h3") && card.querySelector("h3").textContent.trim()) || "Product";
        toggleWishlistItem(title);
      }
    });

    // 9) Cart panel open/close
    const cartPanel = $("#cart-panel");
    const cartBtn = $("#cart");
    const closeCartBtn = $("#close-cart");
    if (cartBtn && cartPanel) {
      cartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (cartPanel.style.right === "0px") cartPanel.style.right = "-420px";
        else { renderCart(); cartPanel.style.right = "0"; }
      });
    }
    if (closeCartBtn && cartPanel) closeCartBtn.addEventListener("click", () => cartPanel.style.right = "-420px");

    // 10) Back to top
    const backToTop = $("#back-to-top");
    if (backToTop) {
      backToTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:'smooth' }));
      window.addEventListener("scroll", () => { backToTop.style.display = window.scrollY > 300 ? "block" : "none"; });
    }

    // 11) Simple login UI update (mock)
    function updateUserUI() {
      const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
      $$("#login-link").forEach(link => {
        if (user) {
          link.textContent = "Logout";
          link.href = "#";
          link.onclick = (e) => { e.preventDefault(); localStorage.removeItem("loggedInUser"); alert("Logged out."); updateUserUI(); window.location.href = "index.html"; };
        } else {
          link.textContent = "Login";
          link.href = "user-login.html";
          link.onclick = null;
        }
      });
    }
    updateUserUI();

    // 12) Basic forms: login/register & contact handlers (local only)
    const loginForm = $("#login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = (document.getElementById("login-email") || {}).value || "";
        if (!email) return alert("Enter email");
        // mock login: store minimal info
        localStorage.setItem("loggedInUser", JSON.stringify({ email }));
        alert("Logged in (mock)");
        updateUserUI();
        window.location.href = "index.html";
      });
    }
    const registerForm = $("#register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = (document.getElementById("register-email") || {}).value || "";
        const pw = (document.getElementById("register-password") || {}).value || "";
        const pw2 = (document.getElementById("register-password-confirm") || {}).value || "";
        if (!email || !pw) return alert("Enter email and password");
        if (pw !== pw2) return alert("Passwords do not match");
        // mock register: store
        localStorage.setItem("registeredUser", JSON.stringify({ email }));
        alert("Registered (mock). You can now login.");
        window.location.href = "user-login.html";
      });
    }
    const contactForm = $("#contact-page-form") || document.querySelector("#main-content form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thanks — message submitted (mock). We'll get back to you at the email provided.");
        contactForm.reset();
      });
    }

    // 13) Render wishlist page content (if wishlist page present)
    const wishlistPageList = $("#wishlist-items");
    if (wishlistPageList) {
      const items = wishlist || [];
      const emptyMsg = $("#empty-msg");
      if (items.length === 0) {
        if (emptyMsg) emptyMsg.style.display = "block";
        wishlistPageList.innerHTML = "";
      } else {
        if (emptyMsg) emptyMsg.style.display = "none";
        wishlistPageList.innerHTML = "";
        items.forEach(it => {
          const li = document.createElement("li");
          li.textContent = it.title;
          wishlistPageList.appendChild(li);
        });
      }
    }

    // ensure wishlist ui matches initial state
    renderWishlistButtons();
  }); // DOMContentLoaded end
})();
