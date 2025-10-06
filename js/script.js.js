// ✨ DOM Elements
const intro = document.getElementById('intro');
const mainContent = document.getElementById('main-content');
const logo = document.getElementById('logo');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('nav ul');
const carousel = document.querySelector('.carousel');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

const cartBtn = document.getElementById('cart-btn');
const cartPanel = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
let cart = [];

// Product Popup
const productPopup = document.getElementById('product-popup');
const popupTitle = document.getElementById('popup-title');
const popupImage = document.getElementById('popup-image');
const popupDescription = document.getElementById('popup-description');
const sizeSelect = document.getElementById('size-select');
const addCartBtn = document.querySelector('.add-cart-btn');
let currentProduct = null;

// Music
const musicToggle = document.getElementById('music-toggle');
const music = document.getElementById('background-music');

// 🎬 Intro Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        intro.style.display = 'none';
        mainContent.style.display = 'block';
    }, 3000);
});

// 🌈 Menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// 🎠 Carousel Scroll
nextBtn.addEventListener('click', () => { carousel.scrollBy({left:300, behavior:'smooth'}); });
prevBtn.addEventListener('click', () => { carousel.scrollBy({left:-300, behavior:'smooth'}); });

// 🛒 Cart Panel
cartBtn.addEventListener('click', () => { cartPanel.style.right = '0'; });
closeCartBtn.addEventListener('click', () => { cartPanel.style.right = '-400px'; });

// Add to cart popup logic
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
        const card = e.target.closest('.product-card');
        const title = card.querySelector('h3').innerText;
        const priceText = card.querySelector('p').innerText;
        const price = parseInt(priceText.replace(/\D/g,''));
        const img = card.querySelector('img').src;
        currentProduct = { title, price, img };
        popupTitle.innerText = title;
        popupImage.src = img;
        popupDescription.innerText = `This is a preview description of ${title}. Tell us your purpose and we will craft it just for you.`;
        productPopup.style.display = 'flex';
    });
});

// Close popup
document.getElementById('close-popup').addEventListener('click', () => {
    productPopup.style.display = 'none';
});

// Add to cart from popup
addCartBtn.addEventListener('click', () => {
    const size = sizeSelect.value;
    cart.push({...currentProduct, size});
    updateCart();
    productPopup.style.display = 'none';
});

// Update cart
function updateCart(){
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = `${item.title} - ${item.size} - ₹${item.price}`;
        cartItems.appendChild(li);
        total += item.price;
    });
    cartTotal.innerText = total;
    document.getElementById('cart-count').innerText = cart.length;
}

// 🎵 Music toggle
musicToggle.addEventListener('click', () => {
    if(music.paused){ music.play(); musicToggle.innerText='🔊 Music On'; }
    else { music.pause(); musicToggle.innerText='🎵 Play Music'; }
});

// Countdown Timer
const endDate = new Date("2025-12-31T23:59:59").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;
    if(distance<0) return;
    document.getElementById('days').innerText = Math.floor(distance/(1000*60*60*24));
    document.getElementById('hours').innerText = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    document.getElementById('minutes').innerText = Math.floor((distance%(1000*60*60))/(1000*60));
    document.getElementById('seconds').innerText = Math.floor((distance%(1000*60))/1000);
},1000);