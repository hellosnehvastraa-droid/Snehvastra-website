// Mobile Menu Toggle
const menuToggle=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
menuToggle.addEventListener('click',()=>{navLinks.classList.toggle('show');});

// Carousel Functionality
const prevBtn=document.querySelectorAll('.carousel-btn.prev');
const nextBtn=document.querySelectorAll('.carousel-btn.next');
const carousels=document.querySelectorAll('.carousel');

nextBtn.forEach((btn,i)=>btn.addEventListener('click',()=>carousels[i].scrollBy({left:300,behavior:'smooth'})));
prevBtn.forEach((btn,i)=>btn.addEventListener('click',()=>carousels[i].scrollBy({left:-300,behavior:'smooth'})));

// Auto-slide with hover pause
carousels.forEach(c=>{
  let interval=setInterval(()=>{c.scrollBy({left:300,behavior:'smooth'});},3000);
  c.addEventListener('mouseenter',()=>clearInterval(interval));
  c.addEventListener('mouseleave',()=>{interval=setInterval(()=>{c.scrollBy({left:300,behavior:'smooth'});},3000);});
});

// Countdown
const countdownDate=new Date("2025-10-10T00:00:00").getTime();
setInterval(()=>{
  const now=new Date().getTime();
  const dist=countdownDate-now;
  const d=Math.floor(dist/(1000*60*60*24));
  const h=Math.floor((dist%(1000*60*60*24))/(1000*60*60));
  const m=Math.floor((dist%(1000*60*60))/(1000*60));
  const s=Math.floor((dist%(1000*60))/1000);
  document.getElementById("days").innerText=d.toString().padStart(2,"0");
  document.getElementById("hours").innerText=h.toString().padStart(2,"0");
  document.getElementById("minutes").innerText=m.toString().padStart(2,"0");
  document.getElementById("seconds").innerText=s.toString().padStart(2,"0");
  if(dist<0){document.querySelector(".countdown").innerHTML="<div>Drop is Live!</div>";}
},1000);

// Cinematic Intro + Main Content Reveal
window.addEventListener("load",()=>{
  const intro=document.getElementById("intro");
  const main=document.getElementById("main-content");
  const logo=document.querySelector(".intro-logo");
  const grad=document.querySelector(".gradient-bg");
  const duration=parseFloat(getComputedStyle(logo).animationDuration)*1000;
  setTimeout(()=>{
    intro.style.transition="opacity 1s ease";
    intro.style.opacity="0";
    grad.style.transition="opacity 1s ease";
    grad.style.opacity="0";
    setTimeout(()=>{intro.style.display="none";main.style.display="block";
      main.style.opacity="0";main.style.transform="scale(0.95)";
      main.style.transition="opacity 1.5s ease, transform 1.5s ease";
      requestAnimationFrame(()=>{main.style.opacity="1";main.style.transform="scale(1)";});
    },1000);
  },duration);
});

// Back to Home Orb
document.getElementById("back-to-home").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

// Product Reveal Animation
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.style.opacity="1";entry.target.style.transform="translateY(0)";}});
});
document.querySelectorAll(".product-card").forEach(el=>observer.observe(el));
