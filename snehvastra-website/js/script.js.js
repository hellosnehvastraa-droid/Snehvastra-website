/* snehvastra - script.js
   Small interactive helpers:
   - welcome toast with Shop button
   - image lightbox for product images
   - optional signup form handling (id="signup-form")
   - mobile menu toggle if #menu-toggle exists
   - small auto-rotate effect demo
   Edit dukaanUrl to your store link.
*/

(() => {
  const dukaanUrl = 'https://snehvastra.store.com';

  document.addEventListener('DOMContentLoaded', () => {
    // 1) Welcome toast (non-blocking)
    const toast = document.createElement('div');
    toast.id = 'snea-toast';
    toast.style.cssText = 'position:fixed;right:18px;top:18px;background:#111;color:#fff;padding:10px 14px;border-radius:9px;box-shadow:0 8px 24px rgba(0,0,0,0.18);z-index:9999;font-family:system-ui, Arial;display:flex;align-items:center;gap:10px;';
    toast.innerHTML = `<span style="font-size:14px;">👋 Welcome to Snehvastra</span>
                       <button id="snea-toast-btn" style="background:#ff5e57;border:none;color:#fff;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:600;">shop</button>
                       <button id="snea-toast-close" style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1;">✕</button>`;
    document.body.appendChild(toast);

    document.getElementById('snea-toast-btn').addEventListener('click', () => {
      // if there is a local shop page, prefer that; otherwise go to dukaanUrl
      const shopLink = document.querySelector('a[href*="shop.html"]') ? 'shop.html' : dukaanUrl;
      window.location.href = shopLink;
    });
    document.getElementById('snea-toast-close').addEventListener('click', () => toast.remove());
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);

    // 2) Lightbox for product images (click to enlarge)
    const productImgs = document.querySelectorAll('.product img, .products img');
    if (productImgs.length) {
      const overlay = document.createElement('div');
      overlay.id = 'snea-lightbox';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.86);display:flex;align-items:center;justify-content:center;z-index:10000;visibility:hidden;opacity:0;transition:opacity .18s;';
      const big = document.createElement('img');
      big.style.cssText = 'max-width:92%;max-height:92%;border-radius:6px;box-shadow:0 12px 40px rgba(0,0,0,0.6);';
      overlay.appendChild(big);
      overlay.addEventListener('click', () => { overlay.style.opacity = 0; setTimeout(()=> overlay.style.visibility = 'hidden', 180); });
      document.body.appendChild(overlay);

      productImgs.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
          big.src = img.src;
          overlay.style.visibility = 'visible';
          setTimeout(()=> overlay.style.opacity = 1, 10);
        });
      });
    }

    // 3) Simple rotate visual (non-destructive demo)
    const productGrid = document.querySelector('.products');
    if (productGrid) {
      const imgs = productGrid.querySelectorAll('img');
      if (imgs.length > 1) {
        let idx = 0;
        setInterval(() => {
          imgs.forEach((im, i) => im.style.opacity = i === idx ? '1' : '0.45');
          idx = (idx + 1) % imgs.length;
        }, 3500);
      }
    }

    // 4) Signup form handler (if you add <form id="signup-form"> with an input[type="email"])
    const form = document.getElementById('signup-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input ? input.value.trim() : '';
        const msg = document.createElement('div');
        msg.style.cssText = 'margin-top:8px;font-size:14px';
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          msg.style.color = 'crimson';
          msg.textContent = 'Please enter a valid email';
          form.appendChild(msg);
          setTimeout(()=> msg.remove(), 2500);
          return;
        }
        localStorage.setItem('snea_signup', email); // demo: store locally
        msg.style.color = 'limegreen';
        msg.textContent = 'Thanks — you are on the list!';
        form.appendChild(msg);
        form.reset();
        setTimeout(()=> msg.remove(), 3000);
      });
    }

    // 5) Mobile menu toggle (if you have a button with id="menu-toggle")
    const menuToggle = document.getElementById('menu-toggle');
    const navUl = document.querySelector('nav ul');
    if (menuToggle && navUl) {
      menuToggle.addEventListener('click', () => navUl.classList.toggle('open'));
    }

    // Basic script placeholder
console.log("Snehvastra site loaded successfully!");
  });
})();
