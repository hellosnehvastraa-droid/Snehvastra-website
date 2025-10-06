/* ======= Utility ======= */
function $q(sel) { try { return document.querySelector(sel); } catch(e) { return null; } }
function $qa(sel) { try { return Array.from(document.querySelectorAll(sel)); } catch(e) { return []; } }

/* ======= Brand config ======= */
const CONFIG = {
  inrToUsdRate: 0.012, // default conversion (update to current rate if you like)
  featuredPriceINR: 1999,
};

/* ======= Intro (used on index.html) ======= */
(function introController(){
  const intro = $q('#intro');
  const main = $q('#main-content');
  const skip = $q('#skip-intro');
  const logo = $q('.intro-logo');
  const gradient = $q('.gradient-bg');

  if (!intro || !main) return; // nothing to do (shop.html opens main directly)

  // compute animation duration from CSS (fallback 4000ms)
  let animMs = 4000;
  if (logo){
    try {
      const ad = getComputedStyle(logo).animationDuration || '';
      if (ad){
        const first = ad.split(',')[0].trim();
        if (first.endsWith('ms')) animMs = parseFloat(first);
        else if (first.endsWith('s')) animMs = parseFloat(first) * 1000;
      }
    } catch(e){}
  }

  // skip button
  if (skip){
    skip.addEventListener('click', () => {
      // immediately hide intro
      intro.style.opacity = '0';
      if (gradient) gradient.style.opacity = '0';
      setTimeout(() => { intro.style.display='none'; main.style.display='block'; }, 450);
    });
  }

  window.addEventListener('load', () => {
    // wait animMs then fade out (logo + gradient)
    setTimeout(() => {
      intro.style.transition = 'opacity 800ms ease';
      intro.style.opacity = '0';
      if (gradient) gradient.style.transition = 'opacity 800ms ease', gradient.style.opacity = '0';
      setTimeout(()=> {
        intro.style.display = 'none';
        main.style.display = 'block';
        // small zoom-in for main
        main.style.opacity = '0';
        main.style.transform = 'scale(.98)';
        main.style.transition = 'opacity 600ms ease, transform 600ms ease';
        requestAnimationFrame(()=>{ main.style.opacity='1'; main.style.transform='scale(1)'; });
      }, 850);
    }, animMs);
  }, {once:true});
})();

/* ======= Mobile nav toggle ======= */
(function navToggle(){
  const btn = $q('.menu-toggle');
  const ul = $q('.nav-links');
  if (!btn || !ul) return;
  btn.addEventListener('click', ()=> ul.classList.toggle('show'));
})();

/* ======= Countdown (index featured) ======= */
(function countdownInit(){
  const daysEl = $q('#days');
  if (!daysEl) return; // not on index
  // set desired drop date here
  const dropDate = new Date("2025-10-10T00:00:00").getTime();

  function tick(){
    const now = Date.now();
    const dist = Math.max(0, dropDate - now);
    const days = Math.floor(dist / (1000*60*60*24));
    const hours = Math.floor((dist % (1000*60*60*24))/(1000*60*60));
    const mins = Math.floor((dist % (1000*60*60))/(1000*60));
    const secs = Math.floor((dist % (1000*60))/1000);

    $q('#days').innerText = String(days).padStart(2,'0');
    $q('#hours').innerText = String(hours).padStart(2,'0');
    $q('#minutes').innerText = String(mins).padStart(2,'0');
    $q('#seconds').innerText = String(secs).padStart(2,'0');

    // update featured USD
    const inr = CONFIG.featuredPriceINR;
    const usd = (inr * CONFIG.inrToUsdRate).toFixed(2);
    $q('#featured-inr').innerText = inr;
    $q('#featured-usd').innerText = usd;

    if (dist <= 0) {
      clearInterval(window._sneh_countdown);
      const node = $q('.countdown');
      if (node) node.innerHTML = '<div class="badge new">Drop is Live!</div>';
    }
  }
  tick();
  window._sneh_countdown = setInterval(tick,1000);
})();

/* ======= Carousel (small usage, if present) ======= */
(function carouselInit(){
  const car = $q('.carousel');
  if (!car) return;
  const next = $q('.carousel-btn.next');
  const prev = $q('.carousel-btn.prev');

  if (next) next.addEventListener('click', ()=> car.scrollBy({left:320,behavior:'smooth'}));
  if (prev) prev.addEventListener('click', ()=> car.scrollBy({left:-320,behavior:'smooth'}));

  let auto = setInterval(()=> {
    if (car.scrollLeft + car.clientWidth >= car.scrollWidth - 10) car.scrollTo({left:0,behavior:'smooth'});
    else car.scrollBy({left:320,behavior:'smooth'});
  }, 3000);

  car.addEventListener('mouseenter', ()=> clearInterval(auto));
  car.addEventListener('mouseleave', ()=> auto = setInterval(()=> {
    if (car.scrollLeft + car.clientWidth >= car.scrollWidth - 10) car.scrollTo({left:0,behavior:'smooth'});
    else car.scrollBy({left:320,behavior:'smooth'});
  },3000));
})();

/* ======= Shop page rendering ======= */
(function shopRenderer(){
  // Only run on shop.html
  if (!location.pathname.includes('shop.html') ) return;

  // Example product data (you will replace with real data or API)
  const products = [
    {id:'p1', title:'NEON SHIFT Jacket', img:'images/myproduct1.jpg', priceINR:4999, status:'ongoing', desc:'Reflective panels, structured fit.'},
    {id:'p2', title:'Chromatic Tee', img:'images/myproduct2.jpg', priceINR:1299, status:'onsale', desc:'Color-reactive dye tee.'},
    {id:'p3', title:'Shifted Cargo', img:'images/myproduct3.jpg', priceINR:2899, status:'ongoing', desc:'Modular pockets.'},
    {id:'p4', title:'Glow Panel Hoodie', img:'images/myproduct4.jpg', priceINR:3999, status:'soldout', desc:'Limited run with glow inserts.'},
  ];

  function inrToUsd(inr){ return (inr * CONFIG.inrToUsdRate).toFixed(2); }

  const ongoingGrid = $q('#ongoing-grid');
  const onsaleGrid = $q('#onsale-grid');
  const soldoutGrid = $q('#soldout-grid');

  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card card card-overlay';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div>
        <h3>${p.title}</h3>
        <p class="muted small">${p.desc}</p>
        <div class="price-line">
          <div>₹ ${p.priceINR}</div>
          <div class="muted small">≈ $ ${inrToUsd(p.priceINR)}</div>
        </div>
        <div class="card-actions" style="margin-top:10px;">
          <button class="btn small" onclick="addToCartStub('${p.id}')">Add to cart</button>
          <button class="btn btn-outline small" onclick="wishlistStub('${p.id}')">Wishlist</button>
        </div>
      </div>
    `;

    if (p.status === 'ongoing' && ongoingGrid) ongoingGrid.appendChild(card);
    if (p.status === 'onsale' && onsaleGrid) onsaleGrid.appendChild(card);
    if (p.status === 'soldout' && soldoutGrid) {
      // add overlay
      const overlay = document.createElement('div');
      overlay.className = 'sold-overlay';
      overlay.innerText = 'Sold Out';
      card.appendChild(overlay);
      if (soldoutGrid) soldoutGrid.appendChild(card);
    }
  });

})();

/* ======= small user stubs ======= */
function notifyStub(){ alert('Thanks — we will notify you when this drop launches.'); }
function addToCartStub(id){ alert('Added to cart (demo): ' + id); }
function wishlistStub(id){ alert('Added to wishlist (demo): ' + id); }