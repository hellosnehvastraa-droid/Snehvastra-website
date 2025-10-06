// Utility
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// CONFIG
const CONFIG = {
  inrToUsd: 0.012, // approximate; update as needed
  nextDropDateISO: "2025-10-20T00:00:00", // change drop date
};

// ---------- Intro: adapt gradient from logo ----------
function adaptIntroGradientFromLogo() {
  const logo = document.getElementById('logo-sample');
  const gradientEl = document.querySelector('.gradient-bg');
  if (!logo || !gradientEl) return;

  // Draw logo to canvas and compute average color (defensive)
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = logo.src;

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const w = Math.min(img.width, 64);
      const h = Math.min(img.height, 64);
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i+1]; b += data[i+2]; count++;
      }
      r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);
      // complementary color
      const cr = 255 - r, cg = 255 - g, cb = 255 - b;
      const base = `rgb(${r},${g},${b})`;
      const comp = `rgb(${cr},${cg},${cb})`;
      gradientEl.style.background = `linear-gradient(135deg, ${base}, ${comp})`;
      // adjust hero vars to ensure contrast
      document.documentElement.style.setProperty('--hero-bg', comp);
      document.documentElement.style.setProperty('--hero-fg', '#fff');
      document.documentElement.style.setProperty('--btn-bg', comp);
      document.documentElement.style.setProperty('--btn-fg', '#fff');
    } catch(e){ /* silent fallback */ }
  };
}
adaptIntroGradientFromLogo();

// ---------- Intro hide/show ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    const intro = $('#intro');
    const main = $('#main-content');
    if (intro) intro.style.display = 'none';
    if (main) main.style.display = 'block';
  }, 1600); // short intro
});

// ---------- Countdown ----------
(function countdown(){
  const daysEl = $('#days'), hoursEl = $('#hours'), minutesEl = $('#minutes'), secondsEl = $('#seconds');
  const nextName = $('#next-drop-name');
  const target = new Date(CONFIG.nextDropDateISO).getTime();
  function tick(){
    const now = Date.now();
    let diff = target - now;
    if (diff < 0){ if (daysEl) daysEl.parentElement.innerHTML = '<div class="live-badge">Drop Live!</div>'; return; }
    const days = Math.floor(diff / (1000*60*60*24));
    const hrs = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
    const secs = Math.floor((diff % (1000*60)) / 1000);
    if (daysEl) daysEl.innerText = String(days).padStart(2,'0');
    if (hoursEl) hoursEl.innerText = String(hrs).padStart(2,'0');
    if (minutesEl) minutesEl.innerText = String(mins).padStart(2,'0');
    if (secondsEl) secondsEl.innerText = String(secs).padStart(2,'0');
  }
  tick(); setInterval(tick,1000);
})();

// ---------- Carousel prev/next ----------
(function setupCarousels(){
  $$('.carousel-wrapper').forEach((wrap) => {
    const carousel = wrap.querySelector('.carousel');
    const prev = wrap.querySelector('.carousel-btn.prev');
    const next = wrap.querySelector('.carousel-btn.next');
    if (!carousel) return;
    const scrollAmount = 260;
    prev && prev.addEventListener('click', () => carousel.scrollBy({left: -scrollAmount, behavior:'smooth'}));
    next && next.addEventListener('click', () => carousel.scrollBy({left: scrollAmount, behavior:'smooth'}));
  });
})();

// ---------- Mobile menu toggle ----------
(function navToggle(){
  $$('.menu-toggle').forEach(btn => {
    btn.addEventListener('click', ()=> {
      const ul = document.querySelector('nav .nav-links');
      if (ul) ul.classList.toggle('show');
    });
  });
})();

// ---------- Cart & Wishlist (localStorage) ----------
const Storage = {
  cart: JSON.parse(localStorage.getItem('sneh_cart')||'[]'),
  wish: JSON.parse(localStorage.getItem('sneh_wish')||'[]')
};

function updateCounts(){
  $$('#cart-count, #cart-count-2').forEach(el=> { if (el) el.innerText = Storage.cart.length; });
  $$('#wish-count, #wish-count-2').forEach(el=> { if (el) el.innerText = Storage.wish.length; });
  $('#cart-count')?.innerText && ($('#cart-count').innerText = Storage.cart.length);
  $('#cart-count-2')?.innerText && ($('#cart-count-2').innerText = Storage.cart.length);
  $('#wish-count')?.innerText && ($('#wish-count').innerText = Storage.wish.length);
  $('#wish-count-2')?.innerText && ($('#wish-count-2').innerText = Storage.wish.length);
}
updateCounts();

function formatUSD(inr){ return (inr * CONFIG.inrToUsd).toFixed(2); }

