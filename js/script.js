// =================== INTRO LOGO & GRADIENT ===================
window.addEventListener('load', () => {
    const intro = document.getElementById('intro');
    const gradientBg = document.querySelector('.gradient-bg');
    const logo = document.querySelector('.intro-logo');

    // Example: Change gradient based on logo colors (static for now)
    gradientBg.style.background = 'linear-gradient(135deg,#f0a500,#5e49f8)';

    setTimeout(() => {
        intro.style.opacity = 0;
        setTimeout(() => { intro.style.display = 'none'; }, 500);
    }, 2500);
});

// =================== MENU TOGGLE ===================
const menuToggle = document.querySelector('.menu-toggle');
const navUL = document.querySelector('nav ul');
menuToggle.addEventListener('click', () => {
    navUL.classList.toggle('show');
});

// =================== BACK TO TOP ===================
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
    backTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
});
backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// =================== CAROUSEL ===================
document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const prev = wrapper.querySelector('.carousel-prev');
    const next = wrapper.querySelector('.carousel-next');

    next.addEventListener('click', () => carousel.scrollBy({ left: 300, behavior: 'smooth' }));
    prev.addEventListener('click', () => carousel.scrollBy({ left: -300, behavior: 'smooth' }));
});

// =================== COUNTDOWN ===================
function countdownTimer(endDate, containerId){
    const container = document.getElementById(containerId);
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(endDate).getTime() - now;
        if(distance < 0){ clearInterval(interval); container.innerHTML='EXPIRED'; return; }
        const days = Math.floor(distance/(1000*60*60*24));
        const hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
        const minutes = Math.floor((distance%(1000*60*60))/(1000*60));
        const seconds = Math.floor((distance%(1000*60))/1000);
        container.innerHTML = `
            <div><span>${days}</span>Days</div>
            <div><span>${hours}</span>Hrs</div>
            <div><span>${minutes}</span>Min</div>
            <div><span>${seconds}</span>Sec</div>
        `;
    },1000);
}
// Example usage: countdownTimer('2025-12-31T23:59:59','countdown');

// =================== CART PANEL ===================
const cartPanel = document.getElementById('cart-panel');
const cartItemsUL = document.getElementById('cart-items');
const cartTotalDisplay = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = [];

function updateCart(){
    cartItemsUL.innerHTML = '';
    let total = 0;
    cart.forEach((item,index)=>{
        total += item.price;
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.size.toUpperCase()} - $${item.price.toFixed(2)}`;
        cartItemsUL.appendChild(li);
    });
    cartTotalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        const card = e.target.closest('.product-card');
        const name = card.querySelector('h3').textContent;
        const price = parseFloat(card.dataset.price || 20);
        const size = prompt(`Choose size for "${name}" (s/m/l):`).toLowerCase();
        if(!['s','m','l'].includes(size)){ alert('Invalid size, adding M'); size='m'; }
        cart.push({name,price,size});
        updateCart();
        cartPanel.style.right='0';
    });
});

closeCartBtn.addEventListener('click', ()=> cartPanel.style.right='-400px');
checkoutBtn.addEventListener('click', ()=> alert('Checkout functionality not implemented yet'));

// =================== PRODUCT POPUP ===================
const productPopup = document.getElementById('product-popup');
const popupContent = productPopup.querySelector('.popup-content');
const closePopupBtn = document.getElementById('close-popup');

document.querySelectorAll('.product-card img').forEach(img=>{
    img.addEventListener('click', e=>{
        const card = e.target.closest('.product-card');
        popupContent.querySelector('h3')?.remove();
        const h3 = document.createElement('h3'); h3.textContent=card.querySelector('h3').textContent;
        popupContent.prepend(h3);
        const sizeSelect = popupContent.querySelector('#size-select');
        sizeSelect.value='m';
        productPopup.style.display='flex';
    });
});
closePopupBtn.addEventListener('click',()=> productPopup.style.display='none');

// =================== MUSIC TOGGLE ===================
const musicToggle = document.getElementById('music-toggle');
const music = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
music.loop=true;

musicToggle.addEventListener('click', ()=>{
    if(music.paused){
        music.play();
        musicToggle.classList.add('playing');
    }else{
        music.pause();
        musicToggle.classList.remove('playing');
    }
});
