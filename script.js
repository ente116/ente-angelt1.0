const sections = document.querySelectorAll("section");
const arrow = document.getElementById("scrollArrow");
const container = document.getElementById("scrollContainer");
const navToggle = document.getElementById("navToggle");
const fullscreenMenu = document.getElementById("fullscreenMenu");
const menu3dText = document.getElementById("menu3dText");
const menuItems = document.querySelectorAll(".menu-item");

// INTERSECTION OBSERVER FOR SECTION FADE-IN
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));

// SCROLL INDICATOR LOGIC
container.addEventListener("scroll", () => {
    if (container.scrollTop > 60) {
        arrow.style.opacity = "0";
    } else {
        arrow.style.opacity = "1";
    }
}, { passive: true });

// NAV-TOGGLE ACTION
navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    fullscreenMenu.classList.toggle("open");
});

// GEISTESKRANKER HOVER-EFFEKT IM MENÜ
menuItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
        const randomX = Math.floor(Math.random() * 30) - 15;
        const randomY = Math.floor(Math.random() * 30) - 15;
        menu3dText.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg) scale(1.15)`;
        menu3dText.style.color = "rgba(160, 255, 0, 0.08)";
    });
    
    item.addEventListener("mouseleave", () => {
        menu3dText.style.transform = "rotateX(15deg) rotateY(-15deg) scale(1)";
        menu3dText.style.color = "rgba(255, 255, 255, 0.018)";
    });

    item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetIndex = item.getAttribute("data-target");
        const targetSection = sections[targetIndex];
        
        navToggle.classList.remove("active");
        fullscreenMenu.classList.remove("open");
        
        targetSection.scrollIntoView({ behavior: "smooth" });
    });
});