// Add listeners to product buttons (Add to cart / wishlist)
(function wireProductActions(){
  // compute USD values into visible spans
  $$('.product-card').forEach(card=>{
    const price = Number(card.dataset.price || card.getAttribute('data-price') || 0);
    const usdEls = card.querySelectorAll('.usd-val');
    usdEls.forEach(e => e.innerText = formatUSD(price));
  });

  // add to cart
  document.body.addEventListener('click', (e)=>{
    const add = e.target.closest('.add-cart');
    if (add){
      const card = add.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id;
      const title = card.dataset.title || card.querySelector('h3')?.innerText || 'Product';
      const price = Number(card.dataset.price || 0);
      addToCart({id,title,price});
    }
  });

  // wishlist toggle
  document.body.addEventListener('click', (e)=>{
    const w = e.target.closest('.add-wish');
    if (w){
      const card = w.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id;
      toggleWish(id);
      w.classList.toggle('wished', Storage.wish.includes(id));
    }
  });
})();

function addToCart(product){
  if (!product || !product.id) return;
  const existing = Storage.cart.find(p=>p.id===product.id);
  if (existing){
    existing.qty = (existing.qty||1)+1;
  } else {
    Storage.cart.push({id:product.id,title:product.title,price:product.price,qty:1});
  }
  localStorage.setItem('sneh_cart', JSON.stringify(Storage.cart));
  updateCounts();
  renderCart();
  openCart();
}

function toggleWish(id){
  if (!id) return;
  if (Storage.wish.includes(id)){
    Storage.wish = Storage.wish.filter(x=>x!==id);
  } else {
    Storage.wish.push(id);
  }
  localStorage.setItem('sneh_wish', JSON.stringify(Storage.wish));
  updateCounts();
}

// ---------- Cart UI ----------
function renderCart(){
  const container = $('#cart-items');
  if (!container) return;
  container.innerHTML = '';
  if (!Storage.cart.length){
    container.innerHTML = '<p style="padding:12px;color:#666">Your cart is empty.</p>';
    $('#cart-total').innerText = '0';
    $('#cart-total-usd').innerText = '0.00';
    return;
  }
  let total = 0;
  Storage.cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${(document.querySelector('.product-card[data-id="'+item.id+'"] img')?.src) || 'images/myproduct1.jpg'}" alt="">
      <div style="flex:1">
        <div style="font-weight:700">${item.title}</div>
        <div style="color:#666">₹${item.price} × ${item.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button class="icon-btn small remove-item" data-id="${item.id}">🗑</button>
      </div>`;
    container.appendChild(row);
    total += item.price * (item.qty || 1);
  });
  $('#cart-total').innerText = total;
  $('#cart-total-usd').innerText = formatUSD(total);
}

// remove item handler
document.body.addEventListener('click', (e)=>{
  if (e.target.matches('.remove-item')){
    const id = e.target.dataset.id;
    Storage.cart = Storage.cart.filter(i=>i.id !== id);
    localStorage.setItem('sneh_cart', JSON.stringify(Storage.cart));
    updateCounts();
    renderCart();
  }
});

// open/close cart
function openCart(){ $('#cart-panel')?.classList.add('open'); $('#cart-panel')?.setAttribute('aria-hidden','false'); }
function closeCart(){ $('#cart-panel')?.classList.remove('open'); $('#cart-panel')?.setAttribute('aria-hidden','true'); }

$$('#cart-toggle, #cart-toggle-2').forEach(el => el && el.addEventListener('click', ()=> { renderCart(); openCart(); }));
$$('#cart-close').forEach(el => el && el.addEventListener('click', closeCart));

// checkout demo
$('#checkout-btn')?.addEventListener('click', ()=> {
  alert('Demo checkout — no real payment. Use this to test flow.');
});

// render initial
renderCart();

// ---------- contact form demo ----------
$('#contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  // store demo message in localStorage
  const fm = e.target;
  const data = {name: fm.name.value, email: fm.email.value, msg: fm.message.value, time: Date.now()};
  const arr = JSON.parse(localStorage.getItem('sneh_messages') || '[]');
  arr.push(data);
  localStorage.setItem('sneh_messages', JSON.stringify(arr));
  alert('Message sent (demo). We stored it locally.');
  fm.reset();
});

// ---------- small helpers ----------
window.addEventListener('DOMContentLoaded', () => {
  // populate cart/wish counts on page load
  Storage.cart = JSON.parse(localStorage.getItem('sneh_cart') || '[]');
  Storage.wish = JSON.parse(localStorage.getItem('sneh_wish') || '[]');
  updateCounts();
  renderCart();
});

// Defensive: expose small debugging helpers
window._sneh = {Storage, addToCart, toggleWish, renderCart};
