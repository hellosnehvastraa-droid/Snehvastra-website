document.addEventListener('DOMContentLoaded', () => {
  // Splash screen logic
  window.addEventListener('load', () => {
    setTimeout(() => {
      const splash = document.getElementById('splash');
      if (splash) splash.style.display = 'none';
      const mainContent = document.getElementById('mainContent');
      if (mainContent) mainContent.style.opacity = '1';
    }, 2500);
  });

  // Toast alert modal elements
  const modal = createModal();
  document.body.appendChild(modal.container);

  function createModal() {
    const container = document.createElement('div');
    container.classList.add('modal');
    container.setAttribute('role', 'dialog');
    container.setAttribute('aria-modal', 'true');
    container.setAttribute('aria-live', 'assertive');
    container.setAttribute('tabindex', '-1');

    const content = document.createElement('div');
    content.classList.add('modal-content');
    container.appendChild(content);

    const messagePara = document.createElement('p');
    content.appendChild(messagePara);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => hideModal());
    content.appendChild(closeBtn);

    // Handle Escape key for closing modal
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        hideModal();
      }
    });

    function showModal(message) {
      messagePara.textContent = message;
      container.classList.add('show');
      container.focus();
    }

    function hideModal() {
      container.classList.remove('show');
    }

    return { container, showModal, hideModal };
  }

  function showAlert(message) {
    modal.showModal(message);
  }

  // Cart and wishlist arrays
  const cart = [];
  const wishlist = [];

  // Index Page product drops setup (from index.html)
  const dropsContainer = document.getElementById('dropsContainer');
  const preBookingContainer = document.getElementById('preBookingContainer');

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

  if (dropsContainer) {
    dropsContainer.innerHTML = products.map(p =>
      `<div class="product-card" tabindex="0">
        <img src="${p.img}" alt="${p.name}" />
        <h2>${p.name}</h2>
        <p class="price">${p.status}</p>
        <button data-action="add-to-cart" data-product="${p.name}">Add to Cart</button>
        <button data-action="view-details" data-product="${p.name}">View Details</button>
      </div>`
    ).join('');
  }

  const preBookingProducts = [
    { img: "images/myproduct1.jpg", name: "Upcoming Drop A", available: "Pre-book in 2 days" },
    { img: "images/myproduct2.jpg", name: "Upcoming Drop B", available: "Pre-book in 5 days" }
  ];

  if (preBookingContainer) {
    preBookingContainer.innerHTML = preBookingProducts.map(p =>
      `<div class="product-card" tabindex="0">
        <img src="${p.img}" alt="${p.name}" />
        <h2>${p.name}</h2>
        <p class="price">${p.available}</p>
        <button data-action="add-to-cart" data-product="${p.name}">Add to Cart</button>
        <button data-action="view-details" data-product="${p.name}">View Details</button>
      </div>`
    ).join('');
  }

  // Event delegation for index page product buttons
  document.body.addEventListener('click', event => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'button') {
      const action = target.getAttribute('data-action');
      const productName = target.getAttribute('data-product');
      if (!action || !productName) return;

      switch(action) {
        case 'add-to-cart':
          addToCart(productName);
          break;
        case 'view-details':
          showAlert(`View details for ${productName} (Demo).`);
          break;
      }
    }
  });

  function addToCart(product) {
    cart.push(product);
    showToast(`${product} added to cart.`);
  }

  // Toast alert element (index page style)
  const dropsAlert = document.getElementById('dropsAlert');
  let alertTimeout;
  function showToast(message) {
    if (!dropsAlert) return;
    dropsAlert.textContent = message;
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

  // Collection page filters and rendering

  const filterCategory = document.querySelectorAll(".filter-category");
  const filterPrice = document.querySelectorAll(".filter-price");
  const filterAvailability = document.querySelectorAll(".filter-availability");
  const sortSelect = document.getElementById("sort-select");
  const productsGrid = document.getElementById("productsGrid");

  const collectionProducts = [
    { id: 1, name: "Drop 1", category: "Streetwear", price: 45, available: "In Stock", popularity: 100, img: "images/rev1.jpg" },
    { id: 2, name: "Drop 2", category: "Luxury", price: 120, available: "Sold Out", popularity: 90, img: "images/rev2.jpg" },
    { id: 3, name: "Drop 3", category: "Casual", price: 75, available: "In Stock", popularity: 110, img: "images/rev3.jpg" },
    { id: 4, name: "Drop 4", category: "Streetwear", price: 60, available: "In Stock", popularity: 95, img: "images/grain.png" },
    { id: 5, name: "Drop 5", category: "Luxury", price: 150, available: "In Stock", popularity: 80, img: "images/placeholder.png" },
    { id: 6, name: "Drop 6", category: "Casual", price: 40, available: "Sold Out", popularity: 70, img: "images/placeholder.png" },
    { id: 7, name: "Drop 7", category: "Streetwear", price: 85, available: "In Stock", popularity: 85, img: "images/placeholder.png" },
    { id: 8, name: "Drop 8", category: "Luxury", price: 95, available: "Sold Out", popularity: 65, img: "images/placeholder.png" }
  ];

  function renderCollection() {
    if (!productsGrid) return;
    const selectedCategories = Array.from(filterCategory).filter(c => c.checked).map(c => c.value);
    const selectedPrices = Array.from(filterPrice).filter(c => c.checked).map(c => c.value);
    const selectedAvailability = Array.from(filterAvailability).filter(c => c.checked).map(c => c.value);

    let filtered = collectionProducts.filter(p =>
      selectedCategories.includes(p.category) &&
      selectedAvailability.includes(p.available) &&
      selectedPrices.some(range => {
        const [min, max] = range.split('-').map(Number);
        return p.price >= min && p.price <= max;
      })
    );

    switch(sortSelect.value) {
      case "price-asc":
        filtered.sort((a,b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a,b) => b.price - a.price);
        break;
      case "popularity":
        filtered.sort((a,b) => b.popularity - a.popularity);
        break;
    }

    productsGrid.innerHTML = filtered.map(p =>
      `<article class="product-card" tabindex="0" aria-label="${p.name}, price $${p.price}, ${p.available}">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <h2>${p.name}</h2>
        <p class="price">$${p.price}</p>
        <p class="status">${p.available}</p>
        <button onclick="showAlert('Add ${p.name} to cart (Demo)')">Add to Cart</button>
        <button onclick="showAlert('View details for ${p.name} (Demo)')">View Details</button>
      </article>`
    ).join("");
  }

  if (sortSelect) sortSelect.addEventListener('change', renderCollection);
  filterCategory.forEach(f => f.addEventListener('change', renderCollection));
  filterPrice.forEach(f => f.addEventListener('change', renderCollection));
  filterAvailability.forEach(f => f.addEventListener('change', renderCollection));

  renderCollection();

  // Wishlist page logic

  const wishlistItems = document.getElementById('wishlist-items');
  if (wishlistItems) {
    wishlistItems.addEventListener('click', e => {
      if (e.target.classList.contains('remove-btn')) {
        e.target.closest('tr').remove();
        showAlert('Item removed from wishlist (Demo)');
      }
      if (e.target.classList.contains('move-btn')) {
        showAlert('Item moved to cart (Demo)');
      }
    });
  }

  // Cart page logic

  const cartItems = document.getElementById('cart-items');
  const totalSection = document.querySelector('.total-section');

  function calculateTotal() {
    let total = 0;
    if (!cartItems) return;
    const rows = cartItems.querySelectorAll('tr');
    rows.forEach(row => {
      const qtyInput = row.querySelector('.qty-input');
      if (!qtyInput) return;
      const price = parseFloat(qtyInput.dataset.price);
      const qty = parseInt(qtyInput.value);
      const rowTotal = price * qty;
      row.querySelector('td:nth-child(4)').textContent = `$${rowTotal.toFixed(2)}`;
      total += rowTotal;
    });
    if (totalSection) totalSection.textContent = `Total: $${total.toFixed(2)}`;
  }

  if (cartItems) {
    cartItems.addEventListener('click', e => {
      if (e.target.classList.contains('remove-btn')) {
        e.target.closest('tr').remove();
        calculateTotal();
      }
    });
    cartItems.addEventListener('input', e => {
      if (e.target.classList.contains('qty-input')) {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) e.target.value = 1;
        else if (val > 10) e.target.value = 10;
        calculateTotal();
      }
    });
  }
  calculateTotal();

  // Login and Register forms

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();
      if (!email || !password) {
        showAlert('Please enter both email and password.');
        return;
      }
      showAlert(`Login submitted for: ${email} (Demo)`);
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const fullname = e.target.fullname.value.trim();
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmpassword.value;
      if (!fullname || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        showAlert('Passwords do not match.');
        return;
      }
      showAlert(`Registration successful. Welcome ${fullname}! (Demo)`);
    });
  }

  // Navigation menu toggle for mobile

  function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) navLinks.classList.toggle('active');
  }
  window.toggleMenu = toggleMenu; // export globally for inline usage

  // Checkout form submission

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      showAlert('Thank you for your purchase! (Demo)');
    });
  }

  // Blog Page toggleMenu export (no other JS needed)
  // FAQ page accordion logic

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('h2');
    header.addEventListener('click', () => item.classList.toggle('active'));
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('active');
      }
    });
  });
});