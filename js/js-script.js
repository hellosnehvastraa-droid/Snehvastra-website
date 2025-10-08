// Cart & Wishlist simulation and UI management

let cart = [];
let wishlist = [];

document.addEventListener('DOMContentLoaded', () => {
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product;
      const sizeSelect = document.getElementById('size-select') || document.getElementById('size');
      const purposeSelect = document.getElementById('purpose-select') || document.getElementById('purpose');
      if (!sizeSelect || !purposeSelect) return;
      const size = sizeSelect.value;
      const purpose = purposeSelect.value;
      cart.push({ product, size, purpose });
      updateCartUI();
    });
  });

  // View product buttons add to wishlist
  document.querySelectorAll('.view-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product;
      if (!wishlist.includes(product)) {
        wishlist.push(product);
        updateWishlistUI();
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

  // Front-end counter for rush simulation
  let productStock = 20;
  setInterval(() => {
    if (productStock > 0) {
      productStock -= Math.floor(Math.random() * 2);  // random: 0 or 1 decrement
      if(productStock < 0) productStock = 0;
      document.querySelectorAll('.rush-counter, #rush-counter').forEach(el => el.textContent = productStock);
    }
  }, 3000);

  // Load Latest Drops on homepage dynamically
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
        <img src="${p.img}" alt="${p.name}">
        <h2>${p.name}</h2>
        <p class="price">${p.status}</p>
        <button class="view-product" data-product="${p.name}">View Details</button>
      </div>`
    ).join("");
  }

  // Load Pre-booking Products
  const preBookingProducts = [
    { img: "images/myproduct1.jpg", name: "Upcoming Drop A", available: "Pre-book in 2 days" },
    { img: "images/myproduct2.jpg", name: "Upcoming Drop B", available: "Pre-book in 5 days" }
  ];
  const preBookingContainer = document.getElementById('preBookingContainer');
  if (preBookingContainer) {
    preBookingContainer.innerHTML = preBookingProducts.map(p =>
      `<div class="product-card">
         <img src="${p.img}" alt="${p.name}">
         <h2>${p.name}</h2>
         <p class="price">${p.available}</p>
         <button class="view-product" data-product="${p.name}">Pre-Book</button>
       </div>`
    ).join("");
  }
});

// Utility email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
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
