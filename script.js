const sections = document.querySelectorAll("section");
const arrow = document.getElementById("scrollArrow");
const container = document.getElementById("scrollContainer");
const navToggle = document.getElementById("navToggle");
const fullscreenMenu = document.getElementById("fullscreenMenu");
const menu3dText = document.getElementById("menu3dText");
const menuItems = document.querySelectorAll(".menu-item");
const preloader = document.getElementById("preloader");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const dots = document.querySelectorAll(".dot");

// PRELOADER: hide once everything (incl. hero background image) is loaded
function hidePreloader() {
    if (preloader) preloader.classList.add("hidden");
}
window.addEventListener("load", () => {
    setTimeout(hidePreloader, 500);
});
// Safety net in case 'load' is delayed by slow third-party embeds
setTimeout(hidePreloader, 3500);

// INTERSECTION OBSERVER FOR SECTION FADE-IN
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));

// SEPARATE OBSERVER FOR ACTIVE SECTION-DOT (needs section to be mostly in view)
const dotObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const idx = entry.target.getAttribute("data-index");
            dots.forEach(d => d.classList.toggle("active", d.getAttribute("data-index") === idx));
        }
    });
}, { threshold: 0.5 });

sections.forEach(sec => dotObserver.observe(sec));

// SECTION DOTS: click to jump
dots.forEach(dot => {
    dot.addEventListener("click", () => {
        const idx = dot.getAttribute("data-index");
        const target = document.querySelector(`section[data-index="${idx}"]`);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
});

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
// ============================= //
// CUSTOM CURSOR (desktop only)   //
// ============================= //
const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (isFinePointer && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = "a, button, .dot, .nav-toggle, .see-more, .card";
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(hoverTargets)) cursorRing.classList.add("hovering");
    });
    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(hoverTargets)) cursorRing.classList.remove("hovering");
    });
}

// ============================= //
// SUBTLE UI SOUND (menu toggle)  //
// ============================= //
let audioCtx = null;
function playClick() {
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(720, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(340, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.13);
    } catch (err) {
        // Web Audio not available/blocked — fail silently, sound is a nice-to-have
    }
}
navToggle.addEventListener("click", playClick);

// ============================= //
// FEEDBACK FORM (AJAX submit)    //
// ============================= //
const feedbackForm = document.getElementById("feedbackForm");
const feedbackPanel = document.getElementById("feedbackPanel");
const formSuccess = document.getElementById("formSuccess");

if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = feedbackForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "SENDING...";

        try {
            const formData = new FormData(feedbackForm);
            const response = await fetch(feedbackForm.action, {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                feedbackPanel.classList.add("submitted");
                formSuccess.classList.add("show");
            } else {
                throw new Error(result.message || "Submit failed");
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.textContent = "SEND";
            alert("Da ist etwas schiefgelaufen. Bitte versuch's gleich nochmal.");
        }
    });
}