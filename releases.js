(function () {
  var REPO = "TIGHC/Engine";
  var API_URL = "https://api.github.com/repos/" + REPO + "/releases";

  var PLATFORM_LABELS = { windows: "Windows", linux: "Linux", macos: "macOS" };
  var PLATFORM_ORDER = ["windows", "linux", "macos"];
  var TARGET_ORDER = { gui: 0, "": 1, cli: 2 };

  var statusEl = (typeof document !== "undefined") ? document.getElementById("releases-status") : null;
  var listEl = (typeof document !== "undefined") ? document.getElementById("releases-list") : null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Release bodies are short and GitHub-generated (bold text, markdown
  // links, occasional bare URLs from "generate_release_notes") - not full
  // CHANGELOG.md markdown, so this stays much simpler than changelogs.js's
  // parseChangelog.
  function formatBody(text) {
    var escaped = escapeHtml(text || "").trim();
    if (!escaped) return "";
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      "<a href=\"$2\" target=\"_blank\" rel=\"noopener\">$1</a>");
    // Autolink any bare URL not already inside an href="..." we just built.
    escaped = escaped.replace(/(^|[^"])(https?:\/\/[^\s<]+)/g, function (m, pre, url) {
      return pre + "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\">" + url + "</a>";
    });
    return escaped.split(/\n{2,}/).map(function (para) {
      return "<p>" + para.replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }

  // Matches both the current asset naming (TIGHC-<platform>-vX.Y.Z[.exe])
  // and the pre-v5.0.0 naming that included a gui/cli target segment
  // (TIGHC-gui-windows-vX.Y.Z.exe / TIGHC-cli-linux-vX.Y.Z), so old releases
  // still render sensible labels.
  function parseAsset(name) {
    var m = /^TIGHC-(?:(gui|cli)-)?(windows|linux|macos)-v[\d.]+(?:\.exe)?$/.exec(name);
    if (!m) return { platform: null, target: "" };
    return { target: m[1] || "", platform: m[2] };
  }

  function assetLabel(name) {
    var parsed = parseAsset(name);
    if (!parsed.platform) return name;
    var label = PLATFORM_LABELS[parsed.platform] || parsed.platform;
    if (parsed.target === "gui") label += " (GUI)";
    else if (parsed.target === "cli") label += " (CLI)";
    return label;
  }

  function compareAssets(a, b) {
    var pa = parseAsset(a.name), pb = parseAsset(b.name);
    var oa = pa.platform ? PLATFORM_ORDER.indexOf(pa.platform) : PLATFORM_ORDER.length;
    var ob = pb.platform ? PLATFORM_ORDER.indexOf(pb.platform) : PLATFORM_ORDER.length;
    if (oa !== ob) return oa - ob;
    return (TARGET_ORDER[pa.target] || 0) - (TARGET_ORDER[pb.target] || 0);
  }

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function renderRelease(rel) {
    var article = document.createElement("article");
    article.className = "card release-card";

    var header = document.createElement("header");
    header.className = "release-header";

    var h2 = document.createElement("h2");
    h2.className = "release-version";
    h2.textContent = rel.tag_name || rel.name || "Untitled release";
    header.appendChild(h2);

    var date = document.createElement("span");
    date.className = "release-date";
    date.textContent = formatDate(rel.published_at);
    header.appendChild(date);

    if (rel.prerelease) {
      var pre = document.createElement("span");
      pre.className = "badge release-badge-pre";
      pre.textContent = "Pre-release";
      header.appendChild(pre);
    }

    article.appendChild(header);

    var body = document.createElement("div");
    body.className = "release-body";
    var bodyHtml = formatBody(rel.body);
    body.innerHTML = bodyHtml || "<p>No release notes.</p>";
    article.appendChild(body);

    var assets = (rel.assets || []).slice().sort(compareAssets);
    if (assets.length) {
      var assetsDiv = document.createElement("div");
      assetsDiv.className = "release-assets";
      assets.forEach(function (asset) {
        var a = document.createElement("a");
        a.className = "btn btn-ghost release-asset";
        a.href = asset.browser_download_url;
        a.textContent = assetLabel(asset.name);
        assetsDiv.appendChild(a);
      });
      article.appendChild(assetsDiv);
    }

    var linkP = document.createElement("p");
    linkP.className = "release-source-link";
    var link = document.createElement("a");
    link.href = rel.html_url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "View on GitHub";
    linkP.appendChild(link);
    article.appendChild(linkP);

    return article;
  }

  function init() {
    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API returned " + res.status);
        return res.json();
      })
      .then(function (releases) {
        var published = (releases || []).filter(function (r) { return !r.draft; });
        if (!published.length) throw new Error("No releases found");

        published.forEach(function (rel) {
          listEl.appendChild(renderRelease(rel));
        });

        statusEl.textContent = published.length + " release" + (published.length === 1 ? "" : "s") +
          " loaded from " + REPO + ".";
      })
      .catch(function (err) {
        statusEl.className = "release-status release-error";
        statusEl.innerHTML = "Couldn't load releases from GitHub right now (" +
          escapeHtml(err.message) + "). Browse them directly on " +
          "<a href=\"https://github.com/" + REPO + "/releases\" target=\"_blank\" rel=\"noopener\">GitHub</a> instead.";
      });
  }

  if (typeof document !== "undefined" && listEl && statusEl) {
    init();
  }

  // Exposed for unit tests (node:test) — pure parsing/formatting/sorting
  // logic only, no DOM/network code is exported or invoked here.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      escapeHtml: escapeHtml,
      formatBody: formatBody,
      parseAsset: parseAsset,
      assetLabel: assetLabel,
      compareAssets: compareAssets,
      formatDate: formatDate
    };
  }
})();
