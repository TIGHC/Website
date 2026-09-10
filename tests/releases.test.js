"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  escapeHtml,
  formatBody,
  parseAsset,
  assetLabel,
  compareAssets,
  formatDate,
} = require("../releases.js");

test("escapeHtml", async (t) => {
  await t.test("escapes the HTML-significant characters", () => {
    assert.equal(escapeHtml("<script>&\"'</script>"), "&lt;script&gt;&amp;\"'&lt;/script&gt;");
  });

  await t.test("coerces non-string input", () => {
    assert.equal(escapeHtml(42), "42");
  });
});

test("formatBody", async (t) => {
  await t.test("returns empty string for empty/missing body", () => {
    assert.equal(formatBody(""), "");
    assert.equal(formatBody(undefined), "");
    assert.equal(formatBody("   \n  "), "");
  });

  await t.test("renders bold markup", () => {
    assert.equal(formatBody("**Full Changelog**"), "<p><strong>Full Changelog</strong></p>");
  });

  await t.test("autolinks a bare URL from generate_release_notes-style bodies", () => {
    const html = formatBody("**Full Changelog**: https://github.com/TIGHC/Engine/compare/v4.0.0...v4.0.1");
    assert.match(html, /<strong>Full Changelog<\/strong>/);
    assert.match(
      html,
      /<a href="https:\/\/github\.com\/TIGHC\/Engine\/compare\/v4\.0\.0\.\.\.v4\.0\.1" target="_blank" rel="noopener">https:\/\/github\.com\/TIGHC\/Engine\/compare\/v4\.0\.0\.\.\.v4\.0\.1<\/a>/
    );
  });

  await t.test("renders markdown links without double-linking the URL", () => {
    const html = formatBody("See [the docs](https://example.com/x) for details.");
    assert.equal(
      html,
      "<p>See <a href=\"https://example.com/x\" target=\"_blank\" rel=\"noopener\">the docs</a> for details.</p>"
    );
  });

  await t.test("escapes malicious content before formatting", () => {
    const html = formatBody("<img src=x onerror=alert(1)>");
    assert.doesNotMatch(html, /<img/);
    assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  });

  await t.test("splits paragraphs on blank lines and keeps single newlines as <br>", () => {
    const html = formatBody("first para\nstill first\n\nsecond para");
    assert.equal(html, "<p>first para<br>still first</p><p>second para</p>");
  });
});

test("parseAsset", async (t) => {
  await t.test("parses the current (post-v5.0.0) naming scheme", () => {
    assert.deepEqual(parseAsset("TIGHC-windows-v5.0.0.exe"), { platform: "windows", target: "" });
    assert.deepEqual(parseAsset("TIGHC-linux-v5.0.0"), { platform: "linux", target: "" });
    assert.deepEqual(parseAsset("TIGHC-macos-v5.0.0"), { platform: "macos", target: "" });
  });

  await t.test("parses the legacy gui/cli naming scheme", () => {
    assert.deepEqual(parseAsset("TIGHC-gui-windows-v4.0.1.exe"), { platform: "windows", target: "gui" });
    assert.deepEqual(parseAsset("TIGHC-cli-linux-v4.0.1"), { platform: "linux", target: "cli" });
  });

  await t.test("returns a null platform for unrecognized asset names", () => {
    assert.deepEqual(parseAsset("source-code.zip"), { platform: null, target: "" });
  });
});

test("assetLabel", async (t) => {
  await t.test("labels current-scheme assets by platform only", () => {
    assert.equal(assetLabel("TIGHC-windows-v5.0.0.exe"), "Windows");
    assert.equal(assetLabel("TIGHC-macos-v5.0.0"), "macOS");
  });

  await t.test("labels legacy assets with their gui/cli target", () => {
    assert.equal(assetLabel("TIGHC-gui-windows-v4.0.1.exe"), "Windows (GUI)");
    assert.equal(assetLabel("TIGHC-cli-linux-v4.0.1"), "Linux (CLI)");
  });

  await t.test("falls back to the raw filename for unrecognized assets", () => {
    assert.equal(assetLabel("source-code.zip"), "source-code.zip");
  });
});

test("compareAssets", async (t) => {
  await t.test("orders recognized platforms windows, linux, macos", () => {
    const assets = [{ name: "TIGHC-macos-v5.0.0" }, { name: "TIGHC-windows-v5.0.0.exe" }, { name: "TIGHC-linux-v5.0.0" }];
    const sorted = assets.slice().sort(compareAssets).map((a) => a.name);
    assert.deepEqual(sorted, ["TIGHC-windows-v5.0.0.exe", "TIGHC-linux-v5.0.0", "TIGHC-macos-v5.0.0"]);
  });

  await t.test("orders legacy gui before cli within the same platform", () => {
    const assets = [{ name: "TIGHC-cli-windows-v4.0.1.exe" }, { name: "TIGHC-gui-windows-v4.0.1.exe" }];
    const sorted = assets.slice().sort(compareAssets).map((a) => a.name);
    assert.deepEqual(sorted, ["TIGHC-gui-windows-v4.0.1.exe", "TIGHC-cli-windows-v4.0.1.exe"]);
  });

  await t.test("places unrecognized assets after recognized ones", () => {
    const assets = [{ name: "source-code.zip" }, { name: "TIGHC-linux-v5.0.0" }];
    const sorted = assets.slice().sort(compareAssets).map((a) => a.name);
    assert.deepEqual(sorted, ["TIGHC-linux-v5.0.0", "source-code.zip"]);
  });
});

test("formatDate", async (t) => {
  await t.test("formats an ISO date string", () => {
    assert.equal(formatDate("2026-09-10T00:00:00Z"), new Date("2026-09-10T00:00:00Z").toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }));
  });

  await t.test("returns empty string for missing/invalid input", () => {
    assert.equal(formatDate(""), "");
    assert.equal(formatDate(undefined), "");
    assert.equal(formatDate("not-a-date"), "");
  });
});
