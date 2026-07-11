/* Trisève — interactions */
(function () {
  "use strict";

  var header = document.querySelector(".header");
  var hero = document.querySelector(".hero");
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");

  /* ----- header state on scroll ----- */
  function onScroll() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle("is-scrolled", scrolled);
    document.documentElement.classList.toggle("abar-hidden", scrolled);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* keep header light-on-dark only while the hero is in view */
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(
      function (entries) {
        header.classList.toggle("header--over-dark", entries[0].isIntersecting);
      },
      { rootMargin: "-60px 0px 0px 0px" }
    ).observe(hero);
  }

  /* ----- mobile nav ----- */
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
      header.classList.toggle("nav-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        nav.classList.remove("is-open");
        header.classList.remove("nav-open");
        document.body.style.overflow = "";
      }
    });
  }

  /* ----- reveal on scroll ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- ingredient accordion ----- */
  document.querySelectorAll(".ing").forEach(function (item) {
    var head = item.querySelector(".ing__head");
    head.addEventListener("click", function () {
      var open = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!open));
      head.setAttribute("aria-expanded", String(!open));
    });
  });

  /* ----- video motion: respect reduced-motion, lazy-play, click to pause ----- */
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var allVideos = document.querySelectorAll("video");

  if (reducedMotion) {
    allVideos.forEach(function (v) {
      v.removeAttribute("autoplay");
      v.pause();
    });
  }

  var lazyVideos = document.querySelectorAll("video[preload='none']");
  if (!reducedMotion && "IntersectionObserver" in window && lazyVideos.length) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (v.preload === "none") v.preload = "auto";
            if (!v.dataset.userPaused) v.play().catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    lazyVideos.forEach(function (v) { videoObserver.observe(v); });
  }

  /* any video can be paused/resumed with a click or a keypress */
  allVideos.forEach(function (v) {
    v.addEventListener("click", function () {
      if (v.paused) {
        delete v.dataset.userPaused;
        v.play().catch(function () {});
      } else {
        v.dataset.userPaused = "1";
        v.pause();
      }
    });
  });

  /* ----- current year ----- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
