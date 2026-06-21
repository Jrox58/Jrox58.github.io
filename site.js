(function () {
  "use strict";

  const EMAILJS_PUBLIC_KEY = "_Mn3BDTpjsNhtYB8r";
  const EMAILJS_SERVICE_ID = "service_umbz4oj";
  const EMAILJS_TEMPLATE_ID = "template_f94vjif";

  function initFadeUp() {
    const items = document.querySelectorAll(".fade-up");
    if (!items.length || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach((el) => observer.observe(el));
  }

  function initCounters() {
    const counters = document.querySelectorAll(".counter[data-target]");
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      if (!Number.isFinite(target)) return;

      const duration = 1600;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target.toLocaleString("tr-TR");
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString("tr-TR");
        }
      }, 16);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function initLegacyMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");
    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      navLinks.classList.toggle("active");

      const icon = this.querySelector("i");
      if (!icon) return;

      icon.classList.toggle("fa-bars", !navLinks.classList.contains("active"));
      icon.classList.toggle("fa-xmark", navLinks.classList.contains("active"));
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("active")) return;
      if (mobileMenuBtn.contains(event.target) || navLinks.contains(event.target)) return;

      navLinks.classList.remove("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  }

  function initGalleryLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const galleryImgs = document.querySelectorAll(".gallery-item img");
    if (!lightbox || !lightboxImg || !galleryImgs.length) return;

    galleryImgs.forEach((img) => {
      img.addEventListener("click", function () {
        lightbox.style.display = "flex";
        lightboxImg.src = this.src;
      });
    });

    const closeBtn = document.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
      });
    }

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        lightbox.style.display = "none";
      }
    });
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form || typeof window.emailjs === "undefined") return;

    window.emailjs.init(EMAILJS_PUBLIC_KEY);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const btn = this.querySelector("button[type=submit]");
      if (!btn) return;

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Gönderiliyor...';

      const templateParams = {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          btn.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i>Mesaj Gönderildi!';
          btn.classList.remove("btn-danger");
          btn.classList.add("btn-success");
          form.reset();

          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = "Mesajı Gönder";
            btn.classList.remove("btn-success");
            btn.classList.add("btn-danger");
          }, 4000);
        })
        .catch((error) => {
          console.error("EmailJS Hatası:", error);
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-2"></i>Hata! Tekrar Deneyin';
          btn.classList.remove("btn-danger");
          btn.classList.add("btn-warning");

          setTimeout(() => {
            btn.innerHTML = "Mesajı Gönder";
            btn.classList.remove("btn-warning");
            btn.classList.add("btn-danger");
          }, 3000);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initFadeUp();
    initCounters();
    initLegacyMobileMenu();
    initGalleryLightbox();
    initContactForm();
  });
}());