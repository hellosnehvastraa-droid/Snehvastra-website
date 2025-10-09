// Cart & Wishlist simulation and UI management

let cart = [];
let wishlist = [];

document.addEventListener('DOMContentLoaded', () => {
  // Animate page fade-in
  document.body.classList.add('fade-in');

  // Add to cart buttons on collection and product page
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product || btn.closest('.product-card').querySelector('h2').innerText;
      const sizeSelect = document.getElementById('size-select') || null;
      const purposeSelect = document.getElementById('purpose-select') || null;
      let size = "N/A", purpose = "N/A";
      if (sizeSelect) size = sizeSelect.value;
      if (purposeSelect) purpose = purposeSelect.value;
      cart.push({ product, size, purpose });
      updateCartUI();
      showToast(`Added ${product} (${size}) to cart`);
    });
  });

  // Click product image to view details (navigate to product.html with product param)
  document.querySelectorAll('.product-card img').forEach(img => {
    img.addEventListener('click', () => {
      const productName = img.alt || img.closest('.product-card').querySelector('h2').innerText;
      // You may implement query parameter passing or product modal here
      // For prototype, will alert or could redirect to product.html with param
      window.location.href = 'product.html'; // Could append ?product=productName for real site
    });
  });

  // Wishlist add from view product buttons
  document.querySelectorAll('.view-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product || btn.closest('.product-card').querySelector('h2').innerText;
      if (!wishlist.includes(product)) {
        wishlist.push(product);
        updateWishlistUI();
        showToast(`Added ${product} to wishlist`);
      }
    });
  });

  function updateCartUI() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <h2>${item.product}</h2>
        <p>Size: ${item.size}</p>
        <p>Purpose: ${item.purpose}</p>
        <button class="remove-item">Remove</button>
      `;
      cartContainer.appendChild(div);
      div.querySelector('.remove-item').addEventListener('click', () => {
        cart.splice(index, 1);
        updateCartUI();
      });
    });
  }

  function updateWishlistUI() {
    const wishlistContainer = document.querySelector('.wishlist-container');
    if (!wishlistContainer) return;
    wishlistContainer.innerHTML = '';
    wishlist.forEach((product, index) => {
      const div = document.createElement('div');
      div.className = 'wishlist-item';
      div.innerHTML = `
        <h2>${product}</h2>
        <button class="remove-item">Remove</button>
      `;
      wishlistContainer.appendChild(div);
      div.querySelector('.remove-item').addEventListener('click', () => {
        wishlist.splice(index, 1);
        updateWishlistUI();
      });
    });
  }

  // Load Latest Drops dynamically for homepage
  const products = [
    { img: "images/rev1.jpg", name: "Drop 1", status: "On Sale" },
    { img: "images/rev2.jpg", name: "Drop 2", status: "Sold Out" },
    { img: "images/rev3.jpg", name: "Drop 3", status: "On Sale" },
    { img: "images/grain.png", name: "Drop 4", status: "On Sale" },
    { img: "images/placeholder.png", name: "Drop 5", status: "On Sale" },
    { img: "images/placeholder.png", name: "Drop 6", status: "Sold Out" },
    { img: "images/placeholder.png", name: "Drop 7", status: "On Sale" },
    { img: "images/placeholder.png", name: "Drop 8", status: "Sold Out" }
  ];
  const dropsContainer = document.getElementById('dropsContainer');
  if (dropsContainer) {
    dropsContainer.innerHTML = products.map(p =>
      `<div class="product-card">
        <img src="${p.img}" alt="${p.name}" />
        <h2>${p.name}</h2>
        <p class="price">${p.status}</p>
        <button class="add-to-cart" data-product="${p.name}">Add to Cart</button>
        <button class="view-product" data-product="${p.name}">View Details</button>
      </div>`
    ).join("");
  }

  // Load Pre-booking products dynamically
  const preBookingProducts = [
    { img: "images/myproduct1.jpg", name: "Upcoming Drop A", available: "Pre-book in 2 days" },
    { img: "images/myproduct2.jpg", name: "Upcoming Drop B", available: "Pre-book in 5 days" }
  ];
  const preBookingContainer = document.getElementById('preBookingContainer');
  if (preBookingContainer) {
    preBookingContainer.innerHTML = preBookingProducts.map(p =>
      `<div class="product-card">
         <img src="${p.img}" alt="${p.name}" />
         <h2>${p.name}</h2>
         <p class="price">${p.available}</p>
         <button class="add-to-cart" data-product="${p.name}">Add to Cart</button>
         <button class="view-product" data-product="${p.name}">View Details</button>
       </div>`
    ).join("");
  }

  // Utility: toast notification for user feedback
  const dropsAlert = document.getElementById('dropsAlert');
  let alertTimeout;
  function showToast(message) {
    if (!dropsAlert) return;
    dropsAlert.innerText = message;
    dropsAlert.style.display = 'block';
    dropsAlert.classList.remove('hide');
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      dropsAlert.classList.add('hide');
      setTimeout(() => {
        dropsAlert.style.display = 'none';
      }, 500);
    }, 4000);
  }

  // Product reviews videos load for product.html
  const videoContainer = document.getElementById('videoContainer');
  const videos = ["video1.mp4", "video2.mp4"];
  if (videoContainer) {
    videos.forEach(video => {
      const vid = document.createElement('video');
      vid.src = `videos/${video}`;
      vid.controls = true;
      vid.autoplay = true;
      vid.muted = true;
      vid.loop = true;
      vid.width = 400;
      vid.height = 225;
      vid.style.borderRadius = "10px";
      vid.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
      videoContainer.appendChild(vid);
    });
  }

  // Login form validation
  const loginForm = document.getElementById('login-form');
  if(loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      if(!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if(password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
      }
      alert('Login successful (simulation)');
      loginForm.reset();
    });
  }

  // Register form validation
  const registerForm = document.getElementById('register-form');
  if(registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = registerForm.name.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();
      if(name.length === 0) {
        alert('Please enter your name.');
        return;
      }
      if(!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if(password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
      }
      alert('Registration successful (simulation)');
      registerForm.reset();
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  // Pre-booking countdown (for product.html)
  const prebookingTimerEl = document.getElementById('prebooking-timer');
  if(prebookingTimerEl){
    let prebookingTime = 3 * 24 * 60 * 60;
    setInterval(() => {
      const days = Math.floor(prebookingTime / (24*3600));
      const hours = Math.floor((prebookingTime % (24*3600)) / 3600);
      const minutes = Math.floor((prebookingTime % 3600) / 60);
      const seconds = prebookingTime % 60;

      prebookingTimerEl.innerText = `${days}d ${hours.toString().padStart(2,'0')}h ${minutes.toString().padStart(2,'0')}m ${seconds.toString().padStart(2,'0')}s`;

      if(prebookingTime > 0) {
        prebookingTime--;
      }
    }, 1000);
  }

  // Rush counter simulation
  const rushCounterEls = document.querySelectorAll('.rush-counter, #rush-counter');
  let productStock = 20;
  if(rushCounterEls.length > 0){
    setInterval(() => {
      if (productStock > 0) {
        productStock -= Math.floor(Math.random() * 2);  // random 0 or 1 decrease
        if(productStock < 0) productStock = 0;
        rushCounterEls.forEach(el => el.textContent = productStock);
      }
    }, 3000);
  }

  // Mobile Navbar adjustments for login/logout visibility
  function adjustNavbarForMobile() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if(window.innerWidth <= 768) {
      if (loginBtn.style.display === 'none') {
        logoutBtn.style.display = 'block';
      } else {
        logoutBtn.style.display = 'none';
      }
    } else {
      loginBtn.style.display = 'inline';
      logoutBtn.style.display = 'none';
    }
  }
  window.addEventListener('resize', adjustNavbarForMobile);
  window.addEventListener('load', adjustNavbarForMobile);

});
