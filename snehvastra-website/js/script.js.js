(() => {
  const dukaanUrl = 'https://snehvastra.store'; // Fixed domain

  document.addEventListener('DOMContentLoaded', () => {

    // 1) Welcome toast (fade-in, fade-out, hover effects)
    const toast = document.createElement('div');
    toast.id = 'snea-toast';
    toast.style.cssText = `
      position:fixed;
      right:18px;
      top:18px;
      background:#111;
      color:#fff;
      padding:12px 16px;
      border-radius:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.25);
      z-index:9999;
      font-family:system-ui, Arial;
      display:flex;
      align-items:center;
      gap:12px;
      opacity:0;
      transition:opacity 0.5s ease, transform 0.5s ease;
      transform: translateY(-20px);
    `;
    toast.innerHTML = `
      <span style="font-size:14px;">👋 Welcome to Snehvastra</span>
      <button id="snea-toast-btn" style="
        background:#ff5e57;
        border:none;
        color:#fff;
        padding:6px 12px;
        border-radius:6px;
        cursor:pointer;
        font-weight:600;
        transition: transform 0.2s ease;
      ">Shop</button>
      <button id="snea-toast-close" style="
        background:transparent;
        border:none;
        color:#fff;
        font-size:18px;
        cursor:pointer;
        line-height:1;
      ">✕</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = 1; toast.style.transform = 'translateY(0)'; }, 50);

    const shopBtn = document.getElementById('snea-toast-btn');
    shopBtn.addEventListener('mouseenter', () => shopBtn.style.transform = 'scale(1.1)');
    shopBtn.addEventListener('mouseleave', () => shopBtn.style.transform = 'scale(1)');
    shopBtn.addEventListener('click', () => {
      const shopLink = document.querySelector('a[href*="shop.html"]') ? 'shop.html' : dukaanUrl;
      window.location.href = shopLink;
    });

    document.getElementById('snea-toast-close').addEventListener('click', () => {
      toast.style.opacity = 0;
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 500);
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = 0;
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 500);
      }
    }, 5000);

    // 2) Lightbox for product images (click to enlarge with smooth fade)
    const productImgs = document.querySelectorAll('.product img, .products img');
    if (productImgs.length) {
      const overlay = document.createElement('div');
      overlay.id = 'snea-lightbox';
      overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.88);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:10000;
        opacity:0;
        visibility:hidden;
        transition:opacity 0.3s ease;
      `;
      const bigImg = document.createElement('img');
      bigImg.style.cssText = 'max-width:92%; max-height:92%; border-radius:6px; box-shadow:0 12px 40px rgba(0,0,0,0.6);';
      overlay.appendChild(bigImg);

      const closeBtn = document.createElement('span');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position:absolute;
        top:20px;
        right:30px;
        font-size:28px;
        color:#fff;
        cursor:pointer;
      `;
      overlay.appendChild(closeBtn);

      closeBtn.addEventListener('click', () => {
        overlay.style.opacity = 0;
        setTimeout(() => overlay.style.visibility = 'hidden', 300);
      });

      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          overlay.style.opacity = 0;
          setTimeout(() => overlay.style.visibility = 'hidden', 300);
        }
      });

      document.body.appendChild(overlay);

      productImgs.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
        img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
        img.style.transition = 'transform 0.3s ease';
        img.addEventListener('click', () => {
          bigImg.src = img.src;
          overlay.style.visibility = 'visible';
          setTimeout(() => overlay.style.opacity = 1, 10);
        });
      });
    }

    // 3) Product auto-rotate highlight (subtle opacity effect)
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

    // 4) Signup form handler (optional)
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
        localStorage.setItem('snea_signup', email);
        msg.style.color = 'limegreen';
        msg.textContent = 'Thanks — you are on the list!';
        form.appendChild(msg);
        form.reset();
        setTimeout(()=> msg.remove(), 3000);
      });
    }

    // 5) Mobile menu toggle (optional)
    const menuToggle = document.getElementById('menu-toggle');
    const navUl = document.querySelector('nav ul');
    if (menuToggle && navUl) {
      menuToggle.addEventListener('click', () => navUl.classList.toggle('open'));
    }

    console.log("🔥 Snehvastra site loaded successfully!");
  });
})();
