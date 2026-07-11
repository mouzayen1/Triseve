/* TRISÈVE — site behaviours */
(function () {
  "use strict";

  var BRAND_EMAIL = "drpepperandhookah@gmail.com"; /* TODO(launch): swap to brand mailbox */

  /* ----- mobile nav ----- */
  var navbtn = document.querySelector(".navbtn");
  var nav = document.getElementById("nav");
  if (navbtn && nav) {
    navbtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navbtn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        navbtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----- reveal on scroll ----- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- email links ----- */
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.href = "mailto:" + BRAND_EMAIL;
    if (!a.textContent.trim()) a.textContent = BRAND_EMAIL;
  });

  /* ----- capture forms → mail compose (no backend yet) ----- */
  var SUBJECTS = {
    "newsletter": "Join the list — Trisève",
    "reserve-333": "Reserve — La Crème Essentielle N° 333",
    "waitlist-eclat": "Waitlist — La Crème Éclat",
    "waitlist-calme": "Waitlist — La Crème Calme"
  };
  document.querySelectorAll("form[data-capture]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type=email]");
      var msg = form.parentElement.querySelector(".capture__msg");
      var email = (input.value || "").trim();
      if (!email || email.indexOf("@") < 1) {
        if (msg) msg.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }
      var list = form.getAttribute("data-list") || "newsletter";
      var subject = SUBJECTS[list] || SUBJECTS.newsletter;
      var body = "Please add me to the list.\n\nEmail: " + email + "\nList: " + list;
      window.location.href = "mailto:" + BRAND_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      if (msg) msg.textContent = "Your mail app is opening — press send and you're on the list.";
    });
  });

  /* ----- PDP gallery ----- */
  var gmain = document.getElementById("g-main");
  if (gmain) {
    document.querySelectorAll(".gallery__thumbs button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".gallery__thumbs button").forEach(function (b) { b.removeAttribute("aria-current"); });
        btn.setAttribute("aria-current", "true");
        var type = btn.getAttribute("data-type");
        var src = btn.getAttribute("data-src");
        var poster = btn.getAttribute("data-poster") || "";
        var alt = btn.getAttribute("aria-label") || "";
        if (type === "video") {
          gmain.innerHTML = '<video muted loop playsinline autoplay poster="' + poster + '" aria-label="' + alt + '"><source src="' + src + '" type="video/mp4"></video>';
          var v = gmain.querySelector("video");
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.removeAttribute("autoplay");
          else v.play().catch(function () {});
        } else if (type === "jar") {
          gmain.innerHTML = '<img class="g-jar" src="' + src + '" alt="' + alt + '">';
        } else {
          gmain.innerHTML = '<img src="' + src + '" alt="' + alt + '">';
        }
      });
    });
  }

  /* ----- lazy-play below-fold videos; respect reduced motion ----- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vids = document.querySelectorAll("video");
  if (reduced) {
    vids.forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
  } else if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { v.play().catch(function () {}); } else { v.pause(); }
      });
    }, { rootMargin: "160px 0px" });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* click any video to pause/resume */
  vids.forEach(function (v) {
    v.addEventListener("click", function () {
      if (v.paused) v.play().catch(function () {}); else v.pause();
    });
  });

  /* ----- year ----- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
