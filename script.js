/* =========================================================
   JAX Shine Auto Detailing - JavaScript
   Each section below does one small job.
   ========================================================= */

/* ---------- 1. Mobile menu (the 3-line button on phones) ---------- */
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after tapping a link
siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 2. Pricing: change prices by vehicle size ---------- */
// 1 = normal price, 1.2 = 20% more, 1.35 = 35% more
const sizeMultiplier = { sedan: 1, suv: 1.2, truck: 1.35 };

const sizeButtons = document.querySelectorAll(".size-btn");
const priceNumbers = document.querySelectorAll("[data-price-base]");

function updatePrices(size) {
  priceNumbers.forEach((el) => {
    const base = Number(el.dataset.priceBase);
    // Math.round makes it a clean number, then we round to the nearest $5
    const price = Math.round((base * sizeMultiplier[size]) / 5) * 5;
    // Keep the original price for the first option so it matches the base exactly
    el.textContent = size === "sedan" ? base : price;
  });

  sizeButtons.forEach((btn) => {
    const active = btn.dataset.size === size;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => updatePrices(btn.dataset.size));
});

/* ---------- 3. "Choose this plan" buttons fill in the quote form ---------- */
document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("service").value = link.dataset.plan;
  });
});

/* ---------- 4. Gallery photo viewer (lightbox) ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
let lastFocused = null; // remember what was clicked so we can return to it

function openLightbox(button) {
  lastFocused = button;
  lightboxImg.src = button.dataset.full;
  lightboxImg.alt = button.querySelector("img").alt;
  lightboxCaption.textContent = button.dataset.caption;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden"; // stop the page scrolling behind it
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".gallery-item").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

lightboxClose.addEventListener("click", closeLightbox);

// Click the dark background to close
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

// Press Escape to close
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

/* ---------- 5. Quote form: check the fields ---------- */
const form = document.getElementById("quoteForm");
const statusBox = document.getElementById("formStatus");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const serviceInput = document.getElementById("service");

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(inputId + "-error");
  error.textContent = message;
  input.closest(".field").classList.toggle("has-error", message !== "");
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  if (message) input.setAttribute("aria-describedby", inputId + "-error");
}

function validateForm() {
  let valid = true;
  let firstBad = null;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const service = serviceInput.value;

  if (name.length < 2) {
    showError("name", "Please enter your name.");
    valid = false;
    firstBad = firstBad || nameInput;
  } else showError("name", "");

  // A simple email check: something@something.something
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Please enter a valid email, like name@example.com.");
    valid = false;
    firstBad = firstBad || emailInput;
  } else showError("email", "");

  if (service === "") {
    showError("service", "Please choose a service.");
    valid = false;
    firstBad = firstBad || serviceInput;
  } else showError("service", "");

  if (firstBad) firstBad.focus();
  return valid;
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  statusBox.textContent = "";
  statusBox.classList.remove("success");

  if (!validateForm()) return;

  /* DEMO MODE: nothing is sent anywhere.
     On a real client site, this is where you would send the form to a free
     service (for example Formspree or Web3Forms) so the owner gets an email. */
  statusBox.textContent = "Thank you! This is a demo, so your request was not actually sent.";
  statusBox.classList.add("success");
  form.reset();
});

/* ---------- 6. Footer year (updates by itself every year) ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 7. Fade-in effect when sections scroll into view ---------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const items = document.querySelectorAll(".card, .price-card, .gallery li, .stats li");
  items.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}
