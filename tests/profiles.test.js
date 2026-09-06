"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  keyLabel,
  keysLabel,
  idLabel,
  enabledBindings,
  compareProfiles,
  escapeHtml,
} = require("../profiles.js");

test("keyLabel", async (t) => {
  await t.test("maps known special keys to friendly labels", () => {
    assert.equal(keyLabel("mouse_left"), "left click");
    assert.equal(keyLabel("ctrl"), "Ctrl");
    assert.equal(keyLabel("up"), "Up arrow");
  });

  await t.test("uppercases a bare single letter", () => {
    assert.equal(keyLabel("a"), "A");
    assert.equal(keyLabel("z"), "Z");
  });

  await t.test("passes through unknown multi-character keys unchanged", () => {
    assert.equal(keyLabel("f5"), "f5");
    assert.equal(keyLabel("numpad_1"), "numpad_1");
  });
});

test("keysLabel", async (t) => {
  await t.test("joins multiple keys with a slash", () => {
    assert.equal(keysLabel(["ctrl", "a"]), "Ctrl / A");
  });

  await t.test("returns empty string for missing or empty input", () => {
    assert.equal(keysLabel(undefined), "");
    assert.equal(keysLabel(null), "");
    assert.equal(keysLabel([]), "");
  });
});

test("idLabel", async (t) => {
  await t.test("replaces underscores with spaces", () => {
    assert.equal(idLabel("quick_save"), "quick save");
  });

  await t.test("coerces non-string ids", () => {
    assert.equal(idLabel(123), "123");
  });
});

test("enabledBindings", async (t) => {
  await t.test("filters out explicitly disabled bindings", () => {
    const bindings = [
      { id: "quick_save", enabled: true, keys: ["ctrl", "s"] },
      { id: "quick_load", enabled: false, keys: ["ctrl", "l"] },
    ];
    assert.equal(enabledBindings(bindings), "quick save (Ctrl / S)");
  });

  await t.test("treats a missing enabled field as enabled", () => {
    const bindings = [{ id: "jump", keys: ["space"] }];
    assert.equal(enabledBindings(bindings), "jump (Space)");
  });

  await t.test("omits the keys parenthetical when keys are missing", () => {
    const bindings = [{ id: "vibrate" }];
    assert.equal(enabledBindings(bindings), "vibrate");
  });

  await t.test("returns empty string for missing/empty bindings array", () => {
    assert.equal(enabledBindings(undefined), "");
    assert.equal(enabledBindings([]), "");
  });

  await t.test("joins multiple bindings with commas", () => {
    const bindings = [
      { id: "a", keys: ["a"] },
      { id: "b", keys: ["b"] },
    ];
    assert.equal(enabledBindings(bindings), "a (A), b (B)");
  });
});

test("compareProfiles", async (t) => {
  await t.test("sorts by profile.json name when present", () => {
    const a = { dirName: "zzz", data: { name: "Apple" } };
    const b = { dirName: "aaa", data: { name: "Banana" } };
    assert.ok(compareProfiles(a, b) < 0);
  });

  await t.test("falls back to dirName when data or name is missing", () => {
    const a = { dirName: "alpha", data: null };
    const b = { dirName: "beta", data: {} };
    assert.ok(compareProfiles(a, b) < 0);
  });

  await t.test("is usable directly with Array#sort for a mixed list", () => {
    const profiles = [
      { dirName: "zzz-dir", data: { name: "Zebra" } },
      { dirName: "aaa-dir", data: null },
      { dirName: "mmm-dir", data: { name: "Mango" } },
    ];
    profiles.sort(compareProfiles);
    assert.deepEqual(
      profiles.map((p) => (p.data && p.data.name) || p.dirName),
      ["aaa-dir", "Mango", "Zebra"]
    );
  });
});

test("escapeHtml", async (t) => {
  await t.test("escapes HTML-significant characters in window titles", () => {
    assert.equal(escapeHtml("<Notepad> & \"friends\""), "&lt;Notepad&gt; &amp; \"friends\"");
  });

  await t.test("leaves ordinary text alone", () => {
    assert.equal(escapeHtml("Half-Life 2"), "Half-Life 2");
  });
});
