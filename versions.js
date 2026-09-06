(function () {
  var REPOS = {
    engine:   "TIGHC/Engine",
    profiles: "TIGHC/Profiles",
    website:  "TIGHC/Website"
  };
  var DEV = (typeof window !== "undefined") ? window.TIGHC_DEV : undefined;

  function fetchVersion(key) {
    var url = DEV
      ? DEV.repos[key] + "/VERSION.md"
      : "https://raw.githubusercontent.com/" + REPOS[key] + "/main/VERSION.md";
    return fetch(url)
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (t) { return t ? t.trim() : null; })
      .catch(function () { return null; });
  }

  function versionText(prefix, ver) {
    return (prefix || "") + "v" + ver;
  }

  if (typeof document !== "undefined") {
    Promise.all([fetchVersion("engine"), fetchVersion("profiles"), fetchVersion("website")])
      .then(function (vers) {
        var map = { engine: vers[0], profiles: vers[1], website: vers[2] };
        window.TIGHC_VERSIONS = map;

        // Elements with data-version="key" → "prefix + v + version"
        document.querySelectorAll("[data-version]").forEach(function (el) {
          var ver = map[el.dataset.version];
          if (!ver) return;
          el.textContent = versionText(el.dataset.versionPrefix, ver);
        });

        // Inline version spans inside tab buttons (changelogs page)
        document.querySelectorAll("[data-version-inline]").forEach(function (el) {
          var ver = map[el.dataset.versionInline];
          if (ver) el.textContent = " v" + ver;
        });

        document.dispatchEvent(new CustomEvent("tighc-versions", { detail: map }));
      });
  }

  // Exposed for unit tests (node:test) — pure fetch/format helpers only,
  // no DOM code is exported or invoked here. Tests mock global.fetch.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      fetchVersion: fetchVersion,
      versionText: versionText,
      REPOS: REPOS
    };
  }
})();
