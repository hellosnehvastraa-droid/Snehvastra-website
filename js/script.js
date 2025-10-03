(() => {
  const dukaanUrl = 'https://snehvastra.store';

  document.addEventListener('DOMContentLoaded', () => {

    // ✅ 1. Welcome Toast
    const toast = document.createElement('div');
    toast.id = 'snea-toast';
    toast.style.cssText = `
      position:fixed; right:18px; top:18px;
      background:#111; color:#fff;
      padding:12px 16px; border-radius:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.25);
      z-index:9999; display:flex; align-items:center;
      gap:12px; opacity:0; transform:translateY(-20px);
      transition:opacity 0.5s ease, transform 0.5s ease;
    `;
    toast.innerHTML = `
      <span style="font-size:14px;">👋 Welcome to Snehvastra</span>
      <button id="snea-toast-btn" style="
        background:#ff5e57; border:none; color:#fff;
        padding:6px 12px; border-radius:6px; cursor:pointer;
        font-weight:600; transition: transform 0.2s ease;
      ">Shop</button>
      <button id="snea-toast-close" style="
        background:transparent; border:none; color:#fff;
        font-size:18px; cursor:pointer; line-height:1;
      ">✕</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = 1; toast.style.transform = 'translateY(0)'; }, 100);

    const shopBtn = document.getElementById('snea-toast-btn');
    shopBtn.addEventListener('mouseenter', () => shopBtn.style.transform = 'scale(1.1)');
    shopBtn.addEventListener('mouseleave', () => shopBtn.style.transform = 'scale(1)');
    shopBtn.addEventListener('click', () => window.location.href = dukaanUrl);

    document.getElementById('snea-toast-close').addEventListener('click', () => toast.remove());
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);

    // ✅ 2. Lightbox
    const productImgs = document.querySelectorAll('.product img');
    if (productImgs.length) {
      const overlay = document.createElement('div');
      overlay.id = 'snea-lightbox';
      overlay.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.88);
        display:flex; align-items:center; justify-content:center;
        z-index:10000; opacity:0; visibility:hidden;
        transition:opacity 0.3s ease;
      `;
      const bigImg = document.createElement('img');
      bigImg.style.cssText = 'max-width:92%; max-height:92%; border-radius:6px; box-shadow:0 12px 40px rgba(0,0,0,0.6);';
      overlay.appendChild(bigImg);

      const closeBtn = document.createElement('span');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position:absolute; top:20px; right:30px;
        font-size:28px; color:#fff; cursor:pointer;
      `;
      overlay.appendChild(closeBtn);

      closeBtn.addEventListener('click', () => { overlay.style.opacity = 0; setTimeout(() => overlay.style.visibility = 'hidden', 300); });
      overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.style.opacity = 0; setTimeout(() => overlay.style.visibility = 'hidden', 300); }});

      document.body.appendChild(overlay);

      productImgs.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.style.transition = 'transform 0.3s ease';
        img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
        img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
        img.addEventListener('click', () => {
          bigImg.src = img.src;
          overlay.style.visibility = 'visible';
          setTimeout(() => overlay.style.opacity = 1, 10);
        });
      });
    }

    // ✅ 3. Auto-rotate product highlight
    const imgs = document.querySelectorAll('.products img');
    if (imgs.length > 1) {
      let idx = 0;
      setInterval(() => {
        imgs.forEach((im, i) => im.style.opacity = i === idx ? '1' : '0.45');
        idx = (idx + 1) % imgs.length;
      }, 3500);
    }

    console.log("🔥 Snehvastra site loaded successfully!");
  });
})();
