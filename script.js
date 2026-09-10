(function () {
  // Age gate
  var gate = document.getElementById("age-gate");
  var confirmBtn = document.getElementById("age-confirm");

  var confirmed = false;
  try {
    confirmed = localStorage.getItem("tighc-age-confirmed") === "1";
  } catch (e) { /* localStorage unavailable */ }

  if (confirmed) gate.hidden = true;

  confirmBtn.addEventListener("click", function () {
    try { localStorage.setItem("tighc-age-confirmed", "1"); } catch (e) {}
    gate.hidden = true;
  });

  // Mobile nav toggle
  var toggle = document.getElementById("nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.classList.toggle("open", open);
    });

    // Close nav when a link inside it is clicked
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.classList.remove("open");
      }
    });

    // Close nav on outside click
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.classList.remove("open");
      }
    });
  }

  // Theme toggle - the <head> inline script (see every page's <head>)
  // already applied any stored explicit choice before first paint; this
  // just handles the click, flipping between "light" and "dark" and
  // persisting the choice. With nothing stored, style.css's
  // prefers-color-scheme media query is what's actually in effect, so the
  // "current" theme is read from that rather than assumed.
  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("tighc-theme", next); } catch (e) {}
    });
  }
})();
