/* Trisève — interactions */
(function () {
  "use strict";

  var header = document.querySelector(".header");
  var hero = document.querySelector(".hero");
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");

  /* ----- header state on scroll ----- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
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
      document.body.style.overflow = open ? "" : "hidden";
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        nav.classList.remove("is-open");
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

  /* ----- lazy-play videos when visible (battery & bandwidth) ----- */
  var videos = document.querySelectorAll("video[preload='none']");
  if ("IntersectionObserver" in window && videos.length) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (v.preload === "none") v.preload = "auto";
            v.play().catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    videos.forEach(function (v) { videoObserver.observe(v); });
  }

  /* ----- current year ----- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
