// ============================= //
// PRELOADER                      //
// ============================= //
const preloader = document.getElementById("preloader");
function hidePreloader() { if (preloader) preloader.classList.add("hidden"); }
window.addEventListener("load", () => setTimeout(hidePreloader, 450));
setTimeout(hidePreloader, 3000); // safety net for slow third-party embeds

// ============================= //
// NAV: scrolled state             //
// ============================= //
const nav = document.getElementById("siteNav");
window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

// ============================= //
// MOBILE DRAWER                  //
// ============================= //
const burger = document.getElementById("navBurger");
const drawer = document.getElementById("drawer");
burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    drawer.classList.toggle("open");
});
drawer.querySelectorAll("[data-close]").forEach(link => {
    link.addEventListener("click", () => {
        burger.classList.remove("active");
        drawer.classList.remove("open");
    });
});

// ============================= //
// SCROLL REVEAL                  //
// ============================= //
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${(i % 4) * 0.08}s`;
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ============================= //
// CUSTOM CURSOR (desktop only)   //
// ============================= //
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
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

    const hoverTargets = "a, button, .tackle-card, .catch-card";
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(hoverTargets)) cursorRing.classList.add("hovering");
    });
    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(hoverTargets)) cursorRing.classList.remove("hovering");
    });
}

// ============================= //
// MAGNETIC BUTTONS (desktop only)//
// ============================= //
if (isFinePointer) {
    document.querySelectorAll(".magnetic").forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translate(0, 0)";
        });
    });
}

// ============================= //
// AURA PARALLAX (subtle, desktop)//
// ============================= //
if (isFinePointer) {
    const auras = document.querySelectorAll(".aura");
    window.addEventListener("mousemove", (e) => {
        const px = (e.clientX / window.innerWidth - 0.5);
        const py = (e.clientY / window.innerHeight - 0.5);
        auras.forEach((aura, i) => {
            const depth = (i + 1) * 8;
            aura.style.marginLeft = `${px * depth}px`;
            aura.style.marginTop = `${py * depth}px`;
        });
    });
}

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
            submitBtn.textContent = "Send";
            alert("Da ist etwas schiefgelaufen. Bitte versuch's gleich nochmal.");
        }
    });
}