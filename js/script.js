// 🌟 Intro Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 3000);
});

// 🌟 Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('nav ul');
menuToggle.addEventListener('click', () => { navLinks.classList.toggle('show'); });

// 🌟 Countdown Timer (example)
const countdownDate = new Date("Oct 20, 2025 00:00:00").getTime();
setInterval(() => {
    let now = new Date().getTime();
    let distance = countdownDate - now;
    if(distance<0) return;
    document.getElementById("days").innerText = Math.floor(distance/(1000*60*60*24));
    document.getElementById("hours").innerText = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    document.getElementById("minutes").innerText = Math.floor((distance%(1000*60*60))/(1000*60));
    document.getElementById("seconds").innerText = Math.floor((distance%(1000*60))/1000);
},1000);

// 🌟 Simple Carousel
document.querySelectorAll('.carousel-wrapper').forEach(wrapper=>{
    const carousel = wrapper.querySelector('.carousel');
    wrapper.querySelector('.next').addEventListener('click',()=>{carousel.scrollBy({left:300,behavior:'smooth'});});
    wrapper.querySelector('.prev').addEventListener('click',()=>{carousel.scrollBy({left:-300,behavior:'smooth'});});
});

// 🌟 Back to Top Button
const backTop = document.createElement('div');
backTop.innerHTML = '⬆';
backTop.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#f0a500;color:#111;padding:12px 15px;border-radius:50%;cursor:pointer;z-index:999;font-size:1.5rem;display:none;';
document.body.appendChild(backTop);
backTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});});
window.addEventListener('scroll',()=>{backTop.style.display=(window.scrollY>300)?'block':'none';});

// 🌟 UTM / Analytics Placeholder
(function(){
    // Insert your GA4 measurement ID
    console.log("Analytics placeholder: GA4 Measurement ID goes here");
})();
