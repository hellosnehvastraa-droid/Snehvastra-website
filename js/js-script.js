// Cart & Wishlist simulation
let cart = [];
let wishlist = [];

// Add to cart
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const product = btn.dataset.product;
        const size = document.getElementById('size').value;
        const purpose = document.getElementById('purpose').value;

        cart.push({ product, size, purpose });
        updateCartUI();
    });
});

function updateCartUI() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<h2>${item.product}</h2><p>Size: ${item.size}</p><p>Purpose: ${item.purpose}</p><button class="remove-item">Remove</button>`;
        cartContainer.appendChild(div);

        div.querySelector('.remove-item').addEventListener('click', () => {
            cart = cart.filter(i => i !== item);
            updateCartUI();
        });
    });
}

// Wishlist simulation
document.querySelectorAll('.view-product').forEach(btn => {
    btn.addEventListener('click', () => {
        const product = btn.dataset.product;
        wishlist.push(product);
        updateWishlistUI();
    });
});

function updateWishlistUI() {
    const wishlistContainer = document.querySelector('.wishlist-container');
    if (!wishlistContainer) return;
    wishlistContainer.innerHTML = '';
    wishlist.forEach(product => {
        const div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = `<h2>${product}</h2><button class="remove-item">Remove</button>`;
        wishlistContainer.appendChild(div);

        div.querySelector('.remove-item').addEventListener('click', () => {
            wishlist = wishlist.filter(p => p !== product);
            updateWishlistUI();
        });
    });
}

// Front-end counter for rush simulation
let productStock = 20;
const counterInterval = setInterval(() => {
    if (productStock > 0) {
        productStock -= Math.floor(Math.random() * 2); // Random decrease
        document.querySelectorAll('.rush-counter').forEach(el => el.textContent = productStock);
    }
}, 3000);
