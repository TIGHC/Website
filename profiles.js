(function () {
  var REPO = "TIGHC/Profiles";
  var BRANCH = "main";
  var DEV = (typeof window !== "undefined") ? window.TIGHC_DEV : undefined;
  var API_URL = DEV ? DEV.profilesApi : "https://api.github.com/repos/" + REPO + "/contents/";
  var RAW_BASE = DEV ? DEV.repos.profiles + "/" : "https://raw.githubusercontent.com/" + REPO + "/" + BRANCH + "/";

  var statusEl = (typeof document !== "undefined") ? document.getElementById("profile-status") : null;
  var gridEl = (typeof document !== "undefined") ? document.getElementById("profile-grid") : null;

  var KEY_LABELS = {
    mouse_left: "left click",
    mouse_right: "right click",
    mouse_middle: "middle click",
    scroll: "scroll wheel",
    ctrl: "Ctrl",
    shift: "Shift",
    space: "Space",
    tab: "Tab",
    left: "Left arrow",
    right: "Right arrow",
    up: "Up arrow",
    down: "Down arrow"
  };

  function keyLabel(key) {
    if (KEY_LABELS.hasOwnProperty(key)) return KEY_LABELS[key];
    if (/^[a-z]$/.test(key)) return key.toUpperCase();
    return key;
  }

  function keysLabel(keys) {
    if (!keys || !keys.length) return "";
    return keys.map(keyLabel).join(" / ");
  }

  function idLabel(id) {
    return String(id).replace(/_/g, " ");
  }

  function enabledBindings(bindings) {
    return (bindings || [])
      .filter(function (b) { return b.enabled !== false; })
      .map(function (b) {
        var keys = keysLabel(b.keys);
        return keys ? idLabel(b.id) + " (" + keys + ")" : idLabel(b.id);
      })
      .join(", ");
  }

  function renderCard(profile) {
    var data = profile.data;
    var article = document.createElement("article");
    article.className = "profile-card";

    var header = document.createElement("header");
    var h3 = document.createElement("h3");
    h3.textContent = (data && data.name) || profile.dirName;
    header.appendChild(h3);
    article.appendChild(header);

    var windowP = document.createElement("p");
    windowP.className = "profile-window";
    var windowTitles = (data && data.window_titles) || [];
    windowP.innerHTML = "Window match: " +
      (windowTitles.length
        ? windowTitles.map(function (t) { return "<code>" + escapeHtml(t) + "</code>"; }).join(", ")
        : "<em>unknown</em>");
    article.appendChild(windowP);

    if (data) {
      var bindings = enabledBindings(data.bindings);
      if (bindings) {
        var bindP = document.createElement("p");
        bindP.innerHTML = "<strong>Bindings:</strong> " + escapeHtml(bindings);
        article.appendChild(bindP);
      }
    } else {
      var errP = document.createElement("p");
      errP.className = "profile-error";
      errP.textContent = "Couldn't load this profile's profile.json.";
      article.appendChild(errP);
    }

    var linkP = document.createElement("p");
    linkP.className = "profile-source-link";
    var a = document.createElement("a");
    a.href = "https://github.com/" + REPO + "/tree/" + BRANCH + "/" + profile.dirName;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "View source";
    linkP.appendChild(a);
    article.appendChild(linkP);

    return article;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function compareProfiles(a, b) {
    var nameA = (a.data && a.data.name) || a.dirName;
    var nameB = (b.data && b.data.name) || b.dirName;
    return nameA.localeCompare(nameB);
  }

  function init() {
    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API returned " + res.status);
        return res.json();
      })
      .then(function (entries) {
        var dirs = entries.filter(function (e) { return e.type === "dir" && e.name !== "assets"; });
        if (!dirs.length) throw new Error("No profile folders found");

        return Promise.all(
          dirs.map(function (dir) {
            return fetch(RAW_BASE + dir.name + "/profile.json")
              .then(function (res) { return res.ok ? res.json() : null; })
              .catch(function () { return null; })
              .then(function (data) { return { dirName: dir.name, data: data }; });
          })
        );
      })
      .then(function (profiles) {
        profiles.sort(compareProfiles);

        profiles.forEach(function (profile) {
          gridEl.appendChild(renderCard(profile));
        });

        statusEl.textContent = profiles.length + " profile" + (profiles.length === 1 ? "" : "s") + " loaded from TIGHC Profiles.";
      })
      .catch(function (err) {
        statusEl.innerHTML = "Couldn't load profiles from GitHub right now (" +
          escapeHtml(err.message) + "). Browse them directly on " +
          "<a href=\"https://github.com/" + REPO + "\" target=\"_blank\" rel=\"noopener\">GitHub</a> instead.";
      });
  }

  if (typeof document !== "undefined") {
    init();
  }

  // Exposed for unit tests (node:test) — pure formatting/filtering/sorting
  // logic only, no DOM/network code is exported or invoked here.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      keyLabel: keyLabel,
      keysLabel: keysLabel,
      idLabel: idLabel,
      enabledBindings: enabledBindings,
      compareProfiles: compareProfiles,
      escapeHtml: escapeHtml
    };
  }
})();
